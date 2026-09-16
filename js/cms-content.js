(function () {
  "use strict";

  const esc = (value) =>
    String(value ?? "").replace(/[&<>"]/g, (c) => ({
      "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;"
    }[c]));

  const asset = (value) => {
    if (value.startsWith("http://") || value.startsWith("https://")) return value;;
    if (/^https?:\/\//i.test(value)) return value;
    return value.startsWith("/") ? value : "/" + value;
  };

  async function load(file) {
    const response = await fetch(file + "?v=" + Date.now());
    if (!response.ok) throw new Error(file);
    return response.json();
  }

  async function news() {
    const areas = document.querySelectorAll("[data-cms-news]");
    if (!areas.length) return;
    try {
      const data = await load("content/actualites.json");
      const html = (data.items || []).map((item, index) => `
        <article class="news-card">
          <a href="actualite.html?id=${index}" aria-label="Consulter ${esc(item.title)}">
            ${item.image
              ? `<div class="news-cover" style="background:url('${esc(asset(item.image))}') center/cover"></div>`
              : `<div class="news-cover">📰</div>`}
          </a>
          <div class="news-text">
            <span class="date">${esc(item.category)}</span>
            <h3>${esc(item.title)}</h3>
            <p>${esc(item.excerpt)}</p>
            <a class="text-btn" href="actualite.html?id=${index}">Voir l’actualité →</a>
          </div>
        </article>`).join("");
      areas.forEach(area => area.innerHTML = html);
    } catch (error) { console.warn(error); }
  }

  async function projets() {
  const areas = document.querySelectorAll("[data-cms-projects]")
  if (!areas.length) return;

  try {
    const data = await load("content/projets.json");

    areas.forEach(area => {
      const home = area.getAttribute("data-cms-projects") === "home";

      area.innerHTML = (data.items || [])
        .slice(0, home ? 3 : 999)
        .map(item => {
          const images = [
            item.image,
            ...(item.images || []).map(photo => photo && photo.image)
          ].filter(Boolean).map(asset);

          const photos = images.map((image, index) => `
            <button
              type="button"
              class="cms-project-photo"
              data-images="${esc(JSON.stringify(images))}"
              data-index="${index}"
              aria-label="Agrandir la photo"
              style="background-image:url('${esc(image)}')">
            </button>
          `).join("");

          return home
            ? `<article class="project-card">
                <div class="project-project-gallery">${photos}</div>
                <div class="project-body">
                  <h3>${esc(item.title)}</h3>
                  <small>${esc(item.location)}</small>
                  <p>${esc(item.description)}</p>
                  <a href="projets.html">Voir nos projets →</a>
                </div>
              </article>`
            : `<article class="project-large">
                <div class="project-project-gallery">${photos}</div>
                <div class="project-text">
                  <span class="meta">${esc(item.location)} · ${esc(item.category)}</span>
                  <h3>${esc(item.title)}</h3>
                  <p>${esc(item.description)}</p>
                  <a class="text-btn" href="contact.html">Participer au projet →</a>
                </div>
              </article>`;
        })
        .join("");
    });

  } catch (error) {
    console.warn(error);
  }
}

  async function gallery() {
    const areas = document.querySelectorAll("[data-cms-gallery]");
    if (!areas.length) return;
    try {
      const data = await load("content/galerie.json");

      areas.forEach(area => {
        const home = area.getAttribute("data-cms-gallery") === "home";
        area.innerHTML = (data.items || []).map(item => `
          <button type="button" class="${home ? "photo-tile" : "gallery-item"} cms-gallery-photo"
            data-image="${esc(asset(item.image))}" data-title="${esc(item.title)}"
            aria-label="Agrandir ${esc(item.title)}"
            style="background:url('${esc(asset(item.image))}') center/cover">
            <span>${esc(item.title)}</span>
          </button>
        `).join("");
      });

      if (!document.getElementById("cms-gallery-modal")) {
        const modal = document.createElement("div");
        modal.id = "cms-gallery-modal";
        modal.innerHTML = `
          <div class="cms-gallery-backdrop"></div>
          <div class="cms-gallery-window" role="dialog" aria-modal="true">
            <button type="button" class="cms-gallery-close" aria-label="Fermer">×</button>
            <img class="cms-gallery-large" alt="">
            <p class="cms-gallery-caption"></p>
          </div>`;
        document.body.appendChild(modal);

        const style = document.createElement("style");
        style.textContent = `
          .cms-gallery-photo{cursor:pointer;border:0;padding:0;display:block;width:100%;min-height:180px}
          #cms-gallery-modal{display:none;position:fixed;inset:0;z-index:9999}
          #cms-gallery-modal.open{display:block}
          .cms-gallery-backdrop{position:absolute;inset:0;background:rgba(0,0,0,.84)}
          .cms-gallery-window{position:relative;z-index:1;max-width:92vw;margin:4vh auto;text-align:center}
          .cms-gallery-large{max-width:100%;max-height:80vh;border-radius:10px}
          .cms-gallery-caption{color:#fff;font-size:1.05rem;margin:12px}
          .cms-gallery-close{position:absolute;right:-8px;top:-18px;width:38px;height:38px;border:0;border-radius:50%;font-size:28px;cursor:pointer}
        `;
        document.head.appendChild(style);

        const close = () => modal.classList.remove("open");
        modal.querySelector(".cms-gallery-backdrop").addEventListener("click", close);
        modal.querySelector(".cms-gallery-close").addEventListener("click", close);
        document.addEventListener("keydown", e => { if (e.key === "Escape") close(); });
        document.addEventListener("click", e => {
  const photo = e.target.closest(".cms-gallery-photo, .cms-project-photo");
  if (!photo) return;

  if (photo.classList.contains("cms-project-photo")) {
    const images = JSON.parse(photo.dataset.images || "[]");
    const index = Number(photo.dataset.index || 0);

    if (!images.length) return;

    modal.querySelector(".cms-gallery-large").src = images[index];
    modal.querySelector(".cms-gallery-large").alt = "Photo du projet";
    modal.querySelector(".cms-gallery-caption").textContent = "Photo du projet";
  } else {
    modal.querySelector(".cms-gallery-large").src = photo.dataset.image;
    modal.querySelector(".cms-gallery-large").alt = photo.dataset.title || "Photo";
    modal.querySelector(".cms-gallery-caption").textContent = photo.dataset.title || "";
  }

  modal.classList.add("open");
});
      }
    } catch (error) { console.warn(error); }
  }

  async function partners() {
    const areas = document.querySelectorAll("[data-cms-partners]");
    if (!areas.length) return;
    try {
      const data = await load("content/partenaires.json");
      areas.forEach(area => {
        area.innerHTML = (data.items || []).map(item => `
          <article class="partner-card">
            ${item.logo ? `<div class="partner-logo"><img src="${esc(asset(item.logo))}" alt="${esc(item.name)}"></div>` : `<div class="partner-logo">🤝</div>`}
            <h3>${esc(item.name)}</h3>
            ${item.description ? `<p>${esc(item.description)}</p>` : ""}
            ${item.url ? `<a class="text-btn" href="${esc(item.url)}" target="_blank" rel="noopener">Visiter le site →</a>` : ""}
          </article>`).join("");
      });
    } catch (error) { console.warn(error); }
  }

  document.addEventListener("DOMContentLoaded", () => {
    news(); projets(); gallery(); partners();
  });
})();
