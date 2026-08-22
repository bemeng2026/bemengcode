/* =========================================================
   Voting tanggal — kalender penuh + heatmap.

   Satu orang = satu username. Tiap orang bisa nge-tag
   berapa pun tanggal kosong, dan satu tanggal boleh ditag
   banyak orang. Makin banyak yang nge-tag, makin gelap
   kotaknya di heatmap.
   ========================================================= */

const DOW = ["Sen", "Sel", "Rab", "Kam", "Jum", "Sab", "Min"];
const MONTHS = [
  "Januari", "Februari", "Maret", "April", "Mei", "Juni",
  "Juli", "Agustus", "September", "Oktober", "November", "Desember",
];

const store = makeStore();

/* seluruh voting: { username: ["2026-09-09", ...] } */
let votes = {};
let me = "";

const iso = (y, m, d) =>
  `${y}-${String(m).padStart(2, "0")}-${String(d).padStart(2, "0")}`;

/* username: huruf kecil, angka, titik, strip, underscore */
function normalizeUser(raw) {
  return String(raw || "")
    .trim()
    .toLowerCase()
    .replace(/\s+/g, "")
    .replace(/[^a-z0-9._-]/g, "")
    .slice(0, 20);
}

/* ---------- hitung-hitungan ---------- */

function tally() {
  const counts = new Map();
  Object.entries(votes).forEach(([user, dates]) => {
    (Array.isArray(dates) ? dates : []).forEach((date) => {
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

/* ---------- render kalender ---------- */

function renderCalendar() {
  const host = document.querySelector("#cal-grid");
  if (!host) return;

  const counts = tally();
  const max = counts.size ? Math.max(...[...counts.values()].map((u) => u.length)) : 0;
  const mine = new Set(votes[me] || []);

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
    const weekend = dow === 0 || dow === 6;

    const classes = [
      "day",
      level ? `day--h${level}` : "",
      mine.has(date) ? "day--mine" : "",
      weekend ? "day--weekend" : "",
    ]
      .filter(Boolean)
      .join(" ");

    const who = taggers.length ? taggers.join(", ") : "";
    const label = `${d} ${MONTHS[month - 1]} ${year} — ${taggers.length} suara`;

    cells.push(`
      <button type="button" class="${classes}"
              data-date="${date}"
              title="${esc(who)}"
              aria-label="${esc(label)}"
              aria-pressed="${mine.has(date)}"
              ${me ? "" : "disabled"}>
        <span class="day__n">${d}</span>
        <span class="day__c">${taggers.length || ""}</span>
      </button>`);
  }

  host.innerHTML = cells.join("");

  host.querySelectorAll("[data-date]").forEach((btn) => {
    btn.addEventListener("click", () => toggleDate(btn.dataset.date));
  });

  const month_ = document.querySelector("#cal-month");
  if (month_) month_.textContent = `${MONTHS[month - 1]} ${year}`;

  renderRanking(counts, max);
  renderStats(counts);
  paintIdentity();
}

/* ---------- papan peringkat ---------- */

function renderRanking(counts, max) {
  const host = document.querySelector("#rank");
  if (!host) return;

  const rows = [...counts.entries()]
    .filter(([, users]) => users.length > 0)
    .sort((a, b) => b[1].length - a[1].length || a[0].localeCompare(b[0]))
    .slice(0, 8);

  if (!rows.length) {
    host.innerHTML =
      '<li class="empty">&mdash;</li>';
    return;
  }

  host.innerHTML = rows
    .map(([date, users], i) => {
      const day = Number(date.slice(8, 10));
      const pct = max ? Math.round((users.length / max) * 100) : 0;
      return `
        <li title="${esc(users.join(", "))}">
          <span class="rank__pos">${i + 1}.</span>
          <span class="rank__date">${day} ${MONTHS[VOTE.month - 1].slice(0, 3)}</span>
          <span class="rank__bar"><span class="rank__fill" style="width:${pct}%"></span></span>
          <span class="rank__n">${users.length}</span>
        </li>`;
    })
    .join("");
}

function renderStats(counts) {
  const people = Object.keys(votes).filter((u) => (votes[u] || []).length).length;
  const tags = [...counts.values()].reduce((sum, u) => sum + u.length, 0);
  const best = [...counts.entries()].sort((a, b) => b[1].length - a[1].length)[0];

  const set = (id, value) => {
    const el = document.querySelector(id);
    if (el) el.textContent = value;
  };

  set("#stat-people", `${people}/${VOTE.maxParticipants}`);
  set("#stat-tags", String(tags));
  set(
    "#stat-top",
    best ? `${Number(best[0].slice(8, 10))} ${MONTHS[VOTE.month - 1].slice(0, 3)}` : "—"
  );
}

/* ---------- aksi ---------- */

async function toggleDate(date) {
  if (!me) return;

  /* baca ulang dulu supaya tag orang lain nggak ketimpa */
  try {
    votes = await store.read();
  } catch {
    /* pakai salinan yang ada kalau gagal ambil */
  }

  const mine = new Set(votes[me] || []);
  if (mine.has(date)) mine.delete(date);
  else {
    const cap = VOTE.maxPicksPerUser;
    if (cap > 0 && mine.size >= cap) {
      say(`maks ${cap} tanggal`);
      return;
    }
    mine.add(date);
  }

  votes[me] = [...mine].sort();
  if (!votes[me].length) delete votes[me];

  renderCalendar();

  try {
    await store.write(votes);
    say("");
  } catch {
    say("gagal simpan");
  }
}

function say(message) {
  const el = document.querySelector("#vote-msg");
  if (el) el.textContent = message;
}

/* ---------- identitas ---------- */

function setUser(name) {
  me = normalizeUser(name);
  Prefs.setUser(me);
  renderCalendar();
}

function paintIdentity() {
  const form = document.querySelector("#vote-form");
  const who = document.querySelector("#vote-who");
  if (!form || !who) return;

  form.hidden = Boolean(me);
  who.hidden = !me;

  const nameEl = document.querySelector("#vote-name");
  if (nameEl) nameEl.textContent = me || "";

  const countEl = document.querySelector("#vote-mine");
  if (countEl) {
    countEl.textContent = String((votes[me] || []).length);
  }
}

/* ---------- alat bantu ---------- */

function summaryText() {
  const counts = tally();
  const rows = [...counts.entries()].sort((a, b) => b[1].length - a[1].length);
  const head = `${MONTHS[VOTE.month - 1]} ${VOTE.year}`;
  if (!rows.length) return head;
  const body = rows
    .map(([date, users]) => `${date} ${users.length} ${users.join(",")}`)
    .join("\n");
  return `${head}\n${body}`;
}

function initTools() {
  const copy = document.querySelector("#tool-copy");
  const reset = document.querySelector("#tool-reset");
  const refresh = document.querySelector("#tool-refresh");

  if (copy) {
    copy.addEventListener("click", async () => {
      const text = summaryText();
      try {
        await navigator.clipboard.writeText(text);
        say("tersalin");
      } catch {
        say("clipboard diblokir");
        console.log(text);
      }
    });
  }

  if (reset) {
    reset.addEventListener("click", async () => {
      if (!me) return;
      if (!confirm(`hapus tag ${me}?`)) return;
      try {
        votes = await store.read();
      } catch {
        /* pakai salinan yang ada */
      }
      delete votes[me];
      renderCalendar();
      try {
        await store.write(votes);
        say("terhapus");
      } catch {
        say("gagal simpan");
      }
    });
  }

  if (refresh) {
    refresh.addEventListener("click", async () => {
      await loadVotes();
      say("");
    });
  }
}

async function loadVotes() {
  try {
    votes = await store.read();
  } catch {
    votes = {};
    say("gagal muat");
  }
  renderCalendar();
}

/* ---------- start ---------- */

function initVoting() {
  const form = document.querySelector("#vote-form");
  const input = document.querySelector("#vote-input");
  const chips = document.querySelector("#vote-chips");
  const swap = document.querySelector("#vote-swap");

  if (chips) {
    chips.innerHTML = VOTE.suggestedUsernames
      .map((u) => `<button type="button" class="chip" data-user="${esc(u)}">${esc(u)}</button>`)
      .join("");
    chips.querySelectorAll("[data-user]").forEach((chip) => {
      chip.addEventListener("click", () => {
        if (input) input.value = chip.dataset.user;
        tryJoin(chip.dataset.user);
      });
    });
  }

  if (form) {
    form.addEventListener("submit", (e) => {
      e.preventDefault();
      tryJoin(input ? input.value : "");
    });
  }

  if (swap) {
    swap.addEventListener("click", () => {
      me = "";
      Prefs.setUser("");
      if (input) input.value = "";
      paintIdentity();
      renderCalendar();
      say("");
    });
  }

  const mode = document.querySelector("#vote-mode");
  if (mode) {
    mode.textContent = store.mode === "remote" ? "sync" : "lokal";
  }

  me = normalizeUser(Prefs.getUser());
  initTools();
  paintIdentity();
  loadVotes();
}

function tryJoin(raw) {
  const name = normalizeUser(raw);
  if (name.length < 2) {
    say("username min. 2 karakter");
    return;
  }

  const isNew = !Object.prototype.hasOwnProperty.call(votes, name);
  const filled = Object.keys(votes).length;
  if (isNew && filled >= VOTE.maxParticipants) {
    say("kuota penuh");
    return;
  }

  say("");
  setUser(name);
}
