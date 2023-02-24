
 chrome.action.onClicked.addListener((tab) => {
    console.log('clicked'),
    chrome.tabs.sendMessage(tab.id, {
      
      type: "TEXT",
    });
  });

//   chrome.tabs.onUpdated.addListener(function (tabId, changeInfo, tab) {
//     if (changeInfo.status === "complete") {
//       console.log('===',changeInfo.status)
//       chrome.tabs.sendMessage(tabId, { message: "page_loaded" });
//     }
//   });


// chrome.action.onClicked.addListener(function(message, sender, sendResponse) {
//   // if (message.type === "applyClicked") {
//     console.log('event-bg')

//     chrome.tabs.sendMessage('',{ type: "autofillText", text: "Your text here." });
//   // }
// });
