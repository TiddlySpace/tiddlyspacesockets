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

var ws = new WebSocket('ws://10.10.1.142:8080/');
var el = $("#realtime")[0] || document.body;
var container = $("<ul />").appendTo(el);
ws.onmessage = function(e) {
	var url = e.data;
	$.ajax({
		url: url,
		dataType: "json",
		success: function(tiddler) {
			var html = Mustache.to_html(itemtemplate, tiddler);
			container.prepend(html);
		}
	})
};
