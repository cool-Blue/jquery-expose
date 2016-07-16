jquery-expose
=============

Create a modal backdrop over everything except specified exposed elements

## TL;DR

[Example](http://chingor13.github.io/jquery-expose/example.html)

## Motivation

Sometimes you want to highlight elements on a page.  There are many techniques out there will but a backdrop over the entire document and try to bring elements to the forefront via relative positioning and z-indexes.  This can fail for many display types (individual table rows, fixed position elements). Additionally, you have to ensure that the element will stand out in front of the backdrop (white background or something similar).

To get around this, instead of highlighting the element, we will obscure everything else on the page except the elements that we want to show through.

This algorithm is O(n^2), but for most applications n will be small and will only be run a few times at most on a page.

## Basic Usage

```
// in your javascript somewhere
$(".some_selector").expose();

// in your css somewhere
.expose-overlay {
  background:rgba(0,0,0,0.6);  // whatever you want
  z-index: 9999;				// whatever you want
}
```

Clicking anywhere on the overlay will remove it.
It's that easy!  The plugin will create absolutely positioned
## Hover Example
```js
$(".some_selector").hover(
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
```

## Options

There are 2 options available at this time:

* `padding` (numeric) - adding padding to all elements in your set
* `static` (boolean) - if set, don't hide the overlays when you click on one. you will have to remove the elements yourself.

Example:

```
$("a").expose({
  padding: 5,
  static: true
});
```

## Events

There are several events that are triggered at various stages of rendering:

* `expose:init` - nothing has been rendered yet
* `expose:shown` - rendering is complete
* `expose:overlay:shown` - fired for each backdrop element created
* `expose:overlay:removed` - fired after all backdrop elements have been removed

## Handling Browser Resize

Simple technique:

```
(function(){
  var currentOptions, currentSelector;

  // re-init exposed view when the window resizes
  $(window).resize(function() {
    if(currentSelector) {
      currentSelector.expose(currentOptions);
    }
  });

  $("body").bind("expose:init", function(evt, els, options){
    currentSelector = els;
    currentOptions = options;
  }).bind("expose:overlay:removed", function(evt) {
    currentSelector = null;
    currentOptions = null;
  });
});
```

The problem with this is that many browsers fire resize many times while you drag. To solve this, we can use [jquery-debounce](https://github.com/cowboy/jquery-throttle-debounce):

```
$(function(){
  var currentOptions, currentSelector;

  // re-init exposed view when the window resizes
  $(window).resize($.debounce(300, function() {
    if(currentSelector) {
      currentSelector.expose(currentOptions);
    }
  }));

  $("body").bind("expose:init", function(evt, els, options){
    currentSelector = els;
    currentOptions = options;
  }).bind("expose:overlay:removed", function(evt) {
    currentSelector = null;
    currentOptions = null;
  });

});
```
