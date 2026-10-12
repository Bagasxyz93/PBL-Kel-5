
# SI-IN | Sistem Informasi Kelas Inkubasi

SI-IN (Sistem Informasi Kelas Inkubasi) adalah aplikasi web untuk mendukung kegiatan Kelas Inkubasi, mulai dari presensi siswa, pengajuan izin, pengumpulan *daily report*, hingga penyampaian materi pembelajaran.

Project ini dikembangkan sebagai bagian dari kegiatan Project-Based Learning (PBL) Semester 3.

## 📌 Fitur Aplikasi

### Siswa
- Dashboard siswa
- Presensi
- Pengajuan izin
- Daily report
- Materi pembelajaran
- Profil siswa

### Mentor
- Dashboard mentor
- Pengelolaan materi
- Pemantauan presensi siswa
- Pemantauan daily report siswa

### Admin
- Dashboard admin
- Pengelolaan data pengguna
- Pengelolaan program
- Pengelolaan data pendukung

> **Catatan:** Fitur dikembangkan secara bertahap. Tidak semua fitur sudah aktif atau terhubung ke backend.

## 🛠️ Teknologi

- HTML5
- Tailwind CSS v4
- JavaScript
- Vite
- Git dan GitHub

Project ini menggunakan HTML, CSS, dan JavaScript biasa tanpa React. Tailwind CSS digunakan untuk styling antarmuka, sedangkan Vite digunakan sebagai development server dan build tool.

## 📋 Persyaratan

Pastikan perangkat sudah memiliki:

1. [Node.js](https://nodejs.org/)
2. npm
3. [Git](https://git-scm.com/)
4. [Visual Studio Code](https://code.visualstudio.com/)
5. Browser modern, seperti Google Chrome

Periksa instalasi melalui terminal:

```bash
node -v
npm -v
git --version
```

## 🚀 Cara Menjalankan Project

### 1. Clone Repository

Salin URL repository GitHub milik kelompok, lalu jalankan:

```bash
git clone URL_REPOSITORY
```

Ganti `URL_REPOSITORY` dengan URL repository yang sebenarnya.

Masuk ke folder project:

```bash
cd "PBL Semester 3"
```

Sesuaikan nama folder jika berbeda.

### 2. Buka Project di VS Code

Jika terminal sudah berada di root project, jalankan:

```bash
code .
```

Atau buka folder project melalui menu **File → Open Folder** di VS Code.

### 3. Install Dependencies

Jalankan perintah berikut:

```bash
npm install
```

Perintah ini memasang dependencies berdasarkan `package.json`.

Langkah ini dilakukan ketika pertama kali menyiapkan project di perangkat baru atau setelah dependencies berubah.

### 4. Jalankan Development Server

```bash
npm run dev
```

Vite akan menampilkan alamat lokal, biasanya:

```text
http://localhost:5173/
```

Buka alamat yang muncul di terminal menggunakan browser.

Untuk menghentikan server, tekan `Ctrl + C` di terminal.

### 5. Build Project

Untuk membuat hasil build produksi, jalankan:

```bash
npm run build
```

Hasil build akan disimpan di folder `dist/`.

**Catatan:** Project memiliki beberapa halaman HTML di dalam folder `pages/`. Konfigurasi multi-page Vite perlu disiapkan agar seluruh halaman ikut masuk ke hasil build.

## 📁 Struktur Folder

```text
PBL Semester 3/
├── assets/
│   └── img/
│       ├── ImageLogin.png
│       └── Logo.png
│
├── component/
│
├── pages/
│   ├── Siswa/
│   │   ├── Dashboard.html
│   │   ├── Absensi.html
│   │   ├── Izin.html
│   │   ├── Daily-report.html
│   │   ├── Materi.html
│   │   └── Profil.html
│   │
│   ├── Admin/
│   └── Mentor/
│
├── src/
│   ├── css/
│   │   └── style.css
│   └── js/
│       └── login.js
│
├── index.html
├── vite.config.js
├── package.json
├── package-lock.json
├── .gitignore
└── README.md
```

### Fungsi Folder dan File

| Folder/File | Fungsi |
|---|---|
| `assets/img/` | Menyimpan logo, ilustrasi, dan gambar |
| `component/` | Menyimpan komponen antarmuka yang digunakan berulang |
| `pages/Siswa/` | Halaman untuk siswa |
| `pages/Admin/` | Halaman untuk admin |
| `pages/Mentor/` | Halaman untuk mentor |
| `src/css/style.css` | Titik masuk Tailwind CSS |
| `src/js/login.js` | JavaScript halaman login |
| `index.html` | Halaman login |
| `vite.config.js` | Konfigurasi Vite dan plugin Tailwind |
| `package.json` | Scripts dan dependencies project |
| `package-lock.json` | Menyimpan versi dependencies hasil instalasi |
| `.gitignore` | Menentukan file dan folder yang tidak diikutkan ke Git |

## 🎨 Panduan Mengubah Tampilan

### Mengubah Halaman

Setiap halaman HTML dapat diedit sesuai fitur yang dikerjakan.

Contoh:
- Login: `index.html`
- Dashboard siswa: `pages/Siswa/Dashboard.html`
- Presensi: `pages/Siswa/Absensi.html`
- Profil: `pages/Siswa/Profil.html`

### Menggunakan Tailwind CSS

Gunakan utility class Tailwind langsung pada elemen HTML.

Contoh:

```html
<div class="rounded-xl bg-white p-6 shadow-sm">
    <h2 class="text-xl font-bold text-slate-800">
        Dashboard Siswa
    </h2>

    <p class="mt-2 text-sm text-slate-500">
        Selamat datang di SI-IN.
    </p>
</div>
```

File `src/css/style.css` digunakan sebagai titik masuk Tailwind:

```css
@import "tailwindcss";
```

### Menambahkan Gambar

Simpan gambar di folder `assets/img/`.

Contoh:

```html
<img src="/assets/img/Logo.png" alt="Logo SI-IN">
```

Pastikan nama file dan path sesuai dengan lokasi gambar.

### Menambahkan JavaScript

Simpan file JavaScript sesuai fungsinya di `src/js/`.

Contoh menghubungkan JavaScript:

```html
<script type="module" src="/src/js/login.js"></script>
```

Gunakan script yang sesuai dengan kebutuhan setiap halaman.

## 🤝 Panduan Kolaborasi GitHub

### 1. Clone Repository

Setiap anggota kelompok mengambil repository ke perangkat masing-masing:

```bash
git clone URL_REPOSITORY
```

Setelah clone selesai, masuk ke folder project.

### 2. Sinkronkan Branch Utama

Sebelum mulai mengerjakan fitur:

```bash
git switch main
git pull origin main
```

Pastikan branch utama kelompok memang bernama `main`.

### 3. Buat Branch Fitur

Setiap anggota sebaiknya mengerjakan fitur pada branch terpisah.

Contoh:

```bash
git switch -c feature/dashboard-siswa
```

Contoh nama branch lainnya:
- `feature/absensi-siswa`
- `feature/daily-report`
- `feature/profil-siswa`
- `fix/login-layout`

### 4. Simpan Perubahan

Periksa file yang berubah:

```bash
git status
```

Tambahkan perubahan:

```bash
git add .
```

Buat commit:

```bash
git commit -m "feat: membuat dashboard siswa"
```

Gunakan pesan commit yang menjelaskan perubahan secara singkat.

Contoh:
- `feat: menambahkan halaman presensi`
- `fix: memperbaiki tampilan login`
- `style: menyesuaikan layout profil`
- `docs: memperbarui README`

### 5. Push Branch ke GitHub

```bash
git push -u origin feature/dashboard-siswa
```

Sesuaikan nama branch dengan pekerjaan masing-masing.

### 6. Buat Pull Request

Setelah branch berhasil di-push:

1. Buka repository di GitHub.
2. Pilih **Compare & pull request** jika tersedia.
3. Pastikan branch tujuan adalah `main`.
4. Jelaskan perubahan yang dilakukan.
5. Minta anggota lain meninjau kode.
6. Lakukan merge setelah perubahan diperiksa sesuai kesepakatan kelompok.

### 7. Ambil Perubahan Terbaru

Setelah perubahan anggota lain digabungkan ke `main`:

```bash
git switch main
git pull origin main
```

Buat branch baru untuk pekerjaan selanjutnya agar perubahan tetap terorganisasi.

## ⚠️ Aturan Kolaborasi

- Jangan mengubah file yang sedang dikerjakan anggota lain tanpa koordinasi.
- Jangan mengunggah folder `node_modules/` ke GitHub.
- Jangan mengunggah folder `dist/` jika tidak diperlukan oleh proses deployment.
- Jangan menyimpan password, API key, atau credential database di repository.
- Hindari mengedit file yang sama secara bersamaan tanpa koordinasi.
- Periksa tampilan melalui browser sebelum melakukan commit.
- Jangan menghapus konfigurasi project tanpa memahami dampaknya.
- Selesaikan konflik Git dengan memeriksa perubahan dari setiap anggota.

File `package-lock.json` harus tetap diikutkan ke repository agar instalasi dependencies lebih konsisten.

## 🔧 Troubleshooting

### npm Tidak Dikenali

Pastikan Node.js sudah terinstal. Buka kembali terminal dan periksa:

```bash
node -v
npm -v
```

### Vite Tidak Berjalan

Pastikan terminal berada di root project, yaitu folder yang berisi `package.json`.

Jalankan:

```bash
npm install
npm run dev
```

### Tampilan Tidak Berubah

- Pastikan file sudah disimpan.
- Periksa alamat server Vite yang dibuka.
- Periksa path CSS, JavaScript, dan gambar.
- Periksa tab Console pada Developer Tools browser jika terdapat error.

### Tailwind CSS Tidak Berfungsi

Pastikan `vite.config.js` menggunakan plugin `@tailwindcss/vite`, file `src/css/style.css` mengimpor Tailwind, dan halaman HTML menghubungkan stylesheet dengan benar.

## 📄 Lisensi dan Kontribusi

Project ini dikembangkan untuk kebutuhan pembelajaran dan kolaborasi tim PBL Semester 3.

Kontribusi dilakukan melalui branch dan Pull Request agar perubahan dapat ditinjau dan dikelola bersama.
