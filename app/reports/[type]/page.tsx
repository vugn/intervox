'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { REPORT_ITEMS, SAMPLE_ROWS } from '@/lib/report-templates';
import { ArrowLeft, Download, FileSpreadsheet } from 'lucide-react';
import { useAuth } from '@/hooks/use-auth';
import { getAnalysisBySession, getConversationBySession, getRecommendationsBySession, getSessionById, listAllSessions, listQuestionsByCategory, listSessionsByUser } from '@/lib/data-service';
import { jsPDF } from 'jspdf';

const formatDate = (value: unknown) => {
    if (!value) return '-';
    const date = new Date(String(value));
    if (Number.isNaN(date.getTime())) return String(value);
    return date.toLocaleString('id-ID');
};

const getSessionScore = (session: any) => {
    const directScore = Number(session?.score ?? session?.totalScore ?? 0);
    if (directScore > 0) return directScore;

    const scores = session?.analysis?.scores;
    if (!scores) return 0;

    const values = [
        Number(scores.communication ?? 0),
        Number(scores.technical ?? 0),
        Number(scores.problemSolving ?? 0),
        Number(scores.cultureFit ?? 0),
    ].filter((value) => value > 0);

    if (!values.length) return 0;
    return Math.round(values.reduce((sum, value) => sum + value, 0) / values.length);
};

export default function ReportDetailPage() {
    const params = useParams();
    const type = params.type as string;
    const { user, userData } = useAuth();
    const [rows, setRows] = useState<Array<Record<string, string | number>>>([]);
    const [sessionOptions, setSessionOptions] = useState<any[]>([]);
    const [selectedSessionId, setSelectedSessionId] = useState('');
    const [fromDate, setFromDate] = useState('');
    const [toDate, setToDate] = useState('');
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    const report = REPORT_ITEMS.find((item) => item.type === type);
    const isAdmin = ['lecturer', 'head_of_program'].includes(userData?.role);

    const isSessionBasedReport = ['transcript', 'strength-weakness', 'answer-comparison', 'development-recommendation', 'certificate'].includes(type);

    useEffect(() => {
        const loadRows = async () => {
            setLoading(true);
            setError('');
            try {
                const isAdminReport = ['active-participants', 'module-statistics', 'difficulty-analysis'].includes(type);
                const sessionsRaw: any[] = isAdminReport
                    ? await listAllSessions()
                    : (user ? await listSessionsByUser(user.id) : []);

                setSessionOptions(sessionsRaw);

                const inDateRange = sessionsRaw.filter((session: any) => {
                    const sessionDate = new Date(String(session.createdAt || session.completedAt || session.startedAt || 0));
                    if (Number.isNaN(sessionDate.getTime())) return true;
                    const start = fromDate ? new Date(`${fromDate}T00:00:00`) : null;
                    const end = toDate ? new Date(`${toDate}T23:59:59`) : null;
                    if (start && sessionDate < start) return false;
                    if (end && sessionDate > end) return false;
                    return true;
                });

                const sessions = inDateRange;

                if (!selectedSessionId && sessionsRaw.length > 0 && isSessionBasedReport) {
                    setSelectedSessionId(String(sessionsRaw[0].id));
                }

                const latestSessionId = sessions[0]?.id as string | undefined;
                const activeSessionId = selectedSessionId || latestSessionId;

                let dynamicRows: Array<Record<string, string | number>> = [];

                switch (type) {
                    case 'transcript': {
                        if (activeSessionId) {
                            const session = await getSessionById(activeSessionId);
                            const transcript = Array.isArray((session as any)?.transcript) ? (session as any).transcript : [];

                            if (transcript.length > 0) {
                                dynamicRows = transcript.map((entry: any, index: number) => ({
                                    No: index + 1,
                                    Pembicara: entry.role === 'ai' ? 'Interviewer' : 'Kandidat',
                                    Ucapan: String(entry.text || '-'),
                                    Waktu: formatDate(entry.timestamp),
                                }));
                            } else {
                                const logs = await getConversationBySession(activeSessionId);
                                dynamicRows = logs.flatMap((log: any, index: number) => {
                                    const rows: Array<Record<string, string | number>> = [];
                                    if (log.questionText) {
                                        rows.push({
                                            No: rows.length + index + 1,
                                            Pembicara: 'Interviewer',
                                            Ucapan: String(log.questionText),
                                            Waktu: formatDate(log.timestamp),
                                        });
                                    }
                                    if (log.userAnswer) {
                                        rows.push({
                                            No: rows.length + index + 1,
                                            Pembicara: 'Kandidat',
                                            Ucapan: String(log.userAnswer),
                                            Waktu: formatDate(log.timestamp),
                                        });
                                    }
                                    return rows;
                                });
                            }
                        }
                        break;
                    }
                    case 'score-evaluation': {
                        dynamicRows = sessions.slice(0, 20).map((session: any) => ({
                            Sesi: String(session.id),
                            Kandidat: String(session.candidateName || userData?.displayName || user?.user_metadata?.full_name || '-'),
                            Posisi: String(session.jobRole || '-'),
                            Modul: String(session.moduleType || '-'),
                            Status: String(session.status || '-'),
                            Skor: getSessionScore(session),
                            Tanggal: formatDate(session.createdAt),
                        }));
                        break;
                    }
                    case 'strength-weakness': {
                        if (activeSessionId) {
                            const analysis = await getAnalysisBySession(activeSessionId);
                            if (analysis[0]) {
                                const strengths = Array.isArray((analysis[0] as any).strengths) ? (analysis[0] as any).strengths : [];
                                const weaknesses = Array.isArray((analysis[0] as any).weaknesses) ? (analysis[0] as any).weaknesses : [];
                                dynamicRows = [
                                    ...strengths.map((item: string) => ({ Tipe: 'Kekuatan', Detail: item })),
                                    ...weaknesses.map((item: string) => ({ Tipe: 'Area Perbaikan', Detail: item })),
                                ];
                            }
                        }
                        break;
                    }
                    case 'answer-comparison': {
                        if (activeSessionId) {
                            const session = await getSessionById(activeSessionId);
                            const transcript = Array.isArray((session as any)?.transcript) ? (session as any).transcript : [];
                            const categoryId = String((session as any)?.categoryId || '');
                            const questionBank = categoryId ? await listQuestionsByCategory(categoryId) : [];

                            const pairs: Array<{ question: string; answer: string }> = [];
                            let currentQuestion = '';

                            transcript.forEach((entry: any) => {
                                if (entry.role === 'ai' && entry.text) {
                                    currentQuestion = String(entry.text);
                                }
                                if (entry.role === 'user' && entry.text) {
                                    pairs.push({
                                        question: currentQuestion || '-',
                                        answer: String(entry.text),
                                    });
                                }
                            });

                            if (pairs.length > 0) {
                                dynamicRows = pairs.map((item, index) => ({
                                    No: index + 1,
                                    Pertanyaan: item.question,
                                    'Jawaban Kandidat': item.answer,
                                    'Patokan Jawaban Ideal': (questionBank as any[])[index]?.idealKeywords
                                        ? `Kata kunci ideal: ${(questionBank as any[])[index].idealKeywords}`
                                        : 'Jawaban spesifik, terstruktur (STAR), relevan posisi, dan menyertakan contoh nyata.',
                                }));
                            } else {
                                const logs = await getConversationBySession(activeSessionId);
                                dynamicRows = logs.map((log: any, index: number) => ({
                                    No: index + 1,
                                    Pertanyaan: String(log.questionText || '-'),
                                    'Jawaban Kandidat': String(log.userAnswer || '-'),
                                    'Patokan Jawaban Ideal': (questionBank as any[])[index]?.idealKeywords
                                        ? `Kata kunci ideal: ${(questionBank as any[])[index].idealKeywords}`
                                        : 'Jawaban spesifik, terstruktur (STAR), relevan posisi, dan menyertakan contoh nyata.',
                                }));
                            }
                        }
                        break;
                    }
                    case 'progress-chart': {
                        const validSessions = sessions
                            .map((session: any) => ({
                                ...session,
                                computedScore: getSessionScore(session),
                            }))
                            .filter((session: any) => session.computedScore > 0)
                            .sort((a: any, b: any) => new Date(String(a.createdAt)).getTime() - new Date(String(b.createdAt)).getTime())
                            .slice(-12);

                        dynamicRows = validSessions.map((session: any, index: number) => ({
                            Sesi: index + 1,
                            Tanggal: formatDate(session.createdAt),
                            Posisi: String(session.jobRole || '-'),
                            Skor: Number(session.computedScore),
                        }));
                        break;
                    }
                    case 'development-recommendation': {
                        if (activeSessionId) {
                            const recs = await getRecommendationsBySession(activeSessionId);
                            dynamicRows = recs.map((rec: any) => ({
                                Prioritas: Number(rec.priority || 0),
                                Tipe: String(rec.recommendationType || '-'),
                                Rekomendasi: String(rec.recommendationText || '-'),
                            }));

                            if (!dynamicRows.length) {
                                const analysis = await getAnalysisBySession(activeSessionId);
                                const weaknesses = Array.isArray((analysis[0] as any)?.weaknesses) ? (analysis[0] as any).weaknesses : [];
                                dynamicRows = weaknesses.map((item: string, index: number) => ({
                                    Prioritas: index + 1,
                                    Tipe: 'Perbaikan Jawaban',
                                    Rekomendasi: `Fokus latihan pada: ${item}`,
                                }));
                            }
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
                        const sorted = [...sessions]
                            .map((session: any) => ({ ...session, computedScore: getSessionScore(session) }))
                            .filter((session: any) => session.computedScore > 0)
                            .sort((a: any, b: any) => b.computedScore - a.computedScore || new Date(String(b.createdAt)).getTime() - new Date(String(a.createdAt)).getTime());

                        const top = sorted[0];
                        const finalScore = Number(top?.computedScore || 0);
                        const predicate = finalScore >= 85 ? 'Sangat Baik' : finalScore >= 75 ? 'Baik' : 'Perlu Peningkatan';

                        dynamicRows = top ? [{
                            'Nomor Sertifikat': `INTVX-${String(top.id).slice(0, 8).toUpperCase()}`,
                            'Nama Kandidat': String(top.candidateName || userData?.displayName || user?.user_metadata?.full_name || '-'),
                            Posisi: String(top.jobRole || '-'),
                            Perusahaan: String(top.company || '-'),
                            'Nilai Akhir': finalScore,
                            Predikat: predicate,
                            'Tanggal Terbit': formatDate(top.completedAt || top.createdAt),
                        }] : [];
                        break;
                    }
                    default:
                        dynamicRows = [];
                }

                const allowSampleFallback = !isSessionBasedReport;
                setRows(dynamicRows.length ? dynamicRows : (allowSampleFallback ? (SAMPLE_ROWS[type] || []) : []));
            } catch (err: any) {
                setError(err?.message || 'Gagal memuat data laporan dari backend.');
                setRows(SAMPLE_ROWS[type] || []);
            } finally {
                setLoading(false);
            }
        };

        loadRows();
    }, [type, user, userData, selectedSessionId, fromDate, toDate, isSessionBasedReport]);

    const headers = rows.length > 0 ? Object.keys(rows[0]) : [];
    const certificateRow = type === 'certificate' && rows.length > 0 ? rows[0] : null;

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

    const downloadCertificate = () => {
        if (!certificateRow) return;

        const certificateNumber = String(certificateRow['Nomor Sertifikat'] ?? '-');
        const candidateName = String(certificateRow['Nama Kandidat'] ?? '-');
        const jobRole = String(certificateRow['Posisi'] ?? '-');
        const company = String(certificateRow['Perusahaan'] ?? '-');
        const finalScore = String(certificateRow['Nilai Akhir'] ?? '-');
        const predicate = String(certificateRow['Predikat'] ?? '-');
        const issuedAt = String(certificateRow['Tanggal Terbit'] ?? '-');

        const pdf = new jsPDF({ orientation: 'landscape', unit: 'mm', format: 'a4' });
        const pageWidth = pdf.internal.pageSize.getWidth();
        const pageHeight = pdf.internal.pageSize.getHeight();

        pdf.setFillColor(247, 250, 252);
        pdf.rect(0, 0, pageWidth, pageHeight, 'F');

        pdf.setFillColor(226, 232, 240);
        pdf.circle(-8, -8, 38, 'F');
        pdf.circle(pageWidth + 8, -8, 38, 'F');
        pdf.circle(-8, pageHeight + 8, 38, 'F');
        pdf.circle(pageWidth + 8, pageHeight + 8, 38, 'F');

        const margin = 12;
        pdf.setFillColor(226, 232, 240);
        pdf.roundedRect(margin, margin, pageWidth - (margin * 2), pageHeight - (margin * 2), 6, 6, 'F');

        const innerMargin = 15;
        pdf.setFillColor(255, 255, 255);
        pdf.roundedRect(innerMargin, innerMargin, pageWidth - (innerMargin * 2), pageHeight - (innerMargin * 2), 5, 5, 'F');

        pdf.setDrawColor(51, 65, 85);
        pdf.setLineWidth(0.8);
        pdf.roundedRect(innerMargin, innerMargin, pageWidth - (innerMargin * 2), pageHeight - (innerMargin * 2), 5, 5, 'S');

        pdf.setDrawColor(203, 213, 225);
        pdf.setLineWidth(0.4);
        pdf.roundedRect(innerMargin + 3, innerMargin + 3, pageWidth - ((innerMargin + 3) * 2), pageHeight - ((innerMargin + 3) * 2), 4, 4, 'S');

        pdf.setFillColor(248, 250, 252);
        pdf.setDrawColor(203, 213, 225);
        pdf.roundedRect((pageWidth / 2) - 35, 25, 70, 10, 3, 3, 'FD');
        pdf.setTextColor(51, 65, 85);
        pdf.setFontSize(10);
        pdf.text('INTERVOX • CERTIFIED', pageWidth / 2, 31.5, { align: 'center' });

        pdf.setTextColor(15, 23, 42);
        pdf.setFont('times', 'bold');
        pdf.setFontSize(30);
        pdf.text('SERTIFIKAT LATIHAN INTERVIEW', pageWidth / 2, 48, { align: 'center' });

        pdf.setFont('helvetica', 'normal');
        pdf.setFontSize(12);
        pdf.setTextColor(71, 85, 105);
        pdf.text('Dokumen resmi penyelesaian simulasi interview', pageWidth / 2, 56, { align: 'center' });
        pdf.text('Diberikan kepada', pageWidth / 2, 69, { align: 'center' });

        pdf.setTextColor(30, 64, 175);
        pdf.setFont('times', 'bolditalic');
        pdf.setFontSize(34);
        pdf.text(candidateName, pageWidth / 2, 85, { align: 'center' });

        pdf.setDrawColor(250, 204, 21);
        pdf.setLineWidth(1.2);
        pdf.line((pageWidth / 2) - 56, 89, (pageWidth / 2) + 56, 89);

        pdf.setFont('helvetica', 'normal');
        pdf.setFontSize(12);
        pdf.setTextColor(51, 65, 85);
        const description = `atas penyelesaian sesi latihan interview untuk posisi ${jobRole} di ${company}.`;
        const descLines = pdf.splitTextToSize(description, 210);
        pdf.text(descLines, pageWidth / 2, 100, { align: 'center' });

        const metadataTop = 116;
        pdf.setFillColor(248, 250, 252);
        pdf.setDrawColor(203, 213, 225);
        pdf.roundedRect(34, metadataTop, pageWidth - 68, 36, 3, 3, 'FD');

        pdf.setTextColor(15, 23, 42);
        pdf.setFont('helvetica', 'bold');
        pdf.setFontSize(11);
        pdf.text('Nomor Sertifikat', 40, metadataTop + 10);
        pdf.text('Tanggal Terbit', 148, metadataTop + 10);
        pdf.text('Nilai Akhir', 40, metadataTop + 24);
        pdf.text('Predikat', 148, metadataTop + 24);

        pdf.setFont('helvetica', 'normal');
        pdf.setTextColor(51, 65, 85);
        pdf.text(`: ${certificateNumber}`, 74, metadataTop + 10);
        pdf.text(`: ${issuedAt}`, 175, metadataTop + 10);
        pdf.text(`: ${finalScore}`, 74, metadataTop + 24);
        pdf.text(`: ${predicate}`, 175, metadataTop + 24);

        const filenameSafe = candidateName
            .trim()
            .toLowerCase()
            .normalize('NFKD')
            .replace(/[\u0300-\u036f]/g, '')
            .replace(/[^a-z0-9]+/g, '-')
            .replace(/(^-|-$)/g, '') || 'kandidat';

        pdf.save(`sertifikat-latihan-${filenameSafe}.pdf`);
    };

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
                    {type === 'certificate' && (
                        <button onClick={downloadCertificate} className="bg-white border border-slate-300 text-slate-700 px-4 py-2.5 rounded-xl text-sm font-semibold hover:bg-slate-50 transition-colors flex items-center gap-2" disabled={loading || !certificateRow}><Download className="w-4 h-4" />Download Sertifikat PDF</button>
                    )}
                    {report.exportTypes.includes('Excel') && (
                        <button onClick={downloadCsv} className="bg-white border border-slate-300 text-slate-700 px-4 py-2.5 rounded-xl text-sm font-semibold hover:bg-slate-50 transition-colors flex items-center gap-2"><FileSpreadsheet className="w-4 h-4" />Export Excel</button>
                    )}
                </div>
            </div>

            <div className="mb-4 grid md:grid-cols-3 gap-3 print:hidden">
                <div className="space-y-1">
                    <label className="text-xs text-slate-500">Dari Tanggal</label>
                    <input
                        type="date"
                        value={fromDate}
                        onChange={(e) => setFromDate(e.target.value)}
                        className="w-full px-3 py-2 rounded-lg border border-slate-300 text-sm"
                    />
                </div>
                <div className="space-y-1">
                    <label className="text-xs text-slate-500">Sampai Tanggal</label>
                    <input
                        type="date"
                        value={toDate}
                        onChange={(e) => setToDate(e.target.value)}
                        className="w-full px-3 py-2 rounded-lg border border-slate-300 text-sm"
                    />
                </div>
                {isSessionBasedReport && (
                    <div className="space-y-1">
                        <label className="text-xs text-slate-500">Pilih Session Interview</label>
                        <select
                            value={selectedSessionId}
                            onChange={(e) => setSelectedSessionId(e.target.value)}
                            className="w-full px-3 py-2 rounded-lg border border-slate-300 text-sm bg-white"
                        >
                            <option value="">Session terbaru</option>
                            {sessionOptions.map((session: any) => (
                                <option key={session.id} value={session.id}>
                                    {`${formatDate(session.createdAt)} • ${session.jobRole || '-'} • ${session.candidateName || 'Kandidat'} • ${getSessionScore(session)}`}
                                </option>
                            ))}
                        </select>
                    </div>
                )}
            </div>

            <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden print:overflow-visible">
                {error && <p className="px-4 py-3 text-sm text-red-600 border-b border-slate-100">{error}</p>}

                {type === 'certificate' ? (
                    <div className="p-6 md:p-10">
                        {loading ? (
                            <p className="text-slate-500">Memuat data laporan...</p>
                        ) : !certificateRow ? (
                            <p className="text-slate-500">Belum ada data sertifikat untuk ditampilkan.</p>
                        ) : (
                            <div className="p-[6px] rounded-3xl bg-gradient-to-br from-slate-300 via-indigo-200 to-amber-200">
                                <div className="relative overflow-hidden border-2 border-slate-700 rounded-[20px] px-6 py-8 md:px-12 md:py-12 text-center bg-gradient-to-b from-white to-slate-50">
                                    <div className="absolute -top-20 -left-20 h-44 w-44 rounded-full border-2 border-slate-300/70" />
                                    <div className="absolute -top-20 -right-20 h-44 w-44 rounded-full border-2 border-slate-300/70" />
                                    <div className="absolute -bottom-20 -left-20 h-44 w-44 rounded-full border-2 border-slate-300/70" />
                                    <div className="absolute -bottom-20 -right-20 h-44 w-44 rounded-full border-2 border-slate-300/70" />
                                    <p className="inline-flex items-center justify-center px-4 py-1 rounded-full border border-slate-300 bg-slate-50 text-[11px] tracking-[0.16em] font-bold text-slate-600">INTERVOX • CERTIFIED</p>
                                    <h2 className="text-2xl md:text-4xl font-bold text-slate-900 mt-4">Sertifikat Latihan Interview</h2>
                                    <p className="text-slate-600 mt-2">Dokumen resmi penyelesaian simulasi interview</p>
                                    <p className="text-slate-600 mt-8">Diberikan kepada</p>
                                    <p className="text-3xl md:text-5xl font-extrabold text-indigo-800 mt-2 underline decoration-amber-300 decoration-4 underline-offset-8">{String(certificateRow['Nama Kandidat'] ?? '-')}</p>
                                    <p className="text-slate-600 mt-8 max-w-3xl mx-auto">atas penyelesaian sesi latihan interview untuk posisi <span className="font-semibold text-slate-900">{String(certificateRow['Posisi'] ?? '-')}</span> di <span className="font-semibold text-slate-900">{String(certificateRow['Perusahaan'] ?? '-')}</span>.</p>

                                    <div className="mt-8 grid md:grid-cols-2 gap-3 text-left bg-slate-50/95 border border-slate-200 rounded-xl p-4">
                                        <p className="text-slate-700"><span className="font-semibold text-slate-900">Nomor Sertifikat:</span> {String(certificateRow['Nomor Sertifikat'] ?? '-')}</p>
                                        <p className="text-slate-700"><span className="font-semibold text-slate-900">Tanggal Terbit:</span> {String(certificateRow['Tanggal Terbit'] ?? '-')}</p>
                                        <p className="text-slate-700"><span className="font-semibold text-slate-900">Nilai Akhir:</span> {String(certificateRow['Nilai Akhir'] ?? '-')}</p>
                                        <p className="text-slate-700"><span className="font-semibold text-slate-900">Predikat:</span> {String(certificateRow['Predikat'] ?? '-')}</p>
                                    </div>

                                </div>
                            </div>
                        )}
                    </div>
                ) : (
                    <div className="overflow-x-auto print:overflow-visible">
                        <table className="w-full text-sm print:table-fixed">
                            <thead className="bg-slate-50 text-slate-600">
                                <tr>
                                    {headers.map((header) => (
                                        <th key={header} className="px-4 py-3 text-left font-semibold whitespace-nowrap print:whitespace-normal">{header}</th>
                                    ))}
                                </tr>
                            </thead>
                            <tbody>
                                {loading ? (
                                    <tr><td className="px-4 py-4 text-slate-500" colSpan={Math.max(headers.length, 1)}>Memuat data laporan...</td></tr>
                                ) : rows.length === 0 ? (
                                    <tr><td className="px-4 py-4 text-slate-500" colSpan={Math.max(headers.length, 1)}>Belum ada data laporan untuk ditampilkan.</td></tr>
                                ) : rows.map((row, index) => (
                                    <tr key={index} className="border-t border-slate-100">
                                        {headers.map((header) => (
                                            <td key={header} className="px-4 py-3 text-slate-700 whitespace-nowrap print:whitespace-normal break-words">{String(row[header] ?? '-')}</td>
                                        ))}
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>
        </div>
    );
}
