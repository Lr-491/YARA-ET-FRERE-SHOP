const container     = document.getElementById("product-container");
const modal         = document.getElementById("modal");
const modalTitle    = document.getElementById("modal__title");
const modalMainImage= document.getElementById("modal__main-image");
const modalThumbs   = document.getElementById("modal__thumbnails");
const modalDesc     = document.getElementById("modal__description");
const modalWABtn    = document.getElementById("modalWhatsappBtn");
const searchInput   = document.getElementById("searchInput");
const filterBtns    = document.querySelectorAll(".filter-btn");
const noResults     = document.getElementById("noResults");
const resultsCount  = document.getElementById("resultsCount");

let activeCategory  = "tous";   // catégorie active
let searchQuery     = "";       // texte de recherche

/* ── WhatsApp ─────────────────────────────────────────── */
function getWhatsAppLink(product, quantity) {
    const priceText = product.price ? product.price.toLocaleString() + " FCFA" : "Sur devis";
    const msg = `Bonjour, je souhaite commander :%0A%0A*Produit :* ${product.title} ${product.model || ""}%0A*Quantité :* ${quantity}%0A*Prix :* ${priceText}%0A%0AMerci !`;
    return `https://wa.me/${WHATSAPP_NUMBER}?text=${msg}`;
}

/* ── Modal ────────────────────────────────────────────── */
function openModal(product) {
    modalTitle.textContent = product.title + (product.model ? " " + product.model : "");

    let previews = product.previews?.length
        ? product.previews
        : [{ img: product.img, label: "Vue 1" }];

    modalMainImage.innerHTML = `<img src="${previews[0].img}" alt="${product.title}">`;

    modalThumbs.innerHTML = previews.map((p, i) => `
        <button type="button" class="modal__thumb ${i === 0 ? "active" : ""}"
            data-img="${p.img}">
            <img src="${p.img}" alt="${p.label || "Vue " + (i + 1)}">
        </button>
    `).join("");

    modalThumbs.querySelectorAll(".modal__thumb").forEach(btn => {
        btn.addEventListener("click", () => {
            modalMainImage.innerHTML = `<img src="${btn.dataset.img}" alt="${product.title}">`;
            modalThumbs.querySelectorAll(".modal__thumb").forEach(b => b.classList.remove("active"));
            btn.classList.add("active");
        });
    });

    modalDesc.textContent = product.description || "Demandez plus d'informations.";

    const modalQty = document.getElementById("modalQty");
    modalQty.value = 1;
    modalWABtn.href = getWhatsAppLink(product, 1);
    modalQty.oninput = () => {
        modalWABtn.href = getWhatsAppLink(product, parseInt(modalQty.value) || 1);
    };

    modal.classList.remove("hidden");
    document.body.style.overflow = "hidden";
}

function closeModal() {
    modal.classList.add("hidden");
    document.body.style.overflow = "";
}

/* ── Filtrage & Recherche ─────────────────────────────── */
function getFilteredProducts() {
    return data.filter(product => {
        // Filtre catégorie
        const matchCat = activeCategory === "tous" || product.category === activeCategory;

        // Filtre recherche (titre + modèle + description)
        const q = searchQuery.toLowerCase().trim();
        const matchSearch = q === "" || [
            product.title,
            product.model,
            product.description
        ].some(field => field && field.toLowerCase().includes(q));

        return matchCat && matchSearch;
    });
}

/* ── Affichage ────────────────────────────────────────── */
function displayProducts(products) {
    container.innerHTML = "";

    if (products.length === 0) {
        noResults.classList.remove("hidden");
        resultsCount.textContent = "";
        return;
    }

    noResults.classList.add("hidden");
    resultsCount.textContent = `${products.length} produit${products.length > 1 ? "s" : ""} trouvé${products.length > 1 ? "s" : ""}`;

    products.forEach((product) => {
        const priceDisplay = product.price ? product.price.toLocaleString() + " FCFA" : "Sur devis";
        const card = document.createElement("div");
        card.className = "product-card";
        card.innerHTML = `
            <img src="${product.img}" alt="${product.title} ${product.model || ""}">
            <h3>${product.title}</h3>
            ${product.model ? `<h3>${product.model}</h3>` : ""}
            <p>${product.description || ""}</p>
            <p class="price">${priceDisplay}</p>
            <label>Quantité :</label>
            <input type="number" min="1" value="1" id="qty${product.id}">
            <button class="open__modal">Voir plus</button>
            <a href="#" class="btn-order btn-order--whatsapp">Commander via WhatsApp</a>
        `;

        // Événements de la carte
        card.querySelector(".open__modal").addEventListener("click", (e) => {
            e.preventDefault();
            openModal(product);
        });

        card.querySelector(".btn-order--whatsapp").addEventListener("click", (e) => {
            e.preventDefault();
            const qty = parseInt(card.querySelector(`#qty${product.id}`).value) || 1;
            window.open(getWhatsAppLink(product, qty), "_blank", "noopener,noreferrer");
        });

        container.appendChild(card);
    });

    // Animation d'apparition
    const observer = new IntersectionObserver(
        (entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add("show");
                    observer.unobserve(entry.target);
                }
            });
        },
        { threshold: 0.1 }
    );

    setTimeout(() => {
        container.querySelectorAll(".product-card").forEach(card => observer.observe(card));
    }, 50);
}

function applyFilters() {
    displayProducts(getFilteredProducts());
}

/* ── Événements ───────────────────────────────────────── */

// Filtres catégorie
filterBtns.forEach(btn => {
    btn.addEventListener("click", () => {
        filterBtns.forEach(b => b.classList.remove("active"));
        btn.classList.add("active");
        activeCategory = btn.dataset.category;
        applyFilters();
    });
});

// Recherche en temps réel (avec léger délai pour les performances)
let searchTimer;
searchInput.addEventListener("input", () => {
    clearTimeout(searchTimer);
    searchTimer = setTimeout(() => {
        searchQuery = searchInput.value;
        applyFilters();
    }, 250);
});

// Fermeture modal
document.getElementById("closeModalBtn").addEventListener("click", closeModal);
modal.addEventListener("click", (e) => { if (e.target === modal) closeModal(); });
document.addEventListener("keydown", (e) => { if (e.key === "Escape") closeModal(); });

/* ── Initialisation ───────────────────────────────────── */
applyFilters();