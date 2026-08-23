/* =========================================================
   Voting tanggal — kalender, heatmap, sinkron antar orang.

   Pilih tanggal dulu (masih draft, tersimpan di browser sendiri),
   baru submit. Yang sudah disubmit langsung kelihatan semua orang
   dan ikut ngewarnain heatmap.
   ========================================================= */

const DOW = ["Sen", "Sel", "Rab", "Kam", "Jum", "Sab", "Min"];
const MONTHS = [
  "Januari", "Februari", "Maret", "April", "Mei", "Juni",
  "Juli", "Agustus", "September", "Oktober", "November", "Desember",
];

const store = makeStore();

/* Yang sudah disubmit semua orang. */
let votes = {};
/* Pilihan orang ini, belum tentu sudah disubmit. */
let draft = [];
/* Siapa yang voting ditentukan link undangannya, bukan diketik. */
let me = "";

let poll = null;
let lastSeen = "";

const iso = (y, m, d) =>
  `${y}-${String(m).padStart(2, "0")}-${String(d).padStart(2, "0")}`;

const submitted = (user) => Boolean(votes[user] && votes[user].dates.length);

const sameDates = (a, b) =>
  a.length === b.length && a.every((d, i) => d === b[i]);

/* ---------- hitung-hitungan ---------- */

function tally() {
  const counts = new Map();
  Object.entries(votes).forEach(([user, entry]) => {
    entry.dates.forEach((date) => {
      if (!counts.has(date)) counts.set(date, []);
      counts.get(date).push(user);
    });
  });
  return counts;
}

function heatLevel(count, max) {
  if (!count) return 0;
  if (max <= 1) return 3;
  return Math.max(1, Math.min(5, Math.ceil((count / max) * 5)));
}

/* ---------- kalender ---------- */

function renderCalendar() {
  const host = document.querySelector("#cal-grid");
  if (!host) return;

  const counts = tally();
  const max = counts.size ? Math.max(...[...counts.values()].map((u) => u.length)) : 0;
  const mine = new Set(draft);

  const { year, month } = VOTE;
  const first = new Date(year, month - 1, 1);
  const total = new Date(year, month, 0).getDate();
  /* getDay(): 0 = Minggu. Geser supaya minggu mulai Senin. */
  const lead = (first.getDay() + 6) % 7;

  const cells = DOW.map((d) => `<div class="cal__dow">${d}</div>`);

  for (let i = 0; i < lead; i += 1) {
    cells.push('<div class="day day--empty" aria-hidden="true"></div>');
  }

  for (let d = 1; d <= total; d += 1) {
    const date = iso(year, month, d);
    const taggers = counts.get(date) || [];
    const level = heatLevel(taggers.length, max);
    const dow = new Date(year, month - 1, d).getDay();

    const classes = [
      "day",
      level ? `day--h${level}` : "",
      mine.has(date) ? "day--mine" : "",
      dow === 0 || dow === 6 ? "day--weekend" : "",
    ]
      .filter(Boolean)
      .join(" ");

    cells.push(`
      <button type="button" class="${classes}"
              data-date="${date}"
              title="${esc(taggers.join(", "))}"
              aria-label="${esc(`${d} ${MONTHS[month - 1]} ${year} — ${taggers.length} suara`)}"
              aria-pressed="${mine.has(date)}">
        <span class="day__n">${d}</span>
        <span class="day__c">${taggers.length || ""}</span>
      </button>`);
  }

  host.innerHTML = cells.join("");

  host.querySelectorAll("[data-date]").forEach((btn) => {
    btn.addEventListener("click", () => toggleDate(btn.dataset.date));
  });

  const label = document.querySelector("#cal-month");
  if (label) label.textContent = `${MONTHS[month - 1]} ${year}`;

  renderTop3(counts, max);
  renderStats(counts);
  renderRoster();
  paintIdentity();
  renderThanks(counts, max);
}

/* ---------- tiga tanggal terbanyak ---------- */

const dayLabel = (date) =>
  `${Number(date.slice(8, 10))} ${MONTHS[VOTE.month - 1].slice(0, 3)}`;

function rankRows(counts) {
  return [...counts.entries()].sort(
    (a, b) => b[1].length - a[1].length || a[0].localeCompare(b[0])
  );
}

function top3HTML(counts, max) {
  const rows = rankRows(counts).slice(0, 3);
  if (!rows.length) return '<li class="empty">&mdash;</li>';

  return rows
    .map(([date, users], i) => {
      const pct = max ? Math.round((users.length / max) * 100) : 0;
      return `
        <li title="${esc(users.join(", "))}">
          <span class="top3__pos">${i + 1}</span>
          <span class="top3__date">${dayLabel(date)}</span>
          <span class="top3__bar"><span style="width:${pct}%"></span></span>
          <span class="top3__n">${users.length}</span>
        </li>`;
    })
    .join("");
}

function renderTop3(counts, max) {
  const host = document.querySelector("#top3");
  if (host) host.innerHTML = top3HTML(counts, max);
}

/* Halaman terakhir: tanggal pilihan orang ini + hasil sementara. */
function renderThanks(counts, max) {
  const mine = document.querySelector("#thanks-mine");
  if (mine) {
    const sent = votes[me] ? votes[me].dates : [];
    mine.innerHTML = sent.length
      ? sent.map((d) => `<span class="pick">${dayLabel(d)}</span>`).join("")
      : '<span class="empty">&mdash;</span>';
  }

  const top = document.querySelector("#thanks-top3");
  if (top) top.innerHTML = top3HTML(counts, max);
}

function renderStats(counts) {
  const people = Object.keys(votes).filter((u) => votes[u].dates.length).length;
  const tags = [...counts.values()].reduce((sum, u) => sum + u.length, 0);
  const best = [...counts.entries()].sort((a, b) => b[1].length - a[1].length)[0];

  const set = (id, value) => {
    const el = document.querySelector(id);
    if (el) el.textContent = value;
  };

  set("#stat-people", `${people}/${GUESTS.length}`);
  set("#stat-tags", String(tags));
  set(
    "#stat-top",
    best ? `${Number(best[0].slice(8, 10))} ${MONTHS[VOTE.month - 1].slice(0, 3)}` : "—"
  );
}

/* Siapa dari 12 orang yang sudah submit. */
function renderRoster() {
  const host = document.querySelector("#roster");
  if (!host) return;

  host.innerHTML = GUESTS.map(
    (g) => `
    <span class="rost ${submitted(g.slug) ? "rost--in" : ""}"
          title="${esc(submitted(g.slug) ? g.name + " sudah submit" : g.name + " belum submit")}">
      ${esc(g.slug)}
    </span>`
  ).join("");
}

/* ---------- aksi ---------- */

function toggleDate(date) {
  const cap = VOTE.maxPicksPerUser;
  const at = draft.indexOf(date);

  if (at >= 0) draft.splice(at, 1);
  else {
    if (cap > 0 && draft.length >= cap) {
      say(`maks ${cap} tanggal`);
      return;
    }
    draft.push(date);
    draft.sort();
  }

  Draft.set(me, draft);
  say("");
  renderCalendar();
}

async function submitVote() {
  if (!draft.length) return;

  say("mengirim…");

  /* Baca ulang dulu supaya submit orang lain nggak ketimpa. */
  try {
    votes = await store.read();
  } catch (e) {
    say(reachMsg(e));
    return;
  }

  votes[me] = { dates: [...draft], at: Date.now() };

  try {
    await store.write(votes);
  } catch (e) {
    say(reachMsg(e));
    return;
  }

  lastSeen = JSON.stringify(votes);
  say("");
  renderCalendar();
  return true;
}

async function clearVote() {
  try {
    votes = await store.read();
  } catch {
    /* pakai salinan yang ada */
  }

  delete votes[me];
  draft = [];
  Draft.set(me, draft);

  try {
    await store.write(votes);
    say("terhapus");
  } catch {
    say("gagal simpan");
  }

  lastSeen = JSON.stringify(votes);
  renderCalendar();
}

/* Kalau fetch-nya sendiri yang ditolak (bukan status HTTP), berarti
   halaman ini nggak diizinkan nyambung keluar — bukan salah server. */
function reachMsg(err) {
  const m = String((err && err.message) || err);
  if (/^(GET|PUT) \d+/.test(m)) return `server nolak (${m})`;
  return "halaman ini nggak bisa nyambung ke server voting";
}

function say(message) {
  const el = document.querySelector("#vote-msg");
  if (el) el.textContent = message;
}

/* ---------- identitas & tombol submit ---------- */

function paintIdentity() {
  const nameEl = document.querySelector("#vote-name");
  if (nameEl) nameEl.textContent = me;

  const countEl = document.querySelector("#vote-mine");
  if (countEl) countEl.textContent = String(draft.length);

  const btn = document.querySelector("#submit");
  if (!btn) return;

  /* Seed bikin 12 entri kosong duluan, jadi "pernah submit" diukur dari
     ada-nya tanggal, bukan ada-nya entri. */
  const sent = votes[me] && votes[me].dates.length ? votes[me].dates : null;
  const unchanged = sent !== null && sameDates(sent, draft);

  btn.disabled = draft.length === 0 || unchanged;
  btn.textContent = sent ? t("btn.resubmit") : t("btn.submit");
}

/* ---------- sinkron ---------- */

async function pull() {
  let fresh;
  try {
    fresh = await store.read();
  } catch (e) {
    say(reachMsg(e));
    return;
  }

  const stamp = JSON.stringify(fresh);
  if (stamp === lastSeen) return;

  lastSeen = stamp;
  votes = fresh;
  renderCalendar();
}

function startPolling() {
  const every = VOTE.pollSeconds * 1000;
  if (!every) return;

  const section = document.querySelector("#voting");
  let onScreen = true;

  /* Kuota JSONBin gratis nggak besar, jadi jangan narik data pas
     kalendernya nggak kelihatan — tab di background atau orangnya
     masih di bagian undangan. */
  if (section && "IntersectionObserver" in window) {
    onScreen = false;
    new IntersectionObserver((entries) => {
      onScreen = entries.some((e) => e.isIntersecting);
      if (onScreen) pull();
    }).observe(section);
  }

  const tick = () => {
    if (document.visibilityState === "visible" && onScreen) pull();
  };

  clearInterval(poll);
  poll = setInterval(tick, every);

  document.addEventListener("visibilitychange", tick);
}

/* ---------- start ---------- */

function initVoting(guest) {
  me = guest ? guest.slug : "";

  const mode = document.querySelector("#vote-mode");
  if (mode) mode.textContent = store.mode === "remote" ? t("vote.sync") : t("vote.lokal");

  const submit = document.querySelector("#submit");
  const back = document.querySelector("#thanks-back");
  const edit = document.querySelector("#thanks-edit");
  const reset = document.querySelector("#tool-reset");

  if (submit) {
    submit.addEventListener("click", async () => {
      if (await submitVote()) {
        document.body.dataset.stage = "done";
        playRise(document.querySelector("#thanks"));
      }
    });
  }

  if (back) {
    back.addEventListener("click", () => {
      document.body.dataset.stage = "open";
      window.scrollTo({ top: 0, behavior: "smooth" });
    });
  }

  if (edit) {
    edit.addEventListener("click", () => {
      document.body.dataset.stage = "open";
      document.querySelector("#voting").scrollIntoView({ behavior: "smooth" });
    });
  }

  if (reset) {
    let armed = false;
    let timer = null;

    const disarm = () => {
      armed = false;
      clearTimeout(timer);
      reset.textContent = t("btn.hapus");
    };

    reset.addEventListener("click", () => {
      if (!armed) {
        armed = true;
        reset.textContent = t("btn.hapusYakin");
        timer = setTimeout(disarm, 4000);
        return;
      }
      disarm();
      clearVote();
    });
  }

  draft = Draft.get(me) || [];
  renderCalendar();

  loadFirst();
  startPolling();
}

async function loadFirst() {
  try {
    votes = await store.read();
    lastSeen = JSON.stringify(votes);
  } catch (e) {
    votes = {};
    say(reachMsg(e));
  }

  /* Kalau sudah pernah submit dan belum ada draft, pakai yang tersubmit. */
  if (!draft.length && votes[me]) {
    draft = [...votes[me].dates];
    Draft.set(me, draft);
  }

  renderCalendar();
}
