let highlightsGroup;
let allHighlights = [];
async function functionNameHere(){

    highlightsGroup = await chrome.storage.local.get();

    Object.values(highlightsGroup).forEach(element => {
        for(i=0; i<element.length; i++)
        allHighlights.push(element[i].textContent);
    });
    console.log(allHighlights);
}

const otherFunction = () =>{

}

console.log("test");
functionNameHere();
