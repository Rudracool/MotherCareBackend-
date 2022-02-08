/*
    © 2020 NetSuite Inc.
    User may not copy, modify, distribute, or re-bundle or otherwise make available this code;
    provided, however, if you are an authorized user with a NetSuite account or log-in, you
    may use this code subject to the terms that govern your access and use.
*/
define("Transaction.Line.Views", ["require", "exports", "underscore", "transaction_line_views_selected_option.tpl", "transaction_line_views_selected_option_color.tpl", "Utils", "Configuration"], function (require, exports, _, transaction_line_views_selected_option_tpl, transaction_line_views_selected_option_color_tpl, Utils, Configuration_1) {
    "use strict";
    var TransactionLineViews = {
        // @method mountToApp Initialize the item options configuration related with transaction lines
        // @return {Void}
        mountToApp: function () {
            var transaction_line_view_options_selected = {
                'transaction_line_views_selected_option.tpl': transaction_line_views_selected_option_tpl,
                'transaction_line_views_selected_option_color.tpl': transaction_line_views_selected_option_color_tpl
            };
            var item_options = Configuration_1.Configuration.get('ItemOptions.optionsConfiguration', []);
            var configuration_default_selected_templates = Configuration_1.Configuration.get('ItemOptions.defaultTemplates.selectedByType', []);
            var default_selected_templates = {};
            var default_template_selected = false;
            _.each(item_options, function (item_option) {
                if (item_option.templateSelected &&
                    transaction_line_view_options_selected[item_option.templateSelected]) {
                    item_option.templates = item_option.templates || {};
                    item_option.templates.selected =
                        transaction_line_view_options_selected[item_option.templateSelected];
                }
            });
            _.each(configuration_default_selected_templates, function (default_selected_template) {
                if (transaction_line_view_options_selected[default_selected_template.template]) {
                    default_selected_templates[default_selected_template.type] =
                        transaction_line_view_options_selected[default_selected_template.template];
                    default_template_selected = true;
                }
            });
            if (default_template_selected) {
                Utils.setPathFromObject(Configuration_1.Configuration, 'ItemOptions.defaultTemplates.selectedByType', default_selected_templates);
            }
        }
    };
    return TransactionLineViews;
});

//# sourceMappingURL=Transaction.Line.Views.js.map
