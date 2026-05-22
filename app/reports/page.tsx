"use client";

import Link from 'next/link';
import { REPORT_ITEMS } from '@/lib/report-templates';
import { FileText, Download } from 'lucide-react';
import { useAuth } from '@/hooks/use-auth';

export default function ReportsPage() {
    const { userData } = useAuth();
    const isAdmin = ['lecturer', 'head_of_program'].includes(userData?.role);
    const visibleReports = REPORT_ITEMS.filter((report) => !report.adminOnly || isAdmin);

    return (
        <div className="container mx-auto px-4 py-8 md:py-12 max-w-6xl">
            <div className="mb-8">
                <h1 className="text-2xl md:text-3xl font-display font-bold text-slate-900">10 Output Laporan</h1>
                <p className="text-slate-500 mt-1">Pilih jenis laporan yang ingin ditampilkan atau dicetak (PDF/Excel).</p>
            </div>

            <div className="grid md:grid-cols-2 gap-5">
                {visibleReports.map((report) => (
                    <Link key={report.id} href={`/reports/${report.type}`} className="bg-white border border-slate-200 rounded-2xl p-5 hover:shadow-md transition-all">
                        <div className="flex items-start justify-between gap-4">
                            <div>
                                <h2 className="font-bold text-slate-900 mb-1 flex items-center gap-2"><FileText className="w-4 h-4 text-indigo-600" />{report.title}</h2>
                                <p className="text-sm text-slate-600">{report.description}</p>
                            </div>
                            <span className="text-xs bg-indigo-50 text-indigo-700 font-semibold px-2 py-1 rounded-full flex items-center gap-1"><Download className="w-3 h-3" />{report.exportTypes.join('/')}</span>
                        </div>
                    </Link>
                ))}
            </div>
        </div>
    );
}
