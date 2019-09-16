// Saves options to chrome.storage
function save_options() {
    document.getElementById('status').textContent = '';
    let color = document.getElementById('color').value;
    let opacity = document.getElementById('opacity').value;
    let outlineStyle = document.getElementById('outline_style').value;
    let outlineWidth = document.getElementById('outline_width').value;
    let debugEnabled = document.getElementById('debug_enabled').checked;
    let hideTitle = document.getElementById('hide_title').checked;
    let fadeOutline = document.getElementById('fade_outline').checked;
    let fadeOutlineTime = document.getElementById('fade_outline_time').value;
    let fadeOutlineAfter = document.getElementById('fade_outline_after').value;

    chrome.storage.sync.set({
        highlightColor: color,
        highlightOpacity: opacity,
        outlineStyle: outlineStyle,
        outlineWidth: outlineWidth,
        debugEnabled: debugEnabled,
        hideTitle: hideTitle,
        fadeOutline: fadeOutline,
        fadeOutlineTime: fadeOutlineTime,
        fadeOutlineAfter: fadeOutlineAfter,
    }, function() {
        // Update status to let user know options were saved.
        let status = document.getElementById('status');
        status.textContent = 'Options saved.';
    });
    event.preventDefault()
}

// Restores select box and checkbox state using the preferences stored in chrome.storage.
function restore_options() {
    // Restore, or use default values
    chrome.storage.sync.get({
        highlightColor: 'blue',
        highlightOpacity: 0.3,
        outlineStyle: 'solid',
        outlineWidth: '1px',
        debugEnabled: false,
        hideTitle: false,
        fadeOutline: false,
        fadeOutlineTime: '5',
        fadeOutlineAfter: '250',
    }, function(items) {
        document.getElementById('color').value = items.highlightColor;
        document.getElementById('opacity').value = items.highlightOpacity;
        document.getElementById('outline_style').value = items.outlineStyle;
        document.getElementById('outline_width').value = items.outlineWidth;
        document.getElementById('debug_enabled').checked = items.debugEnabled;
        document.getElementById('hide_title').checked = items.hideTitle;
        document.getElementById('fade_outline').checked = items.fadeOutline;
        document.getElementById('fade_outline_time').value = items.fadeOutlineTime;
        document.getElementById('fade_outline_after').value = items.fadeOutlineAfter;
        update_preview();
    });
}

let update_preview = function() {
    let outline_width = document.getElementById('outline_width').value;
    let outline_style = document.getElementById('outline_style').value;
    let color = document.getElementById('color').value;
    let opacity = document.getElementById('opacity').value;

    let outline = `${outline_width} ${outline_style}`;
    let rgba = `rgba(${color}, ${opacity})`;

    document.getElementById('preview').style.outline = `${outline} ${rgba}`;

    if (document.getElementById('debug_enabled').checked) {
        document.getElementById('hey_its_me_debug').style.display = 'inline';
    } else {
        document.getElementById('hey_its_me_debug').style.display = 'none';
    }

    if(document.getElementById('hide_title').checked) {
        document.getElementById('heading').style.display = 'none';
    } else {
        document.getElementById('heading').style.display = 'block';
    }
};


document.getElementById('options_form').addEventListener('change', function (e) {
    update_preview();
});
document.addEventListener('DOMContentLoaded', restore_options);
document.getElementById('save').addEventListener('click', save_options);