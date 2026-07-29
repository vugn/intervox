'use client';

import { useEffect, useState } from 'react';
import { getSystemSettings, updateSystemSettings } from '@/lib/data-service';
import { useAuth } from '@/hooks/use-auth';
import { Save, AlertCircle, Loader2, UploadCloud, Settings } from 'lucide-react';
import Image from 'next/image';

export default function AdminSettingsPage() {
  const { userData, loading: authLoading } = useAuth();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null);

  const [headOfProgram, setHeadOfProgram] = useState({
    name: '',
    nip: '',
    signature_url: '',
    qr_code_data: ''
  });

  useEffect(() => {
    if (authLoading) return;
    fetchSettings();
  }, [authLoading]);

  const fetchSettings = async () => {
    try {
      const data = await getSystemSettings('head_of_program_signature');
      if (data) {
        setHeadOfProgram(data);
      }
    } catch (error) {
      console.error('Failed to load settings:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    setSaving(true);
    setMessage(null);
    try {
      await updateSystemSettings('head_of_program_signature', headOfProgram, userData?.id);
      setMessage({ type: 'success', text: 'Pengaturan berhasil disimpan.' });
    } catch (error) {
      setMessage({ type: 'error', text: 'Gagal menyimpan pengaturan.' });
    } finally {
      setSaving(false);
    }
  };

  if (userData?.role !== 'administrator') {
    return (
      <div className="flex-1 flex items-center justify-center p-8">
        <div className="bg-red-50 text-red-600 p-6 rounded-2xl flex flex-col items-center max-w-sm text-center">
          <AlertCircle className="w-12 h-12 mb-4" />
          <h2 className="font-bold text-lg mb-2">Akses Ditolak</h2>
          <p className="text-sm">Anda tidak memiliki izin untuk mengakses halaman ini.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto w-full p-4 sm:p-6 lg:p-8">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-slate-900 flex items-center gap-2">
          <Settings className="w-6 h-6 text-indigo-600" />
          Pengaturan Sistem
        </h1>
        <p className="text-slate-500 mt-1">Konfigurasi pengaturan laporan dan aplikasi.</p>
      </div>

      {loading ? (
        <div className="flex justify-center p-12">
          <Loader2 className="w-8 h-8 animate-spin text-slate-300" />
        </div>
      ) : (
        <div className="bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden">
          <div className="p-6 sm:p-8 border-b border-slate-200">
            <h2 className="text-lg font-bold text-slate-900 mb-4">Pengesahan Laporan (Dekan Fakultas Teknologi Informasi)</h2>
            <p className="text-sm text-slate-500 mb-6">
              Data ini akan ditampilkan di bagian bawah kanan (tanda tangan Dekan) pada laporan-laporan resmi yang dicetak dari sistem.
            </p>

            {message && (
              <div className={`p-4 rounded-xl mb-6 text-sm ${message.type === 'success' ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' : 'bg-red-50 text-red-700 border border-red-200'}`}>
                {message.text}
              </div>
            )}

            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2">Nama Lengkap & Gelar</label>
                  <input
                    type="text"
                    value={headOfProgram.name}
                    onChange={(e) => setHeadOfProgram({ ...headOfProgram, name: e.target.value })}
                    placeholder="Prof. Dr. Hj. Silvia Ratna, S.Kom., M.Kom."
                    className="w-full px-4 py-2 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none transition-all"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2">NIP / NIDN</label>
                  <input
                    type="text"
                    value={headOfProgram.nip}
                    onChange={(e) => setHeadOfProgram({ ...headOfProgram, nip: e.target.value })}
                    placeholder="19750913 200501 2 001"
                    className="w-full px-4 py-2 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none transition-all"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">Tautan URL Tanda Tangan (Opsional)</label>
                <input
                  type="text"
                  value={headOfProgram.signature_url}
                  onChange={(e) => setHeadOfProgram({ ...headOfProgram, signature_url: e.target.value })}
                  placeholder="https://example.com/signature.png"
                  className="w-full px-4 py-2 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none transition-all"
                />
                <p className="text-xs text-slate-500 mt-2">Gunakan URL gambar PNG transparan (contoh: dari Supabase Storage).</p>
                
                {headOfProgram.signature_url && (
                  <div className="mt-4 p-4 border border-dashed border-slate-300 rounded-xl bg-slate-50 flex flex-col items-center justify-center">
                    <p className="text-xs text-slate-400 mb-2 font-medium uppercase tracking-wider">Preview Tanda Tangan</p>
                    <img src={headOfProgram.signature_url} alt="Signature Preview" className="h-20 object-contain" onError={(e) => e.currentTarget.style.display = 'none'} />
                  </div>
                )}
              </div>

              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">Data QR Code (Opsional)</label>
                <input
                  type="text"
                  value={headOfProgram.qr_code_data}
                  onChange={(e) => setHeadOfProgram({ ...headOfProgram, qr_code_data: e.target.value })}
                  placeholder="https://kampus.ac.id/verify/..."
                  className="w-full px-4 py-2 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none transition-all"
                />
                <p className="text-xs text-slate-500 mt-2">Jika diisi, QR Code akan di-generate secara otomatis di samping tanda tangan pada saat laporan dicetak.</p>
              </div>
            </div>
          </div>
          <div className="bg-slate-50 p-6 sm:px-8 border-t border-slate-200 flex justify-end">
            <button
              onClick={handleSave}
              disabled={saving}
              className="bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-2.5 rounded-xl font-medium transition-colors flex items-center gap-2 disabled:opacity-50"
            >
              {saving ? <Loader2 className="w-5 h-5 animate-spin" /> : <Save className="w-5 h-5" />}
              Simpan Pengaturan
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
