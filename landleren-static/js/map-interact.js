// ------ wwww.landleren.be ------ //
// part of the GeoSelector program //

// this file controls the map and all actions related to it
jQuery(function() { jQuery("path[id^=eujs]").each(function(i, e) { tryaddEvent(jQuery(e).attr("id")) }) });

// function to track the mouse and make the map interactive
function tryaddEvent(id, relationId) {
    var _obj = jQuery("#" + id);
    var arr = id.split("");
    var _Textobj = jQuery("#" + id + "," + "#eujsvn" + arr.slice(5).join(""));

    // retrieves the shown initials of the countries - no longer used but it might be useful someday
    jQuery("#" + ["visnames"]).attr({ "fill": eujsconfig.general.visibleNames });

    //sets the border color of the countries
    _obj.attr({ "fill": eujsconfig[id].upColor, "stroke": eujsconfig.general.borderColor });
    _Textobj.attr({ "cursor": "default" });

    // if the country is active, make it interactive otherwise leave it as is
    if (eujsconfig[id].active === !0) {
        _Textobj.attr({ "cursor": "pointer" });
        _Textobj.hover(function() {

                // shows the country name in the tooltip span when hovering over the country - disabled atm, but useful for debugging
                // jQuery("#eujstip").show().html(eujsconfig[id].hover);

                // changes the color of the country when hovering over it
                _obj.css({ "fill": eujsconfig[id].overColor })

            },

            // changes the color of the country back to the original color when not hovering over it anymore
            function() {
                jQuery("#eujstip").hide();
                jQuery("#" + id).css({ "fill": eujsconfig[id].upColor })
            });

        // changes the color of the country when clicked on it
        if (eujsconfig[id].target !== "none") {
            _Textobj.mousedown(function() {
                jQuery("#" + id).css({ "fill": eujsconfig[id].downColor })
            })
        }

        // used to open the link, but we don't want that anymore
        // _Textobj.mouseup(function() { jQuery("#" + id).css({ "fill": eujsconfig[id].overColor }); if (eujsconfig[id].target === "new_window") { window.open(eujsconfig[id].url) } else if (eujsconfig[id].target === "same_window") { window.parent.location.href = eujsconfig[id].url } else if (eujsconfig[id].target === "modal") { jQuery(eujsconfig[id].url).modal("show") } }); // used to open the link, but we don't want that anymore

        // change color when unclicked and send the answer to the quiz-app script
        _Textobj.mouseup(function() {
            jQuery("#" + id).css({
                "fill": eujsconfig[id].overColor
            });
            getResult(eujsconfig[id].hover)
        });
    }
}