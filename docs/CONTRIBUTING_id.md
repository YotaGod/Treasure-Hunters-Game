# Berkontribusi ke Treasure Hunters

Pertama-tama, terima kasih telah mempertimbangkan untuk berkontribusi pada Treasure Hunters! Orang-orang seperti Andalah yang membuat Treasure Hunters menjadi game yang hebat.

## Mulai dari mana?

Jika Anda menemukan bug atau memiliki permintaan fitur, silakan buat isu! Biasanya lebih baik jika Anda mendapatkan konfirmasi atas bug atau persetujuan untuk fitur yang Anda minta sebelum mulai membuat kode.

## Fork & buat branch

Jika ini adalah sesuatu yang menurut Anda dapat Anda perbaiki, fork Treasure Hunters dan buat branch dengan nama yang deskriptif.

Contoh nama branch yang baik (di mana isu #325 adalah tiket yang Anda kerjakan):
`git checkout -b 325-tambah-tipe-musuh-baru`

## Implementasikan perbaikan atau fitur Anda

Pada titik ini, Anda siap untuk melakukan perubahan. Jangan ragu untuk meminta bantuan; setiap orang pada awalnya adalah pemula.

## Sesuaikan gaya penulisan kode

Patch Anda harus mengikuti konvensi & pemformatan yang sama dengan bagian proyek lainnya.
- Gunakan sintaks ES6.
- Pastikan kode Anda tidak memunculkan error saat game dimainkan.

## Buat Pull Request

Pada titik ini, Anda harus kembali ke branch utama (master/main) Anda dan memastikannya sudah diperbarui dengan branch utama Treasure Hunters:
```bash
git remote add upstream https://github.com/username/treasure-hunters.git
git checkout master
git pull upstream master
```

Kemudian perbarui branch fitur Anda dari salinan master lokal Anda, dan push!
```bash
git checkout 325-tambah-tipe-musuh-baru
git rebase master
git push --set-upstream origin 325-tambah-tipe-musuh-baru
```

Terakhir, buka GitHub dan buat Pull Request.

## Dokumentasi Multi-Bahasa

Jika Anda memodifikasi dokumentasi, pastikan untuk memperbarui versi bahasa Inggris dan bahasa Indonesia (jika berlaku).
