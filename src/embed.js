(function($) {
	
$("#realtime-widget").remove();
var container = $('<div id="realtime-widget" />').css({
	position: "fixed",
	left: 0,
	bottom: 0,
	"background-color": "#ccc",
	width: "100%",
	"border-top": "solid 2px black"
}).appendTo(document.body)[0];

var height = 130;

var widget = $('<iframe id="realtime-widget" src="http://sockets.tiddlyspace.com/index.html" />').appendTo(container);
$(widget).css({
	position: "relative",
	height: height,
	"z-index": 0,
	width: "100%"
});

$('<button>real time</button>').click(function(ev) {
	$(widget).toggle();
}).css({
	position: "absolute", right: 0, bottom: "0px",
	"background": "none",
	"z-index": 2,
	"text-indent": -99,
	bottom: 0,
	border: "none",
	"background-repeat": "no-repeat",
	cursor: "pointer",
	"background-image": "url(http://following.tiddlyspace.com/SiteIcon)"
}).appendTo(container);

})(jQuery);