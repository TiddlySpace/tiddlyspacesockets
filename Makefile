clean:
	rm -rf src/mustache.js
	rm -rf src/jquery.js
	rm -rf src/reset.css

remotes: clean
	curl -o src/reset.css \
		http://meyerweb.com/eric/tools/css/reset/reset.css
	curl -o src/jquery.js \
		http://code.jquery.com/jquery-1.7.1.min.js
	curl -o src/mustache.js \
		https://raw.github.com/janl/mustache.js/master/mustache.js
