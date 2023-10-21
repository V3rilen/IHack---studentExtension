let timerDisplay = document.getElementById("timer");
let startButton = document.getElementById("startButton");
let stopButton = document.getElementById("stopButton");
let resetButton = document.getElementById("resetButton");

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.type === "timerUpdate") {
    const minutes = Math.floor(message.timeLeft / 60);
    const seconds = message.timeLeft % 60;
    timerDisplay.textContent = `${minutes.toString().padStart(2, "0")}:${seconds.toString().padStart(2, "0")}`;
  }
});

startButton.addEventListener("click", () => {
  chrome.runtime.sendMessage({ type: "startTimer" });
});

stopButton.addEventListener("click", () => {
  chrome.runtime.sendMessage({ type: "stopTimer" });
});

resetButton.addEventListener("click", () => {
  chrome.runtime.sendMessage({ type: "resetTimer()" });
});
