/* =========================================================
   BEM FTUI 2026 — Malam Sekolah Media
   Guest list, agenda and calendar settings.
   ========================================================= */

/* =========================================================
   EVERY WORD THE PAGE SHOWS LIVES IN THIS FILE.
   Change only the text inside the "..." quotes.
   Do not remove the quotes, commas or brackets.
   ========================================================= */

const TEXT = {
  brand: "www.bemftui2026.com",

  mark: "</>",
  gate: "</>",
  loading: "</>",
  seeYou: "see you",
  votingLabel: "vote tanggal konsol",
  seeYouAt: "and at RABID 4",

  btn: {
    submit: "submit",
    resubmit: "update",
    back: "back",
    edit: "edit dates",
    clear: "clear",
    clearSure: "sure?",
  },

  vote: {
    local: "local",
    synced: "synced",
  },
};

const EVENT = {
  title: "Malam Sekolah Media",
  org: "BEM FTUI 2026",
  dateLabel: "__.09.2026",
  site: "www.bemftui2026.com",
};

/* One invitation per person — same layout, only the name differs. */
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
  { slug: "dio", name: "Dio" },
  { slug: "feb", name: "Feb" },
  { slug: "jata", name: "Jata" },
  { slug: "ghani", name: "Ghani" },
  { slug: "agnes", name: "Agnes" },
  { slug: "reyhan", name: "Reyhan" },
];

/* The meeting where the console date gets decided. Kept in Indonesian,
   exactly as it was announced. */
const BRIEFING = {
  title: "RABID 4 REMEDIAL",
  whenShort: "1 Sep",
  place: "Ruang BEM",

  meta: [
    { icon: "\u{1F5D3}\uFE0F", label: "Hari/tgl", value: "Selasa, 1 September 2026" },
    { icon: "\u23F0", label: "Waktu", value: "18.00-21.00" },
    { icon: "\u{1F4CD}", label: "Tempat", value: "Ruang BEM" },
  ],

  agendaLabel: "Agenda",
  agenda: [
    "Sekolah Media Website dan Portofolio",
    "Pembahasan PJ Program Kerja TW 3A",
    "Hut IKM X Guyub 2026",
    "TANGGAL DAN TEMPAT KOOONSOL",
  ],

  todoLabel: "\u{1F4CC} To do list",
  todo: ["Bawa laptop dan download Framer"],
};

/* Availability calendar — September 2026 */
const VOTE = {
  year: 2026,
  month: 9,
  maxPicksPerUser: 0, /* 0 = unlimited; set a number to cap it */
  /* Days already spoken for. Nobody can mark these. */
  blocked: {
    "2026-09-01": "RABID 4",
  },

  pollSeconds: 10,    /* how often to pull in everyone else's answers */
};
