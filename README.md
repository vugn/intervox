<div align="center">
<img width="1200" height="475" alt="GHBanner" src="https://github.com/user-attachments/assets/0aa67016-6eaf-458a-adb2-6e31a0763ed6" />
</div>

# Run and deploy your AI Studio app

This contains everything you need to run your app locally.

View your app in AI Studio: https://ai.studio/apps/4412af18-bae4-4644-a786-19fd32c90e09

## Run Locally

**Prerequisites:** Node.js

1. Install dependencies:
   `npm install`
2. Set the `GEMINI_API_KEY` in [.env.local](.env.local) to your Gemini API key
3. Set `NEXT_PUBLIC_GEMINI_API_KEY` in `.env` or `.env.local` (client-side live interview)
4. (Opsional) Aktifkan mode wireframe global dengan `NEXT_PUBLIC_WIREFRAME_MODE=true`
5. Run the app:
   `npm run dev`

## Auto Capture Wireframes

Generate screenshot wireframe otomatis untuk seluruh screen utama:

1. Aktifkan wireframe global di `.env.local`:
   `NEXT_PUBLIC_WIREFRAME_MODE=true`
2. Isi kredensial untuk auto-login capture di `.env.local`:
   - `CAPTURE_AUTH_EMAIL=your-email`
   - `CAPTURE_AUTH_PASSWORD=your-password`
3. Jalankan app:
   `npm run dev`
4. Install browser untuk capture (sekali saja):
   `npm run capture:wireframes:install`
5. Jalankan capture manual (jika app sudah berjalan):
   `npm run capture:wireframes`
6. Atau jalankan satu command otomatis (start server + capture):
   `npm run capture:wireframes:auto`

Output PNG akan tersimpan di folder `wireframes/`.

## Firestore & Storage Rules Deployment

Project ini menggunakan **named Firestore database**: `ai-studio-4412af18-bae4-4644-a786-19fd32c90e09`.

Setelah mengubah `firestore.rules` atau `storage.rules`, deploy rules:

1. `firebase login`
2. `firebase use vertical-setup-474413-f5`
3. `firebase deploy --only firestore:rules,storage`

Tanpa deploy rules ke database yang benar, app bisa error `Missing or insufficient permissions` saat CRUD.
