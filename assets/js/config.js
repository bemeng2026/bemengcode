/* =========================================================
   Where answers are stored.

   QUICKEST SETUP — JSONBin (works from a phone):
     1. Go to jsonbin.io and sign up, it is free.
     2. Create Bin, then paste in the contents of vote-seed.json
        from this repo. (JSONBin rejects an empty bin, so do not
        just type {}.)
     3. Save. Look at the URL, for example:
        https://jsonbin.io/68abc1234567890abcdef123
        The trailing part is the BIN ID.
     4. Open API Keys and copy the MASTER KEY (it starts $2a$...).
     5. Paste both below.

   Once filled in, everyone sees the same board and other people's
   answers arrive on their own every few seconds.

   While these stay null, answers live in each browser on its own
   and nobody sees anyone else.

   Note: this key is readable by anyone who opens the page. Use a
   JSONBin account kept only for this.
   ========================================================= */

window.BEMFTUI_CONFIG = {
  jsonbinId: "6a8aff9eda38895dfe06fb12",
  jsonbinKey: "$2a$10$hMVVGfgovOSq1.3B7MdA8uAT79S/WPrNGTrV/caNU0WtpU9XtL96y",

  /* Or your own endpoint serving GET and PUT of the same JSON. */
  apiUrl: null,
  apiHeaders: {},
};
