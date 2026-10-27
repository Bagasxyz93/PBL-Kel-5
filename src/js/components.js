import { initSidebar } from "./Siswa/sidebar.js";
import { initDashboard } from "./Siswa/dashboard.js";
import { initAbsensi } from "./Siswa/absensi.js";
import { initIzin } from "./Siswa/izin.js";
import { initDailyReport } from "./Siswa/daily-report.js";
import { initMateri } from "./Siswa/materi.js";
import { initProfil } from "./Siswa/profil.js";

// Memuat komponen HTML
async function loadComponent(elementId, filePath) {
const container = document.getElementById(elementId);

if (!container) {
    return;
}

const response = await fetch(filePath);

if (!response.ok) {
    throw new Error(`Gagal memuat komponen: ${filePath}`);
}

container.innerHTML = await response.text();

}

// Menampilkan halaman setelah seluruh persiapan selesai
async function initComponents() {
const app = document.getElementById("app");
const path = window.location.pathname.toLowerCase();

if (app) {
    app.classList.add("invisible", "opacity-0");
    app.setAttribute("aria-busy", "true");
}

try {
    // 1. Muat sidebar, header, dan footer
    await Promise.all([
        loadComponent(
            "sidebar-container",
            "/component/layout/sidebar-siswa.html"
        ),
        loadComponent(
            "header-container",
            "/component/layout/header-siswa.html"
        ),
        loadComponent(
            "footer-container",
            "/component/layout/footer-siswa.html"
        )
    ]);

    // 2. Aktifkan menu sidebar
    initSidebar();

    // 3. Inisialisasi konten halaman
    if (path.endsWith("/dashboard.html")) {
        await initDashboard();

    } else if (path.endsWith("/absensi.html")) {
        await initAbsensi();

    } else if (path.endsWith("/izin.html")) {
        await initIzin();

    } else if (path.endsWith("/daily-report.html")) {
        await initDailyReport();

    } else if (path.endsWith("/materi.html")) {
        initMateri();

    } else if (path.endsWith("/profil.html")) {
        initProfil();
    }

} catch (error) {
    console.error("Gagal memuat halaman:", error);

    if (app) {
        const errorMessage = document.createElement("p");

        errorMessage.className =
            "m-6 rounded-lg bg-red-50 p-4 text-sm text-red-600";

        errorMessage.textContent =
            "Halaman gagal dimuat. Periksa console browser.";

        app.appendChild(errorMessage);
    }

} finally {
    // 4. Tampilkan halaman setelah proses inisialisasi
    if (app) {
        app.classList.remove("invisible", "opacity-0");
        app.classList.add("opacity-100");
        app.setAttribute("aria-busy", "false");
    }
}

}

initComponents();