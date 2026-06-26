# Changelog

Semua perubahan yang signifikan pada proyek ini akan didokumentasikan di file ini.

Format pencatatan berdasarkan [Keep a Changelog](https://keepachangelog.com/en/1.0.0/), dan proyek ini menggunakan [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

### Ditambahkan (Added)
- Aset dekorasi lingkungan (`Back Palm Trees`, `Ship Helm`).
- Animasi sprite untuk pohon kelapa (`palm_regular`, `palm_left`, `palm_right`).
- Implementasi _one-way collision_ pada pijakan pohon kelapa agar pemain dapat melompat menembus dari bawah.

### Diubah (Changed)
- Pijakan blok bagian atas yang memiliki musuh diperlebar di semua stage untuk mempermudah pemain dalam bermanuver dan mengambil koin.
- Penurunan posisi koordinat batang pohon sebanyak 40 pixel agar lebih mudah dijangkau oleh lompatan karakter.
- Penempatan jebakan meriam (cannon) dipindahkan dan difokuskan ke Stage 5.

### Diperbaiki (Fixed)
- Bug visibilitas awan (clouds) yang tidak muncul akibat parameter zoom kamera dan sumbu Y yang tidak sejajar.
- Perbaikan sinkronisasi hitbox fisik pada objek platform kustom (`refreshBody()` membatalkan perubahan `setSize()`).

## [1.0.0] - Initial Release
### Ditambahkan (Added)
- Level 1-4 dengan sistem progresi `GameScene`.
- Fitur physics dasar dengan gravitasi dan sistem tile sederhana.
- Musuh (Patrol) dan kemampuan menyerang menggunakan pedang (Sword).
- Sistem skor dan antarmuka pengguna dasar (koin dan indikator kesehatan/nyawa).
- Transisi status permainan ke layar _Game Over_ ketika kesehatan habis atau jatuh ke jurang.
