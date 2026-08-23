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

/* ---------- logo ---------- */

/* Dipakai di header, footer, dan halaman terakhir dengan ukuran beda,
   jadi digambar sekali di sini. */
function logosHTML(size) {
  const g = Math.round(size * 0.92);
  return `
    <span class="logos" style="--logo:${size}px">
      <svg class="logo logo--claude" viewBox="0 0 100 100" width="${size}" height="${size}" aria-hidden="true">
        <g stroke="currentColor" stroke-width="9" stroke-linecap="round" transform="translate(50 50)">
          <line y1="-38" y2="38"/>
          <line y1="-38" y2="38" transform="rotate(30)"/>
          <line y1="-38" y2="38" transform="rotate(60)"/>
          <line y1="-38" y2="38" transform="rotate(90)"/>
          <line y1="-38" y2="38" transform="rotate(120)"/>
          <line y1="-38" y2="38" transform="rotate(150)"/>
        </g>
      </svg>
      <svg class="logo" viewBox="0 0 24 24" width="${g}" height="${g}" aria-hidden="true">
        <path fill="currentColor" d="M4 0h16v8h-8zM4 8h8l8 8H4zM4 16h8v8z"/>
      </svg>
      <svg class="logo" viewBox="0 0 24 24" width="${size}" height="${size}" aria-hidden="true">
        <path fill="currentColor" d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12"/>
      </svg>
    </span>`;
}

function renderLogos() {
  const spots = [["#logos-head", 15], ["#logos-foot", 18], ["#logos-thanks", 38]];
  spots.forEach(([sel, size]) => {
    const host = $(sel);
    if (host) host.innerHTML = logosHTML(size);
  });
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

/* ---------- glitch undangan ---------- */

const NOISE = "!<>-_\\/[]{}=+*^?#%$&@01";

const noiseLike = (text) =>
  [...text]
    .map((ch) => (ch === " " ? " " : NOISE[Math.floor(Math.random() * NOISE.length)]))
    .join("");

/* Tiap baris ngaco dulu sebentar — merah, huruf acak — baru
   ngebenerin diri jadi teks yang bener. */
function glitchLine(line, delay) {
  const finalHTML = line.innerHTML;
  const text = line.textContent;

  line.textContent = noiseLike(text);
  line.classList.add("l--err");
  line.style.visibility = "hidden";

  const scrambleFor = 420;
  const frame = 55;

  setTimeout(() => {
    line.style.visibility = "";
    let elapsed = 0;

    const tick = setInterval(() => {
      elapsed += frame;
      if (elapsed >= scrambleFor) {
        clearInterval(tick);
        line.classList.remove("l--err");
        line.classList.add("l--ok");
        line.innerHTML = finalHTML;
        setTimeout(() => line.classList.remove("l--ok"), 420);
        return;
      }
      line.textContent = noiseLike(text);
    }, frame);
  }, delay);
}

function playGlitch(card) {
  const lines = [...card.querySelectorAll(".hero__code .l")];
  if (!lines.length) return;

  if (matchMedia("(prefers-reduced-motion: reduce)").matches) return;

  lines.forEach((line, i) => glitchLine(line, 120 + i * 150));
}

/* ---------- siapa yang diundang ---------- *//* ---------- siapa yang diundang ---------- */

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
      <div class="hero__foot" data-rise style="--d:0.10s">
        <span>// ${esc(EVENT.dateLabel)}</span>
        <a href="https://${esc(EVENT.site)}">${esc(EVENT.site)}</a>
      </div>
    </div>
    <button type="button" class="runbar" id="gate" data-rise style="--d:0.35s"
            aria-label="Lanjut ke agenda">
      <span class="runbar__mark">${esc(t("gate"))}</span>
      <svg class="runbar__chev" viewBox="0 0 24 14" width="20" height="12" aria-hidden="true">
        <path d="M2 2l10 10L22 2" fill="none" stroke="currentColor"
              stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"/>
      </svg>
      <span class="runbar__sweep" aria-hidden="true"></span>
    </button>`;

  playGlitch(host);
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
  renderLogos();
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
