/* =========================================================
   Availability calendar — heatmap and live sync.

   Pick your free dates first (a draft, kept in your own browser),
   then submit. Anything submitted shows up for everyone and feeds
   the heatmap.
   ========================================================= */

const DOW = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
const MONTHS = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December",
];

const store = makeStore();

/* Everything everyone has submitted. */
let votes = {};
/* This person's picks, not necessarily submitted yet. */
let draft = [];
/* Who is answering comes from their invitation link, not a text field. */
let me = "";

let poll = null;
let lastSeen = "";

/* One month: how many blank cells lead the grid, and how many days. */
function monthLayout() {
  const { year, month } = VOTE;
  return {
    year,
    month,
    total: new Date(year, month, 0).getDate(),
    /* getDay(): 0 = Sunday. Shifted so the week starts on Monday. */
    lead: (new Date(year, month - 1, 1).getDay() + 6) % 7,
  };
}

const iso = (y, m, d) =>
  `${y}-${String(m).padStart(2, "0")}-${String(d).padStart(2, "0")}`;

const submitted = (user) => Boolean(votes[user] && votes[user].dates.length);

const sameDates = (a, b) =>
  a.length === b.length && a.every((d, i) => d === b[i]);

/* ---------- counting ---------- */

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

/* ---------- calendar ---------- */

function renderCalendar() {
  const host = document.querySelector("#cal-grid");
  if (!host) return;

  const counts = tally();
  const max = counts.size ? Math.max(...[...counts.values()].map((u) => u.length)) : 0;
  const mine = new Set(draft);

  const { year, month, total, lead } = monthLayout();

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
              aria-label="${esc(`${d} ${MONTHS[month - 1]} ${year} — ${taggers.length} free`)}"
              aria-pressed="${mine.has(date)}">
        <span class="day__n">${d}</span>
      </button>`);
  }

  host.innerHTML = cells.join("");

  host.querySelectorAll("[data-date]").forEach((btn) => {
    btn.addEventListener("click", () => {
      if (dragged) return; /* already handled by the drag */
      toggleDate(btn.dataset.date);
    });
  });

  const label = document.querySelector("#cal-month");
  if (label) label.textContent = `${MONTHS[month - 1]} ${year}`;

  renderTop3(counts, max);
  renderRoster();
  paintIdentity();
  renderThanks(counts, max);
}

/* ---------- the three best dates ---------- */

const dayLabel = (date) =>
  `${Number(date.slice(8, 10))} ${MONTHS[VOTE.month - 1].slice(0, 3)}`;

function rankRows(counts) {
  return [...counts.entries()].sort(
    (a, b) => b[1].length - a[1].length || a[0].localeCompare(b[0])
  );
}

/* The three best dates as tiles, sized by rank. No figures — the
   colour already says how busy each one is. */
function podiumHTML(counts, max) {
  const rows = rankRows(counts).slice(0, 3);
  if (!rows.length) return '<span class="empty">&mdash;</span>';

  return rows
    .map(([date, users], i) => {
      const level = heatLevel(users.length, max);
      return `
        <span class="pod pod--${i + 1} ${level ? `pod--h${level}` : ""}">
          <span class="pod__d">${Number(date.slice(8, 10))}</span>
          <span class="pod__m">${MONTHS[VOTE.month - 1].slice(0, 3)}</span>
        </span>`;
    })
    .join("");
}

function renderTop3(counts, max) {
  const host = document.querySelector("#top3");
  if (host) host.innerHTML = podiumHTML(counts, max);
}

/* Closing screen: the whole month as a heatmap, then the three best
   dates. Deliberately without figures — you can see which days most
   people are free.  */
function renderThanks(counts, max) {
  const host = document.querySelector("#thanks-mini");
  if (host) {
    const { year, month, total, lead } = monthLayout();
    const mine = new Set(votes[me] ? votes[me].dates : []);
    const cells = [];

    for (let i = 0; i < lead; i += 1) {
      cells.push('<span class="mini__c mini__c--empty"></span>');
    }

    for (let d = 1; d <= total; d += 1) {
      const date = iso(year, month, d);
      const level = heatLevel((counts.get(date) || []).length, max);
      cells.push(
        `<span class="mini__c ${level ? `mini__c--h${level}` : ""} ${
          mine.has(date) ? "mini__c--mine" : ""
        }">${d}</span>`
      );
    }

    host.innerHTML = cells.join("");
  }

  const podium = document.querySelector("#thanks-podium");
  if (podium) podium.innerHTML = podiumHTML(counts, max);
}

/* Who has answered so far. */
function renderRoster() {
  /* How many have answered, out of everyone invited. */
  const done = document.querySelector("#vote-done");
  if (done) {
    const n = GUESTS.filter((g) => submitted(g.slug)).length;
    done.textContent = `${n}/${GUESTS.length}`;
  }

  const host = document.querySelector("#roster");
  if (!host) return;

  host.innerHTML = GUESTS.map(
    (g) => `
    <span class="rost ${submitted(g.slug) ? "rost--in" : ""}"
          title="${esc(submitted(g.slug) ? g.name + " answered" : g.name + " has not answered")}">
      ${esc(g.slug)}
    </span>`
  ).join("");
}

/* ---------- marking a run of days ---------- */

let dragging = false;
let dragMode = true; /* true = lagi nandain, false = lagi ngelepas */
let dragged = false;

function dayAt(x, y) {
  const el = document.elementFromPoint(x, y);
  return el && el.closest ? el.closest("[data-date]") : null;
}

/* Marking a free week should be one gesture, not seven taps. */
function initDrag() {
  const grid = document.querySelector("#cal-grid");
  if (!grid) return;

  grid.addEventListener("pointerdown", (e) => {
    const cell = e.target.closest("[data-date]");
    if (!cell) return;

    dragging = true;
    dragMode = !draft.includes(cell.dataset.date);

    /* The cell under the finger is marked too; without this a plain tap
       does nothing and a drag always skips the cell it started on. */
    setDate(cell.dataset.date, dragMode);

    /* Ignore the click that follows — the tap is handled here. The click
       path is left for keyboard users. */
    dragged = true;
  });

  grid.addEventListener("pointermove", (e) => {
    if (!dragging) return;
    const cell = dayAt(e.clientX, e.clientY);
    if (!cell) return;

    const has = draft.includes(cell.dataset.date);
    if (has === dragMode) return;

    dragged = true;
    setDate(cell.dataset.date, dragMode);
  });

  const stop = () => {
    dragging = false;
    /* Dilepas setelah event click sempat lewat. */
    setTimeout(() => (dragged = false), 0);
  };

  window.addEventListener("pointerup", stop);
  window.addEventListener("pointercancel", stop);
}

/* ---------- actions ---------- */

function setDate(date, on) {
  const at = draft.indexOf(date);

  if (!on) {
    if (at >= 0) draft.splice(at, 1);
  } else {
    if (at >= 0) return;
    const cap = VOTE.maxPicksPerUser;
    if (cap > 0 && draft.length >= cap) {
      say(`max ${cap} dates`);
      return;
    }
    draft.push(date);
    draft.sort();
  }

  Draft.set(me, draft);
  say("");
  renderCalendar();
}

function toggleDate(date) {
  setDate(date, !draft.includes(date));
}

async function submitVote() {
  if (!draft.length) return;

  say("sending…");

  /* Re-read first so nobody else's answer gets overwritten. */
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
    /* keep the copy we already have */
  }

  delete votes[me];
  draft = [];
  Draft.set(me, draft);

  try {
    await store.write(votes);
    say("cleared");
  } catch {
    say("could not save");
  }

  lastSeen = JSON.stringify(votes);
  renderCalendar();
}

/* If the fetch itself failed (no HTTP status), this page is not allowed
   to reach out at all — that is not the server's doing. */
function reachMsg(err) {
  const m = String((err && err.message) || err);
  if (/^(GET|PUT) \d+/.test(m)) return `server refused (${m})`;
  return "this page cannot reach the vote server";
}

function say(message) {
  const el = document.querySelector("#vote-msg");
  if (el) el.textContent = message;
}

/* ---------- identity and the submit button ---------- */

function paintIdentity() {
  const nameEl = document.querySelector("#vote-name");
  if (nameEl) nameEl.textContent = me;

  const btn = document.querySelector("#submit");
  if (!btn) return;

  /* The seed creates every entry up front, so "has answered" is measured
     by whether that entry holds dates, not by the entry existing. */
  const sent = votes[me] && votes[me].dates.length ? votes[me].dates : null;
  const unchanged = sent !== null && sameDates(sent, draft);

  btn.disabled = draft.length === 0 || unchanged;
  btn.textContent = sent ? t("btn.resubmit") : t("btn.submit");
}

/* Reset to the start state first, otherwise the animation only ever runs
   once — data-in is still set from the previous visit. */
function showThanks() {
  const screen = document.querySelector("#thanks");
  if (!screen) return;

  screen.querySelectorAll("[data-rise]").forEach((el) => {
    delete el.dataset.in;
  });

  document.body.dataset.stage = "done";
  playRise(screen);
}

/* ---------- sync ---------- */

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

  /* The free JSONBin quota is small, so do not pull while the calendar is
     off screen — a background tab, or someone still on the invitation. */
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
  if (mode) mode.textContent = store.mode === "remote" ? t("vote.synced") : t("vote.local");

  const submit = document.querySelector("#submit");
  const back = document.querySelector("#thanks-back");
  const edit = document.querySelector("#thanks-edit");
  const reset = document.querySelector("#tool-reset");

  if (submit) {
    submit.addEventListener("click", async () => {
      if (await submitVote()) {
        showThanks();
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
      reset.textContent = t("btn.clear");
    };

    reset.addEventListener("click", () => {
      if (!armed) {
        armed = true;
        reset.textContent = t("btn.clearSure");
        timer = setTimeout(disarm, 4000);
        return;
      }
      disarm();
      clearVote();
    });
  }

  draft = Draft.get(me) || [];
  initDrag();
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

  /* Already answered but no local draft? Start from what was submitted. */
  if (!draft.length && votes[me]) {
    draft = [...votes[me].dates];
    Draft.set(me, draft);
  }

  renderCalendar();
}
