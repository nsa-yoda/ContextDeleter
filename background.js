/**
 * workaround as chrome.i18n.getMessage is not available in service workers
 */
const getMessage = async function (message) {
  let locale = navigator.language.split('-')[0];

  // hardcoded locale bounding for the locales we support
  // this must be updated when we add a new locale
  const _locales = ['en', 'es', 'fr', 'gb'];
  if (!_locales.includes(locale)) {
    console.log("ContextDeleter: Locale not found in Locales, defaulting to English")
    locale = "en";
  }

  const jsonLocalFile = `_locales/${locale}/messages.json`;
  return await fetch(jsonLocalFile)
    .then(response => response.json())
    .then(data => {
      if (message in data && data[message].message) {
        return data[message].message;
      }
    })
    .catch(error => {
      console.log(`ContextDeleter: Error in localization: ${error}`)
      return ""
    });
}

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

/**
 * Add creation listeners on installed
 */
chrome.runtime.onInstalled.addListener(async function () {
  chrome.contextMenus.create({
    'id': 'ContextDeleterZap',
    'type': 'normal',
    'title': await getMessage('openContextMenuTitle'),
    'contexts': ['all']
  });

  chrome.runtime.onMessage.addListener(function (message, sender, sendResponse) {
    console.log("message", message)
    console.log("sender", sender)
    console.log("sendResponse", sendResponse)
    if (message.action) {
      if (message.action === "deleteElement") {
        $(clickedElement).remove();
        sendResponse({value: "ok"})
      }
    }
  });

  chrome.contextMenus.onClicked.addListener(async (info, tab) => {
    console.log("Sending message action deleteelement to tab " + tab.id)
    chrome.tabs.sendMessage(tab.id, {'action': 'deleteElement'}, function (response) {
      if (!chrome.runtime.lastError) {
        // message processing code goes here
      } else {
        console.log(chrome.runtime.lastError)
        // error handling code goes here
      }
      
      console.log("got response", response)
    });
  });
});
