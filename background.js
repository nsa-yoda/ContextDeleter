const i18n = (name) => chrome.i18n.getMessage("ext" + name);

chrome.runtime.onInstalled.addListener(function () {
    chrome.contextMenus.create({
        id: 'ContextDeleterZap',
        type: 'normal',
        title: i18n('OpenContextMenuTitle'),
        contexts: ['all'],
        visible: true,
    });
});

chrome.contextMenus.onClicked.addListener((info, tab) => {
    chrome.tabs.sendMessage(tab.id, {deleteElement: true}, function (response) {
        if (chrome.runtime.lastError) {
            throw new Error("bgContextMenuClick Error" + chrome.runtime.lastError + response.toString())
        }
    });
});