
export function initAdminTambahProgram(onSuccess, programEdit = null) {
    const formTambahProgram = document.getElementById("formTambahProgram");
    const btnKembali = document.getElementById("btnKembaliProgram");
    const btnBatal = document.getElementById("btnBatalProgram");
    const btnReset = document.getElementById("btnResetProgram");

    const inputNama = document.getElementById("namaProgram");
    const inputDeskripsi = document.getElementById("deskripsiProgram");

    const tombolSubmit = formTambahProgram.querySelector(
        'button[type="submit"]'
    );

    // Jika sedang edit, isi form dengan data program
    if (programEdit) {
        inputNama.value = programEdit.nama_program;
        inputDeskripsi.value = programEdit.deskripsi || "";
        tombolSubmit.textContent = "Simpan Perubahan";
    }

    const handleKembali = () => {
        if (typeof onSuccess === "function") onSuccess();
    };

    if (btnKembali) btnKembali.addEventListener("click", handleKembali);
    if (btnBatal) btnBatal.addEventListener("click", handleKembali);

    if (btnReset && formTambahProgram) {
        btnReset.addEventListener("click", () => {
            formTambahProgram.reset();

            if (programEdit) {
                inputNama.value = programEdit.nama_program;
                inputDeskripsi.value = programEdit.deskripsi || "";
            }
        });
    }

    if (formTambahProgram) {
        formTambahProgram.addEventListener("submit", async (e) => {
            e.preventDefault();

            const judul = inputNama.value.trim();
            const sub = inputDeskripsi.value.trim();

            try {
                const url = programEdit
                    ? "http://localhost:8000/api/admin/api_edit_program.php"
                    : "http://localhost:8000/api/admin/api_tambah_program.php";

                const response = await fetch(url, {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify({
                        id: programEdit ? programEdit.id : null,
                        nama_program: judul,
                        deskripsi: sub
                    })
                });

                const result = await response.json();

                if (!response.ok || !result.success) {
                    throw new Error(result.message || "Gagal menyimpan program.");
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
}
