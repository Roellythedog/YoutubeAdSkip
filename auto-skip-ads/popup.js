const checkbox = document.getElementById("toggle");

chrome.storage.sync.get({ enabled: true }, (data) => {
  checkbox.checked = data.enabled;
});

checkbox.addEventListener("change", () => {
  chrome.storage.sync.set({ enabled: checkbox.checked });
});
