/* =========================
   script.js (COMPLETO)
   - Cards VERTICALES para destacados y disponibles
   - Cada coche: carrusel de fotos + miniaturas + precio/año/km/desc + WhatsApp
========================= */

/* CONFIGURACIÓN DEL NEGOCIO */
const BUSINESS = {
  whatsappNumber: "34645723857", // <-- Cambia a tu número (España: 34 + tu número)
  businessName: "Automoviles B.J",
  defaultWhatsappMessage:
    "Hola, vengo desde tu web. ¿Podrías darme más información?",
};

/* HERO (PORTADA) */
const HERO_IMAGES = ["img/logo.jpeg"];

/* COCHES (AGREGA AQUÍ) */
const CARS = [
  {
    id: "Renault Clio",
    featured: true,
    title: "Renault Clio,RT 1.4 80 cv",
    brand: "Renault",
    year: 1994,
    km: 86000,
    price: 2500,
    fuel: "Gasolina",
    transmission: "Automático",
    location: "Mora (Toledo)",
    sold: false,
    description:
      "Vehículo en muy buen estado, con mantenimiento al día: cambio de bujías, aceite y filtro. Consumo bajo, ideal para ciudad y carretera.",
    photos: [
      "img/clio.jpeg",
      "img/clio2.jpeg",
      "img/clio3.jpeg",
      "img/clio4.jpeg",
      "img/clio5.jpeg",
      "img/clio6.jpeg",
    ],
  },
  {
    id: "Peugeot 208 1.2",
    featured: true,
    title: "Peugeot 208 1.2 110 cv",
    brand: "Peugeot",
    year: 2016,
    km: 103000,
    price: 7500,
    fuel: "Gasolina",
    transmission: "Manual",
    location: "Mora (Toledo)",
    sold: false,
    description:
      "Coche perfecto para circular tanto en ciudad como en carretera. Vehículo muy económico y de bajo consumo, con distribución, aceite y filtros recién hechos. ITV en vigor hasta 2027",
    photos: [
      "img/peugeot1.jpeg",
      "img/peu2.jpeg",
      "img/peu3.jpeg",
      "img/peu4.jpeg",
      "img/peu5.jpeg",
      "img/peu6.jpeg",
      "img/peu7.jpeg",
      "img/peu8.jpeg",
      "img/peu9.jpeg",
      "img/peu10.jpeg",
    ],
  },
  {
    id: "Cetroen",
    featured: false,
    title: "Cetroen C4 Cactus 1.6 92 cv",
    brand: "Cetroen",
    year: 2014,
    km: 133000,
    price: 8000,
    fuel: "Diesel",
    transmission: "Automático",
    location: "Mora (Toledo)",
    sold: true,
    description:
      "Automático, cómodo y económico. Interior limpio, sin golpes, excelente conducción.",
    photos: [
      "img/c41.jpeg",
      "img/c42.jpeg",
      "img/c43.jpeg",
      "img/c44.jpeg",
      "img/c45.jpeg",
      "img/c46.jpeg",
      "img/c47.jpeg",
    ],
  },
  {
    id: "BMW",
    featured: false,
    title: "BMW serie 1 2.0 143 cv",
    brand: "BMW",
    year: 2008,
    km: 364000,
    price: 2500,
    fuel: "Diesel",
    transmission: "Manual",
    location: "Mora (Toledo)",
    sold: false,
    description:
      "Vehículo utilitario ideal para el día a día, con motor en perfecto estado y revisiones al día. Vehículo nacional, de único propietario y con un consumo muy económico.",
    photos: ["img/bmw.jpeg"],
  },
];

/* UTILIDADES */
const qs = (s, el = document) => el.querySelector(s);

function formatEuro(n) {
  return new Intl.NumberFormat("es-ES", {
    style: "currency",
    currency: "EUR",
    maximumFractionDigits: 0,
  }).format(n);
}
function formatKm(n) {
  return new Intl.NumberFormat("es-ES").format(n) + " km";
}
function whatsappLink(message) {
  const base = `https://wa.me/${BUSINESS.whatsappNumber}`;
  const text = encodeURIComponent(message || BUSINESS.defaultWhatsappMessage);
  return `${base}?text=${text}`;
}
function escapeHtml(str) {
  return String(str)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

/* HERO CARRUSEL */
let heroIndex = 0;
let heroTimer = null;

function renderHero() {
  const bg = qs("#heroBg");
  bg.style.backgroundImage = `url("${HERO_IMAGES[heroIndex]}")`;

 

  const dots = qs("#heroDots");
  dots.innerHTML = "";
  HERO_IMAGES.forEach((_, i) => {
    const d = document.createElement("div");
    d.className = "dot" + (i === heroIndex ? " active" : "");
    d.addEventListener("click", () => {
      heroIndex = i;
      renderHero();
      restartHeroAuto();
    });
    dots.appendChild(d);
  });
}
function heroNext() {
  heroIndex = (heroIndex + 1) % HERO_IMAGES.length;
  renderHero();
}
function heroPrev() {
  heroIndex = (heroIndex - 1 + HERO_IMAGES.length) % HERO_IMAGES.length;
  renderHero();
}
function restartHeroAuto() {
  if (heroTimer) clearInterval(heroTimer);
  heroTimer = setInterval(heroNext, 6000);
}

/* =========================
   CARD VERTICAL (reusable)
========================= */
function vCardTemplate(car, { forFeatured = false } = {}) {
  const photos =
    car.photos && car.photos.length ? car.photos : ["images/placeholder.jpg"];
  const first = photos[0];

  const badge = car.sold
    ? `<div class="vcard__badge vcard__badge--sold">VENDIDO</div>`
    : ``;

  // En destacados: más simple (sin desc/acciones/thumbs)
  if (forFeatured) {
    return `
      <article class="vcard" data-scroll-to="${escapeHtml(car.id)}" aria-label="Destacado">
        <div class="vcard__media">
          <div class="vcard__img" style="background-image:url('${first}')"></div>
          ${badge}
        </div>
        <div class="vcard__body">
          <div class="vcard__title">${escapeHtml(car.title)}</div>
          <div class="vcard__meta">
            <span>${car.year}</span>
            <span>${formatKm(car.km)}</span>
          </div>
          <div class="vcard__price">${formatEuro(car.price)}</div>
        </div>
      </article>
    `;
  }

  // En disponibles: completa
  const msg = `Hola! Me interesa este coche: ${car.title} (${car.year}) - ${formatEuro(car.price)}. ¿Sigue disponible?`;
  const wa = whatsappLink(msg);

  return `
    <article class="vcard vcard--grid" data-car-id="${escapeHtml(car.id)}" aria-label="Coche disponible">
      <div class="vcard__media">
        <div class="vcard__img" data-role="img" style="background-image:url('${first}')"></div>

        ${badge}

        <div class="vcard__nav">
          <button type="button" data-action="prev" aria-label="Foto anterior">‹</button>
          <button type="button" data-action="next" aria-label="Foto siguiente">›</button>
        </div>
      </div>

      <div class="vcard__body">
        <div class="vcard__title">${escapeHtml(car.title)}</div>

        <div class="vcard__meta">
          <span>${car.year}</span>
          <span>${formatKm(car.km)}</span>
        </div>

        <div class="vcard__price">${formatEuro(car.price)}</div>

        <div class="vcard__chips">
          <span class="chip">${escapeHtml(car.fuel)}</span>
          <span class="chip">${escapeHtml(car.transmission)}</span>
          <span class="chip">${escapeHtml(car.location)}</span>
          <span class="chip">${escapeHtml(car.brand)}</span>
        </div>

        <div class="vcard__desc">${escapeHtml(car.description)}</div>

        <div class="vcard__actions">
          <a class="btn" href="${wa}" target="_blank" rel="noopener">WhatsApp</a>
          <button class="btn btn--ghost" type="button" data-action="copy">Copiar info</button>
        </div>
      </div>

      <div class="vcard__thumbs" data-role="thumbs" aria-label="Miniaturas"></div>
    </article>
  `;
}

/* =========================
   DESTACADOS
========================= */
function renderFeatured() {
  const track = qs("#featuredTrack");
  const featuredCars = CARS.filter((c) => c.featured);

  track.innerHTML = featuredCars.length
    ? featuredCars.map((c) => vCardTemplate(c, { forFeatured: true })).join("")
    : `<div class="muted">No hay destacados aún.</div>`;

  // Click: baja al coche en la lista
  track.addEventListener("click", (e) => {
    const card = e.target.closest("[data-scroll-to]");
    if (!card) return;
    const id = card.getAttribute("data-scroll-to");
    const target = qs(`[data-car-id="${CSS.escape(id)}"]`);
    if (target) target.scrollIntoView({ behavior: "smooth", block: "start" });
  });

  qs("#featPrev").addEventListener("click", () =>
    track.scrollBy({ left: -320, behavior: "smooth" }),
  );
  qs("#featNext").addEventListener("click", () =>
    track.scrollBy({ left: 320, behavior: "smooth" }),
  );
}

/* =========================
   COCHES DISPONIBLES (vertical)
========================= */
function mountVCardInteractions(articleEl, car) {
  const imgEl = articleEl.querySelector('[data-role="img"]');
  const thumbsEl = articleEl.querySelector('[data-role="thumbs"]');
  const photos =
    car.photos && car.photos.length ? car.photos : ["images/placeholder.jpg"];
  let idx = 0;

  function setPhoto(i) {
    idx = (i + photos.length) % photos.length;
    imgEl.style.backgroundImage = `url("${photos[idx]}")`;
    [...thumbsEl.querySelectorAll(".vthumb")].forEach((t, j) =>
      t.classList.toggle("active", j === idx),
    );
  }

  // miniaturas
  thumbsEl.innerHTML = "";
  photos.forEach((src, i) => {
    const t = document.createElement("button");
    t.type = "button";
    t.className = "vthumb" + (i === 0 ? " active" : "");
    t.style.backgroundImage = `url("${src}")`;
    t.setAttribute("aria-label", `Ver foto ${i + 1}`);
    t.addEventListener("click", () => setPhoto(i));
    thumbsEl.appendChild(t);
  });

  articleEl.addEventListener("click", async (e) => {
    const btn = e.target.closest("[data-action]");
    if (!btn) return;

    const action = btn.getAttribute("data-action");
    if (action === "prev") setPhoto(idx - 1);
    if (action === "next") setPhoto(idx + 1);

    if (action === "copy") {
      const text = `${car.title}
Precio: ${formatEuro(car.price)}
Año: ${car.year}
Km: ${formatKm(car.km)}
Combustible: ${car.fuel}
Cambio: ${car.transmission}
Ubicación: ${car.location}
Marca: ${car.brand}
${car.sold ? "Estado: VENDIDO" : "Estado: Disponible"}
Descripción: ${car.description}`;
      try {
        await navigator.clipboard.writeText(text);
        btn.textContent = "¡Copiado!";
        setTimeout(() => (btn.textContent = "Copiar info"), 1200);
      } catch {
        alert("No pude copiar. Selecciona y copia manualmente.");
      }
    }
  });

  setPhoto(0);
}

function renderCars() {
  const grid = qs("#carsGrid");
  const empty = qs("#emptyState");

  qs("#resultsCount").textContent = String(CARS.length);

  if (CARS.length === 0) {
    grid.innerHTML = "";
    empty.classList.remove("hidden");
    return;
  }
  empty.classList.add("hidden");

  grid.innerHTML = CARS.map((c) =>
    vCardTemplate(c, { forFeatured: false }),
  ).join("");

  // montar interacciones por cada tarjeta
  CARS.forEach((car) => {
    const el = qs(`[data-car-id="${CSS.escape(car.id)}"]`);
    if (el) mountVCardInteractions(el, car);
  });
}

/* INIT */
function init() {
  qs("#yearNow").textContent = String(new Date().getFullYear());
  qs("#whatsGeneral").setAttribute("href", whatsappLink());

  renderHero();
  qs("#heroPrev").addEventListener("click", () => {
    heroPrev();
    restartHeroAuto();
  });
  qs("#heroNext").addEventListener("click", () => {
    heroNext();
    restartHeroAuto();
  });
  restartHeroAuto();

  renderFeatured();
  renderCars();
}

init();
