var clickedEl = null;
var oldClickedEl = null;

// Add event listener on right click
document.addEventListener("mousedown", function(event){
    if(event.button == 2){
      // Remove the border from the old clickedEl
      $(oldClickedEl).css("border","none");
        
      // Which El was clicked?
      clickedEl = event.target;
      
      // Add a border to the clickedEl
      $(event.target).css("border","1px solid blue")
      
      // Make a copy of the clickedEl
      oldClickedEl = clickedEl;
    }
    
    if(event.button == 0 || event.button == 1){
      $(clickedEl, oldClickedEl).css("border","none")
    }
}, true);

// Add onRequest response
chrome.extension.onRequest.addListener(function(request, sender, sendResponse) {
    if(request == "deleteElement")
        $(clickedEl).remove()
});