const loginForm = document.getElementById("loginForm");
const identityInput = document.getElementById("identity");
const passwordInput = document.getElementById("password");
const togglePassword = document.getElementById("togglePassword");
const eyeIcon = document.getElementById("eyeIcon");
const formMessage = document.getElementById("formMessage");
const forgotPassword = document.getElementById("forgotPassword");

// Hubungkan form login ke backend PHP
loginForm.action = "http://localhost:8000/auth/login_process.php";
loginForm.method = "POST";

identityInput.name = "username";
passwordInput.name = "password";

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

// Menampilkan pesan kesalahan login dari backend
const params = new URLSearchParams(window.location.search);
const error = params.get("error");

if (error === "invalid") {
    showMessage("Username atau password tidak sesuai.");
} else if (error === "empty") {
    showMessage("Username dan password wajib diisi.");
}

// Membersihkan parameter error dari URL
if (error) {
    window.history.replaceState({}, document.title, window.location.pathname);
}