let timerDisplay = document.getElementById("timer");
let startButton = document.getElementById("startButton");
let stopButton = document.getElementById("stopButton");
let resetButton = document.getElementById("resetButton");

// Connect to the background script
const port = chrome.runtime.connect({ name: "popup" });

port.onMessage.addListener((message) => {
  if (message.type === "updateTimer") {
    const minutes = Math.floor(message.timeLeft / 60);
    const seconds = message.timeLeft % 60;
    timerDisplay.textContent = `${minutes.toString().padStart(2, "0")}:${seconds.toString().padStart(2, "0")}`;
  }
});

startButton.addEventListener("click", () => {
  port.postMessage({ type: "startTimer" });
});

stopButton.addEventListener("click", () => {
  port.postMessage({ type: "stopTimer" });
});

resetButton.addEventListener("click", () => {
  port.postMessage({ type: "resetTimer" });
});
