clean:
	rm -rf src/mustache.js
	rm -rf src/jquery.js

remotes: clean
	curl -o src/jquery.js \
		http://code.jquery.com/jquery-1.7.1.min.js
	curl -o src/mustache.js \
		https://raw.github.com/janl/mustache.js/master/mustache.js
