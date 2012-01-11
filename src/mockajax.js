$.ajax = function(options) {
	var testitem = {
		action: "writing about",
		modifier: "jon",
		modifier_url: "http://jon.tiddlyspace.com",
		modifier_siteicon: "http://jon.tiddlyspace.com/SiteIcon",
		tiddler_title: "disney music",
		tiddler_url: "http://jon.tiddlyspace.com/DisneyMusic"
	};
	options.success(testitem);
};
