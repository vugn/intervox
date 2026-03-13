'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/hooks/use-auth';
import { upsertUser } from '@/lib/data-service';
import { updateProfile, EmailAuthProvider, reauthenticateWithCredential, updatePassword } from 'firebase/auth';
import { auth, storage } from '@/lib/firebase';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { User, Save, ArrowLeft, Loader2, CheckCircle, UploadCloud, FileText } from 'lucide-react';
import * as motion from 'motion/react-client';
import { getDownloadURL, ref, uploadBytes } from 'firebase/storage';

export default function ProfilePage() {
    const { user, userData, loading } = useAuth();
    const router = useRouter();

    const [formData, setFormData] = useState({
        displayName: '',
        phone: '',
        university: '',
        major: '',
        graduationYear: '',
        targetIndustry: '',
        linkedinUrl: '',
        bio: '',
    });
    const [isSaving, setIsSaving] = useState(false);
    const [saved, setSaved] = useState(false);
    const [error, setError] = useState('');
    const [cvFile, setCvFile] = useState<File | null>(null);
    const [currentPassword, setCurrentPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');

    useEffect(() => {
        if (!loading && !user) router.push('/auth');
    }, [user, loading, router]);

    useEffect(() => {
        if (userData) {
            setFormData({
                displayName: userData.displayName || user?.displayName || '',
                phone: userData.phone || '',
                university: userData.university || '',
                major: userData.major || '',
                graduationYear: userData.graduationYear || '',
                targetIndustry: userData.targetIndustry || '',
                linkedinUrl: userData.linkedinUrl || '',
                bio: userData.bio || '',
            });
        }
    }, [userData, user]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!user) return;
        setError('');
        setIsSaving(true);

        try {
            let cvPath: string | undefined;
            if (cvFile) {
                const cvRef = ref(storage, `cv/${user.uid}/${Date.now()}_${cvFile.name.replace(/[^a-zA-Z0-9._-]/g, '_')}`);
                const uploadResult = await uploadBytes(cvRef, cvFile);
                cvPath = await getDownloadURL(uploadResult.ref);
            }

            await upsertUser(user.uid, {
                displayName: formData.displayName,
                phone: formData.phone,
                university: formData.university,
                major: formData.major,
                graduationYear: formData.graduationYear,
                targetIndustry: formData.targetIndustry,
                linkedinUrl: formData.linkedinUrl,
                bio: formData.bio,
                ...(cvPath ? { cvPath } : {}),
                updatedAt: new Date().toISOString(),
            });

            // Update Firebase Auth display name
            if (auth.currentUser && formData.displayName !== user.displayName) {
                await updateProfile(auth.currentUser, { displayName: formData.displayName });
            }

            if (currentPassword || newPassword || confirmPassword) {
                if (!currentPassword || !newPassword || !confirmPassword) {
                    throw new Error('Semua field password harus diisi untuk update password.');
                }
                if (newPassword !== confirmPassword) {
                    throw new Error('Konfirmasi password tidak cocok.');
                }
                if (newPassword.length < 6) {
                    throw new Error('Password baru minimal 6 karakter.');
                }
                if (!auth.currentUser?.email) {
                    throw new Error('User email tidak ditemukan untuk re-autentikasi.');
                }

                const credential = EmailAuthProvider.credential(auth.currentUser.email, currentPassword);
                await reauthenticateWithCredential(auth.currentUser, credential);
                await updatePassword(auth.currentUser, newPassword);
                setCurrentPassword('');
                setNewPassword('');
                setConfirmPassword('');
            }

            setSaved(true);
            setTimeout(() => setSaved(false), 3000);
        } catch (err) {
            console.error('Error updating profile:', err);
            setError('Gagal menyimpan profil. Coba lagi.');
        } finally {
            setIsSaving(false);
        }
    };

    if (loading) {
        return (
            <div className="flex-1 flex items-center justify-center">
                <div className="w-10 h-10 border-4 border-indigo-200 border-t-indigo-600 rounded-full animate-spin" />
            </div>
        );
    }

    const inputClass = "w-full px-4 py-3 rounded-xl border border-slate-300 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-colors text-sm";

    return (
        <div className="container mx-auto px-4 py-8 md:py-12 max-w-2xl">
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}>

                <div className="mb-6">
                    <Link href="/dashboard" className="inline-flex items-center text-sm text-slate-500 hover:text-slate-900 transition-colors mb-2">
                        <ArrowLeft className="w-4 h-4 mr-1" />
                        Kembali ke Dashboard
                    </Link>
                    <h1 className="text-2xl md:text-3xl font-display font-bold text-slate-900">Edit Profil</h1>
                    <p className="text-slate-500 mt-1 text-sm">Lengkapi profilmu agar AI dapat memberikan feedback yang lebih personal.</p>
                </div>

                {/* Avatar Section */}
                <div className="flex items-center gap-4 p-5 bg-white rounded-2xl border border-slate-200 mb-6">
                    {user?.photoURL ? (
                        <img src={user.photoURL} alt="Avatar" className="w-16 h-16 rounded-full object-cover" />
                    ) : (
                        <div className="w-16 h-16 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-600 font-bold text-2xl flex-shrink-0">
                            {(formData.displayName || user?.email || 'U').charAt(0).toUpperCase()}
                        </div>
                    )}
                    <div>
                        <p className="font-semibold text-slate-900">{formData.displayName || 'Pengguna'}</p>
                        <p className="text-sm text-slate-500">{user?.email}</p>
                    </div>
                </div>

                <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
                    <form onSubmit={handleSubmit} className="p-6 md:p-8 space-y-6">

                        {error && (
                            <div className="p-3 bg-red-50 border border-red-200 rounded-xl text-sm text-red-700">{error}</div>
                        )}
                        {saved && (
                            <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl text-sm text-emerald-700 flex items-center gap-2">
                                <CheckCircle className="w-4 h-4" /> Profil berhasil disimpan!
                            </div>
                        )}

                        {/* Personal Info */}
                        <section>
                            <h2 className="text-sm font-bold text-slate-500 uppercase tracking-wider mb-4 flex items-center gap-2">
                                <User className="w-4 h-4" /> Informasi Pribadi
                            </h2>
                            <div className="grid sm:grid-cols-2 gap-4">
                                <div className="space-y-1.5 sm:col-span-2">
                                    <label className="block text-sm font-medium text-slate-700">Nama Lengkap <span className="text-red-500">*</span></label>
                                    <input type="text" required value={formData.displayName} onChange={e => setFormData({ ...formData, displayName: e.target.value })} className={inputClass} placeholder="Nama lengkap kamu" />
                                </div>
                                <div className="space-y-1.5">
                                    <label className="block text-sm font-medium text-slate-700">Nomor Telepon</label>
                                    <input type="tel" value={formData.phone} onChange={e => setFormData({ ...formData, phone: e.target.value })} className={inputClass} placeholder="08xx-xxxx-xxxx" />
                                </div>
                                <div className="space-y-1.5">
                                    <label className="block text-sm font-medium text-slate-700">LinkedIn URL</label>
                                    <input type="url" value={formData.linkedinUrl} onChange={e => setFormData({ ...formData, linkedinUrl: e.target.value })} className={inputClass} placeholder="https://linkedin.com/in/..." />
                                </div>
                            </div>
                        </section>

                        <hr className="border-slate-100" />

                        {/* Education */}
                        <section>
                            <h2 className="text-sm font-bold text-slate-500 uppercase tracking-wider mb-4">Pendidikan</h2>
                            <div className="grid sm:grid-cols-2 gap-4">
                                <div className="space-y-1.5 sm:col-span-2">
                                    <label className="block text-sm font-medium text-slate-700">Universitas / Institusi</label>
                                    <input type="text" value={formData.university} onChange={e => setFormData({ ...formData, university: e.target.value })} className={inputClass} placeholder="misal: Universitas Indonesia" />
                                </div>
                                <div className="space-y-1.5">
                                    <label className="block text-sm font-medium text-slate-700">Jurusan / Program Studi</label>
                                    <input type="text" value={formData.major} onChange={e => setFormData({ ...formData, major: e.target.value })} className={inputClass} placeholder="misal: Teknik Informatika" />
                                </div>
                                <div className="space-y-1.5">
                                    <label className="block text-sm font-medium text-slate-700">Tahun Lulus (Perkiraan)</label>
                                    <select value={formData.graduationYear} onChange={e => setFormData({ ...formData, graduationYear: e.target.value })} className={`${inputClass} bg-white`}>
                                        <option value="">Pilih tahun</option>
                                        {Array.from({ length: 8 }, (_, i) => new Date().getFullYear() - 2 + i).map(y => (
                                            <option key={y} value={String(y)}>{y}</option>
                                        ))}
                                    </select>
                                </div>
                            </div>
                        </section>

                        <hr className="border-slate-100" />

                        {/* Career Goals */}
                        <section>
                            <h2 className="text-sm font-bold text-slate-500 uppercase tracking-wider mb-4">Target Karier</h2>
                            <div className="space-y-4">
                                <div className="space-y-1.5">
                                    <label className="block text-sm font-medium text-slate-700">Industri yang Diminati</label>
                                    <select value={formData.targetIndustry} onChange={e => setFormData({ ...formData, targetIndustry: e.target.value })} className={`${inputClass} bg-white`}>
                                        <option value="">Pilih industri</option>
                                        <option value="Teknologi / IT">Teknologi / IT</option>
                                        <option value="Keuangan / Perbankan">Keuangan / Perbankan</option>
                                        <option value="Konsultan">Konsultan</option>
                                        <option value="E-commerce">E-commerce</option>
                                        <option value="Startup">Startup</option>
                                        <option value="BUMN">BUMN</option>
                                        <option value="Manufaktur">Manufaktur</option>
                                        <option value="Pendidikan">Pendidikan</option>
                                        <option value="Kesehatan">Kesehatan</option>
                                        <option value="Lainnya">Lainnya</option>
                                    </select>
                                </div>
                                <div className="space-y-1.5">
                                    <label className="block text-sm font-medium text-slate-700">Bio / Ringkasan Diri</label>
                                    <textarea value={formData.bio} onChange={e => setFormData({ ...formData, bio: e.target.value })} rows={3} className={`${inputClass} resize-none`} placeholder="Ceritakan sedikit tentang dirimu, pengalaman, dan tujuan kariermu..." />
                                </div>
                                <div className="space-y-1.5">
                                    <label className="block text-sm font-medium text-slate-700">Upload CV (PDF/DOCX)</label>
                                    <label className="border-2 border-dashed border-slate-300 rounded-xl p-4 flex items-center gap-3 cursor-pointer hover:bg-slate-50">
                                        <UploadCloud className="w-5 h-5 text-slate-400" />
                                        <span className="text-sm text-slate-600">{cvFile ? cvFile.name : 'Pilih file CV terbaru'}</span>
                                        <input
                                            type="file"
                                            accept=".pdf,.docx"
                                            className="hidden"
                                            onChange={(e) => setCvFile(e.target.files?.[0] || null)}
                                        />
                                    </label>
                                    {cvFile && (
                                        <p className="text-xs text-indigo-600 flex items-center gap-1"><FileText className="w-3.5 h-3.5" />CV siap diupload saat simpan</p>
                                    )}
                                </div>
                            </div>
                        </section>

                        <hr className="border-slate-100" />

                        <section>
                            <h2 className="text-sm font-bold text-slate-500 uppercase tracking-wider mb-4">Keamanan Akun (Update Password)</h2>
                            <div className="space-y-4">
                                <div className="space-y-1.5">
                                    <label className="block text-sm font-medium text-slate-700">Password Saat Ini</label>
                                    <input type="password" value={currentPassword} onChange={e => setCurrentPassword(e.target.value)} className={inputClass} placeholder="Masukkan password saat ini" />
                                </div>
                                <div className="grid sm:grid-cols-2 gap-4">
                                    <div className="space-y-1.5">
                                        <label className="block text-sm font-medium text-slate-700">Password Baru</label>
                                        <input type="password" value={newPassword} onChange={e => setNewPassword(e.target.value)} className={inputClass} placeholder="Minimal 6 karakter" />
                                    </div>
                                    <div className="space-y-1.5">
                                        <label className="block text-sm font-medium text-slate-700">Konfirmasi Password Baru</label>
                                        <input type="password" value={confirmPassword} onChange={e => setConfirmPassword(e.target.value)} className={inputClass} placeholder="Ulangi password baru" />
                                    </div>
                                </div>
                                <p className="text-xs text-slate-400">Kosongkan bagian ini jika tidak ingin mengubah password.</p>
                            </div>
                        </section>

                        <button
                            type="submit"
                            disabled={isSaving}
                            className="w-full bg-indigo-600 text-white py-3.5 rounded-xl font-semibold hover:bg-indigo-700 transition-colors disabled:opacity-60 flex items-center justify-center gap-2"
                        >
                            {isSaving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                            {isSaving ? 'Menyimpan...' : 'Simpan Perubahan'}
                        </button>
                    </form>
                </div>
            </motion.div>
        </div>
    );
}
