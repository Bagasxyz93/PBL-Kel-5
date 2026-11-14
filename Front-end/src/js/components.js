import { initDashboard } from "./Siswa/dashboard.js";
import { initAbsensi } from "./Siswa/absensi.js";
import { initIzin } from "./Siswa/izin.js";
import { initDailyReport } from "./Siswa/daily-report.js";
import { initMateri } from "./Siswa/materi.js";
import { initProfil } from "./Siswa/profil.js";

// Import tambahan untuk halaman Mentor:
import { initMentorDashboard } from "./Mentor/dashboard.js";
import { initMentorProfil } from "./Mentor/profil.js";

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
        subtitle: "SMK Asy-Syadzili",
        bgClass: "bg-[#064e3b]",
        logoBg: "bg-emerald-600 shadow-emerald-500/20",
        activeColor: "bg-emerald-600 text-white shadow-md shadow-emerald-600/30",
        roleBadgeText: "Memuat program...",
        roleBadgeColor: "text-emerald-600",
        versionText: "Versi Mentor v2.0",
        avatarBg: "bg-emerald-600 shadow-emerald-500/20",
        menus: [
            { label: "Dashboard", icon: "dashboard", href: "/pages/Mentor/Dashboard.html", active: ["dashboard.html"] },
            { label: "Kelola Materi", icon: "materi", href: "/pages/Mentor/Materi.html", active: ["materi.html"] },
            { label: "Rekap Absensi", icon: "absensi", href: "/pages/Mentor/Absensi.html", active: ["absensi.html"] },
            { label: "Daily Report", icon: "daily-report", href: "/pages/Mentor/Daily-report.html", active: ["daily-report.html"] },
            { label: "Pengajuan Izin", icon: "izin", href: "/pages/Mentor/Izin.html", active: ["izin.html"] },
            { label: "Profil Mentor", icon: "profil", href: "/pages/Mentor/Profil.html", active: ["profil.html"] }
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
        avatarBg: "bg-red-600 shadow-red-500/20",
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

    if (elementId === "header-container") {
        bindNotificationButtonDirectly();
    }
}

/* =========================================================
MENGAMBIL PROFIL MENTOR UNTUK HEADER
========================================================= */

async function loadHeaderMentorProfile() {
    try {
        const response = await fetch(
            "http://localhost:8000/api/mentor/api_profil_mentor.php",
            { credentials: "include" }
        );

        const result = await response.json();
        if (!response.ok || !result.success) return;

        const mentor = result.data;
        const headerUserName = document.getElementById("header-user-name");
        const headerUserRoleBadge = document.getElementById("header-user-role-badge");
        const headerUserAvatar = document.getElementById("header-user-avatar");

        if (headerUserName) headerUserName.textContent = mentor.nama;

        if (headerUserRoleBadge) {
            const daftarProgram = mentor.program || [];
            const namaProgram = daftarProgram.length > 0
                ? daftarProgram.map(item => item.nama_program).join(", ")
                : "Belum ada program";
            headerUserRoleBadge.textContent = "Mentor " + namaProgram;
        }

        if (headerUserAvatar) {
            const inisial = mentor.nama.trim().split(/\s+/).slice(0, 2).map(kata => kata[0]).join("").toUpperCase();
            headerUserAvatar.textContent = inisial || "GM";
        }
    } catch (error) {
        console.error("Gagal memuat profil header mentor:", error);
    }
}

/* =========================================================
RENDER LAYOUT DINAMIS (Sidebar, Header, Footer)
========================================================= */

function setupDynamicLayout(role) {
    const config = roleConfig[role] || roleConfig.peserta;
    const currentPath = window.location.pathname.toLowerCase();
    
    let defaultName = "Pengguna";
    if (role === "admin") defaultName = "Administrator";
    else if (role === "mentor") defaultName = "Guru Mentor";
    else defaultName = "Peserta";

    const userName = localStorage.getItem("userName") || defaultName;

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
    if (sidebarRoleSubtitle) sidebarRoleSubtitle.textContent = config.subtitle;
    
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

    const headerUserName = document.getElementById("header-user-name");
    const headerUserRoleBadge = document.getElementById("header-user-role-badge");
    const headerUserAvatar = document.getElementById("header-user-avatar");

    if (headerUserName) headerUserName.textContent = role === "mentor" ? "Memuat nama..." : userName;
    if (headerUserRoleBadge) {
        headerUserRoleBadge.textContent = config.roleBadgeText;
        headerUserRoleBadge.className = `text-xs font-semibold ${config.roleBadgeColor}`;
    }
    if (headerUserAvatar) {
        const initials = userName.split(" ").map(n => n[0]).join("").substring(0, 2).toUpperCase();
        headerUserAvatar.textContent = initials || "US";
        headerUserAvatar.className = `flex h-10 w-10 items-center justify-center rounded-xl ${config.avatarBg} text-xs font-bold text-white shadow-md`;
    }

    const footerVersion = document.getElementById("footer-version");
    if (footerVersion) footerVersion.textContent = config.versionText;

    const btnLogout = document.getElementById("btn-logout");
    if (btnLogout) {
        btnLogout.addEventListener("click", () => {
            localStorage.removeItem("userName");
            localStorage.removeItem("userRole");
            window.location.href = "/index.html"; 
        });
    }
}

/* =========================================================
DATA NOTIFIKASI SPESIFIK BERDASARKAN ROLE
========================================================= */

const notifikasiPerRole = {
    peserta: [
        {
            kategori: "laporan",
            judul: "Laporan Harian Siswa Disetujui",
            badge: "Disetujui",
            badgeClass: "bg-emerald-50 text-emerald-600 border border-emerald-200",
            deskripsi: "Laporan harian magang Anda telah diperiksa dan disetujui oleh Mentor.",
            waktu: "10 menit yang lalu",
            unread: true
        },
        {
            kategori: "materi",
            judul: "Materi Baru: Modul Frontend Web Development",
            badge: "Materi Baru",
            badgeClass: "bg-indigo-50 text-indigo-600 border border-indigo-200",
            deskripsi: "Mentor telah mengunggah modul pembelajaran baru untuk kelas Anda.",
            waktu: "1 jam yang lalu",
            unread: true
        }
    ],
    mentor: [
        {
            kategori: "laporan",
            judul: "Persetujuan Daily Report Siswa",
            badge: "Menunggu Review",
            badgeClass: "bg-amber-50 text-amber-600 border border-amber-200",
            deskripsi: "Terdapat 5 laporan harian baru dari siswa bimbingan yang perlu Anda tinjau.",
            waktu: "15 menit yang lalu",
            unread: true
        },
        {
            kategori: "materi",
            judul: "Jadwal Bimbingan Inkubasi",
            badge: "Agenda",
            badgeClass: "bg-emerald-50 text-emerald-600 border border-emerald-200",
            deskripsi: "Sesi bimbingan kelompok dijadwalkan berlangsung pukul 13.00 WIB hari ini.",
            waktu: "3 jam yang lalu",
            unread: false
        }
    ],
    admin: [
        {
            kategori: "sistem",
            judul: "Pendaftaran Akun Pengguna Baru",
            badge: "Sistem Admin",
            badgeClass: "bg-red-50 text-red-600 border border-red-200",
            deskripsi: "Sistem mendapati registrasi akun peserta dan mentor baru yang masuk ke database.",
            waktu: "5 menit yang lalu",
            unread: true
        },
        {
            kategori: "sistem",
            judul: "Pemeliharaan Server Portal SI-IN",
            badge: "Informasi",
            badgeClass: "bg-slate-100 text-slate-600 border border-slate-200",
            deskripsi: "Pembaruan server dan database sistem dijadwalkan malam ini pukul 23.00 WIB.",
            waktu: "Kemarin",
            unread: false
        }
    ]
};

/* =========================================================
RENDER HALAMAN NOTIFIKASI & MAP DATA KE HTML STATIS
========================================================= */

async function renderNotifikasiView(userRole) {
    const mainContainer = document.getElementById("main-content-area") || 
                          document.querySelector("main") || 
                          document.getElementById("app");
    
    if (!mainContainer) return;

    // Ambil file notifikasi.html melalui fetch
    const possiblePaths = [
        "/component/Notifikasi/notifikasi.html",
        "/Component/Notifikasi/notifikasi.html",
        "/Front-end/component/Notifikasi/notifikasi.html",
        "../../component/Notifikasi/notifikasi.html"
    ];

    let htmlContent = null;
    for (const path of possiblePaths) {
        try {
            const response = await fetch(path);
            if (response.ok) {
                htmlContent = await response.text();
                break;
            }
        } catch (e) {
            // Lanjutkan jika path gagal
        }
    }

    // Jika file HTML berhasil dimuat, masukkan ke kontainer
    if (htmlContent) {
        mainContainer.innerHTML = htmlContent;
    } else {
        // Fallback jika fetch gagal
        mainContainer.innerHTML = `
        <div class="space-y-6">
            <div class="flex flex-wrap items-center justify-between gap-4">
                <div>
                    <h1 class="text-xl font-bold tracking-tight text-slate-800">Notifikasi</h1>
                    <p class="mt-0.5 text-xs text-slate-400">Daftar pemberitahuan sistem Anda.</p>
                </div>
                <button type="button" id="btn-mark-all-read" class="inline-flex items-center gap-1.5 text-xs font-bold text-indigo-600 hover:text-indigo-700 transition">
                    Tandai Semua Sudah Dibaca
                </button>
            </div>
            <div class="space-y-3" id="notifikasi-list-container"></div>
        </div>`;
    }

    // PROSES MENGISI DATA SESUAI ROLE AKTIF
    populateNotifikasiData(userRole);
    setupNotifikasiInteractions();
}

function populateNotifikasiData(userRole) {
    const listContainer = document.getElementById("notifikasi-list-container");
    if (!listContainer) return;

    // Ambil data spesifik berdasarkan role (peserta, mentor, atau admin)
    const listData = notifikasiPerRole[userRole] || notifikasiPerRole.peserta;

    // Render ulang artikel notifikasi berdasarkan data role tersebut
    listContainer.innerHTML = listData.map(item => `
        <article class="notif-item rounded-2xl border border-slate-100 bg-white p-5 shadow-sm transition hover:border-slate-200 relative" data-category="${item.kategori}" data-unread="${item.unread}">
            <div class="flex items-start justify-between gap-4">
                <div class="flex items-start gap-4">
                    <div class="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-indigo-50 text-indigo-600 font-bold">
                        🔔
                    </div>
                    <div>
                        <div class="flex flex-wrap items-center gap-2">
                            <h2 class="text-sm font-bold text-slate-800">${item.judul}</h2>
                            <span class="rounded-full px-2.5 py-0.5 text-[9px] font-bold ${item.badgeClass}">${item.badge}</span>
                        </div>
                        <p class="mt-1 text-xs text-slate-600 leading-relaxed">${item.deskripsi}</p>
                        <span class="mt-2 block text-[10px] text-slate-400">${item.waktu}</span>
                    </div>
                </div>
                ${item.unread ? '<div class="flex items-center gap-3 shrink-0"><span class="h-2.5 w-2.5 rounded-full bg-indigo-600 unread-dot" title="Belum dibaca"></span></div>' : ''}
            </div>
        </article>
    `).join("");

    // Update jumlah badge angka pada tab jika ada
    const badgeSemua = document.querySelector('[data-filter="semua"] span');
    if (badgeSemua) badgeSemua.textContent = listData.length;

    const unreadCount = listData.filter(i => i.unread).length;
    const badgeBelumDibaca = document.querySelector('[data-filter="belum-dibaca"] span');
    if (badgeBelumDibaca) badgeBelumDibaca.textContent = unreadCount;
}

function setupNotifikasiInteractions() {
    const tabs = document.querySelectorAll(".notif-tab");
    const items = document.querySelectorAll(".notif-item");
    const btnMarkAll = document.getElementById("btn-mark-all-read");

    tabs.forEach(tab => {
        tab.addEventListener("click", () => {
            tabs.forEach(t => {
                t.className = "notif-tab rounded-xl border border-slate-200 bg-slate-50 px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 transition";
            });
            tab.className = "notif-tab rounded-xl bg-indigo-600 px-4 py-2 text-xs font-bold text-white shadow-sm transition";

            const filter = tab.dataset.filter;
            const currentItems = document.querySelectorAll(".notif-item");

            currentItems.forEach(item => {
                const category = item.dataset.category;
                const isUnread = item.dataset.unread === "true";

                if (filter === "semua") {
                    item.style.display = "block";
                } else if (filter === "belum-dibaca") {
                    item.style.display = isUnread ? "block" : "none";
                } else if (filter === "laporan" && category === "laporan") {
                    item.style.display = "block";
                } else if (filter === "materi" && category === "materi") {
                    item.style.display = "block";
                } else {
                    item.style.display = "none";
                }
            });
        });
    });

    if (btnMarkAll) {
        btnMarkAll.addEventListener("click", () => {
            document.querySelectorAll(".unread-dot").forEach(dot => dot.remove());
            document.querySelectorAll(".notif-item").forEach(item => item.dataset.unread = "false");
            btnMarkAll.textContent = "Semua Sudah Dibaca";
            btnMarkAll.classList.add("text-slate-400", "pointer-events-none");
        });
    }
}

/* =========================================================
PENGIKAT LANGSUNG TOMBOL NOTIFIKASI
========================================================= */

function bindNotificationButtonDirectly() {
    const btnNotifikasi = document.getElementById("btn-notifikasi");
    if (!btnNotifikasi) return;

    if (btnNotifikasi.dataset.bound === "true") return;
    btnNotifikasi.dataset.bound = "true";

    btnNotifikasi.addEventListener("click", (e) => {
        e.preventDefault();
        e.stopPropagation();

        const currentPath = window.location.pathname.toLowerCase();
        const savedRole = (localStorage.getItem("userRole") || "peserta").toLowerCase();

        let activeRole = savedRole;
        if (currentPath.includes("/admin/")) activeRole = "admin";
        else if (currentPath.includes("/mentor/")) activeRole = "mentor";
        else if (currentPath.includes("/siswa/")) activeRole = "peserta";

        renderNotifikasiView(activeRole);
    });
}

setInterval(bindNotificationButtonDirectly, 300);

/* =========================================================
INISIALISASI HALAMAN SISWA & MENTOR
========================================================= */

function initStudentPage(path) {
    if (path.endsWith("/dashboard.html")) initDashboard();
    else if (path.endsWith("/absensi.html")) initAbsensi();
    else if (path.endsWith("/izin.html")) initIzin();
    else if (path.endsWith("/daily-report.html")) initDailyReport();
    else if (path.endsWith("/materi.html")) initMateri();
    else if (path.endsWith("/profil.html")) initProfil();
}

function initMentorPage(path) {
    if (path.endsWith("/dashboard.html")) {
        initMentorDashboard();
    } else if (path.endsWith("/profil.html")) {
        initMentorProfil();
    }
}

/* =========================================================
INISIALISASI KOMPONEN UTAMA
========================================================= */

async function initComponents() {
    const path = window.location.pathname.toLowerCase();
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

        await Promise.all([
            loadComponent("sidebar-container", "/component/layout/sidebar.html"),
            loadComponent("header-container", "/component/layout/header.html").catch(() => {}),
            loadComponent("footer-container", "/component/layout/footer.html").catch(() => {})
        ]);

        setupDynamicLayout(userRole);

        if (userRole === "mentor") {
            await loadHeaderMentorProfile();
        }

        if (path.includes("/pages/siswa/")) {
            initStudentPage(path);
        } else if (path.includes("/pages/mentor/")) {
            initMentorPage(path);
        }

    } catch (error) {
        console.error("Gagal menginisialisasi komponen:", error);
    } finally {
        if (app) app.classList.remove("invisible", "opacity-0");
    }
}

initComponents();