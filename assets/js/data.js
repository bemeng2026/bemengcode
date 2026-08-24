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
  votingLabel: "when are you free",

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
];

const AGENDA = [
  { no: "01", title: "code </html>" },
  { no: "02", title: "framer integration" },
  { no: "03", title: "github repository" },
  { no: "04", title: "claude for code" },
  { no: "05", title: "a whole day and night medz" },
];

/* Availability calendar — September 2026 */
const VOTE = {
  year: 2026,
  month: 9,
  maxPicksPerUser: 0, /* 0 = unlimited; set a number to cap it */
  pollSeconds: 10,    /* how often to pull in everyone else's answers */
};
