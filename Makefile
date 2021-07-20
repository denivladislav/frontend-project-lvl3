install:
	npm ci

publish:
	npm publish --dry-run

lint:
	npx eslint .

build:
	npm run build

develop:
	npx webpack serve