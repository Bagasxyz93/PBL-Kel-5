import { API_BASE_URL } from "../api-config.js";


// Mengambil token khusus tab yang sedang digunakan
function getAuthHeaders() {
    const token = sessionStorage.getItem("authToken");

    return {
        "Authorization": `Bearer ${token}`
    };
}

/* =========================================================
    LOGIKA HALAMAN PROFIL MENTOR
========================================================= */

export function initMentorProfil() {
    console.log("Modul Profil Mentor berhasil dimuat.");

    async function loadProfilMentor() {
        try {
            const response = await fetch(
                `${API_BASE_URL}/api/mentor/api_profil_mentor.php`,
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

            const nameEl = document.getElementById("profile-name");
            const genderEl = document.getElementById("profile-gender");
            const nipEl = document.getElementById("profile-nip");
            const usernameEl = document.getElementById("profile-username");
            const emailEl = document.getElementById("profile-email");
            const phoneEl = document.getElementById("profile-phone");
            const programEl = document.getElementById("profile-program");
            const statusEl = document.getElementById("profile-status");

            if (nameEl) nameEl.textContent = mentor.nama || "-";

            if (genderEl) {
                genderEl.textContent = mentor.jenis_kelamin || "-";
            }

            if (nipEl) {
                nipEl.textContent = "NIP: " + (mentor.nip || "-");
            }

            if (usernameEl) {
                usernameEl.textContent = mentor.username || "-";
            }

            if (emailEl) {
                emailEl.textContent = mentor.email || "-";
            }

            if (phoneEl) {
                phoneEl.textContent = mentor.no_hp || "-";
            }

            // Menampilkan status akun
            if (statusEl) {
                const status = mentor.status_akun || "-";

                statusEl.textContent = status.toUpperCase();

                if (status === "aktif") {
                    statusEl.className =
                        "px-3 py-1 rounded-full bg-emerald-50 text-emerald-600 font-bold text-[11px] uppercase tracking-wider";
                } else {
                    statusEl.className =
                        "px-3 py-1 rounded-full bg-red-50 text-red-600 font-bold text-[11px] uppercase tracking-wider";
                }
            }

            // Menampilkan program mentor
            if (programEl) {
                programEl.innerHTML = "";

                if (mentor.program && mentor.program.length > 0) {
                    mentor.program.forEach((program) => {
                        const badge = document.createElement("span");

                        badge.className =
                            "px-3 py-1 rounded-full bg-slate-100 text-slate-700 font-bold text-[11px]";

                        badge.textContent = program.nama_program;

                        programEl.appendChild(badge);
                    });
                } else {
                    programEl.textContent = "Belum ada program";
                }
            }

        } catch (error) {
            console.error("Gagal mengambil profil mentor:", error);

            const nameEl = document.getElementById("profile-name");

            if (nameEl) {
                nameEl.textContent = "Gagal memuat profil";
            }
        }
    }

    loadProfilMentor();

    // Inisialisasi Pop-up Ubah Password
    setupPasswordModal();
}


/* =========================================================
    LOGIKA POP-UP UBAH PASSWORD
========================================================= */

async function setupPasswordModal() {
    const editBtn = document.getElementById("btn-edit-profil");

    const API_PASSWORD =
        `${API_BASE_URL}/api/password/api_ubah_password.php`;

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
