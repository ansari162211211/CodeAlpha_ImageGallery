const gallery = document.getElementById("gallery");
const cards = Array.from(document.querySelectorAll(".gallery-card"));
const filterBtns = document.querySelectorAll(".filter-btn");
const galleryCount = document.getElementById("galleryCount");

const lightbox = document.getElementById("lightbox");
const lightboxImage = document.getElementById("lightboxImage");
const lightboxCategory = document.getElementById("lightboxCategory");
const lightboxTitle = document.getElementById("lightboxTitle");
const lightboxDesc = document.getElementById("lightboxDesc");
const lightboxCounter = document.getElementById("lightboxCounter");

const prevBtn = document.getElementById("prev");
const nextBtn = document.getElementById("next");
const closeBtn = document.getElementById("closeLightbox");

let currentFilter = "all";
let visibleCards = [...cards];
let currentIndex = 0;

function getCardMeta(card) {
    const overlay = card.querySelector(".card-overlay");
    return {
        src: card.querySelector("img").src.replace("/600/450", "/1200/900"),
        alt: card.querySelector("img").alt,
        category: card.dataset.category,
        title: overlay.querySelector("h3").textContent,
        desc: overlay.querySelector("p").textContent,
    };
}

function updateCount() {
    const total = cards.length;
    const shown = visibleCards.length;
    const label = currentFilter === "all" ? "images" : `${currentFilter} photos`;
    galleryCount.textContent =
        shown === total
            ? `Showing all ${total} images`
            : `Showing ${shown} of ${total} ${label}`;
}

function applyFilter(filter) {
    currentFilter = filter;

    filterBtns.forEach((btn) => {
        btn.classList.toggle("active", btn.dataset.filter === filter);
    });

    cards.forEach((card) => {
        const match = filter === "all" || card.dataset.category === filter;
        card.classList.add("fade-out");

        setTimeout(() => {
            card.classList.toggle("hidden", !match);
            card.classList.remove("fade-out");
        }, 200);
    });

    setTimeout(() => {
        visibleCards = cards.filter(
            (c) => !c.classList.contains("hidden")
        );
        updateCount();
    }, 250);
}

filterBtns.forEach((btn) => {
    btn.addEventListener("click", () => applyFilter(btn.dataset.filter));
});

function openLightbox(index) {
    currentIndex = index;
    lightbox.classList.add("open");
    document.body.style.overflow = "hidden";
    showImage();
}

function closeLightbox() {
    lightbox.classList.remove("open");
    document.body.style.overflow = "";
}

function showImage() {
    const card = visibleCards[currentIndex];
    const meta = getCardMeta(card);

    lightboxImage.src = meta.src;
    lightboxImage.alt = meta.alt;
    lightboxCategory.textContent = meta.category;
    lightboxTitle.textContent = meta.title;
    lightboxDesc.textContent = meta.desc;
    lightboxCounter.textContent = `${currentIndex + 1} / ${visibleCards.length}`;

    lightbox.querySelector(".lightbox-content").style.animation = "none";
    requestAnimationFrame(() => {
        lightbox.querySelector(".lightbox-content").style.animation = "";
    });
}

function goNext() {
    currentIndex = (currentIndex + 1) % visibleCards.length;
    showImage();
}

function goPrev() {
    currentIndex =
        (currentIndex - 1 + visibleCards.length) % visibleCards.length;
    showImage();
}

cards.forEach((card) => {
    card.addEventListener("click", () => {
        const index = visibleCards.indexOf(card);
        if (index !== -1) openLightbox(index);
    });
});

prevBtn.addEventListener("click", (e) => {
    e.stopPropagation();
    goPrev();
});

nextBtn.addEventListener("click", (e) => {
    e.stopPropagation();
    goNext();
});

closeBtn.addEventListener("click", closeLightbox);

lightbox.addEventListener("click", (e) => {
    if (e.target === lightbox) closeLightbox();
});

document.addEventListener("keydown", (e) => {
    if (!lightbox.classList.contains("open")) return;

    if (e.key === "Escape") closeLightbox();
    if (e.key === "ArrowRight") goNext();
    if (e.key === "ArrowLeft") goPrev();
});

updateCount();
