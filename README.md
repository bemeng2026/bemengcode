# Malam Sekolah Media — BEM FTUI 2026

Website undangan buat Malam Sekolah Media, Divisi Media & Kreatif BEM FTUI 2026.
Satu halaman, tinggal scroll. HTML + CSS + JavaScript polos, tanpa build step.

## Isi halaman

| Bagian | Isi |
| --- | --- |
| Slide 01 — Undangan | Undangan personal dengan gimmick koding, ada 12 variant |
| Slide 02 — Agenda | 5 daftar isi acara |
| Slide 03 — Persiapan | To do list, yang perlu di-download, yang perlu dibawa |
| Galeri | 12 kartu undangan buat di-share satu-satu |
| Voting Tanggal | Kalender September 2026 + heatmap suara |

## Undangan personal

Tiap orang punya link sendiri lewat query `?u=`:

```
index.html?u=kean     index.html?u=muti
index.html?u=jason    index.html?u=muna
index.html?u=barez    index.html?u=jpg
index.html?u=udin     index.html?u=lunci
index.html?u=razel    index.html?u=olel
                      index.html?u=shey
                      index.html?u=ken
```

Nama, gimmick koding, dan warna aksennya beda-beda per orang. Kalau `?u=`
kosong atau nggak dikenali, yang tampil undangan default (Kean).

Mau nambah atau ganti orang? Edit array `GUESTS` di `assets/js/data.js`.
Galeri, dropdown username, dan judul halaman ngikut otomatis.

## Voting tanggal

Cara pakainya: isi username → klik tanggal yang kamu kosong. Satu tanggal
boleh ditag banyak orang, dan tag bisa dilepas lagi kapan aja. Makin banyak
yang nge-tag, makin gelap kotaknya di heatmap. Panel kiri nunjukin peringkat
tanggal terbanyak.

Batasnya diatur di `VOTE` (`assets/js/data.js`):

- `maxParticipants` — default 20 orang
- `maxPicksPerUser` — default `0` alias bebas; isi angka kalau mau dibatasi
- `year` / `month` — bulan yang ditampilkan, default September 2026

### Penting: mode lokal vs mode bareng

**Default-nya mode lokal.** Suara disimpan di `localStorage` browser
masing-masing, jadi tiap orang cuma lihat suaranya sendiri. Ini cukup buat
nyoba-nyoba, tapi **bukan** voting beneran.

Biar 20 orang lihat papan yang sama, butuh satu tempat nyimpan bersama.
Isi `apiUrl` di `assets/js/config.js`:

```js
window.BEMFTUI_CONFIG = {
  apiUrl: "https://contoh-endpoint-kamu/vote",
  apiHeaders: { "X-Access-Key": "..." },
};
```

Endpoint-nya cukup ngelayanin dua hal:

- `GET` → balikin JSON `{ "kean": ["2026-09-09"], "muna": ["2026-09-09"] }`
- `PUT` → terima JSON dengan bentuk yang sama, simpan

Apa pun bisa dipakai selama bentuknya segitu — JSONBin, Supabase REST,
Cloudflare Worker, Google Apps Script. Halaman selalu baca ulang data
sebelum nulis, jadi tag orang lain nggak ketimpa.

Catatan: `apiHeaders` ikut kekirim dari browser, jadi jangan taruh kunci
yang sifatnya rahasia di situ — pakai kunci yang aksesnya terbatas ke
endpoint voting aja.

## Jalanin lokal

Nggak ada dependency dan nggak ada yang perlu di-build:

```bash
python3 -m http.server 8000
# buka http://localhost:8000
```

## Struktur

```
index.html
assets/
  css/style.css
  js/
    config.js      # setelan endpoint voting
    data.js        # daftar tamu, agenda, checklist, setelan voting
    storage.js     # simpan ke localStorage atau ke endpoint
    calendar.js    # kalender + heatmap + peringkat
    main.js        # render undangan, agenda, persiapan, galeri
```

## Deploy

Static file semua, jadi bisa langsung ditaruh di GitHub Pages, Netlify,
Vercel, atau Framer (embed / custom code). Buat GitHub Pages: Settings →
Pages → pilih branch, folder `/ (root)`.
