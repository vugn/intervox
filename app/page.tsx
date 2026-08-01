'use client';

import Link from 'next/link';
import { ArrowRight, Mic, Brain, FileText, BarChart3, CheckCircle, Star, Zap } from 'lucide-react';
import * as motion from 'motion/react-client';
import { useAuth } from '@/hooks/use-auth';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

export default function Home() {
  const { user, userData, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && user) {
      if (userData?.accountStatus === 'pending') {
        router.replace('/pending');
      } else {
        router.replace('/dashboard');
      }
    }
  }, [user, userData, loading, router]);

  if (loading || user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <div className="w-8 h-8 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen">
      {/* Hero Section */}
      <section className="relative pt-24 pb-16 lg:pt-36 lg:pb-28 overflow-hidden">
        <div className="absolute inset-0 -z-10 bg-[radial-gradient(ellipse_80%_60%_at_50%_-10%,_rgba(99,102,241,0.15),_transparent)]"></div>
        <div className="container mx-auto px-4 text-center">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
            <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-display font-bold tracking-tight text-slate-900 mb-6 leading-tight">
              Latih <span className="text-indigo-600">Interview</span> Kamu<br className="hidden sm:block" /> Bersama AI
            </h1>
            <p className="text-lg md:text-xl text-slate-600 mb-8 max-w-2xl mx-auto leading-relaxed">
              Intervox adalah platform latihan wawancara kerja berbasis AI suara. Dapatkan pengalaman interview realistis dan feedback mendalam untuk meningkatkan peluang lolosmu.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
              <Link
                href="/auth"
                className="inline-flex items-center justify-center px-7 py-3.5 text-base font-semibold text-white bg-indigo-600 rounded-xl hover:bg-indigo-700 transition-colors shadow-lg shadow-indigo-200 w-full sm:w-auto"
              >
                Mulai Gratis
                <ArrowRight className="ml-2 w-5 h-5" />
              </Link>
              <Link
                href="/dashboard"
                className="inline-flex items-center justify-center px-7 py-3.5 text-base font-semibold text-slate-700 bg-white border border-slate-200 rounded-xl hover:bg-slate-50 transition-colors w-full sm:w-auto"
              >
                Lihat Dashboard
              </Link>
            </div>
          </motion.div>

          {/* Stats Row */}
          <motion.div
            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.2 }}
            className="mt-14 grid grid-cols-3 gap-4 max-w-md mx-auto"
          >
            {[
              { number: '100%', label: 'Gratis' },
              { number: 'Real-time', label: 'Voice AI' },
              { number: 'Instant', label: 'Feedback' },
            ].map((stat) => (
              <div key={stat.label} className="text-center">
                <p className="text-2xl md:text-3xl font-display font-bold text-indigo-600">{stat.number}</p>
                <p className="text-xs text-slate-500 mt-0.5">{stat.label}</p>
              </div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-16 md:py-24 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-2xl md:text-3xl font-display font-bold text-slate-900 mb-3">Cara Kerja Intervox</h2>
            <p className="text-slate-600 max-w-xl mx-auto">Dalam 3 langkah mudah, kamu bisa langsung berlatih wawancara dengan AI.</p>
          </div>
          <div className="grid md:grid-cols-3 gap-8 max-w-4xl mx-auto">
            {[
              { step: '01', title: 'Isi Data & Posisi', desc: 'Upload CV dan masukkan posisi yang ingin kamu lamar. AI akan menyesuaikan pertanyaan secara otomatis.' },
              { step: '02', title: 'Wawancara Suara', desc: 'Berbicara langsung dengan AI interviewer secara real-time. Rasakan pengalaman interview sesungguhnya.' },
              { step: '03', title: 'Dapatkan Feedback', desc: 'Terima laporan mendalam: skor, kekuatan, area perbaikan, dan saran konkret untuk meningkatkan performamu.' },
            ].map((item, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.5, delay: i * 0.1 }}
                className="relative text-center md:text-left"
              >
                <div className="text-5xl font-display font-black text-indigo-100 mb-3 leading-none">{item.step}</div>
                <h3 className="text-lg font-bold text-slate-900 mb-2">{item.title}</h3>
                <p className="text-slate-600 text-sm leading-relaxed">{item.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 md:py-24 bg-slate-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-2xl md:text-3xl font-display font-bold text-slate-900 mb-3">Fitur Unggulan</h2>
            <p className="text-slate-600 max-w-xl mx-auto">Semua yang kamu butuhkan untuk mempersiapkan diri menghadapi wawancara kerja impian.</p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { icon: Mic, title: 'Voice Real-time', description: 'Bicara langsung dengan AI. Tidak ada jeda, tidak ada delay — persis seperti interview asli.' },
              { icon: Brain, title: 'Pertanyaan Dinamis', description: 'AI menyesuaikan pertanyaan berdasarkan jawaban sebelumnya, seperti pewawancara berpengalaman.' },
              { icon: FileText, title: 'Analisis CV', description: 'Upload CV-mu dan AI akan mengajukan pertanyaan yang relevan dengan pengalaman kerjamu.' },
              { icon: BarChart3, title: 'Laporan Detail', description: 'Skor komunikasi, teknis, problem-solving, dan culture fit — lengkap dengan saran perbaikan.' },
            ].map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.5, delay: index * 0.1 }}
                className="p-6 bg-white rounded-2xl border border-slate-100 hover:shadow-md transition-shadow"
              >
                <div className="w-11 h-11 bg-indigo-100 text-indigo-600 rounded-xl flex items-center justify-center mb-5">
                  <feature.icon className="w-5 h-5" />
                </div>
                <h3 className="text-base font-bold text-slate-900 mb-2">{feature.title}</h3>
                <p className="text-slate-600 text-sm leading-relaxed">{feature.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials / Benefits */}
      <section className="py-16 md:py-24 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-2xl md:text-3xl font-display font-bold text-slate-900 mb-3">Cocok untuk Siapa?</h2>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5 max-w-4xl mx-auto">
            {[
              { icon: '🎓', title: 'Mahasiswa & Fresh Graduate', desc: 'Berlatih sebelum interview pertamamu. Bangun kepercayaan diri dengan simulasi yang realistis.' },
              { icon: '💼', title: 'Profesional yang Pindah Karier', desc: 'Latih menjawab pertanyaan di bidang baru dengan AI yang disesuaikan dengan posisi target.' },
              { icon: '🚀', title: 'yang Ingin Naik Jabatan', desc: 'Persiapkan diri untuk wawancara level senior dengan pertanyaan yang lebih menantang.' },
            ].map((item, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.5, delay: i * 0.1 }}
                className="p-6 bg-slate-50 rounded-2xl border border-slate-100"
              >
                <div className="text-3xl mb-3">{item.icon}</div>
                <h3 className="font-bold text-slate-900 mb-2">{item.title}</h3>
                <p className="text-slate-600 text-sm leading-relaxed">{item.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 md:py-24 bg-indigo-600">
        <div className="container mx-auto px-4 text-center">
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.5 }}>
            <h2 className="text-2xl md:text-4xl font-display font-bold text-white mb-4">Siap Berlatih Sekarang?</h2>
            <p className="text-indigo-200 mb-8 max-w-xl mx-auto">Ribuan kandidat sudah berlatih dengan Intervox. Giliran kamu!</p>
            <Link
              href="/auth"
              className="inline-flex items-center gap-2 px-8 py-4 bg-white text-indigo-700 font-bold rounded-xl hover:bg-indigo-50 transition-colors shadow-lg text-base"
            >
              Daftar & Mulai Gratis
              <ArrowRight className="w-5 h-5" />
            </Link>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-8 bg-white border-t border-slate-100">
        <div className="container mx-auto px-4 text-center text-sm text-slate-400">
          © {new Date().getFullYear()} Intervox. Platform latihan wawancara berbasis AI.
        </div>
      </footer>
    </div>
  );
}
