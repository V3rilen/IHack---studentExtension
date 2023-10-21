chrome.contextMenus.create({
  id: "highlight_text",
  title: "Highlight Text",
  contexts: ["selection"],
});
chrome.contextMenus.onClicked.addListener(async (info, tab) => {
  if (info.menuItemId === "highlight_text") {
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
        message_id: "highlight_text",
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
  contexts: ["selection"]
});
chrome.contextMenus.onClicked.addListener(async (info, tab) => {
  if (info.menuItemId == rateID) {
    const selectedText = info.selectionText;
    console.log(selectedText);
    const searchURL = "https://www.ratemyprofessors.com/search/professors?q=" + selectedText;
    chrome.tabs.create({ url: searchURL});
  }
});


let timerInterval;
let timerDuration = 25 * 60; // Initial duration (25 minutes in seconds)
let timerRunning = false;
let port; // The connection between background and popup

function startTimer() {
  if (!timerRunning) {
    timerInterval = setInterval(updateTimer, 1000);
    timerRunning = true;
  }
}

function stopTimer() {
  clearInterval(timerInterval);
  timerRunning = false;
}

function resetTimer() {
  clearInterval(timerInterval);
  timerRunning = false;
  timerDuration = 25 * 60;
  updatePopupTimer();
}

function updateTimer() {
  if (timerDuration > 0) {
    timerDuration--;
    updatePopupTimer();
  } else {
    stopTimer();
    // Handle timer completion (e.g., show a notification)
  }
}

function updatePopupTimer() {
  if (port) {
    port.postMessage({ type: "updateTimer", timeLeft: timerDuration });
  }
}

// Handle connections from popup script
chrome.runtime.onConnect.addListener((connectedPort) => {
  port = connectedPort;

  port.onMessage.addListener((message) => {
    if (message.type === "startTimer") {
      startTimer();
    } else if (message.type === "stopTimer") {
      stopTimer();
    } else if (message.type === "resetTimer") {
      resetTimer();
    }
  });

  port.onDisconnect.addListener(() => {
    port = null;
  });
});
