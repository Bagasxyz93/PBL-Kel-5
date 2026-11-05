const riwayatAbsenData = [
    {
        nama: "NERAZURIANCTA",
        tanggal: "30/10/2026",
        jamMasuk: "06.00",
        jamKeluar: "13.00",
        status: "HADIR",
        badgeClass: "bg-emerald-500 text-white"
    },
    {
        nama: "NERAZURIANCTA",
        tanggal: "29/10/2026",
        jamMasuk: "06.00",
        jamKeluar: "12.00",
        status: "HADIR",
        badgeClass: "bg-emerald-500 text-white"
    },
    {
        nama: "NERAZURIANCTA",
        tanggal: "28/10/2026",
        jamMasuk: "-",
        jamKeluar: "-",
        status: "IZIN",
        badgeClass: "bg-amber-400 text-white"
    },
    {
        nama: "NERAZURIANCTA",
        tanggal: "27/10/2026",
        jamMasuk: "-",
        jamKeluar: "-",
        status: "HADIR",
        badgeClass: "bg-rose-500 text-white"
    }
];

function renderRiwayatAbsen() {
    const container = document.getElementById("riwayat-absen-container");
    if (!container) return;

    container.innerHTML = riwayatAbsenData.map((item) => `
        <tr class="hover:bg-slate-50/60 transition-colors">
            <td class="py-4 pl-2 font-bold text-slate-800">
                ${item.nama}
            </td>
            <td class="py-4 font-semibold text-slate-600">
                ${item.tanggal}
            </td>
            <td class="py-4 font-semibold text-slate-600">
                ${item.jamMasuk}
            </td>
            <td class="py-4 font-semibold text-slate-600">
                ${item.jamKeluar}
            </td>
            <td class="py-4 text-right pr-2">
                <span class="inline-block rounded-full px-4 py-1 text-[10px] font-bold ${item.badgeClass}">
                    ${item.status}
                </span>
            </td>
        </tr>
    `).join("");
}

export function initAbsensi() {
    renderRiwayatAbsen();
}