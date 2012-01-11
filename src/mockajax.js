$.ajax = function(options) {
	if(options.url === "/status") {
		return options.success({
			server_host: {
				host: "tiddlyspace.com",
				scheme: "http",
				port: "80"
			}
		});
	} else {
		var tiddlers = [{
			title: "disney music",
			bag: "disney_public",
			modifier: "jon"
		},
		{
			title: "meatloaf",
			bag: "ben_public",
			modifier: "bengillies"
		},
		{
			title: "How to lose a laptop in 3 simple steps",
			bag: "colm_public",
			modifier: "colmbritton"
		},
		{
			title: "Plugin",
			bag: "tiddlyspace",
			modifier: "core",
			tags: ["systemConfig"]
		}
		];
		options.success(tiddlers[parseInt(Math.random() * tiddlers.length, 10)]);
	}
};
