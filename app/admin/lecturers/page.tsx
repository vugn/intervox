'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { ArrowLeft, Loader2, Plus } from 'lucide-react';
import { createLecturer, listLecturers } from '@/lib/data-service';

type Lecturer = {
    id: string;
    fullName: string;
    email: string;
    department: string;
    faculty: string;
    phone: string;
};

export default function AdminLecturersPage() {
    const [lecturers, setLecturers] = useState<Lecturer[]>([]);
    const [form, setForm] = useState<Omit<Lecturer, 'id'>>({
        fullName: '',
        email: '',
        department: '',
        faculty: '',
        phone: '',
    });
    const [loading, setLoading] = useState(true);
    const [submitting, setSubmitting] = useState(false);
    const [error, setError] = useState('');

    const loadData = async () => {
        setLoading(true);
        setError('');
        try {
            const rows = await listLecturers();
            setLecturers(rows as Lecturer[]);
        } catch (err: any) {
            setError(err?.message || 'Gagal memuat data dosen.');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadData();
    }, []);

    const addLecturer = async (e: React.FormEvent) => {
        e.preventDefault();
        setSubmitting(true);
        setError('');
        try {
            const created = await createLecturer(form);
            setLecturers((prev) => [...prev, created as Lecturer]);
        } catch (err: any) {
            setError(err?.message || 'Gagal menambah data dosen.');
        }
        setForm({ fullName: '', email: '', department: '', faculty: '', phone: '' });
        setSubmitting(false);
    };

    return (
        <div className="container mx-auto px-4 py-8 md:py-12 max-w-5xl">
            <Link href="/admin" className="inline-flex items-center text-sm text-slate-500 hover:text-slate-900 mb-4"><ArrowLeft className="w-4 h-4 mr-1" />Kembali ke Admin</Link>
            <h1 className="text-2xl font-display font-bold text-slate-900 mb-6">Form Manajemen Data Dosen (Admin)</h1>

            <div className="grid lg:grid-cols-2 gap-6">
                <form onSubmit={addLecturer} className="bg-white rounded-2xl border border-slate-200 p-6 space-y-4">
                    <h2 className="font-bold text-slate-900">Input Dosen Pembimbing</h2>
                    {error && <p className="text-sm text-red-600">{error}</p>}
                    <input required value={form.fullName} onChange={(e) => setForm({ ...form, fullName: e.target.value })} placeholder="Nama lengkap dosen" className="w-full px-4 py-3 rounded-xl border border-slate-300 text-sm" />
                    <input required type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} placeholder="Email dosen" className="w-full px-4 py-3 rounded-xl border border-slate-300 text-sm" />
                    <input value={form.department} onChange={(e) => setForm({ ...form, department: e.target.value })} placeholder="Jurusan" className="w-full px-4 py-3 rounded-xl border border-slate-300 text-sm" />
                    <input value={form.faculty} onChange={(e) => setForm({ ...form, faculty: e.target.value })} placeholder="Fakultas" className="w-full px-4 py-3 rounded-xl border border-slate-300 text-sm" />
                    <input value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} placeholder="Nomor telepon" className="w-full px-4 py-3 rounded-xl border border-slate-300 text-sm" />
                    <button disabled={submitting} className="w-full bg-indigo-600 text-white rounded-xl py-3 font-semibold flex items-center justify-center gap-2 disabled:opacity-60">{submitting ? <Loader2 className="w-4 h-4 animate-spin" /> : <Plus className="w-4 h-4" />}Tambah Dosen</button>
                </form>

                <div className="bg-white rounded-2xl border border-slate-200 p-6">
                    <h2 className="font-bold text-slate-900 mb-4">Daftar Dosen</h2>
                    <div className="space-y-3">
                        {loading ? (
                            <p className="text-sm text-slate-500">Memuat...</p>
                        ) : lecturers.length === 0 ? (
                            <p className="text-sm text-slate-500">Belum ada data dosen.</p>
                        ) : lecturers.map((lecturer) => (
                            <div key={lecturer.id} className="border border-slate-200 rounded-xl p-4">
                                <p className="font-semibold text-slate-900">{lecturer.fullName}</p>
                                <p className="text-sm text-slate-500">{lecturer.email}</p>
                                <p className="text-xs text-slate-400 mt-1">{lecturer.department || '-'} · {lecturer.faculty || '-'}</p>
                                <p className="text-xs text-slate-400">{lecturer.phone || '-'}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}
