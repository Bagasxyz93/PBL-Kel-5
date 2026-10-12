const loginForm = document.getElementById("loginForm");
const identityInput = document.getElementById("identity");
const passwordInput = document.getElementById("password");
const togglePassword = document.getElementById("togglePassword");
const eyeIcon = document.getElementById("eyeIcon");
const formMessage = document.getElementById("formMessage");
const forgotPassword = document.getElementById("forgotPassword");

// Menampilkan pesan pada form
function showMessage(message, type = "error") {
    const styles = {
        error: ["border-red-200", "bg-red-50", "text-red-700"],
        info: ["border-blue-200", "bg-blue-50", "text-blue-700"],
    };

    formMessage.classList.remove(
        "hidden",
        "border-red-200", "bg-red-50", "text-red-700",
        "border-blue-200", "bg-blue-50", "text-blue-700"
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

// Login sementara tanpa validasi akun
loginForm.addEventListener("submit", (event) => {
    event.preventDefault();

    // Langsung masuk ke Dashboard Siswa
    window.location.href = "/pages/Siswa/Dashboard.html";
});

// Fitur lupa password sementara
forgotPassword.addEventListener("click", (event) => {
    event.preventDefault();

    showMessage(
        "Fitur lupa password akan tersedia setelah backend terintegrasi.",
        "info"
    );
});

// Hilangkan pesan saat input berubah
identityInput.addEventListener("input", hideMessage);
passwordInput.addEventListener("input", hideMessage);