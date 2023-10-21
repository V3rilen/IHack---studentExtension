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
