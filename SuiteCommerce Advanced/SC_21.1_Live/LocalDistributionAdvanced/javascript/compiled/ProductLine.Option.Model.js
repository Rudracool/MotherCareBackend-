/*
    © 2020 NetSuite Inc.
    User may not copy, modify, distribute, or re-bundle or otherwise make available this code;
    provided, however, if you are an authorized user with a NetSuite account or log-in, you
    may use this code subject to the terms that govern your access and use.
*/
define("ProductLine.Option.Model", ["require", "exports", "Backbone.Model"], function (require, exports, BackboneModel) {
    "use strict";
    return BackboneModel.extend({
        // @method toJSON Override default method to send just the require data to the back-end
        // @return {ProductLine.Option.Model.JSON}
        toJSON: function toJSON() {
            // @class ProductLine.Option.Model.JSON
            return {
                // @property {String} cartOptionId
                cartOptionId: this.get('cartOptionId'),
                // @property {String} itemOptionId
                itemOptionId: this.get('itemOptionId'),
                // @property {String} label
                label: this.get('label'),
                // @property {String} type
                type: this.get('type'),
                // @property {ProductLine.Option.Value?} value
                value: this.get('value')
            };
            // @class ProductLine.Option.Model
        }
    });
});
// @class ProductLine.Option.Value
// @property {String} internalid
// @property {String} value

//# sourceMappingURL=ProductLine.Option.Model.js.map
