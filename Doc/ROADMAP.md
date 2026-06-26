# Roadmap Proyek

Dokumen ini menguraikan fitur yang direncanakan, tugas yang sedang berjalan, serta visi jangka panjang dari proyek **Treasure Hunters**.

## 🚀 Fitur yang Direncanakan (Planned Features)
- **Sistem Audio**: Menambahkan background music (BGM) dan sound effects (SFX) untuk lompatan, ayunan pedang, dan pengambilan koin.
- **Stage Baru**: 
  - Stage Bawah Air (Underwater Level) dengan mekanisme berenang.
  - Stage Hutan Gelap (Dark Forest) dengan pencahayaan dinamis.
- **Sistem Boss**: Pertarungan melawan kapten bajak laut di akhir permainan.
- **Sistem Checkpoint**: Memungkinkan pemain respawn di tengah stage, bukan mengulang dari awal jika kalah.

## 🚧 Sedang Dikerjakan (In Progress)
- **Peningkatan Visual**: Penyesuaian pijakan (platform) yang lebih lebar untuk musuh dan koin.
- **Optimalisasi Dekorasi**: Menambahkan pohon kelapa animasi dan hiasan lingkungan lainnya.
- **Perbaikan Bug**: Penyesuaian area tabrakan (hitbox) pada batang pohon dan posisi background awan.

## 💡 Ide Masa Depan (Future Ideas)
- **Papan Peringkat (Leaderboard)**: Mengintegrasikan backend sederhana (seperti Firebase atau Supabase) untuk menyimpan rekor waktu dan skor terbaik pemain.
- **Karakter Tambahan**: Menambahkan karakter yang bisa dimainkan (playable character) selain pemburu harta karun standar.
- **Dukungan Mobile**: Menambahkan kontrol sentuh (d-pad virtual dan tombol aksi) agar game dapat dimainkan di browser ponsel.

## 🔬 Topik Riset (Research Topics)
- Cara mengimplementasikan Tilemap (Tiled) daripada men-generate block terrain secara manual (hardcoded) di `main.js`.
- Penggunaan library Phaser Particle Engine untuk efek ledakan meriam dan partikel air.
