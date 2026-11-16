/* =========================================================
    LOGIKA HALAMAN PROFIL SISWA
========================================================= */

export function initProfil() {
    console.log("Modul Profil Siswa berhasil dimuat.");

    const nama = document.getElementById("profil-nama");
    const email = document.getElementById("profil-email");
    const telepon = document.getElementById("profil-telepon");

    const btnEdit = document.getElementById("btn-edit-profil");
    const btnJadwal = document.getElementById("btn-lihat-jadwal");
    const daftarJadwal = document.getElementById("daftar-jadwal");
    const jadwalKosong = document.getElementById("jadwal-kosong");
    const toast = document.getElementById("profil-toast");

    if (!nama || !email || !telepon || !btnEdit) {
        return;
    }

    // Data awal halaman profil
    const dataAwal = {
        nama: nama.textContent.trim(),
        email: email.textContent.trim(),
        telepon: telepon.textContent.trim()
    };

    const STORAGE_KEY = "siin_profil_siswa";

    // Membaca data profil dari localStorage
    function bacaProfil() {
        try {
            const dataTersimpan = localStorage.getItem(STORAGE_KEY);
            if (dataTersimpan) {
                return {
                    ...dataAwal,
                    ...JSON.parse(dataTersimpan)
                };
            }
        } catch (error) {
            console.error("Gagal membaca data profil:", error);
        }
        return { ...dataAwal };
    }

    let dataProfil = bacaProfil();

    // Menampilkan data profil
    function tampilkanProfil() {
        nama.textContent = dataProfil.nama;
        email.textContent = dataProfil.email;
        telepon.textContent = dataProfil.telepon;
    }

    // Notifikasi Toast sederhana
    let toastTimer;
    function tampilkanToast(pesan) {
        if (!toast) return;

        toast.textContent = pesan;
        toast.classList.remove("hidden");

        clearTimeout(toastTimer);
        toastTimer = setTimeout(() => {
            toast.classList.add("hidden");
        }, 2500);
    }

    // Tampilkan seluruh jadwal atau ringkasannya
    let semuaJadwalDitampilkan = false;

    btnJadwal?.addEventListener("click", () => {
        if (!daftarJadwal || !jadwalKosong) return;

        const jadwal = daftarJadwal.children;

        if (jadwal.length === 0) {
            jadwalKosong.classList.remove("hidden");
            tampilkanToast("Belum ada jadwal yang tersedia.");
            return;
        }

        semuaJadwalDitampilkan = !semuaJadwalDitampilkan;

        Array.from(jadwal).forEach((item, index) => {
            if (index >= 2) {
                item.classList.toggle("hidden", !semuaJadwalDitampilkan);
            }
        });

        btnJadwal.textContent = semuaJadwalDitampilkan
            ? "Tampilkan Lebih Sedikit"
            : "Lihat Semua";
    });

    // Terapkan data yang tersimpan
    tampilkanProfil();

    // Awalnya tampilkan dua jadwal saja
    if (daftarJadwal) {
        Array.from(daftarJadwal.children).forEach((item, index) => {
            if (index >= 2) {
                item.classList.add("hidden");
            }
        });
    }

    // Inisialisasi Pop-up Ubah Password Terpusat
    setupPasswordModal();
}

/* =========================================================
    LOGIKA POP-UP UBAH PASSWORD (CHANGE PASSWORD)
========================================================= */

async function setupPasswordModal() {
    const btnEditPassword = document.getElementById("btn-edit-profil");
    let modalContainer = document.getElementById("password-modal-container");

    if (!modalContainer) {
        modalContainer = document.createElement("div");
        modalContainer.id = "password-modal-container";
        document.body.appendChild(modalContainer);
    }

    async function loadModalHtml() {
        if (!modalContainer.innerHTML.trim()) {
            try {
                const response = await fetch('/component/Password/pop-up-ubah-password.html');
                if (response.ok) {
                    modalContainer.innerHTML = await response.text();
                    initModalEvents();
                } else {
                    console.error("Gagal memuat file pop-up ubah password.");
                }
            } catch (err) {
                console.error("Terjadi kesalahan jaringan:", err);
            }
        }
    }

    function initModalEvents() {
        const modal = document.getElementById("modal-ubah-password");
        const closeBtn = document.getElementById("modal-password-close-btn");
        const cancelBtn = document.getElementById("modal-password-cancel-btn");
        const saveBtn = document.getElementById("modal-password-save-btn");

        if (!modal) return;

        const closeModal = () => modal.classList.add("hidden");

        if (closeBtn) closeBtn.onclick = closeModal;
        if (cancelBtn) cancelBtn.onclick = closeModal;
        
        modal.onclick = (e) => {
            if (e.target === modal) closeModal();
        };

        // Tutup modal dengan tombol Escape
        document.addEventListener("keydown", (e) => {
            if (e.key === "Escape" && !modal.classList.contains("hidden")) {
                closeModal();
            }
        });

        // Toggle tampil / sembunyi password pada ikon mata
        document.querySelectorAll(".toggle-password").forEach(btn => {
            btn.onclick = () => {
                const targetId = btn.getAttribute("data-target");
                const inputEl = document.getElementById(targetId);
                if (inputEl) {
                    inputEl.type = inputEl.type === "password" ? "text" : "password";
                }
            };
        });

        // Aksi simpan password baru
        if (saveBtn) {
            saveBtn.onclick = (e) => {
                e.preventDefault();
                alert("Kata sandi berhasil diperbarui!");
                modal.classList.add("hidden");
            };
        }
    }

    if (btnEditPassword) {
        btnEditPassword.addEventListener("click", async () => {
            await loadModalHtml();
            const modal = document.getElementById("modal-ubah-password");
            if (modal) {
                modal.classList.remove("hidden");
            }
        });
    }
}