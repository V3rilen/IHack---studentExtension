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
let x = 0;

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

function resetTimer25() {
  stopTimer();
  timerDuration = .5 * 60;
  sendUpdateToPopup();
}

function resetTimer5() {
  stopTimer();
  timerDuration = 5 * 60;
  sendUpdateToPopup();
}

function updateTimer() {
  if (timerDuration > 0) {
    timerDuration--;
    sendUpdateToPopup();
  } else {
    stopTimer();
    x++;
    // Handle timer completion (e.g., show a notification)
  }
}

function sendUpdateToPopup() {
  chrome.runtime.sendMessage({ type: "timerUpdate", timeLeft: timerDuration });
}

// Listen for messages from the popup
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.type === "startTimer") {
    startTimer();
  } else if (message.type === "stopTimer") {
    stopTimer();
  } else if (message.type === "resetTimer") {
    if (x==0 || x==2) {
      resetTimer5();
    }
    else {
      resetTimer25();
    }
    
  }
});
