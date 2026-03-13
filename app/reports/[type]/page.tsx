'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { REPORT_ITEMS, SAMPLE_ROWS } from '@/lib/report-templates';
import { ArrowLeft, Download, FileSpreadsheet } from 'lucide-react';
import { useAuth } from '@/hooks/use-auth';
import { getAnalysisBySession, getConversationBySession, getRecommendationsBySession, listAllSessions, listSessionsByUser } from '@/lib/data-service';

export default function ReportDetailPage() {
    const params = useParams();
    const type = params.type as string;
    const { user, userData } = useAuth();
    const [rows, setRows] = useState<Array<Record<string, string | number>>>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    const report = REPORT_ITEMS.find((item) => item.type === type);
    const isAdmin = userData?.role === 'admin';

    if (!report) {
        return (
            <div className="container mx-auto px-4 py-12 max-w-3xl">
                <h1 className="text-2xl font-bold text-slate-900 mb-2">Laporan tidak ditemukan</h1>
                <Link href="/reports" className="text-indigo-600 hover:underline">Kembali ke daftar laporan</Link>
            </div>
        );
    }

    if (report.adminOnly && !isAdmin) {
        return (
            <div className="container mx-auto px-4 py-12 max-w-3xl">
                <h1 className="text-2xl font-bold text-slate-900 mb-2">Akses ditolak</h1>
                <p className="text-slate-600 mb-4">Laporan ini hanya tersedia untuk admin.</p>
                <Link href="/reports" className="text-indigo-600 hover:underline">Kembali ke daftar laporan</Link>
            </div>
        );
    }

    useEffect(() => {
        const loadRows = async () => {
            setLoading(true);
            setError('');
            try {
                const isAdminReport = ['active-participants', 'module-statistics', 'difficulty-analysis'].includes(type);
                const sessions: any[] = isAdminReport
                    ? await listAllSessions()
                    : (user ? await listSessionsByUser(user.uid) : []);

                const latestSessionId = sessions[0]?.id as string | undefined;

                let dynamicRows: Array<Record<string, string | number>> = [];

                switch (type) {
                    case 'transcript': {
                        if (latestSessionId) {
                            const logs = await getConversationBySession(latestSessionId);
                            dynamicRows = logs.map((log: any, index: number) => ({
                                No: index + 1,
                                Pertanyaan: String(log.questionText || '-'),
                                'Jawaban User': String(log.userAnswer || '-'),
                                Waktu: String(log.timestamp || '-'),
                            }));
                        }
                        break;
                    }
                    case 'score-evaluation': {
                        dynamicRows = sessions.slice(0, 20).map((session: any) => ({
                            Sesi: String(session.id),
                            Posisi: String(session.jobRole || '-'),
                            Modul: String(session.moduleType || '-'),
                            Status: String(session.status || '-'),
                            Skor: Number(session.score || 0),
                        }));
                        break;
                    }
                    case 'strength-weakness': {
                        if (latestSessionId) {
                            const analysis = await getAnalysisBySession(latestSessionId);
                            if (analysis[0]) {
                                const strengths = Array.isArray((analysis[0] as any).strengths) ? (analysis[0] as any).strengths : [];
                                const weaknesses = Array.isArray((analysis[0] as any).weaknesses) ? (analysis[0] as any).weaknesses : [];
                                dynamicRows = [
                                    ...strengths.map((item: string) => ({ Tipe: 'Kekuatan', Item: item })),
                                    ...weaknesses.map((item: string) => ({ Tipe: 'Kelemahan', Item: item })),
                                ];
                            }
                        }
                        break;
                    }
                    case 'answer-comparison': {
                        if (latestSessionId) {
                            const logs = await getConversationBySession(latestSessionId);
                            dynamicRows = logs.map((log: any) => ({
                                Pertanyaan: String(log.questionText || '-'),
                                'Jawaban User': String(log.userAnswer || '-'),
                                'Jawaban Ideal': '-',
                            }));
                        }
                        break;
                    }
                    case 'progress-chart': {
                        dynamicRows = sessions.slice(0, 12).map((session: any) => ({
                            Tanggal: String(session.createdAt || '-'),
                            Skor: Number(session.score || 0),
                        }));
                        break;
                    }
                    case 'development-recommendation': {
                        if (latestSessionId) {
                            const recs = await getRecommendationsBySession(latestSessionId);
                            dynamicRows = recs.map((rec: any) => ({
                                Prioritas: Number(rec.priority || 0),
                                Tipe: String(rec.recommendationType || '-'),
                                Rekomendasi: String(rec.recommendationText || '-'),
                            }));
                        }
                        break;
                    }
                    case 'active-participants': {
                        const map = new Map<string, number>();
                        sessions.forEach((session: any) => {
                            const key = String(session.userId || '-');
                            map.set(key, (map.get(key) || 0) + 1);
                        });
                        dynamicRows = Array.from(map.entries()).map(([userId, total]) => ({
                            UserId: userId,
                            TotalSesi: total,
                            Status: total >= 3 ? 'Aktif' : 'Kurang Aktif',
                        }));
                        break;
                    }
                    case 'module-statistics': {
                        const map = new Map<string, number>();
                        sessions.forEach((session: any) => {
                            const key = String(session.moduleType || 'Unspecified');
                            map.set(key, (map.get(key) || 0) + 1);
                        });
                        dynamicRows = Array.from(map.entries()).map(([moduleType, penggunaan]) => ({
                            Modul: moduleType,
                            Penggunaan: penggunaan,
                        }));
                        break;
                    }
                    case 'difficulty-analysis': {
                        const map = new Map<string, { total: number; lowScore: number }>();
                        sessions.forEach((session: any) => {
                            const key = String(session.difficulty || 'unknown');
                            const current = map.get(key) || { total: 0, lowScore: 0 };
                            current.total += 1;
                            if (Number(session.score || 0) < 70) current.lowScore += 1;
                            map.set(key, current);
                        });
                        dynamicRows = Array.from(map.entries()).map(([difficulty, value]) => ({
                            Level: difficulty,
                            TotalSesi: value.total,
                            'Sesi Skor < 70': value.lowScore,
                            'Persentase Kesulitan (%)': value.total ? Math.round((value.lowScore / value.total) * 100) : 0,
                        }));
                        break;
                    }
                    case 'certificate': {
                        const top = sessions.find((session: any) => Number(session.score || 0) > 0);
                        dynamicRows = top ? [{
                            UserId: String(top.userId || '-'),
                            Modul: String(top.moduleType || '-'),
                            Nilai: Number(top.score || 0),
                            Tanggal: String(top.createdAt || '-'),
                        }] : [];
                        break;
                    }
                    default:
                        dynamicRows = [];
                }

                setRows(dynamicRows.length ? dynamicRows : (SAMPLE_ROWS[type] || []));
            } catch (err: any) {
                setError(err?.message || 'Gagal memuat data laporan dari backend.');
                setRows(SAMPLE_ROWS[type] || []);
            } finally {
                setLoading(false);
            }
        };

        loadRows();
    }, [type, user]);

    const headers = rows.length > 0 ? Object.keys(rows[0]) : [];

    const downloadCsv = () => {
        if (!rows.length) return;
        const csvRows = [headers.join(',')];
        for (const row of rows) {
            csvRows.push(headers.map((h) => `"${String(row[h] ?? '').replaceAll('"', '""')}"`).join(','));
        }
        const csvContent = `data:text/csv;charset=utf-8,${csvRows.join('\n')}`;
        const encodedUri = encodeURI(csvContent);
        const link = document.createElement('a');
        link.setAttribute('href', encodedUri);
        link.setAttribute('download', `${type}.csv`);
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    return (
        <div className="container mx-auto px-4 py-8 md:py-12 max-w-6xl">
            <div className="mb-6 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                <div>
                    <Link href="/reports" className="inline-flex items-center text-sm text-slate-500 hover:text-slate-900 mb-2"><ArrowLeft className="w-4 h-4 mr-1" />Kembali</Link>
                    <h1 className="text-2xl md:text-3xl font-display font-bold text-slate-900">{report.title}</h1>
                    <p className="text-slate-500 mt-1">{report.description}</p>
                </div>
                <div className="flex gap-2 print:hidden">
                    <button onClick={() => window.print()} className="bg-indigo-600 text-white px-4 py-2.5 rounded-xl text-sm font-semibold hover:bg-indigo-700 transition-colors flex items-center gap-2"><Download className="w-4 h-4" />Export PDF</button>
                    {report.exportTypes.includes('Excel') && (
                        <button onClick={downloadCsv} className="bg-white border border-slate-300 text-slate-700 px-4 py-2.5 rounded-xl text-sm font-semibold hover:bg-slate-50 transition-colors flex items-center gap-2"><FileSpreadsheet className="w-4 h-4" />Export Excel</button>
                    )}
                </div>
            </div>

            <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden">
                {error && <p className="px-4 py-3 text-sm text-red-600 border-b border-slate-100">{error}</p>}
                <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                        <thead className="bg-slate-50 text-slate-600">
                            <tr>
                                {headers.map((header) => (
                                    <th key={header} className="px-4 py-3 text-left font-semibold whitespace-nowrap">{header}</th>
                                ))}
                            </tr>
                        </thead>
                        <tbody>
                            {loading ? (
                                <tr><td className="px-4 py-4 text-slate-500" colSpan={Math.max(headers.length, 1)}>Memuat data laporan...</td></tr>
                            ) : rows.map((row, index) => (
                                <tr key={index} className="border-t border-slate-100">
                                    {headers.map((header) => (
                                        <td key={header} className="px-4 py-3 text-slate-700 whitespace-nowrap">{String(row[header] ?? '-')}</td>
                                    ))}
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}
