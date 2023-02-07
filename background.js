 var temp;
 var jsonData = '';

 chrome.runtime.onConnect.addListener((port) => {
   port.onMessage.addListener((msg) => {
     // Handle message however you want
   });
});

chrome.runtime.onMessage.addListener(function (message, sender, sendResponse) {
   switch (message.type) {
     case "showData":
       temp = message.data;
       jsonData = JSON.stringify(temp);
       chrome.browserAction.setPopup({ popup: "popup.html" });
       //chrome.runtime.sendMessage({action: 'backGroundMessage', data: jsonData});
       break;
     default:
       console.error("Unrecognised message: ", message);
   }
 });
