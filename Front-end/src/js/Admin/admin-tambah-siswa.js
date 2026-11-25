import { API_BASE_URL } from "../api-config.js";


function getAuthHeaders() {
    const token = sessionStorage.getItem("authToken");

    if (!token) {
        throw new Error("Token login tidak ditemukan. Silakan login kembali.");
    }

    return {
        Authorization: `Bearer ${token}`
    };
}

// ==================================================
// FORM TAMBAH DAN EDIT SISWA
// ==================================================

export async function renderTambahSiswaView(
    siswaEdit = null,
    onKembali = () => {}
) {
    const mainContainer = document.getElementById("main-content-area");

    if (!mainContainer) return;

    mainContainer.innerHTML = `
        <div class="space-y-6">
            <div class="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                <div>
                    <div class="flex items-center gap-2 text-xs font-semibold text-slate-400 tracking-wider mb-1 uppercase">
                        <span>Kelola Pengguna</span>
                        <span>/</span>
                        <span>Siswa</span>
                        <span>/</span>
                        <span class="text-indigo-600">Tambah Siswa Baru</span>
                    </div>
                    <div class="flex items-center gap-3">
                        <h1 class="text-2xl font-extrabold text-slate-900 tracking-tight">Tambah Siswa Baru</h1>
                        <span class="bg-indigo-50 text-indigo-600 px-3 py-1 rounded-full text-xs font-bold border border-indigo-100">Registrasi TA 2024/2025</span>
                    </div>
                    <p class="text-xs text-slate-500 mt-0.5">Lengkapi data registrasi siswa binaan untuk program kelas inkubasi teknologi & kewirausahaan.</p>
                </div>

                <div>
                    <button id="btnKembaliSiswa" class="bg-white hover:bg-slate-50 border border-slate-200 text-slate-700 px-4 py-2.5 rounded-xl text-xs font-semibold shadow-sm transition flex items-center gap-1.5">
                        <span>&larr; Kembali ke Daftar</span>
                    </button>
                </div>
            </div>

            <div class="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start pb-12">
                <form id="formTambahSiswa" class="lg:col-span-2 space-y-6">

                    <div class="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm space-y-5">
                        <div class="flex items-center justify-between pb-4 border-b border-slate-100">
                            <div class="flex items-center gap-3">
                                <div class="w-10 h-10 rounded-xl bg-indigo-50 flex items-center justify-center text-indigo-600">
                                    <svg class="w-5 h-5" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>
                                </div>
                                <div>
                                    <h3 class="font-bold text-slate-800 text-sm">1. Identitas Siswa</h3>
                                    <p class="text-[11px] text-slate-400">Informasi biodata formal sesuai kartu pelajar dan database sekolah</p>
                                </div>
                            </div>
                            <span class="bg-slate-100 text-slate-600 px-2.5 py-1 rounded-md text-[10px] font-bold">Wajib Diisi</span>
                        </div>

                        <div class="space-y-4">
                            <div>
                                <label class="block text-xs font-bold text-slate-700 mb-1">Nama Lengkap Siswa <span class="text-red-500">*</span></label>
                                <input type="text" id="namaSiswa" required placeholder="Cth. Ahmad Fauzi Pratama" class="w-full rounded-xl border border-slate-200 bg-slate-50/50 py-2.5 px-4 text-xs font-medium text-slate-700 placeholder:text-slate-400 focus:border-indigo-500 focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500/10 transition">
                            </div>

                            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <label class="block text-xs font-bold text-slate-700 mb-1">NIS (Nomor Induk Siswa) <span class="text-red-500">*</span></label>
                                    <input type="text" id="nisSiswa" required placeholder="Cth. 1234567801" class="w-full rounded-xl border border-slate-200 bg-slate-50/50 py-2.5 px-4 text-xs font-medium text-slate-700 placeholder:text-slate-400 focus:border-indigo-500 focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500/10 transition">
                                </div>

                                <div>
                                    <label class="block text-xs font-bold text-slate-700 mb-1">Pilihan Kelas Inkubasi <span class="text-red-500">*</span></label>
                                    <select id="programSiswa" required class="w-full rounded-xl border border-slate-200 bg-slate-50/50 py-2.5 px-4 text-xs font-semibold text-slate-700 focus:border-indigo-500 focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500/10 transition">
                                        <option value="">Memuat program...</option>
                                    </select>
                                </div>
                            </div>

                            <div>
                                <label class="block text-xs font-bold text-slate-700 mb-1.5">Jenis Kelamin <span class="text-red-500">*</span></label>
                                <div class="grid grid-cols-2 gap-4">
                                    <label class="flex items-center gap-2.5 p-3 rounded-xl border border-slate-200 bg-slate-50/50 cursor-pointer hover:bg-slate-50 transition">
                                        <input type="radio" name="gender" value="Laki-laki" checked class="text-indigo-600 focus:ring-indigo-500">
                                        <span class="text-xs font-semibold text-slate-700">♂ Laki-laki</span>
                                    </label>
                                    <label class="flex items-center gap-2.5 p-3 rounded-xl border border-slate-200 bg-slate-50/50 cursor-pointer hover:bg-slate-50 transition">
                                        <input type="radio" name="gender" value="Perempuan" class="text-indigo-600 focus:ring-indigo-500">
                                        <span class="text-xs font-semibold text-slate-700">♀ Perempuan</span>
                                    </label>
                                </div>
                            </div>

                            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <label class="block text-xs font-bold text-slate-700 mb-1">Nomor WhatsApp / Kontak <span class="text-red-500">*</span></label>
                                    <input type="text" id="kontakSiswa" required placeholder="+62 812-3456-7890" class="w-full rounded-xl border border-slate-200 bg-slate-50/50 py-2.5 px-4 text-xs font-medium text-slate-700 placeholder:text-slate-400 focus:border-indigo-500 focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500/10 transition">
                                </div>

                                <div>
                                    <label class="block text-xs font-bold text-slate-700 mb-1">Email Siswa <span class="text-red-500">*</span></label>
                                    <input type="email" id="emailSiswa" required placeholder="ahmad.fauzi@inkubasi.sch.id" class="w-full rounded-xl border border-slate-200 bg-slate-50/50 py-2.5 px-4 text-xs font-medium text-slate-700 placeholder:text-slate-400 focus:border-indigo-500 focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500/10 transition">
                                </div>
                            </div>
                        </div>
                    </div>

                    <div class="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm space-y-5">
                        <div class="flex items-center justify-between pb-4 border-b border-slate-100">
                            <div class="flex items-center gap-3">
                                <div class="w-10 h-10 rounded-xl bg-purple-50 flex items-center justify-center text-purple-600">
                                    <svg class="w-5 h-5" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>
                                </div>
                                <div>
                                    <h3 class="font-bold text-slate-800 text-sm">2. Kredensial Akun & Akses Portal</h3>
                                    <p class="text-[11px] text-slate-400">Kredensial login ke mobile app siswa dan dashboard web inkubasi</p>
                                </div>
                            </div>
                            <span class="bg-purple-50 text-purple-600 px-2.5 py-1 rounded-md text-[10px] font-bold">Otentikasi</span>
                        </div>

                        <div class="space-y-4">
                            <div>
                                <label class="block text-xs font-bold text-slate-700 mb-1">Username Siswa <span class="text-red-500">*</span></label>
                                <input type="text" id="usernameSiswa" required placeholder="ahmadfauzi" class="w-full rounded-xl border border-slate-200 bg-slate-50/50 py-2.5 px-4 text-xs font-medium text-slate-700 placeholder:text-slate-400 focus:border-indigo-500 focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500/10 transition">
                            </div>

                            <div class="grid grid-cols-1 md:grid-cols-2 gap-4" id="bagianPasswordSiswa">
                                <div>
                                    <label class="block text-xs font-bold text-slate-700 mb-1">Kata Sandi Default <span class="text-red-500">*</span></label>
                                    <input type="password" id="passwordSiswa" required placeholder="Minimal 8 karakter" class="w-full rounded-xl border border-slate-200 bg-slate-50/50 py-2.5 px-4 text-xs font-medium text-slate-700 placeholder:text-slate-400 focus:border-indigo-500 focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500/10 transition">
                                </div>

                                <div>
                                    <label class="block text-xs font-bold text-slate-700 mb-1">Konfirmasi Kata Sandi <span class="text-red-500">*</span></label>
                                    <input type="password" id="confirmPasswordSiswa" required placeholder="Ketik ulang kata sandi" class="w-full rounded-xl border border-slate-200 bg-slate-50/50 py-2.5 px-4 text-xs font-medium text-slate-700 placeholder:text-slate-400 focus:border-indigo-500 focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500/10 transition">
                                </div>
                            </div>

                            <div>
                                <label class="block text-xs font-bold text-slate-700 mb-1">Penetapan Mentor Pembimbing <span class="text-red-500">*</span></label>
                                <select id="mentorPembimbing" class="w-full rounded-xl border border-slate-200 bg-slate-50/50 py-2.5 px-4 text-xs font-semibold text-slate-700 focus:border-indigo-500 focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500/10 transition">
                                    <option value="">Pilih program terlebih dahulu</option>
                                </select>
                            </div>
                        </div>
                    </div>
                </form>

                <div class="space-y-6">
                    <div class="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm space-y-4">
                        <div class="flex items-center gap-3 pb-3 border-b border-slate-100">
                            <div class="w-9 h-9 rounded-xl bg-blue-50 flex items-center justify-center text-blue-600">
                                <svg class="w-5 h-5" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
                            </div>
                            <div>
                                <h4 class="font-bold text-slate-800 text-xs">Status Registrasi</h4>
                                <p class="text-[10px] text-slate-400">Otoritas hak akses akun baru</p>
                            </div>
                        </div>

                        <div class="space-y-3">
                            <label class="flex items-start gap-3 p-3.5 rounded-xl border border-emerald-200 bg-emerald-50/30 cursor-pointer transition">
                                <input type="radio" name="statusRegistrasi" value="Aktif" checked class="mt-0.5 text-emerald-600 focus:ring-emerald-500">
                                <div>
                                    <div class="flex items-center gap-2">
                                        <span class="text-xs font-bold text-slate-800">Aktif Langsung</span>
                                        <span class="bg-emerald-100 text-emerald-700 px-2 py-0.5 rounded text-[9px] font-bold">Aktif</span>
                                    </div>
                                    <p class="text-[11px] text-slate-500 mt-0.5">Siswa dapat langsung login dan mengakses kurikulum inkubasi.</p>
                                </div>
                            </label>

                            <label class="flex items-start gap-3 p-3.5 rounded-xl border border-slate-200 bg-slate-50/50 cursor-pointer transition">
                                <input type="radio" name="statusRegistrasi" value="Draft" class="mt-0.5 text-indigo-600 focus:ring-indigo-500">
                                <div>
                                    <div class="flex items-center gap-2">
                                        <span class="text-xs font-bold text-slate-800">Non-Aktif / Draft</span>
                                        <span class="bg-slate-200 text-slate-600 px-2 py-0.5 rounded text-[9px] font-bold">Pending</span>
                                    </div>
                                    <p class="text-[11px] text-slate-500 mt-0.5">Data tersimpan namun akses aplikasi ditangguhkan sementara.</p>
                                </div>
                            </label>
                        </div>
                    </div>

                    <div class="space-y-3">
                        <button type="submit" form="formTambahSiswa" class="w-full py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-semibold shadow-md shadow-blue-600/20 transition flex items-center justify-center gap-2" style="background: linear-gradient(135deg, #2563eb 0%, #4f46e5 100%) !important;">
                            Simpan Data Siswa
                        </button>

                        <button id="btnBatalSiswa" type="button" class="w-full py-3 bg-white hover:bg-slate-50 border border-slate-200 text-slate-700 rounded-xl text-xs font-semibold shadow-sm transition flex items-center justify-center">
                            Batal & Kembali
                        </button>
                    </div>
                </div>
            </div>
        </div>
    `;

    // Memuat pilihan program
    async function loadProgramSiswa() {
        const selectProgram = document.getElementById("programSiswa");

        try {
            const response = await fetch(
                `${API_BASE_URL}/api/admin/api_program.php`,
                {
                    headers: getAuthHeaders()
                }
            );

            const result = await response.json();

            if (!result.success) {
                throw new Error(result.message);
            }

            selectProgram.innerHTML = `
                <option value="">Pilih Program Inkubasi</option>
                ${result.data.map(program => `
                    <option value="${program.id}">
                        ${program.nama_program}
                    </option>
                `).join("")}
            `;

        } catch (error) {
            console.error("Gagal memuat program:", error);
            selectProgram.innerHTML = `
                <option value="">Gagal memuat program</option>
            `;
        }
    }

    // Memuat mentor berdasarkan program
    async function loadMentorSiswa(programId) {
        const selectMentor = document.getElementById("mentorPembimbing");

        selectMentor.innerHTML = `
            <option value="">Memuat mentor...</option>
        `;

        if (!programId) {
            selectMentor.innerHTML = `
                <option value="">Pilih program terlebih dahulu</option>
            `;
            return;
        }

        try {
            const response = await fetch(
                `${API_BASE_URL}/api/admin/api_mentor_program.php?program_id=${programId}`,
                {
                    headers: getAuthHeaders()
                }
            );

            const result = await response.json();

            if (!result.success) {
                throw new Error(result.message);
            }

            if (result.data.length === 0) {
                selectMentor.innerHTML = `
                    <option value="">Belum ada mentor untuk program ini</option>
                `;
                return;
            }

            selectMentor.innerHTML = `
                <option value="">Pilih Mentor Pendamping</option>
                ${result.data.map(mentor => `
                    <option value="${mentor.id}">
                        ${mentor.nama}
                    </option>
                `).join("")}
            `;

        } catch (error) {
            console.error("Gagal memuat mentor:", error);

            selectMentor.innerHTML = `
                <option value="">Gagal memuat mentor</option>
            `;
        }
    }

    await loadProgramSiswa();

    // Mengisi data jika mode edit
    if (siswaEdit) {
        document.getElementById("namaSiswa").value = siswaEdit.nama;
        document.getElementById("nisSiswa").value = siswaEdit.nisn;
        document.getElementById("kontakSiswa").value = siswaEdit.no_hp;
        document.getElementById("emailSiswa").value = siswaEdit.email;
        document.getElementById("usernameSiswa").value = siswaEdit.username;

        const genderInput = document.querySelector(
            `input[name="gender"][value="${siswaEdit.jenis_kelamin}"]`
        );

        if (genderInput) {
            genderInput.checked = true;
        }

        document.getElementById("programSiswa").value = siswaEdit.program_id;

        const status = siswaEdit.status_akun === "aktif"
            ? "Aktif"
            : "Draft";

        const statusInput = document.querySelector(
            `input[name="statusRegistrasi"][value="${status}"]`
        );

        if (statusInput) {
            statusInput.checked = true;
        }

        document.getElementById("passwordSiswa").required = false;
        document.getElementById("confirmPasswordSiswa").required = false;

        document.getElementById("bagianPasswordSiswa").style.display = "none";

        mainContainer.querySelector("h1").textContent = "Edit Data Siswa";

        mainContainer.querySelector(
            'button[form="formTambahSiswa"]'
        ).textContent = "Simpan Perubahan";

        await loadMentorSiswa(siswaEdit.program_id);
    }

    document.getElementById("programSiswa").addEventListener("change", function () {
        loadMentorSiswa(this.value);
    });

    const handleKembali = () => {
        onKembali();
    };

    document.getElementById("btnKembaliSiswa").addEventListener(
        "click",
        handleKembali
    );

    document.getElementById("btnBatalSiswa").addEventListener(
        "click",
        handleKembali
    );

    // Submit form tambah dan edit
    document.getElementById("formTambahSiswa").addEventListener("submit", async (e) => {
        e.preventDefault();

        const password = document.getElementById("passwordSiswa").value;
        const confirmPassword = document.getElementById("confirmPasswordSiswa").value;

        if (!siswaEdit && password.length < 8) {
            alert("Kata sandi minimal harus 8 karakter.");
            return;
        }

        if (password && password.length < 8) {
            alert("Kata sandi minimal harus 8 karakter.");
            return;
        }

        if (password && password !== confirmPassword) {
            alert("Kata sandi dan konfirmasi kata sandi tidak cocok.");
            return;
        }

        const gender = document.querySelector('input[name="gender"]:checked');

        const statusRegistrasi = document.querySelector(
            'input[name="statusRegistrasi"]:checked'
        );

        if (!gender || !statusRegistrasi) {
            alert("Lengkapi jenis kelamin dan status siswa.");
            return;
        }

        const dataSiswa = {
            nama: document.getElementById("namaSiswa").value,
            nisn: document.getElementById("nisSiswa").value,
            no_hp: document.getElementById("kontakSiswa").value,
            email: document.getElementById("emailSiswa").value,
            username: document.getElementById("usernameSiswa").value,
            jenis_kelamin: gender.value,
            program_id: document.getElementById("programSiswa").value,
            status: statusRegistrasi.value === "Aktif"
                ? "aktif"
                : "non-aktif"
        };

        if (siswaEdit) {
            dataSiswa.id = siswaEdit.id;
            dataSiswa.peserta_program_id = siswaEdit.peserta_program_id;
        }

        if (password) {
            dataSiswa.password = password;
        }

        const url = siswaEdit
            ? `${API_BASE_URL}/api/admin/api_edit_siswa.php`
            : `${API_BASE_URL}/api/admin/api_tambah_siswa.php`;

        try {
            const response = await fetch(url, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    ...getAuthHeaders()
                },
                body: JSON.stringify(dataSiswa)
            });

            const result = await response.json();

            if (!result.success) {
                throw new Error(result.message);
            }

            alert(result.message);
            onKembali();

        } catch (error) {
            console.error("Gagal menyimpan data siswa:", error);
            alert(error.message);
        }
    });
}

// ==================================================
// FORM EDIT SISWA
// ==================================================

export async function renderEditSiswaView(siswaId, onKembali) {
    try {
        const response = await fetch(
            `${API_BASE_URL}/api/admin/api_detail_siswa.php?id=${siswaId}`,
            {
                headers: getAuthHeaders()
            }
        );

        const result = await response.json();

        if (!result.success) {
            throw new Error(result.message);
        }

        await renderTambahSiswaView(result.data, onKembali);

    } catch (error) {
        console.error("Gagal mengambil detail siswa:", error);
        alert(error.message);
    }
}
