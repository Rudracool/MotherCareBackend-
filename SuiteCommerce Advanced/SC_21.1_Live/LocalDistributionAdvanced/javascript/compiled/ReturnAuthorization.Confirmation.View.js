/*
    © 2020 NetSuite Inc.
    User may not copy, modify, distribute, or re-bundle or otherwise make available this code;
    provided, however, if you are an authorized user with a NetSuite account or log-in, you
    may use this code subject to the terms that govern your access and use.
*/
define("ReturnAuthorization.Confirmation.View", ["require", "exports", "return_authorization_confirmation.tpl", "Utils", "Configuration", "AjaxRequestsKiller", "Backbone.CollectionView", "Transaction.Line.Views.Cell.Navigable.View", "ReturnAuthorization.Model", "Backbone.View"], function (require, exports, return_authorization_confirmation_tpl, Utils, Configuration_1, AjaxRequestsKiller_1, BackboneCollectionView, Transaction_Line_Views_Cell_Navigable_View_1, ReturnAuthorizationModel, BackboneView) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.ReturnAuthorizationConfirmationView = BackboneView.extend({
        template: return_authorization_confirmation_tpl,
        title: Utils.translate('Request Return'),
        page_header: Utils.translate('Confirmation'),
        page_title: Utils.translate('Request Return'),
        attributes: {
            class: 'ReturnAuthorizationConfirmation'
        },
        initialize: function (options) {
            this.application = options.application;
            this.model = new ReturnAuthorizationModel({
                internalid: options.routerArguments[1]
            });
        },
        beforeShowContent: function beforeShowContent() {
            return this.model.fetch({
                data: {
                    internalid: this.options.routerArguments[1],
                    recordtype: this.options.routerArguments[0]
                },
                killerId: AjaxRequestsKiller_1.AjaxRequestsKiller.getKillerId()
            });
        },
        childViews: {
            'Items.Collection': function () {
                return new BackboneCollectionView({
                    childView: Transaction_Line_Views_Cell_Navigable_View_1.TransactionLineViewsCellNavigableView,
                    collection: this.model.get('lines'),
                    viewsPerRow: 1,
                    childViewOptions: {
                        detail1Title: Utils.translate('Qty:'),
                        detail1: 'quantity',
                        detail2Title: Utils.translate('Amount:'),
                        detail2: 'amount_formatted',
                        detail3: 'reason',
                        ignorePriceVisibility: true
                    }
                });
            }
        },
        // @method getSelectedMenu
        getSelectedMenu: function () {
            return 'returns';
        },
        // @method getBreadcrumbPages
        getBreadcrumbPages: function () {
            return {
                text: this.title,
                href: '/returns'
            };
        },
        // @meth getContext @return ReturnAuthorization.Confirmation.View.Context
        getContext: function () {
            // @class ReturnAuthorization.Confirmation.View.Context
            return {
                // @property {ReturnAuthorization.Model} model
                model: this.model,
                // @property {String} pageTitle
                pageTitle: this.page_title,
                // @property {String} pageHeader
                pageHeader: this.page_header,
                // @property {String} internalId
                internalId: this.model.get('internalid'),
                // @property {String} modelTranId
                modelTranId: this.model.get('createdform') ? this.model.get('createdform').name : '',
                // @property {String} totalFormatted
                totalFormatted: this.model.get('summary').total_formatted,
                // @property {Number} linesLength
                linesLength: this.model.get('lines').length,
                // @property {Boolean} showComments
                showComments: !!this.model.get('memo'),
                // @property {Boolean} isElementCollapsed
                isElementCollapsed: Configuration_1.Configuration.get('sca.collapseElements')
            };
        }
    });
});

//# sourceMappingURL=ReturnAuthorization.Confirmation.View.js.map
