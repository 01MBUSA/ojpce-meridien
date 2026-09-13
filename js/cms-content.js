(function () {
  "use strict";

  const esc = (value) =>
    String(value ?? "").replace(/[&<>"]/g, (c) => ({
      "&": "&amp;",
      "<": "&lt;",
      ">": "&gt;",
      '"': "&quot;"
    }[c]));

  const asset = (value) => {
    if (!value) return "";
    if (/^https?:\/\//i.test(value)) return value;
    return value.startsWith("/") ? value : "/" + value;
  };

  async function load(file) {
    const response = await fetch(file + "?v=" + Date.now());
    if (!response.ok) throw new Error(file);
    return response.json();
  }

  async function news() {
    const containers = document.querySelectorAll("[data-cms-news]");
    if (!containers.length) return;

    try {
      const data = await load("content/actualites.json");

      const html = (data.items || []).map((item, index) => `
        <article class="news-card">
          <a href="actualite.html?id=${index}" aria-label="Consulter ${esc(item.title)}">
            ${
              item.image
                ? `<div class="news-cover" style="background:url('${esc(asset(item.image))}') center/cover" aria-label="${esc(item.title)}"></div>`
                : `<div class="news-cover">📰</div>`
            }
          </a>
          <div class="news-text">
            <span class="date">${esc(item.category)}</span>
            <h3>${esc(item.title)}</h3>
            <p>${esc(item.excerpt)}</p>
            <a class="text-btn" href="actualite.html?id=${index}">Voir l’actualité →</a>
          </div>
        </article>
      `).join("");

      containers.forEach((container) => {
        container.innerHTML = html;
      });
    } catch (error) {
      console.warn(error);
    }
  }

  async function projects() {
    const containers = document.querySelectorAll("[data-cms-projects]");
    if (!containers.length) return;

    try {
      const data = await load("content/projets.json");

      containers.forEach((container) => {
        const home = container.getAttribute("data-cms-projects") === "home";

        container.innerHTML = (data.items || [])
          .slice(0, home ? 3 : 999)
          .map((item) => home
            ? `<article class="project-card">
                <div class="project-image photo" style="background-image:url('${esc(asset(item.image))}')"></div>
                <div class="project-body">
                  <h3>${esc(item.title)}</h3>
                  <small>⌖ ${esc(item.location)}</small>
                  <p>${esc(item.description)}</p>
                  <a href="projets.html">Voir nos projets →</a>
                </div>
              </article>`
            : `<article class="project-large">
                <div class="project-banner" style="background:url('${esc(asset(item.image))}') center/cover"></div>
                <div class="project-text">
                  <span class="meta">${esc(item.location)} · ${esc(item.category)}</span>
                  <h3>${esc(item.title)}</h3>
                  <p>${esc(item.description)}</p>
                  <a class="text-btn" href="contact.html">Participer au projet →</a>
                </div>
              </article>`
          ).join("");
      });
    } catch (error) {
      console.warn(error);
    }
  }

  async function gallery() {
    const containers = document.querySelectorAll("[data-cms-gallery]");
    if (!containers.length) return;

    try {
      const data = await load("content/galerie.json");

      containers.forEach((container) => {
        const home = container.getAttribute("data-cms-gallery") === "home";

        container.innerHTML = (data.items || []).map((item) => `
          <div class="${home ? "photo-tile" : "gallery-item"}"
               style="background:url('${esc(asset(item.image))}') center/cover">
            <span>${esc(item.title)}</span>
          </div>
        `).join("");
      });
    } catch (error) {
      console.warn(error);
    }
  }

  async function partners() {
    const containers = document.querySelectorAll("[data-cms-partners]");
    if (!containers.length) return;

    try {
      const data = await load("content/partenaires.json");

      containers.forEach((container) => {
        const items = data.items || [];

        container.innerHTML = items.length
          ? items.map((item) => `
              <article class="partner-card">
                ${
                  item.logo
                    ? `<div class="partner-logo"><img src="${esc(asset(item.logo))}" alt="${esc(item.name)}"></div>`
                    : `<div class="partner-logo">🤝</div>`
                }
                <h3>${esc(item.name)}</h3>
                ${item.description ? `<p>${esc(item.description)}</p>` : ""}
                ${
                  item.url
                    ? `<a class="text-btn" href="${esc(item.url)}" target="_blank" rel="noopener">Visiter le site →</a>`
                    : ""
                }
              </article>
            `).join("")
          : `<article class="partner-card">
              <div class="partner-logo">🤝</div>
              <h3>Votre partenaire</h3>
              <p>Les partenaires ajoutés depuis l’espace d’administration apparaîtront ici.</p>
            </article>`;
      });
    } catch (error) {
      console.warn(error);
    }
  }

  document.addEventListener("DOMContentLoaded", () => {
    news();
    projects();
    gallery();
    partners();
  });
})();
