/* =========================================================
   BEM FTUI 2026 — Malam Sekolah Media
   Data undangan, agenda, dan checklist persiapan.
   ========================================================= */

/* =========================================================
   SEMUA TEKS WEBSITE ADA DI FILE INI.
   Ganti tulisan di dalam tanda kutip "..." saja.
   Jangan hapus tanda kutip, koma, atau kurung.
   ========================================================= */

const TEXT = {
  brand: "BEM FTUI",
  brandYear: "2026",

  gate: "</>",
  loading: "</>",
  votingLabel: "voting tanggal",

  btn: {
    submit: "submit",
    resubmit: "update",
    back: "back",
    edit: "edit tanggal",
    refresh: "refresh",
    hapus: "hapus",
  },

  vote: {
    orang: "ORANG",
    tag: "TAG",
    top: "TOP",
    lokal: "lokal",
    sync: "sync",
  },
};

const EVENT = {
  title: "Malam Sekolah Media",
  org: "BEM FTUI 2026",
  dateLabel: "__.09.2026",
  site: "www.bemftui2026.com",
};

/* 12 undangan — formatnya sama semua, cuma nama yang beda. */
const GUESTS = [
  { slug: "kean", name: "Kean" },
  { slug: "jason", name: "Jason" },
  { slug: "barez", name: "Barez" },
  { slug: "udin", name: "Udin" },
  { slug: "razel", name: "Razel" },
  { slug: "muti", name: "Muti" },
  { slug: "muna", name: "Muna" },
  { slug: "jpg", name: "Jpg" },
  { slug: "lunci", name: "Lunci" },
  { slug: "olel", name: "Olel" },
  { slug: "shey", name: "Shey" },
  { slug: "ken", name: "Ken" },
];

const AGENDA = [
  { no: "01", title: "code </html>" },
  { no: "02", title: "framer integration" },
  { no: "03", title: "github repository" },
  { no: "04", title: "claude for code" },
  { no: "05", title: "a whole day and night medz" },
];

/* Kalender voting — September 2026 */
const VOTE = {
  year: 2026,
  month: 9,
  maxPicksPerUser: 0, /* 0 = bebas, isi angka kalau mau dibatasi */
  pollSeconds: 5,     /* seberapa sering narik data orang lain */
};
