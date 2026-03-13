import Link from 'next/link';
import { FolderTree, ListChecks, Scale, Users, Database } from 'lucide-react';

const adminMenus = [
    {
        title: 'Manajemen Kategori',
        desc: 'Tambah/Edit kategori modul latihan interview.',
        href: '/admin/categories',
        icon: FolderTree,
    },
    {
        title: 'Bank Pertanyaan',
        desc: 'Kelola soal interview berdasarkan kategori.',
        href: '/admin/questions',
        icon: ListChecks,
    },
    {
        title: 'Kriteria Penilaian',
        desc: 'Atur bobot skor dan keyword jawaban ideal.',
        href: '/admin/scoring',
        icon: Scale,
    },
    {
        title: 'Data Dosen',
        desc: 'Kelola data dosen pembimbing untuk monitoring.',
        href: '/admin/lecturers',
        icon: Users,
    },
    {
        title: 'Data Seeding',
        desc: 'Isi data contoh untuk demo dan pengujian fitur laporan.',
        href: '/admin/seed',
        icon: Database,
    },
];

export default function AdminPage() {
    return (
        <div className="container mx-auto px-4 py-8 md:py-12 max-w-6xl">
            <div className="mb-8">
                <h1 className="text-2xl md:text-3xl font-display font-bold text-slate-900">Admin Panel</h1>
                <p className="text-slate-500 mt-1">Pusat pengelolaan master data modul, pertanyaan, kriteria, dan dosen.</p>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
                {adminMenus.map((menu) => (
                    <Link key={menu.href} href={menu.href} className="bg-white rounded-2xl border border-slate-200 p-5 hover:shadow-md transition-all hover:-translate-y-0.5">
                        <div className="w-11 h-11 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center mb-4">
                            <menu.icon className="w-5 h-5" />
                        </div>
                        <h2 className="text-lg font-bold text-slate-900 mb-1">{menu.title}</h2>
                        <p className="text-sm text-slate-600">{menu.desc}</p>
                    </Link>
                ))}
            </div>
        </div>
    );
}
