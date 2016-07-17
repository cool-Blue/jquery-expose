/**
 * Created by Admin on 17/07/2016.
 */
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
