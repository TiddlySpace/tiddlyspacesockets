$.ajax = function(options) {
	var tiddler = {
		title: "disney music",
		modifier: "jon"
	};
	options.success(tiddler);
};
