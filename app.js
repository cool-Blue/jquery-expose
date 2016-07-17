/**
 * Created by Admin on 17/07/2016.
 */
// copy and delete any previously defined jQuery objects
console.log("starting "+ window.jQuery + " " + window.$);
if (window.jQuery) {
    console.log("jQuery exists "+ window.jQuery + " " + window.$);
    window.original_jQuery = window.jQuery;
    delete window.jQuery;

    if (typeof window.$.fn.jquery === 'string') {
        window.original_$ = window.$;
        delete window.$;
    }
}

// exposes the jQuery global
require('./js/jquery.expose.js');
// copy it to another variable of my choosing and delete the global one
console.log("required "+ window.jQuery + " " + window.$);

var my_jQuery = jQuery;
delete window.jQuery;
delete window.$;
console.log("deleted "+ window.jQuery + " " + window.$);

// re-setting the original jQuery object (if any)
if (window.original_jQuery) { window.jQuery = window.original_jQuery; delete window.original_jQuery; }
if (window.original_$) { window.$ = window.original_$; delete window.original_$; }

my_jQuery(document).ready(function() {
    my_jQuery('button')
        .offset({top: 100, left: 100})
        .click(function() {
            my_jQuery(this).expose();
        });
});
console.log("ending "+ window.jQuery + " " + window.$);
