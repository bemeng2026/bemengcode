# Malam Sekolah Media — BEM FTUI 2026

Static site. HTML, CSS and JavaScript, no build step.

```bash
python3 -m http.server 8000
```

## Layout

```
index.html
assets/css/style.css
assets/js/config.js     # where answers are stored
assets/js/data.js       # text, guests, agenda, calendar settings
assets/js/storage.js    # localStorage or an endpoint
assets/js/calendar.js   # calendar, heatmap, sync
assets/js/main.js       # rendering
```

## Editing the words

Everything the page shows lives in `assets/js/data.js`: `TEXT` for labels
and headings, `EVENT` for the date and site, `GUESTS` for the invitations,
`BRIEFING` for the meeting details.

Change only what is inside the `"..."` quotes. Leave the quotes, commas
and brackets alone.

## Invitations

`index.html?u=<slug>` — kean, jason, barez, udin, razel, muti, muna, jpg,
lunci, olel, shey, ken, dio, feb, jata, ghani, agnes. Defaults to kean.

Every invitation uses the same layout and only the name differs; each
person gets their own link. Add or rename people in `GUESTS` in `data.js`,
then regenerate `vote-seed.json` to match.

Page flow: the invitation fills one screen, tapping `</>` (or scrolling)
plays a short loading state, then the meeting briefing, the calendar,
submit, and a closing screen.

Light theme only. The three marks on the closing screen are inline SVG
drawn here, not official brand assets.

## Availability

Pick your free dates — drag across the grid to mark a run in one gesture,
or tap single days — then submit. Only submitted answers reach the
heatmap. The chips in the left panel show who has answered so far.

Settings live in `VOTE` (`data.js`): `year`, `month`, `maxPicksPerUser`
(`0` for unlimited) and `pollSeconds`.

Answers are shared through JSONBin. To point it somewhere else, create a
bin holding the contents of `vote-seed.json` (JSONBin rejects an empty
bin) and fill in `config.js`:

```js
window.BEMFTUI_CONFIG = {
  jsonbinId: "68abc1234567890abcdef123",
  jsonbinKey: "$2a$10$...",
};
```

Any other endpoint works through `apiUrl`, as long as it serves `GET` and
`PUT` of:

```json
{ "kean": { "dates": ["2026-09-09"], "at": 1692800000000 } }
```

The page pulls every `VOTE.pollSeconds` seconds and on tab focus, so other
people's answers appear without a reload, and it re-reads before writing
so simultaneous answers do not overwrite each other.

The key in `config.js` is readable by anyone who opens the page, so use a
JSONBin account kept only for this, and regenerate the key once the date
is settled.

## Deploy (GitHub Pages, free)

Pages on a private repo needs a paid plan, so the repository has to be
public. Settings → General → Change visibility → Public, then
Settings → Pages → Deploy from a branch → this branch, folder `/ (root)`
→ Save.

Live at `https://bemeng2026.github.io/bemengcode/?u=kean`. Every asset
path is relative, so it runs from a subfolder.

Answers only work on a properly hosted site. Inside the claude.ai Artifact
preview the CSP blocks outbound requests, so submitting fails there.
