export function initSidebar() {
    const currentPath = window.location.pathname.toLowerCase();
    const sidebarLinks = document.querySelectorAll(".sidebar-link");

    // Class untuk item non-aktif
    const inactiveClasses = ["text-slate-400", "hover:bg-white/5", "hover:text-white"];
    
    // Class untuk item aktif (background gradient)
    const activeClasses = [
        "bg-gradient-to-r",
        "from-[#5865ff]",
        "to-[#8050ff]",
        "text-white",
        "font-semibold",
        "shadow-lg",
        "shadow-indigo-500/20"
    ];

    sidebarLinks.forEach((link) => {
        const href = link.getAttribute("href").toLowerCase();

        // Cek apakah URL saat ini cocok dengan href menu
        if (currentPath.includes(href) || (currentPath.endsWith("/") && href.includes("dashboard.html"))) {
            // Reset dulu class non-aktif
            link.classList.remove(...inactiveClasses);
            // Tambahkan class aktif
            link.classList.add(...activeClasses);
        } else {
            // Hapus class aktif
            link.classList.remove(...activeClasses);
            // Tambahkan class non-aktif
            link.classList.add(...inactiveClasses);
        }
    });
}