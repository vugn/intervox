'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { ArrowLeft, Loader2, Plus } from 'lucide-react';
import { createScoringCriteria, listScoringCriteria } from '@/lib/data-service';

type Criteria = {
    id: string;
    criteriaName: string;
    weightScore: number;
    idealKeywords: string;
    description: string;
};

export default function AdminScoringPage() {
    const [list, setList] = useState<Criteria[]>([]);
    const [form, setForm] = useState<Omit<Criteria, 'id'>>({
        criteriaName: '',
        weightScore: 25,
        idealKeywords: '',
        description: '',
    });
    const [loading, setLoading] = useState(true);
    const [submitting, setSubmitting] = useState(false);
    const [error, setError] = useState('');

    const loadData = async () => {
        setLoading(true);
        setError('');
        try {
            const rows = await listScoringCriteria();
            setList(rows as Criteria[]);
        } catch (err: any) {
            setError(err?.message || 'Gagal memuat kriteria.');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadData();
    }, []);

    const totalWeight = list.reduce((sum, item) => sum + item.weightScore, 0);

    const addCriteria = async (e: React.FormEvent) => {
        e.preventDefault();
        setSubmitting(true);
        setError('');
        try {
            const created = await createScoringCriteria({ ...form, isActive: true });
            setList((prev) => [...prev, created as Criteria]);
        } catch (err: any) {
            setError(err?.message || 'Gagal menambah kriteria.');
        }
        setForm({ criteriaName: '', weightScore: 25, idealKeywords: '', description: '' });
        setSubmitting(false);
    };

    return (
        <div className="container mx-auto px-4 py-8 md:py-12 max-w-5xl">
            <Link href="/admin" className="inline-flex items-center text-sm text-slate-500 hover:text-slate-900 mb-4"><ArrowLeft className="w-4 h-4 mr-1" />Kembali ke Admin</Link>
            <h1 className="text-2xl font-display font-bold text-slate-900 mb-6">Form Kriteria Penilaian (Admin)</h1>

            <div className="grid lg:grid-cols-2 gap-6">
                <form onSubmit={addCriteria} className="bg-white rounded-2xl border border-slate-200 p-6 space-y-4">
                    <h2 className="font-bold text-slate-900">Input Bobot & Keyword Penilaian</h2>
                    {error && <p className="text-sm text-red-600">{error}</p>}
                    <input required value={form.criteriaName} onChange={(e) => setForm({ ...form, criteriaName: e.target.value })} placeholder="Nama kriteria (contoh: Communication)" className="w-full px-4 py-3 rounded-xl border border-slate-300 text-sm" />
                    <input type="number" min={0} max={100} required value={form.weightScore} onChange={(e) => setForm({ ...form, weightScore: Number(e.target.value) })} placeholder="Bobot nilai" className="w-full px-4 py-3 rounded-xl border border-slate-300 text-sm" />
                    <input value={form.idealKeywords} onChange={(e) => setForm({ ...form, idealKeywords: e.target.value })} placeholder="Keyword jawaban ideal" className="w-full px-4 py-3 rounded-xl border border-slate-300 text-sm" />
                    <textarea value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} placeholder="Deskripsi kriteria" className="w-full px-4 py-3 rounded-xl border border-slate-300 text-sm resize-none" rows={3} />
                    <button disabled={submitting} className="w-full bg-indigo-600 text-white rounded-xl py-3 font-semibold flex items-center justify-center gap-2 disabled:opacity-60">{submitting ? <Loader2 className="w-4 h-4 animate-spin" /> : <Plus className="w-4 h-4" />}Tambah Kriteria</button>
                </form>

                <div className="bg-white rounded-2xl border border-slate-200 p-6">
                    <div className="flex justify-between items-center mb-4">
                        <h2 className="font-bold text-slate-900">Daftar Kriteria</h2>
                        <span className={`text-xs font-semibold px-2 py-1 rounded-full ${totalWeight === 100 ? 'bg-emerald-100 text-emerald-700' : 'bg-amber-100 text-amber-700'}`}>
                            Total bobot: {totalWeight}%
                        </span>
                    </div>
                    <div className="space-y-3">
                        {loading ? (
                            <p className="text-sm text-slate-500">Memuat...</p>
                        ) : list.length === 0 ? (
                            <p className="text-sm text-slate-500">Belum ada kriteria penilaian.</p>
                        ) : list.map((item) => (
                            <div key={item.id} className="border border-slate-200 rounded-xl p-4">
                                <div className="flex justify-between items-start gap-2">
                                    <p className="font-semibold text-slate-900">{item.criteriaName}</p>
                                    <span className="text-xs bg-indigo-50 text-indigo-700 px-2 py-0.5 rounded-full font-semibold">{item.weightScore}%</span>
                                </div>
                                <p className="text-xs text-slate-500 mt-1">Keyword: {item.idealKeywords || '-'}</p>
                                <p className="text-xs text-slate-500 mt-1">{item.description || 'Tanpa deskripsi'}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}
