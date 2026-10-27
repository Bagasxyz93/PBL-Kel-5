export function initMateri() {
const searchInput = document.getElementById("search-materi");
const cards = document.querySelectorAll(".kartu-materi");
const emptyMessage = document.getElementById("materi-kosong");

// Pastikan elemen pencarian tersedia
if (!searchInput || !emptyMessage) {
    return;
}

function filterMateri() {
    const keyword = searchInput.value.trim().toLowerCase();
    let totalVisible = 0;

    cards.forEach((card) => {
        const searchableText = [
            card.dataset.judul,
            card.dataset.kategori,
            card.dataset.pengajar,
            card.textContent
        ]
            .join(" ")
            .toLowerCase();

        const matched = searchableText.includes(keyword);

        card.classList.toggle("hidden", !matched);

        if (matched) {
            totalVisible++;
        }
    });

    emptyMessage.classList.toggle("hidden", totalVisible > 0);
}

searchInput.addEventListener("input", filterMateri);

}