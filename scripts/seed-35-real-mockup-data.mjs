import { createClient } from '@supabase/supabase-js';
import fs from 'node:fs';
import path from 'node:path';

// Load .env manual for standalone execution
const envPath = path.resolve(process.cwd(), '.env');
if (fs.existsSync(envPath)) {
  const content = fs.readFileSync(envPath, 'utf8');
  content.split('\n').forEach((line) => {
    const trimmed = line.trim();
    if (trimmed && !trimmed.startsWith('#') && trimmed.includes('=')) {
      const idx = trimmed.indexOf('=');
      const key = trimmed.slice(0, idx).trim();
      let val = trimmed.slice(idx + 1).trim();
      if ((val.startsWith('"') && val.endsWith('"')) || (val.startsWith("'") && val.endsWith("'"))) {
        val = val.slice(1, -1);
      }
      process.env[key] = val;
    }
  });
}

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error('❌ Supabase URL or Key not found in environment.');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

console.log('🚀 Memulai seeder 35 Data Mockup Real Indonesia untuk presentasi skripsi...');

async function runSeeder() {
  try {
    console.log('1️⃣ Menghapus data selain tabel users...');
    const tablesToClean = [
      'conversation_logs',
      'analysis_results',
      'ai_recommendations',
      'user_feedbacks',
      'interview_sessions',
      'question_banks',
      'scoring_criteria',
      'interview_categories',
      'student_profiles',
      'notifications'
    ];

    for (const table of tablesToClean) {
      const { error } = await supabase.from(table).delete().neq('id', '00000000-0000-0000-0000-000000000000');
      if (error) {
        console.warn(`⚠️ Warning saat menghapus tabel ${table}:`, error.message);
      } else {
        console.log(`   ✔ Tabel ${table} berhasil dibersihkan.`);
      }
    }

    console.log('2️⃣ Menandai bahwa migrasi SQL 20260801150000_seed_35_real_mockup_data.sql tersedia di folder supabase/migrations/...');
    console.log('✅ SELESAI! Untuk menjalankan full seeding 35 data real, Anda dapat mengeksekusi file migrasi SQL di Supabase:');
    console.log('   📄 File: supabase/migrations/20260801150000_seed_35_real_mockup_data.sql');
  } catch (err) {
    console.error('❌ Terjadi kesalahan pada seeder:', err);
  }
}

runSeeder();
