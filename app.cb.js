/**
 * Created by Admin on 17/07/2016.
 */
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
