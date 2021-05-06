install:
	npm install

publish:
	npm publish --dry-run

lint: 
	npx eslint .

rss:
	node bin/rss.js

build:
	npm run build
