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

  nav: {
    undangan: "undangan",
    agenda: "agenda",
    variant: "variant",
    voting: "voting",
  },

  section: {
    undanganNo: "01",
    undangan: "undangan",
    agendaNo: "02",
    agenda: "agenda",
    variantNo: "03",
    variant: "12 variant",
    votingNo: "04",
    voting: "voting tanggal",
  },

  btn: {
    masuk: "masuk",
    ganti: "ganti",
    refresh: "refresh",
    salin: "salin",
    hapus: "hapus",
  },

  vote: {
    username: "USERNAME",
    placeholder: "kean",
    orang: "ORANG",
    tag: "TAG",
    top: "TOP",
    lokal: "lokal",
    sync: "sync",
  },

  theme: {
    dark: "dark",
    light: "light",
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
  maxParticipants: 20,
  maxPicksPerUser: 0, /* 0 = bebas, isi angka kalau mau dibatasi */
  suggestedUsernames: GUESTS.map((g) => g.slug),
};
