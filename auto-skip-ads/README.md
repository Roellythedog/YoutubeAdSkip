# Auto Skip Ads (YouTube)

A small Chrome extension that watches YouTube's player and clicks the
"Skip Ad" button the instant it becomes available. For ads with no skip
option, it nudges the ad forward so it ends sooner.

## Install (unpacked, for personal use)

1. Unzip this folder somewhere permanent (don't delete it after installing).
2. Open `chrome://extensions` in Chrome.
3. Turn on **Developer mode** (top-right toggle).
4. Click **Load unpacked** and select the `auto-skip-ads` folder.
5. Visit YouTube — the extension runs automatically. Click the toolbar
   icon to turn it on/off.

## How it works

- `content.js` runs on youtube.com and uses a `MutationObserver` plus a
  fallback interval to look for the skip button's known CSS selectors
  and click it as soon as it's clickable.
- For non-skippable ads, it jumps the video's current time to the end of
  the ad segment so playback advances faster.
- No data is collected, no network requests are made, no permissions
  beyond running on youtube.com are requested.

## Notes

- YouTube changes its DOM/class names periodically, which can break the
  selectors above — if skipping stops working, inspect the skip button's
  class name in DevTools and add it to `SKIP_SELECTORS` in `content.js`.
- This only automates clicking a button YouTube already shows you; it
  doesn't block or remove ads.
