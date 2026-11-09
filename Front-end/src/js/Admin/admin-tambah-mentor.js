async function loadProgramMentor(selectedProgramIds = []) {
    const container = document.getElementById("daftarProgramMentor");

    if (!container) return;

    try {
        const response = await fetch("http://localhost:8000/api_program.php");
        const result = await response.json();

        if (!result.success) {
            throw new Error("Gagal mengambil data program.");
        }

        if (result.data.length === 0) {
            container.innerHTML = `
                <p class="text-xs text-slate-400">
                    Belum ada program yang tersedia.
                </p>
            `;
            return;
        }

        container.innerHTML = result.data.map(program => `
            <label class="flex items-center gap-3 p-3.5 rounded-xl border border-slate-200 bg-slate-50/50 cursor-pointer hover:bg-slate-50 transition">
                <input
                    type="checkbox"
                    name="programMentor"
                    value="${program.id}"
                    class="text-indigo-600 focus:ring-indigo-500"
                    ${selectedProgramIds.includes(Number(program.id)) ? "checked" : ""}
                >
                <span class="text-xs font-bold text-slate-800">
                    ${program.nama_program}
                </span>
            </label>
        `).join("");

    } catch (error) {
        console.error("Gagal memuat program:", error);

        container.innerHTML = `
            <p class="text-xs text-red-500">
                Gagal memuat daftar program.
            </p>
        `;
    }
}

export async function initAdminTambahMentor(onSuccess, mentor = null) {
    const formTambahMentor = document.getElementById("formTambahMentor");
    const btnKembali = document.getElementById("btnKembaliMentor");
    const btnBatal = document.getElementById("btnBatalMentor");

    const judulForm = document.getElementById("judulFormMentor");
    const bagianPassword = document.getElementById("bagianPasswordMentor");
    const passwordInput = document.getElementById("passwordMentor");
    const confirmPasswordInput = document.getElementById("confirmPasswordMentor");
    const btnSimpan = document.getElementById("btnSimpanMentor");

    // Mengatur tampilan berdasarkan mode tambah atau edit
    if (mentor) {
        judulForm.textContent = "Edit Data Guru / Mentor";
        btnSimpan.textContent = "Simpan Perubahan";

        bagianPassword.classList.add("hidden");
        passwordInput.required = false;
        confirmPasswordInput.required = false;

        // Mengisi data mentor
        document.getElementById("namaMentor").value = mentor.nama;
        document.getElementById("nipMentor").value = mentor.nip;
        document.getElementById("kontakMentor").value = mentor.no_hp || "";
        document.getElementById("emailMentor").value = mentor.email;
        document.getElementById("usernameMentor").value = mentor.username;

        const status = mentor.status_akun === "aktif" ? "Aktif" : "Non-Aktif";

        const statusInput = document.querySelector(
            `input[name="statusMentor"][value="${status}"]`
        );

        if (statusInput) statusInput.checked = true;

    } else {
        judulForm.textContent = "Tambah Data Guru / Mentor";
        btnSimpan.textContent = "Simpan Data Guru / Mentor";

        bagianPassword.classList.remove("hidden");
        passwordInput.required = true;
        confirmPasswordInput.required = true;
    }

    // Memuat daftar program
    await loadProgramMentor(
        mentor ? mentor.program_ids.map(Number) : []
    );

    const handleKembali = () => {
        if (typeof onSuccess === "function") onSuccess();
    };

    if (btnKembali) btnKembali.addEventListener("click", handleKembali);
    if (btnBatal) btnBatal.addEventListener("click", handleKembali);

    if (formTambahMentor) {
        formTambahMentor.addEventListener("submit", async (e) => {
            e.preventDefault();

            const password = passwordInput.value;
            const confirmPassword = confirmPasswordInput.value;

            // Validasi password hanya untuk mode tambah
            if (!mentor) {
                if (password !== confirmPassword) {
                    alert("Kata sandi dan konfirmasi kata sandi tidak cocok.");
                    return;
                }

                if (password.length < 8) {
                    alert("Kata sandi minimal harus 8 karakter.");
                    return;
                }
            }

            const nama = document.getElementById("namaMentor").value;
            const nip = document.getElementById("nipMentor").value;
            const no_hp = document.getElementById("kontakMentor").value;
            const email = document.getElementById("emailMentor").value;
            const username = document.getElementById("usernameMentor").value;

            const programDipilih = document.querySelectorAll(
                'input[name="programMentor"]:checked'
            );

            const programIds = Array.from(programDipilih).map(
                input => Number(input.value)
            );

            if (programIds.length === 0) {
                alert("Pilih minimal satu program untuk mentor.");
                return;
            }

            const statusInput = document.querySelector(
                'input[name="statusMentor"]:checked'
            );

            if (!statusInput) {
                alert("Pilih status akun mentor.");
                return;
            }

            const dataMentor = {
                nama,
                nip,
                no_hp,
                email,
                username,
                status: statusInput.value.toLowerCase(),
                program_ids: programIds
            };

            // ID dan password disesuaikan dengan mode form
            if (mentor) {
                dataMentor.id = mentor.id;
            } else {
                dataMentor.password = password;
            }

            // Memilih API tambah atau edit
            const url = mentor
                ? "http://localhost:8000/api_edit_mentor.php"
                : "http://localhost:8000/api_tambah_mentor.php";

            try {
                const response = await fetch(url, {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify(dataMentor)
                });

                const result = await response.json();

                if (!result.success) {
                    alert(result.message);
                    return;
                }

                alert(result.message);

                if (typeof onSuccess === "function") {
                    onSuccess();
                }

            } catch (error) {
                console.error("Gagal menyimpan data mentor:", error);
                alert("Terjadi kesalahan saat menyimpan data mentor.");
            }
        });
    }
}