export function initSidebar() {
    const currentPath = window.location.pathname.toLowerCase();

    const menuMap = [
        { keyword: "dashboard", key: "dashboard" },
        { keyword: "absensi", key: "absensi" },
        { keyword: "izin", key: "izin" },
        { keyword: "daily-report", key: "daily-report" },
        { keyword: "materi", key: "materi" },
        { keyword: "profil", key: "profil" }
    ];

    let activeKey = "dashboard";

    for (const menu of menuMap) {
        if (currentPath.includes(menu.keyword)) {
            activeKey = menu.key;
            break;
        }
    }

    document.querySelectorAll(".sidebar-link").forEach((link) => {
        const isActive = link.dataset.menu === activeKey;

        link.classList.toggle("bg-violet-600", isActive);
        link.classList.toggle("text-white", isActive);

        link.classList.toggle("text-slate-300", !isActive);
        link.classList.toggle("hover:bg-slate-700", !isActive);
    });
}