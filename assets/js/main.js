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
    <span class="l" data-rise style="--d:0.10s">Hi,</span>
    <span class="l l--ind1" data-rise style="--d:0.22s"><span class="tg">&gt;</span><span class="name">${esc(guest.name)}</span></span>
    <span class="l l--ind2 cm" data-rise style="--d:0.34s">//You are Invited</span>
    <span class="l l--ind1 tg" data-rise style="--d:0.46s">&lt;/&gt;</span>
    <span class="l" data-rise style="--d:0.58s">}</span>
  </p>`;
}

/* ---------- animasi muncul ---------- */

function playRise(scope) {
  /* Dua frame: yang pertama buat ngecat posisi awal, kalau nggak
     transisinya kelewat dan elemennya langsung nongol. */
  requestAnimationFrame(() => {
    requestAnimationFrame(() => {
      scope.querySelectorAll("[data-rise]").forEach((el) => {
        el.dataset.in = "true";
      });
    });
  });
}

/* Yang di bawah lipatan baru muncul begitu ke-scroll. */
function watchRise(scope) {
  const items = [...scope.querySelectorAll("[data-rise]")];
  if (!items.length) return;

  if (!("IntersectionObserver" in window)) {
    items.forEach((el) => (el.dataset.in = "true"));
    return;
  }

  const io = new IntersectionObserver(
    (entries) => {
      entries.forEach((e) => {
        if (!e.isIntersecting) return;
        e.target.dataset.in = "true";
        io.unobserve(e.target);
      });
    },
    { rootMargin: "0px 0px -8% 0px" }
  );
  items.forEach((el) => io.observe(el));
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
      <div class="hero__foot" data-rise style="--d:0.74s">
        <span>// ${esc(EVENT.dateLabel)}</span>
        <a href="https://${esc(EVENT.site)}">${esc(EVENT.site)}</a>
      </div>
    </div>`;

  playRise(host);
  document.title = `${guest.name} — ${EVENT.title} · ${EVENT.org}`;
}

/* ---------- slide 2: agenda ---------- */

function renderAgenda() {
  const host = $("#agenda-list");
  if (!host) return;

  host.innerHTML = AGENDA.map(
    (a, i) => `
    <li data-rise style="--d:${i * 0.09}s">
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

  playRise(screen);

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
      playRise($("#agenda"));
      setTimeout(armCue, instant ? 0 : 800);
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

/* ---------- petunjuk scroll ---------- */

/* Cue-nya hilang setelah orangnya benar-benar scroll, bukan sekadar
   begitu section voting kesenggol layar. */
function armCue() {
  const cue = $("#cue");
  if (!cue) return;

  const base = window.scrollY;

  const onScroll = () => {
    if (window.scrollY - base < 80) return;
    cue.dataset.seen = "true";
    window.removeEventListener("scroll", onScroll);
  };

  window.addEventListener("scroll", onScroll, { passive: true });
}

/* ---------- start ---------- */

function boot() {
  applyText();
  const guest = currentGuest();
  renderHero(guest);
  renderAgenda();
  initGate();
  watchRise($("#voting"));
  initVoting(guest);

  const foot = $("#foot-site");
  if (foot) {
    foot.textContent = EVENT.site;
    foot.href = `https://${EVENT.site}`;
  }
}

document.addEventListener("DOMContentLoaded", boot);
