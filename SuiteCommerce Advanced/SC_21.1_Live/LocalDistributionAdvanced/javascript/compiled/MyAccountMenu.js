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
define("MyAccountMenu", ["require", "exports", "underscore", "EventEmitter"], function (require, exports, _, EventEmitter_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var MyAccountMenu = /** @class */ (function () {
        function MyAccountMenu() {
            this.entries = [];
            this.emitter = new EventEmitter_1.DefaultEventEmitter();
            this.entries = [];
            this.subEntries = [];
        }
        MyAccountMenu.prototype.correctUrl = function (url) {
            if (url === void 0) { url = ''; }
            if (url && url[0] !== '/') {
                return '/' + url;
            }
            return url;
        };
        MyAccountMenu.prototype.addEntry = function (entry) {
            if (!_.some(this.entries, function (elem) { return elem.id === entry.id; })) {
                entry.url = this.correctUrl(entry.url);
                this.entries.push(entry);
                this.getEmitter().emit('entriesChanged');
            }
        };
        MyAccountMenu.prototype.addSubEntry = function (subEntry) {
            if (!_.some(this.subEntries, function (elem) { return elem.id === subEntry.id; })) {
                subEntry.url = this.correctUrl(subEntry.url);
                this.subEntries.push(subEntry);
                this.getEmitter().emit('entriesChanged');
            }
        };
        MyAccountMenu.prototype.replaceEntry = function (entryId, newEntry) {
            var entryToDelete = _.find(this.entries, function (entry) { return entry.id === entryId; });
            if (entryToDelete) {
                this.entries.splice(this.entries.indexOf(entryToDelete), 1);
                this.addEntry(newEntry);
                this.getEmitter().emit('entriesChanged');
            }
        };
        MyAccountMenu.prototype.replaceSubEntry = function (subEntryId, newSubEntry) {
            var subEntryToDelete = _.find(this.subEntries, function (entry) { return entry.id === subEntryId; });
            if (subEntryToDelete) {
                this.subEntries.splice(this.subEntries.indexOf(subEntryToDelete), 1);
                this.addSubEntry(newSubEntry);
                this.getEmitter().emit('entriesChanged');
            }
        };
        MyAccountMenu.prototype.remove = function (menu, id) {
            var toDelete = _.find(menu, function (entry) { return entry.id === id; });
            if (toDelete) {
                menu.splice(menu.indexOf(toDelete), 1);
                this.getEmitter().emit('entriesChanged');
            }
        };
        MyAccountMenu.prototype.removeEntry = function (entryId) {
            this.remove(this.entries, entryId);
        };
        MyAccountMenu.prototype.removeSubEntry = function (subEntryId) {
            this.remove(this.subEntries, subEntryId);
        };
        MyAccountMenu.prototype.getEmitter = function () {
            return this.emitter;
        };
        MyAccountMenu.prototype.getEntries = function () {
            var _this = this;
            var order = function (a, b) { return a.index - b.index; };
            var entries = this.entries.sort(order);
            var menu = [];
            _.each(entries, function (entry) {
                var menuEntry = __assign({}, entry, { children: [], showChildren: false });
                menuEntry.children = _.filter(_this.subEntries, function (subEntry) { return subEntry.entryId === entry.id; }).sort(order);
                menuEntry.showChildren = menuEntry.url !== '' ? false : menuEntry.children.length > 0;
                menu.push(menuEntry);
            });
            return menu;
        };
        MyAccountMenu.prototype.getMenuIdByUrl = function (url) {
            var menu = _.find(this.entries, function (entry) { return entry.url === url; });
            if (menu) {
                return menu.id;
            }
            var subMenu = _.find(this.subEntries, function (subEntry) { return subEntry.url === url; });
            return subMenu ? subMenu.id : '';
        };
        MyAccountMenu.getInstance = function () {
            this.instance = this.instance || new MyAccountMenu();
            return this.instance;
        };
        return MyAccountMenu;
    }());
    exports.MyAccountMenu = MyAccountMenu;
});

//# sourceMappingURL=MyAccountMenu.js.map
