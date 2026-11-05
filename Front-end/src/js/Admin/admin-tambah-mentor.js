export function initAdminTambahMentor(onSuccess) {
    const formTambahMentor = document.getElementById("formTambahMentor");
    const btnKembali = document.getElementById("btnKembaliMentor");
    const btnBatal = document.getElementById("btnBatalMentor");

    const handleKembali = () => {
        if (typeof onSuccess === "function") onSuccess();
    };

    if (btnKembali) btnKembali.addEventListener("click", handleKembali);
    if (btnBatal) btnBatal.addEventListener("click", handleKembali);

    if (formTambahMentor) {
        formTambahMentor.addEventListener("submit", (e) => {
            e.preventDefault();

            const password = document.getElementById("passwordMentor").value;
            const confirmPassword = document.getElementById("confirmPasswordMentor").value;

            if (password !== confirmPassword) {
                alert("Kata sandi dan konfirmasi kata sandi tidak cocok. Mohon periksa kembali.");
                return;
            }

            if (password.length < 8) {
                alert("Kata sandi minimal harus 8 karakter.");
                return;
            }

            const nama = document.getElementById("namaMentor").value;
            const nip = document.getElementById("nipMentor").value;
            const bidang = document.querySelector('input[name="bidangMentor"]:checked').value;
            const email = document.getElementById("emailMentor").value;
            const status = document.querySelector('input[name="statusMentor"]:checked').value;

            console.log("Data Mentor Baru Disimpan:", {
                nama, nip, bidang, email, status
            });

            alert(`Guru / Mentor ${nama} (NIP: ${nip}) berhasil ditambahkan ke bidang ${bidang}!`);
            
            if (typeof onSuccess === "function") {
                onSuccess();
            }
        });
    }
}