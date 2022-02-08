/*
    © 2020 NetSuite Inc.
    User may not copy, modify, distribute, or re-bundle or otherwise make available this code;
    provided, however, if you are an authorized user with a NetSuite account or log-in, you
    may use this code subject to the terms that govern your access and use.
*/
define("ProductDetails.Information.View", ["require", "exports", "underscore", "product_details_information.tpl", "Configuration", "Backbone", "Backbone.View", "jQuery"], function (require, exports, _, product_details_information_tpl, Configuration_1, Backbone, BackboneView, $) {
    "use strict";
    // @class ProductDetails.Information.View @extends Backbone.View
    var ProductDetailsInformationView = BackboneView.extend({
        template: product_details_information_tpl,
        events: {
            'click [data-action="show-more"]': 'showMore'
        },
        // @method initialize Override default method to allow passing pre-calculated details
        // @param {ProductDetails.Information.View.InitializationOptions} options
        // @return {Void}
        initialize: function initialize() {
            BackboneView.prototype.initialize.apply(this, arguments);
            this.details = this.options.details;
            Backbone.on('resizeView', function (event) {
                $('[data-action="sc-pusher-dismiss"]').click();
                return true;
            });
        },
        render: function () {
            this.details = this.details || this.computeDetailsArea();
            this._render();
        },
        destroy: function () {
            this._destroy();
            this.off('resizeView');
        },
        // @method computeDetailsArea
        // Process what you have configured in itemDetails as item details.
        // In the PDP extra information can be shown based on the itemDetails property in the Shopping.Configuration.
        // These are extra field extracted from the item model
        // @return {Array<ProductDetails.Information.DataContainer>}
        computeDetailsArea: function () {
            var self = this;
            var details = [];
            _.each(Configuration_1.Configuration.get('productDetailsInformation', []), function (item_information) {
                var content = '';
                if (item_information.contentFromKey) {
                    content = self.model.get('item').get(item_information.contentFromKey);
                }
                if (content && $.trim(content)) {
                    // @class ProductDetails.Information.DataContainer
                    details.push({
                        // @property {String} name
                        name: item_information.name,
                        // @property {String} content Any string and event valid HTML is allowed
                        content: content,
                        // @property {String} itemprop
                        itemprop: item_information.itemprop
                    });
                    // @class ProductDetails.Information.View
                }
            });
            return details;
        },
        // @method showMore Toggle the content of an options, and change the label Show Less and Show More by adding a class
        // @return {Void}
        showMore: function () {
            this.$('[data-type="information-content"]').toggleClass('show');
        },
        getContext: function () {
            return {
                // @property {Boolean} showInformation
                showInformation: this.details.length > 0,
                // @property {Boolean} showHeader
                showHeader: this.details.length < 2,
                // @property {Array<ProductDetails.Information.DataContainer>} details
                details: this.details,
                // @property {Boolean} isNotPageGenerator
                isNotPageGenerator: !SC.isPageGenerator()
            };
        }
    });
    return ProductDetailsInformationView;
});
// @class ProductDetails.Information.View.InitializationOptions
// @property {Array<ProductDetails.Information.DataContainer>?} details
// @property {Product.Model} model
//

//# sourceMappingURL=ProductDetails.Information.View.js.map
