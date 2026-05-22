import fs from "node:fs/promises";
import path from "node:path";
import { chromium } from "playwright";

const baseUrl = process.env.CAPTURE_BASE_URL || "http://localhost:3000";
const outputDir = path.resolve(process.cwd(), "wireframes");
const waitMs = Number(process.env.CAPTURE_WAIT_MS || 1200);

const routes = [
  { name: "01-auth-signin", path: "/auth", preAuth: true },
  { name: "02-auth-signup", path: "/auth", preAuth: true, authTab: "signup" },
  { name: "03-profile", path: "/profile" },
  { name: "04-interview-setup", path: "/interview/setup" },
  { name: "05-interview-session", path: "/interview/session" },
  { name: "06-interview-feedback", path: "/interview/feedback" },
  { name: "07-admin-categories", path: "/admin/categories" },
  { name: "08-admin-questions", path: "/admin/questions" },
  { name: "09-admin-scoring", path: "/admin/scoring" },
  { name: "10-admin-lecturers", path: "/admin/lecturers" },
];

function withWireframeParam(routePath) {
  return routePath.includes("?") ? `${routePath}&wf=1` : `${routePath}?wf=1`;
}

function withMockAuthParam(routePath) {
  return routePath.includes("?")
    ? `${routePath}&mockAuth=1`
    : `${routePath}?mockAuth=1`;
}

function buildCaptureUrl(route) {
  const routeWithAuth = route.preAuth
    ? route.path
    : withMockAuthParam(route.path);
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
  const headingSelectors = {
    "01-auth-signin": "h1",
    "02-auth-signup": "h1",
    "03-profile": "h1",
    "04-interview-setup": "h1",
    "05-interview-session": "header h1",
    "06-interview-feedback": "h1",
    "07-admin-categories": "h1",
    "08-admin-questions": "h1",
    "09-admin-scoring": "h1",
    "10-admin-lecturers": "h1",
  };

  const selector = headingSelectors[route.name];
  if (selector) {
    await page
      .locator(selector)
      .first()
      .waitFor({ timeout: 45000 })
      .catch(() => null);
  }

  await page
    .waitForFunction(() => {
      const body = document.body.innerText || "";
      return !body.includes("Memuat...");
    })
    .catch(() => null);

  if (route.name === "07-admin-categories") {
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

  if (route.name === "08-admin-questions") {
    await page
      .waitForFunction(() => {
        const body = document.body.innerText || "";
        return !body.includes("Belum ada pertanyaan.");
      })
      .catch(() => null);
  }

  if (route.name === "09-admin-scoring") {
    await page
      .waitForFunction(() => {
        const body = document.body.innerText || "";
        return !body.includes("Belum ada kriteria penilaian.");
      })
      .catch(() => null);
  }

  if (route.name === "10-admin-lecturers") {
    await page
      .waitForFunction(() => {
        const body = document.body.innerText || "";
        return !body.includes("Belum ada data dosen.");
      })
      .catch(() => null);
  }
}

async function seedData(page) {
  const seedUrl = `${baseUrl}${withWireframeParam(withMockAuthParam("/admin/seed"))}`;
  await page.goto(seedUrl, {
    waitUntil: "domcontentloaded",
    timeout: 45000,
  });

  const wireframeReady = await waitWireframeMode(page);
  if (!wireframeReady) {
    console.warn("wf-mode not detected in time for admin-seed, continuing.");
  }
  await page.waitForTimeout(1800);

  const seedButton = page.getByRole("button", {
    name: /Tambahkan Data Contoh|Seeding|Selesai!/i,
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

  if (route.name === "08-admin-questions") {
    await page.waitForFunction(
      () => {
        const body = document.body.innerText || "";
        const hasLoadingText = body.includes("Memuat...");
        const hasEmptyText = body.includes("Belum ada pertanyaan.");
        const hasQuestionCards = body.includes("Ideal keywords:");
        return !hasLoadingText && !hasEmptyText && hasQuestionCards;
      },
      {},
      { timeout: 60000 },
    );
  }

  await page.waitForTimeout(waitMs);
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
  console.log(`Done. Wireframes saved in: ${outputDir}`);

  if (failedCount > 0) {
    throw new Error(`Capture selesai dengan ${failedCount} route gagal.`);
  }
}

capture().catch((error) => {
  console.error(error);
  process.exit(1);
});
