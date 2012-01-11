// activity item template
var itemtemplate = ['<li class="activity-item next">',
	'<a href="{{modifier_url}}">',
		'<img src="{{modifier_siteicon}}" />',
	'</a>',
	'<div>',
		'<p>',
			'<a href="{{modifier_url}}">{{modifier}}</a> {{action}} ',
			'<a class="tiddler-title" href="{{tiddler_url}}">{{tiddler_title}}</a>',
		'</p>',
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

function init(status) {
var activity_queue = [];
var socket = io.connect('http://tiddlyspace.com:8081');
var el = $("#realtime")[0] || document.body;
//var container = $("<ul />", {class: "activity-stream"}).appendTo(el);
var container = $(".activity-stream");

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

socket.on("tiddler", function(data) {
	console.dir(data);
	var url = data;
	activity_queue.push(url);
	updateUI();
});

var updateUI = function() {
	console.log("updateUI");
	if(activity_queue.length > 0) {
		console.log("queue > than 0");
		var transitionUI = function() {
			var jf = jQuery(".first"),
				jm = jQuery(".middle"),
				jl = jQuery(".last"),
				jn = jQuery(".next");

			jn.removeClass("next").addClass("first");
			jf.removeClass("first").addClass("middle");
			jm.removeClass("middle").addClass("last");
			jl.removeClass("last").addClass("past");
		}
		transitionUI();
	
		// get value off queue
		var url = activity_queue.pop();
		// perform update
		$.ajax({
			url: url,
			dataType: "json",
			success: function(tiddler) {
				var data = toMustacheData(tiddler);
				if(data) {
					var html = Mustache.to_html(itemtemplate, data);
					container.prepend(html);
				}
			}
		})
	}
};
}

$.ajax({
	url: "/status",
	dataType: "json",
	success: function(data) {
		init(data);
	}
});
