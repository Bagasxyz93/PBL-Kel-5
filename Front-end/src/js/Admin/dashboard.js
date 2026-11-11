
document.addEventListener("DOMContentLoaded", () => {

    // Menampilkan tanggal dan jam saat ini
    function updateTanggalJam() {
        const sekarang = new Date();

        const tanggal = document.getElementById("tanggal-sekarang");
        const jam = document.getElementById("jam-sekarang");

        if (tanggal) {
            tanggal.textContent = sekarang.toLocaleDateString("id-ID", {
                weekday: "long",
                day: "numeric",
                month: "long",
                year: "numeric"
            });
        }

        if (jam) {
            jam.textContent = sekarang.toLocaleTimeString("id-ID", {
                hour: "2-digit",
                minute: "2-digit",
                second: "2-digit",
                hour12: false,
                timeZone: "Asia/Jakarta"
            }) + " WIB";
        }
    }

    updateTanggalJam();
    setInterval(updateTanggalJam, 1000);

    // Mengambil ringkasan data dashboard dari database
    async function loadDataDashboard() {
        try {
            const response = await fetch("http://localhost:8000/api_dashboard.php");
            const result = await response.json();

            if (result.success) {
                document.getElementById("totalSiswa").textContent =
                    result.data.total_siswa;

                document.getElementById("totalMentor").textContent =
                    result.data.total_mentor;

                document.getElementById("totalProgram").textContent =
                    result.data.total_program;
            }
        } catch (error) {
            console.error("Gagal mengambil data dashboard:", error);
        }
    }


    // Mengambil daftar program dari database
    async function loadProgramDashboard() {
        const daftarProgram = document.getElementById("daftarProgramDashboard");
        const jumlahProgram = document.getElementById("jumlahProgramDashboard");

        if (!daftarProgram || !jumlahProgram) return;

        try {
            const response = await fetch("http://localhost:8000/api_program.php");
            const result = await response.json();

            if (!result.success) {
                throw new Error("Gagal mengambil data program.");
            }

            const dataProgram = result.data;

            jumlahProgram.textContent = `${dataProgram.length} Program`;

            if (dataProgram.length === 0) {
                daftarProgram.innerHTML = `
                    <p class="text-xs text-slate-400 text-center py-4">
                        Belum ada program tersedia.
                    </p>
                `;
                return;
            }

            const warna = [
                { bg: "bg-blue-50", text: "text-blue-600" },
                { bg: "bg-indigo-50", text: "text-indigo-600" },
                { bg: "bg-purple-50", text: "text-purple-600" }
            ];

            daftarProgram.innerHTML = dataProgram.map((program, index) => {
                const warnaProgram = warna[index % warna.length];

                return `
                    <div class="p-3.5 rounded-xl bg-slate-50 border border-slate-100 flex items-center gap-3">
                        <div class="w-9 h-9 rounded-xl ${warnaProgram.bg} ${warnaProgram.text} flex items-center justify-center shrink-0">
                            <svg class="w-5 h-5" fill="none" stroke="currentColor"
                                stroke-width="2" viewBox="0 0 24 24">
                                <rect x="3" y="4" width="18" height="18" rx="2"/>
                                <path d="M16 2v4M8 2v4M3 10h18"/>
                            </svg>
                        </div>

                        <div class="min-w-0">
                            <h4 class="text-xs font-bold text-slate-800">
                                ${escapeHTML(program.nama_program)}
                            </h4>
                            <p class="text-[11px] text-slate-500 mt-0.5">
                                ${escapeHTML(program.deskripsi || "Belum ada deskripsi.")}
                            </p>
                        </div>
                    </div>
                `;
            }).join("");

        } catch (error) {
            console.error("Gagal mengambil program dashboard:", error);

            daftarProgram.innerHTML = `
                <p class="text-xs text-red-500 text-center py-4">
                    Gagal memuat program.
                </p>
            `;
        }
    }


    // Mengambil aktivitas program selama 7 hari terakhir
    async function loadAktivitasDashboard() {
        const grafik = document.getElementById("grafikAktivitasDashboard");
        const totalAktivitas = document.getElementById("totalAktivitasDashboard");

        if (!grafik || !totalAktivitas) return;

        try {
            const response = await fetch("http://localhost:8000/api_aktivitas_dashboard.php");
            const result = await response.json();

            if (!result.success) {
                throw new Error("Gagal mengambil data aktivitas.");
            }

            const dataAktivitas = result.data;

            // Menghitung total seluruh aktivitas
            const total = dataAktivitas.reduce((jumlah, item) => {
                return jumlah + Number(item.total);
            }, 0);

            totalAktivitas.textContent =
                `Total ${total} aktivitas selama 7 hari terakhir.`;

            // Mencari nilai aktivitas tertinggi
            const nilaiMaksimal = Math.max(
                ...dataAktivitas.map(item => Number(item.total)),
                1
            );

            if (dataAktivitas.length === 0) {
                grafik.innerHTML = `
                    <p class="w-full text-center text-xs text-slate-400">
                        Belum ada data aktivitas.
                    </p>
                `;
                return;
            }

            // Menampilkan grafik batang
            grafik.innerHTML = dataAktivitas.map(item => {
                const jumlah = Number(item.total);

                const tinggi = jumlah === 0
                    ? 0
                    : Math.max((jumlah / nilaiMaksimal) * 100, 5);

                return `
                    <div class="flex-1 flex flex-col items-center gap-2 h-full justify-end min-w-0">

                        <span class="text-[10px] font-bold text-slate-600">
                            ${jumlah}
                        </span>

                        <div
                            class="w-full bg-blue-600 rounded-t-lg transition-all duration-500"
                            style="height: ${tinggi}%;"
                            title="${jumlah} aktivitas"
                        ></div>

                        <span class="text-[10px] text-slate-400 mt-1">
                            ${escapeHTML(item.tanggal)}
                        </span>

                    </div>
                `;
            }).join("");

        } catch (error) {
            console.error("Gagal mengambil aktivitas dashboard:", error);

            grafik.innerHTML = `
                <p class="w-full text-center text-xs text-red-500">
                    Gagal memuat data aktivitas.
                </p>
            `;

            totalAktivitas.textContent = "Data aktivitas tidak tersedia.";
        }
    }


    // Mengamankan teks sebelum ditampilkan ke HTML
    function escapeHTML(teks) {
        return String(teks).replace(/[&<>"']/g, karakter => ({
            "&": "&amp;",
            "<": "&lt;",
            ">": "&gt;",
            '"': "&quot;",
            "'": "&#39;"
        })[karakter]);
    }


    // Memanggil seluruh fungsi dashboard
    loadDataDashboard();
    loadProgramDashboard();
    loadAktivitasDashboard();


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
