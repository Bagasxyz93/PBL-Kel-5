export function initMentorDashboard() {
    console.log("Dashboard Mentor berhasil dimuat.");

    // Menampilkan tanggal saat ini
    const elemenTanggal = document.getElementById("tanggal-sekarang");
    
    if (elemenTanggal) {
        const sekarang = new Date();
    
        elemenTanggal.textContent = sekarang.toLocaleDateString("id-ID", {
            weekday: "long",
            day: "numeric",
            month: "long",
            year: "numeric"
        });
    }

    //* Mengambil nama dan jenis kelamin mentor dari database*
    async function loadProfilMentor() {
        try {
            const response = await fetch(
                "http://localhost:8000/api/mentor/api_profil_mentor.php",
                {
                    credentials: "include"
                }
            );

            const result = await response.json();

            if (!response.ok || !result.success) {
                throw new Error(result.message || "Gagal mengambil profil mentor.");
            }

            const mentor = result.data;

            // Mengambil elemen header
            const headerUserName = document.getElementById("header-user-name");
            const headerUserRoleBadge = document.getElementById("header-user-role-badge");
            const headerUserAvatar = document.getElementById("header-user-avatar");

            // Mengambil nama mentor
            if (headerUserName) {
                headerUserName.textContent = mentor.nama;
            }

            // Mengambil program yang diampu
            if (headerUserRoleBadge) {
                const daftarProgram = mentor.program || [];

                const namaProgram = daftarProgram.length > 0
                    ? daftarProgram.map(program => program.nama_program).join(", ")
                    : "Belum ada program";

                headerUserRoleBadge.textContent = "Mentor " + namaProgram;
            }

            // Membuat inisial avatar dari nama mentor
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

            // Mengisi sapaan dashboard
            const welcomeTitle = document.getElementById("mentor-welcome-title");

            if (welcomeTitle) {
                const sapaan = mentor.jenis_kelamin === "Laki-laki"
                    ? "Pak"
                    : "Ibu";

                welcomeTitle.textContent = `Halo, ${sapaan} ${mentor.nama}!`;
            }

        } catch (error) {
            console.error("Gagal mengambil profil mentor:", error);
        }
    }

    // Mengambil jumlah Daily Report siswa
    async function loadTotalReport() {
        try {
            const response = await fetch("http://localhost:8000/api/mentor/api_report.php");
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
                "http://localhost:8000/api/mentor/api_total_siswa_bimbingan.php",
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
    loadProfilMentor();
    loadTotalReport();
    loadTotalSiswaBimbingan();
}