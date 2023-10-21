highlightID = "highlightText";
chrome.contextMenus.create({
  id: "highlightText",
  title: "Highlight Text",
  contexts: ["selection"],
});

//context menu option to look up rate my professor
rateID = "rateProfessors";
chrome.contextMenus.create({
  id: rateID,
  title: "Look up professor rating",
  contexts: ["selection"],
});
chrome.contextMenus.onClicked.addListener(async (info, tab) => {
  if (info.menuItemId == rateID) {
    const selectedText = info.selectionText;
    console.log(selectedText);
    const searchURL =
      "https://www.ratemyprofessors.com/search/professors?q=" + selectedText;
    chrome.tabs.create({ url: searchURL });
  } else if (info.menuItemId === "highlightText") {
    const selectedText = info.selectionText;
    console.log(info);
    if (selectedText) {
      // User has selected text, you can perform actions here
      console.log("Selected Text:", selectedText);

      // Send a message to the popup
      const [tab] = await chrome.tabs.query({
        active: true,
        lastFocusedWindow: true,
      });
      chrome.tabs.sendMessage(tab.id, {
        message_id: "highlightText",
        data: selectedText,
      });
    }
  }
});

//context menu option to look up rate my professor
rateID = "rateProfessors";
chrome.contextMenus.create({
  id: rateID,
  title: "Look up professor rating",
  contexts: ["selection"],
});
chrome.contextMenus.onClicked.addListener(async (info, tab) => {
  if (info.menuItemId == rateID) {
    const selectedText = info.selectionText;
    console.log(selectedText);
    const searchURL =
      "https://www.ratemyprofessors.com/search/professors?q=" + selectedText;
    chrome.tabs.create({ url: searchURL });
  }
});

let timerInterval;
let timerDuration = [5, 3, 1500, 300, 1500, 30, 1500, 1800]; // Initial duration (25 minutes in seconds)
let timerRunning = false;
let timerIndex = 0;
let timeRemaining = timerDuration[timerIndex];

function startTimer() {
  if (!timerRunning) {
    timerInterval = setInterval(updateTimer, 1000);
    timerRunning = true;
  }
}

function pauseTimer() {
  clearInterval(timerInterval);
  timerRunning = false;
}

function resetTimer() {
  console.log(timerIndex);
  pauseTimer();

  if (timerIndex == 7) timerIndex = -1;
  timerIndex++;
  timeRemaining = timerDuration[timerIndex];

  sendUpdateToPopup();
}

function updateTimer() {
  timeRemaining--;
  sendUpdateToPopup();
  if (timeRemaining == 0) {
    resetTimer();
  }
}

function sendUpdateToPopup() {
  chrome.runtime.sendMessage({ type: "timerUpdate", timeLeft: timeRemaining, timerIndex:timerIndex });
}

// Listen for messages from the popup
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.type === "startTimer") {
    startTimer();
  } else if (message.type === "stopTimer") {
    pauseTimer();
  }
});

function showNotification() {
  const options = {
    type: "basic",
    title: "Timer Completed",
    message: "Your timer has finished!",
    iconUrl: "./../images/icon-128px.png", // Provide a path to an icon for the notification.
    silent: true, // Set to true if you want to play a sound.
  };

  chrome.notifications.create("timerCompleteNotification", options, (notificationId) => {
    // Handle notification creation (optional).
  });
}

// Add a listener to handle notification click events.
chrome.notifications.onClicked.addListener((notificationId) => {
  // Handle notification click (optional).
});

// Add a listener to handle notification close events.
chrome.notifications.onClosed.addListener((notificationId, byUser) => {
  // Handle notification close (optional).
});
