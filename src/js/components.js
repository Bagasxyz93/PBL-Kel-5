import { initDashboard } from "./Siswa/dashboard.js";
import { initAbsensi } from "./Siswa/absensi.js";
import { initIzin } from "./Siswa/izin.js";
import { initDailyReport } from "./Siswa/daily-report.js";
import { initMateri } from "./Siswa/materi.js";
import { initProfil } from "./Siswa/profil.js";

/* =========================================================
KONFIGURASI MENU & TEMA BERDASARKAN ROLE
========================================================= */

const roleConfig = {
    peserta: {
        title: "SI",
        subtitle: "Portal Peserta",
        bgClass: "bg-[#1e1b4b]",
        logoBg: "bg-indigo-600 shadow-indigo-500/20",
        activeColor: "bg-indigo-600 text-white shadow-md shadow-indigo-600/30",
        roleBadgeText: "Siswa Web Dev",
        roleBadgeColor: "text-indigo-600",
        versionText: "Versi Siswa v2.0",
        avatarBg: "bg-indigo-600 shadow-indigo-500/20",
        menus: [
            { label: "Dashboard", icon: "dashboard", href: "/pages/Siswa/Dashboard.html", active: ["dashboard.html"] },
            { label: "Absensi", icon: "absensi", href: "/pages/Siswa/Absensi.html", active: ["absensi.html"] },
            { label: "Pengajuan Izin", icon: "izin", href: "/pages/Siswa/Izin.html", active: ["izin.html"] },
            { label: "Daily Report", icon: "daily-report", href: "/pages/Siswa/Daily-report.html", active: ["daily-report.html"] },
            { label: "Materi", icon: "materi", href: "/pages/Siswa/Materi.html", active: ["materi.html"] },
            { label: "Profil", icon: "profil", href: "/pages/Siswa/Profil.html", active: ["profil.html"] }
        ]
    },

    mentor: {
        title: "SI",
        subtitle: "Portal Mentor",
        bgClass: "bg-[#064e3b]",
        logoBg: "bg-emerald-600 shadow-emerald-500/20",
        activeColor: "bg-emerald-600 text-white shadow-md shadow-emerald-600/30",
        roleBadgeText: "Mentor Web Dev",
        roleBadgeColor: "text-emerald-600",
        versionText: "Versi Mentor v2.0",
        avatarBg: "bg-emerald-600 shadow-emerald-500/20",
        menus: [
            { label: "Dashboard", icon: "dashboard", href: "/pages/Mentor/Dashboard.html", active: ["dashboard.html"] },
            { label: "Data Siswa", icon: "siswa", href: "/pages/Mentor/Siswa.html", active: ["siswa.html"] },
            { label: "Absensi", icon: "absensi", href: "/pages/Mentor/Absensi.html", active: ["absensi.html"] },
            { label: "Daily Report", icon: "daily-report", href: "/pages/Mentor/Daily-report.html", active: ["daily-report.html"] },
            { label: "Materi", icon: "materi", href: "/pages/Mentor/Materi.html", active: ["materi.html"] },
            { label: "Profil", icon: "profil", href: "/pages/Mentor/Profil.html", active: ["profil.html"] }
        ]
    },

    admin: {
        title: "SI",
        subtitle: "Administrator",
        bgClass: "bg-[#1f2937]",
        logoBg: "bg-red-600 shadow-red-500/20",
        activeColor: "bg-red-600 text-white shadow-md shadow-red-600/30",
        roleBadgeText: "Administrator",
        roleBadgeColor: "text-red-600",
        versionText: "Versi Admin v1.2",
        avatarBg: "bg-red-600 shadow-red-500/20", // Warna merah sesuai tema admin
        menus: [
            { label: "Dashboard", icon: "dashboard", href: "/pages/Admin/Dashboard.html", active: ["dashboard.html"] },
            { label: "Data Siswa", icon: "siswa", href: "/pages/Admin/Siswa.html", active: ["siswa.html"] },
            { label: "Data Mentor", icon: "mentor", href: "/pages/Admin/Mentor.html", active: ["mentor.html"] },
            { label: "Program Inkubasi", icon: "program", href: "/pages/Admin/Program.html", active: ["program.html"] }
        ]
    }
};

/* =========================================================
IKON MENU
========================================================= */

const menuIcons = {
    dashboard: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><rect x="3" y="3" width="7" height="7" rx="1"/><rect x="14" y="3" width="7" height="7" rx="1"/><rect x="3" y="14" width="7" height="7" rx="1"/><rect x="14" y="14" width="7" height="7" rx="1"/></svg>`,
    absensi: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><rect x="3" y="5" width="18" height="16" rx="2"/><path d="M16 3v4M8 3v4M3 10h18"/><path d="m8 15 2 2 5-5"/></svg>`,
    izin: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><path d="M14 2v6h6M8 13h8M8 17h5"/></svg>`,
    "daily-report": `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><path d="M4 3h16v18H4z"/><path d="M8 7h8M8 11h8M8 15h5"/></svg>`,
    materi: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><path d="M12 7v14"/><path d="M3 5a2 2 0 0 1 2-2h5a2 2 0 0 1 2 2v16a2 2 0 0 0-2-2H5a2 2 0 0 0-2 2z"/><path d="M21 5a2 2 0 0 0-2-2h-5a2 2 0 0 0-2 2v16a2 2 0 0 1 2-2h5a2 2 0 0 1 2 2z"/></svg>`,
    profil: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><circle cx="12" cy="8" r="4"/><path d="M4 21a8 8 0 0 1 16 0"/></svg>`,
    siswa: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><path d="M16 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="10" cy="7" r="4"/><path d="M20 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75"/></svg>`,
    mentor: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><circle cx="12" cy="7" r="4"/><path d="M4 21v-2a8 8 0 0 1 16 0v2"/><path d="M9 14h6"/></svg>`,
    program: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><rect x="3" y="4" width="18" height="16" rx="2"/><path d="M8 2v4M16 2v4M3 9h18M8 13h3M8 16h7"/></svg>`
};

/* =========================================================
MEMUAT KOMPONEN HTML
========================================================= */

async function loadComponent(elementId, filePath) {
    const container = document.getElementById(elementId);
    if (!container) return;

    const response = await fetch(filePath);
    if (!response.ok) {
        throw new Error(`Gagal memuat "${filePath}". HTTP ${response.status}`);
    }

    container.innerHTML = await response.text();
}

/* =========================================================
RENDER LAYOUT DINAMIS (Sidebar, Header, Footer)
========================================================= */

function setupDynamicLayout(role) {
    const config = roleConfig[role] || roleConfig.peserta;
    const currentPath = window.location.pathname.toLowerCase();
    
    // Tentukan nama user berdasarkan role jika belum ada di localStorage
    let defaultName = "Pengguna";
    if (role === "admin") defaultName = "Administrator";
    else if (role === "mentor") defaultName = "Guru Mentor";
    else defaultName = "Peserta Dummy";

    const userName = localStorage.getItem("userName") || defaultName;

    // 1. Setup Sidebar
    const sidebarWrapper = document.getElementById("sidebar-wrapper");
    const sidebarLogoBox = document.getElementById("sidebar-logo-box");
    const sidebarRoleSubtitle = document.getElementById("sidebar-role-subtitle");
    const sidebarNavContainer = document.getElementById("sidebar-nav-container");

    if (sidebarWrapper) {
        sidebarWrapper.className = `flex h-full w-60 flex-col ${config.bgClass} text-slate-300 transition-colors duration-300`;
        sidebarWrapper.dataset.role = role;
    }
    if (sidebarLogoBox) {
        sidebarLogoBox.className = `flex h-10 w-10 shrink-0 items-center justify-center rounded-xl ${config.logoBg} text-sm font-bold text-white shadow-md`;
        sidebarLogoBox.textContent = config.title;
    }
    if (sidebarRoleSubtitle) {
        sidebarRoleSubtitle.textContent = config.subtitle;
    }
    if (sidebarNavContainer) {
        sidebarNavContainer.innerHTML = config.menus.map(menu => {
            const isActive = menu.active.some(file => currentPath.endsWith(file.toLowerCase()));
            const activeClasses = isActive ? config.activeColor : "text-slate-400 hover:bg-white/5 hover:text-white";

            return `
                <a href="${menu.href}" class="sidebar-menu-item flex items-center gap-3 rounded-2xl px-4 py-3 text-sm font-medium transition-all duration-200 ${activeClasses}" ${isActive ? 'aria-current="page"' : ""}>
                    <span class="sidebar-menu-icon h-5 w-5 shrink-0">${menuIcons[menu.icon] || ""}</span>
                    <span class="sidebar-menu-label">${menu.label}</span>
                </a>
            `;
        }).join("");
    }

    // 2. Setup Header Dinamis (Nama, Badge Role, dan Warna Background Avatar)
    const headerUserName = document.getElementById("header-user-name");
    const headerUserRoleBadge = document.getElementById("header-user-role-badge");
    const headerUserAvatar = document.getElementById("header-user-avatar");

    if (headerUserName) headerUserName.textContent = userName;
    if (headerUserRoleBadge) {
        headerUserRoleBadge.textContent = config.roleBadgeText;
        headerUserRoleBadge.className = `text-xs font-semibold ${config.roleBadgeColor}`;
    }
    if (headerUserAvatar) {
        const initials = userName.split(" ").map(n => n[0]).join("").substring(0, 2).toUpperCase();
        headerUserAvatar.textContent = initials || "US";
        // Mengubah background avatar secara dinamis sesuai tema role (Merah untuk Admin, Hijau untuk Mentor, dll)
        headerUserAvatar.className = `flex h-10 w-10 items-center justify-center rounded-xl ${config.avatarBg} text-xs font-bold text-white shadow-md`;
    }

    // 3. Setup Footer Dinamis
    const footerVersion = document.getElementById("footer-version");
    if (footerVersion) {
        footerVersion.textContent = config.versionText;
    }
}

/* =========================================================
INISIALISASI HALAMAN SISWA
========================================================= */

function initStudentPage(path) {
    if (path.endsWith("/dashboard.html")) initDashboard();
    else if (path.endsWith("/absensi.html")) initAbsensi();
    else if (path.endsWith("/izin.html")) initIzin();
    else if (path.endsWith("/daily-report.html")) initDailyReport();
    else if (path.endsWith("/materi.html")) initMateri();
    else if (path.endsWith("/profil.html")) initProfil();
}

/* =========================================================
INISIALISASI KOMPONEN UTAMA
========================================================= */

async function initComponents() {
    const path = window.location.pathname.toLowerCase();

    // Halaman login di luar folder /pages/ aman dari layout dashboard
    if (!path.includes("/pages/")) return;

    const app = document.getElementById("app");

    try {
        const savedRole = (localStorage.getItem("userRole") || "").toLowerCase();

        const userRole = path.includes("/pages/admin/")
            ? "admin"
            : path.includes("/pages/mentor/")
                ? "mentor"
                : savedRole || "peserta";

        if (!roleConfig[userRole]) {
            throw new Error(`Role "${userRole}" tidak valid.`);
        }

        if (app) app.classList.add("invisible", "opacity-0");

        // Memuat komponen master layout universal secara bersamaan
        await Promise.all([
            loadComponent("sidebar-container", "/component/layout/sidebar.html"),
            loadComponent("header-container", "/component/layout/header.html").catch(() => {}),
            loadComponent("footer-container", "/component/layout/footer.html").catch(() => {})
        ]);

        // Terapkan layout dinamis (Sidebar, Header, Footer menyesuaikan role)
        setupDynamicLayout(userRole);

        if (path.includes("/pages/siswa/")) {
            initStudentPage(path);
        }

    } catch (error) {
        console.error("Gagal menginisialisasi komponen:", error);
    } finally {
        if (app) app.classList.remove("invisible", "opacity-0");
    }
}

initComponents();