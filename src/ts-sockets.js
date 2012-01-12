var PLUMBING = ["Footer", "Header", "AdvancedOptions", "ColorPalette", "DefaultTiddlers","EditTemplate",
"FollowTiddlersBlackList", "FollowTiddlersHeading", "FollowTiddlersTemplate", "FollowersTemplate", "FollowingTemplate", "GettingStarted", "ImportTiddlers", "MainMenu", "MarkupPostBody", "MarkupPostHead", "MarkupPreBody", "MarkupPreHead", "OptionsPanel", "PageTemplate", "PluginManager", "ScanTemplate", "SearchTemplate", "SideBarOptions", "SideBarTabs",
"SiteSubtitle", "SiteTitle", "SiteIcon",
"SiteUrl", "StyleSheet", "StyleSheetColors", "StyleSheetDiffFormatter", "StyleSheetFollowing", "StyleSheetImageMacro", 
"StyleSheetLayout", "StyleSheetLocale","StyleSheetPrint","StyleSheetSearch","StyleSheetTiddlySpaceBackstage",
"SystemSettings","TabAll","TabMore","TabMoreMissing","TabMoreOrphans","TabMoreShadowed",
"TabTags","TabTimeline","ToolbarCommands","ViewTemplate","WindowTitle"];

// override control view
$.ajaxSetup({
	beforeSend: function(xhr) {
		xhr.setRequestHeader("X-ControlView", "false");
	}
});

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

var el = $("#realtime")[0] || document.body;
function init(status) {
	var activity_queue = [];
	var socket = io.connect('http://tiddlyspace.com:8081');
	//var container = $("<ul />", {class: "activity-stream"}).appendTo(el);
	var container = $(".activity-stream");

	var getVerb = function(tiddler) {
		var isPlugin = tiddler.tags.indexOf("systemConfig") > -1;
		var isImage = tiddler.type && tiddler.type.indexOf("image/") === 0;
		var isCode = tiddler.type && tiddler.type === "text/javascript";
		var isBookmark = !!tiddler.fields.url;
		var isPlumbing = PLUMBING.indexOf(tiddler.title) > -1 || tiddler.title.match(/setupFlag$/)
		var ignoreType = tiddler.type &&
			(["text/html", "text/css"].indexOf(tiddler.type) > -1 || tiddler.type.indexOf("application/") === 0);
		if(isPlugin) {
			action = "shared a plugin called";
		} else if(isCode) {
			return "shared a javascript file called ";
		} else if(isImage) {
			return "shared an image ";
		} else if(isBookmark) {
			return "shared a link - ";
		} else if(isPlumbing || ignoreType) {
			return false;
		} else {
			return "is writing about";
		}
	};

	var toMustacheData = function(tiddler) {
		var modifier_base = getUrl(status, tiddler.modifier);
		var origin_space = tiddler.bag.split("_");
		if(origin_space.length > 1) {
			var origin_base = getUrl(status, origin_space[0]);
			var action = getVerb(tiddler);
			if(!action) {
				return false;
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

	socket.emit("subscribe", "*");
	socket.on("tiddler", function(data) {
		var url = data;
		activity_queue.push(url);
		updateUI();
	});

	var addTiddlerToUI = function(tiddler) {
		var transitionUI = function() {
			var jf = jQuery(".first"),
				jm = jQuery(".middle"),
				jl = jQuery(".last"),
				jn = jQuery(".next");
			
			jl.removeClass("last").addClass("past");
			jm.removeClass("middle").addClass("last");
			jf.removeClass("first").addClass("middle");
			jn.removeClass("next").addClass("first");
		}
		var data = toMustacheData(tiddler);
		if(data) {
			var html = Mustache.to_html(itemtemplate, data);
			container.prepend(html);
			$("#realtime .date").each(function(i, el) {
				$(el).text(prettyDate($(el).attr("data-timestamp")));
			});
			transitionUI();
		}
	};

	var updateUI = function() {
		if(activity_queue.length > 0) {
			// get value off queue
			var url = activity_queue.pop();
			// perform update
			$.ajax({
				url: url,
				dataType: "json",
				success: function(tiddler) {
					addTiddlerToUI(tiddler);
				}
			})
		}
	};

	$.ajax({
		dataType: "json",
		url: "/search?q=_limit:20;sort=modified",
		success: function(tiddlers) {
			for(var i = 0; i < tiddlers.length; i++) {
				addTiddlerToUI(tiddlers[i]);
			}
		}
	})

}

$.ajax({
	url: "/status",
	dataType: "json",
	success: function(data) {
		if(typeof(io) !== "undefined") {
			init(data);
		} else {
			$(el).text("Real-time tiddlers feed currently down for maintenance.")
		}
	}
});
