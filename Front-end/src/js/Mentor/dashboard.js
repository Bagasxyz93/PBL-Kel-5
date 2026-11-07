/* =========================================================
LOGIKA HALAMAN DASHBOARD MENTOR
========================================================= */

export function initMentorDashboard() {
    console.log("Dashboard Mentor berhasil dimuat.");

    // Mengambil nama mentor dari localStorage jika ada, lalu menampilkannya
    const mentorName = localStorage.getItem("userName");
    const welcomeTitle = document.getElementById("mentor-welcome-title");

    if (mentorName && welcomeTitle) {
        welcomeTitle.textContent = `Halo, ${mentorName}!`;
    }
}