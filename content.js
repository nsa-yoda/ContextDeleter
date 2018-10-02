let clickedElement; // the clicked element
let clickedElementCopy; // copy of the clicked element for posterity
let originalOutlineStyle; // contains the original styles of the element

let contains = function (needle, indexOf) {
    let findNaN = needle !== needle; // identify NaN needle
    if (!findNaN && typeof Array.prototype.indexOf === 'function') {
        indexOf = Array.prototype.indexOf;
    } else {
        indexOf = function (needle) {
            let i = -1, index = -1;
            for (i = 0; i < this.length; i++) {
                let item = this[i];
                if ((findNaN && item !== item) || item === needle) {
                    index = i;
                    break;
                }
            }
            return index;
        };
    }
    return indexOf.call(this, needle) > -1;
};

jQuery(document).on('mousedown', 'body', function (event) {
    chrome.storage.sync.get({
        highlightColor: '0,0,255',
        highlightOpacity: 0.3,
        outlineStyle: 'solid',
        outlineWidth: '1px',
        debugEnabled: false,
    }, function(items) {
        let highlightColor = items.highlightColor;
        let highlightOpacity = items.highlightOpacity;
        let outlineStyle = items.outlineStyle;
        let outlineWidth = items.outlineWidth;
        let debugEnabled = items.debugEnabled;

        let config = {
            'event': {
                'button': {
                    'target': [2],           // buttons to listen to target an element
                    'exit': [1, 0]           // buttons to listen to exit
                }
            },
            'outline': outlineWidth + ' ' + outlineStyle + ' rgba(' + highlightColor + ', ' + highlightOpacity + ')'    // default outline for selection
        };

        if (highlightColor === "transparent") {
            config['outline'] = 'none';
            if(debugEnabled === true) {
                console.log("ContextDeleterTarget INFO highlight color TRANSPARENT");
            }
        }

        if (outlineStyle === 'hidden') {
            config['outline'] = 'none';
            if(debugEnabled === true) {
                console.log("ContextDeleterTarget INFO outline style set to HIDDEN");
            }
        }

        if ( contains.call(config['event']['button']['target'], event.button) ) {
            // in case of re-targeting, reset the outline style of the old targeted element
            if (clickedElementCopy !== null && $(clickedElementCopy).css('outline') !== originalOutlineStyle){
                $(clickedElementCopy).css('outline', originalOutlineStyle);
            }

            clickedElement = event.target;
            originalOutlineStyle = $(clickedElement).css('outline'); // store the original outline style

            // set the target outline
            $(clickedElement).css('outline', config['outline']);

            // make a copy of the clicked element
            if ( clickedElement !== clickedElementCopy ) {
                clickedElementCopy = clickedElement
            }

            if(debugEnabled === true) {
                console.log("ContextDeleterTarget: " + clickedElement);
            }
        }

        // Check if we receive an exit event
        if ( contains.call(config['event']['button']['exit'], event.button) ){
            // Seems we did not want to delete the element
            if ( originalOutlineStyle !== null ){
                // Reset the original styles since we did not delete the element
                $(clickedElementCopy).css('outline', originalOutlineStyle);
                if(debugEnabled === true) {
                    console.log("ContextDeleter restored styles to: " + clickedElementCopy);
                }
            }
        }
    });
});

chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
    if (request.action === "deleteElement") {
        $(clickedElement).remove();
    }
    sendResponse({value: "ok"})
});