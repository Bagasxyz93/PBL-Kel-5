# Deployment PHP Native + PostgreSQL + Tailwind CSS
## Debian 12 pada Proxmox LXC Container

Panduan ini menjelaskan instalasi server dari kondisi awal sampai aplikasi PHP Native dapat diakses melalui domain dengan HTTPS.

## 1. Arsitektur

Stack yang digunakan:

- **OS:** Debian 12
- **Web server:** Nginx
- **Backend:** PHP Native 8.2
- **PHP process manager:** PHP-FPM
- **Database:** PostgreSQL
- **CSS framework:** Tailwind CSS
- **Version control:** Git
- **Reverse proxy / HTTPS:** Cloudflare Tunnel (opsional)

Alur request:

```text
Browser
   |
   | HTTPS
   v
Cloudflare DNS / Tunnel (opsional)
   |
   v
Nginx :80
   |
   v
PHP-FPM
   |
   v
PHP Native Application
   |
   v
PostgreSQL :5432 (localhost)
```

Tailwind CSS dikompilasi menjadi file CSS statis. Tailwind tidak perlu berjalan sebagai service di production.

## 2. Persiapan Debian 12

Masuk ke CT melalui SSH atau console Proxmox.

Perbarui paket:

```bash
apt update && apt upgrade -y
```

Install kebutuhan dasar:

```bash
apt install -y \
  nginx \
  git \
  curl \
  wget \
  unzip \
  nano \
  ca-certificates \
  lsb-release \
  sudo
```

Atur zona waktu:

```bash
timedatectl set-timezone Asia/Jakarta
timedatectl
```

## 3. Install PHP 8.2 dan ekstensi

Debian 12 menyediakan PHP 8.2 melalui repositori standar.

```bash
apt install -y \
  php8.2 \
  php8.2-fpm \
  php8.2-cli \
  php8.2-pgsql \
  php8.2-mbstring \
  php8.2-xml \
  php8.2-curl \
  php8.2-zip \
  php8.2-gd \
  php8.2-intl \
  php8.2-bcmath
```

Aktifkan PHP-FPM:

```bash
systemctl enable --now php8.2-fpm
```

Periksa versi PHP:

```bash
php -v
```

Periksa status PHP-FPM:

```bash
systemctl status php8.2-fpm
```

Pastikan ekstensi PostgreSQL tersedia:

```bash
php -m | grep -E 'PDO|pdo_pgsql|pgsql'
```

## 4. Install PostgreSQL

Install PostgreSQL:

```bash
apt install -y postgresql postgresql-contrib
```

Aktifkan service:

```bash
systemctl enable --now postgresql
```

Periksa status:

```bash
systemctl status postgresql
```

### 4.1 Membuat user dan database

Masuk ke PostgreSQL:

```bash
sudo -u postgres psql
```

Jalankan SQL berikut. Ganti password dengan password yang kuat dan unik.

```sql
CREATE USER appuser WITH PASSWORD 'GANTI_PASSWORD_KUAT';

CREATE DATABASE appdb
OWNER appuser
ENCODING 'UTF8';

\l
\du
\q
```

### 4.2 Keamanan PostgreSQL

Jika aplikasi dan database berada di CT yang sama, gunakan koneksi lokal:

```text
Host     : 127.0.0.1
Port     : 5432
Database : appdb
User     : appuser
```

Jangan membuka port PostgreSQL ke internet jika tidak diperlukan. Jangan mengubah `listen_addresses` menjadi `*` tanpa kebutuhan dan pembatasan akses yang jelas.

## 5. Struktur direktori aplikasi

Contoh struktur project:

```text
/var/www/myapp/
├── app/
│   ├── Controllers/
│   ├── Models/
│   ├── Helpers/
│   └── Views/
├── config/
│   └── database.php
├── public/
│   ├── index.php
│   ├── assets/
│   │   └── app.css
│   └── uploads/
├── resources/
│   └── css/
│       └── input.css
├── storage/
│   └── logs/
└── .gitignore
```

Buat direktori:

```bash
mkdir -p /var/www/myapp/{app/Controllers,app/Models,app/Helpers,app/Views,config,public/assets,public/uploads,resources/css,storage/logs}
```

Atur kepemilikan awal:

```bash
chown -R www-data:www-data /var/www/myapp
```

**Prinsip keamanan:** hanya direktori `public` yang boleh menjadi document root Nginx. File konfigurasi, kode internal, dan log tidak boleh dapat diakses langsung dari browser.

## 6. Koneksi PHP ke PostgreSQL

Buat file:

```bash
nano /var/www/myapp/config/database.php
```

Contoh sederhana untuk pengujian:

```php
<?php

$host = '127.0.0.1';
$port = '5432';
$dbname = 'appdb';
$username = 'appuser';
$password = 'GANTI_PASSWORD_KUAT';

try {
    $pdo = new PDO(
        "pgsql:host=$host;port=$port;dbname=$dbname",
        $username,
        $password,
        [
            PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION,
            PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
            PDO::ATTR_EMULATE_PREPARES => false,
        ]
    );
} catch (PDOException $e) {
    error_log($e->getMessage());
    http_response_code(500);
    exit('Database connection failed.');
}
```

Untuk production, jangan menyimpan password database di repository Git. Simpan konfigurasi rahasia di environment file di luar direktori `public`, lalu batasi permission file tersebut.

## 7. Install Node.js dan Tailwind CSS

Node.js hanya diperlukan untuk proses build Tailwind. Tidak perlu menjalankan Node.js sebagai service aplikasi PHP.

Periksa apakah Node.js dan npm sudah tersedia:

```bash
node -v
npm -v
```

Jika belum tersedia, install Node.js versi LTS yang sesuai dengan kebutuhan project dari sumber resmi Node.js. Hindari memasang versi yang tidak diketahui asalnya.

Masuk ke project:

```bash
cd /var/www/myapp
```

Inisialisasi npm jika project belum memiliki `package.json`:

```bash
npm init -y
```

Install Tailwind CSS dan CLI:

```bash
npm install -D tailwindcss @tailwindcss/cli
```

Buat file input CSS:

```bash
nano resources/css/input.css
```

Isi:

```css
@import "tailwindcss";

@source "../../app";
@source "../../public";
```

Tambahkan script build ke `package.json`:

```json
{
  "scripts": {
    "build": "tailwindcss -i ./resources/css/input.css -o ./public/assets/app.css --minify",
    "watch": "tailwindcss -i ./resources/css/input.css -o ./public/assets/app.css --watch"
  },
  "devDependencies": {
    "@tailwindcss/cli": "^4.0.0",
    "tailwindcss": "^4.0.0"
  }
}
```

Catatan: jika `package.json` sudah memiliki isi, gabungkan bagian `scripts` dan `devDependencies`; jangan menimpa seluruh konfigurasi project secara sembarangan.

Build CSS untuk production:

```bash
npm run build
```

File hasil build:

```text
/var/www/myapp/public/assets/app.css
```

Panggil CSS dari halaman PHP:

```html
<link rel="stylesheet" href="/assets/app.css">
```

Contoh class Tailwind:

```html
<div class="min-h-screen bg-slate-100 flex items-center justify-center">
    <div class="bg-white p-8 rounded-2xl shadow-lg">
        <h1 class="text-3xl font-bold text-blue-600">
            Aplikasi Berhasil!
        </h1>
        <p class="mt-3 text-slate-600">
            PHP Native + PostgreSQL + Tailwind CSS
        </p>
    </div>
</div>
```

Pastikan direktori dan file yang berisi class Tailwind masuk dalam sumber pemindaian (`@source`). Hindari membentuk nama class secara dinamis jika Tailwind tidak dapat mendeteksinya; gunakan pemetaan class yang eksplisit.

## 8. Konfigurasi Nginx

Buat konfigurasi:

```bash
nano /etc/nginx/sites-available/myapp
```

Contoh konfigurasi. Ganti domain sesuai domain yang digunakan:

```nginx
server {
    listen 80;
    listen [::]:80;

    server_name domain-aplikasi.com www.domain-aplikasi.com;

    root /var/www/myapp/public;
    index index.php index.html;

    client_max_body_size 20M;

    location / {
        try_files $uri $uri/ /index.php?$query_string;
    }

    location ~ \.php$ {
        include snippets/fastcgi-php.conf;
        fastcgi_pass unix:/run/php/php8.2-fpm.sock;
    }

    location ~ /\. {
        deny all;
    }

    location ~* \.(css|js|jpg|jpeg|png|gif|svg|ico|woff2)$ {
        expires 30d;
        access_log off;
    }
}
```

Aktifkan konfigurasi:

```bash
ln -s /etc/nginx/sites-available/myapp \
  /etc/nginx/sites-enabled/myapp
```

Jika konfigurasi default tidak diperlukan, nonaktifkan:

```bash
rm -f /etc/nginx/sites-enabled/default
```

Uji konfigurasi:

```bash
nginx -t
```

Jika hasilnya berhasil:

```bash
systemctl enable nginx
systemctl reload nginx
```

Pastikan PHP-FPM aktif:

```bash
systemctl enable --now php8.2-fpm
```

## 9. Membuat halaman pengujian

Buat file:

```bash
nano /var/www/myapp/public/index.php
```

Isi:

```php
<?php

require_once __DIR__ . '/../config/database.php';

$stmt = $pdo->query('SELECT NOW() AS waktu');
$data = $stmt->fetch();

?>

<!DOCTYPE html>
<html lang="id">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>My Application</title>
    <link rel="stylesheet" href="/assets/app.css">
</head>
<body class="bg-slate-100 min-h-screen flex items-center justify-center">

    <div class="bg-white p-8 rounded-xl shadow-lg">
        <h1 class="text-3xl font-bold text-blue-600">
            Aplikasi Berhasil!
        </h1>

        <p class="mt-3 text-slate-600">
            PHP Native + PostgreSQL
        </p>

        <p class="mt-2 text-sm text-green-600">
            Database terhubung:
            <?= htmlspecialchars($data['waktu'], ENT_QUOTES, 'UTF-8') ?>
        </p>
    </div>

</body>
</html>
```

Pastikan file CSS sudah dibuild. Jika halaman belum dapat dibuka, periksa:

```bash
systemctl status nginx
systemctl status php8.2-fpm
tail -n 50 /var/log/nginx/error.log
```

Akses IP CT dari browser pada jaringan yang dapat menjangkau CT, atau gunakan domain setelah konfigurasi DNS/Tunnel selesai.

Setelah pengujian selesai, hapus halaman diagnostik atau informasi teknis yang tidak perlu ditampilkan kepada pengguna.

## 10. Upload aplikasi menggunakan Git

Metode yang disarankan adalah GitHub.

Contoh repository:

```text
https://github.com/username/myapp.git
```

Clone aplikasi:

```bash
cd /var/www
git clone https://github.com/username/myapp.git myapp
```

Jika repository private, gunakan SSH key atau metode autentikasi GitHub yang aman. Jangan menaruh token atau password di URL repository.

Jika project sudah memiliki `package-lock.json`, install dependency secara konsisten:

```bash
cd /var/www/myapp
npm ci
npm run build
```

Setelah melakukan perubahan pada aplikasi, deployment sederhana:

```bash
cd /var/www/myapp
git pull --ff-only origin main
npm ci
npm run build
```

Sesuaikan branch dan proses build dengan repository yang digunakan. Untuk deployment production yang lebih aman, gunakan direktori release terpisah dan lakukan pergantian versi secara terkontrol agar pengguna tidak melihat kondisi setengah ter-update.

### 10.1 Permission

Hindari menjalankan seluruh source code sebagai writable oleh `www-data`.

Contoh pendekatan:

- Source code dimiliki user deployment.
- Nginx/PHP-FPM dapat membaca source code.
- Hanya direktori upload dan storage yang dapat ditulis oleh PHP-FPM.

Contoh jika user deployment bernama `deploy`:

```bash
chown -R deploy:www-data /var/www/myapp
find /var/www/myapp -type d -exec chmod 755 {} \;
find /var/www/myapp -type f -exec chmod 644 {} \;

chown -R www-data:www-data \
  /var/www/myapp/public/uploads \
  /var/www/myapp/storage
```

Sesuaikan permission dengan kebutuhan aplikasi. Jangan menggunakan `chmod -R 777`.

## 11. Menghubungkan domain melalui Cloudflare Tunnel

Jika menggunakan Cloudflare Tunnel, alurnya:

```text
Internet
   |
Cloudflare DNS
   |
Cloudflare Tunnel
   |
CT Debian 12
   |
Nginx :80
```

Tambahkan Public Hostname pada Tunnel:

| Pengaturan | Nilai |
|---|---|
| Subdomain | app |
| Domain | domain-kamu.com |
| Type | HTTP |
| URL | localhost:80 |

Contoh domain:

```text
https://app.domain-kamu.com
```

Pastikan Nginx memiliki `server_name` yang sesuai. Tunnel meneruskan koneksi ke Nginx melalui jaringan lokal CT. Dengan Tunnel, port web tidak harus dibuka langsung ke internet.

Jika menggunakan Tunnel yang sudah ada, tambahkan hostname ke Tunnel tersebut. Jangan membuat Tunnel baru tanpa memastikan kebutuhan jaringan dan konfigurasi DNS.

## 12. Checklist instalasi

- [ ] Debian 12 berhasil diperbarui.
- [ ] Nginx aktif.
- [ ] PHP 8.2 dan PHP-FPM aktif.
- [ ] Ekstensi PDO PostgreSQL tersedia.
- [ ] PostgreSQL aktif.
- [ ] Database dan user aplikasi berhasil dibuat.
- [ ] PHP berhasil terkoneksi ke PostgreSQL.
- [ ] Tailwind berhasil di-build.
- [ ] Aplikasi dapat dibuka melalui Nginx.
- [ ] GitHub berhasil digunakan untuk deployment.
- [ ] Domain dan HTTPS berhasil diakses.
- [ ] Permission source code, upload, dan storage sudah benar.
- [ ] Password dan konfigurasi rahasia tidak tersimpan di repository.
- [ ] Backup database dan file upload sudah direncanakan.

## 13. Perintah pemeriksaan dan troubleshooting

### Status service

```bash
systemctl status nginx
systemctl status php8.2-fpm
systemctl status postgresql
```

### Restart service

```bash
systemctl restart nginx
systemctl restart php8.2-fpm
systemctl restart postgresql
```

### Log Nginx

```bash
tail -f /var/log/nginx/error.log
tail -f /var/log/nginx/access.log
```

### Log PHP-FPM

```bash
journalctl -u php8.2-fpm -f
```

### Log PostgreSQL

```bash
journalctl -u postgresql -f
```

### Menguji koneksi database

```bash
sudo -u postgres psql -c '\l'
```

### Menguji konfigurasi Nginx

```bash
nginx -t
```

### Memeriksa port

```bash
ss -tulpn
```

## 14. Rekomendasi pengelolaan production

1. Gunakan HTTPS melalui Cloudflare Tunnel atau reverse proxy yang dikonfigurasi dengan benar.
2. Jangan membuka PostgreSQL ke internet.
3. Simpan password database di environment file di luar document root.
4. Jangan menampilkan error PHP secara langsung kepada pengguna production.
5. Aktifkan pencatatan error ke log.
6. Batasi permission direktori upload dan storage.
7. Lakukan backup PostgreSQL secara berkala.
8. Backup file upload secara terpisah.
9. Gunakan Git untuk version control dan deployment.
10. Uji perubahan di lingkungan staging sebelum diterapkan ke production.

## 15. Urutan pengerjaan yang disarankan

Lakukan secara bertahap:

1. Persiapkan CT Debian 12 dan pastikan IP statis atau konfigurasi jaringan sudah benar.
2. Install Nginx.
3. Install PHP dan ekstensi PostgreSQL.
4. Install PostgreSQL dan buat database.
5. Uji koneksi PHP ke PostgreSQL.
6. Install Node.js/npm dan Tailwind CSS.
7. Build CSS.
8. Konfigurasi Nginx.
9. Uji aplikasi melalui IP lokal.
10. Upload source code dari GitHub.
11. Konfigurasi Cloudflare Tunnel dan domain.
12. Uji akses HTTPS.
13. Siapkan backup dan prosedur update.

---

## Referensi resmi

- Debian: https://www.debian.org/
- Nginx: https://nginx.org/en/docs/
- PHP: https://www.php.net/manual/en/
- PostgreSQL: https://www.postgresql.org/docs/
- Tailwind CSS: https://tailwindcss.com/docs
- Node.js: https://nodejs.org/
- Cloudflare Tunnel: https://developers.cloudflare.com/cloudflare-one/connections/connect-networks/
