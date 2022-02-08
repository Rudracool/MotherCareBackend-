import { Fulfillment, OrderHistoryCommons } from '../Transaction/Transaction';

export interface SalesOrder extends OrderHistoryCommons {
    fulfillments: Fulfillment[];
    isCancelable: boolean;
}
