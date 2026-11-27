
import { API_BASE_URL } from "../api-config.js";

document.addEventListener("DOMContentLoaded", () => {

    // =====================================================
    // TOKEN AUTHENTICATION
    // =====================================================

    function getAuthHeaders() {
        const token = sessionStorage.getItem("authToken");

        if (!token) {
            throw new Error("Token login tidak ditemukan. Silakan login kembali.");
        }

        return {
            Authorization: `Bearer ${token}`
        };
    }

    // =====================================================
    // MENAMPILKAN TANGGAL DAN JAM
    // =====================================================

    function updateTanggalJam() {
        const sekarang = new Date();

        const tanggal = document.getElementById("tanggal-sekarang");
        const jam = document.getElementById("jam-sekarang");

        if (tanggal) {
            tanggal.textContent = sekarang.toLocaleDateString("id-ID", {
                weekday: "long",
                day: "numeric",
                month: "long",
                year: "numeric",
                timeZone: "Asia/Jakarta"
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


    // =====================================================
    // ANIMASI COUNT-UP KARTU STATISTIK
    // =====================================================

    function animasiAngka(element, target) {
        if (!element) return;

        target = Number(target) || 0;

        const angkaAwal = Number(element.dataset.count) || 0;
        const durasi = 800;
        const waktuMulai = performance.now();

        function updateAngka(waktuSekarang) {
            const progress = Math.min(
                (waktuSekarang - waktuMulai) / durasi,
                1
            );

            // Ease-out cubic
            const easing = 1 - Math.pow(1 - progress, 3);

            const angkaSaatIni = Math.round(
                angkaAwal + (target - angkaAwal) * easing
            );

            element.textContent = angkaSaatIni.toLocaleString("id-ID");

            if (progress < 1) {
                requestAnimationFrame(updateAngka);
            } else {
                element.textContent = target.toLocaleString("id-ID");
                element.dataset.count = target;
            }
        }

        requestAnimationFrame(updateAngka);
    }


    
    // =====================================================
    // MENGAMBIL RINGKASAN DATA DASHBOARD
    // =====================================================

    async function loadDataDashboard() {
        try {
            const response = await fetch(
                `${API_BASE_URL}/api/admin/api_dashboard.php`,
                {
                    method: "GET",
                    headers: getAuthHeaders()
                }
            );

            const result = await response.json();

            if (!response.ok || !result.success) {
                throw new Error(result.message || "Gagal mengambil data dashboard.");
            }

            // ANIMASI TOTAL SISWA
            animasiAngka(
                document.getElementById("totalSiswa"),
                result.data.total_siswa
            );

            // ANIMASI TOTAL MENTOR
            animasiAngka(
                document.getElementById("totalMentor"),
                result.data.total_mentor
            );

            // ANIMASI TOTAL PROGRAM
            animasiAngka(
                document.getElementById("totalProgram"),
                result.data.total_program
            );

        } catch (error) {
            console.error("Gagal mengambil data dashboard:", error);
        }
    }

    // =====================================================
    // MENGAMBIL DAFTAR PROGRAM
    // =====================================================

    async function loadProgramDashboard() {
        const daftarProgram = document.getElementById("daftarProgramDashboard");
        const jumlahProgram = document.getElementById("jumlahProgramDashboard");

        if (!daftarProgram || !jumlahProgram) return;

        try {
            const response = await fetch(
                `${API_BASE_URL}/api/admin/api_program.php`,
                {
                    method: "GET",
                    headers: getAuthHeaders()
                }
            );

            const result = await response.json();

            if (!response.ok || !result.success) {
                throw new Error(result.message || "Gagal mengambil data program.");
            }

            const dataProgram = result.data;

            jumlahProgram.textContent = `${dataProgram.length} Program`;

            if (dataProgram.length === 0) {
                daftarProgram.innerHTML = `
                    <div class="flex flex-col items-center justify-center py-6 text-center">
                        <div class="w-10 h-10 rounded-xl bg-blue-50 text-blue-500 flex items-center justify-center mb-2">
                            <svg class="w-5 h-5" fill="none" stroke="currentColor"
                                stroke-width="1.8" viewBox="0 0 24 24">
                                <rect x="3" y="4" width="18" height="18" rx="2"/>
                                <path d="M16 2v4M8 2v4M3 10h18"/>
                            </svg>
                        </div>

                        <p class="text-xs font-semibold text-slate-700">
                            Belum Ada Program
                        </p>

                        <p class="text-[11px] text-slate-400 mt-1">
                            Program yang tersedia akan muncul di sini.
                        </p>
                    </div>
                `;
                return;
            }

            const warna = [
                { bg: "bg-blue-50", text: "text-blue-600", hover: "hover:bg-blue-100" },
                { bg: "bg-indigo-50", text: "text-indigo-600", hover: "hover:bg-indigo-100" },
                { bg: "bg-purple-50", text: "text-purple-600", hover: "hover:bg-purple-100" }
            ];

            daftarProgram.innerHTML = dataProgram.map((program, index) => {
                const warnaProgram = warna[index % warna.length];

                return `
                    <div class="group/program p-3.5 rounded-xl bg-slate-50 border border-slate-100 flex items-center gap-3 transition-all duration-300 ease-out hover:bg-white hover:border-blue-200 hover:shadow-md hover:-translate-y-0.5">

                        <div class="w-9 h-9 rounded-xl ${warnaProgram.bg} ${warnaProgram.text} flex items-center justify-center shrink-0 transition-all duration-300 ${warnaProgram.hover} group-hover/program:scale-105">
                            <svg class="w-5 h-5" fill="none" stroke="currentColor"
                                stroke-width="2" viewBox="0 0 24 24">
                                <rect x="3" y="4" width="18" height="18" rx="2"/>
                                <path d="M16 2v4M8 2v4M3 10h18"/>
                            </svg>
                        </div>

                        <div class="min-w-0 flex-1">
                            <h4 class="text-xs font-bold text-slate-800 transition-colors duration-200 group-hover/program:text-blue-700">
                                ${escapeHTML(program.nama_program)}
                            </h4>

                            <p class="text-[11px] text-slate-500 mt-0.5">
                                ${escapeHTML(program.deskripsi || "Belum ada deskripsi.")}
                            </p>
                        </div>

                        <svg class="w-4 h-4 text-slate-300 shrink-0 transition-all duration-300 group-hover/program:text-blue-500 group-hover/program:translate-x-0.5"
                            fill="none" stroke="currentColor" stroke-width="1.8" viewBox="0 0 24 24">
                            <path d="m9 18 6-6-6-6"/>
                        </svg>

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

    // =====================================================
    // AKTIVITAS TERAKHIR
    // =====================================================

    async function loadAktivitasTerakhir() {
        const container = document.getElementById("aktivitasTerakhirDashboard");

        if (!container) return;

        try {
            const response = await fetch(
                `${API_BASE_URL}/api/admin/api_aktivitas_dashboard.php`,
                {
                    method: "GET",
                    headers: getAuthHeaders()
                }
            );

            const result = await response.json();

            if (!response.ok || !result.success) {
                throw new Error(result.message || "Gagal mengambil aktivitas.");
            }

            const data = result.data;

            // EMPTY STATE
            if (!data || data.length === 0) {
                container.innerHTML = `
                    <div class="flex flex-col items-center justify-center py-7 text-center">

                        <div class="w-11 h-11 rounded-xl bg-blue-50 flex items-center justify-center mb-3 transition-transform duration-300 hover:scale-105">
                            <svg class="w-5 h-5 text-blue-600"
                                fill="none"
                                stroke="currentColor"
                                stroke-width="1.8"
                                viewBox="0 0 24 24">
                                <path d="M12 8v4l3 2"/>
                                <circle cx="12" cy="12" r="9"/>
                            </svg>
                        </div>

                        <h4 class="text-xs font-bold text-slate-800">
                            Belum Ada Aktivitas
                        </h4>

                        <p class="text-[11px] text-slate-400 mt-1.5 max-w-xs leading-relaxed">
                            Aktivitas terbaru akan muncul di sini setelah terdapat data baru.
                        </p>

                        <div class="mt-3 inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-blue-50 text-blue-600 text-[10px] font-semibold">
                            <span class="w-1.5 h-1.5 rounded-full bg-blue-500"></span>
                            Sistem siap digunakan
                        </div>

                    </div>
                `;
                return;
            }

            // KONFIGURASI AKTIVITAS
            const konfigurasi = {
                peserta: {
                    warna: "bg-indigo-50 text-indigo-600",
                    judul: "Peserta baru terdaftar",
                    ikon: `
                        <svg class="w-5 h-5" fill="none" stroke="currentColor"
                            stroke-width="1.8" viewBox="0 0 24 24">
                            <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/>
                            <circle cx="9" cy="7" r="4"/>
                            <path d="M19 8v6M16 11h6"/>
                        </svg>
                    `
                },

                mentor: {
                    warna: "bg-purple-50 text-purple-600",
                    judul: "Mentor baru ditambahkan",
                    ikon: `
                        <svg class="w-5 h-5" fill="none" stroke="currentColor"
                            stroke-width="1.8" viewBox="0 0 24 24">
                            <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/>
                            <circle cx="12" cy="7" r="4"/>
                        </svg>
                    `
                },

                program: {
                    warna: "bg-blue-50 text-blue-600",
                    judul: "Program baru dibuat",
                    ikon: `
                        <svg class="w-5 h-5" fill="none" stroke="currentColor"
                            stroke-width="1.8" viewBox="0 0 24 24">
                            <rect x="3" y="4" width="18" height="18" rx="2"/>
                            <path d="M16 2v4M8 2v4M3 10h18"/>
                        </svg>
                    `
                },

                materi: {
                    warna: "bg-emerald-50 text-emerald-600",
                    judul: "Materi baru diunggah",
                    ikon: `
                        <svg class="w-5 h-5" fill="none" stroke="currentColor"
                            stroke-width="1.8" viewBox="0 0 24 24">
                            <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
                            <path d="M14 2v6h6M8 13h8M8 17h8"/>
                        </svg>
                    `
                }
            };

            // RENDER AKTIVITAS
            container.innerHTML = data.map(aktivitas => {
                const tipe = konfigurasi[aktivitas.tipe];

                if (!tipe) return "";

                return `
                    <div class="group/aktivitas flex items-start gap-3 p-3 rounded-xl border border-slate-100 transition-all duration-300 ease-out hover:bg-blue-50/60 hover:border-blue-100 hover:translate-x-1 hover:shadow-sm">

                        <div class="w-10 h-10 rounded-xl ${tipe.warna}
                            flex items-center justify-center shrink-0 transition-transform duration-300 group-hover/aktivitas:scale-105">
                            ${tipe.ikon}
                        </div>

                        <div class="flex-1 min-w-0">

                            <h4 class="text-xs font-bold text-slate-800 transition-colors duration-200 group-hover/aktivitas:text-blue-700">
                                ${tipe.judul}
                            </h4>

                            <p class="text-sm font-medium text-slate-700 mt-1 break-words">
                                ${escapeHTML(aktivitas.nama)}
                            </p>

                            <p class="text-[11px] text-slate-400 mt-1">
                                ${escapeHTML(aktivitas.waktu)}
                            </p>

                        </div>

                        <svg class="w-4 h-4 text-slate-300 shrink-0 mt-1 transition-all duration-300 group-hover/aktivitas:text-blue-500 group-hover/aktivitas:translate-x-0.5"
                            fill="none" stroke="currentColor" stroke-width="1.8" viewBox="0 0 24 24">
                            <path d="m9 18 6-6-6-6"/>
                        </svg>

                    </div>
                `;
            }).join("");

        } catch (error) {
            console.error("Gagal mengambil aktivitas terakhir:", error);

            container.innerHTML = `
                <p class="text-xs text-red-500 text-center py-8">
                    Gagal memuat aktivitas terakhir.
                </p>
            `;
        }
    }

    // =====================================================
    // ESCAPE HTML
    // =====================================================

    function escapeHTML(teks) {
        return String(teks ?? "").replace(/[&<>"']/g, karakter => ({
            "&": "&amp;",
            "<": "&lt;",
            ">": "&gt;",
            '"': "&quot;",
            "'": "&#39;"
        })[karakter]);
    }

    // =====================================================
    // JALANKAN DASHBOARD
    // =====================================================

    loadDataDashboard();
    loadProgramDashboard();
    loadAktivitasTerakhir();

    // =====================================================
    // LOGOUT
    // =====================================================

    const logoutBtn = document.getElementById("logoutBtn");

    if (logoutBtn) {
        logoutBtn.addEventListener("click", async () => {
            const konfirmasi = confirm("Apakah Anda yakin ingin keluar?");

            if (!konfirmasi) return;

            sessionStorage.removeItem("authToken");

            localStorage.removeItem("userRole");
            localStorage.removeItem("userName");
            localStorage.removeItem("userId");

            await supabase.auth.signOut().catch(() => {});

            window.location.replace("/");
        });
    }

});
