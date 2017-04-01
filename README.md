wsk example project
===========

> How to whisk a project

## Table of contents

* [Project commands](#project-commands)
  * [Main commands](#main-commands)
    * [dev](#editing-the-project)
    * [preflight](#publishing)
    * [view](#viewing)
  * [Internal / other commands](#internal--other-commands)
    * [build](#building-files)
    * [build-view](#building-and-viewing)
* [File structure](#file-structure)
  * [Editing HTML](#editing-html)
    * [Hyperlinks](#hyperlinks)
    * [ArchieML and templating](#archieml-and-templating)
  * [Editing CSS](#editing-css)
  * [Editing JavaScript](#editing-javascript)

## Project commands

All of the commands to develop, build and preview this project are accessible via [npm script commands](https://github.com/mhkeller/npm-things/blob/master/docs/2-run-commands.md). As shown below, run each of these with `npm run <command-name>`.

The commands listed below will be your go-tos but there others that are used mostly internally. For a full list of possible commands, look at the `scripts` section of [`package.json`](package.json).

* [Main commands](#main-commands)
  * [dev](#editing-the-project)
  * [preflight](#publishing)
  * [view](#viewing)
* [Internal / other commands](#internal--other-commands)
  * [build](#building-files)
  * [build-view](#building-and-viewing)

### Main commands

---

#### Editing the project

```shell
npm run dev
```

**What does it do?**: If you're editing a project it handles all the file building and browser live-reloading for you. So if you have it running while working on a project, it compiles your Stylus files (images, csvs, etc.) and refreshes your browser for you. It's like a big comfy chair that takes care of everything as long as it's running. 

1. It compiles your `src/` files into the `public/` folder.
  * Stylus and JavaScript files are packaged into their corresponding bundles
  * Static files such as csvs and images are simply copied over to their corresponding folders in `public/`
2. It launches a live-reload server at <http://localhost:8000>.
3. It watches your files in [`src/`](src) for changes and recompiles them when they do change.

**When do I use it?**: When you are editing this project and you want your changes to the JavaScript, HTML and Stylus files to automatically update in your browser. This is your go-to command for working on this project.

![npm run dev giffing!](files/readme-assets/npm-run-dev.gif)

---

#### Publishing with preflight checks

```shell
npm run preflight
```

**What does it do?**: This will run some sanity checks, mostly on your metatags, to make sure your project is ready to publish. It will prompt you to make sure things look good to go. 

The current information will appear between `()`. If this value looks good, hit <kbd>return</kbd>. If you want to correct something, you can start typing and then <kbd>return</kbd> to save it. You can also use the up-arrow key to prefill your default. That's handy if you need to make a minor edit. If you want to escape the whole thing: <kbd>control</kbd> <kbd>c</kbd>

If your project passes all the tests, it will then build your files with `npm run build-preview`.

**When do I use it?**: When you want to prep this project before deploying it live.

*To add custom preflight checks for your project, add them to the `questions` list in [`build/preflight.js`](build/preflight.js). See [inquirer](https://github.com/SBoudrias/Inquirer.js/) for info on the proper format for questions.*

![npm run preflight giffing!](files/readme-assets/npm-run-preflight.gif)

---

### Viewing

```shell
npm run view
```

**What does it do?**: This command creates an http server at <http://localhost:8000>. If you modify any files in `public`, it will live reload.

**When do I use it?**: If you want to view the project without modifying any files such as if you are presenting it or opening up someone else's project and want to test it locally. Or, if you ran `npm run build` and you want to make sure project looks okay to publish.

![npm run view giffing!](files/readme-assets/npm-run-view.gif)

## Internal / other commands

---

### Building files

```shell
npm run build
```

**What does it do?**: This command will compile your `src/` files into `public/` folder and minify your CSS and JS. Unlike `npm run dev`, this does not watch files for changes and does not create a server.

**When do I use it?**: You don't need to call this directly because `npm run prelight` will call it automatically. If you are 3,000 percent sure your project is good to publish and you want to bypass `npm run preflight`, you can run this command to bundle and minify your files so they are ready to be published.

![npm run build giffing!](files/readme-assets/npm-run-build.gif)

---

### Building and viewing

```shell
npm run build-view
```

**What does it do?**: It's a simple combination of `npm run build` and `npm run view`. After your project builds, you can preview it.

**When do I use it?**: This is used internally after your project passes its preflight checks. You could also use it whenever you would otherwise want to use `npm run build` since it launches a preview server as soon as your project is done building, which is handy to make sure everything looks good.

![npm run build-view giffing!](files/readme-assets/npm-run-build-view.gif)

---

## File structure

> What files do I edit where?

With the exception of `config.json`, you'll only want to be editing files in `src/`. Any edits you make to files in `public/` will be overwritten the next time the project builds.

A new project file tree looks like this:

```
my-project
├─ build (these are internal files, nothing to see here)
│  ├─ tasks
│  └─ other build files...
├─ src
│  ├─ data
│  ├─ img
│  ├─ css
│  │  ├─ modules/
│  │  ├─ thirdparty/
│  │  └─ styles.styl
│  ├─ js
│  │  ├─ modules/
│  │  ├─ thirdparty/
│  │  └─ main.js
│  └─ html
│     └─ index
│        ├─ body.partial.html
│        ├─ index.partial.html
│        └─ metatags.partial.html
├─ public
│  ├─ index.html
│  ├─ css
│  │  ├─ thirdparty/
│  │  └─ styles.css
│  ├─ data
│  ├─ img
│  └─ js
│     ├─ thirdparty/
│     └─ main.pkgd.js
├─ config.json
└─ package.json
```

---

#### Editing HTML

> tl;dr The main HTML file you want to edit is `src/html/body.partial.html`. The template values are stored in `config.json`.

Project HTML is stored in the `src/html/<html file name>/` folder as separate HTML partial files. 

When the build step runs, an HTML file is created in `public/` for every folder in `src/html/`. For example, the partial HTML files in `src/html/index/` will come to gether to create `public/html/index.html`. If we had `src/html/embed/`, that would create `public/html/embed.html`.

These are the starter files and what they do.

```
src
└─ html
   ├─ story-copy.aml
   └─ index
      ├─ body.partial.html (your project markup)
      ├─ index.partial.html (a file that orchestrates all the others)
      └─ metatags.partial.html (your project metatags, values come from config.json)
```

For every folder in `src/html`, a file with the same name gets compiled to `public/`, like so:

```
public
└─ index.html
```

You'll notice that in places like the page title, you have template brackets like so:

```html
<title><[- hed ]></title>
```

These HTML templates inherit their values from `config.json`. So if you want to change those values, change them in that json file.

##### Hyperlinks

To create hyperlinks,  use the following shorthand:

* `[The text to hyperlink](http://other-content.com)`

For example:

```md
This hyperlink [will be clickable](http://ice-cream-truth.com/uk).
```

How you style these links, though, is up to the individual project creator so that they can match the text style with its surrounding text.

##### ArchieML and templating

Each new project comes free with a `src/html/story-copy.aml` file. This is where you should store your story copy. The file format [is ArchieML](http://archieml.org).

The values in `src/html/story-copy.aml` are loaded into your project via `config.json`. Your default config has a field that looks like this:

```
"storyCopy": "<[= helpers.import('src/html/story-copy.aml') ]>"
```

With this line, your aml file is converted to JSON its values are now accessible in your html templates via the `storyCopy` variable like so:

```html
<[= storyCopy.my_paragraph ]>
```
How you structure your story copy is up to you, though. The default project comes with an array of strings like so:

```
[dek]

* pararaph number one
* paragraph number two

[]
```

You could access this array in your template like so:

```html
<[= storyCopy.dek.forEach(function (graf) { ]>
  <p><[= graf ]></p>
<[= }) ]>
```

##### Template helpers

Sometimes you might want to run your text through a formatting function. You get some of these for free in `build/template-helpers.js`. In fact, when you import data with `helpers.import`, your copy is run through the `prettyCopy` function. If you want to add your own function to this process, define it in that file and add it to the list of functions you see there inside of `prettyCopy`.

Or, if you define a function like this to get rid of the letter `e`:

```js
function banishAllEs (str) {
  return str.replace(/e/ig, '')
}
```

You could use it manually in your template under the `helpers` key like so:

```html
<[= helpers.banishAllEs(graf) ]>
```

---

#### Editing CSS

> tl;dr The main Stylus file to edit is `src/css/styles.styl`. If you like making smaller Stylus files, put them in `src/css/modules/` and use `@include 'path-to-module.styl'` syntax in `styles.styl`.
 If you want to include some Vanilla CSS files, put them in `src/css/thirdparty/` and add `<link>` tag to the bottom of `src/html/<html file name>/metatags.partial.html`.

These are the starter files and folders for editing CSS:

```
src
└─ css
   ├─ modules/ (add stylus modules here)
   ├─ thirdparty/ (add vanilla css files here, manually add them to your html)
   └─ styles.styl
```

It gets compiled to:

```
public
└─ css
   ├─ thirdparty/
   └─ styles.css
```

---

#### Editing JavaScript

> tl;dr The main JS file to edit is `src/js/main.js`. If you like making smaller JS files that can be browserified, put them in `src/js/modules/` and use `require('path-to-module.js')` syntax in your `main.js`. If you want to include some normal JS libraries, put them in `src/js/thirdparty/` and add `<script>` tag to the bottom of `src/html/<html file name>/body.partial.html` before the line that loads `main.pkgd.js`.

The main file you want to edit to add JavaScript is `src/js/main.js`. If you have any browserify modules, add them `src/js/modules/` and use `require('<module-name>')` syntax from within `main.js`. Install these modules with `npm install --save <module-name>`

If none of that makes sense about modules, fear not! You can add normal JavaScript libraries the same way you've always done by dropping them in the `src/js/thirdparty/` folder. You'll want to add the script tag in `src/html/<html file name>/body.partial.html` before the line that loads `main.pkgd.js`.

These are the starter files and folders for editing JavaScript:

```
src
└─ js
   ├─ modules/ (add browserify modules here and require them in your script)
   ├─ thirdparty/ (add normal js libs here, manually add them to your html)
   └─ main.js
```

They get compiled to:

```
public
└─ js
   ├─ thirdparty/
   └─ main.pkgd.js
```

