clean:
	rm -rf src/mustache.js
	rm -rf src/jquery.js
	rm -rf src/reset.css
	rm -rf src/simpledate.js

remotes: clean
	curl -o src/simpledate.js \
		https://raw.github.com/gist/1010595/bd741574e760b170e5cb246ac5cac95bed33b0a3/simpledate.js
	curl -o src/reset.css \
		http://meyerweb.com/eric/tools/css/reset/reset.css
	curl -o src/jquery.js \
		http://code.jquery.com/jquery-1.7.1.min.js
	curl -o src/mustache.js \
		https://raw.github.com/janl/mustache.js/master/mustache.js
