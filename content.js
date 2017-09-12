var clickedElement; // the clicked element
var clickedElementCopy; // copy of the clicked element for posterity
var originalOutlineStyle; // contains the original styles of the element

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

jQuery(document).on('mousedown', 'body', function (event) {
    chrome.storage.sync.get({
        highlightColor: '0,0,255',
        highlightOpacity: 0.3,
        outlineStyle: 'solid',
        outlineWidth: '1px'
    }, function(items) {
        var highlightColor = items.highlightColor;
        var highlightOpacity = items.highlightOpacity;
        var outlineStyle = items.outlineStyle;
        var outlineWidth = items.outlineWidth;

        var config = {
            'event': {
                'button': {
                    'target': [2],           // buttons to listen to target an element
                    'exit': [1, 0]           // buttons to listen to exit
                }
            },
            'outline': outlineWidth + ' ' + outlineStyle + ' rgba(' + highlightColor + ', ' + highlightOpacity + ')'    // default outline for selection
        };

        if (highlightColor === "transparent") { config['outline'] = 'none'; }

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
        }

        if ( contains.call(config['event']['button']['exit'], event.button) ){
            if ( originalOutlineStyle !== null ){
                $(clickedElementCopy).css('outline', originalOutlineStyle);
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