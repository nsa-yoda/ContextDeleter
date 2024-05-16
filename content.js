let clickedElement = null; // the clicked element
let clickedElementCopy = null; // copy of the clicked element for posterity
let originalOutlineStyle = null; // contains the original styles of the element

chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
    if (request.deleteElement) {
        $(clickedElement).remove();
    }
    sendResponse({deleted: true})
});

const fadeOutFunc = function (clickedElement, highlightColor, originalColor, timeInt, outlineWidth, outlineStyle, highlightOpacity, fadeOutlineAfter) {
    highlightColor = /((\s*?\d{1,3}\s*?,?\s*?){3})/.exec(highlightColor);
    highlightColor = (originalColor.length > 1) ? highlightColor[0] : highlightColor;
    setTimeout(function () {
        $({alpha: 1}).animate({alpha: 0}, {
            duration: parseInt(timeInt) * 1000,
            step: function () {
                $(clickedElement).css('outline', `${outlineWidth} ${outlineStyle} rgba(${highlightColor},${this.alpha})`);
            }
        });
    }, parseInt(fadeOutlineAfter));
};


const exit = function (event, config) {
    if (contains.call(config['event']['button']['exit'], event.button) && originalOutlineStyle !== null) {
        $(clickedElementCopy).css('outline', originalOutlineStyle);
        log(`ContextDeleter restored styles to: ${clickedElementCopy}`);
        return true;
    }
    return false;
};

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
            log(`ContextDeleterTarget: ${clickedElement}`)
        }

        exit(event, config);
    });
});
