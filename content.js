var clickedElement; // the clicked element
var clickedElementCopy; // copy of the clicked element for posterity
var originalBorderStyle; // contains the original styles of the element

var contains = function (needle, indexOf) {
    var findNaN = needle !== needle; // identify NaN needle
    if (!findNaN && typeof Array.prototype.indexOf === 'function') {
        indexOf = Array.prototype.indexOf;
    } else {
        indexOf = function (needle) {
            var i = -1, index = -1;
            for (i = 0; i < this.length; i++) {
                var item = this[i];
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

jQuery(document).on('mousedown', function (event) {
    var config = {
            'event': {
                'button': {
                    'target': [2],           // buttons to listen to target an element
                    'exit': [1, 0]           // buttons to listen to exit
                }
            },
            'border': '1px solid blue'    // default border for selection
        };

    if ( contains.call(config['event']['button']['target'], event.button) ) {
        // in case of retargetting, reset the border style of the old targetted element
        if (clickedElementCopy != null && $(clickedElementCopy).css('border') != originalBorderStyle){
            $(clickedElementCopy).css('border', originalBorderStyle);
        }

        clickedElement = event.target;
        originalBorderStyle = $(clickedElement).css('border'); // store the original border style

        // set the target border
        $(clickedElement).css('border', config['border']);

        // make a copy of the clicked element
        if ( clickedElement != clickedElementCopy ) {
            clickedElementCopy = clickedElement
        }
    }

    if ( contains.call(config['event']['button']['exit'], event.button) ){
        if ( originalBorderStyle !== null ){
            $(clickedElementCopy).css('border', originalBorderStyle);
        }
    }
});

chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
    if (request.action == "deleteElement") {
        $(clickedElement).remove();
    }
    sendResponse({value: "ok"})
});