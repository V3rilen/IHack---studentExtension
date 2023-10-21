const fetchHighlightsByURL = (url) => {
  return chrome.storage.local.get([url]);
};
const getHighlightsButton = document.getElementById("getHighlightsButton");

getHighlightsButton.addEventListener("click", async () => {
  console.log(chrome.storage.local.get());
});
