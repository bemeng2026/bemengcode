/* =========================================================
   Endpoint voting.

   Isi apiUrl supaya 12 orang lihat papan yang sama. Endpoint-nya
   cukup melayani dua hal:

     GET  <apiUrl>  ->  { "kean": { "dates": ["2026-09-09"], "at": 0 } }
     PUT  <apiUrl>  <-  body JSON dengan bentuk yang sama

   Halaman selalu baca ulang sebelum nulis, jadi submit orang lain
   nggak ketimpa. Perubahan orang lain ditarik tiap beberapa detik
   (atur di VOTE.pollSeconds pada data.js).

   Catatan: apiHeaders ikut terkirim dari browser dan bisa dilihat
   siapa pun yang buka halaman. Jangan taruh kunci yang sifatnya
   rahasia di situ.

   Selama apiUrl masih null, voting jalan di localStorage — tiap
   orang cuma lihat suaranya sendiri.
   ========================================================= */

window.BEMFTUI_CONFIG = {
  apiUrl: null,
  apiHeaders: {},
};
