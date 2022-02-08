/*
	© 2020 NetSuite Inc.
	User may not copy, modify, distribute, or re-bundle or otherwise make available this code;
	provided, however, if you are an authorized user with a NetSuite account or log-in, you
	may use this code subject to the terms that govern your access and use.
*/

/// <amd-module name="RecordViews.View"/>

import * as _ from 'underscore';

import * as record_views_tpl from 'recordviews.tpl';
import * as Backbone from '../../../Commons/Core/JavaScript/backbone/BackboneExtras';

import BackboneView = require('../../../Commons/BackboneExtras/JavaScript/Backbone.View');

// @class RecordViews.View @extend BackboneView
export const RecordViewsView: any = BackboneView.extend({
    // @property {Function} template
    template: record_views_tpl,
    attributes: { id: '', class: '' },
    // this attribute is used because this class has not been migrated
    // the actual implementation of this class is passing sometimes
    // a Backbone.Model that only use the get function of the
    // Backbone.Model class. To avoid this, in Case.List.View is being passed an object
    // instead of a model. This new implementation does not affect the Backward Compatibility
    recordViewObject: {},

    // @method initialize
    // @param {RecordViews.View.Initialize} options
    // @return {Void}
    initialize: function(options) {
        this.recordViewObject = this.model || options.record;
        this.extendChildViews();
    },

    // @property {Object} childViews
    childViews: {},

    // @method extendChildViews Internal method that based on the list of columns
    // that the current model has, extend the childViews property object by adding
    // each of the composite views specified in the columns.
    // Notice here that each column is of type RecordViews.View.Column
    // @return {Void}
    extendChildViews: function() {
        const self = this;
        const columns = this.getColumns();

        _.each(columns, function(column: any) {
            if (column.compositeKey) {
                const childView = {};
                childView[`${column.compositeKey}`] = function() {
                    return column.composite;
                };
                self.addChildViewInstances(childView);
            }
        });
    },

    // @method normalizeColumns Add the properties
    // showLabel and isComposite to each of the RecordViews.View.Column
    // of the current model.
    // @return {Array<RecordViews.View.Column>}
    normalizeColumns: function() {
        const columns = this.getColumns();
        return _.map(columns, function(column: any) {
            column.showLabel = !!column.label;
            column.isComposite = !!column.compositeKey;

            return column;
        });
    },
    checkIfModelInstance: function(): boolean {
        return this.recordViewObject instanceof Backbone.Model;
    },
    getColumns: function() {
        // const recordViewObject = this.model || this.record;
        return this.checkIfModelInstance()
            ? this.recordViewObject.get('columns')
            : this.recordViewObject.columns;
    },

    // @method getContext @return {RecordViews.View.Context}
    getContext: function() {
        let modelData;
        if (this.checkIfModelInstance()) {
            // TODO: remove this block when all files using this are migrated
            modelData = {
                isNavigable: this.recordViewObject.get('isNavigable'),
                showInModal: this.recordViewObject.get('showInModal'),
                touchPoint: this.recordViewObject.get('touchpoint'),
                detailsURL: this.recordViewObject.get('detailsURL'),
                title: this.recordViewObject.get('title'),
                id: this.recordViewObject.id
            };
        } else {
            modelData = {
                isNavigable: this.recordViewObject.isNavigable,
                showInModal: this.recordViewObject.showInModal,
                touchPoint: this.recordViewObject.touchpoint,
                detailsURL: this.recordViewObject.detailsURL,
                title: this.recordViewObject.title,
                id: this.recordViewObject.internalid
            };
        }
        return {
            // @property {Backbone.Model} model
            model: this.recordViewObject,
            // @property {String} id
            id: modelData.id,
            // @property {Boolean} isNavigable
            isNavigable: _.isBoolean(modelData.isNavigable) ? modelData.isNavigable : true,
            // @property {Boolean} showInModal
            showInModal: _.isBoolean(modelData.showInModal) ? modelData.showInModal : false,
            // @property {String} touchpoint
            touchpoint: modelData.touchPoint || 'customercenter',
            // @property {String} detailsURL
            detailsURL: this.options.referrer
                ? `${modelData.detailsURL}/${this.options.referrer}`
                : modelData.detailsURL,
            // @property {String} title
            title: modelData.title,
            // @property {Array<RecordViews.View.Column>} columns
            columns: this.normalizeColumns()
        };
    }
});

export type RecordViewsView = any;

// @class RecordViews.View.Initialize
// @property {RecordViews.View.Initialize.Model} model

// @class RecordViews.View.Initialize.Model @extends Backbone.Model
// @property {String} id
// @property {Boolean?} isNavigable The default value is true
// @property {Boolean?} showInModal The default value is false
// @property {String?} touchpoint The default value is 'customercenter'
// @property {String} detailsURL
// @property {String} title
// @property {Array<RecordViews.View.Column>} columns

// @class RecordViews.View.Column
// @property {String} label
// @property {Boolean} showLabel This field is calculated
// @property {Boolean} isComposite This field is calculated
// @property {String} type
// @property {String} name
// @property {String|Number|Boolean} value
// @property {String} compositeKey
// @property {Backbone.View} composite In instance of a view
