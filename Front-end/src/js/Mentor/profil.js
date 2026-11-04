/* =========================================================
LOGIKA HALAMAN PROFIL MENTOR
========================================================= */

export function initMentorProfil() {
    console.log("Modul Profil Mentor berhasil dimuat.");

    // Mengambil data dari localStorage jika ada, atau menggunakan data default sesuai Figma
    const savedName = localStorage.getItem("userName") || "Bapak Bagaskara";
    const savedEmail = localStorage.getItem("userEmail") || "bagaskara@gmail.com";
    const savedPhone = localStorage.getItem("userPhone") || "081123456789";

    const nameEl = document.getElementById("profile-name");
    const emailEl = document.getElementById("profile-email");
    const phoneEl = document.getElementById("profile-phone");
    const editBtn = document.getElementById("btn-edit-profil");

    if (nameEl) nameEl.textContent = savedName;
    if (emailEl) emailEl.textContent = savedEmail;
    if (phoneEl) phoneEl.textContent = savedPhone;

    // Simulasi interaksi tombol Edit Profil
    if (editBtn) {
        editBtn.addEventListener("click", () => {
            alert("Fitur edit profil mentor akan segera dibuka.");
        });
    }
}