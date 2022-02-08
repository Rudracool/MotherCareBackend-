/*
	© 2020 NetSuite Inc.
	User may not copy, modify, distribute, or re-bundle or otherwise make available this code;
	provided, however, if you are an authorized user with a NetSuite account or log-in, you
	may use this code subject to the terms that govern your access and use.
*/

import { TransactionLine, TransactionRecord, Transaction } from '../Transaction/Transaction';

export interface ReturnAuthorization extends Transaction {
    rate?: number;
    rate_formatted?: string;
    tax_amount?: number;
    tax_amount_formatted?: string;
    quantity?: number;
    item?: string;
    itemid?: string;
    type?: string;
    parent?: string;
    displayname?: string;
    id?: string;
    storedisplayname?: string;
    line?: string;
    lines?: TransactionLine[];
    options?: { [name: string]: string };
}

export interface ReturnAuthorizationFromRecord extends TransactionRecord {
    amountpaid: number;
    amountpaid_formatted: string;
    amountremaining: number;
    amountremaining_formatted: string;
    applies: Apply[];
    isCancelable: boolean;
}

export interface Apply {
    line: number;
    internalid: string;
    tranid: string;
    applydate: string;
    recordtype: string;
    currency: string;
    amount: number;
    amount_formatted: string;
}
