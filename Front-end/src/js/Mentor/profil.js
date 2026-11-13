
/* =========================================================
   LOGIKA HALAMAN PROFIL MENTOR
========================================================= */

export function initMentorProfil() {
    console.log("Modul Profil Mentor berhasil dimuat.");

    // Mengambil data profil mentor dari database
    async function loadProfilMentor() {
        try {
            const response = await fetch(
                "http://localhost:8000/api/mentor/api_profil_mentor.php",
                {
                    method: "GET",
                    credentials: "include"
                }
            );

            const result = await response.json();

            if (!response.ok || !result.success) {
                throw new Error(result.message || "Gagal mengambil profil mentor.");
            }

            const mentor = result.data;

            // Mengambil elemen HTML
            const nameEl = document.getElementById("profile-name");
            const genderEl = document.getElementById("profile-gender");
            const nipEl = document.getElementById("profile-nip");
            const usernameEl = document.getElementById("profile-username");
            const emailEl = document.getElementById("profile-email");
            const phoneEl = document.getElementById("profile-phone");
            const programEl = document.getElementById("profile-program");
            const statusEl = document.getElementById("profile-status");

            // Menampilkan identitas mentor
            if (nameEl) nameEl.textContent = mentor.nama || "-";
            if (genderEl) genderEl.textContent = mentor.jenis_kelamin || "-";
            if (nipEl) nipEl.textContent = "NIP: " + (mentor.nip || "-");

            // Menampilkan informasi akun
            if (usernameEl) usernameEl.textContent = mentor.username || "-";
            if (emailEl) emailEl.textContent = mentor.email || "-";
            if (phoneEl) phoneEl.textContent = mentor.no_hp || "-";

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

            // Menampilkan program yang diampu mentor
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

    // Memanggil data profil
    loadProfilMentor();

    // Interaksi tombol Edit Profil
    const editBtn = document.getElementById("btn-edit-profil");

    if (editBtn) {
        editBtn.addEventListener("click", () => {
            alert("Fitur edit profil mentor akan segera dibuka.");
        });
    }
}
