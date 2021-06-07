let clickedElement; // the clicked element
let clickedElementCopy; // copy of the clicked element for posterity
let originalOutlineStyle; // contains the original styles of the element
const $ = jQuery;


const contains = function (needle, indexOf) {
  const findNaN = (needle !== needle); // identify NaN needle
  if (!findNaN && typeof Array.prototype.indexOf === 'function') {
    indexOf = Array.prototype.indexOf;
  } else {
    indexOf = function (needle) {
      let index = -1;
      for (let i = 0; i < this.length; i++) {
        if ((findNaN && this[i] !== this[i]) || this[i] === needle) {
          index = i;
          break;
        }
      }
      return index;
    };
  }
  return indexOf.call(this, needle) > -1;
};

const exit = function (event, config, originalOutlineStyle, clickedElementCopy, debugEnabled) {
  // Check if we receive an exit event
  if (contains.call(config['event']['button']['exit'], event.button)) {
    // Seems we did not want to delete the element
    if (originalOutlineStyle !== null) {
      // Reset the original styles since we did not delete the element
      $(clickedElementCopy).css('outline', originalOutlineStyle);
      writeLog(`ContextDeleter restored styles to: ${clickedElementCopy}`, debugEnabled)
      return true;
    }
  }
  return false;
};

const fadeOutFunc = function (clickedElement, highlightColor, originalColor, timeInt, outlineWidth, outlineStyle, highlightOpacity, fadeOutlineAfter) {
  const matchColors = /((\s*?\d{1,3}\s*?,?\s*?){3})/;
  console.log(highlightColor)
  highlightColor = matchColors.exec(highlightColor);
  console.log(highlightColor)
    highlightColor = (originalColor.length > 1) ? highlightColor[0] : highlightColor;
  console.log(originalColor)
  console.log(highlightColor)
  
  setTimeout(function () {
    $({alpha: 1}).animate({alpha: 0}, {
      duration: parseInt(timeInt) * 1000,
      step: function () {
        $(clickedElement).css('outline', `${outlineWidth} ${outlineStyle} rgba(${highlightColor},${this.alpha})`);
      }
    });
  }, parseInt(fadeOutlineAfter));
};

const writeLog = function (message, isDebugEnabled = false) {
    if(isDebugEnabled) console.log(message);
}

$(document).on('mousedown', 'body', function (event) {
  chrome.storage.sync.get({
    highlightColor: '0,0,255',
    highlightOpacity: 0.3,
    outlineStyle: 'solid',
    outlineWidth: '1px',
    debugEnabled: false,
    fadeOutline: false,
    fadeOutlineTime: '5',
    fadeOutlineAfter: '250',
  }, function (items) {
    const highlightColor = items.highlightColor;
    const highlightOpacity = items.highlightOpacity;
    const outlineStyle = items.outlineStyle;
    const outlineWidth = items.outlineWidth;
    const debugEnabled = items.debugEnabled;
    const fadeOutline = items.fadeOutline;
    const fadeOutlineTime = items.fadeOutlineTime;
    const fadeOutlineAfter = items.fadeOutlineAfter;

    // rebuild our config
    const config = {
      'event': {
        'button': {
          'target': [2], // buttons to listen to target an element
          'exit': [1, 0] // buttons to listen to exit
        }
      },
      'outline': `${outlineWidth} ${outlineStyle} rgba(${highlightColor}, ${highlightOpacity})` // default outline for selection
    };

    if (highlightColor === "transparent" || outlineStyle === 'hidden') {
      config['outline'] = 'none';
      writeLog("ContextDeleterTarget INFO highlight color TRANSPARENT/HIDDEN", debugEnabled)
    }

    if (contains.call(config['event']['button']['target'], event.button)) {
      // in case of re-targeting, reset the outline style of the old targeted element
      if (clickedElementCopy !== null && $(clickedElementCopy).css('outline') !== originalOutlineStyle) {
        $(clickedElementCopy).css('outline', originalOutlineStyle);
      }

      clickedElement = event.target;
      originalOutlineStyle = $(clickedElement).css('outline'); // store the original outline style

      // set the target outline
      $(clickedElement).css('outline', config['outline']);

      if (fadeOutline === true) {
        fadeOutFunc(clickedElement, highlightColor, originalOutlineStyle, fadeOutlineTime, outlineWidth, outlineStyle, highlightOpacity, fadeOutlineAfter);
      }

      // make a copy of the clicked element
      clickedElementCopy = (clickedElement !== clickedElementCopy) ? clickedElement : clickedElementCopy;
      writeLog(`ContextDeleterTarget: ${clickedElement}`, debugEnabled)
    }

    exit(event, config, originalOutlineStyle, clickedElementCopy, debugEnabled);
  });
});
