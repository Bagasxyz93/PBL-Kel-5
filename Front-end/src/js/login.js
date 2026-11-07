const loginForm = document.getElementById("loginForm");
const identityInput = document.getElementById("identity");
const passwordInput = document.getElementById("password");
const togglePassword = document.getElementById("togglePassword");
const eyeIcon = document.getElementById("eyeIcon");
const formMessage = document.getElementById("formMessage");
const forgotPassword = document.getElementById("forgotPassword");

// Tujuan halaman berdasarkan role pengguna.
const rolePages = {
    admin: "/pages/Admin/Dashboard.html",
    mentor: "/pages/Mentor/Dashboard.html",
    peserta: "/pages/Siswa/Dashboard.html",
};

// Menampilkan pesan pada form
function showMessage(message, type = "error") {
    const styles = {
        error: [
            "border-red-200",
            "bg-red-50",
            "text-red-700",
        ],
        info: [
            "border-blue-200",
            "bg-blue-50",
            "text-blue-700",
        ],
    };

    formMessage.classList.remove(
        "hidden",
        "border-red-200",
        "bg-red-50",
        "text-red-700",
        "border-blue-200",
        "bg-blue-50",
        "text-blue-700"
    );

    formMessage.classList.add(...styles[type]);
    formMessage.textContent = message;
}

// Menyembunyikan pesan
function hideMessage() {
    formMessage.classList.add("hidden");
}

// Fitur tampil/sembunyikan password
togglePassword.addEventListener("click", () => {
    const show = passwordInput.type === "password";

    passwordInput.type = show ? "text" : "password";

    togglePassword.setAttribute(
        "aria-label",
        show ? "Sembunyikan password" : "Tampilkan password"
    );

    togglePassword.setAttribute("aria-pressed", String(show));

    eyeIcon.innerHTML = show
        ? `
            <path d="M3 3l18 18"/>
            <path d="M10.6 10.6a2 2 0 0 0 2.8 2.8"/>
            <path d="M9.9 5.2A10.8 10.8 0 0 1 12 5c6.4 0 10 6 10 6a15 15 0 0 1-3.2 4.1"/>
            <path d="M6.2 6.2C3.5 8 2 11 2 11s3.6 7 10 7a10 10 0 0 0 4-.8"/>
        `
        : `
            <path d="M2 12s3.6-6 10-6 10 6 10 6-3.6 6-10 6S2 12 2 12Z"/>
            <circle cx="12" cy="12" r="2.5"/>
        `;
});

// Proses login (DIBUAT SEMENTARA UNTUK FRONT-END TANPA BACKEND)
loginForm.addEventListener("submit", async (event) => {
    event.preventDefault();
    hideMessage();

    const identity = identityInput.value.trim();
    const password = passwordInput.value;

    if (!identity || !password) {
        showMessage("Username/NISN dan password wajib diisi.");
        return;
    }

    const submitButton = loginForm.querySelector(
        'button[type="submit"]'
    );

    if (submitButton) {
        submitButton.disabled = true;
    }

    // [UNTUK SEMENTARA] Bypass fetch PHP, gunakan simulasi hardcode role agar teman bisa testing UI
    try {
        // Simulasi jeda loading singkat (biar terasa seperti request asli)
        await new Promise(resolve => setTimeout(resolve, 500));

        let role = "";
        let mockUser = {};

        // Aturan ketik manual untuk masuk ke masing-masing dashboard
        if (identity === "admin" && password === "admin") {
            role = "admin";
            mockUser = { id: 1, role: "admin", nama: "Administrator" };
        } else if (identity === "mentor" && password === "mentor") {
            role = "mentor";
            mockUser = { id: 2, role: "mentor", nama: "Mentor Pengampu" };
        } else if (identity === "siswa" && password === "siswa") {
            role = "peserta";
            mockUser = { id: 3, role: "peserta", nama: "Siswa Peserta" };
        } else {
            // Jika salah, tampilkan info akun demo yang bisa dipakai
            showMessage("Akun demo salah! Gunakan:\n- admin / admin\n- mentor / mentor\n- siswa / siswa", "error");
            if (submitButton) submitButton.disabled = false;
            return;
        }

        // Simpan sesi tiruan ke localStorage
        localStorage.setItem("userRole", role);
        localStorage.setItem("userName", mockUser.nama);
        localStorage.setItem("userId", mockUser.id);

        // Arahkan pengguna sesuai role tujuan
        window.location.href = rolePages[role];

    } catch (error) {
        console.error("Kesalahan simulasi login:", error);
        showMessage("Terjadi kesalahan sistem frontend.");
    } finally {
        if (submitButton) {
            submitButton.disabled = false;
        }
    }

    /* 
    =================================================================
    [KODE ASLI PHP BACKEND - JANGAN DIHAPUS, NANTI DIAKTIFKAN KEMBALI]
    =================================================================
    try {
        const response = await fetch("http://localhost/PBL-Semester-3/Back-end/login_process.php", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ identity: identity, password: password }),
        });

        const result = await response.json();

        if (!result.success) {
            showMessage(result.message || "Username atau password salah.");
            return;
        }

        const user = result.user;
        const role = user.role?.toLowerCase();

        if (!rolePages[role]) {
            showMessage("Role akun tidak valid. Hubungi administrator.");
            return;
        }

        localStorage.setItem("userRole", role);
        localStorage.setItem("userName", user.nama);
        localStorage.setItem("userId", user.id);

        window.location.href = rolePages[role];

    } catch (error) {
        console.error("Kesalahan login:", error);
        showMessage("Terjadi kesalahan saat menghubungi server backend. Coba lagi.");
    } finally {
        if (submitButton) {
            submitButton.disabled = false;
        }
    }
    */
});

// Fitur lupa password sementara
forgotPassword.addEventListener("click", async (event) => {
    event.preventDefault();
    showMessage(
        "Silakan hubungi administrator untuk mereset password.",
        "info"
    );
});

// Hilangkan pesan saat input berubah
identityInput.addEventListener("input", hideMessage);
passwordInput.addEventListener("input", hideMessage);