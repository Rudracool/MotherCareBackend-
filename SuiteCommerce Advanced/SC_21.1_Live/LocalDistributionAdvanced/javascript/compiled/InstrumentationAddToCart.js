/*
    © 2020 NetSuite Inc.
    User may not copy, modify, distribute, or re-bundle or otherwise make available this code;
    provided, however, if you are an authorized user with a NetSuite account or log-in, you
    may use this code subject to the terms that govern your access and use.
*/
define("InstrumentationAddToCart", ["require", "exports", "underscore"], function (require, exports, _) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    function itemToTrack(line) {
        var itemTrack = {
            itemQuantity: 0,
            itemId: 0
        };
        if (line.get('quantity')) {
            itemTrack.itemQuantity = line.get('quantity');
        }
        if (line.get('item')) {
            if (line.get('item').get('internalid')) {
                itemTrack.itemId = line.get('item').get('internalid');
            }
        }
        return itemTrack;
    }
    exports.itemToTrack = itemToTrack;
    function getAddToCartOperationId(cartModels, currentLine) {
        var addToCartOperationIds = [];
        _.each(cartModels, function (cartLine) {
            if (cartLine.get('item') &&
                cartLine.get('item').id &&
                (currentLine.get('item') && currentLine.get('item').id) &&
                cartLine.get('item').id === currentLine.get('item').id) {
                addToCartOperationIds = cartLine.getOperationIds();
            }
        });
        return addToCartOperationIds;
    }
    exports.getAddToCartOperationId = getAddToCartOperationId;
    function addOperationIdToCartLine(cartModels, lines) {
        _.each(lines.models, function (line) {
            var lineId = 0;
            if (line.get('item') && line.get('item').id) {
                lineId = line.get('item').id;
            }
            _.each(cartModels, function (cartLine) {
                if (cartLine.get('item') &&
                    cartLine.get('item').id &&
                    cartLine.get('item').id === lineId) {
                    cartLine.addOperationId(lines.getOperationIds());
                }
            });
        });
    }
    exports.addOperationIdToCartLine = addOperationIdToCartLine;
});

//# sourceMappingURL=InstrumentationAddToCart.js.map
