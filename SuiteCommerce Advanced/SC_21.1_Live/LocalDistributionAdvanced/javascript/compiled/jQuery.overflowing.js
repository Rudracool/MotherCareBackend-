/*
    © 2020 NetSuite Inc.
    User may not copy, modify, distribute, or re-bundle or otherwise make available this code;
    provided, however, if you are an authorized user with a NetSuite account or log-in, you
    may use this code subject to the terms that govern your access and use.
*/
define("jQuery.overflowing", ["require", "exports", "jQuery"], function (require, exports, jQuery) {
    "use strict";
    jQuery.fn.overflowing = function (options, callback) {
        var self = this;
        var overflowed = [];
        var hasCallback = !!(callback && typeof callback === 'function');
        var status = false;
        this.options = options || window;
        this.each(function () {
            var $this = jQuery(this);
            var elPosition = $this.position();
            var elWidth = $this.width();
            var elHeight = $this.height();
            var parents = $this.parentsUntil(self.options);
            var $parentsTo = jQuery(self.options);
            parents.push($parentsTo);
            for (var i = 0; i < parents.length; i++) {
                var parentPosition = jQuery(parents[i]).position();
                var parentWidth = jQuery(parents[i]).width();
                var parentHeight = jQuery(parents[i]).height();
                if (elPosition.top < 0 ||
                    elPosition.left < 0 ||
                    elPosition.top > parentHeight + parentPosition.top ||
                    elPosition.left > parentWidth + parentPosition.left ||
                    elPosition.top + elHeight > parentHeight + parentPosition.top ||
                    elPosition.left + elWidth > parentWidth + parentPosition.left) {
                    status = true;
                    jQuery(parents[i]).addClass('overflowed');
                    overflowed.push(parents[i]);
                    if (hasCallback) {
                        callback(parents[i]);
                    }
                }
            }
            if ($this.parents(self.options).hasClass('overflowed')) {
                $this.addClass('overflowing');
            }
        });
        if (!hasCallback) {
            return overflowed.length > 1 ? overflowed : status;
        }
    };
    var jQueryOverflowingModule = jQuery.fn.overflowing;
    return jQueryOverflowingModule;
});

//# sourceMappingURL=jQuery.overflowing.js.map
