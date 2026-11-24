
const API_MENTOR = "http://localhost:8000/api/mentor";

// Mengambil token khusus tab yang sedang digunakan
function getAuthHeaders() {
    return {
        "Authorization": `Bearer ${sessionStorage.getItem("authToken")}`
    };
}

export function initMentorDashboard() {
    console.log("Dashboard Mentor berhasil dimuat.");

    tampilkanTanggal();
    loadProfilMentor();
    loadDataSiswa();
    loadDataDailyReport();
}

// ======================================================
// MENAMPILKAN TANGGAL SEKARANG
// ======================================================

function tampilkanTanggal() {
    const elemenTanggal = document.getElementById("tanggal-sekarang");

    if (!elemenTanggal) return;

    elemenTanggal.textContent = new Date().toLocaleDateString("id-ID", {
        weekday: "long",
        day: "numeric",
        month: "long",
        year: "numeric",
        timeZone: "Asia/Jakarta"
    });
}

// ======================================================
// MENGAMBIL PROFIL MENTOR
// ======================================================

async function loadProfilMentor() {
    try {
        const response = await fetch(
            `${API_MENTOR}/api_profil_mentor.php`,
            {
                method: "GET",
                headers: getAuthHeaders()
            }
        );

        const result = await response.json();

        if (!response.ok || !result.success) {
            throw new Error(
                result.message || "Gagal mengambil profil mentor."
            );
        }

        const mentor = result.data;

        setText("header-user-name", mentor.nama || "Mentor");

        const daftarProgram = Array.isArray(mentor.program)
            ? mentor.program
            : [];

        const namaProgram = daftarProgram
            .map(item => item.nama_program)
            .filter(Boolean)
            .join(", ");

        setText(
            "header-user-role-badge",
            namaProgram ? `Mentor ${namaProgram}` : "Mentor"
        );

        setText(
            "programMentorDashboard",
            namaProgram || "Belum ada program"
        );

        setText(
            "header-user-avatar",
            buatInisial(mentor.nama)
        );

        const sapaan = mentor.jenis_kelamin === "Laki-laki"
            ? "Pak"
            : "Ibu";

        setText(
            "mentor-welcome-title",
            `Halo, ${sapaan} ${mentor.nama || "Mentor"}!`
        );

    } catch (error) {
        console.error("Gagal mengambil profil mentor:", error);
    }
}

// ======================================================
// MEMBUAT INISIAL NAMA
// ======================================================

function buatInisial(nama) {
    if (!nama) return "GM";

    return nama
        .trim()
        .split(/\s+/)
        .slice(0, 2)
        .map(kata => kata[0])
        .join("")
        .toUpperCase();
}

// ======================================================
// MENGAMBIL TOTAL SISWA DAN KEHADIRAN HARI INI
// ======================================================

async function loadDataSiswa() {
    try {
        const response = await fetch(
            `${API_MENTOR}/api_total_siswa_bimbingan.php`,
            {
                method: "GET",
                headers: getAuthHeaders()
            }
        );

        const result = await response.json();

        if (!response.ok || !result.success) {
            throw new Error(
                result.message || "Gagal mengambil data siswa."
            );
        }

        console.log("Data statistik kehadiran mentor:", result);

        const totalSiswa = Number(result.total_siswa) || 0;
        const totalHadir = Number(result.total_hadir) || 0;
        const totalIzin = Number(result.total_izin) || 0;
        const totalSakit = Number(result.total_sakit) || 0;

        const totalDihitung = Number(
            result.total_dihitung ?? totalSiswa
        );

        const persentase = Number(
            result.persentase_kehadiran ??
            (
                totalDihitung > 0
                    ? Math.round((totalHadir / totalDihitung) * 100)
                    : 0
            )
        );

        setText("totalSiswaBimbingan", totalSiswa);

        setText("jumlahHadirHariIni", totalHadir);
        setText("totalKehadiranHariIni", totalDihitung);
        setText("persentaseKehadiran", `${persentase}%`);

        setText("grafikPersentase", `${persentase}%`);
        updateDiagramKehadiran(persentase);

        setText("jumlahHadir", totalHadir);
        setText("jumlahIzin", totalIzin);
        setText("jumlahSakit", totalSakit);

        const tanggal = new Date().toLocaleDateString("id-ID", {
            day: "numeric",
            month: "short",
            year: "numeric",
            timeZone: "Asia/Jakarta"
        });

        setText(
            "tanggalStatistik",
            `Statistik akumulasi absensi hari ini (${tanggal})`
        );

    } catch (error) {
        console.error(
            "Gagal mengambil data siswa bimbingan:",
            error
        );
    }
}

// ======================================================
// MEMPERBARUI DIAGRAM KEHADIRAN
// ======================================================

function updateDiagramKehadiran(persentase) {
    const diagram = document.getElementById("diagramKehadiran");

    if (!diagram) return;

    const nilai = Math.max(0, Math.min(100, Number(persentase) || 0));

    diagram.style.background = `
        conic-gradient(
            #2864ed 0% ${nilai}%,
            #e2ecff ${nilai}% 100%
        )
    `;
}

// ======================================================
// MENGAMBIL DATA DAILY REPORT
// ======================================================

async function loadDataDailyReport() {
    try {
        const response = await fetch(
            `${API_MENTOR}/api_daily_report.php`,
            {
                method: "GET",
                headers: getAuthHeaders()
            }
        );

        const result = await response.json();

        if (!response.ok || !result.success) {
            throw new Error(
                result.message || "Gagal mengambil data Daily Report."
            );
        }

        console.log("Data Daily Report mentor:", result);

        const daftarLaporan = Array.isArray(result.data)
            ? result.data
            : [];

        setText("totalReportMentor", daftarLaporan.length);

        const totalMenunggu = daftarLaporan.filter(
            item => item.status === "menunggu"
        ).length;

        setText("perluReview", `${totalMenunggu} Perlu Review`);
        setText("badgeLaporanBaru", `${totalMenunggu} Baru`);

        console.log(
            "Statistik Daily Report:",
            result.statistik || {}
        );

        const laporanTerbaru = [...daftarLaporan].sort((a, b) => {
            return new Date(b.created_at) - new Date(a.created_at);
        }).slice(0, 5);

        tampilkanLaporanTerbaru(laporanTerbaru);

    } catch (error) {
        console.error(
            "Gagal mengambil data Daily Report:",
            error
        );

        setText("totalReportMentor", 0);
        setText("perluReview", "0 Perlu Review");
        setText("badgeLaporanBaru", "0 Baru");

        tampilkanLaporanTerbaru([]);
    }
}

// ======================================================
// MENAMPILKAN LIMA DAILY REPORT TERBARU
// ======================================================

function tampilkanLaporanTerbaru(daftarLaporan) {
    const container = document.getElementById(
        "daily-report-list"
    );

    if (!container) return;

    if (
        !Array.isArray(daftarLaporan) ||
        daftarLaporan.length === 0
    ) {
        container.innerHTML = `
            <div class="p-6 text-center text-sm text-slate-400">
                Belum ada Daily Report dari siswa.
            </div>
        `;

        return;
    }

    container.innerHTML = daftarLaporan.map(item => {
        const nama = item.nama || "Nama tidak tersedia";
        const inisial = buatInisial(nama);

        const judul = item.judul ||
            item.nama_materi ||
            "Daily Report";

        const isi = item.isi_laporan ||
            "Tidak ada isi laporan.";

        const status = item.status || "menunggu";

        const tanggal = item.tanggal
            ? new Date(`${item.tanggal}T00:00:00+07:00`)
                .toLocaleDateString("id-ID", {
                    day: "numeric",
                    month: "short",
                    year: "numeric",
                    timeZone: "Asia/Jakarta"
                })
            : "-";

        let badgeClass = "bg-amber-50 text-amber-600";
        let namaStatus = "Menunggu";

        if (status === "diterima") {
            badgeClass = "bg-emerald-50 text-emerald-600";
            namaStatus = "Diterima";
        } else if (status === "ditolak") {
            badgeClass = "bg-red-50 text-red-600";
            namaStatus = "Ditolak";
        }

        return `
            <div class="p-3.5 rounded-xl border border-slate-100 bg-[#fafbfd] hover:border-blue-200 transition">

                <div class="flex items-center justify-between mb-1.5">

                    <div class="flex items-center gap-2.5">

                        <div class="h-7 w-7 rounded-full bg-[#2864ed] text-white flex items-center justify-center font-bold text-[11px]">
                            ${escapeHTML(inisial)}
                        </div>

                        <div>
                            <h4 class="text-xs font-bold text-[#29364b]">
                                ${escapeHTML(nama)}
                            </h4>

                            <p class="text-[10px] text-[#7e8fa9]">
                                ${escapeHTML(judul)}
                            </p>
                        </div>

                    </div>

                    <span class="px-2.5 py-0.5 rounded-full ${badgeClass} font-bold text-[10px]">
                        ${namaStatus}
                    </span>

                </div>

                <p class="text-[11px] text-[#46546b] italic bg-white p-2.5 rounded-lg border border-slate-100 mb-2">
                    "${escapeHTML(isi)}"
                </p>

                <div class="flex items-center justify-between text-[10px] text-[#7e8fa9]">

                    <span>🕒 ${tanggal}</span>

                    <a href="/pages/Mentor/Daily-report.html?id=${encodeURIComponent(item.id)}"
                       class="font-bold text-[#2864ed] hover:underline">
                        Periksa Laporan ›
                    </a>

                </div>

            </div>
        `;
    }).join("");
}

// ======================================================
// FUNGSI MENGUBAH ISI ELEMEN HTML
// ======================================================

function setText(id, nilai) {
    const elemen = document.getElementById(id);

    if (elemen) {
        elemen.textContent = nilai;
    }
}

// ======================================================
// MENGAMANKAN TEKS SEBELUM DIMASUKKAN KE HTML
// ======================================================

function escapeHTML(teks) {
    return String(teks).replace(/[&<>"']/g, karakter => {
        const karakterPengganti = {
            "&": "&amp;",
            "<": "&lt;",
            ">": "&gt;",
            '"': "&quot;",
            "'": "&#039;"
        };

        return karakterPengganti[karakter];
    });
}
