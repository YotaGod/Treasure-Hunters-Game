# Panduan Instalasi (Setup Guide)

Panduan ini akan membantu Anda menyiapkan lingkungan pengembangan lokal untuk menjalankan **Treasure Hunters**.

## 1. Prasyarat Sistem
Sebelum memulai, pastikan perangkat Anda memiliki perangkat lunak berikut:
- **Node.js** (versi 16.x atau yang lebih baru) - [Unduh Node.js](https://nodejs.org/)
- **Git** - [Unduh Git](https://git-scm.com/)
- **Editor Teks** (Rekomendasi: VS Code)
- Browser modern (Chrome, Firefox, Edge, atau Safari)

## 2. Kloning Repositori
Langkah pertama adalah mendapatkan salinan kode ke komputer lokal Anda. Buka terminal atau command prompt, dan jalankan perintah berikut:

```bash
git clone https://github.com/username/treasure-hunters.git
cd treasure-hunters
```

## 3. Instalasi Dependensi
Proyek ini menggunakan `npm` (Node Package Manager) untuk mengelola dependensi (Phaser dan Vite).
Jalankan perintah ini di dalam direktori proyek:

```bash
npm install
```

Proses ini akan mengunduh semua paket yang dibutuhkan ke dalam folder `node_modules`.

## 4. Menjalankan Server Pengembangan (Development Server)
Setelah semua dependensi terinstal, Anda bisa menjalankan game di mode pengembangan dengan Vite yang memiliki fitur *Hot Module Replacement* (HMR).

```bash
npm run dev
```

Anda akan melihat output yang memberi tahu Anda di mana server berjalan, biasanya di `http://localhost:5173`. Buka URL tersebut di browser Anda untuk memainkan game!

## 5. Build untuk Produksi (Production Build)
Jika Anda ingin merilis atau men-deploy game ini, Anda perlu membuat versi produksi yang telah dioptimalkan.

```bash
npm run build
```

Perintah ini akan membuat folder `dist/` yang berisi semua file HTML, CSS, dan JavaScript statis (minified). File-file di dalam folder `dist/` inilah yang siap untuk diunggah ke layanan hosting seperti Vercel, Netlify, atau GitHub Pages.

## Troubleshooting
- **Error "Command not found: npm"**: Pastikan Node.js sudah terinstal dan ditambahkan ke system PATH.
- **Port Conflict**: Jika port 5173 sudah digunakan oleh aplikasi lain, Vite biasanya akan mencoba port berikutnya (misal: 5174). Anda dapat melihatnya di log terminal.
