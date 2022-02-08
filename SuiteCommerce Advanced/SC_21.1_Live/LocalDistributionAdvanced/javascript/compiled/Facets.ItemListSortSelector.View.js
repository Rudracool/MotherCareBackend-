/*
    © 2020 NetSuite Inc.
    User may not copy, modify, distribute, or re-bundle or otherwise make available this code;
    provided, however, if you are an authorized user with a NetSuite account or log-in, you
    may use this code subject to the terms that govern your access and use.
*/
define("Facets.ItemListSortSelector.View", ["require", "exports", "underscore", "Utils", "facets_item_list_sort_selector.tpl", "Profile.Model", "Backbone.View"], function (require, exports, _, Utils, facets_item_list_sort_selector_tpl, Profile_Model_1, BackboneView) {
    "use strict";
    return BackboneView.extend({
        // @property {function} template
        template: facets_item_list_sort_selector_tpl,
        // @method getContext @returns {Facets.ItemListSortSelector.View.Context}
        getContext: function () {
            var option_items = this.options.options;
            var translator = this.options.translator;
            var processed_option_items = [];
            // if price display is disabled, left aside the filters about price
            if (Profile_Model_1.ProfileModel.getInstance().hidePrices()) {
                option_items = _.filter(option_items, function (item) {
                    return item.id.search('price') === -1;
                });
            }
            _.each(option_items, function (option_item) {
                var processed_option_item = {
                    configOptionUrl: translator
                        .cloneForOptions({ order: option_item.id, page: 1 })
                        .getUrl(),
                    isSelected: translator.getOptionValue('order') === option_item.id ? 'selected' : '',
                    name: Utils.translate(option_item.name, option_item.items),
                    className: option_item.id.replace(':', '-')
                };
                processed_option_items.push(processed_option_item);
            });
            // @class Facets.ItemListSortSelector.View.Context
            return {
                // @property {Array<Object>} options
                options: processed_option_items
            };
        }
    });
});

//# sourceMappingURL=Facets.ItemListSortSelector.View.js.map
