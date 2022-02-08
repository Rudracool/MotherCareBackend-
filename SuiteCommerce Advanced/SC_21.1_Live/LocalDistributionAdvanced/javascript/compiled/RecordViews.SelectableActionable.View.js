/*
    © 2020 NetSuite Inc.
    User may not copy, modify, distribute, or re-bundle or otherwise make available this code;
    provided, however, if you are an authorized user with a NetSuite account or log-in, you
    may use this code subject to the terms that govern your access and use.
*/
define("RecordViews.SelectableActionable.View", ["require", "exports", "underscore", "recordviews_selectable_actionable.tpl", "RecordViews.View"], function (require, exports, _, recordviews_selectable_actionable_tpl, RecordViews_View_1) {
    "use strict";
    // @class RecordViews.SelectableActionable.View @extend RecordViews.View
    var RecordViewsSelectableActionableView = RecordViews_View_1.RecordViewsView.extend({
        // @property {Function} template
        template: recordviews_selectable_actionable_tpl,
        // @method initialize
        // @param {RecordViews.SelectableActionable.View.Initialize} options
        // @return {Void}
        initialize: function () {
            RecordViews_View_1.RecordViewsView.prototype.initialize.apply(this, arguments);
        },
        // @property {Object} childViews Override the base property by adding a default Action.View composite View
        childViews: {
            'Action.View': function () {
                var action_options = _.extend({
                    model: this.model
                }, this.options.actionOptions || {});
                var view = this.options.actionView;
                return new view(action_options);
            }
        },
        // @method getContext @return {RecordViews.SelectableActionable.View.Context}
        getContext: function () {
            // @class RecordViews.SelectableActionable.View.Context
            return {
                // @property {RecordViews.SelectableActionable.View.Initialize.Model} model
                model: this.model,
                // @property {String} id
                id: this.model.id,
                // @property {Boolean} isChecked
                isChecked: !!this.model.get('check'),
                // @property {Boolean} isActive
                isActive: !!this.model.get('active'),
                // @property {Boolean} isChecked
                checkboxIsHidden: _.isUndefined(this.options.checkboxIsHidden)
                    ? false
                    : !!this.options.checkboxIsHidden,
                // @property {String} actionType
                actionType: this.model.get('actionType') || '',
                // @property {Boolean} isNavigable
                isNavigable: !!(this.options.navigable || this.model.get('navigable')),
                // @property {String} url
                url: this.model.get('url'),
                // @property {String} title
                title: this.model.get('title'),
                // @property {Array<RecordViews.View.Column>} columns
                columns: this.normalizeColumns()
            };
        }
    });
    return RecordViewsSelectableActionableView;
});
// @class RecordViews.SelectableActionable.View.Initialize
// @property {RecordViews.SelectableActionable.View.Initialize.Model} model
// @property {Object} actionOptions
// @property {Backbone.View} actionView
// @property {Boolean} navigable This value will takes precedence over the value of the model
// @class RecordViews.SelectableActionable.View.Initialize.Model @extends Backbone.Model
// @property {String} id
// @property {Boolean} isChecked
// @property {Boolean} active
// @property {String?} actionType Default value is ''
// @property {String} title
// @property {String} url
// @property {Boolean} navigable
// @property {Array<RecordViews.View.Column>} columns

//# sourceMappingURL=RecordViews.SelectableActionable.View.js.map
