/* =========================================================
   Penyimpanan voting.

   Bentuk data bersama:
     { "kean": { "dates": ["2026-09-09"], "at": 1692800000000 } }

   Hanya yang sudah submit yang masuk ke sini, jadi isi objek ini
   sama dengan isi heatmap.
   ========================================================= */

const STORE_KEY = "bemftui2026.vote.v2";
const DRAFT_KEY = "bemftui2026.draft.v1";

function safeParse(raw, fallback) {
  if (!raw) return fallback;
  try {
    const parsed = JSON.parse(raw);
    return parsed && typeof parsed === "object" ? parsed : fallback;
  } catch {
    return fallback;
  }
}

/* Terima bentuk lama (array tanggal) maupun baru (objek). */
function normalizeVotes(raw) {
  const out = {};
  if (!raw || typeof raw !== "object") return out;

  Object.entries(raw).forEach(([user, value]) => {
    if (Array.isArray(value)) {
      out[user] = { dates: value.filter((d) => typeof d === "string"), at: 0 };
      return;
    }
    if (value && Array.isArray(value.dates)) {
      out[user] = {
        dates: value.dates.filter((d) => typeof d === "string"),
        at: Number(value.at) || 0,
      };
    }
  });
  return out;
}

/* --- penyimpanan lokal (buat nyoba tanpa server) --- */

const LocalStore = {
  mode: "local",

  async read() {
    try {
      return normalizeVotes(safeParse(localStorage.getItem(STORE_KEY), {}));
    } catch {
      return {};
    }
  },

  async write(data) {
    try {
      localStorage.setItem(STORE_KEY, JSON.stringify(data));
    } catch {
      /* private mode / penuh — voting tetap jalan di memori */
    }
    return data;
  },
};

/* --- penyimpanan bersama --- */

function RemoteStore(url, headers) {
  return {
    mode: "remote",

    async read() {
      const res = await fetch(url, {
        headers: { Accept: "application/json", ...headers },
        cache: "no-store",
      });
      if (!res.ok) throw new Error("GET " + res.status);
      const body = await res.json();
      /* Sebagian layanan membungkus isinya di dalam "record". */
      return normalizeVotes(body && body.record ? body.record : body);
    },

    async write(data) {
      const res = await fetch(url, {
        method: "PUT",
        headers: { "Content-Type": "application/json", ...headers },
        body: JSON.stringify(data),
      });
      if (!res.ok) throw new Error("PUT " + res.status);
      return data;
    },
  };
}

/* JSONBin: baca dan tulis beda alamat, jadi dibungkus sendiri. */
function JsonbinStore(id, key) {
  const base = `https://api.jsonbin.io/v3/b/${id}`;
  const auth = { "X-Master-Key": key, "X-Bin-Versioning": "false" };

  return {
    mode: "remote",

    async read() {
      const res = await fetch(`${base}/latest`, {
        headers: { ...auth, "X-Bin-Meta": "false" },
        cache: "no-store",
      });
      if (!res.ok) throw new Error("GET " + res.status);
      const body = await res.json();
      return normalizeVotes(body && body.record ? body.record : body);
    },

    async write(data) {
      const res = await fetch(base, {
        method: "PUT",
        headers: { ...auth, "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      if (!res.ok) throw new Error("PUT " + res.status);
      return data;
    },
  };
}

function makeStore() {
  const cfg = window.BEMFTUI_CONFIG || {};
  if (cfg.jsonbinId && cfg.jsonbinKey) return JsonbinStore(cfg.jsonbinId, cfg.jsonbinKey);
  if (cfg.apiUrl) return RemoteStore(cfg.apiUrl, cfg.apiHeaders || {});
  return LocalStore;
}

/* --- pilihan yang belum disubmit, disimpan di browser sendiri --- */

const Draft = {
  get(user) {
    try {
      const all = safeParse(localStorage.getItem(DRAFT_KEY), {});
      return Array.isArray(all[user]) ? all[user] : null;
    } catch {
      return null;
    }
  },
  set(user, dates) {
    try {
      const all = safeParse(localStorage.getItem(DRAFT_KEY), {});
      all[user] = dates;
      localStorage.setItem(DRAFT_KEY, JSON.stringify(all));
    } catch {
      /* diabaikan */
    }
  },
};
