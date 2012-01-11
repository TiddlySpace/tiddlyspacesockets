var socket = io.connect('http://localhost');
socket.on('news', function (data) {
	console.log(data);
	socket.emit('my other event', { my: 'data' });
});

var testitem = {
	action: "writing about",
	modifier: "jon",
	modifier_url: "http://jon.tiddlyspace.com",
	modifier_siteicon: "http://jon.tiddlyspace.com/SiteIcon",
	tiddler_title: "disney music",
	tiddler_url: "http://jon.tiddlyspace.com/DisneyMusic"
};

// activity item template
var itemtemplate = '<div class="activity-item">
	<a href="{{modifier_url}}">
		<img src="{{modifier_siteicon}}" />
	</a>
	<div>
		<p>
			<a href="{{modifier_url}}">{{modifier}}</a> is {{action}}
			<a class="tiddler-title" href="{{tiddler_url}}">{{tiddler_title}}</a>
		</p>
	</div>
</div>';