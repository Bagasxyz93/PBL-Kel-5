/* =========================================================
   LOGIKA INTERAKTIF FORM TAMBAH MATERI
   ========================================================= */

export function initFormUnggahMateri() {
    console.log("Modul Form Tambah Materi berhasil dimuat.");

    const btnResetForm = document.getElementById("btn-reset-form");

    if (btnResetForm) {
        btnResetForm.addEventListener("click", () => {
            const formInputs = document.querySelectorAll("#view-form-materi input[type='text'], #view-form-materi textarea, #view-form-materi select");
            formInputs.forEach(input => {
                if (input.type === "text" || input.tagName === "TEXTAREA") {
                    input.value = "";
                } else if (input.tagName === "SELECT") {
                    input.selectedIndex = 0;
                }
            });
            alert("Formulir berhasil di-reset.");
        });
    }
}