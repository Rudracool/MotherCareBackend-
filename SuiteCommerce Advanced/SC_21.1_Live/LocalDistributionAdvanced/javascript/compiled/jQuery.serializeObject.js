/*
    © 2020 NetSuite Inc.
    User may not copy, modify, distribute, or re-bundle or otherwise make available this code;
    provided, however, if you are an authorized user with a NetSuite account or log-in, you
    may use this code subject to the terms that govern your access and use.
*/
define("jQuery.serializeObject", ["require", "exports", "jQuery"], function (require, exports, jQuery) {
    "use strict";
    jQuery.fn.serializeObject = function () {
        var o = {};
        // http://api.jquery.com/serializeArray/
        var a = this.serializeArray();
        // When a checkbox is not checked, we need to send the "unchecked value"
        // that value is held as a data attribute: "data-unchecked-value"
        this.find('input[type=checkbox]:not(:checked)[data-unchecked-value]').each(function () {
            var $this = jQuery(this);
            a.push({
                name: $this.prop('name'),
                value: $this.data('unchecked-value')
            });
        });
        // Then we just loop through the array to create the object
        jQuery.each(a, function () {
            if (o[this.name] !== undefined) {
                if (!o[this.name].push) {
                    o[this.name] = [o[this.name]];
                }
                o[this.name].push(this.value || '');
            }
            else {
                o[this.name] = this.value || '';
            }
        });
        return o;
    };
    var jQuerySerializeObjectModule = jQuery.fn.serializeObject;
    return jQuerySerializeObjectModule;
});

//# sourceMappingURL=jQuery.serializeObject.js.map
