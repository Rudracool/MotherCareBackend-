/*
    © 2020 NetSuite Inc.
    User may not copy, modify, distribute, or re-bundle or otherwise make available this code;
    provided, however, if you are an authorized user with a NetSuite account or log-in, you
    may use this code subject to the terms that govern your access and use.
*/
define("ReturnAuthorization", ["require", "exports", "Utils", "ReturnAuthorization.List.View", "ReturnAuthorization.Detail.View", "ReturnAuthorization.Form.View", "ReturnAuthorization.Confirmation.View"], function (require, exports, Utils, ReturnAuthorization_List_View_1, ReturnAuthorization_Detail_View_1, ReturnAuthorization_Form_View_1, ReturnAuthorization_Confirmation_View_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    // Defines the Return Authorization module (Model, Collection, Views, Router)
    function mountToApp(application) {
        var pageType = application.getComponent('PageType');
        pageType.registerPageType({
            name: 'ReturnsHistory',
            routes: ['returns', 'returns?:options'],
            view: ReturnAuthorization_List_View_1.ReturnAuthorizationListView,
            defaultTemplate: {
                name: 'return_authorization_list.tpl',
                displayName: 'Return authorization list default',
                thumbnail: Utils.getThemeAbsoluteUrlOfNonManagedResources('img/default-layout-transaction-list.png')
            }
        });
        pageType.registerPageType({
            name: 'ReturnsDetail',
            routes: ['returns/:recordtype/:id', 'returns/:recordtype/:id?:options'],
            view: ReturnAuthorization_Detail_View_1.ReturnAuthorizationDetailView,
            defaultTemplate: {
                name: 'return_authorization_detail.tpl',
                displayName: 'Return authorization details default',
                thumbnail: Utils.getThemeAbsoluteUrlOfNonManagedResources('img/default-layout-return-detail.png')
            }
        });
        pageType.registerPageType({
            name: 'returnAuthorizationFrom',
            routes: ['returns/new/:recordtype/:id'],
            view: ReturnAuthorization_Form_View_1.ReturnAuthorizationFormView,
            defaultTemplate: {
                name: 'return_authorization_form.tpl',
                displayName: 'Return authorization form default',
                thumbnail: Utils.getThemeAbsoluteUrlOfNonManagedResources('img/default-layout-return-authorization-form.png')
            }
        });
        pageType.registerPageType({
            name: 'returnAuthorizationConfirmation',
            routes: ['returns/confirmation/:recordtype/:id'],
            view: ReturnAuthorization_Confirmation_View_1.ReturnAuthorizationConfirmationView,
            defaultTemplate: {
                name: 'return_authorization_confirmation.tpl',
                displayName: 'Return authorization confirmation default',
                thumbnail: Utils.getThemeAbsoluteUrlOfNonManagedResources('img/default-layout-return-authorization-confirmation.png')
            }
        });
    }
    exports.mountToApp = mountToApp;
});

//# sourceMappingURL=ReturnAuthorization.js.map
