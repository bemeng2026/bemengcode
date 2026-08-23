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
loading, lalu agenda, voting, submit, halaman terima kasih.

Tema light saja. Logo di halaman terima kasih digambar ulang pakai SVG
inline, bukan aset resmi.

## Voting

Siapa yang voting diambil dari `?u=` di link, jadi nggak ada isian
username. Setelan di `VOTE` (`data.js`): `year`, `month`,
`maxParticipants` (20), `maxPicksPerUser` (`0` = bebas).

Pilih tanggal dulu (draft, tersimpan di browser sendiri), lalu submit.
Yang masuk heatmap hanya yang sudah submit. Deretan chip di panel kiri
nunjukin siapa dari 12 orang yang sudah masuk.

Default `localStorage` — suara per browser, nggak kelihatan antar orang.
Buat papan bersama, cara tercepat lewat JSONBin: bikin bin berisi `{}`,
lalu isi `config.js`:

```js
window.BEMFTUI_CONFIG = {
  jsonbinId: "68abc1234567890abcdef123",
  jsonbinKey: "$2a$10$...",
};
```

Endpoint lain juga bisa lewat `apiUrl`, asal melayani `GET` dan `PUT`
dengan bentuk:

```json
{ "kean": { "dates": ["2026-09-09"], "at": 1692800000000 } }
```

Halaman narik data tiap `VOTE.pollSeconds` detik (default 5) dan pas tab
dibuka lagi, jadi submit orang lain muncul tanpa reload. Sebelum nulis
selalu baca ulang, jadi submit barengan nggak saling nimpa.

Kunci di `config.js` kebaca siapa pun yang buka halaman, jadi pakai
akun JSONBin khusus buat ini.
