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
    persiapan: "persiapan",
    variant: "variant",
    voting: "voting",
  },

  section: {
    undanganNo: "01",
    undangan: "undangan",
    agendaNo: "02",
    agenda: "agenda",
    persiapanNo: "03",
    persiapan: "persiapan",
    variantNo: "04",
    variant: "12 variant",
    votingNo: "05",
    voting: "voting tanggal",
  },

  meta: {
    acara: "ACARA",
    tanggal: "TANGGAL",
    tempat: "TEMPAT",
    dress: "DRESS CODE",
  },

  btn: {
    voting: "voting",
    agenda: "agenda",
    variant: "12 variant",
    masuk: "masuk",
    ganti: "ganti",
    refresh: "refresh",
    salin: "salin",
    hapus: "hapus",
  },

  panel: {
    todo: "// to do",
    download: "// download",
    bawa: "// bawa",
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
  place: "Sekre BEM FTUI",
  dressCode: "Serba item",
};

/* Roster: 12 undangan personal.
   Tiap orang dapat satu gimmick koding yang beda. */
const GUESTS = [
  {
    slug: "kean",
    name: "Kean",
    variant: "tag",
    accent: "blue",
    code: [
      { t: "plain", v: "Hi," },
      { t: "prompt", p: ">", v: "Kean" },
      { t: "comment", v: "//You are Invited" },
      { t: "tag", v: "</>" },
      { t: "plain", v: "}" },
    ],
  },
  {
    slug: "jason",
    name: "Jason",
    variant: "terminal",
    accent: "green",
    code: [
      { t: "plain", v: "$ ./invite.sh" },
      { t: "prompt", p: "--guest=", v: "jason" },
      { t: "comment", v: "//status: confirmed" },
      { t: "tag", v: "_" },
    ],
  },
  {
    slug: "barez",
    name: "Barez",
    variant: "json",
    accent: "amber",
    code: [
      { t: "plain", v: "{" },
      { t: "prompt", p: '"guest": ', v: '"barez",' },
      { t: "comment", v: '//"invited": true' },
      { t: "tag", v: "}" },
    ],
  },
  {
    slug: "udin",
    name: "Udin",
    variant: "git",
    accent: "orange",
    code: [
      { t: "plain", v: "git log --oneline" },
      { t: "prompt", p: "a11ce0d ", v: "udin" },
      { t: "comment", v: "//feat: you are invited" },
      { t: "tag", v: "HEAD -> malam-medz" },
    ],
  },
  {
    slug: "razel",
    name: "Razel",
    variant: "html",
    accent: "blue",
    code: [
      { t: "plain", v: "<invite" },
      { t: "prompt", p: "guest=", v: '"razel"' },
      { t: "comment", v: "//required" },
      { t: "tag", v: "/>" },
    ],
  },
  {
    slug: "muti",
    name: "Muti",
    variant: "python",
    accent: "green",
    code: [
      { t: "plain", v: "def invite(" },
      { t: "prompt", p: "", v: "muti" },
      { t: "comment", v: "# you are invited" },
      { t: "tag", v: "): return True" },
    ],
  },
  {
    slug: "muna",
    name: "Muna",
    variant: "sql",
    accent: "violet",
    code: [
      { t: "plain", v: "SELECT * FROM crew" },
      { t: "prompt", p: "WHERE name = ", v: "'muna'" },
      { t: "comment", v: "-- 1 row invited" },
      { t: "tag", v: ";" },
    ],
  },
  {
    slug: "jpg",
    name: "Jpg",
    variant: "css",
    accent: "pink",
    code: [
      { t: "plain", v: "#jpg {" },
      { t: "prompt", p: "status: ", v: "invited;" },
      { t: "comment", v: "/* no excuses */" },
      { t: "tag", v: "}" },
    ],
  },
  {
    slug: "lunci",
    name: "Lunci",
    variant: "markdown",
    accent: "green",
    code: [
      { t: "plain", v: "## undangan" },
      { t: "prompt", p: "- [x] ", v: "lunci" },
      { t: "comment", v: "> you are invited" },
      { t: "tag", v: "---" },
    ],
  },
  {
    slug: "olel",
    name: "Olel",
    variant: "curl",
    accent: "orange",
    code: [
      { t: "plain", v: "curl -X POST" },
      { t: "prompt", p: "/rsvp/", v: "olel" },
      { t: "comment", v: "//201 Created" },
      { t: "tag", v: "--fail" },
    ],
  },
  {
    slug: "shey",
    name: "Shey",
    variant: "react",
    accent: "cyan",
    code: [
      { t: "plain", v: "export default" },
      { t: "prompt", p: "", v: "<Shey />" },
      { t: "comment", v: "//renders at malam medz" },
      { t: "tag", v: "</>" },
    ],
  },
  {
    slug: "ken",
    name: "Ken",
    variant: "console",
    accent: "blue",
    code: [
      { t: "plain", v: "console.log(" },
      { t: "prompt", p: "", v: '"ken"' },
      { t: "comment", v: "//> you are invited" },
      { t: "tag", v: ")" },
    ],
  },
];

const AGENDA = [
  { no: "01", tag: "</html>", title: "code </html>",
    items: ["semantic tag", "layout css", "deploy"] },
  { no: "02", tag: "<Framer />", title: "framer integration",
    items: ["figma handoff", "komponen", "publish"] },
  { no: "03", tag: "git push", title: "github repository",
    items: ["branch", "pull request", "kolaborasi"] },
  { no: "04", tag: "claude()", title: "claude for code",
    items: ["setup", "prompt", "review"] },
  { no: "05", tag: "24h", title: "a whole day and night medz",
    items: ["siang: materi", "malam: build", "demo"] },
];

const PREP = {
  todo: [
    { label: "voting tanggal" },
    { label: "konfirmasi ke PJ" },
    { label: "akun github" },
    { label: "akun framer" },
    { label: "join repo" },
    { label: "baca materi" },
  ],
  download: [
    { label: "vs code", url: "https://code.visualstudio.com" },
    { label: "git", url: "https://git-scm.com/downloads" },
    { label: "chrome", url: "https://www.google.com/chrome" },
    { label: "figma", url: "https://www.figma.com/downloads" },
    { label: "framer", url: "https://www.framer.com" },
    { label: "claude code", url: "https://claude.com/claude-code" },
  ],
  bring: [
    { label: "laptop" },
    { label: "charger" },
    { label: "mouse" },
    { label: "headset" },
    { label: "baju ganti" },
    { label: "botol minum" },
  ],
};

/* Kalender voting — September 2026 */
const VOTE = {
  year: 2026,
  month: 9,
  maxParticipants: 20,
  maxPicksPerUser: 0, /* 0 = bebas, isi angka kalau mau dibatasi */
  suggestedUsernames: GUESTS.map((g) => g.slug),
};
