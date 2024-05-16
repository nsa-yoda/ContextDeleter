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
};

// Updates the options preview values
function updateOptions(items) {
  Object.keys(items).forEach(key => {
    const element = document.getElementById(key);
    if (element) {
      if (element.type === 'checkbox') {
        element.checked = items[key];
      } else {
        element.value = items[key];
      }
    }
  });
  updatePreview();
}

// Stores user selected options in chrome.storage
function saveOptions(event) {
  const statusElement = document.getElementById('status');
  statusElement.textContent = '';
  chrome.storage.sync.set({
    ...defaultValues,
    highlightColor: document.getElementById('color').value,
    highlightOpacity: document.getElementById('opacity').value,
    outlineStyle: document.getElementById('outline_style').value,
    outlineWidth: document.getElementById('outline_width').value,
    debugEnabled: document.getElementById('debug_enabled').checked,
    hideTitle: document.getElementById('hide_title').checked,
    fadeOutline: document.getElementById('fade_outline').checked,
    fadeOutlineTime: document.getElementById('fade_outline_time').value,
    fadeOutlineAfter: document.getElementById('fade_outline_after').value,
  }, () => {
    if (chrome.runtime.lastError) {
      statusElement.textContent = 'Error saving options.';
    } else {
      statusElement.textContent = 'Options saved.';
    }
  });
  event?.preventDefault();
}

// Restores state using the preferences stored in chrome.storage, or the defaults if none in storage
function restoreOptions(event) {
  chrome.storage.sync.get(defaultValues, items => {
    updateOptions(items);
  });
  event?.preventDefault();
}

// Updates the preview box in options page
function updatePreview() {
  const outlineWidth = document.getElementById('outline_width').value;
  const outlineStyle = document.getElementById('outline_style').value;
  const color = document.getElementById('color').value;
  const opacity = document.getElementById('opacity').value;
  const previewElement = document.getElementById('preview');
  if (previewElement) {
    previewElement.style.outline = `${outlineWidth} ${outlineStyle} rgba(${color}, ${opacity})`;
  }
  document.getElementById('hey_its_me_debug').style.display = document.getElementById('debug_enabled').checked ? 'inline' : 'none';
  document.getElementById('heading').style.display = document.getElementById('hide_title').checked ? 'none' : 'block';
}

// Reset settings to default
function resetSettings() {
  updateOptions(defaultValues);
  saveOptions(null);
  updatePreview();
}

// Our options page event listeners
document.addEventListener('DOMContentLoaded', restoreOptions);
document.getElementById('options_form').addEventListener('change', updatePreview);
document.getElementById('reset_settings').addEventListener('click', resetSettings);
document.getElementById('save').addEventListener('click', saveOptions);
