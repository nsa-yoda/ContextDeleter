const defaultValues = {
    highlightColor: '0,1,255',
    highlightOpacity: 0.3,
    outlineStyle: 'solid',
    outlineWidth: '1px',
    debugEnabled: false,
    hideTitle: false,
    fadeOutline: true,
    fadeOutlineTime: '1',
    fadeOutlineAfter: '25',
}

/**
 * Updates the options preview values
 * @param items
 */
const update_options = function (items) {
    console.log("items", items);
    document.getElementById('color').value = items.highlightColor;
    document.getElementById('opacity').value = items.highlightOpacity;
    document.getElementById('outline_style').value = items.outlineStyle;
    document.getElementById('outline_width').value = items.outlineWidth;
    document.getElementById('debug_enabled').checked = items.debugEnabled;
    document.getElementById('hide_title').checked = items.hideTitle;
    document.getElementById('fade_outline').checked = items.fadeOutline;
    document.getElementById('fade_outline_time').value = items.fadeOutlineTime;
    document.getElementById('fade_outline_after').value = items.fadeOutlineAfter;
}

/**
 * Stores user selected options in chrome.storage
 */
function save_options(event) {
    document.getElementById('status').textContent = '';
    chrome.storage.sync.set({
        highlightColor: document.getElementById('color').value,
        highlightOpacity: document.getElementById('opacity').value,
        outlineStyle: document.getElementById('outline_style').value,
        outlineWidth: document.getElementById('outline_width').value,
        debugEnabled: document.getElementById('debug_enabled').checked,
        hideTitle: document.getElementById('hide_title').checked,
        fadeOutline: document.getElementById('fade_outline').checked,
        fadeOutlineTime: document.getElementById('fade_outline_time').value,
        fadeOutlineAfter: document.getElementById('fade_outline_after').value,
    }, function () {
        // Update status to let user know options were saved.
        document.getElementById('status').textContent = 'Options saved.';
    });
    event && event.preventDefault()
}

/**
 * Restores state using the preferences stored in chrome.storage, or the defaults if none in storage
 * @param event
 */
function restore_options(event) {
    chrome.storage.sync.get(defaultValues, function (items) {
        update_options(items);
        update_preview();
    });
    event.preventDefault()
}

/**
 * Updates the preview box in options page
 */
const update_preview = function () {
    const outline_width = document.getElementById('outline_width').value;
    const outline_style = document.getElementById('outline_style').value;
    const color = document.getElementById('color').value;
    const opacity = document.getElementById('opacity').value;
    document.getElementById('preview').style.outline = `${outline_width} ${outline_style} rgba(${color}, ${opacity})`;
    document.getElementById('hey_its_me_debug').style.display = document.getElementById('debug_enabled').checked ? 'inline' : 'none';
    document.getElementById('heading').style.display = document.getElementById('hide_title').checked ? 'none' : 'block';
};

/**
 * Reset settings to default
 */
const reset_settings = function () {
    console.log("Resetting", defaultValues)
    update_options(defaultValues);
    save_options(null);
    update_preview();
}

/**
 * Our options page event listeners
 */
document.addEventListener('DOMContentLoaded', restore_options);
document.getElementById('options_form').addEventListener('change', update_preview);
document.getElementById('reset_settings').addEventListener('click', reset_settings);
document.getElementById('save').addEventListener('click', save_options);