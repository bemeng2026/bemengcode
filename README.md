# Malam Sekolah Media — BEM FTUI 2026

Static site. HTML + CSS + JS, tanpa build.

```bash
python3 -m http.server 8000
```

## Struktur

```
index.html
assets/css/style.css
assets/js/config.js     # endpoint voting
assets/js/data.js       # teks, tamu, agenda, setelan voting
assets/js/storage.js    # localStorage / endpoint
assets/js/calendar.js   # kalender + heatmap
assets/js/main.js       # render
```

## Ngedit teks

Semua tulisan yang tampil di halaman ada di `assets/js/data.js`:
`TEXT` (label & judul), `EVENT` (tanggal & situs), `GUESTS` (12 nama),
`AGENDA`.

Ganti isi di dalam tanda kutip `"..."` saja. Jangan hapus tanda kutip,
koma, atau kurung.

## Undangan

`index.html?u=<slug>` — kean, jason, barez, udin, razel, muti, muna, jpg,
lunci, olel, shey, ken. Default: kean.

Semua undangan formatnya sama, cuma nama yang beda — tiap orang dikirimi
link-nya sendiri. Tambah/ganti orang: array `GUESTS` di `data.js`.

Alur halaman: undangan satu layar penuh, tap `</>` (atau scroll) buat
loading, lalu agenda dan voting.

## Voting

Setelan di `VOTE` (`data.js`): `year`, `month`, `maxParticipants` (20),
`maxPicksPerUser` (`0` = bebas).

Default `localStorage` — suara per browser, nggak kelihatan antar orang.
Buat suara bersama, isi `apiUrl` di `config.js`:

```js
window.BEMFTUI_CONFIG = {
  apiUrl: "https://endpoint/vote",
  apiHeaders: {},
};
```

Endpoint melayani `GET` dan `PUT` dengan bentuk:

```json
{ "kean": ["2026-09-09"], "muna": ["2026-09-09"] }
```

`apiHeaders` kekirim dari browser — jangan taruh kunci rahasia.
