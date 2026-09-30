// Auto Skip Ads - content script
// Runs on youtube.com and watches for ad UI, clicking "Skip Ad" the instant
// it becomes clickable, and nudging playback forward on non-skippable ads.

(function () {
  "use strict";

  let enabled = true;
  chrome.storage && chrome.storage.sync
    ? chrome.storage.sync.get({ enabled: true }, (data) => {
        enabled = data.enabled;
      })
    : null;

  if (chrome.storage && chrome.storage.onChanged) {
    chrome.storage.onChanged.addListener((changes) => {
      if (changes.enabled) enabled = changes.enabled.newValue;
    });
  }

  // Selectors YouTube has used for the skip button over time. This covers
  // both full-video ads and the small banner-style overlay ads that show
  // up on top of a video (which use a "close" button instead of "skip").
  const SKIP_SELECTORS = [
    ".ytp-ad-skip-button",
    ".ytp-ad-skip-button-modern",
    ".ytp-skip-ad-button",
    "button.ytp-ad-skip-button-modern",
    ".ytp-ad-overlay-close-button",
    ".ytp-ad-overlay-close-icon",
    ".videoAdUiSkipButton",
    "[id^='skip-button']",
  ];

  const AD_OVERLAY_SELECTOR = ".ad-showing, .ad-interrupting";

  function clickSkipIfPresent() {
    if (!enabled) return false;
    let clickedSomething = false;
    // Click every matching button found this pass, not just the first —
    // back-to-back ads or an overlay + skip button can both be present.
    for (const sel of SKIP_SELECTORS) {
      const elements = document.querySelectorAll(sel);
      for (const btn of elements) {
        if (btn && btn.offsetParent !== null) {
          btn.click();
          clickedSomething = true;
        }
      }
    }
    return clickedSomething;
  }

  function fastForwardUnskippableAd() {
    if (!enabled) return;
    const player = document.querySelector("video.html5-main-video");
    const isAd = document.querySelector(AD_OVERLAY_SELECTOR);
    if (player && isAd && !isNaN(player.duration) && player.duration > 0) {
      // Jump to the end of the current ad segment; YouTube will advance
      // to the next ad or resume content.
      try {
        player.currentTime = player.duration;
      } catch (e) {
        /* no-op */
      }
    }
  }

  // Mute during ads is optional and off by default to avoid surprising
  // audio changes on the actual content; left out intentionally.

  const observer = new MutationObserver(() => {
    clickSkipIfPresent();
  });

  observer.observe(document.documentElement, {
    childList: true,
    subtree: true,
    attributes: true,
    attributeFilter: ["class"],
  });

  // Poll as a fallback in case mutation events are throttled.
  setInterval(() => {
    if (!clickSkipIfPresent()) {
      fastForwardUnskippableAd();
    }
  }, 400);
})();
