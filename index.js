/**
 * index.js
 * Created by cool.blue on 15/07/2016.
 */
const docPath = 'index.html';
var _jquery = require("jquery");

module.exports.window = require("./shimwindow/shimWindow")(_jquery, function($, w){
    _jquery = $;
    module.exports.jQuery = module.exports.$ = _jquery;
    module.exports.window = w = w || window;
    require("./js/jquery.expose.js");
    // require("./js/bsfyExpose.js");
    main(_jquery, w)
}, docPath, `trans_${docPath}`);

function main($, window){
    require("./src/generateHTML.js");

    $(".test-div").hover(
        function over(evt) {
            $(this).expose();
            evt.preventDefault();
            console.log("hover")
        },
        function out (evt) {
            $(window.document).trigger("expose:hide");
            evt.preventDefault();
        });
    $("body")
        // manage the class of the exposed element to provide styling opportunity
        .on("expose:init", function(e, params){
            $(params[0]).addClass("exposed")
        })
        .on("expose:overlay:removed", function() {
            $(".exposed").removeClass("exposed");
        })
        // clean up if an element is stuck in exposed state
        .on("expose:overlay:shown", function(e, x0, y0, x1, y1, overlay) {
            overlay.mousemove(function(){
                console.log("overlay mousemove");
                $(window.document).trigger("expose:hide");
            });
        });
/*
    $(".test-div").click(
        function over(evt) {
            $(this).expose();
            evt.preventDefault();
            console.log("hover")
        });
*/
    testOutput($);
}

function testOutput($){
    var $output = $("#output");
    $output.append("First\n")
        .append("Second\n")
        .append("app.js")
}