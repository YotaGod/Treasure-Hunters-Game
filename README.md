<div align="center">

🇮🇩 Bahasa Indonesia | [🇺🇸 English](./README.en.md)

# 🏴‍☠️ Treasure Hunters

![License](https://img.shields.io/badge/License-MIT-blue.svg)
![Phaser](https://img.shields.io/badge/Phaser-3.80.1-brightgreen.svg)
![Vite](https://img.shields.io/badge/Vite-5.0.0-yellow.svg)

Game 2D Platformer petualangan mencari harta karun bajak laut. Dibuat menggunakan framework Phaser 3 dan dibundel dengan Vite.

![Gameplay Screenshot](./public/assets/environment/Background/bg_color.png) *(Catatan: Ganti dengan screenshot gameplay sebenarnya)*

</div>

## 🎮 Fitur Utama

- **4 Level Eksplorasi**: Menyelesaikan rintangan dari pantai hingga ke kapal bajak laut.
- **Sistem Fisika**: Sistem gravitasi dan tabrakan dinamis dengan objek.
- **Sistem Pertarungan**: Pemain dapat menggunakan pedang untuk mengalahkan musuh.
- **Koleksi Harta Karun**: Mengumpulkan koin dan peti emas.
- **Rintangan Dinamis**: Jebakan meriam, duri, dan musuh patroli.
- **Animasi Sprite Halus**: Menggunakan sprite sheet untuk karakter, musuh, dan lingkungan.

## 📂 Struktur Proyek

```text
Treasure-Hunters/
├── public/
│   └── assets/           # Gambar, sprite sheet, environment
├── src/
│   ├── main.js           # Game Engine, Scene (Menu, Game, GameOver)
│   └── style.css         # Styling UI luar canvas
├── Doc/                  # Dokumentasi Proyek
├── index.html            # File HTML Utama
├── package.json          # Dependencies & Scripts
└── vite.config.js        # Konfigurasi Bundler Vite
```

## 🚀 Panduan Instalasi

Untuk panduan lengkap cara menjalankan proyek ini di mesin lokal Anda, silakan merujuk ke [SETUP_GUIDE.md](./Doc/SETUP_GUIDE.md).

### Prasyarat:
- Node.js (v16 atau lebih baru)
- npm atau yarn

### Instalasi Cepat:
```bash
# Clone repositori
git clone https://github.com/username/treasure-hunters.git
cd treasure-hunters

# Instal dependensi
npm install

# Jalankan server pengembangan
npm run dev
```

## 🛠️ Dibangun Dengan

- [Phaser 3](https://phaser.io/) - Framework Game HTML5 Desktop dan Mobile yang cepat dan menyenangkan.
- [Vite](https://vitejs.dev/) - Tooling Frontend generasi baru.

## 🤝 Kontribusi

Proyek ini sangat terbuka untuk kontribusi! Baik itu perbaikan bug, penambahan stage, atau peningkatan aset. Silakan baca [CONTRIBUTING.md](./Doc/CONTRIBUTING.md) untuk panduan lengkap.

## 🗺️ Roadmap & Changelog

- Ingin melihat fitur apa saja yang sedang direncanakan? Lihat [ROADMAP.md](./Doc/ROADMAP.md).
- Ingin melihat riwayat pembaruan proyek? Lihat [CHANGELOG.md](./Doc/CHANGELOG.md).

## 📄 Lisensi

Proyek ini menggunakan lisensi MIT. Anda bebas menggunakan, memodifikasi, dan mendistribusikan proyek ini.
