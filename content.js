const fetchHighlights = (url) => {
  return chrome.storage.local.get([url]);
};

// function getXPathOfElement(element) {
//   if (element.id !== "") {
//     // If the element has an ID, use it for the XPath
//     return `//*[@id="${element.id}"]`;
//   }
//   if (element === document.body) {
//     // If we reach the body element, stop
//     return element.tagName;
//   }

//   // Find the element's index among its siblings
//   let index = 1;
//   let sibling = element;
//   if (element.classList.contains("highlighted")) {
//     return (
//       getXPathOfElement(element.parentNode) +
//       "/" +
//       element.tagName +
//       `[${index}]`
//     );
//   }

//   while (sibling && (sibling = sibling.previousElementSibling)) {
//     index++;
//   }

//   // Recurse up the DOM to build the full XPath
//   return (
//     getXPathOfElement(element.parentNode) + "/" + element.tagName + `[${index}]`
//   );
// }

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
  console.log("context.js loaded");
  const currentURL = window.location.toString();

  let pageHighlights = [];
  let fetchedHighlights = await fetchHighlights(currentURL);
  if (fetchedHighlights[currentURL]) {
    pageHighlights = [...fetchedHighlights[currentURL]];
    pageHighlights.forEach((highlight) => {
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
            [currentURL]: pageHighlights,
          });
          //   chrome.storage.local.clear();
          let tempHighlights = await fetchHighlights(currentURL);
          console.log([...tempHighlights[currentURL]]);
        }
      } else if (request.message_id == "clearHighlights") {
        chrome.storage.local.remove([currentURL]);
      }
      /* Content script action */
    }
  );
})();
