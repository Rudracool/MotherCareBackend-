/*
    © 2020 NetSuite Inc.
    User may not copy, modify, distribute, or re-bundle or otherwise make available this code;
    provided, however, if you are an authorized user with a NetSuite account or log-in, you
    may use this code subject to the terms that govern your access and use.
*/
define("Backbone.Model", ["require", "exports", "underscore", "SC.CancelableEvents", "Backbone", "Backbone.Validation"], function (require, exports, _, SC_CancelableEvents_1, Backbone) {
    "use strict";
    _.extend(Backbone.Model.prototype, {
        // @method url SCA Overrides @?method Backbone.Model.url
        // to add model's 'internalid' as parameter @return {String}
        url: function () {
            var base = _.result(this, 'urlRoot') || _.result(this.collection, 'url');
            if (this.isNew()) {
                return base;
            }
            var sep = base.indexOf('?') === -1 ? '?' : '&';
            return base + sep + 'internalid=' + encodeURIComponent(this.id);
        },
        deepCopy: function deepCopy() {
            return this.attributes || {};
        },
        // @method url SCA Overrides @?property Backbone.Model.idAttribute
        // to add model's 'internalid' as parameter @return {String}
        idAttribute: 'internalid',
        sync: function () {
            var args = [];
            for (var _i = 0; _i < arguments.length; _i++) {
                args[_i] = arguments[_i];
            }
            return Backbone.sync.apply(this, args).always(_.bind(function (body, status, xhr) {
                try {
                    if (xhr.getResponseHeader) {
                        this.addOperationId(xhr.getResponseHeader('x-n-operationid'));
                    }
                }
                catch (e) {
                    console.error('Error fetching Operation Id from header.');
                }
            }, this));
        },
        addOperationId: function (ids) {
            if (!this.operationIds || !Array.isArray(this.operationIds)) {
                this.operationIds = [];
            }
            if (Array.isArray(ids)) {
                this.operationIds = this.operationIds.concat(ids);
            }
            else {
                this.operationIds.push(ids);
            }
        },
        getOperationIds: function () {
            return this.operationIds;
        },
        getLatestOperationIds: function (lastOperationIdIndex) {
            return this.getOperationIds().slice(lastOperationIdIndex);
        }
    }, SC_CancelableEvents_1.SCCancelableEvents);
    var BackboneModel = Backbone.Model;
    return BackboneModel;
});

//# sourceMappingURL=Backbone.Model.js.map
