// /* =========================================================
// LOGIKA HALAMAN KELOLA DAILY REPORT MENTOR & POP-UP RIWAYAT
// ========================================================= */

// // Database dummy daftar siswa & riwayat laporan harian
// const databaseSiswaReport = {
//     "1234567801": {
//         nama: "Ahmad Fauzi",
//         nis: "1234567801",
//         program: "Web Development",
//         inisial: "AF",
//         keaktifan: "96% Sangat Rajin",
//         totalLaporan: 15,
//         diterima: 10,
//         menunggu: 4,
//         revisi: 1,
//         riwayat: [
//             {
//                 no: 1,
//                 tanggal: "17 Okt 2026",
//                 waktu: "17:15 WIB",
//                 judul: "Mengerjakan rancangan prototype dan alur checkout",
//                 deskripsi: "Modul katalog sudah selesai, kendala integrasi gateway pembayaran sandbox.",
//                 lampiranTipe: "📎 1 File",
//                 status: "Menunggu",
//                 statusBadgeClass: "bg-amber-50 text-amber-600 border border-amber-200",
//                 aksiLabel: "Detail",
//                 aksiClass: "bg-slate-100 hover:bg-slate-200 text-slate-600"
//             },
//             {
//                 no: 2,
//                 tanggal: "16 Okt 2026",
//                 waktu: "16:40 WIB",
//                 judul: "Riset 15 Pelanggan Potensial (Customer Validation)",
//                 deskripsi: "Telah melakukan wawancara langsung ke 10 mahasiswa terkait kebutuhan aplikasi.",
//                 lampiranTipe: "📊 Sheet",
//                 status: "Diterima",
//                 statusBadgeClass: "bg-emerald-50 text-emerald-600 border border-emerald-200",
//                 aksiLabel: "Detail",
//                 aksiClass: "bg-slate-100 hover:bg-slate-200 text-slate-600"
//             },
//             {
//                 no: 3,
//                 tanggal: "15 Okt 2026",
//                 waktu: "15:10 WIB",
//                 judul: "Konfigurasi Database Postgres & API Authentication",
//                 deskripsi: "Terdapat error koneksi SSL pool pada Supabase saat migrasi tabel.",
//                 lampiranTipe: "📦 Repo",
//                 status: "Ditolak",
//                 statusBadgeClass: "bg-rose-50 text-rose-600 border border-rose-200",
//                 aksiLabel: "Detail",
//                 aksiClass: "bg-slate-100 hover:bg-slate-200 text-slate-600"
//             }
//         ]
//     },
//     "1234567802": {
//         nama: "Siti Aisyah",
//         nis: "1234567802",
//         program: "Web Development",
//         inisial: "SA",
//         keaktifan: "92% Rajin",
//         totalLaporan: 14,
//         diterima: 12,
//         menunggu: 2,
//         revisi: 0,
//         riwayat: [
//             {
//                 no: 1,
//                 tanggal: "17 Okt 2026",
//                 waktu: "16:40 WIB",
//                 judul: "Riset 15 Pelanggan Potensial (Customer Validation)",
//                 deskripsi: "Telah melakukan wawancara langsung ke 10 mahasiswa terkait riset pasar...",
//                 lampiranTipe: "📊 Sheet",
//                 status: "Diterima",
//                 statusBadgeClass: "bg-emerald-50 text-emerald-600 border border-emerald-200",
//                 aksiLabel: "Detail",
//                 aksiClass: "bg-slate-100 hover:bg-slate-200 text-slate-600"
//             }
//         ]
//     },
//     "1234567803": {
//         nama: "Budi Santoso",
//         nis: "1234567803",
//         program: "Web Development",
//         inisial: "BS",
//         keaktifan: "88% Cukup",
//         totalLaporan: 12,
//         diterima: 8,
//         menunggu: 3,
//         revisi: 1,
//         riwayat: [
//             {
//                 no: 1,
//                 tanggal: "17 Okt 2026",
//                 waktu: "15:10 WIB",
//                 judul: "Konfigurasi Database Postgres & API Authentication",
//                 deskripsi: "Terdapat error koneksi SSL pool pada Supabase saat implementasi JSON Web Token.",
//                 lampiranTipe: "📦 Repo",
//                 status: "Ditolak",
//                 statusBadgeClass: "bg-rose-50 text-rose-600 border border-rose-200",
//                 aksiLabel: "Detail",
//                 aksiClass: "bg-slate-100 hover:bg-slate-200 text-slate-600"
//             }
//         ]
//     },
//     "1234567804": {
//         nama: "Rina Febriani",
//         nis: "1234567804",
//         program: "Web Development",
//         inisial: "RF",
//         keaktifan: "95% Sangat Rajin",
//         totalLaporan: 15,
//         diterima: 13,
//         menunggu: 1,
//         revisi: 1,
//         riwayat: [
//             {
//                 no: 1,
//                 tanggal: "17 Okt 2026",
//                 waktu: "14:05 WIB",
//                 judul: "Penyusunan Pitch Deck 10 Slide & Financial Projection",
//                 deskripsi: "Unit economics dihitung berdasarkan asumsi COGS produk digital dan proyeksi pendapatan.",
//                 lampiranTipe: "📎 2 File",
//                 status: "Diterima",
//                 statusBadgeClass: "bg-emerald-50 text-emerald-600 border border-emerald-200",
//                 aksiLabel: "Detail",
//                 aksiClass: "bg-slate-100 hover:bg-slate-200 text-slate-600"
//             }
//         ]
//     }
// };

// const dataDailyReports = [
//     { no: 1, nama: "Ahmad Fauzi", nis: "1234567801", program: "Web Development", waktu: "17:15 WIB<br><span class='text-[10px] text-slate-400 font-normal'>17 Okt 2026</span>", judul: "Mengerjakan rancangan prototype dan alur checkout", deskripsi: "Modul katalog sudah selesai, kendala integrasi gateway pembayaran sandbox.", lampiran: "Dokumentasi_Progress_Checkout.pdf", status: "Menunggu" },
//     { no: 2, nama: "Siti Aisyah", nis: "1234567802", program: "Web Development", waktu: "16:40 WIB<br><span class='text-[10px] text-slate-400 font-normal'>17 Okt 2026</span>", judul: "Riset 15 Pelanggan Potensial (Customer Validation)", deskripsi: "Telah melakukan wawancara langsung ke 10 mahasiswa terkait kebutuhan aplikasi.", lampiran: "Sheet_Validasi_Customer.xlsx", status: "Diterima" },
//     { no: 3, nama: "Budi Santoso", nis: "1234567803", program: "Web Development", waktu: "15:10 WIB<br><span class='text-[10px] text-slate-400 font-normal'>17 Okt 2026</span>", judul: "Konfigurasi Database Postgres & API Authentication", deskripsi: "Terdapat error koneksi SSL pool pada Supabase saat implementasi JSON Web Token.", lampiran: "Error_Log_Supabase.txt", status: "Ditolak" },
//     { no: 4, nama: "Rina Febriani", nis: "1234567804", program: "Web Development", waktu: "14:05 WIB<br><span class='text-[10px] text-slate-400 font-normal'>17 Okt 2026</span>", judul: "Penyusunan Pitch Deck 10 Slide & Financial Projection", deskripsi: "Unit economics dihitung berdasarkan asumsi COGS produk digital dan proyeksi pendapatan.", lampiran: "PitchDeck_Startup_v1.pdf", status: "Diterima" }
// ];

// export function initMentorDailyReport() {
//     console.log("Modul Kelola Daily Report Mentor berhasil dimuat.");

//     const tableBody = document.getElementById("table-report-body");
//     const searchInput = document.getElementById("input-search-report");
//     const filterProgram = document.getElementById("filter-program");
//     const filterStatus = document.getElementById("filter-status");
//     const tabButtons = document.querySelectorAll(".tab-btn");

//     let activeTab = "semua";

//     // Fungsi Render Tabel Utama
//     function renderTable(data) {
//         if (!tableBody) return;

//         if (data.length === 0) {
//             tableBody.innerHTML = `<tr><td colspan="8" class="py-8 text-center text-slate-400">Tidak ada laporan harian yang ditemukan.</td></tr>`;
//             return;
//         }

//         tableBody.innerHTML = data.map((item, idx) => {
//             let statusBadge = "";
//             if (item.status === "Menunggu") {
//                 statusBadge = `<span class="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-amber-50 text-amber-600 text-[11px] font-bold">Menunggu</span>`;
//             } else if (item.status === "Diterima") {
//                 statusBadge = `<span class="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-emerald-50 text-emerald-600 text-[11px] font-bold">Diterima</span>`;
//             } else if (item.status === "Ditolak") {
//                 statusBadge = `<span class="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-rose-50 text-rose-600 text-[11px] font-bold">Ditolak</span>`;
//             }

//             let actionBtn = `<button type="button" class="btn-buka-modal px-3.5 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-600 font-semibold text-xs transition inline-flex items-center gap-1" data-nis="${item.nis}">Detail ↗</button>`;
//             let lampiranBadge = `<span class="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-slate-100 text-slate-600 text-[10px] font-medium truncate max-w-[150px]">📄 ${item.lampiran}</span>`;

//             return `
//                 <tr class="hover:bg-slate-50/80 transition align-top">
//                     <td class="py-4 px-6 font-semibold text-slate-400">${idx + 1}</td>
//                     <td class="py-4 px-6">
//                         <div>
//                             <h4 class="font-bold text-slate-900">${item.nama}</h4>
//                             <p class="text-[10px] text-slate-400 font-medium">NIS: ${item.nis}</p>
//                         </div>
//                     </td>
//                     <td class="py-4 px-6">
//                         <span class="px-3 py-1 rounded-full bg-slate-100 text-slate-600 text-[11px] font-semibold">${item.program}</span>
//                     </td>
//                     <td class="py-4 px-6 font-medium text-slate-700 text-xs">${item.waktu}</td>
//                     <td class="py-4 px-6 max-w-xs">
//                         <p class="font-bold text-slate-900 text-xs">${item.judul}</p>
//                         <p class="text-[11px] text-slate-400 mt-0.5 truncate">${item.deskripsi}</p>
//                     </td>
//                     <td class="py-4 px-6">${lampiranBadge}</td>
//                     <td class="py-4 px-6">${statusBadge}</td>
//                     <td class="py-4 px-6 text-center">${actionBtn}</td>
//                 </tr>
//             `;
//         }).join("");
//     }

//     renderTable(dataDailyReports);

//     // Fungsi Filter Data
//     function applyFilters() {
//         const keyword = (searchInput ? searchInput.value : "").toLowerCase();
//         const progVal = (filterProgram ? filterProgram.value : "").toLowerCase();
//         const statVal = (filterStatus ? filterStatus.value : "").toLowerCase();

//         const filtered = dataDailyReports.filter(item => {
//             const matchKeyword = item.nama.toLowerCase().includes(keyword) || item.judul.toLowerCase().includes(keyword);
//             const matchProgram = progVal === "" || item.program.toLowerCase().includes(progVal);
//             const matchStatus = statVal === "" || item.status.toLowerCase() === statVal;

//             let matchTab = true;
//             if (activeTab === "belum-dinilai") {
//                 matchTab = item.status.toLowerCase() === "menunggu";
//             } else if (activeTab === "selesai") {
//                 matchTab = item.status.toLowerCase() === "diterima" || item.status.toLowerCase() === "ditolak";
//             }

//             return matchKeyword && matchProgram && matchStatus && matchTab;
//         });

//         renderTable(filtered);
//     }

//     if (searchInput) searchInput.addEventListener("input", applyFilters);
//     if (filterProgram) filterProgram.addEventListener("change", applyFilters);
//     if (filterStatus) filterStatus.addEventListener("change", applyFilters);

//     tabButtons.forEach(btn => {
//         btn.addEventListener("click", (e) => {
//             tabButtons.forEach(b => b.classList.remove("bg-white", "shadow-sm", "text-slate-900"));
//             tabButtons.forEach(b => b.classList.add("hover:text-slate-900"));
            
//             e.target.classList.add("bg-white", "shadow-sm", "text-slate-900");
//             e.target.classList.remove("hover:text-slate-900");

//             activeTab = e.target.dataset.tab;
//             applyFilters();
//         });
//     });

//     // Fungsi Global Membuka Pop-up & Mengisi Data Siswa
//     window.openDailyReportModal = async (nisSiswa) => {
//         const container = document.getElementById("daily-report-modal-container");
//         if (container && !container.innerHTML.trim()) {
//             try {
//                 const response = await fetch('/Front-end/component/Mentor/pop-up-daily-report.html');
//                 if (response.ok) {
//                     container.innerHTML = await response.text();
//                     setupModalEventListeners();
//                 } else {
//                     console.error("Gagal mengambil file pop-up daily report. HTTP status:", response.status);
//                     return;
//                 }
//             } catch (err) {
//                 console.error("Kesalahan jaringan saat memuat modal pop-up:", err);
//                 return;
//             }
//         } else {
//             setupModalEventListeners();
//         }

//         const dataSiswa = databaseSiswaReport[nisSiswa] || databaseSiswaReport["1234567801"];

//         // Isi identitas siswa ke dalam pop-up
//         const elInitial = document.getElementById("modal-siswa-initial");
//         const elNama = document.getElementById("modal-siswa-nama");
//         const elInfo = document.getElementById("modal-siswa-info");
//         const elKeaktifan = document.getElementById("modal-siswa-keaktifan");

//         if (elInitial) elInitial.textContent = dataSiswa.inisial;
//         if (elNama) elNama.textContent = dataSiswa.nama;
//         if (elInfo) elInfo.innerHTML = `NIS: ${dataSiswa.nis} • <span class="text-indigo-600 font-semibold">${dataSiswa.program}</span>`;
//         if (elKeaktifan) elKeaktifan.textContent = dataSiswa.keaktifan;

//         // Isi statistik ringkasan
//         const statTotal = document.getElementById("stat-total-laporan");
//         const statDiterima = document.getElementById("stat-diterima");
//         const statMenunggu = document.getElementById("stat-menunggu");
//         const statRevisi = document.getElementById("stat-revisi");

//         if (statTotal) statTotal.textContent = dataSiswa.totalLaporan;
//         if (statDiterima) statDiterima.textContent = dataSiswa.diterima;
//         if (statMenunggu) statMenunggu.textContent = dataSiswa.menunggu;
//         if (statRevisi) statRevisi.textContent = dataSiswa.revisi;

//         // Render tabel riwayat harian di dalam pop-up
//         const tbody = document.getElementById("modal-riwayat-tbody");
//         if (tbody) {
//             tbody.innerHTML = dataSiswa.riwayat.map(item => `
//                 <tr class="hover:bg-slate-50/50 transition">
//                     <td class="py-3.5 px-4 font-bold text-slate-700">${item.no}</td>
//                     <td class="py-3.5 px-4">
//                         <span class="font-bold text-slate-800 block">${item.tanggal}</span>
//                         <span class="text-[10px] text-slate-400">${item.waktu}</span>
//                     </td>
//                     <td class="py-3.5 px-4">
//                         <span class="font-bold text-slate-800 block">${item.judul}</span>
//                         <span class="text-[11px] text-slate-500 truncate block max-w-xs">${item.deskripsi}</span>
//                     </td>
//                     <td class="py-3.5 px-4">
//                         <span class="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-blue-50 text-blue-600 text-[10px] font-bold border border-blue-200">
//                             ${item.lampiranTipe}
//                         </span>
//                     </td>
//                     <td class="py-3.5 px-4">
//                         <span class="inline-block px-2.5 py-0.5 rounded-full text-[10px] font-bold ${item.statusBadgeClass}">
//                             ${item.status}
//                         </span>
//                     </td>
//                     <td class="py-3.5 px-4 text-center">
//                         <button type="button" class="px-3.5 py-1.5 rounded-xl text-[11px] font-bold shadow-sm transition ${item.aksiClass}">
//                             ${item.aksiLabel}
//                         </button>
//                     </td>
//                 </tr>
//             `).join("");
//         }

//         const footerInfo = document.getElementById("modal-footer-info");
//         if (footerInfo) {
//             footerInfo.textContent = `Menampilkan ${dataSiswa.riwayat.length} dari ${dataSiswa.totalLaporan} laporan harian`;
//         }

//         // Tampilkan modal
//         const modalEl = document.getElementById("modal-daily-report");
//         if (modalEl) modalEl.classList.remove("hidden");
//     };

//     function setupModalEventListeners() {
//         const closeBtn = document.getElementById("modal-close-btn");
//         const closeFooterBtn = document.getElementById("modal-close-footer-btn");
//         const modalEl = document.getElementById("modal-daily-report");

//         if (closeBtn && modalEl) {
//             closeBtn.onclick = (e) => {
//                 e.preventDefault();
//                 modalEl.classList.add("hidden");
//             };
//         }

//         if (closeFooterBtn && modalEl) {
//             closeFooterBtn.onclick = (e) => {
//                 e.preventDefault();
//                 modalEl.classList.add("hidden");
//             };
//         }

//         if (modalEl) {
//             modalEl.onclick = (e) => {
//                 if (e.target === modalEl) modalEl.classList.add("hidden");
//             };
//         }
//     }

//     // Event Listener Global untuk menangkap klik tombol "Detail" pada baris tabel utama
//     document.addEventListener("click", (e) => {
//         const targetBtn = e.target.closest(".btn-buka-modal");
//         if (targetBtn) {
//             e.preventDefault();
//             const nisSiswa = targetBtn.dataset.nis;
//             if (nisSiswa) {
//                 window.openDailyReportModal(nisSiswa);
//             }
//         }
//     });
// }

// document.addEventListener("DOMContentLoaded", () => {
//     initMentorDailyReport();
// });