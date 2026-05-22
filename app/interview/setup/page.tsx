'use client';

import { useEffect, useState, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { UploadCloud, User, Briefcase, Settings, Play, X, FileText, Loader2 } from 'lucide-react';
import * as motion from 'motion/react-client';
import { useAuth } from '@/hooks/use-auth';
import { supabase } from '@/lib/supabase';
import { createSession, listCategories } from '@/lib/data-service';

export default function InterviewSetup() {
  const router = useRouter();
  const { user, userData } = useAuth();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [cvFile, setCvFile] = useState<File | null>(null);
  const [existingCvUrl, setExistingCvUrl] = useState('');
  const [audioInputs, setAudioInputs] = useState<MediaDeviceInfo[]>([]);
  const [audioOutputs, setAudioOutputs] = useState<MediaDeviceInfo[]>([]);
  const [categories, setCategories] = useState<Array<{ id: string; categoryName: string; moduleType?: string; difficultyLevel?: string }>>([]);
  const [cvUploadError, setCvUploadError] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    interviewType: 'Kerja',
    moduleCategory: '',
    role: '',
    company: '',
    yearsExperience: '',
    education: '',
    jobDescription: '',
    focusAreas: '',
    personality: 'technical',
    difficulty: 'medium',
    language: 'Indonesian',
    voice: 'Zephyr',
    inputDeviceId: '',
    outputDeviceId: '',
  });

  useEffect(() => {
    if (!user) return;
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setFormData((prev) => ({
      ...prev,
      name: userData?.displayName || user.user_metadata?.full_name || prev.name,
      email: userData?.email || user.email || prev.email,
      education: userData?.education || prev.education,
      yearsExperience: userData?.yearsExperience || prev.yearsExperience,
    }));
    setExistingCvUrl(userData?.cvPath || userData?.cvUrl || '');
  }, [user, userData]);

  useEffect(() => {
    const loadCategories = async () => {
      try {
        const rows = await listCategories();
        const activeRows = rows.filter((row) => row.isActive !== false);
        setCategories(activeRows as Array<{ id: string; categoryName: string; moduleType?: string; difficultyLevel?: string }>);

        if (activeRows.length > 0) {
          setFormData((prev) => {
            if (prev.moduleCategory) return prev;
            return {
              ...prev,
              moduleCategory: activeRows[0].id,
              interviewType: activeRows[0].moduleType || prev.interviewType,
              difficulty: activeRows[0].difficultyLevel || prev.difficulty,
            };
          });
        }
      } catch {
        setCategories([]);
      }
    };

    loadCategories();
  }, []);

  useEffect(() => {
    const loadDevices = async () => {
      if (typeof navigator === 'undefined' || !navigator.mediaDevices?.enumerateDevices) return;
      try {
        const devices = await navigator.mediaDevices.enumerateDevices();
        const inputs = devices.filter((d) => d.kind === 'audioinput');
        const outputs = devices.filter((d) => d.kind === 'audiooutput');
        setAudioInputs(inputs);
        setAudioOutputs(outputs);
        setFormData((prev) => ({
          ...prev,
          inputDeviceId: prev.inputDeviceId || inputs[0]?.deviceId || '',
          outputDeviceId: prev.outputDeviceId || outputs[0]?.deviceId || '',
        }));
      } catch {
        // ignore
      }
    };

    loadDevices();
  }, []);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const allowedTypes = ['application/pdf', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'];
    if (!allowedTypes.includes(file.type)) {
      setCvUploadError('Hanya file PDF atau DOCX yang diperbolehkan.');
      return;
    }
    if (file.size > 10 * 1024 * 1024) {
      setCvUploadError('Ukuran file maksimal 10MB.');
      return;
    }
    setCvUploadError('');
    setCvFile(file);
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    const file = e.dataTransfer.files?.[0];
    if (!file) return;
    const allowedTypes = ['application/pdf', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'];
    if (!allowedTypes.includes(file.type)) {
      setCvUploadError('Hanya file PDF atau DOCX yang diperbolehkan.');
      return;
    }
    if (file.size > 10 * 1024 * 1024) {
      setCvUploadError('Ukuran file maksimal 10MB.');
      return;
    }
    setCvUploadError('');
    setCvFile(file);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    let sessionId = '';
    let cvUrl = existingCvUrl || '';

    try {
      // Upload CV to Supabase Storage if provided
      if (cvFile && user) {
        const safeFileName = cvFile.name.replace(/[^a-zA-Z0-9._-]/g, '_');
        const filePath = `${user.id}/${Date.now()}_${safeFileName}`;
        const { data: uploadData, error: uploadError } = await supabase.storage
          .from('cv')
          .upload(filePath, cvFile);
        if (uploadError) throw uploadError;
        const { data: { publicUrl } } = supabase.storage
          .from('cv')
          .getPublicUrl(uploadData.path);
        cvUrl = publicUrl;
      }

      if (user) {
        sessionId = await createSession({
          userId: user.id,
          candidateName: formData.name,
          candidateEmail: formData.email,
          moduleType: formData.interviewType,
          categoryId: formData.moduleCategory,
          jobRole: formData.role,
          company: formData.company,
          yearsExperience: formData.yearsExperience,
          education: formData.education,
          jobDescription: formData.jobDescription,
          focusAreas: formData.focusAreas,
          language: formData.language,
          personality: formData.personality,
          difficulty: formData.difficulty,
          cvUrl: cvUrl || null,
          status: 'in-progress',
          startedAt: new Date().toISOString(),
          createdAt: new Date().toISOString(),
        });
      }
    } catch (error) {
      console.error('Error creating session:', error);
    }

    const params = new URLSearchParams({
      role: formData.role,
      jobDescription: formData.jobDescription,
      focusAreas: formData.focusAreas,
      language: formData.language,
      voice: formData.voice,
      personality: formData.personality,
      difficulty: formData.difficulty,
      interviewType: formData.interviewType,
      moduleCategory: categories.find((item) => item.id === formData.moduleCategory)?.categoryName || formData.moduleCategory,
      moduleCategoryId: formData.moduleCategory,
      inputDeviceId: formData.inputDeviceId,
      outputDeviceId: formData.outputDeviceId,
      name: formData.name,
      ...(sessionId ? { sessionId } : {}),
    });

    router.push(`/interview/session?${params.toString()}`);
  };

  return (
    <div className="container mx-auto px-4 py-8 md:py-12 max-w-3xl">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
      >
        <div className="text-center mb-8 md:mb-10">
          <h1 className="text-3xl md:text-4xl font-display font-bold text-slate-900 mb-3">Konfigurasi Interview</h1>
          <p className="text-base md:text-lg text-slate-600">Isi data berikut untuk memulai sesi wawancara AI.</p>
        </div>

        <div className="bg-white rounded-2xl md:rounded-3xl shadow-xl border border-slate-200 overflow-hidden">
          <form onSubmit={handleSubmit} className="p-6 md:p-10 space-y-8">

            {/* Candidate Details */}
            <section>
              <h2 className="text-lg md:text-xl font-bold text-slate-900 flex items-center gap-2 mb-5">
                <User className="w-5 h-5 text-indigo-500" />
                Data Kandidat
              </h2>
              <div className="grid sm:grid-cols-2 gap-5">
                <div className="space-y-1.5">
                  <label htmlFor="name" className="block text-sm font-medium text-slate-700">Nama Lengkap <span className="text-red-500">*</span></label>
                  <input type="text" id="name" required className="w-full px-4 py-3 rounded-xl border border-slate-300 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-colors text-sm" placeholder="Budi Santoso" value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} />
                </div>
                <div className="space-y-1.5">
                  <label htmlFor="email" className="block text-sm font-medium text-slate-700">Email <span className="text-red-500">*</span></label>
                  <input type="email" id="email" required className="w-full px-4 py-3 rounded-xl border border-slate-300 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-colors text-sm" placeholder="budi@email.com" value={formData.email} onChange={(e) => setFormData({ ...formData, email: e.target.value })} />
                </div>
                <div className="space-y-1.5">
                  <label htmlFor="education" className="block text-sm font-medium text-slate-700">Pendidikan Terakhir</label>
                  <select id="education" className="w-full px-4 py-3 rounded-xl border border-slate-300 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-colors bg-white text-sm" value={formData.education} onChange={(e) => setFormData({ ...formData, education: e.target.value })}>
                    <option value="">Pilih pendidikan</option>
                    <option value="SMA/SMK">SMA / SMK</option>
                    <option value="D3">D3</option>
                    <option value="S1">S1</option>
                    <option value="S2">S2</option>
                    <option value="S3">S3</option>
                  </select>
                </div>
                <div className="space-y-1.5">
                  <label htmlFor="yearsExperience" className="block text-sm font-medium text-slate-700">Tahun Pengalaman Kerja</label>
                  <select id="yearsExperience" className="w-full px-4 py-3 rounded-xl border border-slate-300 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-colors bg-white text-sm" value={formData.yearsExperience} onChange={(e) => setFormData({ ...formData, yearsExperience: e.target.value })}>
                    <option value="">Pilih pengalaman</option>
                    <option value="Fresh Graduate">Fresh Graduate</option>
                    <option value="1-2 tahun">1-2 tahun</option>
                    <option value="3-5 tahun">3-5 tahun</option>
                    <option value="5-10 tahun">5-10 tahun</option>
                    <option value="10+ tahun">10+ tahun</option>
                  </select>
                </div>
              </div>

              {/* CV Upload */}
              <div className="mt-5 space-y-1.5">
                <label className="block text-sm font-medium text-slate-700">Upload CV / Resume</label>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept=".pdf,.docx"
                  className="hidden"
                  onChange={handleFileChange}
                />
                {cvFile ? (
                  <div className="flex items-center justify-between p-4 bg-indigo-50 border border-indigo-200 rounded-xl">
                    <div className="flex items-center gap-3 min-w-0">
                      <FileText className="w-5 h-5 text-indigo-500 flex-shrink-0" />
                      <span className="text-sm font-medium text-indigo-700 truncate">{cvFile.name}</span>
                      <span className="text-xs text-indigo-400 flex-shrink-0">({(cvFile.size / 1024).toFixed(0)} KB)</span>
                    </div>
                    <button type="button" onClick={() => { setCvFile(null); if (fileInputRef.current) fileInputRef.current.value = ''; }} className="text-slate-400 hover:text-red-500 transition-colors flex-shrink-0 ml-2">
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                ) : existingCvUrl ? (
                  <div className="flex items-center justify-between p-4 bg-emerald-50 border border-emerald-200 rounded-xl">
                    <div className="flex items-center gap-3 min-w-0">
                      <FileText className="w-5 h-5 text-emerald-600 flex-shrink-0" />
                      <span className="text-sm font-medium text-emerald-700 truncate">CV profil terdeteksi</span>
                    </div>
                    <button
                      type="button"
                      onClick={() => setExistingCvUrl('')}
                      className="text-slate-400 hover:text-red-500 transition-colors flex-shrink-0 ml-2"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                ) : (
                  <div
                    onClick={() => fileInputRef.current?.click()}
                    onDrop={handleDrop}
                    onDragOver={(e) => e.preventDefault()}
                    className="border-2 border-dashed border-slate-300 rounded-xl p-6 text-center hover:bg-slate-50 hover:border-indigo-400 transition-all cursor-pointer group"
                  >
                    <UploadCloud className="w-8 h-8 text-slate-400 mx-auto mb-2 group-hover:text-indigo-500 transition-colors" />
                    <p className="text-sm text-slate-600 font-medium">Klik atau drag & drop file CV</p>
                    <p className="text-xs text-slate-400 mt-1">PDF, DOCX — maks. 10MB</p>
                  </div>
                )}
                {cvUploadError && <p className="text-xs text-red-600">{cvUploadError}</p>}
              </div>
            </section>

            <hr className="border-slate-200" />

            {/* Module Selection */}
            <section>
              <h2 className="text-lg md:text-xl font-bold text-slate-900 flex items-center gap-2 mb-5">
                <Settings className="w-5 h-5 text-indigo-500" />
                Pemilihan Modul Latihan
              </h2>
              <div className="grid sm:grid-cols-2 gap-5">
                <div className="space-y-1.5">
                  <label htmlFor="interviewType" className="block text-sm font-medium text-slate-700">Jenis Wawancara <span className="text-red-500">*</span></label>
                  <select
                    id="interviewType"
                    required
                    className="w-full px-4 py-3 rounded-xl border border-slate-300 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-colors bg-white text-sm"
                    value={formData.interviewType}
                    onChange={(e) => setFormData({ ...formData, interviewType: e.target.value })}
                  >
                    <option value="Kerja">Wawancara Kerja</option>
                    <option value="Beasiswa">Wawancara Beasiswa</option>
                    <option value="Magang">Wawancara Magang</option>
                    <option value="Organisasi">Wawancara Organisasi</option>
                    <option value="Lainnya">Lainnya</option>
                  </select>
                </div>
                <div className="space-y-1.5">
                  <label htmlFor="moduleCategory" className="block text-sm font-medium text-slate-700">Kategori Modul <span className="text-red-500">*</span></label>
                  <select
                    id="moduleCategory"
                    required
                    className="w-full px-4 py-3 rounded-xl border border-slate-300 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-colors bg-white text-sm"
                    value={formData.moduleCategory}
                    onChange={(e) => {
                      const selectedCategory = categories.find((item) => item.id === e.target.value);
                      setFormData({
                        ...formData,
                        moduleCategory: e.target.value,
                        interviewType: selectedCategory?.moduleType || formData.interviewType,
                        difficulty: selectedCategory?.difficultyLevel || formData.difficulty,
                      });
                    }}
                  >
                    {categories.length === 0 ? (
                      <>
                        <option value="General Interview">General Interview</option>
                        <option value="Technical Interview">Technical Interview</option>
                        <option value="Behavioral Interview">Behavioral Interview</option>
                        <option value="Case Interview">Case Interview</option>
                        <option value="Leadership Interview">Leadership Interview</option>
                      </>
                    ) : categories.map((category) => (
                      <option key={category.id} value={category.id}>{category.categoryName}</option>
                    ))}
                  </select>
                </div>
              </div>
            </section>

            <hr className="border-slate-200" />

            {/* Job Details */}
            <section>
              <h2 className="text-lg md:text-xl font-bold text-slate-900 flex items-center gap-2 mb-5">
                <Briefcase className="w-5 h-5 text-indigo-500" />
                Detail Posisi
              </h2>
              <div className="space-y-5">
                <div className="grid sm:grid-cols-2 gap-5">
                  <div className="space-y-1.5">
                    <label htmlFor="role" className="block text-sm font-medium text-slate-700">Posisi yang Dilamar <span className="text-red-500">*</span></label>
                    <input type="text" id="role" required className="w-full px-4 py-3 rounded-xl border border-slate-300 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-colors text-sm" placeholder="misal: Frontend Developer" value={formData.role} onChange={(e) => setFormData({ ...formData, role: e.target.value })} />
                  </div>
                  <div className="space-y-1.5">
                    <label htmlFor="company" className="block text-sm font-medium text-slate-700">Nama Perusahaan</label>
                    <input type="text" id="company" className="w-full px-4 py-3 rounded-xl border border-slate-300 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-colors text-sm" placeholder="misal: PT Teknologi Maju" value={formData.company} onChange={(e) => setFormData({ ...formData, company: e.target.value })} />
                  </div>
                </div>
                <div className="space-y-1.5">
                  <label htmlFor="jobDescription" className="block text-sm font-medium text-slate-700">Deskripsi Pekerjaan (opsional)</label>
                  <textarea id="jobDescription" rows={4} className="w-full px-4 py-3 rounded-xl border border-slate-300 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-colors resize-none text-sm" placeholder="Tempelkan deskripsi pekerjaan di sini agar AI dapat menyesuaikan pertanyaan..." value={formData.jobDescription} onChange={(e) => setFormData({ ...formData, jobDescription: e.target.value })} />
                </div>
                <div className="space-y-1.5">
                  <label htmlFor="focusAreas" className="block text-sm font-medium text-slate-700">Area Fokus (opsional)</label>
                  <input type="text" id="focusAreas" className="w-full px-4 py-3 rounded-xl border border-slate-300 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-colors text-sm" placeholder="misal: React, System Design, Leadership" value={formData.focusAreas} onChange={(e) => setFormData({ ...formData, focusAreas: e.target.value })} />
                </div>
              </div>
            </section>

            <hr className="border-slate-200" />

            {/* AI Settings */}
            <section>
              <h2 className="text-lg md:text-xl font-bold text-slate-900 flex items-center gap-2 mb-5">
                <Settings className="w-5 h-5 text-indigo-500" />
                Pengaturan AI
              </h2>
              <div className="grid sm:grid-cols-2 gap-5">
                <div className="space-y-1.5">
                  <label htmlFor="language" className="block text-sm font-medium text-slate-700">Bahasa</label>
                  <select id="language" className="w-full px-4 py-3 rounded-xl border border-slate-300 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-colors bg-white text-sm" value={formData.language} onChange={(e) => setFormData({ ...formData, language: e.target.value })}>
                    <option value="Indonesian">Bahasa Indonesia</option>
                    <option value="English">English</option>
                  </select>
                </div>
                <div className="space-y-1.5">
                  <label htmlFor="voice" className="block text-sm font-medium text-slate-700">Suara AI</label>
                  <select id="voice" className="w-full px-4 py-3 rounded-xl border border-slate-300 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-colors bg-white text-sm" value={formData.voice} onChange={(e) => setFormData({ ...formData, voice: e.target.value })}>
                    <option value="Zephyr">Zephyr (Perempuan)</option>
                    <option value="Kore">Kore (Perempuan)</option>
                    <option value="Puck">Puck (Laki-laki)</option>
                    <option value="Charon">Charon (Laki-laki)</option>
                    <option value="Fenrir">Fenrir (Laki-laki)</option>
                  </select>
                </div>
                <div className="space-y-1.5">
                  <label htmlFor="inputDeviceId" className="block text-sm font-medium text-slate-700">Mikrofon</label>
                  <select
                    id="inputDeviceId"
                    className="w-full px-4 py-3 rounded-xl border border-slate-300 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-colors bg-white text-sm"
                    value={formData.inputDeviceId}
                    onChange={(e) => setFormData({ ...formData, inputDeviceId: e.target.value })}
                  >
                    {audioInputs.length === 0 ? (
                      <option value="">Default Microphone</option>
                    ) : audioInputs.map((device, index) => (
                      <option key={device.deviceId || index} value={device.deviceId}>{device.label || `Microphone ${index + 1}`}</option>
                    ))}
                  </select>
                </div>
                <div className="space-y-1.5">
                  <label htmlFor="outputDeviceId" className="block text-sm font-medium text-slate-700">Speaker</label>
                  <select
                    id="outputDeviceId"
                    className="w-full px-4 py-3 rounded-xl border border-slate-300 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-colors bg-white text-sm"
                    value={formData.outputDeviceId}
                    onChange={(e) => setFormData({ ...formData, outputDeviceId: e.target.value })}
                  >
                    {audioOutputs.length === 0 ? (
                      <option value="">Default Speaker</option>
                    ) : audioOutputs.map((device, index) => (
                      <option key={device.deviceId || index} value={device.deviceId}>{device.label || `Speaker ${index + 1}`}</option>
                    ))}
                  </select>
                </div>
                <div className="space-y-1.5">
                  <label htmlFor="personality" className="block text-sm font-medium text-slate-700">Tipe Pewawancara</label>
                  <select id="personality" className="w-full px-4 py-3 rounded-xl border border-slate-300 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-colors bg-white text-sm" value={formData.personality} onChange={(e) => setFormData({ ...formData, personality: e.target.value })}>
                    <option value="technical">Technical Expert (Ketat)</option>
                    <option value="hr">HR Manager (Ramah)</option>
                    <option value="behavioral">Behavioral (Mendalami)</option>
                  </select>
                </div>
                <div className="space-y-1.5">
                  <label htmlFor="difficulty" className="block text-sm font-medium text-slate-700">Tingkat Kesulitan</label>
                  <select id="difficulty" className="w-full px-4 py-3 rounded-xl border border-slate-300 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-colors bg-white text-sm" value={formData.difficulty} onChange={(e) => setFormData({ ...formData, difficulty: e.target.value })}>
                    <option value="easy">Junior / Fresh Graduate</option>
                    <option value="medium">Mid-Level</option>
                    <option value="hard">Senior / Lead</option>
                  </select>
                </div>
              </div>
            </section>

            <div className="pt-2">
              <button type="submit" disabled={isSubmitting} className="w-full bg-indigo-600 text-white px-6 py-4 rounded-xl font-bold text-base md:text-lg hover:bg-indigo-700 transition-all shadow-lg shadow-indigo-200 flex items-center justify-center gap-2 hover:-translate-y-0.5 disabled:opacity-70 disabled:cursor-not-allowed disabled:hover:translate-y-0">
                {isSubmitting ? <Loader2 className="w-5 h-5 animate-spin" /> : <Play className="w-5 h-5 fill-current" />}
                {isSubmitting ? 'Mempersiapkan sesi...' : 'Mulai Sesi Interview'}
              </button>
            </div>
          </form>
        </div>
      </motion.div>
    </div>
  );
}
