/**
 * Created by Admin on 16/07/2016.
 */
(function() {
    const globals = require("../index");
    const $ = globals.$;

    const divCount = 100;
    var i, t, l,
        $body = $("body"),
        w     = globals.window.innerWidth,
        h     = globals.window.innerHeight,
        div   = "<div class='test-div'>Test div</div>";

    for(i = 0; i < divCount; i++) {
        var $div = $(div)
            .width(200)
            .height(100)
            .offset({
                top: (t = (i ? Math.random() : 0) * (h - 100)),
                left: (l = (i ? Math.random() : 0) * (w - 200))
            })
            .append(` ${i}`);
        $body.append($div);
        console.log(`top: ${t} \t ${$div.offset().top} \t left: ${l} \t ${$div.offset().left}`)
    }
}());