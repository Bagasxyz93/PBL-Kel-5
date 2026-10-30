import { supabase } from "../supabase.js";

document.addEventListener("DOMContentLoaded", () => {
    // Tombol keluar bisa berada di header universal atau di dalam halaman
    const logoutBtn = document.getElementById("logoutBtn");

    if (!logoutBtn) return;

    logoutBtn.addEventListener("click", async () => {
        const konfirmasi = confirm("Apakah Anda yakin ingin keluar?");

        if (!konfirmasi) return;

        try {
            // Hapus seluruh data sesi dari localStorage yang kita gunakan saat login RPC
            localStorage.removeItem("userRole");
            localStorage.removeItem("userName");
            localStorage.removeItem("userId");

            // Jika ada sesi auth bawaan supabase yang aktif, sign out juga secara aman
            await supabase.auth.signOut().catch(() => {});

            // Arahkan kembali ke halaman login utama (root)
            window.location.replace("/");
        } catch (error) {
            console.error("Gagal logout:", error);
            alert("Gagal keluar. Silakan coba lagi.");
        }
    });
});