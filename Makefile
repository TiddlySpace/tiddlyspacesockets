clean:
	rm -rf src/mustache.js

remotes: clean
	curl -o src/mustache.js \
		https://raw.github.com/janl/mustache.js/master/mustache.js
