let timerDisplay = document.getElementById("timer");
let startButton = document.getElementById("startButton");
let stopButton = document.getElementById("stopButton");
let clearHighlightsButton = document.getElementById("clearHighlightsButton");
let statisdisplay = document.getElementById("statis");
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.type === "timerUpdate") {
    console.log("log");
    const minutes = Math.floor(message.timeLeft / 60);
    const seconds = message.timeLeft % 60;
    timerDisplay.textContent = `${minutes.toString().padStart(2, "0")}:${seconds
      .toString()
      .padStart(2, "0")}`;
  }
  if (message.timerIndex % 2 == 0) {
    statisdisplay.textContent = "Work for ";
  } else {
    statisdisplay.textContent = "Break for ";
  }
});

startButton.addEventListener("click", () => {
  chrome.runtime.sendMessage({ type: "startTimer" });
});

stopButton.addEventListener("click", () => {
  chrome.runtime.sendMessage({ type: "stopTimer" });
});

clearHighlightsButton.addEventListener("click", async () => {
  console.log("attempting to send message");
  await chrome.tabs.query(
    { active: true, currentWindow: true },
    function (tabs) {
      const activeTab = tabs[0];
      chrome.tabs.sendMessage(activeTab.id, { message_id: "clearHighlights" });
    }
  );
});

document
  .getElementById("flashcard-window-button")
  .addEventListener("click", () => {
    chrome.windows.create({
      url: "flashcards/flashcards.html",
      type: "popup",
      width: 800, // Adjust the size as needed
      height: 600,
    });
  });

//Sessions
let savedSessions = {};
//initialize with a placeholder to avoid null exceptions when saving sessions
savedSessions["placeholder"] = ["placeholder", "placeholder"];
const sessionsDiv = document.getElementById("sessions-display");

document.addEventListener("DOMContentLoaded", async () => {
  //clear used when debugging
  //chrome.storage.local.clear();
  fetchedSessions = await chrome.storage.local.get(["savedSessions"]);
  //object may be empty if no sessions are saved. This will only make the assignment if there is content to assign
  if (Object.keys(fetchedSessions).length != 0){
    savedSessions = fetchedSessions.savedSessions;
    console.log("there are saved sessions: " + savedSessions);
  }
  
  if (Object.keys(savedSessions).length) {
    Object.keys(savedSessions).forEach((sessionName) => {
      if (sessionName === "placeholder") return; //placeholder doesn't show on menu
      const newButton = document.createElement("button");
      newButton.textContent = sessionName;
      newButton.setAttribute('id', sessionName);
      newButton.addEventListener("click", function () {
        openSession(savedSessions[sessionName]);
      });
      sessionsDiv.appendChild(newButton);

      const deleteButton = document.createElement('button');
      deleteButton.textContent = "del";
      deleteButton.addEventListener("click", async function () {
        document.getElementById(sessionName).remove();
        deleteButton.remove();
        delete savedSessions[sessionName];
        chrome.storage.local.clear();
        chrome.storage.local.set({ savedSessions: savedSessions });
      })
      sessionsDiv.appendChild(deleteButton);
    });
  }
});

document.getElementById("save-session").addEventListener("click", () => {
  const sessionName = prompt(
    "Enter a name for your session. \n (keep the same name to overwrite)"
  );
  if (!sessionName) return;
  chrome.tabs.query({}, function (tabs) {
    const urls = tabs.map((tab) => tab.url);
    savedSessions[sessionName] = urls;

    // Update local storage with the updated sessions
    chrome.storage.local.set({ savedSessions: savedSessions });
    console.log(savedSessions);

    // Create a button for the new session
    const newButton = document.createElement("button");
    newButton.textContent = sessionName;
    newButton.addEventListener("click", function () {
      openSession(savedSessions[sessionName]);
    });
    sessionsDiv.appendChild(newButton);
  });
});

function openSession(urls) {
  // Create a new Chrome window
  chrome.windows.create({ focused: true }, function (window) {
    // Loop through the URLs in the session and open each one as a new tab in the new window
    urls.forEach(function (url) {
      chrome.tabs.create({ url: url, windowId: window.id });
    });
  });
}