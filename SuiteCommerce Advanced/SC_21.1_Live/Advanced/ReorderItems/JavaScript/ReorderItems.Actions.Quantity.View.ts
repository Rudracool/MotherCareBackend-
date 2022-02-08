/*
	© 2020 NetSuite Inc.
	User may not copy, modify, distribute, or re-bundle or otherwise make available this code;
	provided, however, if you are an authorized user with a NetSuite account or log-in, you
	may use this code subject to the terms that govern your access and use.
*/

/// <amd-module name="ReorderItems.Actions.Quantity.View"/>
// @Typescript-full

import * as reorder_items_actions_quantity_tpl from 'reorder_items_actions_quantity.tpl';
import * as jQuery from '../../../Commons/Core/JavaScript/jQuery';

import { EventsHash, View } from '../../../Commons/Core/JavaScript/View';
import { ReorderItemsModel } from './ReorderItems.Model';

import TriggeredEvent = JQuery.TriggeredEvent;

interface ReturnedContext {
    line: ReorderItemsModel;
    showQuantityInput: boolean;
    lineId: string;
    itemQuantity: number;
    showLastPurchased: boolean;
    showMinimumQuantity: boolean;
    minimumQuantity: number;
    showMaximumQuantity: boolean;
    maximumQuantity: number;
}

interface ViewOptions {
    model: ReorderItemsModel;
}

export class ReorderItemsActionsQuantityView extends View<ReturnedContext> {
    private readonly options: ViewOptions;

    private line: ReorderItemsModel;

    protected template = reorder_items_actions_quantity_tpl;

    protected getEvents(): EventsHash {
        return {
            'click [data-action="plus"]': 'addQuantity',
            'click [data-action="minus"]': 'subQuantity'
        };
    }

    public constructor(options: ViewOptions) {
        super();

        this.options = options;
        this.line = options.model;
    }

    public getContext(): ReturnedContext {
        const item = this.line.get('item');
        const minimum_quantity = item.get('_minimumQuantity', true) || 1;
        const maximum_quantity = item.get('_maximumQuantity', true) || 0;
        const itemQuantity =
            this.line.get('quantity') > minimum_quantity
                ? this.line.get('quantity')
                : minimum_quantity;

        return {
            line: this.line,
            showQuantityInput: !!item.get('_isPurchasable'),
            lineId: this.line.get('internalid'),
            itemQuantity: itemQuantity,
            showLastPurchased: !!this.line.get('trandate'),
            showMinimumQuantity: minimum_quantity > 1,
            minimumQuantity: minimum_quantity,
            showMaximumQuantity: maximum_quantity !== 0,
            maximumQuantity: maximum_quantity
        };
    }

    public addQuantity(e: TriggeredEvent): void {
        e.preventDefault();

        const $element = jQuery(e.target);
        const oldValue: any = $element
            .parent()
            .find('input')
            .val();
        const newVal = parseFloat(<any>oldValue) + 1;

        $element
            .parent()
            .find('input')
            .val(newVal);
    }

    public subQuantity(e: TriggeredEvent): void {
        e.preventDefault();

        const $element = jQuery(e.target);
        const oldValue = $element
            .parent()
            .find('input')
            .val();
        let newVal = parseFloat(<any>oldValue) - 1;

        newVal = Math.max(1, newVal);

        $element
            .parent()
            .find('input')
            .val(newVal);
    }
}
