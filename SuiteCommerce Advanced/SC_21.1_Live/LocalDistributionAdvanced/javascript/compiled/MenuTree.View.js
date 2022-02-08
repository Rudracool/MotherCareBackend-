/*
    © 2020 NetSuite Inc.
    User may not copy, modify, distribute, or re-bundle or otherwise make available this code;
    provided, however, if you are an authorized user with a NetSuite account or log-in, you
    may use this code subject to the terms that govern your access and use.
*/
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
define("MenuTree.View", ["require", "exports", "underscore", "menu_tree.tpl", "MyAccountMenu", "jQuery", "Backbone.CollectionView", "MenuTree.Node.View", "Singleton", "Backbone.View"], function (require, exports, _, menu_tree_tpl, MyAccountMenu_1, jQuery, BackboneCollectionView, MenuTreeNodeView, Singleton, BackboneView) {
    "use strict";
    return BackboneView.extend({
        // @property {Function} template
        template: menu_tree_tpl,
        events: {
            'click [data-action="expander"]': 'menuClick'
        },
        render: function () {
            var args = [];
            for (var _i = 0; _i < arguments.length; _i++) {
                args[_i] = arguments[_i];
            }
            this.fixedMenuItems = this.backwardCompatibilitySanitize(MyAccountMenu_1.MyAccountMenu.getInstance().getEntries());
            BackboneView.prototype.render.apply(this, args);
        },
        backwardCompatibilitySanitize: function (menu) {
            var entries = [];
            _.each(menu, function (entry) {
                var newSubEntries = [];
                _.each(entry.children, function (subEntry) {
                    var entryId = subEntry.entryId, rest = __rest(subEntry, ["entryId"]);
                    newSubEntries.push(__assign({}, rest, { children: [] }));
                });
                entries.push(__assign({}, entry, { children: newSubEntries }));
            });
            return entries;
        },
        // @method menuClick Note: cant use bootstrap collapse due to the divs
        // introduced by collection view. @param {HTMLEvent} e
        menuClick: function (e, synthetic) {
            var target = jQuery(e.currentTarget);
            var this_expander = target.next('[data-type="menu-tree-node-expander"]');
            var this_expander_is_opened = this_expander.hasClass('in');
            var this_expandable = target.closest('[data-type="menu-tree-node-expandable"]');
            var all_expandables = this.$('[data-type="menu-tree-node-expandable"]');
            all_expandables.removeClass('open');
            this_expandable.addClass('open');
            // if inside a closed expander: close others open this one
            var expanding_expander = this.$(target.data('target'));
            if (!this_expander_is_opened) {
                var open_expanders = this.$('[data-type="menu-tree-node-expander"].in');
                jQuery.fn.collapse.call(open_expanders, 'hide');
                jQuery.fn.collapse.call(expanding_expander, 'show');
            }
            if (synthetic === undefined && this_expander_is_opened) {
                jQuery.fn.collapse.call(expanding_expander, 'hide');
                this_expandable.removeClass('open');
            }
        },
        // @method updateSidebar @param {String} label
        updateSidebar: function (label) {
            this.currentLabel = label || this.currentLabel;
            var target = this.$('[data-id="' + this.currentLabel + '"]');
            var target_expandable = target.closest('[data-type="menu-tree-node-expandable"]');
            var anchors = this.$('[data-id]');
            // remove active for all anchors and add for this one
            anchors.removeClass('active');
            target.addClass('active');
            // triggers click for the correct expander
            target_expandable
                .find('[data-action="expander"]:first')
                .trigger('click', { synthetic: true });
            // edge case for home, should close other expanders
            if (label === 'home') {
                var all_expandables = this.$('[data-type="menu-tree-node-expandable"]');
                var open_expanders = this.$('[data-type="menu-tree-node-expander"].in');
                all_expandables.removeClass('open');
                jQuery.fn.collapse.call(open_expanders, 'hide');
            }
        },
        // @method updateMenuItemsUI re-render the menu items menu - useful for dynamic menu items
        // that need to re-render when something changes. Each module is responsible of calling
        // this method when appropiate.
        updateMenuItemsUI: function () {
            this.render();
            this.updateSidebar();
        },
        // @method getContext @returns MenuTree.View.Context
        getContext: function () {
            // @class MenuTree.View.Context
            return {
                // @propery {Array} menuItems
                menuItems: this.fixedMenuItems
            };
            // @class MenuTree.View
        },
        childViews: {
            'MenuItems.Collection': function () {
                return new BackboneCollectionView({
                    collection: this.fixedMenuItems,
                    childView: MenuTreeNodeView,
                    viewsPerRow: 1,
                    childViewOptions: {
                        level: 1
                    }
                });
            }
        }
    }, Singleton);
});

//# sourceMappingURL=MenuTree.View.js.map
