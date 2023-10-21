let highlightsGroup;
let allHighlights = [];
async function functionNameHere(){

    highlightsGroup = await chrome.storage.local.get();

    Object.values(highlightsGroup).forEach(element => {
        for(i=0; i<element.length; i++)
        allHighlights.push(element[i].textContent);
    });
    console.log(allHighlights);
}

// getHighlightsButton.addEventListener("click", async () => {
//   console.log(chrome.storage.local.get());
// });
