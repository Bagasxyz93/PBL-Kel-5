<div align="center">

# 🚀 SI-IN

### Sistem Informasi Kelas Inkubasi

<p>
  Platform berbasis web untuk mendukung pengelolaan
  program, materi, absensi, izin, dan Daily Report
  peserta Kelas Inkubasi.
</p>

<div align="center">

[![Laravel](https://img.shields.io/badge/Laravel-FF2D20?style=for-the-badge&logo=laravel&logoColor=white)](https://laravel.com/docs)
[![Blade](https://img.shields.io/badge/Blade-FF2D20?style=for-the-badge&logo=laravel&logoColor=white)](https://laravel.com/docs/blade)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-06B6D4?style=for-the-badge&logo=tailwindcss&logoColor=white)](https://tailwindcss.com/docs)
[![PostgreSQL](https://img.shields.io/badge/PostgreSQL-4169E1?style=for-the-badge&logo=postgresql&logoColor=white)](https://www.postgresql.org/docs/)
[![GitHub](https://img.shields.io/badge/GitHub-181717?style=for-the-badge&logo=github&logoColor=white)](https://docs.github.com/)

</div>

---

## 🌐 About The Project

**SI-IN** atau **Sistem Informasi Kelas Inkubasi** merupakan aplikasi
berbasis web yang dikembangkan untuk membantu proses pengelolaan
kegiatan Kelas Inkubasi secara terintegrasi.

Sistem ini dirancang untuk menghubungkan **Admin, Mentor, dan Peserta**
dalam satu platform, mulai dari pengelolaan program dan materi hingga
pencatatan kehadiran dan pengumpulan Daily Report.

> **Learn. Build. Report. Grow.**

---

## ✨ Main Features

<table>
<tr>
<td width="50%">

### 👨‍💼 Admin

- Dashboard
- Manajemen pengguna
- Manajemen peserta
- Manajemen mentor
- Manajemen program
- Pengelolaan data sistem

</td>

<td width="50%">

### 👨‍🏫 Mentor

- Dashboard mentor
- Mengelola materi
- Memantau absensi
- Memeriksa pengajuan izin
- Memeriksa Daily Report

</td>
</tr>

<tr>
<td width="50%">

### 👨‍🎓 Peserta

- Dashboard peserta
- Absensi masuk & keluar
- Melihat materi
- Pengajuan izin
- Pengumpulan Daily Report

</td>

<td width="50%">

### 📊 Monitoring

- Status kehadiran
- Status pengajuan izin
- Status Daily Report
- Data kegiatan peserta
- Rekap aktivitas program

</td>
</tr>
</table>

---

## 🔄 How It Works

```text
                    ┌───────────────┐
                    │     LOGIN     │
                    └───────┬───────┘
                            │
                            ▼
                 ┌─────────────────────┐
                 │  ROLE IDENTIFICATION │
                 └──────────┬──────────┘
                            │
          ┌─────────────────┼─────────────────┐
          ▼                 ▼                 ▼
      ┌────────┐       ┌────────┐       ┌──────────┐
      │ ADMIN  │       │ MENTOR │       │ PESERTA  │
      └───┬────┘       └───┬────┘       └────┬─────┘
          │                │                  │
          ▼                ▼                  ▼
      Kelola Data      Kelola Materi      Ikuti Materi
      Kelola Program   Monitor Absensi    Absensi
                       Review Report      Daily Report
                                          Pengajuan Izin