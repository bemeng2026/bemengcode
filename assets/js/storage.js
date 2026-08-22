/* =========================================================
   Lapisan penyimpanan voting.
   Bentuk data: { username: ["YYYY-MM-DD", ...], ... }
   ========================================================= */

const STORE_KEY = "bemftui2026.vote.v1";
const USER_KEY = "bemftui2026.user.v1";
const PREP_KEY = "bemftui2026.prep.v1";

function safeParse(raw, fallback) {
  if (!raw) return fallback;
  try {
    const parsed = JSON.parse(raw);
    return parsed && typeof parsed === "object" ? parsed : fallback;
  } catch {
    return fallback;
  }
}

/* --- penyimpanan lokal (default) --- */

const LocalStore = {
  mode: "local",

  async read() {
    try {
      return safeParse(localStorage.getItem(STORE_KEY), {});
    } catch {
      return {};
    }
  },

  async write(data) {
    try {
      localStorage.setItem(STORE_KEY, JSON.stringify(data));
    } catch {
      /* private mode / storage penuh — voting tetap jalan di memori */
    }
    return data;
  },
};

/* --- penyimpanan bersama (opsional) --- */

function RemoteStore(url, headers) {
  return {
    mode: "remote",

    async read() {
      const res = await fetch(url, {
        headers: { Accept: "application/json", ...headers },
        cache: "no-store",
      });
      if (!res.ok) throw new Error("GET " + res.status);
      const data = await res.json();
      return data && typeof data === "object" ? data : {};
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

function makeStore() {
  const cfg = window.BEMFTUI_CONFIG || {};
  if (cfg.apiUrl) return RemoteStore(cfg.apiUrl, cfg.apiHeaders || {});
  return LocalStore;
}

/* --- preferensi kecil di browser --- */

const Prefs = {
  getUser() {
    try {
      return localStorage.getItem(USER_KEY) || "";
    } catch {
      return "";
    }
  },
  setUser(name) {
    try {
      if (name) localStorage.setItem(USER_KEY, name);
      else localStorage.removeItem(USER_KEY);
    } catch {
      /* diabaikan */
    }
  },
  getPrep() {
    try {
      return safeParse(localStorage.getItem(PREP_KEY), {});
    } catch {
      return {};
    }
  },
  setPrep(map) {
    try {
      localStorage.setItem(PREP_KEY, JSON.stringify(map));
    } catch {
      /* diabaikan */
    }
  },
};
