export function initMentorDashboard() {
    console.log("Dashboard Mentor berhasil dimuat.");

    // Mengambil nama mentor dari localStorage
    const mentorName = localStorage.getItem("userName");
    const welcomeTitle = document.getElementById("mentor-welcome-title");

    if (mentorName && welcomeTitle) {
        welcomeTitle.textContent = `Halo, ${mentorName}!`;
    }

    // Mengambil jumlah Daily Report siswa
    async function loadTotalReport() {
        try {
            const response = await fetch("http://localhost:8000/api_report.php");
            const result = await response.json();

            if (result.success) {
                const totalReport = document.getElementById("totalReportMentor");

                if (totalReport) {
                    totalReport.textContent = result.data.length;
                }
            
                const perluReview = document.getElementById("perluReview");
            
                if (perluReview) {
                    perluReview.textContent = result.total_perlu_review;
                }
            }
        } catch (error) {
            console.error("Gagal mengambil data Daily Report:", error);
        }
    }

    // Mengambil jumlah kehadiran dan total siswa bimbingan
    async function loadTotalSiswaBimbingan() {
        try {
            const response = await fetch(
                "http://localhost:8000/api_total_siswa_bimbingan.php",
                {
                    credentials: "include"
                }
            );
        
            const result = await response.json();
        
            if (result.success) {
                const totalSiswa = document.getElementById("totalSiswaBimbingan");
            
                if (totalSiswa) {
                    totalSiswa.textContent =
                        `${result.total_hadir}/${result.total_siswa}`;
                }
            }
        
        } catch (error) {
            console.error("Gagal mengambil data siswa bimbingan:", error);
        }
    }

    // Jalankan pengambilan data
    loadTotalReport();
    loadTotalSiswaBimbingan();
}