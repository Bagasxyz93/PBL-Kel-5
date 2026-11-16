/* =========================================================
    LOGIKA HALAMAN MATERI SISWA & DATA DUMMY POP-UP
========================================================= */

// Data dummy detail materi berdasarkan ID modul
const dataDummyMateri = {
    "modul-1": {
        id: "modul-1",
        judul: "Modul 1: HTML5 Semantic",
        kategoriCard: "Kelas 1 - Web Development",
        kategoriList: ["Web Development", "HTML5 Semantic"],
        durasi: "90 Menit",
        durasiModal: "Modul Sesi 1 • 90 Menit",
        status: "Tersedia",
        statusColor: "bg-emerald-50 text-emerald-600",
        pengajarNama: "Bapak Rendi",
        pengajarPeran: "Mentor Web Development",
        pengajarPeranLengkap: "Mentor Web Development Inkubasi",
        pengajarInisial: "RD",
        tanggal: "14 November 2026",
        kelas: "Kelas 1 Inkubasi",
        fileNama: "Modul_1_HTML5.pdf",
        fileUkuran: "4.8 MB",
        deskripsiParagraf1: "Modul ini membahas konsep dasar elemen semantik pada HTML5 seperti <code><header></code>, <code><nav></code>, <code><main></code>, <code><article></code>, <code><section></code>, dan <code><footer></code>.",
        deskripsiParagraf2: "Siswa diharapkan mampu memahami perbedaan mendasar antara elemen semantik dan non-semantik (seperti div & span), pentingnya struktur semantik untuk aksesibilitas (a11y) dan SEO web modern, serta mengimplementasikannya secara langsung pada layout proyek portofolio inkubasi.",
        berkasNama: "Modul_1_HTML5_Semantic.pdf",
        berkasInfo: "Format: PDF • Ukuran: 4.8 MB • Diunggah 14 Nov 2026",
        petunjuk: "Materi ini disusun langsung oleh mentor kelas. Silakan baca dan pelajari modul di atas sebelum sesi tatap muka mentoring dimulai. Kerjakan latihan di bagian akhir modul sebagai bahan pelaporan Daily Report Anda."
    },
    "modul-2": {
        id: "modul-2",
        judul: "Modul 2: CSS Flexbox & Grid Layout",
        kategoriCard: "Kelas 1 - Web Development",
        kategoriList: ["Web Development", "CSS Layout"],
        durasi: "120 Menit",
        durasiModal: "Modul Sesi 2 • 120 Menit",
        status: "Tersedia",
        statusColor: "bg-emerald-50 text-emerald-600",
        pengajarNama: "Bapak Rendi",
        pengajarPeran: "Mentor Web Development",
        pengajarPeranLengkap: "Mentor Web Development Inkubasi",
        pengajarInisial: "RD",
        tanggal: "18 November 2026",
        kelas: "Kelas 1 Inkubasi",
        fileNama: "Modul_2_Flexbox_Grid.pdf",
        fileUkuran: "5.2 MB",
        deskripsiParagraf1: "Modul ini mendalami teknik tata letak modern menggunakan sistem <code>Flexbox</code> untuk penyusunan satu dimensi dan <code>CSS Grid</code> untuk tata letak dua dimensi yang responsif.",
        deskripsiParagraf2: "Siswa akan dilatih membangun komponen antarmuka web yang fleksibel, adaptif terhadap berbagai ukuran layar perangkat, dan mempraktikkannya langsung pada proyek halaman dashboard inkubasi.",
        berkasNama: "Modul_2_Flexbox_Grid.pdf",
        berkasInfo: "Format: PDF • Ukuran: 5.2 MB • Diunggah 18 Nov 2026",
        petunjuk: "Pastikan Anda telah merampungkan latihan struktur HTML sebelum mempraktikkan styling layout pada modul ini."
    }
};

export function initMateri() {
    console.log("Modul Materi Siswa berhasil dimuat.");

    renderCardsMateri();

    const searchInput = document.getElementById("search-materi");
    const emptyMessage = document.getElementById("materi-kosong");

    // Logika Pencarian Materi
    if (searchInput && emptyMessage) {
        function filterMateri() {
            const keyword = searchInput.value.trim().toLowerCase();
            const cards = document.querySelectorAll(".kartu-materi");
            let totalVisible = 0;

            cards.forEach((card) => {
                const searchableText = [
                    card.dataset.judul,
                    card.dataset.kategori,
                    card.dataset.pengajar,
                    card.textContent
                ]
                    .join(" ")
                    .toLowerCase();

                const matched = searchableText.includes(keyword);
                card.classList.toggle("hidden", !matched);

                if (matched) {
                    totalVisible++;
                }
            });

            emptyMessage.classList.toggle("hidden", totalVisible > 0);
        }

        searchInput.addEventListener("input", filterMateri);
    }

    // Inisialisasi Pop-up Detail Materi
    setupDetailMateriModal();
}

// Fungsi untuk merender kartu materi dengan ukuran seragam (Grid & Flex stretch)
function renderCardsMateri() {
    const daftarMateriContainer = document.getElementById("daftar-materi");
    if (!daftarMateriContainer) return;

    // Mengubah container menjadi Grid agar ukuran lebar dan tinggi kartu konsisten
    daftarMateriContainer.className = "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 items-stretch w-full";
    daftarMateriContainer.innerHTML = "";

    Object.values(dataDummyMateri).forEach((materi) => {
        const article = document.createElement("article");
        article.className = "kartu-materi flex flex-col justify-between h-full rounded-xl border border-slate-100 bg-[#f5f4ff] p-4 shadow-sm transition duration-200 hover:-translate-y-1 hover:shadow-md";
        article.setAttribute("data-judul", materi.judul);
        article.setAttribute("data-kategori", materi.kategoriCard);
        article.setAttribute("data-pengajar", materi.pengajarNama);

        article.innerHTML = `
            <div>
                <div class="mb-2 flex flex-wrap items-center gap-1.5">
                    <span class="rounded bg-[#3922b9] px-2 py-1 text-[10px] font-semibold text-white">
                        ${materi.kategoriCard}
                    </span>
                    <span class="flex items-center gap-1 text-[10px] text-slate-500">
                        <svg class="h-3 w-3" fill="none" stroke="currentColor" stroke-width="1.5" viewBox="0 0 24 24" aria-hidden="true">
                            <circle cx="12" cy="12" r="9"></circle>
                            <path d="M12 7v5l3 2"></path>
                        </svg>
                        ${materi.durasi}
                    </span>
                </div>

                <h3 class="text-sm font-bold leading-5 text-slate-800">
                    ${materi.judul}
                </h3>
            </div>

            <div>
                <div class="mt-3 flex items-center gap-2">
                    <div class="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-[#3922b9] text-[9px] font-bold text-white">
                        ${materi.pengajarInisial}
                    </div>
                    <div class="min-w-0">
                        <p class="text-[11px] font-semibold text-slate-700">
                            ${materi.pengajarNama}
                        </p>
                        <p class="text-[10px] text-slate-500">
                            ${materi.pengajarPeran}
                        </p>
                    </div>
                </div>

                <a href="#" class="mt-3 flex items-center justify-between gap-2 rounded-md border border-slate-100 bg-white px-2 py-2 text-[10px] transition hover:border-indigo-200 hover:bg-indigo-50" onclick="event.preventDefault();">
                    <span class="flex min-w-0 items-center gap-1.5">
                        <svg class="h-3.5 w-3.5 shrink-0 text-red-500" fill="none" stroke="currentColor" stroke-width="1.7" viewBox="0 0 24 24">
                            <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
                            <path d="M14 2v6h6"></path>
                            <path d="M8 15h8M8 18h6"></path>
                        </svg>
                        <span class="truncate text-red-500">${materi.fileNama}</span>
                    </span>
                    <span class="shrink-0 font-semibold text-blue-600">${materi.fileUkuran}</span>
                </a>

                <button type="button" data-id="${materi.id}" class="btn-akses-materi mt-2.5 flex h-9 w-full items-center justify-center gap-1.5 rounded-lg bg-[#4027bd] px-2 text-[11px] font-semibold text-white transition hover:bg-[#30209b] active:scale-[0.98]">
                    Akses & Pelajari Modul
                    <svg class="h-3.5 w-3.5" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24" aria-hidden="true">
                        <path d="M5 12h14"></path>
                        <path d="m13 6 6 6-6 6"></path>
                    </svg>
                </button>
            </div>
        `;

        daftarMateriContainer.appendChild(article);
    });
}

/* =========================================================
    LOGIKA POP-UP DETAIL MATERI & DUMMY BINDING
========================================================= */

async function setupDetailMateriModal() {
    let modalContainer = document.getElementById("materi-modal-container");

    if (!modalContainer) {
        modalContainer = document.createElement("div");
        modalContainer.id = "materi-modal-container";
        document.body.appendChild(modalContainer);
    }

    async function loadModalHtml() {
        if (!modalContainer.innerHTML.trim()) {
            try {
                const response = await fetch('/component/Siswa/pop-up-detail-materi.html');
                if (response.ok) {
                    modalContainer.innerHTML = await response.text();
                    initModalEvents();
                } else {
                    console.error("Gagal memuat file pop-up detail materi.");
                }
            } catch (err) {
                console.error("Terjadi kesalahan jaringan:", err);
            }
        }
    }

    function populateModalData(materiId) {
        const data = dataDummyMateri[materiId] || dataDummyMateri["modul-1"];

        const elJudul = document.getElementById("modal-materi-judul");
        const elBadgeContainer = document.getElementById("modal-materi-badges");
        const elPengajarNama = document.getElementById("modal-pengajar-nama");
        const elPengajarPeran = document.getElementById("modal-pengajar-peran");
        const elPengajarInisial = document.getElementById("modal-pengajar-inisial");
        const elTanggal = document.getElementById("modal-tanggal");
        const elKelas = document.getElementById("modal-kelas");
        const elDeskripsi = document.getElementById("modal-deskripsi");
        const elBerkasNama = document.getElementById("modal-berkas-nama");
        const elBerkasInfo = document.getElementById("modal-berkas-info");
        const elPetunjuk = document.getElementById("modal-petunjuk");

        if (elJudul) elJudul.textContent = data.judul;
        if (elPengajarNama) elPengajarNama.textContent = data.pengajarNama;
        if (elPengajarPeran) elPengajarPeran.textContent = data.pengajarPeranLengkap;
        if (elPengajarInisial) elPengajarInisial.textContent = data.pengajarInisial;
        if (elTanggal) elTanggal.textContent = `📅 ${data.tanggal}`;
        if (elKelas) elKelas.textContent = data.kelas;
        if (elBerkasNama) elBerkasNama.textContent = data.berkasNama;
        if (elBerkasInfo) elBerkasInfo.textContent = data.berkasInfo;
        if (elPetunjuk) elPetunjuk.textContent = data.petunjuk;

        if (elDeskripsi) {
            elDeskripsi.innerHTML = `
                <p>${data.deskripsiParagraf1}</p>
                <p class="mt-2">${data.deskripsiParagraf2}</p>
            `;
        }

        if (elBadgeContainer) {
            elBadgeContainer.innerHTML = `
                <span class="px-2.5 py-1 rounded-full bg-indigo-50 text-indigo-600 font-bold text-[10px]">${data.kategoriList[0]}</span>
                <span class="px-2.5 py-1 rounded-full bg-indigo-50 text-indigo-600 font-bold text-[10px]">${data.kategoriList[1]}</span>
                <span class="px-2.5 py-1 rounded-full bg-slate-100 text-slate-600 font-semibold text-[10px]">⏱ ${data.durasiModal}</span>
                <span class="px-2.5 py-1 rounded-full ${data.statusColor} font-bold text-[10px] flex items-center gap-1">
                    <span class="w-1.5 h-1.5 rounded-full bg-emerald-500"></span> ${data.status}
                </span>
            `;
        }
    }

    function initModalEvents() {
        const modal = document.getElementById("modal-detail-materi");
        const closeBtn = document.getElementById("modal-materi-close-btn");
        const okBtn = document.getElementById("modal-materi-ok-btn");

        if (!modal) return;

        const closeModal = () => modal.classList.add("hidden");

        if (closeBtn) closeBtn.onclick = closeModal;
        if (okBtn) okBtn.onclick = closeModal;
        
        modal.onclick = (e) => {
            if (e.target === modal) closeModal();
        };

        document.addEventListener("keydown", (e) => {
            if (e.key === "Escape" && !modal.classList.contains("hidden")) {
                closeModal();
            }
        });
    }

    // Event listener untuk tombol akses modul
    document.addEventListener("click", async (e) => {
        const btn = e.target.closest(".btn-akses-materi");
        if (btn) {
            e.preventDefault();
            const materiId = btn.getAttribute("data-id") || "modul-1";
            await loadModalHtml();
            populateModalData(materiId);
            
            const modal = document.getElementById("modal-detail-materi");
            if (modal) {
                modal.classList.remove("hidden");
            }
        }
    });
}