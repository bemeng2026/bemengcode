/* =========================================================
   Tempat nyimpan voting.

   CARA PALING CEPAT — JSONBin (bisa dari HP):
     1. Buka jsonbin.io, daftar gratis.
     2. Create Bin, tempel isi file vote-seed.json di repo ini.
        (JSONBin nolak bin kosong, jadi jangan diisi {} doang.)
     3. Simpan. Lihat URL-nya, contoh:
        https://jsonbin.io/68abc1234567890abcdef123
        Bagian belakangnya itu BIN ID.
     4. Menu API Keys, copy MASTER KEY (yang diawali $2a$...).
     5. Tempel dua-duanya di bawah ini.

   Sesudah keisi, 12 orang lihat papan yang sama dan submit
   orang lain muncul sendiri tiap beberapa detik.

   Kalau masih null, voting jalan di browser masing-masing dan
   nggak saling kelihatan.

   Ingat: key ini kebaca siapa pun yang buka halaman. Jangan
   pakai akun JSONBin yang isinya data lain.
   ========================================================= */

window.BEMFTUI_CONFIG = {
  jsonbinId: null,
  jsonbinKey: null,

  /* Atau endpoint sendiri yang melayani GET dan PUT JSON. */
  apiUrl: null,
  apiHeaders: {},
};
