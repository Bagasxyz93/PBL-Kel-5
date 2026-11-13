
export function initFormUnggahMateri(onSelesaiPublikasi = null) {
    console.log("Modul Form Tambah Materi berhasil dimuat.");

    const btnReset = document.getElementById("btn-reset-form");
    const btnPublikasikan = document.getElementById("btn-publikasikan-materi");
    const areaUpload = document.getElementById("area-upload-file");
    const inputFile = document.getElementById("input-file-materi");
    const namaFile = document.getElementById("nama-file-materi");
    const selectProgram = document.getElementById("program-materi");

    // EDITOR DESKRIPSI
    const editor = document.getElementById("editor-deskripsi");
    const deskripsi = document.getElementById("deskripsi-materi");

    const tombolToolbar = document.querySelectorAll("[data-command]");

    
    let rangeEditor = null;

    // Simpan posisi kursor sebelum tombol toolbar diklik
    tombolToolbar.forEach((tombol) => {
        tombol.addEventListener("mousedown", (e) => {
            e.preventDefault();

            const selection = window.getSelection();

            if (selection.rangeCount > 0) {
                rangeEditor = selection.getRangeAt(0).cloneRange();
            }
        });

        tombol.addEventListener("click", () => {
            if (!editor || !deskripsi) return;

            editor.focus();

            // Kembalikan posisi kursor
            if (rangeEditor) {
                const selection = window.getSelection();
                selection.removeAllRanges();
                selection.addRange(rangeEditor);
            }

            const command = tombol.dataset.command;

            if (command === "createLink") {
                const url = prompt("Masukkan URL:");

                if (url && /^https?:\/\//i.test(url)) {
                    document.execCommand("createLink", false, url);
                }
            } else {
                document.execCommand(command, false, null);
            }

            deskripsi.value = editor.innerHTML;

            // Simpan posisi kursor terbaru
            const selection = window.getSelection();

            if (selection.rangeCount > 0) {
                rangeEditor = selection.getRangeAt(0).cloneRange();
            }
        });
    });


    
    if (editor && deskripsi) {
        editor.addEventListener("input", () => {
            deskripsi.value = editor.innerHTML;
        });

        // Menghilangkan bullet saat Backspace ditekan pada baris kosong
        editor.addEventListener("keydown", (event) => {
            if (event.key !== "Backspace") return;

            const selection = window.getSelection();

            if (!selection || !selection.isCollapsed || selection.rangeCount === 0) {
                return;
            }

            const range = selection.getRangeAt(0);
            let node = range.startContainer;

            if (node.nodeType === Node.TEXT_NODE) {
                if (range.startOffset > 0) return;
                node = node.parentElement;
            } else if (range.startOffset > 0) {
                return;
            }

            const listItem = node.nodeType === Node.ELEMENT_NODE
                ? node.closest("li")
                : null;

            if (!listItem) return;

            // Pastikan baris bullet benar-benar kosong
            if (listItem.textContent.trim() !== "") return;

            event.preventDefault();

            const list = listItem.parentElement;
            const paragraph = document.createElement("p");

            paragraph.innerHTML = "<br>";

            listItem.replaceWith(paragraph);

            // Hapus daftar jika sudah tidak memiliki item
            if (list.children.length === 0) {
                list.remove();
            }

            // Pindahkan kursor ke paragraf biasa
            paragraph.focus?.();

            const newRange = document.createRange();
            newRange.selectNodeContents(paragraph);
            newRange.collapse(true);

            selection.removeAllRanges();
            selection.addRange(newRange);

            editor.focus();

            deskripsi.value = editor.innerHTML;
        });
    }


    const batasUkuran = 50 * 1024 * 1024;

    const formatDiizinkan = [
        "pdf",
        "ppt",
        "pptx",
        "zip",
        "mp4"
    ];

    // Mengambil program yang ditugaskan kepada mentor
    async function loadProgramMateri() {
        try {
            const response = await fetch(
                "http://localhost:8000/api/mentor/api_materi.php",
                {
                    method: "GET",
                    credentials: "include"
                }
            );

            const result = await response.json();

            if (!response.ok || !result.success) {
                throw new Error(result.message || "Gagal mengambil program.");
            }

            selectProgram.innerHTML =
                '<option value="">Pilih Program...</option>';

            result.data.program.forEach(program => {
                const option = document.createElement("option");

                option.value = program.id;
                option.textContent = program.nama_program;

                selectProgram.appendChild(option);
            });

        } catch (error) {
            console.error("Gagal memuat program:", error);
            alert("Program gagal dimuat. Silakan periksa koneksi backend.");
        }
    }

    // Membuka jendela pemilihan file
    if (areaUpload && inputFile) {
        areaUpload.addEventListener("click", (event) => {
            if (event.target !== inputFile) {
                inputFile.click();
            }
        });

        // Memproses file yang dipilih
        inputFile.addEventListener("change", () => {
            const file = inputFile.files[0];

            if (!file) {
                namaFile.textContent = "Belum ada file dipilih";
                return;
            }

            const ekstensi = file.name
                .split(".")
                .pop()
                .toLowerCase();

            // Validasi format file
            if (!formatDiizinkan.includes(ekstensi)) {
                alert("Format file tidak didukung!");

                inputFile.value = "";
                namaFile.textContent = "Belum ada file dipilih";
                return;
            }

            // Validasi ukuran file
            if (file.size > batasUkuran) {
                alert("Ukuran file maksimal adalah 50 MB!");

                inputFile.value = "";
                namaFile.textContent = "Belum ada file dipilih";
                return;
            }

            const ukuranMB = (file.size / (1024 * 1024)).toFixed(2);

            namaFile.textContent =
                `${file.name} (${ukuranMB} MB)`;

            console.log("File berhasil dipilih:", file.name);
        });

        // Mendukung drag and drop
        areaUpload.addEventListener("dragover", (event) => {
            event.preventDefault();
            areaUpload.classList.add("border-[#00b09b]");
        });

        areaUpload.addEventListener("dragleave", () => {
            areaUpload.classList.remove("border-[#00b09b]");
        });

        areaUpload.addEventListener("drop", (event) => {
            event.preventDefault();
            areaUpload.classList.remove("border-[#00b09b]");

            const file = event.dataTransfer.files[0];

            if (!file) return;

            const dataTransfer = new DataTransfer();
            dataTransfer.items.add(file);

            inputFile.files = dataTransfer.files;

            inputFile.dispatchEvent(new Event("change"));
        });
    }

    // Reset form
    if (btnReset) {
        btnReset.addEventListener("click", () => {
            const judul = document.getElementById("judul-materi");
            const durasi = document.getElementById("durasi-materi");
        
            if (judul) judul.value = "";
            if (deskripsi) deskripsi.value = "";
            if (editor) editor.innerHTML = "";
            if (durasi) durasi.value = "";
        
            if (selectProgram) selectProgram.selectedIndex = 0;
            if (inputFile) inputFile.value = "";
        
            if (namaFile) {
                namaFile.textContent = "Belum ada file dipilih";
            }
        
            alert("Formulir berhasil di-reset.");
        });
    }
    if (selectProgram) {
        loadProgramMateri();
    }

    // PUBLIKASIKAN MATERI
    if (btnPublikasikan) {
        btnPublikasikan.addEventListener("click", async () => {

            const judul = document.getElementById("judul-materi");
            const durasi = document.getElementById("durasi-materi");

            // Sinkronisasi isi editor ke textarea
            if (editor && deskripsi) {
                deskripsi.value = editor.innerHTML;
            }

            // Validasi input wajib
            if (!judul.value.trim()) {
                alert("Judul materi wajib diisi.");
                judul.focus();
                return;
            }

            if (!selectProgram.value) {
                alert("Silakan pilih program terlebih dahulu.");
                selectProgram.focus();
                return;
            }

            // Menyiapkan data yang akan dikirim
            const formData = new FormData();

            formData.append("judul", judul.value.trim());
            formData.append("program_id", selectProgram.value);
            formData.append("konten_materi", deskripsi.value);

            // File bersifat opsional
            if (inputFile && inputFile.files.length > 0) {
                formData.append("file_materi", inputFile.files[0]);
            }

            try {
                btnPublikasikan.disabled = true;
                btnPublikasikan.textContent = "Menyimpan...";

                const response = await fetch(
                    "http://localhost:8000/api/mentor/api_materi.php",
                    {
                        method: "POST",
                        credentials: "include",
                        body: formData
                    }
                );

                const result = await response.json();

                if (!response.ok || !result.success) {
                    throw new Error(result.message || "Gagal mempublikasikan materi.");
                }

                
                alert("Materi berhasil dipublikasikan!");
                            
                // Kosongkan formulir setelah berhasil
                judul.value = "";
                            
                if (deskripsi) deskripsi.value = "";
                if (editor) editor.innerHTML = "";
                            
                if (durasi) durasi.value = "";
                            
                selectProgram.selectedIndex = 0;
                            
                if (inputFile) inputFile.value = "";
                            
                if (namaFile) {
                    namaFile.textContent = "Belum ada file dipilih";
                }
                
                // Jalankan callback setelah formulir dikosongkan
                if (onSelesaiPublikasi) {
                    await onSelesaiPublikasi();
                    return;
                }
                

            } catch (error) {
                console.error("Gagal mempublikasikan materi:", error);
                alert(error.message);

            } finally {
                btnPublikasikan.disabled = false;
                btnPublikasikan.textContent = "Publikasikan Materi";
            }
        });
    }

}
