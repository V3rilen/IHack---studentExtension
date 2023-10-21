document.addEventListener("DOMContentLoaded", function () {
  const timerInput = document.getElementById("timerInput");
  const startTimerButton = document.getElementById("startTimer");
  const timerDisplay = document.getElementById("timerDisplay");

  chrome.storage.sync.get(["timerValue"], function (data) {
    if (data.timerValue) {
      timerInput.value = data.timerValue;
    }
  });

  startTimerButton.addEventListener("click", function () {
    const timeInSeconds = parseInt(timerInput.value);

    if (!isNaN(timeInSeconds) && timeInSeconds > 0) {
      chrome.storage.sync.set({ "timerValue": timeInSeconds });
      timerDisplay.innerText = `Timer: ${timeInSeconds} seconds`;

      // Start your timer logic here using the timeInSeconds value
    } else {
      timerDisplay.innerText = "Invalid input";
    }
  });
});
