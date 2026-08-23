/* =========================================================
   Render isi halaman: undangan, agenda, voting.
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

/* ---------- ambil teks dari TEXT ---------- */

function t(path, fallback = "") {
  const value = String(path)
    .split(".")
    .reduce((node, key) => (node == null ? undefined : node[key]), TEXT);
  return value == null ? fallback : String(value);
}

function applyText() {
  document.querySelectorAll("[data-text]").forEach((el) => {
    el.textContent = t(el.dataset.text, el.textContent);
  });
  document.querySelectorAll("[data-placeholder]").forEach((el) => {
    el.placeholder = t(el.dataset.placeholder, el.placeholder);
  });
}

/* ---------- baris kode undangan ---------- */

function codeLines(guest) {
  return `<p class="hero__code">
    <span class="l">Hi,</span>
    <span class="l l--ind1"><span class="tg">&gt;</span><span class="name">${esc(guest.name)}</span></span>
    <span class="l l--ind2 cm">//You are Invited</span>
    <span class="l l--ind1 tg">&lt;/&gt;</span>
    <span class="l">}</span>
  </p>`;
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
      ${codeLines(guest)}
      <div class="hero__foot">
        <span>// ${esc(EVENT.dateLabel)}</span>
        <a href="https://${esc(EVENT.site)}">${esc(EVENT.site)}</a>
      </div>
    </div>`;

  document.title = `${guest.name} — ${EVENT.title} · ${EVENT.org}`;
}

/* ---------- slide 2: agenda ---------- */

function renderAgenda() {
  const host = $("#agenda-list");
  if (!host) return;

  host.innerHTML = AGENDA.map(
    (a) => `
    <li>
      <span class="tasks__no">${esc(a.no)}</span>
      <span class="tasks__t">${esc(a.title)}</span>
    </li>`
  ).join("");
}

/* ---------- undangan -> loading -> agenda ---------- */

function initGate() {
  const screen = $("#undanganku");
  const gate = $("#gate");
  if (!screen || !gate) return;

  const instant = matchMedia("(prefers-reduced-motion: reduce)").matches;
  let done = false;

  const open = () => {
    if (done) return;
    done = true;
    screen.removeEventListener("wheel", onScrollDown);
    screen.removeEventListener("touchmove", onScrollDown);

    const reveal = () => {
      document.body.dataset.stage = "open";
      $("#agenda").scrollIntoView({ behavior: instant ? "auto" : "smooth" });
    };

    if (instant) {
      reveal();
      return;
    }
    document.body.dataset.stage = "loading";
    setTimeout(reveal, 1300);
  };

  function onScrollDown(e) {
    const down = e.type === "touchmove" || e.deltaY > 0;
    if (down) open();
  }

  gate.addEventListener("click", open);
  screen.addEventListener("wheel", onScrollDown, { passive: true });
  screen.addEventListener("touchmove", onScrollDown, { passive: true });
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
    btn.textContent = dark ? t("theme.light") : t("theme.dark");
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
  applyText();
  const guest = currentGuest();
  renderHero(guest);
  renderAgenda();
  initTheme();
  initGate();
  initVoting();

  const foot = $("#foot-site");
  if (foot) {
    foot.textContent = EVENT.site;
    foot.href = `https://${EVENT.site}`;
  }
}

document.addEventListener("DOMContentLoaded", boot);
