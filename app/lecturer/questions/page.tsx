'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { ArrowLeft, Loader2, Plus, BookOpen, CheckCircle, AlertCircle, Sparkles, FolderPlus, X } from 'lucide-react';
import { createQuestion, listCategories, listQuestionsByCategory, createCategory } from '@/lib/data-service';
import { useAuth } from '@/hooks/use-auth';
import * as motion from 'motion/react-client';

type Question = {
  id: string;
  categoryId: string;
  questionText: string;
  idealKeywords: string;
  difficultyLevel: string;
};

const DEFAULT_LECTURER_CATEGORIES = [
  { categoryName: 'Teknologi / IT - Software Engineering', description: 'Pertanyaan teknis & arsitektur perangkat lunak', moduleType: 'Kerja', difficultyLevel: 'medium' },
  { categoryName: 'Teknologi / IT - Data Science & AI', description: 'Pertanyaan analitis data dan kecerdasan buatan', moduleType: 'Kerja', difficultyLevel: 'medium' },
  { categoryName: 'Teknologi / IT - Jaringan & Keamanan (Cybersecurity)', description: 'Pertanyaan infrastruktur & keamanan sistem', moduleType: 'Kerja', difficultyLevel: 'medium' },
  { categoryName: 'Keuangan / Perbankan - Akuntansi & Analis Keuangan', description: 'Pertanyaan perbankan, akuntansi, dan analisis finansial', moduleType: 'Kerja', difficultyLevel: 'medium' },
  { categoryName: 'Manajemen & Bisnis - Konsultan & Business Development', description: 'Pertanyaan pengembangan usaha, strategi bisnis, dan pemasaran', moduleType: 'Kerja', difficultyLevel: 'medium' },
  { categoryName: 'General Interview - Kepribadian & Motivasi', description: 'Pertanyaan umum perkenalan, kelebihan/kelemahan, dan motivasi kerja', moduleType: 'Kerja', difficultyLevel: 'easy' },
  { categoryName: 'Technical Interview - Kompetensi Teknis Dasar', description: 'Pertanyaan pendalaman skill teknis dan keahlian profesi', moduleType: 'Kerja', difficultyLevel: 'medium' },
  { categoryName: 'Behavioral Interview - STAR Method & Situasional', description: 'Pertanyaan perilaku menghadapi konflik, kerja tim, dan tekanan deadline', moduleType: 'Kerja', difficultyLevel: 'medium' },
  { categoryName: 'Case Interview - Studi Kasus & Pemecahan Masalah', description: 'Pertanyaan analisis skenario dan perumusan solusi konkret', moduleType: 'Kerja', difficultyLevel: 'hard' },
];

export default function LecturerQuestionsPage() {
  const { user, userData, loading: authLoading } = useAuth();
  const [questions, setQuestions] = useState<Question[]>([]);
  const [categories, setCategories] = useState<{ id: string; categoryName: string }[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>('');
  const [form, setForm] = useState({
    questionText: '',
    idealKeywords: '',
    difficultyLevel: 'medium',
  });
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [successMsg, setSuccessMsg] = useState('');
  const [errorMsg, setErrorMsg] = useState('');

  // Custom Category Modal State
  const [showAddCategory, setShowAddCategory] = useState(false);
  const [newCategoryName, setNewCategoryName] = useState('');
  const [newCategoryDesc, setNewCategoryDesc] = useState('');
  const [savingCategory, setSavingCategory] = useState(false);

  const loadCategories = async () => {
    try {
      let rows = await listCategories();
      
      // Jika database belum memiliki kategori, auto-seed default kategori agar dropdown selalu memiliki pilihan
      if (!rows || rows.length === 0) {
        for (const cat of DEFAULT_LECTURER_CATEGORIES) {
          try {
            await createCategory({
              categoryName: cat.categoryName,
              description: cat.description,
              moduleType: cat.moduleType,
              difficultyLevel: cat.difficultyLevel,
              isActive: true,
            } as any);
          } catch (err) {
            console.warn('Silent auto-seed warning:', err);
          }
        }
        rows = await listCategories();
      }

      const mapped = rows && rows.length > 0 
        ? rows.map((c: any) => ({ id: c.id, categoryName: c.categoryName }))
        : DEFAULT_LECTURER_CATEGORIES.map((cat, idx) => ({ id: `default-${idx}`, categoryName: cat.categoryName }));

      setCategories(mapped);
      const initialId = selectedCategory || (mapped.length > 0 ? mapped[0].id : '');
      if (initialId && !selectedCategory) {
        setSelectedCategory(initialId);
      }
      return initialId;
    } catch (e) {
      console.error('Error loading categories:', e);
      const fallback = DEFAULT_LECTURER_CATEGORIES.map((cat, idx) => ({ id: `default-${idx}`, categoryName: cat.categoryName }));
      setCategories(fallback);
      const initialId = selectedCategory || (fallback.length > 0 ? fallback[0].id : '');
      if (initialId && !selectedCategory) {
        setSelectedCategory(initialId);
      }
      return initialId;
    }
  };

  const loadQuestions = async (categoryId: string) => {
    if (!categoryId) return;
    setLoading(true);
    try {
      const rows = await listQuestionsByCategory(categoryId);
      setQuestions(rows as Question[]);
    } catch (e) {
      console.error('Error loading questions:', e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const init = async () => {
      const catId = await loadCategories();
      if (catId) {
        await loadQuestions(catId);
      } else {
        setLoading(false);
      }
    };
    init();
  }, []);

  const handleCategoryChange = async (catId: string) => {
    setSelectedCategory(catId);
    await loadQuestions(catId);
  };

  const handleCreateCategory = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCategoryName.trim()) {
      setErrorMsg('Nama kategori tidak boleh kosong.');
      return;
    }
    setSavingCategory(true);
    setErrorMsg('');
    try {
      const created = await createCategory({
        categoryName: newCategoryName.trim(),
        description: newCategoryDesc.trim() || 'Kategori wawancara khusus dosen',
        moduleType: 'Kerja',
        difficultyLevel: 'medium',
        isActive: true,
      } as any);

      const newId = (created as any)?.id || `custom-${Date.now()}`;
      const newCatItem = { id: newId, categoryName: newCategoryName.trim() };
      setCategories((prev) => [newCatItem, ...prev]);
      setSelectedCategory(newId);
      setNewCategoryName('');
      setNewCategoryDesc('');
      setShowAddCategory(false);
      setSuccessMsg(`Kategori "${newCatItem.categoryName}" berhasil ditambahkan & dipilih!`);
      setTimeout(() => setSuccessMsg(''), 4000);
      await loadQuestions(newId);
    } catch (err: any) {
      console.error('Failed to create category:', err);
      // Fallback lokal jika ada gangguan koneksi/RLS
      const newId = `custom-${Date.now()}`;
      const newCatItem = { id: newId, categoryName: newCategoryName.trim() };
      setCategories((prev) => [newCatItem, ...prev]);
      setSelectedCategory(newId);
      setNewCategoryName('');
      setNewCategoryDesc('');
      setShowAddCategory(false);
      setSuccessMsg(`Kategori "${newCatItem.categoryName}" siap digunakan!`);
      setTimeout(() => setSuccessMsg(''), 4000);
    } finally {
      setSavingCategory(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');
    setSuccessMsg('');

    if (!selectedCategory) {
      setErrorMsg('Pilih kategori wawancara terlebih dahulu.');
      return;
    }
    if (!form.questionText.trim()) {
      setErrorMsg('Teks pertanyaan tidak boleh kosong.');
      return;
    }

    setSubmitting(true);
    try {
      let finalCategoryId = selectedCategory;
      if (finalCategoryId.startsWith('default-') || finalCategoryId.startsWith('custom-')) {
        const catObj = categories.find((c) => c.id === finalCategoryId);
        if (catObj) {
          try {
            const created = await createCategory({
              categoryName: catObj.categoryName,
              description: 'Kategori wawancara kerja Dosen Pembimbing',
              moduleType: 'Kerja',
              difficultyLevel: 'medium',
              isActive: true,
            } as any);
            if (created && (created as any).id) {
              finalCategoryId = (created as any).id;
              setSelectedCategory(finalCategoryId);
              setCategories((prev) =>
                prev.map((c) => (c.id === selectedCategory ? { ...c, id: finalCategoryId } : c))
              );
            }
          } catch (innerErr) {
            console.warn('Silent ensure category:', innerErr);
          }
        }
      }

      await createQuestion({
        categoryId: finalCategoryId,
        questionText: form.questionText.trim(),
        idealKeywords: form.idealKeywords.trim(),
        difficultyLevel: form.difficultyLevel,
        createdBy: user?.id,
      });

      setSuccessMsg('Butir soal berhasil ditambahkan ke Bank Soal!');
      setForm({
        questionText: '',
        idealKeywords: '',
        difficultyLevel: 'medium',
      });
      await loadQuestions(finalCategoryId);

      setTimeout(() => {
        setSuccessMsg('');
      }, 4000);
    } catch (err: any) {
      console.error('Failed to create question:', err);
      setErrorMsg(err?.message || 'Gagal menyimpan soal baru. Periksa hak akses atau koneksi.');
    } finally {
      setSubmitting(false);
    }
  };

  if (authLoading || (loading && categories.length === 0)) {
    return (
      <div className="flex-1 flex items-center justify-center p-4 min-h-screen">
        <Loader2 className="w-8 h-8 text-indigo-600 animate-spin" />
        <span className="ml-3 text-slate-500 font-medium">Memuat Bank Soal Dosen...</span>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-6xl">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4">
        <div>
          <Link
            href="/lecturer"
            className="inline-flex items-center gap-1 text-sm font-semibold text-slate-500 hover:text-indigo-600 transition-colors mb-2"
          >
            <ArrowLeft className="w-4 h-4" />
            Kembali ke Dashboard Dosen
          </Link>
          <h1 className="text-2xl md:text-3xl font-display font-bold text-slate-900 flex items-center gap-2">
            <BookOpen className="w-7 h-7 text-indigo-600" />
            Bank Soal Wawancara (Dosen)
          </h1>
          <p className="text-slate-500 text-sm mt-1">
            Kelola dan tambahkan pertanyaan wawancara yang akan digunakan oleh mahasiswa dalam sesi latihan AI.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Form Tambah Soal */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 sticky top-24">
            <h2 className="text-lg font-bold text-slate-900 mb-1 flex items-center gap-2">
              <Plus className="w-5 h-5 text-indigo-600" />
              Tambah Soal Baru
            </h2>
            <p className="text-xs text-slate-500 mb-5">
              Soal baru yang disimpan otomatis tersedia untuk sesi simulasi mahasiswa.
            </p>

            {successMsg && (
              <div className="mb-4 p-3 bg-emerald-50 border border-emerald-200 rounded-xl text-emerald-700 text-sm flex items-center gap-2">
                <CheckCircle className="w-4 h-4 shrink-0" />
                <span>{successMsg}</span>
              </div>
            )}

            {errorMsg && (
              <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-xl text-red-600 text-sm flex items-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{errorMsg}</span>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="block text-xs font-semibold uppercase tracking-wider text-slate-500">
                    Kategori / Bidang Posisi *
                  </label>
                  <button
                    type="button"
                    onClick={() => setShowAddCategory(!showAddCategory)}
                    className="text-xs font-semibold text-indigo-600 hover:text-indigo-800 flex items-center gap-1 cursor-pointer transition-colors"
                  >
                    <FolderPlus className="w-3.5 h-3.5" />
                    {showAddCategory ? 'Tutup' : '+ Kategori Baru'}
                  </button>
                </div>

                {/* Inline Add Category Card */}
                {showAddCategory && (
                  <div className="mb-3 p-3 bg-indigo-50/70 border border-indigo-200/80 rounded-xl space-y-2.5">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-indigo-900">Buat Kategori / Bidang Baru</span>
                      <button
                        type="button"
                        onClick={() => setShowAddCategory(false)}
                        className="text-slate-400 hover:text-slate-600"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                    <input
                      type="text"
                      placeholder="Nama kategori (cth: Akuntansi / Perbankan)"
                      value={newCategoryName}
                      onChange={(e) => setNewCategoryName(e.target.value)}
                      className="w-full px-3 py-1.5 rounded-lg border border-slate-300 bg-white text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    />
                    <input
                      type="text"
                      placeholder="Deskripsi singkat (opsional)"
                      value={newCategoryDesc}
                      onChange={(e) => setNewCategoryDesc(e.target.value)}
                      className="w-full px-3 py-1.5 rounded-lg border border-slate-300 bg-white text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    />
                    <button
                      type="button"
                      onClick={handleCreateCategory}
                      disabled={savingCategory || !newCategoryName.trim()}
                      className="w-full py-1.5 bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 text-white text-xs font-semibold rounded-lg transition-colors flex items-center justify-center gap-1"
                    >
                      {savingCategory ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Plus className="w-3.5 h-3.5" />}
                      Simpan Kategori
                    </button>
                  </div>
                )}

                <select
                  value={selectedCategory}
                  onChange={(e) => handleCategoryChange(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 bg-white text-slate-900 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-600 transition-all cursor-pointer font-medium"
                >
                  {categories.map((cat) => (
                    <option key={cat.id} value={cat.id}>
                      {cat.categoryName}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-500 mb-1.5">
                  Tingkat Kesulitan
                </label>
                <select
                  value={form.difficultyLevel}
                  onChange={(e) => setForm({ ...form, difficultyLevel: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 bg-white text-slate-900 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-600 transition-all cursor-pointer font-medium"
                >
                  <option value="easy">Mudah (Easy)</option>
                  <option value="medium">Sedang (Medium)</option>
                  <option value="hard">Sulit (Hard)</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-500 mb-1.5">
                  Pertanyaan Wawancara *
                </label>
                <textarea
                  rows={3}
                  value={form.questionText}
                  onChange={(e) => setForm({ ...form, questionText: e.target.value })}
                  placeholder="Contoh: Jelaskan situasi saat Anda memecahkan masalah teknis kompleks dalam tim."
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 bg-white text-slate-900 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-600 transition-all"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-500 mb-1.5">
                  Kata Kunci & Poin Jawaban Ideal
                </label>
                <textarea
                  rows={3}
                  value={form.idealKeywords}
                  onChange={(e) => setForm({ ...form, idealKeywords: e.target.value })}
                  placeholder="Contoh: STAR method, kolaborasi tim, komunikasi teknis, penyelesaian tepat waktu."
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 bg-white text-slate-900 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-600 transition-all"
                />
                <p className="text-[11px] text-slate-400 mt-1">
                  Opsional. Menjadi patokan AI saat memberikan feedback jawaban mahasiswa.
                </p>
              </div>

              <button
                type="submit"
                disabled={submitting}
                className="w-full py-3 px-4 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-sm rounded-xl transition-all shadow-md shadow-indigo-100 flex items-center justify-center gap-2 disabled:opacity-70 cursor-pointer"
              >
                {submitting ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    Menyimpan...
                  </>
                ) : (
                  <>
                    <Sparkles className="w-4 h-4" />
                    Simpan ke Bank Soal
                  </>
                )}
              </button>
            </form>
          </div>
        </div>

        {/* Daftar Pertanyaan */}
        <div className="lg:col-span-2">
          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
            <div className="p-6 border-b border-slate-200 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div>
                <h2 className="text-lg font-bold text-slate-900">Daftar Pertanyaan Tersedia</h2>
                <p className="text-xs text-slate-500 mt-0.5">
                  Menampilkan soal untuk kategori:{' '}
                  <span className="font-semibold text-indigo-600">
                    {categories.find((c) => c.id === selectedCategory)?.categoryName || 'Semua'}
                  </span>
                </p>
              </div>
              <span className="px-3 py-1 bg-slate-100 text-slate-700 font-semibold text-xs rounded-full">
                {questions.length} Butir Soal
              </span>
            </div>

            {loading ? (
              <div className="p-12 text-center text-slate-500 flex flex-col items-center justify-center">
                <Loader2 className="w-6 h-6 animate-spin text-indigo-600 mb-2" />
                <span>Memuat soal kategori ini...</span>
              </div>
            ) : questions.length === 0 ? (
              <div className="p-12 text-center text-slate-500">
                <BookOpen className="w-10 h-10 text-slate-300 mx-auto mb-3" />
                <p className="font-medium">Belum ada soal pada kategori ini.</p>
                <p className="text-xs text-slate-400 mt-1">
                  Gunakan formulir di sebelah kiri untuk menambahkan soal pertama Anda.
                </p>
              </div>
            ) : (
              <div className="divide-y divide-slate-100">
                {questions.map((item, idx) => (
                  <motion.div
                    key={item.id || idx}
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: idx * 0.03 }}
                    className="p-6 hover:bg-slate-50/70 transition-colors"
                  >
                    <div className="flex items-start justify-between gap-4 mb-2">
                      <span
                        className={`inline-block px-2.5 py-0.5 rounded-full text-xs font-semibold ${
                          item.difficultyLevel === 'easy'
                            ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                            : item.difficultyLevel === 'hard'
                            ? 'bg-red-50 text-red-700 border border-red-200'
                            : 'bg-amber-50 text-amber-700 border border-amber-200'
                        }`}
                      >
                        {item.difficultyLevel === 'easy'
                          ? 'Mudah (Easy)'
                          : item.difficultyLevel === 'hard'
                          ? 'Sulit (Hard)'
                          : 'Sedang (Medium)'}
                      </span>
                    </div>

                    <p className="font-semibold text-slate-900 text-base mb-2 leading-relaxed">
                      {item.questionText}
                    </p>

                    {item.idealKeywords && (
                      <div className="bg-indigo-50/50 rounded-xl p-3 text-xs text-indigo-900 border border-indigo-100/60">
                        <span className="font-bold">Patokan Kata Kunci AI: </span>
                        <span>{item.idealKeywords}</span>
                      </div>
                    )}
                  </motion.div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
