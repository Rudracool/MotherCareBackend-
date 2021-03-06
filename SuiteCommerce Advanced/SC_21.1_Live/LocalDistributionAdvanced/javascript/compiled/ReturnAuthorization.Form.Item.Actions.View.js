/*
    © 2020 NetSuite Inc.
    User may not copy, modify, distribute, or re-bundle or otherwise make available this code;
    provided, however, if you are an authorized user with a NetSuite account or log-in, you
    may use this code subject to the terms that govern your access and use.
*/
define("ReturnAuthorization.Form.Item.Actions.View", ["require", "exports", "underscore", "return_authorization_form_item_actions.tpl", "Configuration", "Backbone.View"], function (require, exports, _, return_authorization_form_item_actions_tpl, Configuration_1, BackboneView) {
    "use strict";
    // @class ReturnAuthorization.Form.Item.Actions.View @extend Backbone.View
    var ReturnAuthorizationFormItemActionsView = BackboneView.extend({
        template: return_authorization_form_item_actions_tpl,
        initialize: function () {
            this.reasons = _.sortBy(Configuration_1.Configuration.get('returnAuthorization.reasons', []), function (reason) {
                return reason.order;
            });
        },
        // @method getContext @return ReturnAuthorization.Form.Item.Actions.View.Context
        getContext: function () {
            var current_reason = this.model.get('reason') || {};
            this.reasons = _.each(this.reasons, function (reason) {
                reason.isSelected = reason.id === current_reason.id;
            });
            // @class ReturnAuthorization.Form.Item.Actions.View.Context
            return {
                // @property {Model} line
                line: this.model,
                // @property {Boolean} isLineActive
                isLineActive: this.model.get('checked'),
                // @property {Boolean} showReasons
                showReasons: !!this.reasons.length,
                // @property {Boolean} isOtherReasonSelected
                isOtherReasonSelected: !!current_reason.isOther,
                // @property {Array<{isSelected:Boolean,reasonText:String}>} reasons
                reasons: this.reasons,
                // @property {String} textReason
                textReason: this.model.get('textReason'),
                // @property {Boolean} activeLinesLengthGreaterThan1
                activeLinesLengthGreaterThan1: this.options.activeLinesLength > 1
            };
        }
    });
    return ReturnAuthorizationFormItemActionsView;
});

//# sourceMappingURL=ReturnAuthorization.Form.Item.Actions.View.js.map
