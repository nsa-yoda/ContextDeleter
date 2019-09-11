let bkg = chrome.extension.getBackgroundPage();

chrome.contextMenus.onClicked.addListener(function(info, tab){
    chrome.tabs.sendMessage(tab.id, {'action': 'deleteElement'});
});

chrome.contextMenus.create({
    'id': 'ContextDeleterZap',
    'type': 'normal',
    'title': chrome.i18n.getMessage('openContextMenuTitle'),
    'contexts': ['all']
});