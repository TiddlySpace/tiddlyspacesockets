// override control view
$.ajaxSetup({
	beforeSend: function(xhr) {
		xhr.setRequestHeader("X-ControlView", "false");
	}
});

// activity item template
var itemtemplate = ['<li class="activity-item">',
	'<a href="{{modifier_url}}">',
		'<img src="{{modifier_siteicon}}" />',
	'</a>',
	'<div>',
		'<p>',
			'<a href="{{modifier_url}}">{{modifier}}</a> {{action}} ',
			'<a class="tiddler-title" href="{{tiddler_url}}">{{tiddler_title}}</a>',
		'</p>',
		'<p class="date" data-timestamp="{{timestamp}}">{{friendly_date}}</p>',
	'</div>',
'</li>'].join("");

function getUrl(status, space) {
	var host = status.server_host;
	var url = host.scheme + "://" + space + "." + host.host;
	if(host.port) {
		url += ":" + host.port;
	}
	return url + "/";
}

function prettyDate(t) {
	var date = new Date(Date.UTC(
		parseInt(t.substr(0, 4), 10),
		parseInt(t.substr(4, 2), 10) - 1,
		parseInt(t.substr(6, 2), 10),
		parseInt(t.substr(8, 2), 10),
		parseInt(t.substr(10, 2), 10),
		parseInt(t.substr(12, 2) || "0", 10),
		parseInt(t.substr(14, 3) || "0", 10)
	));
	return simpleDate(date);
}

function init(status) {
var socket = io.connect('http://tiddlyspace.com:8081');
var el = $("#realtime")[0] || document.body;
var container = $("<ul />", {class: "activity-stream"}).appendTo(el);

var toMustacheData = function(tiddler) {
	var modifier_base = getUrl(status, tiddler.modifier);
	var origin_space = tiddler.bag.split("_");
	if(origin_space.length > 1) {
		var origin_base = getUrl(status, origin_space[0]);
		var action;
		var isPlugin = tiddler.tags.indexOf("systemConfig") > -1;
		if(isPlugin) {
			action = "shared a plugin called";
		} else {
			action = "is writing about";
		}
		return {
			action: action,
			timestamp: tiddler.modified,
			friendly_date: prettyDate(tiddler.modified),
			modifier: tiddler.modifier,
			modifier_url: modifier_base,
			modifier_siteicon: modifier_base + "SiteIcon",
			tiddler_title: tiddler.title,
			tiddler_url: origin_base + encodeURIComponent(tiddler.title)
		};
	} else { // ignore things that are not associated with spaces
		return false;
	}
};

socket.on("tiddler", function(e) {
	var url = e;
	$.ajax({
		url: url,
		dataType: "json",
		success: function(tiddler) {
			var data = toMustacheData(tiddler);
			if(data) {
				var html = Mustache.to_html(itemtemplate, data);
				container.prepend(html);
				$("#realtime .date").each(function(i, el) {
					$(el).text(prettyDate($(el).attr("data-timestamp")));
				});
			}
		}
	})
});
}

$.ajax({
	url: "/status",
	dataType: "json",
	success: function(data) {
		init(data);
	}
});
