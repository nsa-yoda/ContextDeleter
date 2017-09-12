// Saves options to chrome.storage
function save_options() {
    document.getElementById('status').textContent = '';
    var color = document.getElementById('color').value;
    var opacity = document.getElementById('opacity').value;
    var outlineStyle = document.getElementById('outline_style').value;
    var outlineWidth = document.getElementById('outline_width').value;

    chrome.storage.sync.set({
        highlightColor: color,
        highlightOpacity: opacity,
        outlineStyle: outlineStyle,
        outlineWidth: outlineWidth
    }, function() {
        // Update status to let user know options were saved.
        var status = document.getElementById('status');
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
        outlineWidth: '1px'
    }, function(items) {
        document.getElementById('color').value = items.highlightColor;
        document.getElementById('opacity').value = items.highlightOpacity;
        document.getElementById('outline_style').value = items.outlineStyle;
        document.getElementById('outline_width').value = items.outlineWidth;
    });
}
document.addEventListener('DOMContentLoaded', restore_options);
document.getElementById('save').addEventListener('click', save_options);