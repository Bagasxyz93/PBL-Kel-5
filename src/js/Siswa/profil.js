export function initProfil() {
const nama = document.getElementById("profil-nama");
const email = document.getElementById("profil-email");
const telepon = document.getElementById("profil-telepon");

const btnEdit = document.getElementById("btn-edit-profil");
const btnTutup = document.getElementById("btn-tutup-modal");
const btnBatal = document.getElementById("btn-batal-edit");

const modal = document.getElementById("modal-edit-profil");
const form = document.getElementById("form-edit-profil");

const inputNama = document.getElementById("edit-nama");
const inputEmail = document.getElementById("edit-email");
const inputTelepon = document.getElementById("edit-telepon");

const toast = document.getElementById("profil-toast");
const btnJadwal = document.getElementById("btn-lihat-jadwal");
const daftarJadwal = document.getElementById("daftar-jadwal");
const jadwalKosong = document.getElementById("jadwal-kosong");

if (
    !nama ||
    !email ||
    !telepon ||
    !btnEdit ||
    !modal ||
    !form
) {
    return;
}

// Data awal halaman profil
const dataAwal = {
    nama: nama.textContent.trim(),
    email: email.textContent.trim(),
    telepon: telepon.textContent.trim()
};

const STORAGE_KEY = "siin_profil_siswa";

// Membaca data profil dari localStorage
function bacaProfil() {
    try {
        const dataTersimpan = localStorage.getItem(STORAGE_KEY);

        if (dataTersimpan) {
            return {
                ...dataAwal,
                ...JSON.parse(dataTersimpan)
            };
        }
    } catch (error) {
        console.error("Gagal membaca data profil:", error);
    }

    return { ...dataAwal };
}

let dataProfil = bacaProfil();

// Menampilkan data profil
function tampilkanProfil() {
    nama.textContent = dataProfil.nama;
    email.textContent = dataProfil.email;
    telepon.textContent = dataProfil.telepon;
}

// Membuka modal edit
function bukaModal() {
    inputNama.value = dataProfil.nama;
    inputEmail.value = dataProfil.email;
    inputTelepon.value = dataProfil.telepon;

    modal.classList.remove("hidden");
    modal.classList.add("flex");

    inputNama.focus();
}

// Menutup modal edit
function tutupModal() {
    modal.classList.add("hidden");
    modal.classList.remove("flex");
}

// Notifikasi sederhana
let toastTimer;

function tampilkanToast(pesan) {
    if (!toast) return;

    toast.textContent = pesan;
    toast.classList.remove("hidden");

    clearTimeout(toastTimer);

    toastTimer = setTimeout(() => {
        toast.classList.add("hidden");
    }, 2500);
}

// Simpan perubahan profil
function simpanProfil(event) {
    event.preventDefault();

    const namaBaru = inputNama.value.trim();
    const emailBaru = inputEmail.value.trim();
    const teleponBaru = inputTelepon.value.trim();

    if (!namaBaru || !emailBaru) {
        tampilkanToast("Nama dan email wajib diisi.");
        return;
    }

    dataProfil = {
        nama: namaBaru,
        email: emailBaru,
        telepon: teleponBaru || "-"
    };

    try {
        localStorage.setItem(
            STORAGE_KEY,
            JSON.stringify(dataProfil)
        );
    } catch (error) {
        console.error("Gagal menyimpan data profil:", error);
        tampilkanToast("Data tidak dapat disimpan di browser.");
        return;
    }

    tampilkanProfil();
    tutupModal();
    tampilkanToast("Profil berhasil diperbarui.");
}

// Event tombol edit dan modal
btnEdit.addEventListener("click", bukaModal);

btnTutup?.addEventListener("click", tutupModal);
btnBatal?.addEventListener("click", tutupModal);

form.addEventListener("submit", simpanProfil);

// Tutup modal ketika area luar modal diklik
modal.addEventListener("click", (event) => {
    if (event.target === modal) {
        tutupModal();
    }
});

// Tutup modal dengan tombol Escape
document.addEventListener("keydown", (event) => {
    if (event.key === "Escape" && !modal.classList.contains("hidden")) {
        tutupModal();
    }
});

// Tampilkan seluruh jadwal atau ringkasannya
let semuaJadwalDitampilkan = false;

btnJadwal?.addEventListener("click", () => {
    if (!daftarJadwal || !jadwalKosong) return;

    const jadwal = daftarJadwal.children;

    if (jadwal.length === 0) {
        jadwalKosong.classList.remove("hidden");
        tampilkanToast("Belum ada jadwal yang tersedia.");
        return;
    }

    semuaJadwalDitampilkan = !semuaJadwalDitampilkan;

    Array.from(jadwal).forEach((item, index) => {
        if (index >= 2) {
            item.classList.toggle("hidden", !semuaJadwalDitampilkan);
        }
    });

    btnJadwal.textContent = semuaJadwalDitampilkan
        ? "Tampilkan Lebih Sedikit"
        : "Lihat Semua";
});

// Terapkan data yang tersimpan
tampilkanProfil();

// Awalnya tampilkan dua jadwal saja
if (daftarJadwal) {
    Array.from(daftarJadwal.children).forEach((item, index) => {
        if (index >= 2) {
            item.classList.add("hidden");
        }
    });
}

}