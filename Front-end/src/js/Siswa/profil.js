
/* =========================================================
    LOGIKA HALAMAN PROFIL SISWA
========================================================= */

export function initProfil() {
    console.log("Modul Profil Siswa berhasil dimuat.");

    const nama = document.getElementById("profil-nama");
    const nisn = document.getElementById("profil-nisn");
    const email = document.getElementById("profil-email");
    const telepon = document.getElementById("profil-telepon");
    const program = document.getElementById("profil-program");
    const status = document.getElementById("profil-status");

    const btnEdit = document.getElementById("btn-edit-profil");
    const btnJadwal = document.getElementById("btn-lihat-jadwal");
    const daftarJadwal = document.getElementById("daftar-jadwal");
    const jadwalKosong = document.getElementById("jadwal-kosong");
    const toast = document.getElementById("profil-toast");

    if (!nama || !email || !telepon || !btnEdit) {
        return;
    }

    const API_PROFIL =
        "http://localhost:8000/api/siswa/api_profil.php";

    // Mengambil token login
    function getAuthHeaders() {
        const token = sessionStorage.getItem("authToken");

        if (!token) {
            throw new Error("Token login tidak ditemukan.");
        }

        return {
            Authorization: `Bearer ${token}`
        };
    }

    // Mengambil data profil dari backend
    async function ambilProfil() {
        try {
            const response = await fetch(API_PROFIL, {
                method: "GET",
                headers: getAuthHeaders()
            });

            const result = await response.json();

            if (!response.ok || !result.success) {
                throw new Error(
                    result.message || "Gagal mengambil data profil."
                );
            }

            const data = result.data;

            // Menampilkan data profil
            nama.textContent = data.nama || "-";

            if (nisn) {
                nisn.textContent = data.nisn || "-";
            }

            email.textContent = data.email || "-";
            telepon.textContent = data.telepon || "-";

            if (program) {
                program.textContent = data.program || "-";
            }

            if (status) {
                status.textContent = data.status || "-";
            }

        } catch (error) {
            console.error("Gagal mengambil profil:", error);

            nama.textContent = "Gagal memuat data";
            email.textContent = "-";
            telepon.textContent = "-";

            if (nisn) {
                nisn.textContent = "-";
            }

            if (program) {
                program.textContent = "-";
            }

            if (status) {
                status.textContent = "-";
            }
        }
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
                item.classList.toggle(
                    "hidden",
                    !semuaJadwalDitampilkan
                );
            }
        });

        btnJadwal.textContent = semuaJadwalDitampilkan
            ? "Tampilkan Lebih Sedikit"
            : "Lihat Semua";
    });

    // Awalnya tampilkan dua jadwal saja
    if (daftarJadwal) {
        Array.from(daftarJadwal.children).forEach((item, index) => {
            if (index >= 2) {
                item.classList.add("hidden");
            }
        });
    }

    // Mengambil profil dari database
    ambilProfil();

    // Inisialisasi Pop-up Ubah Password
    setupPasswordModal();
}


/* =========================================================
    LOGIKA POP-UP UBAH PASSWORD
========================================================= */

async function setupPasswordModal() {
    const editBtn = document.getElementById("btn-edit-profil");

    const API_PASSWORD =
        "http://localhost:8000/api/password/api_ubah_password.php";

    let modalContainer = document.getElementById(
        "password-modal-container"
    );

    if (!modalContainer) {
        modalContainer = document.createElement("div");
        modalContainer.id = "password-modal-container";
        document.body.appendChild(modalContainer);
    }

    // Memuat HTML modal
    async function loadModalHtml() {
        if (!modalContainer.innerHTML.trim()) {
            try {
                const response = await fetch(
                    "/component/Password/pop-up-ubah-password.html"
                );

                if (!response.ok) {
                    throw new Error("Gagal memuat modal ubah password.");
                }

                modalContainer.innerHTML = await response.text();

                initModalEvents();

            } catch (error) {
                console.error("Gagal memuat modal:", error);
                alert("Gagal memuat pop-up ubah password.");
            }
        }
    }

    // Mengatur event modal
    function initModalEvents() {
        const modal = document.getElementById("modal-ubah-password");
        const form = document.getElementById("form-ubah-password");

        const closeBtn = document.getElementById(
            "modal-password-close-btn"
        );

        const cancelBtn = document.getElementById(
            "modal-password-cancel-btn"
        );

        const saveBtn = document.getElementById(
            "modal-password-save-btn"
        );

        const passwordLama = document.getElementById("current-password");
        const passwordBaru = document.getElementById("new-password");
        const konfirmasiPassword = document.getElementById("confirm-password");

        const statusCocok = document.getElementById(
            "password-match-status"
        );

        if (
            !modal ||
            !form ||
            !closeBtn ||
            !cancelBtn ||
            !saveBtn ||
            !passwordLama ||
            !passwordBaru ||
            !konfirmasiPassword ||
            !statusCocok
        ) {
            console.error("Elemen modal password tidak lengkap.");
            return;
        }

        // Mengosongkan form
        function resetForm() {
            form.reset();

            statusCocok.textContent = "";
            statusCocok.classList.add("hidden");

            saveBtn.disabled = false;
            saveBtn.textContent = "Simpan Kata Sandi Baru";
        }

        // Menutup modal
        function closeModal() {
            modal.classList.add("hidden");
            resetForm();
        }

        closeBtn.onclick = closeModal;
        cancelBtn.onclick = closeModal;

        // Tutup ketika klik area luar modal
        modal.onclick = (e) => {
            if (e.target === modal) {
                closeModal();
            }
        };

        // Tutup menggunakan tombol Escape
        modal.onkeydown = (e) => {
            if (e.key === "Escape") {
                closeModal();
            }
        };

        // Toggle tampil atau sembunyikan password
        modal.querySelectorAll(".toggle-password").forEach((btn) => {
            btn.onclick = () => {
                const targetId = btn.getAttribute("data-target");
                const input = document.getElementById(targetId);

                if (input) {
                    input.type =
                        input.type === "password" ? "text" : "password";
                }
            };
        });

        // Memeriksa kecocokan password baru
        function cekKecocokanPassword() {
            const baru = passwordBaru.value;
            const konfirmasi = konfirmasiPassword.value;

            if (!baru && !konfirmasi) {
                statusCocok.textContent = "";
                statusCocok.classList.add("hidden");
                return;
            }

            statusCocok.classList.remove("hidden");

            if (baru === konfirmasi) {
                statusCocok.textContent = "✓ Kata sandi cocok";
                statusCocok.className =
                    "text-[11px] font-semibold text-emerald-600 mt-1";
            } else {
                statusCocok.textContent =
                    "✕ Kata sandi belum cocok";

                statusCocok.className =
                    "text-[11px] font-semibold text-red-600 mt-1";
            }
        }

        passwordBaru.addEventListener(
            "input",
            cekKecocokanPassword
        );

        konfirmasiPassword.addEventListener(
            "input",
            cekKecocokanPassword
        );

        // Proses menyimpan password baru
        saveBtn.onclick = async (e) => {
            e.preventDefault();

            const lama = passwordLama.value;
            const baru = passwordBaru.value;
            const konfirmasi = konfirmasiPassword.value;

            if (!lama || !baru || !konfirmasi) {
                alert("Semua kolom password wajib diisi.");
                return;
            }

            if (baru !== konfirmasi) {
                alert("Konfirmasi password baru tidak sesuai.");
                return;
            }

            const polaPassword =
                /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^A-Za-z\d]).{8,}$/;

            if (!polaPassword.test(baru)) {
                alert(
                    "Password minimal 8 karakter dan harus mengandung huruf besar, huruf kecil, angka, serta simbol."
                );
                return;
            }

            const token = sessionStorage.getItem("authToken");

            if (!token) {
                alert(
                    "Sesi login tidak ditemukan. Silakan login kembali."
                );
                return;
            }

            try {
                saveBtn.disabled = true;
                saveBtn.textContent = "Menyimpan...";

                const response = await fetch(API_PASSWORD, {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                        "Authorization": `Bearer ${token}`
                    },
                    body: JSON.stringify({
                        password_lama: lama,
                        password_baru: baru,
                        konfirmasi_password: konfirmasi
                    })
                });

                const result = await response.json();

                if (!response.ok || !result.success) {
                    throw new Error(
                        result.message ||
                        "Gagal memperbarui password."
                    );
                }

                alert(result.message);
                closeModal();

            } catch (error) {
                console.error("Gagal mengubah password:", error);

                alert(
                    error.message ||
                    "Terjadi kesalahan saat mengubah password."
                );

            } finally {
                saveBtn.disabled = false;
                saveBtn.textContent = "Simpan Kata Sandi Baru";
            }
        };
    }

    // Membuka modal ketika tombol diklik
    if (editBtn) {
        editBtn.addEventListener("click", async () => {
            await loadModalHtml();

            const modal = document.getElementById("modal-ubah-password");

            if (modal) {
                modal.classList.remove("hidden");
            }
        });
    }
}
