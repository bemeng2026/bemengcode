/* =========================================================
   Konfigurasi voting kalender.

   Default: data voting disimpan di browser masing-masing
   (localStorage). Cocok buat nyoba-nyoba, tapi hasil tiap
   orang TIDAK kelihatan satu sama lain.

   Kalau mau voting beneran barengan 20 orang, isi apiUrl
   dengan endpoint yang menyediakan:

     GET  <apiUrl>  ->  { "kean": ["2026-09-09"], "jason": [...] }
     PUT  <apiUrl>  <-  body JSON dengan bentuk yang sama

   Endpoint apa pun bisa dipakai selama bentuknya segitu
   (JSONBin, Supabase REST, Cloudflare Worker, dsb).
   ========================================================= */

window.BEMFTUI_CONFIG = {
  apiUrl: null,
  apiHeaders: {},
};
