import { initSidebar } from "./Siswa/sidebar.js";
import { initDashboard } from "./Siswa/dashboard.js";

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

    initSidebar();
    initDashboard();
}

initComponents();