export function initAdminTambahProgram(onSuccess) {
    const formTambahProgram = document.getElementById("formTambahProgram");
    const btnKembali = document.getElementById("btnKembaliProgram");
    const btnBatal = document.getElementById("btnBatalProgram");
    const btnReset = document.getElementById("btnResetProgram");

    const handleKembali = () => {
        if (typeof onSuccess === "function") onSuccess();
    };

    if (btnKembali) btnKembali.addEventListener("click", handleKembali);
    if (btnBatal) btnBatal.addEventListener("click", handleKembali);

    if (btnReset && formTambahProgram) {
        btnReset.addEventListener("click", () => {
            formTambahProgram.reset();
        });
    }

    if (formTambahProgram) {
        formTambahProgram.addEventListener("submit", (e) => {
            e.preventDefault();

            const judul = document.getElementById("namaProgram").value;
            const sub = document.getElementById("deskripsiProgram").value;

            console.log("Program Baru Disimpan:", { judul, sub });

            alert(`Program "${judul}" berhasil ditambahkan!`);
            
            if (typeof onSuccess === "function") {
                onSuccess( { id: Date.now(), judul, sub, status: "Aktif" } );
            }
        });
    }
}