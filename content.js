const fetchHighlights = (url) => {
  return chrome.storage.local.get([url]);
};

function getXPathOfElement(element) {
  if (element.id !== "") {
    // If the element has an ID, use it for the XPath
    return `//*[@id="${element.id}"]`;
  }

  if (element === document.body) {
    // If we reach the body element, stop
    return element.tagName;
  }

  // Find the element's index among its siblings
  let index = 1;
  let sibling = element;

  while (sibling && (sibling = sibling.previousElementSibling)) {
    index++;
  }

  // Recurse up the DOM to build the full XPath
  return (
    getXPathOfElement(element.parentNode) + "/" + element.tagName + `[${index}]`
  );
}

function createElementAtXPath(xpath, newElement) {
  const result = document.evaluate(
    xpath,
    document,
    null,
    XPathResult.ANY_UNORDERED_NODE_TYPE,
    null
  );

  const targetElement = result.singleNodeValue;

  if (targetElement) {
    const element = document.createElement(newElement.tagName);
    element.textContent = newElement.textContent;

    targetElement.parentNode.insertBefore(element, targetElement);
  } else {
    console.log("error");
  }
}

// Example usage:
// const targetXPath = createXPath(document.getElementById("targetElement"));
// const newElementInfo = {
//   tagName: "p",
//   textContent: "This is a new paragraph.",
// };

// createElementAtXPath(targetXPath, newElementInfo);

(async () => {
  console.log("context.js loaded");
  const currentURL = window.location.toString();

  let pageHighlights = [];
  if (await fetchHighlights(currentURL)) {
    pageHighlights = await fetchHighlights(currentURL);
    // console.log(await fetchHighlights(currentURL));
  }
  //   console.log(pageHighlights);

  chrome.runtime.onMessage.addListener(
    async (request, sender, sendResponse) => {
      if (request.message_id == "highlightText") {
        const selectedText = window.getSelection();
        if (selectedText.toString()) {
          let selectedTextRange = selectedText.getRangeAt(0);
          if (
            selectedText.anchorNode.parentNode.classList.contains("highlighted")
          ) {
            selectedText.anchorNode.parentNode.classList.toggle("highlighted");
          } else {
            const newHighlightedElement = document.createElement("span");
            newHighlightedElement.className = "highlighted";
            selectedTextRange.surroundContents(newHighlightedElement);
            let highlightData = {
              xpath: getXPathOfElement(newHighlightedElement),
              textContent: newHighlightedElement.textContent,
            };
            console.log(highlightData);
            pageHighlights.push(highlightData);

            //   console.log(getElementXPath(newHighlightedElement.parentElement));
            //   const targetXPath = getElementXPath(
            //     newHighlightedElement.parentElement
            //   );
            //   const newElementInfo = {
            //     tagName: "span",
            //     textContent: "WOOOOOOOORDS",
            //   };

            //   createElementAtXPath(targetXPath, newElementInfo);
            //   //   const rangeData = {
            //   //     commonAncestorContainer: selectedTextRange.commonAncestorContainer,
            //   //     startContainer: selectedTextRange.startContainer,
            //   //     startOffset: selectedTextRange.startOffset,
            //   //     endContainer: selectedTextRange.endContainer,
            //   //     endOffset: selectedTextRange.endOffset,
            //   //   };
            //   pageHighlights.push(getElementXPath(newHighlightedElement));
            //   console.log("page highlights before:", selectedText);
            //   console.log(document.documentElement.toString());
            chrome.storage.local.set({
              [currentURL]: pageHighlights,
            });
            console.log();
          }
        }
      }
      /* Content script action */
    }
  );
})();
