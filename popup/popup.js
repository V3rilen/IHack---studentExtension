let timerDisplay = document.getElementById("timer");
let startButton = document.getElementById("startButton");
let stopButton = document.getElementById("stopButton");
let statisdisplay = document.getElementById("statis");

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.type === "timerUpdate") {
    console.log("log");
    const minutes = Math.floor(message.timeLeft / 60);
    const seconds = message.timeLeft % 60;
    timerDisplay.textContent = `${minutes.toString().padStart(2, "0")}:${seconds.toString().padStart(2, "0")}`;
  }
  if (message.timerIndex%2==0) {
    statisdisplay.textContent = "Work for ";
  }
  else {
    statisdisplay.textContent = "Break for ";
  }
});

startButton.addEventListener("click", () => {
  chrome.runtime.sendMessage({ type: "startTimer" });
});

stopButton.addEventListener("click", () => {
  chrome.runtime.sendMessage({ type: "stopTimer" });
});

document.getElementById("flashcard-window-button").addEventListener("click", () => {
  chrome.windows.create({
    url: "flashcards.html",
    type: "popup",
    width: 800, // Adjust the size as needed
    height: 600,
  });
});