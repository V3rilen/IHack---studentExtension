let highlightsGroup;
let allHighlights = [];
async function functionNameHere(){

    highlightsGroup = await chrome.storage.local.get();
    Object.values(highlightsGroup).forEach(element => {
        for(i=0; i<element.length; i++)
        allHighlights.push(element[i].textContent);
    });
    console.log(highlightsGroup);
}
functionNameHere();
// getHighlightsButton.addEventListener("click", async () => {
//   console.log(chrome.storage.local.get());
// });




// In highlightLibary.js
const highlightLibary = allHighlights;
document.addEventListener("DOMContentLoaded", generateFlashcards());

function generateFlashcards() {
  const container = document.getElementById("flashcards-container");
  console.log(flashcards);

  highlightLibary.forEach((content, index) => {
    const highlightLibary = document.createElement("div");
    highlightLibary.classList.add("flashcard");
    highlightLibary.textContent = content;

    // Add additional styling if needed for the flashcards
    // Example: flashcard.style.backgroundColor = "lightblue";

    container.appendChild(highlightLibary);
  });
}

// Call the function to generate and display the flashcards
generateFlashcards();
