import { initSidebar } from "./Siswa/sidebar.js";
import { initDashboard } from "./Siswa/dashboard.js";
import { initAbsensi } from "./Siswa/absensi.js";
import { initIzin } from "./Siswa/izin.js";
import { initDailyReport } from "./Siswa/daily-report.js"; // Import module daily report

async function loadComponent(elementId, filePath) {
    const container = document.getElementById(elementId);

    if (!container) return;

    try {
        const response = await fetch(filePath);

        if (!response.ok) {
            throw new Error(`Gagal memuat ${filePath}`);
        }

        container.innerHTML = await response.text();
    } catch (error) {
        console.error(error);
        container.innerHTML = `
            <p class="p-4 text-sm text-red-500">
                Komponen gagal dimuat.
            </p>
        `;
    }
}

async function initComponents() {
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

    // Inisialisasi sidebar untuk highlight menu aktif
    initSidebar();

    // Deteksi halaman aktif berdasarkan URL
    const path = window.location.pathname;

    if (path.includes("Dashboard.html")) {
        initDashboard();
    } else if (path.includes("Absensi.html")) {
        initAbsensi();
    } else if (path.includes("Izin.html")) {
        initIzin();
    } else if (path.includes("Daily-report.html")) {
        initDailyReport();
    }
}

initComponents();