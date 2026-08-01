import fs from "node:fs/promises";
import path from "node:path";
import { chromium } from "playwright";

const baseUrl = process.env.CAPTURE_BASE_URL || "http://localhost:3000";
const outputDir = path.resolve(process.cwd(), "wireframes");
const waitMs = Number(process.env.CAPTURE_WAIT_MS || 1500);

const routes = [
  // General & Auth
  { name: "01-general-landing", path: "/", preAuth: true },
  { name: "02-general-auth-signin", path: "/auth", preAuth: true },
  { name: "03-general-auth-signup", path: "/auth", preAuth: true, authTab: "signup" },

  // Role: Student
  { name: "04-student-dashboard", path: "/dashboard", role: "student" },
  { name: "05-student-profile", path: "/profile", role: "student" },
  { name: "06-student-interview-setup", path: "/interview/setup", role: "student" },
  { name: "07-student-interview-session", path: "/interview/session", role: "student" },
  { name: "08-student-interview-feedback", path: "/interview/feedback", role: "student" },
  { name: "09-student-reports-menu", path: "/reports", role: "student" },

  // Role: Lecturer / Dosen
  { name: "10-lecturer-dashboard", path: "/lecturer", role: "lecturer" },
  { name: "11-lecturer-questions", path: "/lecturer/questions", role: "lecturer" },
  { name: "12-lecturer-reports-menu", path: "/reports", role: "lecturer" },
  { name: "13-lecturer-profile", path: "/profile", role: "lecturer" },

  // Role: Administrator
  { name: "14-admin-dashboard", path: "/dashboard", role: "administrator" },
  { name: "15-admin-verification-users", path: "/admin/users", role: "administrator" },
  { name: "16-admin-categories", path: "/admin/categories", role: "administrator" },
  { name: "17-admin-questions", path: "/admin/questions", role: "administrator" },
  { name: "18-admin-scoring", path: "/admin/scoring", role: "administrator" },
  { name: "19-admin-lecturers", path: "/admin/lecturers", role: "administrator" },
  { name: "20-admin-reports-menu", path: "/reports", role: "administrator" },
  { name: "21-admin-profile", path: "/profile", role: "administrator" },

  // Laporan untuk Mahasiswa (Student Reports)
  { name: "22-report-student-transcript", path: "/reports/transcript", role: "student" },
  { name: "23-report-student-score-evaluation", path: "/reports/score-evaluation", role: "student" },
  { name: "24-report-student-strength-weakness", path: "/reports/strength-weakness", role: "student" },
  { name: "25-report-student-answer-comparison", path: "/reports/answer-comparison", role: "student" },
  { name: "26-report-student-progress-chart", path: "/reports/progress-chart", role: "student" },
  { name: "27-report-student-development-recommendation", path: "/reports/development-recommendation", role: "student" },
  { name: "28-report-student-certificate", path: "/reports/certificate", role: "student", landscape: true },

  // Laporan untuk Dosen (Lecturer Reports)
  { name: "29-report-lecturer-question-bank-usage", path: "/reports/question-bank-usage", role: "lecturer" },
  { name: "30-report-lecturer-student-competency-summary", path: "/reports/student-competency-summary", role: "lecturer" },
  { name: "31-report-lecturer-class-error-analysis", path: "/reports/class-error-analysis", role: "lecturer" },
  { name: "32-report-lecturer-question-difficulty-evaluation", path: "/reports/question-difficulty-evaluation", role: "lecturer" },
  { name: "33-report-lecturer-student-practice-attendance", path: "/reports/student-practice-attendance", role: "lecturer" },
  { name: "34-report-lecturer-mentoring-summary", path: "/reports/lecturer-mentoring-summary", role: "lecturer" },

  // Laporan untuk Administrator (Admin Reports)
  { name: "35-report-admin-active-participants", path: "/reports/active-participants", role: "administrator" },
  { name: "36-report-admin-module-statistics", path: "/reports/module-statistics", role: "administrator" },
  { name: "37-report-admin-difficulty-analysis", path: "/reports/difficulty-analysis", role: "administrator" },
  { name: "38-report-admin-system-stats", path: "/reports/system-stats", role: "administrator" },
  { name: "39-report-admin-user-feedback", path: "/reports/user-feedback", role: "administrator" },
];

function withWireframeParam(routePath) {
  return routePath.includes("?") ? `${routePath}&wf=1` : `${routePath}?wf=1`;
}

function withMockRoleParam(routePath, role = "administrator") {
  return routePath.includes("?")
    ? `${routePath}&mockRole=${role}`
    : `${routePath}?mockRole=${role}`;
}

function buildCaptureUrl(route) {
  const routeWithAuth = route.preAuth
    ? route.path
    : withMockRoleParam(route.path, route.role || "administrator");
  return `${baseUrl}${withWireframeParam(routeWithAuth)}`;
}

async function waitWireframeMode(page) {
  try {
    await page.waitForFunction(
      () => document.body.classList.contains("wf-mode"),
      {},
      { timeout: 10000 },
    );
    return true;
  } catch {
    return false;
  }
}

async function waitRouteReady(page, route) {
  // Allow React hydration and client-layout spinners 1200ms to mount
  await page.waitForTimeout(1200);

  await page
    .locator("h1")
    .first()
    .waitFor({ timeout: 45000 })
    .catch(() => null);

  await page
    .waitForFunction(() => {
      const body = document.body.innerText || "";
      const isSpinning = !!document.querySelector(".animate-spin");
      return (
        !isSpinning &&
        !body.includes("Memuat...") &&
        !body.includes("Memuat data laporan...") &&
        !body.includes("Loading data...") &&
        !body.includes("Authenticating...") &&
        !body.includes("Compiling")
      );
    }, { timeout: 60000 })
    .catch(() => null);

  if (route.name.includes("dashboard")) {
    await page
      .waitForFunction(() => {
        const body = document.body.innerText || "";
        return (
          body.includes("Total") ||
          body.includes("Aktivitas") ||
          body.includes("Akses Cepat") ||
          body.includes("Selamat Datang") ||
          body.includes("Mulai Sesi")
        );
      }, { timeout: 60000 })
      .catch(() => null);
  }

  if (route.name.includes("profile")) {
    await page
      .waitForFunction(() => {
        const body = document.body.innerText || "";
        return body.includes("Simpan Perubahan") || body.includes("Informasi");
      }, { timeout: 60000 })
      .catch(() => null);
  }

  if (route.name.includes("report")) {
    await page
      .waitForFunction(() => {
        const body = document.body.innerText || "";
        return (
          body.includes("UNIVERSITAS ISLAM KALIMANTAN") ||
          body.includes("PDF/Excel") ||
          body.includes("Laporan")
        );
      }, { timeout: 60000 })
      .catch(() => null);
  }

  if (route.name.includes("admin-verification-users")) {
    await page
      .waitForFunction(() => {
        const body = document.body.innerText || "";
        return body.includes("Approved") || body.includes("Pending");
      }, { timeout: 60000 })
      .catch(() => null);
  }

  if (route.name.includes("admin-categories")) {
    await page
      .waitForFunction(() => {
        const body = document.body.innerText || "";
        return (
          !body.includes("Belum ada kategori") &&
          !body.includes("Belum ada data")
        );
      })
      .catch(() => null);
  }

  if (route.name.includes("admin-questions") || route.name.includes("lecturer-questions")) {
    await page
      .waitForFunction(() => {
        const body = document.body.innerText || "";
        return !body.includes("Belum ada pertanyaan.");
      })
      .catch(() => null);
  }

  if (route.name.includes("admin-scoring")) {
    await page
      .waitForFunction(() => {
        const body = document.body.innerText || "";
        return !body.includes("Belum ada kriteria penilaian.");
      })
      .catch(() => null);
  }

  if (route.name.includes("admin-lecturers")) {
    await page
      .waitForFunction(() => {
        const body = document.body.innerText || "";
        return !body.includes("Belum ada data dosen.");
      })
      .catch(() => null);
  }
}

async function seedData(page) {
  const seedUrl = `${baseUrl}${withWireframeParam(withMockRoleParam("/admin/seed", "administrator"))}`;
  await page.goto(seedUrl, {
    waitUntil: "domcontentloaded",
    timeout: 45000,
  });

  const wireframeReady = await waitWireframeMode(page);
  if (!wireframeReady) {
    console.warn("wf-mode not detected in time for admin-seed, continuing.");
  }
  await page.waitForTimeout(1000);

  const seedButton = page.getByRole("button", {
    name: /Tambahkan Data Contoh|Seed 35 Data Mockup|Seeding|Selesai!/i,
  });

  if ((await seedButton.count()) === 0) {
    console.warn("Seed skipped: tombol seed tidak ditemukan di /admin/seed.");
    return;
  }

  const label = (await seedButton.first().innerText()).trim();
  if (!/Selesai!/i.test(label)) {
    await seedButton.first().click();
    await page
      .getByText(/Berhasil!/i)
      .waitFor({ timeout: 120000 })
      .catch(() => null);
  }

  await page.waitForTimeout(1000);
  console.log("Seed data ensured.");
}

async function ensureServerReady() {
  try {
    const response = await fetch(baseUrl, { method: "GET" });
    if (!response.ok && response.status >= 500) {
      throw new Error(`Server returned status ${response.status}`);
    }
  } catch (error) {
    throw new Error(
      `Server tidak dapat diakses di ${baseUrl}. Jalankan app dulu (npm run dev) atau gunakan script auto: npm run capture:wireframes:auto.\n${error}`,
    );
  }
}

async function captureRoute(page, route) {
  const targetUrl = buildCaptureUrl(route);
  const targetPath = path.join(outputDir, `${route.name}.png`);

  await page.goto(targetUrl, {
    waitUntil: "domcontentloaded",
    timeout: 45000,
  });

  if (route.authTab === "signup") {
    await page
      .getByRole("button", { name: /Daftar/i })
      .first()
      .click();
  }

  const wireframeReady = await waitWireframeMode(page);
  if (!wireframeReady) {
    await page.evaluate(() => {
      document.body.classList.add("wf-mode");
    });
    await page.waitForTimeout(300);
  }

  await waitRouteReady(page, route);

  await page.waitForTimeout(Math.max(waitMs, 2500));
  await page.screenshot({ path: targetPath, fullPage: true });
  console.log(`Captured: ${route.name} -> ${targetUrl}`);
}

async function capture() {
  await ensureServerReady();
  await fs.mkdir(outputDir, { recursive: true });

  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext({
    viewport: { width: 1440, height: 900 },
  });

  const page = await context.newPage();
  let failedCount = 0;

  const preAuthRoutes = routes.filter((item) => item.preAuth);
  const postAuthRoutes = routes.filter((item) => !item.preAuth);

  for (const route of preAuthRoutes) {
    try {
      await captureRoute(page, route);
    } catch (error) {
      failedCount += 1;
      console.error(`Failed: ${route.name}`);
      console.error(error);
    }
  }

  await seedData(page);

  for (const route of postAuthRoutes) {
    try {
      await captureRoute(page, route);
    } catch (error) {
      failedCount += 1;
      console.error(`Failed: ${route.name}`);
      console.error(error);
    }
  }

  await browser.close();
  console.log(`\n======================================================`);
  console.log(`Done! All ${routes.length} Wireframe screens saved in: ${outputDir}`);
  console.log(`======================================================\n`);

  if (failedCount > 0) {
    throw new Error(`Capture selesai dengan ${failedCount} route gagal.`);
  }
}

capture().catch((error) => {
  console.error(error);
  process.exit(1);
});
