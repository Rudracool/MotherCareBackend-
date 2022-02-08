/*
    © 2020 NetSuite Inc.
    User may not copy, modify, distribute, or re-bundle or otherwise make available this code;
    provided, however, if you are an authorized user with a NetSuite account or log-in, you
    may use this code subject to the terms that govern your access and use.
*/
define("PrintStatement", ["require", "exports", "Utils", "PrintStatement.View"], function (require, exports, Utils, PrintStatementView) {
    "use strict";
    // @class PrintStatement
    var PrintStatement = {
        // @method mountToApp
        mountToApp: function (application) {
            var pageType = application.getComponent('PageType');
            pageType.registerPageType({
                name: 'PrintStatement',
                routes: ['printstatement', 'printstatement?*params'],
                view: PrintStatementView,
                defaultTemplate: {
                    name: 'print_statement.tpl',
                    displayName: 'PrintStatement Default',
                    thumbnail: Utils.getThemeAbsoluteUrlOfNonManagedResources('img/default-layout-printStatement.png')
                }
            });
        }
    };
    return PrintStatement;
});

//# sourceMappingURL=PrintStatement.js.map
