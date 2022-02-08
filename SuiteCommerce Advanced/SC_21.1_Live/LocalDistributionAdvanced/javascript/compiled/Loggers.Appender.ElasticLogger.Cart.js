/*
    © 2020 NetSuite Inc.
    User may not copy, modify, distribute, or re-bundle or otherwise make available this code;
    provided, however, if you are an authorized user with a NetSuite account or log-in, you
    may use this code subject to the terms that govern your access and use.
*/
define("Loggers.Appender.ElasticLogger.Cart", ["require", "exports", "underscore", "Loggers", "LiveOrder.Model"], function (require, exports, _, Loggers_1, LiveOrderModel) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    function mountToApp() {
        var logger = Loggers_1.Loggers.getLogger();
        var liveOrder = LiveOrderModel.getInstance();
        var freeItemsBeforeAddLine = [];
        var freeItemsBeforeRemoveLine = [];
        var freeItemsBeforeAddPromotion = [];
        var freeItemsBeforeRemovePromotion = [];
        var submitLines = [];
        liveOrder.on('before:LiveOrder.addLines', function () {
            var lines = liveOrder.get('lines');
            freeItemsBeforeAddLine = [];
            lines.forEach(function (line) {
                if (line.get('free_gift') && line.get('item')) {
                    freeItemsBeforeAddLine.push(line.get('item').get('internalid'));
                }
            });
        });
        liveOrder.on('after:LiveOrder.addLines', function () {
            var lines = liveOrder.get('lines');
            var obj = {
                componentArea: 'ADDED_TO_CART',
                freeGiftQty: 0
            };
            var newInternalids = [];
            lines.forEach(function (line) {
                var newLine = _.indexOf(freeItemsBeforeAddLine, line.get('item').get('internalid')) === -1;
                if (line.get('free_gift') && newLine && line.get('item')) {
                    newInternalids.push(line.get('item').get('internalid'));
                }
            });
            if (newInternalids.length) {
                obj.freeGiftQty = newInternalids.length;
                // Because afterAddLine is triggered many times consecutively,
                // we must refresh the old free items.
                freeItemsBeforeAddLine = freeItemsBeforeAddLine.concat(newInternalids);
                logger.info(obj);
            }
        });
        liveOrder.on('before:LiveOrder.addPromotion', function () {
            var lines = liveOrder.get('lines');
            freeItemsBeforeAddPromotion = [];
            lines.forEach(function (line) {
                if (line.get('free_gift') && line.get('item')) {
                    freeItemsBeforeAddPromotion.push(line.get('item').get('internalid'));
                }
            });
        });
        liveOrder.on('after:LiveOrder.addPromotion', function () {
            var lines = liveOrder.get('lines');
            var obj = {
                componentArea: 'ADDED_TO_CART',
                freeGiftQty: 0
            };
            var newInternalids = [];
            lines.forEach(function (line) {
                var newLine = _.indexOf(freeItemsBeforeAddPromotion, line.get('item').get('internalid')) === -1;
                if (line.get('free_gift') && newLine && line.get('item')) {
                    newInternalids.push(line.get('item').get('internalid'));
                }
            });
            if (newInternalids.length) {
                obj.freeGiftQty = newInternalids.length;
                freeItemsBeforeAddPromotion = freeItemsBeforeAddPromotion.concat(newInternalids);
                logger.info(obj);
            }
        });
        liveOrder.on('before:LiveOrder.removePromotion', function () {
            var lines = liveOrder.get('lines');
            freeItemsBeforeRemovePromotion = [];
            lines.forEach(function (line) {
                if (line.get('free_gift') && line.get('item')) {
                    freeItemsBeforeRemovePromotion.push(line.get('item').get('internalid'));
                }
            });
        });
        liveOrder.on('after:LiveOrder.removePromotion', function () {
            var lines = liveOrder.get('lines');
            var obj = {
                componentArea: 'REMOVED_FROM_CART',
                freeGiftQty: 0
            };
            var internalids = [];
            lines.forEach(function (line) {
                if (line.get('free_gift') && line.get('item')) {
                    internalids.push(line.get('item').get('internalid'));
                }
            });
            var removedInternalids = _.difference(freeItemsBeforeRemovePromotion, internalids);
            if (removedInternalids.length) {
                obj.freeGiftQty = removedInternalids.length;
                freeItemsBeforeRemovePromotion = internalids;
                logger.info(obj);
            }
        });
        liveOrder.on('before:LiveOrder.removeLine', function () {
            var lines = liveOrder.get('lines');
            freeItemsBeforeRemoveLine = [];
            lines.forEach(function (line) {
                if (line.get('free_gift') && line.get('item')) {
                    freeItemsBeforeRemoveLine.push(line.get('item').get('internalid'));
                }
            });
        });
        liveOrder.on('after:LiveOrder.removeLine', function () {
            var lines = liveOrder.get('lines');
            var obj = {
                componentArea: 'REMOVED_FROM_CART',
                freeGiftQty: 0
            };
            var internalids = [];
            lines.forEach(function (line) {
                if (line.get('free_gift') && line.get('item')) {
                    internalids.push(line.get('item').get('internalid'));
                }
            });
            var removedInternalids = _.difference(freeItemsBeforeRemoveLine, internalids);
            if (removedInternalids.length) {
                obj.freeGiftQty = removedInternalids.length;
                freeItemsBeforeRemoveLine = internalids;
                logger.info(obj);
            }
        });
        liveOrder.on('before:LiveOrder.submit', function () {
            submitLines = liveOrder.get('lines');
        });
        liveOrder.on('after:LiveOrder.submit', function () {
            var obj = {
                componentArea: 'PLACED_ORDER',
                freeGiftQty: 0
            };
            submitLines.forEach(function (line) {
                if (line.get('free_gift')) {
                    obj.freeGiftQty++;
                }
            });
            logger.info(obj);
        });
    }
    exports.mountToApp = mountToApp;
});

//# sourceMappingURL=Loggers.Appender.ElasticLogger.Cart.js.map
