const i18n = (name) => chrome.i18n.getMessage("ext"+name);

const ensureSendMessage = function(tabId, message, callback){
  chrome.tabs.sendMessage(tabId, {ping: true}, function(response){
    if(response && response.pong) { // Content script ready
      chrome.tabs.sendMessage(tabId, message, callback);
    } else { // No listener on the other end
      chrome.tabs.executeScript(tabId, {file: "content.js"}, function(){
        if(chrome.runtime.lastError) {
          console.error(chrome.runtime.lastError);
          throw Error("Unable to inject script into tab " + tabId);
        }
        // OK, now it's injected and ready
        chrome.tabs.sendMessage(tabId, message, callback);
      });
    }
  });
}

chrome.runtime.onInstalled.addListener(function () {
  chrome.contextMenus.create({
    id: 'ContextDeleterZap',
    type: 'normal',
    title: i18n('OpenContextMenuTitle'),
    contexts: ['all'],
    visible: true,
  });

  chrome.runtime.onMessage.addListener(function (message, sender, sendResponse) {
    console.log("message", message)
    console.log("sender", sender)
    console.log("sendResponse", sendResponse)
    if (message.action === "deleteElement") {
      // You might want to validate and handle the message action here
      // For example, ensure that the clicked element exists before removing it
      $(clickedElement).remove();
      sendResponse({value: "ok"});
    }
  });

  chrome.contextMenus.onClicked.addListener( (info, tab) => {
    console.log("Sending message action deleteElement to tab " + tab.id)
    // chrome.tabs.sendMessage
    ensureSendMessage(tab.id, {'action': 'deleteElement'}, function (response) {
      if (chrome.runtime.lastError) {
        console.log("lastError", chrome.runtime.lastError)
        // Handle errors here
      } else {
        console.log("got response", response)
        // Handle response here
      }
    });
  });
});
