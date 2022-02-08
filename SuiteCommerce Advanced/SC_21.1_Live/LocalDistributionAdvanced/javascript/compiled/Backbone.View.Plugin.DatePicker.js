/*
    © 2020 NetSuite Inc.
    User may not copy, modify, distribute, or re-bundle or otherwise make available this code;
    provided, however, if you are an authorized user with a NetSuite account or log-in, you
    may use this code subject to the terms that govern your access and use.
*/
define("Backbone.View.Plugin.DatePicker", ["require", "exports", "underscore", "Backbone.View.DatePicker", "Backbone.View.render", "bootstrap-datepicker"], function (require, exports, _, Backbone_View_DatePicker_1, BackboneView) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    /*
    @module BackboneExtras
    #Backbone.View.Plugins
    Define the default plugins to execute by Backbone.View.render method. These plugins hook into the Backobne.view
    render() life cycle and modify the view's output somehow, for example removing marked nodes that current user
    has not permission to see, installing bootstrap widgets after a view is rendered, etc.
    */
    exports.BackboneViewPluginDatePicker = {
        mountToApp: function () {
            if (!_.result(SC, 'isPageGenerator')) {
                BackboneView.postRender.install({
                    name: 'datePicker',
                    priority: 10,
                    execute: Backbone_View_DatePicker_1.backboneViewDatePicker
                });
            }
        }
    };
});

//# sourceMappingURL=Backbone.View.Plugin.DatePicker.js.map
