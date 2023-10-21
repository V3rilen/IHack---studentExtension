const fetchHighlights = (url) => {
  return chrome.storage.local.get([url]);
};

function getXPathOfElement(element) {
  const idx = (sib, name) =>
    sib
      ? idx(sib.previousElementSibling, name || sib.localName) +
        (sib.localName == name)
      : 1;
  const segs = (elm) =>
    !elm || elm.nodeType !== 1
      ? [""]
      : elm.id && document.getElementById(elm.id) === elm
      ? [`//*[@id="${elm.id}"]`]
      : [
          ...segs(elm.parentNode),
          `${elm.localName.toLowerCase()}[${idx(elm)}]`,
        ];
  return segs(element).join("/");
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
    // const element = document.createElement(newElement.tagName);
    // element.textContent = newElement.textContent;
    // element.className = "highlighted";

    targetElement.innerHTML = newElement.parentNodeHTML;
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
  let highlights = {};
  console.log("context.js loaded");
  const currentURL = window.location.toString();

  let pageHighlights = [];
  let fetchedHighlights = await chrome.storage.local.get("savedHighlights");
  if (fetchedHighlights.savedHighlights) {
    pageHighlights = [...fetchedHighlights.savedHighlights[currentURL]];
    // console.log("Saved Highlights:", pageHighlights);
    Object.keys(pageHighlights).forEach((pageURL) => {
      let highlight = pageHighlights[pageURL];
      //   console.log(highlight);
      //   console.log(highlight.textContent, highlight.xpath.split("/span")[0]);
      createElementAtXPath(highlight.xpath.split("/span")[0], {
        tagName: "span",
        parentNodeHTML: highlight.parentNodeHTML,
        textContent: highlight.textContent,
      });
    });
    // console.log(await fetchHighlights(currentURL));
  }
  //   console.log(`Page Highlights, ${pageHighlights} loaded`);

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
            pageHighlights = pageHighlights.filter((highlight) => {
              return highlight.textContent !== selectedText.toString();
            });
          } else {
            const newHighlightedElement = document.createElement("span");
            newHighlightedElement.className = "highlighted";
            selectedTextRange.surroundContents(newHighlightedElement);
            console.log(selectedTextRange);
            let highlightData = {
              xpath: getXPathOfElement(newHighlightedElement),
              parentNodeHTML:
                selectedTextRange.commonAncestorContainer.innerHTML,
              textContent: selectedText.toString(),
            };
            // console.log(highlightData);
            pageHighlights.push(highlightData);
            highlights[currentURL] = pageHighlights;

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
          }
          chrome.storage.local.set({
            savedHighlights: highlights,
          });
          //   chrome.storage.local.clear();
          let tempHighlights = await fetchHighlights("savedHighlights");
          console.log(tempHighlights);
        }
      } else if (request.message_id == "clearHighlights") {
        if (confirm("Are you sure you want to delete all Highlights?")) {
          chrome.storage.local.remove("savedHighlights");
        }
      }
      /* Content script action */
    }
  );
})();
