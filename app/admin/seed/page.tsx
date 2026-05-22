'use client';

import { useState } from 'react';
import { useAuth } from '@/hooks/use-auth';
import {
    createCategory,
    createLecturer,
    createQuestion,
    createScoringCriteria,
    seedSessions,
    upsertUser,
} from '@/lib/data-service';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Database, ArrowLeft, Loader2, CheckCircle, AlertTriangle } from 'lucide-react';

const SAMPLE_SESSIONS = [
    {
        jobRole: 'Frontend Developer',
        company: 'PT Teknologi Maju',
        language: 'Indonesian',
        personality: 'technical',
        difficulty: 'medium',
        candidateName: 'Budi Santoso',
        candidateEmail: 'budi@example.com',
        yearsExperience: '1-2 tahun',
        education: 'S1',
        status: 'completed',
        score: 82,
        analysis: {
            strengths: [
                'Komunikasi yang jelas dan terstruktur',
                'Pemahaman yang baik tentang React dan component lifecycle',
                'Mampu menjelaskan konsep state management dengan baik',
                'Sikap positif dan antusias terhadap pekerjaan',
            ],
            weaknesses: [
                'Kurang memberikan contoh spesifik dari pengalaman nyata',
                'Perlu meningkatkan pemahaman tentang performance optimization',
            ],
            overallFeedback: 'Budi menunjukkan fondasi yang kuat untuk posisi Frontend Developer. Komunikasi dan pemahaman teknologi cukup baik, namun perlu lebih banyak contoh konkret dari pengalaman kerja sebelumnya. Disarankan untuk memperdalam pengetahuan tentang Web Vitals dan optimasi performa.',
            scores: { communication: 88, technical: 75, problemSolving: 80, cultureFit: 85 },
        },
        transcript: [
            { role: 'ai', text: 'Selamat datang Budi! Saya akan mewawancarai kamu untuk posisi Frontend Developer. Coba ceritakan tentang dirimu dan pengalamanmu di dunia frontend.' },
            { role: 'user', text: 'Terima kasih. Saya Budi, saya punya pengalaman 2 tahun bekerja sebagai frontend developer. Saya terbiasa menggunakan React dan TypeScript untuk membangun aplikasi web.' },
            { role: 'ai', text: 'Bagus! Bisa kamu jelaskan apa perbedaan antara state dan props di React, dan kapan kamu menggunakan masing-masing?' },
            { role: 'user', text: 'Props adalah data yang dikirim dari parent ke child component, sifatnya read-only. Sedangkan state adalah data internal component yang bisa berubah dan menyebabkan re-render ketika berubah.' },
        ],
        selfAssessment: {
            selfScore: 4,
            confidenceLevel: 'Cukup Percaya Diri',
            difficultyRating: 3,
            whatWentWell: 'Saya cukup lancar menjelaskan konsep dasar React',
            whatToImprove: 'Perlu lebih banyak contoh dari proyek nyata',
            platformRating: 5,
            wouldUseAgain: 'Ya, pasti!',
        },
        startedAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
        completedAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000 + 35 * 60 * 1000).toISOString(),
        createdAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
    },
    {
        jobRole: 'Data Analyst',
        company: 'Bank Digital Nusantara',
        language: 'Indonesian',
        personality: 'hr',
        difficulty: 'medium',
        candidateName: 'Sari Dewi',
        candidateEmail: 'sari@example.com',
        yearsExperience: '3-5 tahun',
        education: 'S1',
        status: 'completed',
        score: 74,
        analysis: {
            strengths: [
                'Pengalaman yang relevan dengan data analysis',
                'Familiar dengan tools seperti Python dan SQL',
                'Kemampuan storytelling data yang cukup baik',
            ],
            weaknesses: [
                'Perlu meningkatkan pemahaman tentang machine learning',
                'Contoh project masih kurang spesifik',
                'Kurang percaya diri saat menjawab pertanyaan teknis mendalam',
            ],
            overallFeedback: 'Sari memiliki fondasi yang baik dalam data analysis. Penguasaan SQL dan Python cukup solid, namun perlu mengembangkan kemampuan dalam area ML dan memberikan contoh dampak bisnis yang lebih konkret dari analisis yang dilakukan.',
            scores: { communication: 78, technical: 70, problemSolving: 72, cultureFit: 76 },
        },
        transcript: [
            { role: 'ai', text: 'Halo Sari! Hari ini kita akan berdiskusi tentang pengalamanmu sebagai Data Analyst. Bisa ceritakan project data analysis yang paling membuatmu bangga?' },
            { role: 'user', text: 'Saya pernah membuat dashboard untuk monitoring penjualan real-time menggunakan Python dan Tableau. Dashboard ini membantu tim sales meningkatkan efisiensi pelaporan mereka.' },
        ],
        selfAssessment: {
            selfScore: 3,
            confidenceLevel: 'Agak Gugup',
            difficultyRating: 4,
            whatWentWell: 'Mampu menjawab pertanyaan tentang SQL dengan baik',
            whatToImprove: 'Perlu lebih siap dengan pertanyaan tentang statistik',
            platformRating: 4,
            wouldUseAgain: 'Ya, pasti!',
        },
        startedAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
        completedAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000 + 28 * 60 * 1000).toISOString(),
        createdAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
    },
    {
        jobRole: 'Product Manager',
        company: 'Startup GoTech',
        language: 'Indonesian',
        personality: 'behavioral',
        difficulty: 'hard',
        candidateName: 'Rizky Pratama',
        candidateEmail: 'rizky@example.com',
        yearsExperience: '5-10 tahun',
        education: 'S2',
        status: 'completed',
        score: 91,
        analysis: {
            strengths: [
                'Kemampuan komunikasi yang sangat baik',
                'Pengalaman yang kaya dalam product development',
                'Sangat baik dalam menjelaskan trade-off keputusan produk',
                'Mampu menunjukkan dampak bisnis yang terukur',
                'Kepemimpinan dan kolaborasi lintas tim yang solid',
            ],
            weaknesses: [
                'Bisa lebih mendalam dalam aspek teknis produk',
            ],
            overallFeedback: 'Rizky adalah kandidat yang sangat kuat untuk posisi Product Manager senior. Kemampuan storytelling, pemahaman bisnis, dan track record yang terukur sangat mengesankan. Hanya perlu sedikit peningkatan pada depth teknisnya.',
            scores: { communication: 95, technical: 82, problemSolving: 92, cultureFit: 95 },
        },
        transcript: [
            { role: 'ai', text: 'Selamat datang Rizky. Untuk posisi Product Manager senior ini, bisa kamu ceritakan sebuah produk yang kamu bangun dari nol dan apa dampaknya?' },
            { role: 'user', text: 'Di perusahaan sebelumnya, saya memimpin pengembangan fitur pembayaran cicilan yang meningkatkan conversion rate sebesar 34% dan berkontribusi 15 miliar rupiah revenue tambahan dalam 6 bulan pertama.' },
        ],
        selfAssessment: {
            selfScore: 5,
            confidenceLevel: 'Sangat Percaya Diri',
            difficultyRating: 3,
            whatWentWell: 'Semua pertanyaan terjawab dengan baik dengan data konkret',
            whatToImprove: 'Mungkin bisa sedikit lebih ringkas di beberapa jawaban',
            platformRating: 5,
            wouldUseAgain: 'Ya, pasti!',
        },
        startedAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
        completedAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000 + 42 * 60 * 1000).toISOString(),
        createdAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
    },
    {
        jobRole: 'Backend Engineer',
        company: 'E-commerce Toko Hebat',
        language: 'Indonesian',
        personality: 'technical',
        difficulty: 'hard',
        candidateName: 'Andi Wijaya',
        candidateEmail: 'andi@example.com',
        yearsExperience: '3-5 tahun',
        education: 'S1',
        status: 'completed',
        score: 67,
        analysis: {
            strengths: [
                'Familiar dengan konsep microservices',
                'Pengalaman dengan database yang cukup baik',
            ],
            weaknesses: [
                'Pemahaman tentang system design masih perlu ditingkatkan',
                'Kurang familiar dengan distributed systems',
                'Jawaban terlalu singkat, kurang mendalami pertanyaan',
            ],
            overallFeedback: 'Andi memiliki kemampuan coding yang cukup, namun untuk level senior perlu meningkatkan pemahaman tentang scalability dan distributed systems. Disarankan untuk mempelajari lebih dalam tentang CAP theorem, event-driven architecture, dan pengalaman langsung dengan sistem high-traffic.',
            scores: { communication: 65, technical: 68, problemSolving: 65, cultureFit: 70 },
        },
        transcript: [
            { role: 'ai', text: 'Halo Andi! Saya akan menguji pemahamanmu tentang backend engineering. Bagaimana kamu mendesain sistem yang bisa menangani 1 juta request per detik?' },
            { role: 'user', text: 'Kita perlu menggunakan load balancer dan horizontally scale server kita. Juga perlu caching dengan Redis.' },
        ],
        selfAssessment: {
            selfScore: 2,
            confidenceLevel: 'Sangat Gugup',
            difficultyRating: 5,
            whatWentWell: 'Saya cukup lancar menjawab pertanyaan tentang database',
            whatToImprove: 'Perlu belajar lebih dalam tentang system design dan distributed systems',
            platformRating: 5,
            platformFeedback: 'Sangat membantu untuk mengetahui kelemahan saya!',
            wouldUseAgain: 'Ya, pasti!',
        },
        startedAt: new Date(Date.now() - 12 * 60 * 60 * 1000).toISOString(),
        completedAt: new Date(Date.now() - 12 * 60 * 60 * 1000 + 22 * 60 * 1000).toISOString(),
        createdAt: new Date(Date.now() - 12 * 60 * 60 * 1000).toISOString(),
    },
];

const SAMPLE_CATEGORIES = [
    { categoryName: 'General Interview', description: 'Pertanyaan umum seputar profil kandidat', moduleType: 'Kerja', difficultyLevel: 'easy' },
    { categoryName: 'Technical Interview', description: 'Pertanyaan teknis sesuai kompetensi inti', moduleType: 'Kerja', difficultyLevel: 'medium' },
    { categoryName: 'Behavioral Interview', description: 'Pertanyaan perilaku dan pengalaman kerja', moduleType: 'Kerja', difficultyLevel: 'medium' },
    { categoryName: 'Case Interview', description: 'Studi kasus analitis dan pemecahan masalah', moduleType: 'Kerja', difficultyLevel: 'hard' },
    { categoryName: 'Leadership Interview', description: 'Pertanyaan kepemimpinan dan kolaborasi tim', moduleType: 'Kerja', difficultyLevel: 'hard' },
];

const SAMPLE_QUESTIONS: Record<string, Array<{ questionText: string; idealKeywords: string; difficultyLevel: string }>> = {
    'General Interview': [
        { questionText: 'Ceritakan tentang diri Anda secara singkat.', idealKeywords: 'ringkas, relevan, pengalaman, motivasi', difficultyLevel: 'easy' },
        { questionText: 'Mengapa Anda tertarik pada posisi ini?', idealKeywords: 'motivasi, value perusahaan, kontribusi', difficultyLevel: 'easy' },
        { questionText: 'Apa kelebihan utama Anda?', idealKeywords: 'kekuatan, bukti konkret, dampak', difficultyLevel: 'easy' },
    ],
    'Technical Interview': [
        { questionText: 'Bagaimana Anda memastikan kualitas kode dalam tim?', idealKeywords: 'code review, testing, linting, CI/CD', difficultyLevel: 'medium' },
        { questionText: 'Jelaskan pengalaman Anda dengan debugging issue produksi.', idealKeywords: 'observability, root cause, rollback, prevention', difficultyLevel: 'medium' },
        { questionText: 'Bagaimana Anda mengoptimalkan performa aplikasi?', idealKeywords: 'profiling, bottleneck, caching, optimization', difficultyLevel: 'hard' },
    ],
    'Behavioral Interview': [
        { questionText: 'Ceritakan situasi ketika Anda menghadapi konflik dalam tim.', idealKeywords: 'STAR, komunikasi, solusi, hasil', difficultyLevel: 'medium' },
        { questionText: 'Bagaimana Anda menangani tekanan deadline?', idealKeywords: 'prioritas, time management, koordinasi', difficultyLevel: 'medium' },
        { questionText: 'Berikan contoh ketika Anda belajar teknologi baru dengan cepat.', idealKeywords: 'inisiatif, pembelajaran, implementasi', difficultyLevel: 'medium' },
    ],
    'Case Interview': [
        { questionText: 'Bagaimana pendekatan Anda untuk meningkatkan retensi pengguna aplikasi?', idealKeywords: 'analisis data, hipotesis, eksperimen, metrik', difficultyLevel: 'hard' },
        { questionText: 'Jika sistem down saat traffic tinggi, langkah apa yang Anda ambil?', idealKeywords: 'incident response, mitigasi, komunikasi, RCA', difficultyLevel: 'hard' },
        { questionText: 'Bagaimana Anda memprioritaskan backlog fitur saat resource terbatas?', idealKeywords: 'impact-effort, stakeholder, roadmap', difficultyLevel: 'hard' },
    ],
    'Leadership Interview': [
        { questionText: 'Bagaimana Anda memimpin tim lintas fungsi?', idealKeywords: 'alignment, komunikasi, ownership, outcome', difficultyLevel: 'hard' },
        { questionText: 'Ceritakan pengalaman mentoring anggota tim junior.', idealKeywords: 'coaching, feedback, growth, hasil', difficultyLevel: 'medium' },
        { questionText: 'Bagaimana Anda mengambil keputusan sulit dalam tim?', idealKeywords: 'data-driven, risiko, transparansi, evaluasi', difficultyLevel: 'hard' },
    ],
};

const SAMPLE_CRITERIA = [
    { criteriaName: 'Communication', weightScore: 25, idealKeywords: 'jelas, terstruktur, percaya diri', description: 'Menilai kejelasan dan efektivitas komunikasi kandidat' },
    { criteriaName: 'Technical Skills', weightScore: 30, idealKeywords: 'akurasi, best practice, relevan', description: 'Menilai penguasaan teknis sesuai posisi yang dilamar' },
    { criteriaName: 'Problem Solving', weightScore: 25, idealKeywords: 'analitis, sistematis, solusi', description: 'Menilai kemampuan analisis masalah dan solusi' },
    { criteriaName: 'Culture Fit', weightScore: 20, idealKeywords: 'kolaborasi, nilai, adaptasi', description: 'Menilai kecocokan nilai kerja dan perilaku profesional' },
];

const SAMPLE_LECTURERS = [
    { fullName: 'Dr. Rina Pratama, S.Kom., M.Kom.', email: 'rina.pratama@kampus.ac.id', department: 'Teknik Informatika', faculty: 'FTI', phone: '081200000001' },
    { fullName: 'Andri Setiawan, S.T., M.T.', email: 'andri.setiawan@kampus.ac.id', department: 'Sistem Informasi', faculty: 'FTI', phone: '081200000002' },
    { fullName: 'Nadia Khairunnisa, S.Kom., M.Cs.', email: 'nadia.khairunnisa@kampus.ac.id', department: 'Teknik Informatika', faculty: 'FTI', phone: '081200000003' },
];

export default function SeedPage() {
    const { user, loading } = useAuth();
    const router = useRouter();
    const [status, setStatus] = useState<'idle' | 'seeding' | 'done' | 'error'>('idle');
    const [seededCount, setSeededCount] = useState(0);
    const [error, setError] = useState('');

    const handleSeed = async () => {
        if (!user) return;
        setStatus('seeding');
        setError('');
        setSeededCount(0);

        try {
            await upsertUser(user.id, {
                email: user.email,
                displayName: user.user_metadata?.full_name || 'Admin Seeder',
                role: 'head_of_program',
                updatedAt: new Date().toISOString(),
            });

            const seededCategoryMap = new Map<string, string>();

            for (const category of SAMPLE_CATEGORIES) {
                const created = await createCategory({
                    ...category,
                    isActive: true,
                } as any);
                seededCategoryMap.set(category.categoryName, (created as any).id);
            }

            for (const [categoryName, questions] of Object.entries(SAMPLE_QUESTIONS)) {
                const categoryId = seededCategoryMap.get(categoryName);
                if (!categoryId) continue;

                for (const question of questions) {
                    await createQuestion({
                        categoryId,
                        questionText: question.questionText,
                        idealKeywords: question.idealKeywords,
                        difficultyLevel: question.difficultyLevel,
                        createdBy: user.id,
                    });
                }
            }

            for (const criteria of SAMPLE_CRITERIA) {
                await createScoringCriteria({
                    ...criteria,
                    isActive: true,
                } as any);
            }

            for (const lecturer of SAMPLE_LECTURERS) {
                await createLecturer(lecturer as any);
            }

            await seedSessions(user.id, SAMPLE_SESSIONS as unknown as Record<string, unknown>[]);
            setSeededCount(
                SAMPLE_SESSIONS.length +
                SAMPLE_CATEGORIES.length +
                Object.values(SAMPLE_QUESTIONS).reduce((sum, items) => sum + items.length, 0) +
                SAMPLE_CRITERIA.length +
                SAMPLE_LECTURERS.length,
            );
            setStatus('done');
        } catch (err: any) {
            console.error('Seeding error:', err);
            setError(err.message || 'Gagal melakukan seeding data.');
            setStatus('error');
        }
    };

    if (loading) {
        return (
            <div className="flex-1 flex items-center justify-center">
                <div className="w-10 h-10 border-4 border-indigo-200 border-t-indigo-600 rounded-full animate-spin" />
            </div>
        );
    }

    if (!user) {
        return (
            <div className="flex-1 flex items-center justify-center p-4">
                <div className="bg-white p-8 rounded-2xl shadow-sm border border-slate-200 text-center max-w-md">
                    <h2 className="text-xl font-bold text-slate-900 mb-2">Login Required</h2>
                    <p className="text-slate-600 mb-6">Kamu perlu login untuk melakukan seed data.</p>
                    <Link href="/auth" className="bg-indigo-600 text-white px-6 py-3 rounded-xl font-medium hover:bg-indigo-700 transition-colors inline-block">
                        Login
                    </Link>
                </div>
            </div>
        );
    }

    return (
        <div className="container mx-auto px-4 py-8 md:py-12 max-w-2xl">
            <div className="mb-6">
                <Link href="/dashboard" className="inline-flex items-center text-sm text-slate-500 hover:text-slate-900 transition-colors mb-2">
                    <ArrowLeft className="w-4 h-4 mr-1" />
                    Kembali ke Dashboard
                </Link>
                <h1 className="text-2xl md:text-3xl font-display font-bold text-slate-900">Data Seeding</h1>
                <p className="text-slate-500 mt-1 text-sm">Masukkan data contoh hasil interview untuk keperluan demonstrasi.</p>
            </div>

            <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 md:p-8">
                <div className="flex items-start gap-4 p-4 bg-amber-50 border border-amber-200 rounded-xl mb-6">
                    <AlertTriangle className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
                    <div className="text-sm text-amber-800">
                        <p className="font-semibold mb-1">Perhatian</p>
                        <p>Halaman ini akan menambahkan <strong>{SAMPLE_SESSIONS.length} data contoh interview</strong> ke akun kamu saat ini ({user.email}). Gunakan hanya untuk keperluan demonstrasi atau dev.</p>
                    </div>
                </div>

                <h2 className="text-sm font-bold text-slate-500 uppercase tracking-wider mb-4">Data yang akan ditambahkan:</h2>
                <div className="space-y-3 mb-6">
                    {SAMPLE_SESSIONS.map((s, i) => (
                        <div key={i} className="flex items-center justify-between p-3 bg-slate-50 rounded-xl border border-slate-100">
                            <div>
                                <p className="text-sm font-semibold text-slate-800">{s.jobRole}</p>
                                <p className="text-xs text-slate-500">{s.company} · {s.language} · {s.difficulty}</p>
                            </div>
                            <div className="flex items-center gap-2">
                                <span className="text-sm font-bold text-indigo-600">{s.score}/100</span>
                                <span className="text-xs bg-emerald-100 text-emerald-700 px-2 py-0.5 rounded-full font-medium">
                                    {s.status}
                                </span>
                            </div>
                        </div>
                    ))}
                </div>

                {status === 'done' && (
                    <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-xl flex items-center gap-3 mb-4">
                        <CheckCircle className="w-5 h-5 text-emerald-600 flex-shrink-0" />
                        <div>
                            <p className="text-sm font-semibold text-emerald-800">Berhasil!</p>
                            <p className="text-sm text-emerald-700">{seededCount} data interview berhasil ditambahkan ke akun kamu.</p>
                        </div>
                    </div>
                )}

                {status === 'error' && (
                    <div className="p-4 bg-red-50 border border-red-200 rounded-xl flex items-center gap-3 mb-4">
                        <AlertTriangle className="w-5 h-5 text-red-600 flex-shrink-0" />
                        <p className="text-sm text-red-700">{error}</p>
                    </div>
                )}

                {status === 'seeding' && (
                    <div className="p-4 bg-indigo-50 border border-indigo-200 rounded-xl flex items-center gap-3 mb-4">
                        <Loader2 className="w-5 h-5 text-indigo-600 animate-spin flex-shrink-0" />
                        <p className="text-sm text-indigo-700">Menyeeding data... ({seededCount}/{SAMPLE_SESSIONS.length})</p>
                    </div>
                )}

                <div className="flex flex-col sm:flex-row gap-3">
                    <button
                        onClick={handleSeed}
                        disabled={status === 'seeding' || status === 'done'}
                        className="flex-1 bg-indigo-600 text-white py-3 rounded-xl font-semibold hover:bg-indigo-700 transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
                    >
                        {status === 'seeding' ? <Loader2 className="w-4 h-4 animate-spin" /> : <Database className="w-4 h-4" />}
                        {status === 'seeding' ? 'Seeding...' : status === 'done' ? 'Selesai!' : 'Tambahkan Data Contoh'}
                    </button>
                    {status === 'done' && (
                        <Link
                            href="/dashboard"
                            className="flex-1 bg-emerald-600 text-white py-3 rounded-xl font-semibold hover:bg-emerald-700 transition-colors flex items-center justify-center gap-2 text-center"
                        >
                            Lihat Dashboard →
                        </Link>
                    )}
                </div>
            </div>
        </div>
    );
}
