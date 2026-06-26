# Panduan Arsitektur

Dokumen ini memberikan gambaran tingkat tinggi tentang arsitektur dari **Treasure Hunters**.

## Teknologi Utama

- **Phaser 3**: Engine game utama yang digunakan untuk rendering, fisika, penanganan input, dan audio.
- **Vite**: Alat build dan server pengembangan yang digunakan untuk menyajikan aplikasi secara lokal dan membundelnya untuk produksi.
- **HTML/CSS/JS**: Teknologi web vanilla untuk antarmuka pengguna di luar kanvas game (misalnya, tombol, overlay).

## Struktur Direktori

- `public/`: Berisi aset statis seperti gambar, sprite sheet, suara, dan file peta. File-file ini disajikan apa adanya oleh Vite.
- `src/`: Berisi kode sumber aplikasi.
  - `main.js`: Titik masuk game. Berisi konfigurasi game Phaser dan definisi *scene*.
  - `style.css`: Berisi CSS untuk elemen HTML yang membungkus kanvas game.

## Scene Game

Game ini dibagi menjadi beberapa *scene* logis (meskipun dapat digabungkan di `main.js`):
1. **Boot/Preload Scene**: Bertanggung jawab untuk memuat semua aset yang diperlukan (gambar, audio) sebelum game dimulai.
2. **Menu Scene**: Antarmuka menu utama di mana pengguna dapat memulai game.
3. **Play Scene**: Loop gameplay inti. Menangani pergerakan pemain, deteksi tabrakan, AI musuh, dan pembaruan *state*.
4. **Game Over Scene**: Ditampilkan saat pemain mati atau menyelesaikan game.

## Fisika & Tabrakan

Kami menggunakan sistem **Arcade Physics** dari Phaser.
- *Body* statis digunakan untuk platform, tanah, dan dinding.
- *Body* dinamis digunakan untuk pemain, musuh, dan objek interaktif seperti koin.
- *Callback* tabrakan didefinisikan untuk menangani interaksi (mis., mengumpulkan koin, menerima *damage*).

## Deployment

Proyek ini dibundel menjadi file statis menggunakan Vite (`npm run build`). Direktori `dist/` yang dihasilkan berisi semua yang diperlukan untuk meng-host game di server web statis mana pun (mis., GitHub Pages, Vercel, Netlify).
