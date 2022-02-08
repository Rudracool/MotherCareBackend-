/*
    © 2020 NetSuite Inc.
    User may not copy, modify, distribute, or re-bundle or otherwise make available this code;
    provided, however, if you are an authorized user with a NetSuite account or log-in, you
    may use this code subject to the terms that govern your access and use.
*/
define("Case", ["require", "exports", "Utils", "Case.List.View", "Case.Create.View", "Case.Detail.View", "Configuration"], function (require, exports, Utils, Case_List_View_1, Case_Create_View_1, Case_Detail_View_1) {
    "use strict";
    // Is Case functionality available for this application?
    var isCaseManagementEnabled = function () {
        return SC && SC.ENVIRONMENT && SC.ENVIRONMENT.casesManagementEnabled;
    };
    // Encapsulate all Case elements into a single module to be mounted to the application
    // Update: Keep the application reference within the function once its mounted into the application
    var CaseModule = (function () {
        var mountToApp = function (application) {
            var pageType = application.getComponent('PageType');
            pageType.registerPageType({
                name: 'CasesList',
                routes: ['cases', 'cases?:options'],
                view: Case_List_View_1.CaseListView,
                defaultTemplate: {
                    name: 'case_list.tpl',
                    displayName: 'Cases list default',
                    thumbnail: Utils.getThemeAbsoluteUrlOfNonManagedResources('img/default-layout-transaction-list.png')
                }
            });
            pageType.registerPageType({
                name: 'CasesDetail',
                routes: ['cases/:id'],
                view: Case_Detail_View_1.CaseDetailView,
                defaultTemplate: {
                    name: 'case_detail.tpl',
                    displayName: 'Cases detail default',
                    thumbnail: Utils.getThemeAbsoluteUrlOfNonManagedResources('img/default-layout-cases-detail.png')
                }
            });
            pageType.registerPageType({
                name: 'NewCase',
                routes: ['newcase'],
                view: Case_Create_View_1.CaseCreateView,
                defaultTemplate: {
                    name: 'case_new.tpl',
                    displayName: 'Cases detail default',
                    thumbnail: Utils.getThemeAbsoluteUrlOfNonManagedResources('img/default-layout-cases-new.png')
                }
            });
        };
        return {
            isEnabled: isCaseManagementEnabled,
            mountToApp: mountToApp
        };
    })();
    return CaseModule;
});

//# sourceMappingURL=Case.js.map
