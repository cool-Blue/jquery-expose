jquery-expose with browserify
=============================

### Features
1.  jQuery included in the bundle
1.  plugin included in the bundle
1.  no pollution of the `window` object

### Config

In _./package.json_, add a `browser` node to create aliases for the resource locations.  This is purely for convenience, there is no need to actually shim anything because there is no communications between the module and the global space (script tags).  You need to include an empty config node to keep _browserify-shim_ happy.

```js
{
  "main": "app.cb.js",
  "scripts": {
    "build": "browserify ./app.cb.js > ./app.cb.bundle.js"
  },
  "browser": {
    "jquery": "./node_modules/jquery/dist/jquery.js",
    "expose": "./js/jquery.expose.js",
    "app": "./app.cb.js"
  },
  "browserify-shim": {
  },
  "browserify": {
    "transform": [
      "browserify-shim"
    ]
  },
  "author": "cool.blue",
  "license": "MIT",
  "dependencies": {
    "jquery": "^3.1.0"
  },
  "devDependencies": {
    "browserify": "^13.0.1",
    "browserify-shim": "^3.8.12"
  }
}
```

### Method
 * Because jQuery is CommonJS-aware these days, it will sense the presence of the `module` object provided by _browserify_ and return an instance, without adding it to the `window` object.
 * In the app, `require` jquery and add it to the `module.exports` object (along with any other context that needs to be shared).
 * Add a single line at the start of the plugin to require the app to access the jQuery instance it created.
 * In the app, copy the jQuery instance to `$` and use jQuery with the plugin.
 * Browserify the app, with default options, and drop the resulting bundle into a script tag in your HTML.
 
### Code
 app.cb
 ```js
module.exports.jQuery = require("jquery");
require('expose');

var $ = module.exports.jQuery;

$(document).ready(function() {

    $('body').append(
        $('<button name="button" >Click me</button>')
            .css({"position": "relative",
                  "top": "100px", "left": "100px"})
            .click(function() {
                $(this).expose();
            })
    );
});
```
at the top of the plugin
```js
var jQuery = require("app").jQuery;
```
in the HTML
```html
    <script type="text/javascript" src="app.cb.bundle.js"></script>
```
### Background
The pattern used by jQuery is to call it's factory with a `noGlobal` flag if it senses a CommonJS environment.
```js
( function( global, factory ) {

	"use strict";

	if ( typeof module === "object" && typeof module.exports === "object" ) {
		module.exports = factory( global, true ) :
	} else {
		factory( global );
	}

// Pass this if window is not defined yet
} )( typeof window !== "undefined" ? window : this, function( window, noGlobal ) {

// ...

if ( !noGlobal ) {
	window.jQuery = window.$ = jQuery;
}

return jQuery;
}) );
```