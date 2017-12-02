Sass task
===

## What does this do?

Compiles Sass files in `src/css/*.scss` into corresponding `public/css/*.css` file.

## What files are here

* `cli.js` — Entry point for package.json. Reads in the glob from `config.js` and hands off each path to `onEvent.js`. Also takes some command-line options to compress or write sourcemaps.
* `config.js` — Config settings including plugins.
* `onEvent.js` — Process a file path and render it from Sass to CSS. This file also handles unlink events.
* `watch.js` — Configuration for which files to watch and ignore. These files are loaded via config. Also reads in some options from config about compressing and sourcemaps.

## Usage

In package.json:

```
"build:css": "node build/tasks/sass/cli.js",
"build:css-dev": "npm run build:css -- -m true -c false", // To build with dev options
"dev:css": "node build/tasks/sass/watch.js"
```
