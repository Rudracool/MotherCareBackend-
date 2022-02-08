/*
	© 2020 NetSuite Inc.
	User may not copy, modify, distribute, or re-bundle or otherwise make available this code;
	provided, however, if you are an authorized user with a NetSuite account or log-in, you
	may use this code subject to the terms that govern your access and use.
*/

/// <amd-module name="Tracker.ExtensibilityHelper"/>

import * as _ from 'underscore';
import * as Utils from '../../Utilities/JavaScript/Utils';

import ICartComponent = require('../../Cart/JavaScript/ICart.Component');

interface Product {
    sku: string;
    name: string;
    price: number;
}

interface ProductViewInfo extends Product {
    internalId: string;
    isInStock: boolean;
    isBackorderable: boolean;
    quantityAvailable: number;
    thumbnail: string;
    urlComponent: string;
}

interface PageViewInfo {
    url: string;
}

interface TransactionInfo {
    confirmationNumber: string;
    subTotal: number;
    taxTotal: number;
    shippingCost: number;
    handlingCost: number;
    products: TransactionProductInfo[];
    total: number;
    promoCodes: string[];
}

interface TransactionProductInfo extends Product {
    quantity: number;
    options: string;
}

function normalizePageView(url: string): PageViewInfo {
    return { url };
}

function normalizeCartLine(line) {
    // eslint-disable-next-line no-underscore-dangle
    return ICartComponent._normalizeLine(line);
}

function normalizeCartLines(lines) {
    // eslint-disable-next-line no-underscore-dangle
    return ICartComponent._normalizeLines(lines);
}

function normalizeTransaction(transactionModel): TransactionInfo {
    const normalizedTransaction: TransactionInfo = {
        handlingCost: transactionModel.get('handlingCost'),
        shippingCost: transactionModel.get('shippingCost'),
        subTotal: transactionModel.get('subTotal'),
        taxTotal: transactionModel.get('taxTotal'),
        total: transactionModel.get('total'),
        confirmationNumber: transactionModel.get('confirmationNumber'),
        promoCodes: _.pluck(transactionModel.get('promocodes'), 'code'),
        products: transactionModel.get('products').map(product => {
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

function normalizeItem(productModel): ProductViewInfo {
    const item = productModel.get('item');
    const itemThumbnail = item.get('_thumbnail');
    const normalizedItem: ProductViewInfo = {
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

const EVENT_DATA_NORMALIZER_MAP = {
    trackPageview: normalizePageView,
    trackAddToCart: normalizeCartLine,
    trackCartUpdate: normalizeCartLines,
    trackTransaction: normalizeTransaction,
    trackProductView: normalizeItem
};

export function getNormalizer(event: string): Function {
    return EVENT_DATA_NORMALIZER_MAP[event];
}
