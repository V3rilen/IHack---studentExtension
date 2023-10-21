(() => {
  console.log("context.js loaded");
  chrome.runtime.onMessage.addListener(function (
    request,
    sender,
    sendResponse
  ) {
    if (request.message_id == "highlight_text") {
      const selectedText = window.getSelection();
      if (selectedText) {
        // User has selected text, you can perform actions here
        let parentNode = selectedText.anchorNode.parentNode;
        let new_text = parentNode.textContent.split(selectedText.toString());
        if (selectedText.toString()) {
          // console.log("Split text", new_text);
          new_text.splice(
            1,
            0,
            `<span style="background-color:yellow;">${selectedText.toString()}</span>`
          );
          // new_text.splice(1, 0, `${selectedText.toString()}`);
          parentNode.innerHTML = new_text.join("");
          console.log("Selected Text:", new_text);
        }

        // Send a message to the background script
        // chrome.runtime.sendMessage({ selectedText });
      }
    }
    /* Content script action */
  });
})();
