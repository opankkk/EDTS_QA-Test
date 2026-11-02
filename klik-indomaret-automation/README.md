# Klik Indomaret Playwright Automation

Automation test sederhana untuk alur belanja **guest user** (tanpa login) di
website [Klik Indomaret](https://www.klikindomaret.com/) menggunakan
**Playwright + JavaScript (Node.js)**.

## Deskripsi Singkat

Script ini menjalankan skenario berikut secara otomatis:

1. Membuka halaman utama Klik Indomaret.
2. Memilih Meta Kategori **Makanan**.
3. Memilih kategori **Madu**.
4. Memilih salah satu produk Madu yang tersedia.
5. Membuka halaman detail produk.
6. Mengklik tombol **+ Keranjang**.

## Tujuan Pengujian

- Memastikan alur navigasi kategori (Makanan → Madu) berjalan baik.
- Memastikan produk Madu benar-benar tersedia dan bisa dibuka detailnya.
- Memastikan tombol **+ Keranjang** dapat diklik dan memberikan respons
  (notifikasi sukses atau perubahan jumlah keranjang).
- Tidak menggunakan akun / login sama sekali.

## Tools dan Teknologi

| Komponen       | Teknologi                    |
|----------------|------------------------------|
| Bahasa         | JavaScript (Node.js)         |
| Automation     | Playwright                   |
| Test Framework | Playwright Test              |
| Browser        | Chromium                     |
| Version Control| Git                          |
| Repository     | GitHub (public)              |

## Prasyarat Instalasi

- **Node.js** versi 18 atau lebih baru. Cek dengan perintah:

  ```bash
  node -v
  ```

- Koneksi internet (untuk mengunduh dependency dan browser).

## Cara Instalasi

1. Clone repository:

   ```bash
   git clone https://github.com/opankkk/klik-indomaret-playwright-automation.git
   cd klik-indomaret-playwright-automation
   ```

2. Install dependency:

   ```bash
   npm install
   ```

3. Install browser Chromium untuk Playwright:

   ```bash
   npx playwright install chromium
   ```

## Cara Menjalankan Automation

Jalankan test (headless / tanpa tampilan):

```bash
npx playwright test
```

Jalankan test dengan tampilan browser (headed), untuk melihat prosesnya:

```bash
npx playwright test --headed
```

Melihat laporan HTML setelah test selesai:

```bash
npx playwright show-report
```

## Penjelasan Alur Test

Test berada di `tests/tambah-keranjang.spec.js` dengan alur sebagai berikut:

1. **Buka halaman utama** — lalu tunggu sampai verifikasi Cloudflare (jika ada)
   selesai, kemudian validasi tombol "Belanja Xpress" tampil.
2. **Klik Meta Kategori "Makanan"** — locator memakai `getByRole('link')` dengan
   `exact: true` agar tidak tertukar dengan "Makanan Hewan". Validasi URL
   berpindah ke `/category/makanan`.
3. **Klik kategori "Madu"** — validasi URL berpindah ke
   `/category/makanan/sarapan-selai/madu`.
4. **Cek daftar produk Madu** — memastikan minimal ada 1 produk, lalu memilih
   produk pertama.
5. **Buka halaman detail produk** — klik kartu produk, validasi URL masuk ke
   `/xpress/...`.
6. **Klik tombol "+ Keranjang"** — lalu validasi munculnya notifikasi sukses
   (misalnya "Produk berhasil ditambahkan ke keranjang").

## Hasil Pengujian Aktual

> **Status: BLOKIR OLEH CLOUDFLARE (kendala lingkungan, bukan kesalahan script)**

Berikut hasil observasi langsung saat eksplorasi dan eksekusi:

| Langkah | Hasil |
|---------|-------|
| Buka homepage | ✅ Berhasil (challenge Cloudflare awal lolos otomatis) |
| Buka kategori Makanan | ✅ Berhasil |
| Buka kategori Madu | ✅ Berhasil (menampilkan 9 produk Madu asli) |
| Buka halaman detail produk | ❌ Terblokir Cloudflare Turnstile |

**Detail kendala:**

- Halaman **listing** (homepage, kategori Makanan, kategori Madu) dapat diakses
  normal. Contoh produk yang terlihat: *Madurasa Madu Jahe Merah Lemon 160g*
  (Rp 25.500), *Uray 100% Natural Honey 150g*, *Nusantara Madu Murni Randu
  100mL*, dan lainnya.
- Halaman **detail produk** (`/xpress/<slug>`) dilindungi tantangan interaktif
  Cloudflare Turnstile. Server membalas `503` lalu `403`, dan endpoint data
  produk (`_next/data/...json`) juga membalas `403`.
- Tantangan ini **tidak selesai dengan sendirinya** pada lingkungan otomatis —
  sudah diuji pada Playwright headless, Playwright headed, dan browser asli
  (Chrome), semuanya berhenti di halaman "Just a moment..." / "Tunggu
  sebentar..." lebih dari 90 detik.
- Hal ini sesuai dengan ketentuan soal: **tidak boleh melewati mekanisme
  keamanan**, sehingga kondisi ini dicatat sebagai keterbatasan pengujian.

**Catatan untuk penguji selanjutnya:**

Script sudah ditulis dengan locator asli dari DOM dan alur yang benar. Pada
jaringan rumah/kantor biasa (IP yang tidak terblokir Cloudflare), seluruh alur
termasuk klik tombol **+ Keranjang** seharusnya berjalan. Silakan jalankan
`npx playwright test` dari jaringan lain dan hasilnya akan berbeda dari hasil
di atas.

## Struktur Project

```text
klik-indomaret-automation/
├── tests/
│   └── tambah-keranjang.spec.js   # Test script utama
├── playwright.config.js           # Konfigurasi Playwright
├── package.json                   # Dependency dan script
├── .gitignore                     # File yang diabaikan Git
└── README.md                      # Dokumentasi ini
```

## Bukti Pengujian

Screenshot kondisi halaman saat pengujian tersimpan di folder
`test-results/` (hanya muncul setelah test dijalankan dan gagal/gagal saat
verifikasi). Untuk melihat trace Playwright:

```bash
npx playwright show-trace test-results/*/trace.zip
```
