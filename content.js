let clickedElement = null; // the clicked element
let clickedElementCopy = null; // copy of the clicked element for posterity
let originalOutlineStyle = null; // contains the original styles of the element

const contains = function (needle) {
  return this.indexOf(needle) > -1;
};

const exit = function (event, config, debugEnabled) {
  if (contains.call(config['event']['button']['exit'], event.button) && originalOutlineStyle !== null) {
    $(clickedElementCopy).css('outline', originalOutlineStyle);
    writeLog(`ContextDeleter restored styles to: ${clickedElementCopy}`, debugEnabled);
    return true;
  }
  return false;
};

const fadeOutFunc = function (highlightColor, timeInt, outlineWidth, outlineStyle, highlightOpacity, fadeOutlineAfter) {
  highlightColor = /((\s*?\d{1,3}\s*?,?\s*?){3})/.exec(highlightColor)[0];
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
  if (isDebugEnabled) console.log(message);
};

chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
  if(request.ping) { sendResponse({pong: true}); return; }
  /* Content script action */
});

$(document).on('mousedown', 'body', function (event) {
  chrome.storage.sync.get({
    highlightColor: '0,1,255',
    highlightOpacity: 0.3,
    outlineStyle: 'solid',
    outlineWidth: '1px',
    debugEnabled: false,
    fadeOutline: true,
    fadeOutlineTime: '1',
    fadeOutlineAfter: '25',
  }, function (items) {
    const {
      highlightColor,
      highlightOpacity,
      outlineStyle,
      outlineWidth,
      debugEnabled,
      fadeOutline,
      fadeOutlineTime,
      fadeOutlineAfter
    } = items;

    const outline = (highlightColor === "transparent" || outlineStyle === 'hidden') ? 'none' : `${outlineWidth} ${outlineStyle} rgba(${highlightColor}, ${highlightOpacity})`;
    const config = {
      'event': {
        'button': {
          'target': [2], // buttons to listen to target an element
          'exit': [1, 0] // buttons to listen to exit
        }
      }
    };

    if (contains.call(config['event']['button']['target'], event.button)) {
      if (clickedElementCopy !== null && $(clickedElementCopy).css('outline') !== originalOutlineStyle) {
        $(clickedElementCopy).css('outline', originalOutlineStyle);
      }

      clickedElement = event.target;
      originalOutlineStyle = $(clickedElement).css('outline');
      $(clickedElement).css('outline', outline);

      if (fadeOutline === true) {
        fadeOutFunc(highlightColor, fadeOutlineTime, outlineWidth, outlineStyle, highlightOpacity, fadeOutlineAfter);
      }

      clickedElementCopy = clickedElementCopy !== clickedElement ? clickedElement : clickedElementCopy;
      writeLog(`ContextDeleterTarget: ${clickedElement}`, debugEnabled);
    }

    exit(event, config, debugEnabled);
  });
});
