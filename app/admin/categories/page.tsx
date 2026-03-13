'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { ArrowLeft, Loader2, Plus } from 'lucide-react';
import { createCategory, listCategories } from '@/lib/data-service';

type Category = {
    id: string;
    categoryName: string;
    description: string;
    moduleType: string;
    difficultyLevel: string;
};

export default function AdminCategoriesPage() {
    const [categories, setCategories] = useState<Category[]>([]);
    const [form, setForm] = useState<Omit<Category, 'id'>>({
        categoryName: '',
        description: '',
        moduleType: 'Kerja',
        difficultyLevel: 'medium',
    });
    const [loading, setLoading] = useState(true);
    const [submitting, setSubmitting] = useState(false);
    const [error, setError] = useState('');

    const loadCategories = async () => {
        setLoading(true);
        setError('');
        try {
            const rows = await listCategories();
            setCategories(rows as Category[]);
        } catch (err: any) {
            setError(err?.message || 'Gagal memuat kategori.');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadCategories();
    }, []);

    const addCategory = async (e: React.FormEvent) => {
        e.preventDefault();
        setSubmitting(true);
        setError('');
        try {
            const created = await createCategory({
                categoryName: form.categoryName,
                description: form.description,
                moduleType: form.moduleType,
                difficultyLevel: form.difficultyLevel,
                isActive: true,
            });
            setCategories((prev) => [...prev, created as Category]);
        } catch (err: any) {
            setError(err?.message || 'Gagal menambah kategori.');
        }
        setForm({ categoryName: '', description: '', moduleType: 'Kerja', difficultyLevel: 'medium' });
        setSubmitting(false);
    };

    return (
        <div className="container mx-auto px-4 py-8 md:py-12 max-w-5xl">
            <Link href="/admin" className="inline-flex items-center text-sm text-slate-500 hover:text-slate-900 mb-4"><ArrowLeft className="w-4 h-4 mr-1" />Kembali ke Admin</Link>
            <h1 className="text-2xl font-display font-bold text-slate-900 mb-6">Form Manajemen Kategori (Admin)</h1>

            <div className="grid lg:grid-cols-2 gap-6">
                <form onSubmit={addCategory} className="bg-white rounded-2xl border border-slate-200 p-6 space-y-4">
                    <h2 className="font-bold text-slate-900">Input Kategori Baru</h2>
                    {error && <p className="text-sm text-red-600">{error}</p>}
                    <input required value={form.categoryName} onChange={(e) => setForm({ ...form, categoryName: e.target.value })} placeholder="Nama kategori" className="w-full px-4 py-3 rounded-xl border border-slate-300 text-sm" />
                    <textarea value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} placeholder="Deskripsi kategori" className="w-full px-4 py-3 rounded-xl border border-slate-300 text-sm resize-none" rows={3} />
                    <div className="grid grid-cols-2 gap-3">
                        <select value={form.moduleType} onChange={(e) => setForm({ ...form, moduleType: e.target.value })} className="px-4 py-3 rounded-xl border border-slate-300 text-sm bg-white">
                            <option>Kerja</option>
                            <option>Beasiswa</option>
                            <option>Magang</option>
                            <option>Organisasi</option>
                        </select>
                        <select value={form.difficultyLevel} onChange={(e) => setForm({ ...form, difficultyLevel: e.target.value })} className="px-4 py-3 rounded-xl border border-slate-300 text-sm bg-white">
                            <option value="easy">easy</option>
                            <option value="medium">medium</option>
                            <option value="hard">hard</option>
                        </select>
                    </div>
                    <button disabled={submitting} className="w-full bg-indigo-600 text-white rounded-xl py-3 font-semibold flex items-center justify-center gap-2 disabled:opacity-60">{submitting ? <Loader2 className="w-4 h-4 animate-spin" /> : <Plus className="w-4 h-4" />}Tambah Kategori</button>
                </form>

                <div className="bg-white rounded-2xl border border-slate-200 p-6">
                    <h2 className="font-bold text-slate-900 mb-4">Daftar Kategori</h2>
                    <div className="space-y-3">
                        {loading ? <p className="text-sm text-slate-500">Memuat...</p> : categories.map((c) => (
                            <div key={c.id} className="border border-slate-200 rounded-xl p-4">
                                <p className="font-semibold text-slate-900">{c.categoryName}</p>
                                <p className="text-sm text-slate-500">{c.description}</p>
                                <p className="text-xs text-slate-400 mt-1">{c.moduleType} · {c.difficultyLevel}</p>
                            </div>
                        ))}
                    </div>
                    <button onClick={loadCategories} className="mt-4 w-full border border-slate-300 text-slate-700 rounded-xl py-2.5 text-sm font-semibold">Refresh Data</button>
                </div>
            </div>
        </div>
    );
}
