/*
    © 2020 NetSuite Inc.
    User may not copy, modify, distribute, or re-bundle or otherwise make available this code;
    provided, however, if you are an authorized user with a NetSuite account or log-in, you
    may use this code subject to the terms that govern your access and use.
*/
define("MyAccountMenu.Component", ["require", "exports", "underscore", "MyAccountMenu", "SC.BaseComponent", "MenuTree.View"], function (require, exports, _, MyAccountMenu_1, SC_BaseComponent_1, MenuTreeView) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    function parsePermission(permissions) {
        var concat = '';
        _.each(permissions, function (item) {
            concat = concat + item.group + "." + item.id + "." + item.level + ", ";
        });
        return concat.substring(0, concat.length - 2);
    }
    function mountToApp(container) {
        container.registerComponent(this.componentGenerator(container));
    }
    exports.mountToApp = mountToApp;
    function componentGenerator(container) {
        var menu = MenuTreeView.getInstance();
        var myAccountMenu = MyAccountMenu_1.MyAccountMenu.getInstance();
        return SC_BaseComponent_1.SCBaseComponent.extend({
            componentName: 'MyAccountMenu',
            application: container,
            addGroup: function (g) {
                var entry = {
                    id: g.id,
                    index: g.index,
                    name: g.name,
                    permissionOperator: g.permissionoperator,
                    permission: parsePermission(g.permission)
                };
                if (g.url) {
                    entry.url = g.url;
                }
                myAccountMenu.addEntry(entry);
                menu.updateMenuItemsUI();
            },
            addGroupEntry: function (e) {
                var subEntry = {
                    id: e.id,
                    name: e.name,
                    index: e.index,
                    url: e.url,
                    entryId: e.groupid,
                    permission: parsePermission(e.permission),
                    permissionOperator: e.permissionoperator
                };
                myAccountMenu.addSubEntry(subEntry);
                menu.updateMenuItemsUI();
            }
        });
    }
    exports.componentGenerator = componentGenerator;
});

//# sourceMappingURL=MyAccountMenu.Component.js.map
