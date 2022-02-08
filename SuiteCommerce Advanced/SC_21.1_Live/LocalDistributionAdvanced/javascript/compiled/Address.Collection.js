/*
    © 2020 NetSuite Inc.
    User may not copy, modify, distribute, or re-bundle or otherwise make available this code;
    provided, however, if you are an authorized user with a NetSuite account or log-in, you
    may use this code subject to the terms that govern your access and use.
*/
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
define("Address.Collection", ["require", "exports", "Address.Model", "Collection"], function (require, exports, Address_Model_1, Collection_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var AddressCollection = /** @class */ (function (_super) {
        __extends(AddressCollection, _super);
        function AddressCollection() {
            var _this = _super !== null && _super.apply(this, arguments) || this;
            _this.model = Address_Model_1.AddressModel;
            _this.url = function () { return 'services/Address.Service.ss'; };
            _this.comparator = function (model) {
                return model.get('defaultbilling') === 'T' || model.get('defaultshipping') === 'T' ? 0 : 1;
            };
            return _this;
        }
        AddressCollection.prototype.getCollectionForRendering = function () {
            if (this && !!this.length) {
                var cloned_collection = this.clone();
                var new_address = this.first().clone();
                new_address.set('internalid', '-1');
                cloned_collection.models.push(new_address);
                return cloned_collection;
            }
            return null;
        };
        return AddressCollection;
    }(Collection_1.Collection));
    exports.AddressCollection = AddressCollection;
});

//# sourceMappingURL=Address.Collection.js.map
