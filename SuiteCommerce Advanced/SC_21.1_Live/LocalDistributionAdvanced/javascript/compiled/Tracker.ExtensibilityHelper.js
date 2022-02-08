/*
    © 2020 NetSuite Inc.
    User may not copy, modify, distribute, or re-bundle or otherwise make available this code;
    provided, however, if you are an authorized user with a NetSuite account or log-in, you
    may use this code subject to the terms that govern your access and use.
*/
define("Tracker.ExtensibilityHelper", ["require", "exports", "underscore", "Utils", "ICart.Component"], function (require, exports, _, Utils, ICartComponent) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    function normalizePageView(url) {
        return { url: url };
    }
    function normalizeCartLine(line) {
        // eslint-disable-next-line no-underscore-dangle
        return ICartComponent._normalizeLine(line);
    }
    function normalizeCartLines(lines) {
        // eslint-disable-next-line no-underscore-dangle
        return ICartComponent._normalizeLines(lines);
    }
    function normalizeTransaction(transactionModel) {
        var normalizedTransaction = {
            handlingCost: transactionModel.get('handlingCost'),
            shippingCost: transactionModel.get('shippingCost'),
            subTotal: transactionModel.get('subTotal'),
            taxTotal: transactionModel.get('taxTotal'),
            total: transactionModel.get('total'),
            confirmationNumber: transactionModel.get('confirmationNumber'),
            promoCodes: _.pluck(transactionModel.get('promocodes'), 'code'),
            products: transactionModel.get('products').map(function (product) {
                return {
                    sku: product.get('id'),
                    name: product.get('name'),
                    price: product.get('rate'),
                    quantity: product.get('quantity'),
                    options: product.get('options')
                };
            })
        };
        return Utils.deepCopy(normalizedTransaction);
    }
    function normalizeItem(productModel) {
        var item = productModel.get('item');
        var itemThumbnail = item.get('_thumbnail');
        var normalizedItem = {
            internalId: item.get('internalid'),
            isBackorderable: item.get('isbackorderable'),
            isInStock: item.get('isinstock'),
            name: item.get('_name'),
            price: item.get('_price'),
            quantityAvailable: item.get('quantityavailable'),
            sku: item.get('_sku'),
            thumbnail: itemThumbnail && itemThumbnail.url ? itemThumbnail.url : '',
            urlComponent: item.get('_url')
        };
        return Utils.deepCopy(normalizedItem);
    }
    var EVENT_DATA_NORMALIZER_MAP = {
        trackPageview: normalizePageView,
        trackAddToCart: normalizeCartLine,
        trackCartUpdate: normalizeCartLines,
        trackTransaction: normalizeTransaction,
        trackProductView: normalizeItem
    };
    function getNormalizer(event) {
        return EVENT_DATA_NORMALIZER_MAP[event];
    }
    exports.getNormalizer = getNormalizer;
});

//# sourceMappingURL=Tracker.ExtensibilityHelper.js.map
