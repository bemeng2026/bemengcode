/* =========================================================
   BEM FTUI 2026 — Malam Sekolah Media
   Data undangan, agenda, dan checklist persiapan.
   ========================================================= */

const EVENT = {
  title: "Malam Sekolah Media",
  org: "BEM FTUI 2026",
  division: "Media & Kreatif",
  dateLabel: "__.09.2026",
  dateNote: "tanggal final ditentukan lewat voting kalender di bawah",
  site: "www.bemftui2026.com",
  place: "Sekretariat BEM FTUI — Gedung Engineering Center",
  dressCode: "Serba item, bawa laptop + charger",
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

/* 5 daftar isi acara */
const AGENDA = [
  {
    no: "01",
    tag: "</html>",
    title: "code </html>",
    desc:
      "Bedah struktur halaman dari nol. Semantic HTML, layout, sampai halaman ini sendiri kita bongkar bareng-bareng.",
    items: ["Struktur & semantic tag", "Layout dasar CSS", "Deploy pertama ke GitHub Pages"],
  },
  {
    no: "02",
    tag: "<Framer />",
    title: "framer integration",
    desc:
      "Dari Figma ke Framer ke web beneran. Handoff desain tanpa drama, plus komponen yang bisa dipakai ulang.",
    items: ["Figma → Framer handoff", "Komponen & variant", "Publish + custom domain"],
  },
  {
    no: "03",
    tag: "git push",
    title: "github repository",
    desc:
      "Satu repo untuk satu divisi. Branch, commit, pull request — biar kerja bareng nggak saling nimpa.",
    items: ["Branch & commit yang rapi", "Pull request + review", "Kolaborasi 20 orang di satu repo"],
  },
  {
    no: "04",
    tag: "claude()",
    title: "claude for code",
    desc:
      "Ngoding bareng AI tanpa jadi malas mikir. Prompt yang bener, review hasilnya, tahu kapan harus nolak sarannya.",
    items: ["Setup Claude Code", "Prompt untuk kerjaan nyata", "Review & verifikasi output"],
  },
  {
    no: "05",
    tag: "24h",
    title: "a whole day and night medz",
    desc:
      "Sehari semalam penuh bareng anak media. Ngoding, ngedesain, makan, tidur sebentar, lanjut lagi.",
    items: ["Sesi siang: materi", "Sesi malam: build bareng", "Demo hasil sebelum pulang"],
  },
];

/* Slide 3 — to do list & persiapan */
const PREP = {
  todo: [
    { label: "Isi voting tanggal di kalender bawah", note: "wajib, sebelum H-14" },
    { label: "Konfirmasi kehadiran ke PJ divisi", note: "via grup WhatsApp" },
    { label: "Bikin akun GitHub", note: "pakai email yang aktif" },
    { label: "Bikin akun Framer", note: "free plan cukup" },
    { label: "Join repo bemftui2026", note: "minta invite ke PJ" },
    { label: "Baca materi pra-acara", note: "dishare H-3" },
  ],
  download: [
    { label: "Visual Studio Code", note: "code editor utama", url: "https://code.visualstudio.com" },
    { label: "Git", note: "version control", url: "https://git-scm.com/downloads" },
    { label: "Google Chrome", note: "buat DevTools", url: "https://www.google.com/chrome" },
    { label: "Figma Desktop", note: "file desain acara", url: "https://www.figma.com/downloads" },
    { label: "Framer", note: "bisa lewat browser", url: "https://www.framer.com" },
    { label: "Claude Code", note: "CLI, butuh Node.js", url: "https://claude.com/claude-code" },
  ],
  bring: [
    { label: "Laptop", note: "min. 8GB RAM, storage sisa 10GB" },
    { label: "Charger + power bank", note: "colokan terbatas" },
    { label: "Mouse", note: "opsional tapi ngebantu" },
    { label: "Headset", note: "buat sesi mandiri" },
    { label: "Baju ganti + obat pribadi", note: "nginep semalam" },
    { label: "Botol minum", note: "hemat, no sampah" },
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
