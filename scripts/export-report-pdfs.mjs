import fs from "node:fs/promises";
import path from "node:path";
import { chromium } from "playwright";

const baseUrl = process.env.CAPTURE_BASE_URL || "http://localhost:3000";
const outputDir = path.resolve(process.cwd(), "report-pdfs");
const waitMs = Number(process.env.CAPTURE_WAIT_MS || 1200);

const reportRoutes = [
  { name: "01-transcript", path: "/reports/transcript" },
  { name: "02-score-evaluation", path: "/reports/score-evaluation" },
  { name: "03-strength-weakness", path: "/reports/strength-weakness" },
  { name: "04-answer-comparison", path: "/reports/answer-comparison" },
  { name: "05-progress-chart", path: "/reports/progress-chart" },
  {
    name: "06-development-recommendation",
    path: "/reports/development-recommendation",
  },
  { name: "07-active-participants", path: "/reports/active-participants" },
  { name: "08-module-statistics", path: "/reports/module-statistics" },
  { name: "09-difficulty-analysis", path: "/reports/difficulty-analysis" },
  { name: "10-certificate", path: "/reports/certificate", landscape: true },
];

function withMockAuth(routePath) {
  return routePath.includes("?")
    ? `${routePath}&mockAuth=1`
    : `${routePath}?mockAuth=1`;
}

async function ensureServerReady() {
  try {
    const response = await fetch(baseUrl, { method: "GET" });
    if (!response.ok && response.status >= 500) {
      throw new Error(`Server returned status ${response.status}`);
    }
  } catch (error) {
    throw new Error(
      `Server tidak dapat diakses di ${baseUrl}. Jalankan app dulu (npm run dev) atau gunakan script auto: npm run export:reports:pdf:auto.\n${error}`,
    );
  }
}

async function waitReportReady(page) {
  await page
    .locator("h1")
    .first()
    .waitFor({ timeout: 45000 })
    .catch(() => null);
  await page
    .waitForFunction(() => {
      const body = document.body.innerText || "";
      return (
        !body.includes("Memuat data laporan...") && !body.includes("Memuat...")
      );
    })
    .catch(() => null);
  await page.waitForTimeout(waitMs);
}

async function exportPdfs() {
  await ensureServerReady();
  await fs.mkdir(outputDir, { recursive: true });

  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext({
    viewport: { width: 1440, height: 900 },
  });

  const page = await context.newPage();

  for (const report of reportRoutes) {
    const url = `${baseUrl}${withMockAuth(report.path)}`;
    const outputPath = path.join(outputDir, `${report.name}.pdf`);

    try {
      await page.goto(url, { waitUntil: "domcontentloaded", timeout: 45000 });
      await waitReportReady(page);

      await page.pdf({
        path: outputPath,
        format: "A4",
        printBackground: true,
        landscape: Boolean(report.landscape),
        margin: {
          top: "10mm",
          right: "10mm",
          bottom: "10mm",
          left: "10mm",
        },
      });

      console.log(`Exported PDF: ${report.name} -> ${url}`);
    } catch (error) {
      console.error(`Failed PDF: ${report.name} -> ${url}`);
      console.error(error);
    }
  }

  await browser.close();
  console.log(`Done. Report PDFs saved in: ${outputDir}`);
}

exportPdfs().catch((error) => {
  console.error(error);
  process.exit(1);
});
