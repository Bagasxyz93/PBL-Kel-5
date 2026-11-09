    // 1. Tampilan Form Tambah Siswa (Render dinamis via JS, mirip riwayat)
    async function renderTambahSiswaView(siswaEdit = null) {
        const mainContainer = document.getElementById("main-content-area");
        if (!mainContainer) return;

        mainContainer.innerHTML = `
            <div class="space-y-6">
                <!-- Breadcrumb & Judul Sesuai Figma -->
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

                <!-- Layout Utama 2 Kolom -->
                <div class="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start pb-12">
                    
                    <!-- Kiri: Form Input Data -->
                    <form id="formTambahSiswa" class="lg:col-span-2 space-y-6">
                        
                        <!-- Bagian 1: Identitas Siswa -->
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

                        <!-- Bagian 2: Kredensial Akun -->
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

                                <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
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

                    <!-- Kanan: Panel Status & Aksi -->
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

        // Memuat pilihan program dari database
        async function loadProgramSiswa() {
            const selectProgram = document.getElementById("programSiswa");
        
            try {
                const response = await fetch("http://localhost:8000/api_program.php");
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
        
        await loadProgramSiswa();

        // Memuat mentor berdasarkan program yang dipilih
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
                    `http://localhost:8000/api_mentor_program.php?program_id=${programId}`
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

        // Jika form digunakan untuk edit, isi data siswa
        if (siswaEdit) {
            document.getElementById("namaSiswa").value = siswaEdit.nama;
            document.getElementById("nisSiswa").value = siswaEdit.nisn;
            document.getElementById("kontakSiswa").value = siswaEdit.no_hp;
            document.getElementById("emailSiswa").value = siswaEdit.email;
            document.getElementById("usernameSiswa").value = siswaEdit.username;
        
            // Jenis kelamin
            document.querySelector(
                `input[name="gender"][value="${siswaEdit.jenis_kelamin}"]`
            ).checked = true;
        
            // Program
            document.getElementById("programSiswa").value = siswaEdit.program_id;
        
            // Status
            const status = siswaEdit.status_akun === "aktif" ? "Aktif" : "Draft";
        
            document.querySelector(
                `input[name="statusRegistrasi"][value="${status}"]`
            ).checked = true;
        
            // Password tidak wajib diisi saat edit
            document.getElementById("passwordSiswa").required = false;
            document.getElementById("confirmPasswordSiswa").required = false;
        
            // Sembunyikan bagian password
            document.getElementById("passwordSiswa").closest(".grid").style.display = "none";
        
            // Ubah judul dan tombol
            mainContainer.querySelector("h1").textContent = "Edit Data Siswa";
        
            mainContainer.querySelector(
                'button[form="formTambahSiswa"]'
            ).textContent = "Simpan Perubahan";
        
            // Muat mentor sesuai program
            await loadMentorSiswa(siswaEdit.program_id);
        }

        // Ketika program berubah, daftar mentor ikut berubah
        document.getElementById("programSiswa").addEventListener("change", function () {
            loadMentorSiswa(this.value);
        });

        // Event listener tombol kembali / batal
        const handleKembali = () => {
            initAdminSiswa(); // Kembali merender tampilan tabel utama
        };

        document.getElementById("btnKembaliSiswa").addEventListener("click", handleKembali);
        document.getElementById("btnBatalSiswa").addEventListener("click", handleKembali);

       // Event listener submit form tambah dan edit siswa
        document.getElementById("formTambahSiswa").addEventListener("submit", async (e) => {
            e.preventDefault();
        
            const password = document.getElementById("passwordSiswa").value;
            const confirmPassword = document.getElementById("confirmPasswordSiswa").value;
        
            // Password wajib minimal 8 karakter saat tambah
            if (!siswaEdit && password.length < 8) {
                alert("Kata sandi minimal harus 8 karakter.");
                return;
            }
        
            // Saat edit, password boleh dikosongkan
            if (password && password.length < 8) {
                alert("Kata sandi minimal harus 8 karakter.");
                return;
            }
        
            if (password && password !== confirmPassword) {
                alert("Kata sandi dan konfirmasi kata sandi tidak cocok.");
                return;
            }
        
            const dataSiswa = {
                nama: document.getElementById("namaSiswa").value,
                nisn: document.getElementById("nisSiswa").value,
                no_hp: document.getElementById("kontakSiswa").value,
                email: document.getElementById("emailSiswa").value,
                username: document.getElementById("usernameSiswa").value,
                jenis_kelamin: document.querySelector('input[name="gender"]:checked').value,
                program_id: document.getElementById("programSiswa").value,
                status: document.querySelector('input[name="statusRegistrasi"]:checked').value === "Aktif"
                    ? "aktif"
                    : "non-aktif"
            };
        
            // Jika sedang edit, sertakan ID siswa
            if (siswaEdit) {
                dataSiswa.id = siswaEdit.id;
                dataSiswa.peserta_program_id = siswaEdit.peserta_program_id;
            }
        
            // Password hanya dikirim jika diisi
            if (password) {
                dataSiswa.password = password;
            }
        
            // Tentukan API berdasarkan mode form
            const url = siswaEdit
                ? "http://localhost:8000/api_edit_siswa.php"
                : "http://localhost:8000/api_tambah_siswa.php";
        
            try {
                const response = await fetch(url, {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify(dataSiswa)
                });
            
                const result = await response.json();
            
                if (!result.success) {
                    throw new Error(result.message);
                }
            
                alert(siswaEdit
                    ? "Data siswa berhasil diperbarui!"
                    : "Data siswa berhasil ditambahkan!"
                );
            
                initAdminSiswa();
            
            } catch (error) {
                console.error("Gagal menyimpan data siswa:", error);
                alert(error.message);
            }
        });
    }

    // Tampilan Form Edit Siswa
    async function renderEditSiswaView(siswaId) {
        try {
            const response = await fetch(
                `http://localhost:8000/api_detail_siswa.php?id=${siswaId}`
            );

            const result = await response.json();

            if (!result.success) {
                throw new Error(result.message);
            }

            await renderTambahSiswaView(result.data);

        } catch (error) {
            console.error("Gagal mengambil detail siswa:", error);
            alert(error.message);
        }
    }

    // 2. Tampilan Utama: Tabel Daftar Siswa
    function initAdminSiswa() {
        const mainContainer = document.getElementById("main-content-area");
        if (!mainContainer) return;

        // Render ulang struktur HTML halaman utama tabel siswa ke dalam container
        mainContainer.innerHTML = `
            <div class="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                <div>
                    <div class="flex items-center gap-2 text-xs font-semibold text-slate-400 tracking-wider mb-1 uppercase">
                        <span>Kelola Pengguna</span>
                        <span>/</span>
                        <span class="text-indigo-600">Siswa</span>
                    </div>
                    <h1 class="text-2xl font-extrabold text-slate-900 tracking-tight">Data Siswa</h1>
                    <p class="text-xs text-slate-500 mt-0.5">Manajemen data      didik aktif program inkubasi kelas kewirausahaan dan kejuruan.</p>
                </div>
                
                <div class="flex items-center gap-3">
                    <div class="bg-red-50 border border-red-100 text-red-600 px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-2">
                        <span class="w-2 h-2 rounded-full bg-red-600"></span>
                        Total Terdaftar: <span id="totalSiswaCount">48 Siswa</span>
                    </div>
                    <button id="tambahSiswaBtn" class="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-xl text-xs font-semibold shadow-md shadow-red-600/25 transition flex items-center gap-1.5">
                        <span>+ Tambah Siswa</span>
                    </button>
                </div>
            </div>

            <div class="bg-white p-4 rounded-2xl border border-slate-100 shadow-sm flex flex-col md:flex-row items-center justify-between gap-4">
                <div class="relative w-full md:w-96">
                    <svg class="absolute left-3.5 top-3 h-4 w-4 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/></svg>
                    <input 
                        type="search" 
                        id="searchSiswa" 
                        placeholder="Cari nama / NIS / kelas..." 
                        class="w-full rounded-xl border border-slate-200 bg-slate-50/50 py-2.5 pl-10 pr-4 text-xs font-medium text-slate-700 placeholder:text-slate-400 focus:border-indigo-500 focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500/10 transition"
                    >
                </div>

                <div class="flex items-center gap-3 w-full md:w-auto justify-end">
                    <select id="filterKelas" class="rounded-xl border border-slate-200 bg-slate-50/50 px-4 py-2.5 text-xs font-semibold text-slate-600 focus:outline-none focus:border-indigo-500">
                        <option value="">Semua Program</option>
                    </select>
                    <span class="text-xs text-slate-400 whitespace-nowrap" id="infoPaginasiTeks">Menampilkan 5 dari 48 entitas</span>
                </div>
            </div>

            <div class="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
                <div class="overflow-x-auto">
                    <table class="w-full text-left border-collapse">
                        <thead>
                            <tr class="border-b border-slate-100 bg-slate-50/50 text-[11px] font-bold text-slate-400 tracking-wider">
                                <th class="py-4 px-6 w-16">NO</th>
                                <th class="py-4 px-6">NAMA</th>
                                <th class="py-4 px-6">NIS</th>
                                <th class="py-4 px-6">PROGRAM</th>
                                <th class="py-4 px-6">STATUS</th>
                                <th class="py-4 px-6 text-right">AKSI</th>
                            </tr>
                        </thead>
                        <tbody id="tabelSiswaBody" class="divide-y divide-slate-100 text-xs font-medium text-slate-600">
                            <!-- Data dimuat dinamis -->
                        </tbody>
                    </table>
                </div>

                <div class="p-4 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500 bg-white">
                    <span id="infoHalaman">Halaman 1 dari 3</span>
                    <div class="flex items-center gap-1.5" id="paginationContainer">
                        <button class="w-8 h-8 rounded-lg flex items-center justify-center border border-slate-200 text-slate-400 hover:bg-slate-50">&lt;</button>
                        <button class="w-8 h-8 rounded-lg flex items-center justify-center bg-indigo-600 text-white font-bold shadow-sm shadow-indigo-600/20">1</button>
                        <button class="w-8 h-8 rounded-lg flex items-center justify-center border border-slate-200 hover:bg-slate-50">2</button>
                        <button class="w-8 h-8 rounded-lg flex items-center justify-center border border-slate-200 hover:bg-slate-50">3</button>
                        <button class="w-8 h-8 rounded-lg flex items-center justify-center border border-slate-200 text-slate-600 hover:bg-slate-50">&gt;</button>
                    </div>
                </div>
            </div>
        `;

        const searchInput = document.getElementById("searchSiswa");
        const filterKelas = document.getElementById("filterKelas");

        // Memuat pilihan filter kelas dari database
        async function loadFilterKelas() {
            try {
                const response = await fetch("http://localhost:8000/api_program.php");
                const result = await response.json();
            
                if (!result.success) {
                    throw new Error(result.message);
                }
            
                filterKelas.innerHTML = `
                    <option value="">Semua Kelas</option>
                    ${result.data.map(program => `
                        <option value="${program.nama_program}">
                            ${program.nama_program}
                        </option>
                    `).join("")}
                `;
                    
            } catch (error) {
                console.error("Gagal memuat filter kelas:", error);
            }
        }

        loadFilterKelas();

        const tabelSiswaBody = document.getElementById("tabelSiswaBody");
        const tambahSiswaBtn = document.getElementById("tambahSiswaBtn");

            let dataSiswa = [];
            let currentPage = 1;
            const rowsPerPage = 10;
        
        async function loadDataSiswa() {
            try {
                const response = await fetch("http://localhost:8000/api_siswa.php");
                const result = await response.json();
            
                if (!result.success) {
                    throw new Error(result.message);
                }
            
                dataSiswa = result.data.map(siswa => ({
                    id: siswa.id,
                    inisial: siswa.nama
                        .split(" ")
                        .map(kata => kata[0])
                        .join("")
                        .substring(0, 2)
                        .toUpperCase(),
                    warnaBg: "bg-indigo-100 text-indigo-700",
                    nama: siswa.nama,
                    email: siswa.email,
                    nis: siswa.nisn,
                    kelas: siswa.nama_program,
                    status: siswa.status_akun === "aktif" ? "Aktif" : "Tidak Aktif"
                }));
            
                renderTable(dataSiswa);
            
                document.getElementById("totalSiswaCount").textContent =
                    `${dataSiswa.length} Siswa`;
            
                document.getElementById("infoPaginasiTeks").textContent =
                    `Menampilkan ${dataSiswa.length} siswa`;
            
            } catch (error) {
                console.error("Gagal mengambil data siswa:", error);
            
                tabelSiswaBody.innerHTML = `
                    <tr>
                        <td colspan="6" class="py-8 text-center text-red-500">
                            Gagal memuat data siswa.
                        </td>
                    </tr>
                `;
            }
        }

        function renderTable(data) {
            if (!tabelSiswaBody) return;
                
            const totalPages = Math.ceil(data.length / rowsPerPage);
                
            // Jika halaman saat ini melebihi jumlah halaman
            if (currentPage > totalPages && totalPages > 0) {
                currentPage = totalPages;
            }
        
            if (data.length === 0) {
                tabelSiswaBody.innerHTML = `
                    <tr>
                        <td colspan="6" class="py-8 text-center text-slate-400">
                            Tidak ada data siswa ditemukan.
                        </td>
                    </tr>
                `;
            
                document.getElementById("infoHalaman").textContent = "Halaman 0 dari 0";
                document.getElementById("paginationContainer").innerHTML = "";
                return;
            }
        
            const startIndex = (currentPage - 1) * rowsPerPage;
            const endIndex = startIndex + rowsPerPage;
            const dataHalaman = data.slice(startIndex, endIndex);

            tabelSiswaBody.innerHTML = dataHalaman.map((siswa, index) => {
                const statusAktif = (siswa.status_akun ?? siswa.status)
                    ?.toString().toLowerCase() === "aktif";
            
                return `
                <tr class="hover:bg-slate-50/80 transition">
                    <td class="py-4 px-6 text-slate-400 font-semibold">
                        ${startIndex + index + 1}
                    </td>
                    <td class="py-4 px-6">
                        <div class="flex items-center gap-3">
                            <div class="w-9 h-9 rounded-xl ${siswa.warnaBg} font-bold flex items-center justify-center text-xs shrink-0 shadow-sm">
                                ${siswa.inisial}
                            </div>
                            <div>
                                <p class="font-bold text-slate-800">${siswa.nama}</p>
                                <p class="text-[11px] text-slate-400">${siswa.email}</p>
                            </div>
                        </div>
                    </td>
                    <td class="py-4 px-6 font-mono text-slate-600">${siswa.nis}</td>
                    <td class="py-4 px-6">
                        <span class="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-100 text-slate-700 text-[11px] font-bold">
                            <span class="w-1.5 h-1.5 rounded-full bg-blue-600"></span>
                            ${siswa.kelas}
                        </span>
                    </td>
                    <td class="py-4 px-6">
                        <span class="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full ${statusAktif ? "bg-emerald-50 text-emerald-600" : "bg-red-50 text-red-600"} text-[11px] font-bold">
                            <span class="w-1.5 h-1.5 rounded-full ${statusAktif ? "bg-emerald-500" : "bg-red-500"}"></span>
                            ${statusAktif ? "Aktif" : "Non-Aktif"}
                        </span>
                    </td>
                    <td class="py-4 px-6 text-right">
                        <div class="flex items-center justify-end gap-2">
                            <button title="Lihat Detail" class="p-1.5 rounded-lg text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 transition action-view" data-id="${siswa.id}">
                                <svg class="w-4 h-4" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
                                    <path d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"/>
                                    <path d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"/>
                                </svg>
                            </button>

                            <button title="Edit" class="p-1.5 rounded-lg text-slate-400 hover:text-amber-600 hover:bg-amber-50 transition action-edit" data-id="${siswa.id}">
                                <svg class="w-4 h-4" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
                                    <path d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5"/>
                                    <path d="M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4 9.5-9.5z"/>
                                </svg>
                            </button>

                            <button title="Hapus" class="p-1.5 rounded-lg text-slate-400 hover:text-red-600 hover:bg-red-50 transition action-delete" data-id="${siswa.id}">
                                <svg class="w-4 h-4" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
                                    <path d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6"/>
                                    <path d="M10 3h4a1 1 0 011 1v3H9V4a1 1 0 011-1zM4 7h16"/>
                                </svg>
                            </button>
                        </div>
                    </td>
                </tr>
            `;
            }).join("");
        
            document.getElementById("infoHalaman").textContent =
                `Halaman ${currentPage} dari ${totalPages}`;
        
            renderPagination(totalPages);
        }

        function renderPagination(totalPages) {
        const container = document.getElementById("paginationContainer");

        let buttons = `
            <button
                class="pagination-btn w-8 h-8 rounded-lg border border-slate-200"
                data-page="${currentPage - 1}"
                ${currentPage === 1 ? "disabled" : ""}>
                &lt;
            </button>
        `;

        for (let i = 1; i <= totalPages; i++) {
            buttons += `
                <button
                    class="pagination-btn w-8 h-8 rounded-lg border ${
                        currentPage === i
                            ? "bg-indigo-600 text-white"
                            : "border-slate-200"
                    }"
                    data-page="${i}">
                    ${i}
                </button>
            `;
        }

        buttons += `
            <button
                class="pagination-btn w-8 h-8 rounded-lg border border-slate-200"
                data-page="${currentPage + 1}"
                ${currentPage === totalPages ? "disabled" : ""}>
                &gt;
            </button>
        `;

        container.innerHTML = buttons;

        container.querySelectorAll(".pagination-btn").forEach(button => {
            button.addEventListener("click", () => {
                const page = Number(button.dataset.page);

                if (page < 1 || page > totalPages) return;

                currentPage = page;
                filterData();
            });
        });
    }

        function filterData(resetPage = false) {
            const keyword = searchInput.value.toLowerCase();
            const program = filterKelas.value;
                
            const filtered = dataSiswa.filter(siswa => {
                const cocokCari =
                    siswa.nama.toLowerCase().includes(keyword) ||
                    siswa.nis.toLowerCase().includes(keyword) ||
                    siswa.kelas.toLowerCase().includes(keyword);
            
                const cocokProgram =
                    program === "" || siswa.kelas === program;
            
                return cocokCari && cocokProgram;
            });
        
            if (resetPage) {
                currentPage = 1;
            }
        
            renderTable(filtered);
        }

        tabelSiswaBody.addEventListener("click", async (e) => {
            const tombolEdit = e.target.closest(".action-edit");
            const tombolHapus = e.target.closest(".action-delete");

            // Tombol Edit
            if (tombolEdit) {
                const siswaId = tombolEdit.dataset.id;
                renderEditSiswaView(siswaId);
            }
        
            // Tombol Hapus
            if (tombolHapus) {
                const siswaId = tombolHapus.dataset.id;
            
                const konfirmasi = confirm(
                    "Apakah kamu yakin ingin menghapus data siswa ini?"
                );
            
                if (!konfirmasi) return;
            
                try {
                    const response = await fetch(
                        "http://localhost:8000/api_hapus_siswa.php",
                        {
                            method: "POST",
                            headers: {
                                "Content-Type": "application/json"
                            },
                            body: JSON.stringify({ id: siswaId })
                        }
                    );
                
                    const result = await response.json();
                
                    if (!result.success) {
                        throw new Error(result.message);
                    }
                
                    alert(result.message);
                
                    // Memuat ulang tabel setelah berhasil dihapus
                    await loadDataSiswa();
                
                } catch (error) {
                    console.error("Gagal menghapus siswa:", error);
                    alert(error.message);
                }
            }
        });
    
    if (searchInput) {
        searchInput.addEventListener("input", () => filterData(true));
    }
    
    if (filterKelas) {
        filterKelas.addEventListener("change", () => filterData(true));
    }

        // Pindah ke tampilan Form Tambah Siswa secara SPA (tanpa ganti file HTML)
        if (tambahSiswaBtn) {
            tambahSiswaBtn.addEventListener("click", () => {
                renderTambahSiswaView();
            });
        }

        loadDataSiswa();
    }

    // Inisialisasi awal saat halaman dibuka
    initAdminSiswa();