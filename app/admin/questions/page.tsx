'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { ArrowLeft, Loader2, Plus } from 'lucide-react';
import { createQuestion, listCategories, listQuestionsByCategory } from '@/lib/data-service';

type Question = {
    id: string;
    category: string;
    question: string;
    idealKeywords: string;
    difficulty: string;
};

export default function AdminQuestionsPage() {
    const [questions, setQuestions] = useState<Question[]>([]);
    const [categories, setCategories] = useState<{ id: string; categoryName: string }[]>([]);
    const [form, setForm] = useState({
        category: '',
        question: '',
        idealKeywords: '',
        difficulty: 'medium',
    });
    const [loading, setLoading] = useState(true);
    const [submitting, setSubmitting] = useState(false);
    const [error, setError] = useState('');

    const loadCategories = async () => {
        const rows = await listCategories();
        const mapped = rows.map((c: any) => ({ id: c.id, categoryName: c.categoryName }));
        setCategories(mapped);
        if (!form.category && mapped.length > 0) {
            setForm((prev) => ({ ...prev, category: mapped[0].id }));
            return mapped[0].id;
        }
        return form.category;
    };

    const loadQuestions = async (categoryId: string) => {
        if (!categoryId) return;
        const rows = await listQuestionsByCategory(categoryId);
        setQuestions((rows as any[]).map((item) => ({
            id: item.id,
            category: item.categoryId,
            question: item.questionText,
            idealKeywords: item.idealKeywords || '',
            difficulty: item.difficultyLevel || 'medium',
        })));
    };

    useEffect(() => {
        const run = async () => {
            setLoading(true);
            setError('');
            try {
                const selectedCategory = await loadCategories();
                if (selectedCategory) await loadQuestions(selectedCategory);
            } catch (err: any) {
                setError(err?.message || 'Gagal memuat data pertanyaan.');
            } finally {
                setLoading(false);
            }
        };
        run();
    }, []);

    useEffect(() => {
        if (!form.category) return;
        loadQuestions(form.category).catch(() => null);
    }, [form.category]);

    const addQuestion = async (e: React.FormEvent) => {
        e.preventDefault();
        setSubmitting(true);
        setError('');
        try {
            const created = await createQuestion({
                categoryId: form.category,
                questionText: form.question,
                idealKeywords: form.idealKeywords,
                difficultyLevel: form.difficulty,
            });
            setQuestions((prev) => [...prev, {
                id: (created as any).id,
                category: (created as any).categoryId,
                question: (created as any).questionText,
                idealKeywords: (created as any).idealKeywords || '',
                difficulty: (created as any).difficultyLevel || 'medium',
            }]);
        } catch (err: any) {
            setError(err?.message || 'Gagal menambah pertanyaan.');
        }
        setForm({ ...form, question: '', idealKeywords: '' });
        setSubmitting(false);
    };

    return (
        <div className="container mx-auto px-4 py-8 md:py-12 max-w-5xl">
            <Link href="/admin" className="inline-flex items-center text-sm text-slate-500 hover:text-slate-900 mb-4"><ArrowLeft className="w-4 h-4 mr-1" />Kembali ke Admin</Link>
            <h1 className="text-2xl font-display font-bold text-slate-900 mb-6">Form Manajemen Bank Pertanyaan (Admin)</h1>

            <div className="grid lg:grid-cols-2 gap-6">
                <form onSubmit={addQuestion} className="bg-white rounded-2xl border border-slate-200 p-6 space-y-4">
                    <h2 className="font-bold text-slate-900">Input Pertanyaan Baru</h2>
                    {error && <p className="text-sm text-red-600">{error}</p>}
                    <select value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })} className="w-full px-4 py-3 rounded-xl border border-slate-300 text-sm bg-white">
                        {categories.length === 0 ? (
                            <option value="">Tidak ada kategori</option>
                        ) : categories.map((category) => (
                            <option key={category.id} value={category.id}>{category.categoryName}</option>
                        ))}
                    </select>
                    <textarea required value={form.question} onChange={(e) => setForm({ ...form, question: e.target.value })} placeholder="Tulis pertanyaan wawancara..." className="w-full px-4 py-3 rounded-xl border border-slate-300 text-sm resize-none" rows={4} />
                    <input value={form.idealKeywords} onChange={(e) => setForm({ ...form, idealKeywords: e.target.value })} placeholder="Keyword ideal (pisahkan koma)" className="w-full px-4 py-3 rounded-xl border border-slate-300 text-sm" />
                    <select value={form.difficulty} onChange={(e) => setForm({ ...form, difficulty: e.target.value })} className="w-full px-4 py-3 rounded-xl border border-slate-300 text-sm bg-white">
                        <option value="easy">easy</option>
                        <option value="medium">medium</option>
                        <option value="hard">hard</option>
                    </select>
                    <button disabled={submitting || !form.category} className="w-full bg-indigo-600 text-white rounded-xl py-3 font-semibold flex items-center justify-center gap-2 disabled:opacity-60">{submitting ? <Loader2 className="w-4 h-4 animate-spin" /> : <Plus className="w-4 h-4" />}Tambah Soal</button>
                </form>

                <div className="bg-white rounded-2xl border border-slate-200 p-6">
                    <h2 className="font-bold text-slate-900 mb-4">Daftar Soal</h2>
                    <div className="space-y-3 max-h-[520px] overflow-y-auto pr-1">
                        {loading ? (
                            <p className="text-sm text-slate-500">Memuat...</p>
                        ) : questions.length === 0 ? (
                            <p className="text-sm text-slate-500">Belum ada pertanyaan.</p>
                        ) : questions.map((q) => (
                            <div key={q.id} className="border border-slate-200 rounded-xl p-4">
                                <p className="text-xs text-indigo-600 font-semibold mb-1">{categories.find((c) => c.id === q.category)?.categoryName || q.category} · {q.difficulty}</p>
                                <p className="font-medium text-slate-900 text-sm">{q.question}</p>
                                <p className="text-xs text-slate-500 mt-2">Ideal keywords: {q.idealKeywords || '-'}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}
