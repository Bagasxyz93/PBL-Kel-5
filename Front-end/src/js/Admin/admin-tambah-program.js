import { API_BASE_URL } from "../api-config.js";


function getAuthHeaders() {
    const token = sessionStorage.getItem("authToken");

    if (!token) {
        throw new Error("Token login tidak ditemukan. Silakan login kembali.");
    }

    return {
        Authorization: `Bearer ${token}`
    };
}

export function initAdminTambahProgram(onSuccess, programEdit = null) {
    const formTambahProgram = document.getElementById("formTambahProgram");
    const btnKembali = document.getElementById("btnKembaliProgram");
    const btnBatal = document.getElementById("btnBatalProgram");
    const btnReset = document.getElementById("btnResetProgram");

    const inputNama = document.getElementById("namaProgram");
    const inputDeskripsi = document.getElementById("deskripsiProgram");

    if (!formTambahProgram || !inputNama || !inputDeskripsi) {
        console.error("Elemen form program tidak ditemukan.");
        return;
    }

    const tombolSubmit = formTambahProgram.querySelector(
        'button[type="submit"]'
    );

    // ==================================================
    // ISI DATA JIKA MODE EDIT
    // ==================================================

    if (programEdit) {
        inputNama.value = programEdit.nama_program;
        inputDeskripsi.value = programEdit.deskripsi || "";

        if (tombolSubmit) {
            tombolSubmit.textContent = "Simpan Perubahan";
        }
    }

    // ==================================================
    // KEMBALI KE TABEL PROGRAM
    // ==================================================

    const handleKembali = () => {
        if (typeof onSuccess === "function") {
            onSuccess();
        }
    };

    if (btnKembali) {
        btnKembali.addEventListener("click", handleKembali);
    }

    if (btnBatal) {
        btnBatal.addEventListener("click", handleKembali);
    }

    // ==================================================
    // RESET FORM
    // ==================================================

    if (btnReset) {
        btnReset.addEventListener("click", () => {
            formTambahProgram.reset();

            if (programEdit) {
                inputNama.value = programEdit.nama_program;
                inputDeskripsi.value = programEdit.deskripsi || "";
            }
        });
    }

    // ==================================================
    // SIMPAN DATA PROGRAM
    // ==================================================

    formTambahProgram.addEventListener("submit", async (e) => {
        e.preventDefault();

        const judul = inputNama.value.trim();
        const sub = inputDeskripsi.value.trim();

        if (!judul || !sub) {
            alert("Nama dan deskripsi program wajib diisi.");
            return;
        }

        try {
            const url = programEdit
                ? `${API_BASE_URL}/api/admin/api_edit_program.php`
                : `${API_BASE_URL}/api/admin/api_tambah_program.php`;

            const response = await fetch(url, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    ...getAuthHeaders()
                },
                body: JSON.stringify({
                    id: programEdit ? programEdit.id : null,
                    nama_program: judul,
                    deskripsi: sub
                })
            });

            const result = await response.json();

            if (!response.ok || !result.success) {
                throw new Error(
                    result.message || "Gagal menyimpan program."
                );
            }

            alert(result.message);

            if (typeof onSuccess === "function") {
                onSuccess();
            }

        } catch (error) {
            console.error("Gagal menyimpan program:", error);
            alert(error.message || "Terjadi kesalahan saat menyimpan program.");
        }
    });
}
