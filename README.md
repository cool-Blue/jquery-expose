jquery-expose with browserify
=============================

### Features
1.  _jQuery_ included in the bundle
1.  plugin included in the bundle
1.  no pollution of the `window` object
1.  use _jsdom_ to shim the the window object to make it isomorphic

### Config

In _./package.json_, add a `browser` node to create aliases for the resource locations.  This is purely for convenience, there is no need to actually shim anything because there is no communications between the module and the global space (script tags).

```js
{
  "main": "app.cb.js",
  "scripts": {
    "build": "browserify ./app.cb.js -u jsdom | js-beautify > ./app.cb.bundle.js"
  },
  "browser": {
    "jquery": "./node_modules/jquery/dist/jquery.js",
    "shimWindow": "./node_modules/shimwindow/shimWindow.js"
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
 * Add three lines at the start of the plugin to environment created in the app.
 * In the app, shim a window object if necessary, copy the jQuery instance to `$` and use jQuery with the plugin.
 * _browserify_ the app, with _jsdom_ excluded (since it's not needed in the browser bundle), and drop the resulting bundle into a script tag in your HTML.
 
### Code
 app.cb
 ```js
const docPath = 'index.html';
var $ = require("jquery");

module.exports.window = require("shimWindow")($,
    function(ns){
        return typeof ns === 'function' && ns["fn"]
    },
    function($, w) {
    module.exports.jQuery = module.exports.$ = $;
    module.exports.window = w = w || window;
    require("./js/jquery.expose.js");
    main($, w)
}, docPath, `trans_${docPath}`);

function main ($, window){
    $(window.document).ready(function() {

        $('body').append(
            $('<button name="button" >Click me</button>')
                .css({
                    "position": "relative",
                    "top": "100px", "left": "100px"
                })
                .click(function() {
                    $(this).expose();
                })
        );
    })
}
```
at the top of the plugin
```js
var globals = require("./../app.cb.js"),
    jQuery = globals.jQuery,
    document = globals.window.document;
```
in the HTML
```html
    <script type="text/javascript" src="app.cb.bundle.js"></script>
```
### shimWindow
In order to make the code isomorphic, use _jsdom_ to provide a dummy environment. 
```js
module.exports = function(_ns, test, main, docPath, outDocPath) {
    var t;
    if(test(_ns)) {
        /**
         * Check if this is the namespace, otherwise fall back on
         * window.ns
         *
         * run the app
         */
        _ns = Object.keys(_ns).length ? _ns : ns;
        main(_ns);
    } else if(typeof _ns === 'function') {
        /**
         * if a function is returned, assume it is asking for a window object
         * assume that the callback returns the window object decorated with the exported
         * namespace.
         * This is the behaviour in node, this code is dead in the browser and simple-jsdom
         * needs to be --ignore 'ed, --exclude 'ed
         *
         * run the app
         **/

        docPath = docPath || 'index.html';

        var fs    = require("fs"),
            jsdom = require('jsdom'),
            doc   = fs.readFileSync(docPath, 'utf8');

        jsdom.env(
            doc,
            function(err, window) {
                main(_ns(window), window);
                console.log(`HTML: \n ${window.document.documentElement.outerHTML}`);
                if(outDocPath)
                    fs.writeFile(outDocPath, window.document.documentElement.outerHTML);
                console.log(`\noutput: \n ${window.document.getElementById("output").textContent}`);
            }
        )
    }
};
```