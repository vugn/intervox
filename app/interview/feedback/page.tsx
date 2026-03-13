'use client';

import { useState, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useAuth } from '@/hooks/use-auth';
import { updateSession } from '@/lib/data-service';
import { Star, ThumbsUp, Loader2, ArrowRight, MessageSquare } from 'lucide-react';
import * as motion from 'motion/react-client';

function StarRating({ value, onChange, label }: { value: number; onChange: (v: number) => void; label: string }) {
    return (
        <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">{label}</label>
            <div className="flex gap-1">
                {[1, 2, 3, 4, 5].map((star) => (
                    <button
                        key={star}
                        type="button"
                        onClick={() => onChange(star)}
                        className={`w-9 h-9 rounded-lg transition-all ${star <= value ? 'text-amber-400 bg-amber-50' : 'text-slate-300 hover:text-amber-300'}`}
                    >
                        <Star className={`w-5 h-5 mx-auto ${star <= value ? 'fill-current' : ''}`} />
                    </button>
                ))}
            </div>
            {value > 0 && (
                <p className="text-xs text-slate-500 mt-1">
                    {value === 1 ? 'Sangat Buruk' : value === 2 ? 'Buruk' : value === 3 ? 'Cukup' : value === 4 ? 'Baik' : 'Sangat Baik'}
                </p>
            )}
        </div>
    );
}

function FeedbackContent() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const { user } = useAuth();

    const sessionId = searchParams.get('sessionId');
    const role = searchParams.get('role') || 'Posisi';

    const [formData, setFormData] = useState({
        selfScore: 0,
        confidenceLevel: '',
        difficultyRating: 0,
        whatWentWell: '',
        whatToImprove: '',
        platformRating: 0,
        platformFeedback: '',
        wouldUseAgain: '',
    });
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);

        if (sessionId && user) {
            try {
                await updateSession(sessionId, {
                    selfAssessment: {
                        selfScore: formData.selfScore,
                        confidenceLevel: formData.confidenceLevel,
                        difficultyRating: formData.difficultyRating,
                        whatWentWell: formData.whatWentWell,
                        whatToImprove: formData.whatToImprove,
                        platformRating: formData.platformRating,
                        platformFeedback: formData.platformFeedback,
                        wouldUseAgain: formData.wouldUseAgain,
                        submittedAt: new Date().toISOString(),
                    },
                });
            } catch (err) {
                console.error('Error saving feedback:', err);
            }
        }

        router.push(sessionId ? `/dashboard/report/${sessionId}` : '/dashboard');
    };

    const inputClass = "w-full px-4 py-3 rounded-xl border border-slate-300 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-colors text-sm";

    return (
        <div className="container mx-auto px-4 py-8 md:py-12 max-w-2xl">
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}>

                <div className="text-center mb-8">
                    <div className="w-14 h-14 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto mb-4">
                        <ThumbsUp className="w-7 h-7" />
                    </div>
                    <h1 className="text-2xl md:text-3xl font-display font-bold text-slate-900 mb-2">Sesi Selesai! 🎉</h1>
                    <p className="text-slate-500">Kamu baru saja menyelesaikan simulasi interview untuk posisi <strong>{role}</strong>. Isi penilaian diri untuk melengkapi laporanmu.</p>
                </div>

                <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
                    <form onSubmit={handleSubmit} className="p-6 md:p-8 space-y-7">

                        {/* Self Performance */}
                        <section>
                            <h2 className="text-sm font-bold text-slate-500 uppercase tracking-wider mb-5 flex items-center gap-2">
                                <MessageSquare className="w-4 h-4" /> Penilaian Diri Sendiri
                            </h2>
                            <div className="space-y-5">
                                <StarRating
                                    value={formData.selfScore}
                                    onChange={v => setFormData({ ...formData, selfScore: v })}
                                    label="Seberapa baik kamu menjawab pertanyaan tadi? *"
                                />
                                <div className="space-y-1.5">
                                    <label className="block text-sm font-medium text-slate-700">Tingkat kepercayaan diri selama interview <span className="text-red-500">*</span></label>
                                    <select required value={formData.confidenceLevel} onChange={e => setFormData({ ...formData, confidenceLevel: e.target.value })} className={`${inputClass} bg-white`}>
                                        <option value="">Pilih tingkat kepercayaan diri</option>
                                        <option value="Sangat Gugup">Sangat Gugup</option>
                                        <option value="Agak Gugup">Agak Gugup</option>
                                        <option value="Cukup Percaya Diri">Cukup Percaya Diri</option>
                                        <option value="Percaya Diri">Percaya Diri</option>
                                        <option value="Sangat Percaya Diri">Sangat Percaya Diri</option>
                                    </select>
                                </div>
                                <StarRating
                                    value={formData.difficultyRating}
                                    onChange={v => setFormData({ ...formData, difficultyRating: v })}
                                    label="Seberapa sulit pertanyaan yang diajukan?"
                                />
                                <div className="space-y-1.5">
                                    <label className="block text-sm font-medium text-slate-700">Apa yang kamu rasa sudah berjalan baik?</label>
                                    <textarea
                                        value={formData.whatWentWell}
                                        onChange={e => setFormData({ ...formData, whatWentWell: e.target.value })}
                                        rows={3}
                                        className={`${inputClass} resize-none`}
                                        placeholder="misal: Saya cukup lancar menjawab pertanyaan tentang pengalaman kerja..."
                                    />
                                </div>
                                <div className="space-y-1.5">
                                    <label className="block text-sm font-medium text-slate-700">Apa yang perlu kamu tingkatkan?</label>
                                    <textarea
                                        value={formData.whatToImprove}
                                        onChange={e => setFormData({ ...formData, whatToImprove: e.target.value })}
                                        rows={3}
                                        className={`${inputClass} resize-none`}
                                        placeholder="misal: Saya perlu lebih banyak berlatih menjawab pertanyaan teknis..."
                                    />
                                </div>
                            </div>
                        </section>

                        <hr className="border-slate-100" />

                        {/* Platform Feedback */}
                        <section>
                            <h2 className="text-sm font-bold text-slate-500 uppercase tracking-wider mb-5">Feedback untuk Intervox</h2>
                            <div className="space-y-5">
                                <StarRating
                                    value={formData.platformRating}
                                    onChange={v => setFormData({ ...formData, platformRating: v })}
                                    label="Seberapa puas kamu dengan Intervox? *"
                                />
                                <div className="space-y-1.5">
                                    <label className="block text-sm font-medium text-slate-700">Apakah kamu akan menggunakan Intervox lagi?</label>
                                    <div className="flex gap-3 flex-wrap">
                                        {['Ya, pasti!', 'Mungkin', 'Tidak'].map((opt) => (
                                            <button
                                                key={opt}
                                                type="button"
                                                onClick={() => setFormData({ ...formData, wouldUseAgain: opt })}
                                                className={`px-4 py-2 rounded-xl text-sm font-medium border transition-all ${formData.wouldUseAgain === opt ? 'bg-indigo-600 text-white border-indigo-600' : 'bg-white text-slate-700 border-slate-300 hover:border-indigo-400'}`}
                                            >
                                                {opt}
                                            </button>
                                        ))}
                                    </div>
                                </div>
                                <div className="space-y-1.5">
                                    <label className="block text-sm font-medium text-slate-700">Saran atau masukan untuk kami (opsional)</label>
                                    <textarea
                                        value={formData.platformFeedback}
                                        onChange={e => setFormData({ ...formData, platformFeedback: e.target.value })}
                                        rows={3}
                                        className={`${inputClass} resize-none`}
                                        placeholder="Fitur apa yang ingin kamu lihat? Ada sesuatu yang perlu diperbaiki?"
                                    />
                                </div>
                            </div>
                        </section>

                        <button
                            type="submit"
                            disabled={isSubmitting || formData.selfScore === 0 || !formData.confidenceLevel || formData.platformRating === 0}
                            className="w-full bg-indigo-600 text-white py-3.5 rounded-xl font-semibold hover:bg-indigo-700 transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
                        >
                            {isSubmitting ? <Loader2 className="w-4 h-4 animate-spin" /> : <ArrowRight className="w-4 h-4" />}
                            {isSubmitting ? 'Menyimpan...' : 'Lihat Laporan Lengkap'}
                        </button>

                        <button
                            type="button"
                            onClick={() => router.push(sessionId ? `/dashboard/report/${sessionId}` : '/dashboard')}
                            className="w-full text-sm text-slate-400 hover:text-slate-600 transition-colors py-1"
                        >
                            Lewati dan lihat laporan →
                        </button>
                    </form>
                </div>
            </motion.div>
        </div>
    );
}

export default function FeedbackPage() {
    return (
        <Suspense fallback={<div className="flex-1 flex items-center justify-center"><div className="w-8 h-8 border-4 border-indigo-200 border-t-indigo-600 rounded-full animate-spin" /></div>}>
            <FeedbackContent />
        </Suspense>
    );
}
