import { API_BASE_URL } from "./api-config.js";


import { initDashboard } from "./Siswa/dashboard.js";
import { initAbsensi } from "./Siswa/absensi.js";
import { initIzin } from "./Siswa/izin.js";
import { initDailyReport } from "./Siswa/daily-report.js";
import { initMateri } from "./Siswa/materi.js";
import { initProfil } from "./Siswa/profil.js";

// Import halaman Mentor
import { initMentorDashboard } from "./Mentor/dashboard.js";
import { initMentorProfil } from "./Mentor/profil.js";
import { initMentorIzin } from "./Mentor/izin.js";

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
        roleBadgeText: "Memuat program...",
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
            { label: "Program Inkubasi", icon: "program", href: "/pages/Admin/Program.html", active: ["program.html"] },
            { label: "Daftar RFID", icon: "rfid", href: "/pages/Admin/Rfid.html", active: ["rfid.html"] }
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

    materi: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><path d="M12 7v14"/><path d="M3 5a2 2 0 0 1 2-2h5a2 2 0 0 1 2 2v16a2 2 0 0 0-2-2H5a2 2 0 0 0-2 2z"/><path d="M21 5a2 2 0 0 0-2-2h-5a2 2 0 0 0-2 2v16a2 2 0 0 1 2-2h5a2 2 0 0 0 2 2z"/></svg>`,

    profil: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><circle cx="12" cy="8" r="4"/><path d="M4 21a8 8 0 0 1 16 0"/></svg>`,

    siswa: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><path d="M16 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="10" cy="7" r="4"/><path d="M20 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75"/></svg>`,

    mentor: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><circle cx="12" cy="7" r="4"/><path d="M4 21v-2a8 8 0 0 1 16 0v2"/><path d="M9 14h6"/></svg>`,

    program: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><rect x="3" y="4" width="18" height="16" rx="2"/><path d="M8 2v4M16 2v4M3 9h18M8 13h3M8 16h7"/></svg>`,

    rfid: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><rect x="3" y="4" width="18" height="16" rx="3"/><text x="7" y="16" font-size="9" font-weight="bold" fill="currentColor" stroke="none">123</text></svg>`
};

/* =========================================================
   HELPER TOKEN
========================================================= */

function getAuthHeaders() {
    const token = sessionStorage.getItem("authToken");

    if (!token) {
        throw new Error("Token login tidak ditemukan. Silakan login kembali.");
    }

    return {
        Authorization: `Bearer ${token}`
    };
}

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
            `${API_BASE_URL}/api/mentor/api_profil_mentor.php`,
            {
                method: "GET",
                headers: getAuthHeaders()
            }
        );

        const result = await response.json();

        if (!response.ok || !result.success) {
            throw new Error(result.message || "Gagal mengambil profil mentor.");
        }

        const mentor = result.data;

        const headerUserName = document.getElementById("header-user-name");
        const headerUserRoleBadge = document.getElementById("header-user-role-badge");
        const headerUserAvatar = document.getElementById("header-user-avatar");

        if (headerUserName) {
            headerUserName.textContent = mentor.nama;
        }

        if (headerUserRoleBadge) {
            const daftarProgram = mentor.program || [];

            const namaProgram = daftarProgram.length > 0
                ? daftarProgram.map(item => item.nama_program).join(", ")
                : "Belum ada program";

            headerUserRoleBadge.textContent = "Mentor " + namaProgram;
        }

        if (headerUserAvatar) {
            const inisial = mentor.nama
                .trim()
                .split(/\s+/)
                .slice(0, 2)
                .map(kata => kata[0])
                .join("")
                .toUpperCase();

            headerUserAvatar.textContent = inisial || "GM";
        }

    } catch (error) {
        console.error("Gagal memuat profil header mentor:", error);
    }
}


/* =========================================================
   MENGAMBIL PROFIL SISWA UNTUK HEADER
========================================================= */

async function loadHeaderStudentProfile() {
    try {
        const response = await fetch(
            `${API_BASE_URL}/api/siswa/api_dashboard.php`,
            {
                method: "GET",
                headers: getAuthHeaders()
            }
        );

        const result = await response.json();

        if (!response.ok || !result.success) {
            throw new Error(result.message || "Gagal mengambil profil siswa.");
        }

        const namaSiswa = result.data.nama || "Peserta";

        const headerUserName = document.getElementById("header-user-name");
        const headerUserRoleBadge = document.getElementById("header-user-role-badge");
        const headerUserAvatar = document.getElementById("header-user-avatar");

        // Nama siswa
        if (headerUserName) {
            headerUserName.textContent = namaSiswa;
        }

        // Ambil program siswa dari API profil siswa
        let namaProgram = "Program Inkubasi";

        try {
            const responseProfil = await fetch(
                `${API_BASE_URL}/api/siswa/api_profil_siswa.php`,
                {
                    method: "GET",
                    headers: getAuthHeaders()
                }
            );

            const resultProfil = await responseProfil.json();

            if (responseProfil.ok && resultProfil.success) {
                const dataProfil = resultProfil.data;

                if (Array.isArray(dataProfil.program)) {
                    namaProgram = dataProfil.program
                        .map(item => item.nama_program || item.nama)
                        .filter(Boolean)
                        .join(", ") || namaProgram;
                } else if (typeof dataProfil.program === "string") {
                    namaProgram = dataProfil.program || namaProgram;
                } else if (dataProfil.nama_program) {
                    namaProgram = dataProfil.nama_program;
                }
            }
        } catch (error) {
            console.warn("Gagal mengambil program siswa:", error);
        }

        // Badge program
        if (headerUserRoleBadge) {
            headerUserRoleBadge.textContent = namaProgram;
        }

        // Avatar inisial siswa
        if (headerUserAvatar) {
            const inisial = namaSiswa
                .trim()
                .split(/\s+/)
                .slice(0, 2)
                .map(kata => kata[0])
                .join("")
                .toUpperCase();

            headerUserAvatar.textContent = inisial || "PS";
        }

    } catch (error) {
        console.error("Gagal memuat profil header siswa:", error);
    }
}

/* =========================================================
   RENDER LAYOUT DINAMIS
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

    if (sidebarRoleSubtitle) {
        sidebarRoleSubtitle.textContent = config.subtitle;
    }

    if (sidebarNavContainer) {
        sidebarNavContainer.innerHTML = config.menus.map(menu => {
            const isActive = menu.active.some(file =>
                currentPath.endsWith(file.toLowerCase())
            );

            const activeClasses = isActive
                ? config.activeColor
                : "text-slate-400 hover:bg-white/5 hover:text-white";

            return `
                <a
                    href="${menu.href}"
                    class="sidebar-menu-item flex items-center gap-3 rounded-2xl px-4 py-3 text-sm font-medium transition-all duration-200 ${activeClasses}"
                    ${isActive ? 'aria-current="page"' : ""}
                >
                    <span class="sidebar-menu-icon h-5 w-5 shrink-0">
                        ${menuIcons[menu.icon] || ""}
                    </span>

                    <span class="sidebar-menu-label">
                        ${menu.label}
                    </span>
                </a>
            `;
        }).join("");
    }

    const headerUserName = document.getElementById("header-user-name");
    const headerUserRoleBadge = document.getElementById("header-user-role-badge");
    const headerUserAvatar = document.getElementById("header-user-avatar");

    if (headerUserName) {
        headerUserName.textContent =
            role === "mentor" || role === "peserta"
                ? "Memuat nama..."
                : userName;
    }

    if (headerUserRoleBadge) {
        headerUserRoleBadge.textContent = config.roleBadgeText;
        headerUserRoleBadge.className =
            `text-xs font-semibold ${config.roleBadgeColor}`;
    }

    if (headerUserAvatar) {
        const initials = userName
            .split(" ")
            .map(n => n[0])
            .join("")
            .substring(0, 2)
            .toUpperCase();

        headerUserAvatar.textContent = initials || "US";

        headerUserAvatar.className =
            `flex h-10 w-10 items-center justify-center rounded-xl ${config.avatarBg} text-xs font-bold text-white shadow-md`;
    }

    const footerVersion = document.getElementById("footer-version");

    if (footerVersion) {
        footerVersion.textContent = config.versionText;
    }

    const btnLogout = document.getElementById("btn-logout");

    if (btnLogout && btnLogout.dataset.bound !== "true") {
        btnLogout.dataset.bound = "true";

        btnLogout.addEventListener("click", () => {
            localStorage.removeItem("userName");
            localStorage.removeItem("userRole");
            sessionStorage.removeItem("authToken");

            window.location.href = "/index.html";
        });
    }
}

/* =========================================================
   NOTIFIKASI - KONFIGURASI
========================================================= */

const API_NOTIFIKASI =
    `${API_BASE_URL}/api/notifikasi/api_notifikasi.php`;

let daftarNotifikasi = [];
let roleNotifikasiAktif = "peserta";
let filterNotifikasiAktif = "semua";
let halamanNotifikasiAktif = 1;

const JUMLAH_NOTIFIKASI_PER_HALAMAN = 10;

let intervalNotifikasi = null;

/* =========================================================
   NOTIFIKASI - HELPER
========================================================= */

function escapeHTML(teks) {
    const elemen = document.createElement("div");
    elemen.textContent = teks ?? "";

    return elemen.innerHTML;
}

function formatWaktuNotifikasi(waktu) {
    if (!waktu) return "-";

    const tanggal = new Date(
        String(waktu).replace(" ", "T")
    );

    if (isNaN(tanggal.getTime())) {
        return waktu;
    }

    return tanggal.toLocaleString("id-ID", {
        dateStyle: "medium",
        timeStyle: "short"
    });
}

function getNotificationStorageKey(role) {
    const userName = localStorage.getItem("userName") || "pengguna";

    return `notifikasi_dibaca_${role}_${userName}`;
}

function getDaftarNotifikasiDibaca(role) {
    try {
        const data = JSON.parse(
            localStorage.getItem(getNotificationStorageKey(role)) || "[]"
        );

        return Array.isArray(data) ? data.map(String) : [];

    } catch (error) {
        return [];
    }
}

function simpanDaftarNotifikasiDibaca(role, daftar) {
    localStorage.setItem(
        getNotificationStorageKey(role),
        JSON.stringify([...new Set(daftar.map(String))])
    );
}

function isNotifikasiDibaca(id, role) {
    return getDaftarNotifikasiDibaca(role).includes(String(id));
}

function getLabelKategori(kategori) {
    const labels = {
        laporan: "Daily Report",
        materi: "Materi",
        akun: "Aktivitas Akun",
        izin: "Pengajuan Izin"
    };

    return labels[kategori] || "Informasi";
}

function getBadgeClass(kategori, status) {
    if (kategori === "laporan") {
        if (status === "diterima") {
            return "bg-emerald-50 text-emerald-600 border border-emerald-200";
        }

        if (status === "ditolak") {
            return "bg-red-50 text-red-600 border border-red-200";
        }

        return "bg-indigo-50 text-indigo-600 border border-indigo-200";
    }

    if (kategori === "izin") {
        if (status === "disetujui") {
            return "bg-emerald-50 text-emerald-600 border border-emerald-200";
        }

        if (status === "ditolak") {
            return "bg-red-50 text-red-600 border border-red-200";
        }

        return "bg-amber-50 text-amber-600 border border-amber-200";
    }

    if (kategori === "akun") {
        return "bg-emerald-50 text-emerald-600 border border-emerald-200";
    }

    if (kategori === "materi") {
        return "bg-purple-50 text-purple-600 border border-purple-200";
    }

    return "bg-slate-100 text-slate-600 border border-slate-200";
}

function getLabelStatus(status) {
    const labels = {
        diterima: "Diterima",
        ditolak: "Ditolak",
        disetujui: "Disetujui",
        menunggu: "Menunggu",
        info: "Informasi"
    };

    return labels[status] || "Informasi";
}

/* =========================================================
   NOTIFIKASI - MENANDAI SUDAH DILIHAT
========================================================= */

function tandaiNotifikasiSudahDilihat(role, daftar) {
    const daftarDibaca = getDaftarNotifikasiDibaca(role);

    const semuaId = daftar.map(item => String(item.id));

    simpanDaftarNotifikasiDibaca(
        role,
        [...daftarDibaca, ...semuaId]
    );
}

/* =========================================================
   NOTIFIKASI - MENGAMBIL DATA API
========================================================= */

async function ambilDataNotifikasi() {
    const response = await fetch(API_NOTIFIKASI, {
        method: "GET",
        headers: {
            "Accept": "application/json",
            ...getAuthHeaders()
        }
    });

    const result = await response.json();

    if (!response.ok || !result.success) {
        throw new Error(
            result.message || "Gagal mengambil data notifikasi."
        );
    }

    if (!Array.isArray(result.data)) {
        throw new Error("Format data notifikasi dari API tidak sesuai.");
    }

    return result.data.map(item => ({
        id: String(item.id),
        kategori: item.kategori || "lainnya",
        judul: item.judul || "Notifikasi",
        pesan: item.pesan || "",
        waktu: item.waktu || "",
        status: item.status || "info"
    }));
}

/* =========================================================
   NOTIFIKASI - MEMUAT HALAMAN
========================================================= */

async function renderNotifikasiView(userRole) {
    const mainContainer =
        document.getElementById("main-content-area") ||
        document.querySelector("main") ||
        document.getElementById("app");

    if (!mainContainer) return;

    roleNotifikasiAktif = userRole;
    halamanNotifikasiAktif = 1;
    filterNotifikasiAktif = "semua";

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

        } catch (error) {
            console.warn("Gagal memuat komponen notifikasi:", path);
        }
    }

    if (htmlContent) {
        mainContainer.innerHTML = htmlContent;

    } else {
        mainContainer.innerHTML = `
            <div class="space-y-6">
                <h1 class="text-xl font-bold text-slate-800">
                    Notifikasi
                </h1>

                <div id="notifikasi-list-container"></div>
            </div>
        `;
    }

    setupNotifikasiInteractions();

    await populateNotifikasiData(userRole);
}

/* =========================================================
   NOTIFIKASI - MENAMPILKAN DATA
========================================================= */

async function populateNotifikasiData(userRole) {
    const listContainer = document.getElementById(
        "notifikasi-list-container"
    );

    if (!listContainer) return;

    listContainer.innerHTML = `
        <div class="rounded-2xl border border-slate-100 bg-white p-8 text-center">
            <p class="text-sm font-semibold text-slate-600">
                Memuat notifikasi...
            </p>
        </div>
    `;

    try {
        daftarNotifikasi = await ambilDataNotifikasi();

        daftarNotifikasi.sort((a, b) => {
            return new Date(b.waktu).getTime() -
                new Date(a.waktu).getTime();
        });

        // Semua notifikasi dianggap sudah dilihat
        // ketika halaman notifikasi dibuka.
        tandaiNotifikasiSudahDilihat(
            userRole,
            daftarNotifikasi
        );

        halamanNotifikasiAktif = 1;

        renderDaftarNotifikasi();

    } catch (error) {
        console.error("Gagal memuat notifikasi:", error);

        daftarNotifikasi = [];

        listContainer.innerHTML = `
            <div class="rounded-2xl border border-red-100 bg-red-50 p-6 text-center">
                <p class="text-sm font-semibold text-red-600">
                    Gagal Memuat Notifikasi
                </p>

                <p class="mt-1 text-xs text-red-500">
                    ${escapeHTML(error.message)}
                </p>

                <button
                    type="button"
                    id="btn-reload-notifikasi"
                    class="mt-4 rounded-xl bg-red-600 px-4 py-2 text-xs font-bold text-white hover:bg-red-700"
                >
                    Coba Lagi
                </button>
            </div>
        `;

        const btnReload = document.getElementById(
            "btn-reload-notifikasi"
        );

        if (btnReload) {
            btnReload.addEventListener("click", () => {
                populateNotifikasiData(userRole);
            });
        }

        updateJumlahNotifikasi();
        updatePagination(0);
    }
}

/* =========================================================
   NOTIFIKASI - FILTER DATA
========================================================= */

function getNotifikasiSesuaiFilter() {
    const daftarDibaca = getDaftarNotifikasiDibaca(
        roleNotifikasiAktif
    );

    return daftarNotifikasi.filter(item => {
        const sudahDibaca = daftarDibaca.includes(String(item.id));

        if (filterNotifikasiAktif === "semua") {
            return true;
        }

        if (filterNotifikasiAktif === "belum-dibaca") {
            return !sudahDibaca;
        }

        return item.kategori === filterNotifikasiAktif;
    });
}

/* =========================================================
   NOTIFIKASI - RENDER ITEM
========================================================= */

function renderItemNotifikasi(item) {
    const sudahDibaca = isNotifikasiDibaca(
        item.id,
        roleNotifikasiAktif
    );

    const badge = getLabelKategori(item.kategori);
    const badgeClass = getBadgeClass(item.kategori, item.status);
    const statusLabel = getLabelStatus(item.status);

    const dotHTML = sudahDibaca
        ? ""
        : `
            <span
                class="h-2.5 w-2.5 shrink-0 rounded-full bg-indigo-600 unread-dot"
                title="Belum dibaca"
            ></span>
        `;

    return `
        <article
            class="notif-item rounded-2xl border border-slate-100 bg-white p-5 shadow-sm transition hover:border-slate-200 relative"
            data-category="${escapeHTML(item.kategori)}"
            data-unread="${!sudahDibaca}"
            data-id="${escapeHTML(item.id)}"
        >
            <div class="flex items-start justify-between gap-4">

                <div class="flex items-start gap-4">

                    <div class="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-indigo-50 text-indigo-600">
                        <svg
                            class="h-5 w-5"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                        >
                            <path
                                stroke-linecap="round"
                                stroke-linejoin="round"
                                stroke-width="1.8"
                                d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"
                            />
                        </svg>
                    </div>

                    <div>
                        <div class="flex flex-wrap items-center gap-2">

                            <h2 class="text-sm font-bold text-slate-800">
                                ${escapeHTML(item.judul)}
                            </h2>

                            <span class="rounded-full px-2.5 py-0.5 text-[9px] font-bold ${badgeClass}">
                                ${escapeHTML(badge)}
                            </span>

                            ${item.status !== "info" ? `
                                <span class="rounded-full px-2.5 py-0.5 text-[9px] font-bold ${badgeClass}">
                                    ${escapeHTML(statusLabel)}
                                </span>
                            ` : ""}

                        </div>

                        <p class="mt-1 text-xs text-slate-600 leading-relaxed">
                            ${escapeHTML(item.pesan)}
                        </p>

                        <span class="mt-2 block text-[10px] text-slate-400">
                            ${escapeHTML(formatWaktuNotifikasi(item.waktu))}
                        </span>
                    </div>

                </div>

                <div class="flex items-center gap-3 shrink-0">
                    ${dotHTML}
                </div>

            </div>
        </article>
    `;
}

/* =========================================================
   NOTIFIKASI - RENDER DAFTAR DAN PAGINATION
========================================================= */

function renderDaftarNotifikasi() {
    const listContainer = document.getElementById(
        "notifikasi-list-container"
    );

    if (!listContainer) return;

    const dataFilter = getNotifikasiSesuaiFilter();

    const totalHalaman = Math.max(
        1,
        Math.ceil(dataFilter.length / JUMLAH_NOTIFIKASI_PER_HALAMAN)
    );

    if (halamanNotifikasiAktif > totalHalaman) {
        halamanNotifikasiAktif = totalHalaman;
    }

    const mulai = (
        halamanNotifikasiAktif - 1
    ) * JUMLAH_NOTIFIKASI_PER_HALAMAN;

    const dataHalaman = dataFilter.slice(
        mulai,
        mulai + JUMLAH_NOTIFIKASI_PER_HALAMAN
    );

    if (dataHalaman.length === 0) {
        listContainer.innerHTML = `
            <div class="rounded-2xl border border-slate-100 bg-white p-8 text-center shadow-sm">

                <div class="flex justify-center mb-3">
                    <svg
                        class="h-10 w-10 text-slate-300"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                    >
                        <path
                            stroke-linecap="round"
                            stroke-linejoin="round"
                            stroke-width="1.5"
                            d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"
                        />
                    </svg>
                </div>

                <p class="text-sm font-semibold text-slate-600">
                    Tidak Ada Notifikasi
                </p>

                <p class="mt-1 text-xs text-slate-400">
                    Belum ada pemberitahuan untuk kategori ini.
                </p>

            </div>
        `;

    } else {
        listContainer.innerHTML = dataHalaman
            .map(item => renderItemNotifikasi(item))
            .join("");
    }

    updateJumlahNotifikasi();
    updatePagination(dataFilter.length);
}

/* =========================================================
   NOTIFIKASI - UPDATE JUMLAH
========================================================= */

function updateJumlahNotifikasi() {
    const totalSemua = daftarNotifikasi.length;

    const daftarDibaca = getDaftarNotifikasiDibaca(
        roleNotifikasiAktif
    );

    const totalBelumDibaca = daftarNotifikasi.filter(item => {
        return !daftarDibaca.includes(String(item.id));
    }).length;

    const countSemua = document.getElementById("notif-count-semua");
    const countBelumDibaca = document.getElementById("notif-count-belum-dibaca");

    if (countSemua) {
        countSemua.textContent = totalSemua;
    }

    if (countBelumDibaca) {
        countBelumDibaca.textContent = totalBelumDibaca;
    }

    updateNotificationDot();
}

/* =========================================================
   NOTIFIKASI - UPDATE TITIK MERAH HEADER
========================================================= */

function updateNotificationDot() {
    const notificationDot = document.getElementById(
        "notification-dot"
    );

    if (!notificationDot) return;

    const daftarDibaca = getDaftarNotifikasiDibaca(
        roleNotifikasiAktif
    );

    const adaNotifikasiBelumDibaca = daftarNotifikasi.some(item => {
        return !daftarDibaca.includes(String(item.id));
    });

    notificationDot.classList.toggle(
        "hidden",
        !adaNotifikasiBelumDibaca
    );
}

/* =========================================================
   NOTIFIKASI - CEK NOTIFIKASI UNTUK HEADER
========================================================= */

async function populateNotifikasiUntukHeader() {
    try {
        const dataTerbaru = await ambilDataNotifikasi();

        daftarNotifikasi = dataTerbaru;

        const listContainer = document.getElementById(
            "notifikasi-list-container"
        );

        // Jika halaman notifikasi sedang terbuka,
        // notifikasi baru langsung dianggap sudah dilihat.
        if (listContainer) {
            tandaiNotifikasiSudahDilihat(
                roleNotifikasiAktif,
                daftarNotifikasi
            );

            updateJumlahNotifikasi();

        } else {
            updateNotificationDot();
        }

    } catch (error) {
        console.error("Gagal mengecek notifikasi header:", error);
    }
}

/* =========================================================
   NOTIFIKASI - CEK OTOMATIS SETIAP 5 DETIK
========================================================= */

function mulaiCekNotifikasiOtomatis() {
    if (intervalNotifikasi) {
        clearInterval(intervalNotifikasi);
    }

    intervalNotifikasi = setInterval(async () => {
        // Hanya mengecek data terbaru dan memperbarui titik merah.
        // Tidak me-render ulang daftar notifikasi.
        await populateNotifikasiUntukHeader();
    }, 5000);
}

/* =========================================================
   NOTIFIKASI - UPDATE PAGINATION
========================================================= */

function updatePagination(totalData) {
    const totalHalaman = Math.max(
        1,
        Math.ceil(totalData / JUMLAH_NOTIFIKASI_PER_HALAMAN)
    );

    const currentPage = document.getElementById("notif-current-page");
    const totalPage = document.getElementById("notif-total-page");
    const btnPrev = document.getElementById("btn-notif-prev");
    const btnNext = document.getElementById("btn-notif-next");

    if (currentPage) {
        currentPage.textContent = halamanNotifikasiAktif;
    }

    if (totalPage) {
        totalPage.textContent = totalHalaman;
    }

    if (btnPrev) {
        btnPrev.disabled = halamanNotifikasiAktif <= 1;

        btnPrev.className = btnPrev.disabled
            ? "rounded-xl border border-slate-200 bg-slate-50 px-3.5 py-2 text-xs font-semibold text-slate-400 cursor-not-allowed"
            : "rounded-xl border border-slate-200 bg-white px-3.5 py-2 text-xs font-bold text-slate-700 hover:bg-slate-50 shadow-sm transition";
    }

    if (btnNext) {
        btnNext.disabled = halamanNotifikasiAktif >= totalHalaman;

        btnNext.className = btnNext.disabled
            ? "rounded-xl border border-slate-200 bg-slate-50 px-3.5 py-2 text-xs font-semibold text-slate-400 cursor-not-allowed"
            : "rounded-xl border border-slate-200 bg-white px-3.5 py-2 text-xs font-bold text-slate-700 hover:bg-slate-50 shadow-sm transition";
    }
}

/* =========================================================
   NOTIFIKASI - INTERAKSI
========================================================= */

function setupNotifikasiInteractions() {
    const tabs = document.querySelectorAll(".notif-tab");

    const btnMarkAll = document.getElementById("btn-mark-all-read");
    const btnPrev = document.getElementById("btn-notif-prev");
    const btnNext = document.getElementById("btn-notif-next");

    // Hapus tombol tandai semua sudah dibaca.
    if (btnMarkAll) {
        btnMarkAll.remove();
    }

    tabs.forEach(tab => {
        tab.addEventListener("click", () => {
            filterNotifikasiAktif = tab.dataset.filter;
            halamanNotifikasiAktif = 1;

            tabs.forEach(item => {
                const aktif =
                    item.dataset.filter === filterNotifikasiAktif;

                item.className = aktif
                    ? "notif-tab rounded-xl bg-indigo-600 px-4 py-2 text-xs font-bold text-white shadow-sm transition"
                    : "notif-tab rounded-xl border border-slate-200 bg-slate-50 px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 transition";
            });

            renderDaftarNotifikasi();
        });
    });

    if (btnPrev) {
        btnPrev.addEventListener("click", () => {
            if (halamanNotifikasiAktif > 1) {
                halamanNotifikasiAktif--;
                renderDaftarNotifikasi();
            }
        });
    }

    if (btnNext) {
        btnNext.addEventListener("click", () => {
            const dataFilter = getNotifikasiSesuaiFilter();

            const totalHalaman = Math.max(
                1,
                Math.ceil(dataFilter.length / JUMLAH_NOTIFIKASI_PER_HALAMAN)
            );

            if (halamanNotifikasiAktif < totalHalaman) {
                halamanNotifikasiAktif++;
                renderDaftarNotifikasi();
            }
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

    btnNotifikasi.addEventListener("click", async (e) => {
        e.preventDefault();
        e.stopPropagation();

        const currentPath = window.location.pathname.toLowerCase();

        const savedRole = (
            localStorage.getItem("userRole") || "peserta"
        ).toLowerCase();

        let activeRole = savedRole;

        if (currentPath.includes("/admin/")) {
            activeRole = "admin";

        } else if (currentPath.includes("/mentor/")) {
            activeRole = "mentor";

        } else if (currentPath.includes("/siswa/")) {
            activeRole = "peserta";
        }

        await renderNotifikasiView(activeRole);
    });
}

/* =========================================================
   INISIALISASI HALAMAN SISWA & MENTOR
========================================================= */

function initStudentPage(path) {
    if (path.endsWith("/dashboard.html")) {
        initDashboard();

    } else if (path.endsWith("/absensi.html")) {
        initAbsensi();

    } else if (path.endsWith("/izin.html")) {
        initIzin();

    } else if (path.endsWith("/daily-report.html")) {
        initDailyReport();

    } else if (path.endsWith("/materi.html")) {
        initMateri();

    } else if (path.endsWith("/profil.html")) {
        initProfil();
    }
}

function initMentorPage(path) {
    if (path.endsWith("/dashboard.html")) {
        initMentorDashboard();

    } else if (path.endsWith("/profil.html")) {
        initMentorProfil();

    } else if (path.endsWith("/izin.html")) {
        initMentorIzin();
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
        const savedRole = (
            localStorage.getItem("userRole") || ""
        ).toLowerCase();

        const userRole = path.includes("/pages/admin/")
            ? "admin"
            : path.includes("/pages/mentor/")
                ? "mentor"
                : savedRole || "peserta";

        if (!roleConfig[userRole]) {
            throw new Error(`Role "${userRole}" tidak valid.`);
        }

        if (app) {
            app.classList.add("invisible", "opacity-0");
        }

        await Promise.all([
            loadComponent(
                "sidebar-container",
                "/component/layout/sidebar.html"
            ),

            loadComponent(
                "header-container",
                "/component/layout/header.html"
            ).catch(error => {
                console.error("Gagal memuat header:", error);
            }),

            loadComponent(
                "footer-container",
                "/component/layout/footer.html"
            ).catch(error => {
                console.error("Gagal memuat footer:", error);
            })
        ]);

        setupDynamicLayout(userRole);

        if (userRole === "mentor") {
            await loadHeaderMentorProfile();
                
        } else if (userRole === "peserta") {
            await loadHeaderStudentProfile();
        }

        roleNotifikasiAktif = userRole;

        await populateNotifikasiUntukHeader();

        mulaiCekNotifikasiOtomatis();

        if (path.includes("/pages/siswa/")) {
            initStudentPage(path);

        } else if (path.includes("/pages/mentor/")) {
            initMentorPage(path);
        }

    } catch (error) {
        console.error("Gagal menginisialisasi komponen:", error);

    } finally {
        if (app) {
            app.classList.remove("invisible", "opacity-0");
        }
    }
}

initComponents();
