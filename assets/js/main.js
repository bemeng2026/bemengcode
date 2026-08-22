/* =========================================================
   Render isi halaman: undangan, agenda, persiapan, galeri.
   ========================================================= */

const $ = (sel, root = document) => root.querySelector(sel);

function esc(str) {
  return String(str).replace(/[&<>"']/g, (c) => ({
    "&": "&amp;",
    "<": "&lt;",
    ">": "&gt;",
    '"': "&quot;",
    "'": "&#39;",
  })[c]);
}

/* ---------- baris kode undangan ---------- */

function codeLines(guest, { big }) {
  const cls = big ? "hero__code" : "inv__code";
  const rows = guest.code.map((line) => {
    switch (line.t) {
      case "prompt": {
        const prefix = line.p === undefined ? "&gt;" : esc(line.p);
        return `<span class="l l--ind1"><span class="tg">${prefix}</span><span class="name">${esc(line.v)}</span></span>`;
      }
      case "comment":
        return `<span class="l l--ind2 cm">${esc(line.v)}</span>`;
      case "tag":
        return `<span class="l l--ind1 tg">${esc(line.v)}</span>`;
      default:
        return `<span class="l">${esc(line.v)}</span>`;
    }
  });
  return `<p class="${cls}">${rows.join("")}</p>`;
}

/* ---------- siapa yang diundang ---------- */

function currentGuest() {
  const params = new URLSearchParams(location.search);
  const raw = (params.get("u") || params.get("guest") || location.hash.slice(1) || "")
    .trim()
    .toLowerCase();
  return GUESTS.find((g) => g.slug === raw) || GUESTS[0];
}

/* ---------- slide 1: undangan ---------- */

function renderHero(guest) {
  const host = $("#hero-card");
  if (!host) return;

  host.innerHTML = `
    <div class="card__bar">
      <span class="dot dot--r"></span>
      <span class="dot dot--y"></span>
      <span class="dot dot--g"></span>
      <span class="card__file">invitation/${esc(guest.slug)}.html</span>
    </div>
    <div class="hero__body">
      ${codeLines(guest, { big: true })}
      <dl class="hero__meta">
        <div><dt>ACARA</dt><dd>${esc(EVENT.title)}</dd></div>
        <div><dt>TANGGAL</dt><dd>// ${esc(EVENT.dateLabel)}</dd></div>
        <div><dt>TEMPAT</dt><dd>${esc(EVENT.place)}</dd></div>
        <div><dt>DRESS CODE</dt><dd>${esc(EVENT.dressCode)}</dd></div>
      </dl>
      <div class="hero__actions">
        <a class="btn" href="#voting">Isi voting tanggal</a>
        <a class="btn btn--ghost" href="#agenda">Lihat agenda</a>
        <a class="btn btn--ghost" href="#undangan">Undangan lainnya</a>
      </div>
    </div>`;

  const label = $("#hero-guest");
  if (label) label.textContent = guest.name;
  document.title = `${guest.name} — ${EVENT.title} · ${EVENT.org}`;
}

/* ---------- slide 2: agenda ---------- */

function renderAgenda() {
  const host = $("#agenda-list");
  if (!host) return;

  host.innerHTML = AGENDA.map(
    (a) => `
    <article class="ag">
      <div class="ag__no">${esc(a.no)}</div>
      <div>
        <span class="ag__tag">${esc(a.tag)}</span>
        <h3 class="ag__title">${esc(a.title)}</h3>
        <p class="ag__desc">${esc(a.desc)}</p>
        <ul class="ag__items">
          ${a.items.map((i) => `<li>${esc(i)}</li>`).join("")}
        </ul>
      </div>
    </article>`
  ).join("");
}

/* ---------- slide 3: to do & persiapan ---------- */

function checkItem(id, item, index) {
  const key = `${id}-${index}`;
  const note = item.url
    ? `<a class="check__note" href="${esc(item.url)}" target="_blank" rel="noopener noreferrer">${esc(item.note)} &nearr;</a>`
    : `<span class="check__note">${esc(item.note)}</span>`;
  return `
    <li>
      <input type="checkbox" id="ck-${esc(key)}" data-prep="${esc(key)}">
      <label for="ck-${esc(key)}">
        <span class="check__label">${esc(item.label)}</span>
        ${note}
      </label>
    </li>`;
}

function renderPrep() {
  const map = [
    ["#prep-todo", "todo", PREP.todo],
    ["#prep-download", "dl", PREP.download],
    ["#prep-bring", "bring", PREP.bring],
  ];

  map.forEach(([sel, id, items]) => {
    const host = $(sel);
    if (host) host.innerHTML = items.map((it, i) => checkItem(id, it, i)).join("");
  });

  const saved = Prefs.getPrep();
  document.querySelectorAll("[data-prep]").forEach((box) => {
    box.checked = Boolean(saved[box.dataset.prep]);
    box.addEventListener("change", () => {
      const next = Prefs.getPrep();
      if (box.checked) next[box.dataset.prep] = true;
      else delete next[box.dataset.prep];
      Prefs.setPrep(next);
      updatePrepCount();
    });
  });

  updatePrepCount();
}

function updatePrepCount() {
  const boxes = document.querySelectorAll("[data-prep]");
  const done = document.querySelectorAll("[data-prep]:checked").length;
  const el = $("#prep-count");
  if (el) el.textContent = `${done}/${boxes.length} beres`;
}

/* ---------- galeri 12 undangan ---------- */

function renderGallery(active) {
  const host = $("#gallery");
  if (!host) return;

  host.innerHTML = GUESTS.map(
    (g) => `
    <a class="inv inv--${esc(g.accent)}"
       href="?u=${encodeURIComponent(g.slug)}"
       aria-current="${g.slug === active.slug}">
      <span class="inv__who">${esc(g.variant)} &middot; ${esc(g.name)}</span>
      ${codeLines(g, { big: false })}
      <span class="inv__mark">&lt;/&gt;</span>
      <span class="inv__site">${esc(EVENT.site)}</span>
    </a>`
  ).join("");
}

/* ---------- tema terang / gelap ---------- */

function initTheme() {
  const btn = $("#theme");
  if (!btn) return;

  const KEY = "bemftui2026.theme";
  let saved = null;
  try {
    saved = localStorage.getItem(KEY);
  } catch {
    /* diabaikan */
  }
  if (saved) document.documentElement.dataset.theme = saved;

  const paint = () => {
    const dark =
      document.documentElement.dataset.theme === "dark" ||
      (!document.documentElement.dataset.theme &&
        matchMedia("(prefers-color-scheme: dark)").matches);
    btn.textContent = dark ? "// light" : "// dark";
    btn.setAttribute("aria-label", dark ? "Ganti ke tema terang" : "Ganti ke tema gelap");
  };

  btn.addEventListener("click", () => {
    const dark =
      document.documentElement.dataset.theme === "dark" ||
      (!document.documentElement.dataset.theme &&
        matchMedia("(prefers-color-scheme: dark)").matches);
    document.documentElement.dataset.theme = dark ? "light" : "dark";
    try {
      localStorage.setItem(KEY, document.documentElement.dataset.theme);
    } catch {
      /* diabaikan */
    }
    paint();
  });

  paint();
}

/* ---------- start ---------- */

function boot() {
  const guest = currentGuest();
  renderHero(guest);
  renderAgenda();
  renderPrep();
  renderGallery(guest);
  initTheme();
  initVoting();

  const year = $("#year");
  if (year) year.textContent = new Date().getFullYear();
}

document.addEventListener("DOMContentLoaded", boot);
