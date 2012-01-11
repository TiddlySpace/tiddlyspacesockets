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
			modifier: "jon",
			tags: []
		},
		{
			title: "meatloaf",
			bag: "ben_public",
			modifier: "bengillies",
			tags: []
		},
		{
			title: "How to lose a laptop in 3 simple steps",
			bag: "colm_public",
			modifier: "colmbritton",
			tags: []
		},
		{
			title: "Plugin",
			bag: "tiddlyspace",
			modifier: "core",
			tags: ["systemConfig"]
		},
		{
			title: "PMario's Plugin",
			bag: "pmario_plugins",
			modifier: "pmario",
			tags: ["systemConfig"]
		}
		];
		var now = new Date();
		var hrs = now.getHours();
		hrs = hrs < 10 ? "0" + String(hrs) : hrs;
		var mins = now.getMinutes();
		mins = mins < 10 ? "0" + String(mins) : mins; 

		var tiddler = tiddlers[parseInt(Math.random() * tiddlers.length, 10)];
		tiddler.modified = "20120111" + hrs + mins + "00";
		options.success(tiddler);
	}
};
