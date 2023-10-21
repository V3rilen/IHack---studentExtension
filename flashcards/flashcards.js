async function functionNameHere(){
    console.log(await chrome.storage.local.get([window.location.toString()]));
}

const otherFunction = () =>{

}

console.log("test");
functionNameHere();
