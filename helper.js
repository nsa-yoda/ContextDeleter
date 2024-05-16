let IS_DEBUG_ENABLED = () => {
    const { debugEnabled } = chrome.storage.sync.get('debugEnabled')
    return debugEnabled
}

const contains = function (needle) {
    return this.indexOf(needle) > -1;
};

const log = function (message) {
    if (IS_DEBUG_ENABLED()) {
        console.log(message);
    }
};
