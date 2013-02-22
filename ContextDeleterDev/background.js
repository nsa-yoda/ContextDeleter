var e = chrome.contextMenus.create({
    "type":"normal", 
    "title":"Delete This Element", 
    "contexts":["all", "page", "frame", "selection", "link", "editable", "image","video", "audio"], 
    "onclick": function(info, tab){
      chrome.tabs.sendRequest(tab.id, "deleteElement")
    } 
});