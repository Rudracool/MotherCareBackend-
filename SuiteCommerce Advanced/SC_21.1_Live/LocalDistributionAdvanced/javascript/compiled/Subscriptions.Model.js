/*
    © 2020 NetSuite Inc.
    User may not copy, modify, distribute, or re-bundle or otherwise make available this code;
    provided, however, if you are an authorized user with a NetSuite account or log-in, you
    may use this code subject to the terms that govern your access and use.
*/
define("Subscriptions.Model", ["require", "exports", "underscore", "Utils", "Backbone", "Subscriptions.Line.Collection"], function (require, exports, _, Utils, Backbone, SubscriptionLineCollection) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.SubscriptionsModel = Backbone.CachedModel.extend({
        // @property {String} urlRoot
        urlRoot: Utils.getAbsoluteUrl('services/Subscriptions.ss', true),
        // @property {Boolean} cacheSupport
        // enable or disable the support for cache (Backbone.CachedModel)
        cacheSupport: true,
        initialize: function () {
            this.on('change:nonIncludedLinesCollection', function (model, lines) {
                if (!!lines.length) {
                    model.set('nonIncludedLinesCollection', new SubscriptionLineCollection(lines), {
                        silent: true
                    });
                }
            });
            this.on('change:optionalSubscriptionLines', function (model, lines) {
                if (!!lines.length) {
                    model.set('optionalSubscriptionLines', new SubscriptionLineCollection(lines), {
                        silent: true
                    });
                }
            });
            this.on('change:requiredSubscriptionLines', function (model, lines) {
                if (!!lines.length) {
                    model.set('requiredSubscriptionLines', new SubscriptionLineCollection(lines), {
                        silent: true
                    });
                }
            });
        },
        getTypeUrl: function () {
            var record_root_url = '/subscription';
            return record_root_url + '/' + this.get('internalId');
        },
        getStatusLabel: function () {
            if (this.get('isProcessing') || this.get('status') === 'PENDING_ACTIVATION') {
                return 'PROCESSING';
            }
            else {
                return this.get('status');
            }
        },
        findLineInUnifiedCollection: function findLineInUnifiedCollection(internalId) {
            var ALLCOLLECTIONSINONE = [];
            ALLCOLLECTIONSINONE.push.apply(ALLCOLLECTIONSINONE, this.get('nonIncludedLinesCollection').models);
            ALLCOLLECTIONSINONE.push.apply(ALLCOLLECTIONSINONE, this.get('optionalSubscriptionLines').models);
            ALLCOLLECTIONSINONE.push.apply(ALLCOLLECTIONSINONE, this.get('requiredSubscriptionLines').models);
            return _.find(ALLCOLLECTIONSINONE, function (item) {
                return item.get('internalId') === internalId;
            });
        },
        hasAddOnByLineNumber: function (lineNumber) {
            return !_.isUndefined(_.find(this.get('optionalSubscriptionLines').models, function (item) {
                return item.get('lineNumber') === lineNumber;
            }));
        }
    });
});

//# sourceMappingURL=Subscriptions.Model.js.map
