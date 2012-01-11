(function($) {
	
$("#realtime-widget").remove();
var container = $('<div id="realtime-widget" />').css({
	position: "fixed",
	left: 0,
	bottom: 0,
	"border-bottom": "solid 20px #333",
	"background-color": "#ccc",
	width: "100%",
	"border-top": "solid 2px black"
}).appendTo(document.body)[0];

var height = 150;

var widget = $('<iframe id="realtime-widget" src="http://sockets.tiddlyspace.com/index.html" />').appendTo(container);
$(widget).css({
	position: "relative",
	height: height,
	width: "100%"
});

// offset body so can always see entire document regardless of whether real time window open
var padding = parseInt($(document.body).css("padding-bottom"), 10);
var new_padding = padding + height;
$(document.body).css({ "padding-bottom": new_padding });

$('<button>real time</button>').click(function(ev) {
	$(widget).toggle();
}).css({ position: "absolute", right: 0, bottom: "-20px" }).appendTo(container);

})(jQuery);