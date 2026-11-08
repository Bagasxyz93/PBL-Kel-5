document.addEventListener("DOMContentLoaded", () => {

    // Mengambil jumlah siswa dari API
    async function loadTotalSiswa() {
        try {
            const response = await fetch("http://localhost:8000/api_siswa.php");
            const result = await response.json();

            if (result.success) {
                const totalSiswa = document.getElementById("totalSiswa");

                if (totalSiswa) {
                    totalSiswa.textContent = result.data.length;
                }
            }
        } catch (error) {
            console.error("Gagal mengambil data siswa:", error);
        }
    }

    // Mengambil jumlah mentor dari API
    async function loadTotalMentor() {
        try {
            const response = await fetch("http://localhost:8000/api_mentor.php");
            const result = await response.json();

            if (result.success) {
                const totalMentor = document.getElementById("totalMentor");

                if (totalMentor) {
                    totalMentor.textContent = result.data.length;
                }
            }
        } catch (error) {
            console.error("Gagal mengambil data mentor:", error);
        }
    }

    // Mengambil jumlah program dari API
    async function loadTotalProgram() {
        try {
            const response = await fetch("http://localhost:8000/api_program.php");
            const result = await response.json();

            if (result.success) {
                const totalProgram = document.getElementById("totalProgram");

                if (totalProgram) {
                    totalProgram.textContent = result.data.length;
                }
            }
        } catch (error) {
            console.error("Gagal mengambil data program:", error);
        }
    }

    // Jalankan pengambilan data
    loadTotalSiswa();
    loadTotalMentor();
    loadTotalProgram();

    // Tombol keluar
    const logoutBtn = document.getElementById("logoutBtn");

    if (!logoutBtn) return;

    logoutBtn.addEventListener("click", async () => {
        const konfirmasi = confirm("Apakah Anda yakin ingin keluar?");

        if (!konfirmasi) return;

        try {
            localStorage.removeItem("userRole");
            localStorage.removeItem("userName");
            localStorage.removeItem("userId");

            await supabase.auth.signOut().catch(() => {});

            window.location.replace("/");
        } catch (error) {
            console.error("Gagal logout:", error);
            alert("Gagal keluar. Silakan coba lagi.");
        }
    });
});