/*
	© 2020 NetSuite Inc.
	User may not copy, modify, distribute, or re-bundle or otherwise make available this code;
	provided, however, if you are an authorized user with a NetSuite account or log-in, you
	may use this code subject to the terms that govern your access and use.
*/

/// <amd-module name="Loggers.Appender.ElasticLogger.Cart"/>

import * as _ from 'underscore';
import { Loggers } from './Loggers';

import LiveOrderModel = require('../../LiveOrder/JavaScript/LiveOrder.Model');

export function mountToApp() {
    const logger = Loggers.getLogger();
    const liveOrder = LiveOrderModel.getInstance();
    let freeItemsBeforeAddLine = [];
    let freeItemsBeforeRemoveLine = [];
    let freeItemsBeforeAddPromotion = [];
    let freeItemsBeforeRemovePromotion = [];
    let submitLines = [];

    liveOrder.on('before:LiveOrder.addLines', () => {
        const lines = liveOrder.get('lines');
        freeItemsBeforeAddLine = [];

        lines.forEach((line: any) => {
            if (line.get('free_gift') && line.get('item')) {
                freeItemsBeforeAddLine.push(line.get('item').get('internalid'));
            }
        });
    });

    liveOrder.on('after:LiveOrder.addLines', () => {
        const lines = liveOrder.get('lines');
        const obj = {
            componentArea: 'ADDED_TO_CART',
            freeGiftQty: 0
        };

        const newInternalids = [];

        lines.forEach((line: any) => {
            const newLine =
                _.indexOf(freeItemsBeforeAddLine, line.get('item').get('internalid')) === -1;

            if (line.get('free_gift') && newLine && line.get('item')) {
                newInternalids.push(line.get('item').get('internalid'));
            }
        });

        if (newInternalids.length) {
            obj.freeGiftQty = newInternalids.length;
            // Because afterAddLine is triggered many times consecutively,
            // we must refresh the old free items.
            freeItemsBeforeAddLine = [...freeItemsBeforeAddLine, ...newInternalids];
            logger.info(obj);
        }
    });

    liveOrder.on('before:LiveOrder.addPromotion', () => {
        const lines = liveOrder.get('lines');
        freeItemsBeforeAddPromotion = [];

        lines.forEach((line: any) => {
            if (line.get('free_gift') && line.get('item')) {
                freeItemsBeforeAddPromotion.push(line.get('item').get('internalid'));
            }
        });
    });

    liveOrder.on('after:LiveOrder.addPromotion', () => {
        const lines = liveOrder.get('lines');
        const obj = {
            componentArea: 'ADDED_TO_CART',
            freeGiftQty: 0
        };

        const newInternalids = [];

        lines.forEach((line: any) => {
            const newLine =
                _.indexOf(freeItemsBeforeAddPromotion, line.get('item').get('internalid')) === -1;

            if (line.get('free_gift') && newLine && line.get('item')) {
                newInternalids.push(line.get('item').get('internalid'));
            }
        });

        if (newInternalids.length) {
            obj.freeGiftQty = newInternalids.length;
            freeItemsBeforeAddPromotion = [...freeItemsBeforeAddPromotion, ...newInternalids];
            logger.info(obj);
        }
    });

    liveOrder.on('before:LiveOrder.removePromotion', () => {
        const lines = liveOrder.get('lines');
        freeItemsBeforeRemovePromotion = [];

        lines.forEach((line: any) => {
            if (line.get('free_gift') && line.get('item')) {
                freeItemsBeforeRemovePromotion.push(line.get('item').get('internalid'));
            }
        });
    });

    liveOrder.on('after:LiveOrder.removePromotion', () => {
        const lines = liveOrder.get('lines');
        const obj = {
            componentArea: 'REMOVED_FROM_CART',
            freeGiftQty: 0
        };

        const internalids = [];

        lines.forEach((line: any) => {
            if (line.get('free_gift') && line.get('item')) {
                internalids.push(line.get('item').get('internalid'));
            }
        });

        const removedInternalids = _.difference(freeItemsBeforeRemovePromotion, internalids);

        if (removedInternalids.length) {
            obj.freeGiftQty = removedInternalids.length;
            freeItemsBeforeRemovePromotion = internalids;
            logger.info(obj);
        }
    });

    liveOrder.on('before:LiveOrder.removeLine', () => {
        const lines = liveOrder.get('lines');
        freeItemsBeforeRemoveLine = [];

        lines.forEach((line: any) => {
            if (line.get('free_gift') && line.get('item')) {
                freeItemsBeforeRemoveLine.push(line.get('item').get('internalid'));
            }
        });
    });

    liveOrder.on('after:LiveOrder.removeLine', () => {
        const lines = liveOrder.get('lines');
        const obj = {
            componentArea: 'REMOVED_FROM_CART',
            freeGiftQty: 0
        };

        const internalids = [];

        lines.forEach((line: any) => {
            if (line.get('free_gift') && line.get('item')) {
                internalids.push(line.get('item').get('internalid'));
            }
        });

        const removedInternalids = _.difference(freeItemsBeforeRemoveLine, internalids);

        if (removedInternalids.length) {
            obj.freeGiftQty = removedInternalids.length;
            freeItemsBeforeRemoveLine = internalids;
            logger.info(obj);
        }
    });

    liveOrder.on('before:LiveOrder.submit', () => {
        submitLines = liveOrder.get('lines');
    });

    liveOrder.on('after:LiveOrder.submit', () => {
        const obj = {
            componentArea: 'PLACED_ORDER',
            freeGiftQty: 0
        };

        submitLines.forEach((line: any) => {
            if (line.get('free_gift')) {
                obj.freeGiftQty++;
            }
        });

        logger.info(obj);
    });
}
