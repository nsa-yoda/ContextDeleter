let clickedElement; // the clicked element
let clickedElementCopy; // copy of the clicked element for posterity
let originalOutlineStyle; // contains the original styles of the element

let contains = function (needle, indexOf) {
    let findNaN = needle !== needle; // identify NaN needle
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

let exit = function(event, config, originalOutlineStyle, clickedElementCopy, debugEnabled){
    // Check if we receive an exit event
    if ( contains.call(config['event']['button']['exit'], event.button) ){
        // Seems we did not want to delete the element
        if ( originalOutlineStyle !== null ){
            // Reset the original styles since we did not delete the element
            jQuery(clickedElementCopy).css('outline', originalOutlineStyle);
            if(debugEnabled === true) {
                console.log("ContextDeleter restored styles to: " + clickedElementCopy);
            }
            return true;
        }
    }
    return false;
};

let fadeOutFunc = function(clickedElement, highlightColor, originalColor, timeInt, outlineWidth, outlineStyle, highlightOpacity, fadeOutlineAfter) {
    let matchColors = /((\s*?\d{1,3}\s*?,?\s*?){3})/;
    highlightColor = matchColors.exec(highlightColor);
    if(originalColor.length > 1) {
        highlightColor = highlightColor[0];
    }

    let fadeTime = parseInt(timeInt) * 1000;
    setTimeout(function(){
        $({alpha:1}).animate({alpha:0}, {
            duration: fadeTime,
            step: function(){
                jQuery(clickedElement).css('outline', `${outlineWidth} ${outlineStyle} rgba(${highlightColor},${this.alpha})`);
            }
        });
    }, parseInt(fadeOutlineAfter));
};

jQuery(document).on('mousedown', 'body', function (event) {
    chrome.storage.sync.get({
        highlightColor: '0,0,255',
        highlightOpacity: 0.3,
        outlineStyle: 'solid',
        outlineWidth: '1px',
        debugEnabled: false,
        fadeOutline: false,
        fadeOutlineTime: '5',
        fadeOutlineAfter: '250',
    }, function(items) {
        let highlightColor = items.highlightColor;
        let highlightOpacity = items.highlightOpacity;
        let outlineStyle = items.outlineStyle;
        let outlineWidth = items.outlineWidth;
        let debugEnabled = items.debugEnabled;
        let fadeOutline = items.fadeOutline;
        let fadeOutlineTime = items.fadeOutlineTime;
        let fadeOutlineAfter = items.fadeOutlineAfter;

        // rebuild our config
        let config = {
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
            if(debugEnabled === true) {
                console.log("ContextDeleterTarget INFO highlight color TRANSPARENT/HIDDEN");
            }
        }

        if ( contains.call(config['event']['button']['target'], event.button) ) {
            // in case of re-targeting, reset the outline style of the old targeted element
            if (clickedElementCopy !== null && jQuery(clickedElementCopy).css('outline') !== originalOutlineStyle){
                jQuery(clickedElementCopy).css('outline', originalOutlineStyle);
            }

            clickedElement = event.target;
            originalOutlineStyle = jQuery(clickedElement).css('outline'); // store the original outline style

            // set the target outline
            jQuery(clickedElement).css('outline', config['outline']);

            if(fadeOutline === true){
                fadeOutFunc(clickedElement, highlightColor, originalOutlineStyle, fadeOutlineTime, outlineWidth, outlineStyle, highlightOpacity,fadeOutlineAfter);
            }

            // make a copy of the clicked element
            if ( clickedElement !== clickedElementCopy ) {
                clickedElementCopy = clickedElement
            }

            if(debugEnabled === true) {
                console.log("ContextDeleterTarget: " + clickedElement);
            }
        }

        exit(event, config, originalOutlineStyle, clickedElementCopy, debugEnabled);
    });

});

chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
    if (request.action === "deleteElement") {
        jQuery(clickedElement).remove();
    }
    sendResponse({value: "ok"})
});