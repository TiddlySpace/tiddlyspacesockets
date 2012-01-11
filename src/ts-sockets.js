// activity item template
var itemtemplate = ['<li class="activity-item">',
	'<a href="{{modifier_url}}">',
		'<img src="{{modifier_siteicon}}" />',
	'</a>',
	'<div>',
		'<p>',
			'<a href="{{modifier_url}}">{{modifier}}</a> is {{action}} ',
			'<a class="tiddler-title" href="{{tiddler_url}}">{{tiddler_title}}</a>',
		'</p>',
	'</div>',
'</li>'].join("");

function init(status) {
var ws = new WebSocket('ws://10.10.1.142:8080/');
var el = $("#realtime")[0] || document.body;
var container = $("<ul />", {class: "activity-stream"}).appendTo(el);

var toMustacheData = function(tiddler) {
	return {
		action: "writing about",
		modifier: tiddler.modifier,
		modifier_url: "http://jon.tiddlyspace.com",
		modifier_siteicon: "http://jon.tiddlyspace.com/SiteIcon",
		tiddler_title: tiddler.title,
		tiddler_url: "http://jon.tiddlyspace.com/DisneyMusic"
	};
};

ws.onmessage = function(e) {
	var url = e.data;
	$.ajax({
		url: url,
		dataType: "json",
		success: function(tiddler) {
			var html = Mustache.to_html(itemtemplate, toMustacheData(tiddler));
			container.prepend(html);
		}
	})
};
}

$.ajax({
	url: "/status",
	dataType: "json",
	success: function(data) {
		init(data);
	}
});
