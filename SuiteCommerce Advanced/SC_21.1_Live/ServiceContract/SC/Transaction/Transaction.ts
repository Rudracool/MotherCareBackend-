import { AddressBook } from '../AddressBook/AddressBook';
import { ReturnAuthorization } from '../ReturnAuthorization/ReturnAuthorization';
import { SuiteTax } from '../SuiteTax/SuiteTax';

export interface TransactionField {
    tranid?: string;
    recordtype?: string;
    internalid: string;
    name: string;
}

export interface Fulfillment {
    date: string;
    internalid: string;
    lines: {
        internalid: string;
        quantity: number;
    }[];
    shipaddress: string;
    shipmethod: string;
    status: TransactionField;
    trackingnumbers: string[];
}

export interface Transaction {
    recordtype: string;
    internalid: string;
    tranid: string;
    trandate: string;
    status: TransactionField;
    currency: TransactionField;
    amount: number;
    amount_formatted: string;
}

export interface OrderHistoryCommons extends TransactionRecord {
    adjustments?: TransactionAdjustment[];
    returnauthorizations: ReturnAuthorization[];
    origin: number;
    ismultishipto: boolean;
    receipts: Transaction[];
    paymentevent: {};
    isReturnable: boolean;
}

export interface TransactionRecord {
    recordtype?: string;
    addresses: AddressBook[];
    billaddress: string;
    createdfrom: TransactionField;
    internalid: string;
    lines: TransactionLine[];
    currency?: TransactionField;
    memo: string;
    options: { [name: string]: string };
    paymentmethods: TransactionPaymentMethod[];
    promocodes: Promocode[];
    purchasenumber: number | null;
    selected_currency?: SelectedCurrency;
    shipaddress: string;
    shipmethod: string;
    shipmethods: ShippingMethod[];
    status: TransactionField;
    trandate: string;
    tranid: string;
    summary: Summary;
    receipts?: Transaction[];
    taxesPerType?: SuiteTax[];
}

export interface TransactionFromRecord extends Transaction {
    memo: string;
    createdfrom: TransactionField;
    selected_currency: SelectedCurrency;
    summary: Summary;
    promocodes: Promocode[];
    paymentmethods: TransactionPaymentMethod[];
    purchasenumber: number;
    addresses: AddressBook[];
    shipaddress: string;
    billaddress: string;
    shipmethods: ShippingMethod[];
    shipmethod: string;
    lines: TransactionLine[];
    receipts: Transaction[];
    returnauthorizations: (Transaction & ReturnAuthorization)[];
    origin: number;
    fulfillments: Fulfillment[];
    ismultishipto: boolean;
    isReturnable: boolean;
    paymentevent: {};
    isCancelable: boolean;
    options: { [name: string]: string };
}

interface SelectedCurrency {
    internalid: string;
    symbol: string;
    code: string;
    name: string;
    currencyname: string;
    isdefault: string; // T or F
    symbolplacement: number;
}

export interface Summary {
    subtotal: number;
    subtotal_formatted: string;
    taxtotal: number;
    taxtotal_formatted: string;
    tax2total: number;
    tax2total_formatted: string;
    shippingcost: number;
    shippingcost_formatted: string;
    handlingcost: number;
    handlingcost_formatted: string;
    estimatedshipping: number;
    estimatedshipping_formatted: string;
    taxonshipping: number;
    taxonshipping_formatted: string;
    discounttotal: number;
    discounttotal_formatted: string;
    taxondiscount: number;
    taxondiscount_formatted: string;
    discountrate: number;
    discountrate_formatted: string;
    discountedsubtotal: number;
    discountedsubtotal_formatted: string;
    giftcertapplied: number;
    giftcertapplied_formatted: string;
    total: number;
    total_formatted: string;
}

export interface TransactionItem {
    isinactive: boolean;
    isinstock: boolean;
    isonline: boolean;
    matrixchilditems_detail: object;
    itemid: string;
    maximumquantity: number;
    minimumquantity: number;
    ispurchasable: boolean;
    ispricevisible: boolean;
    stockdescription: string;
    quantitypacked?: number;
    isfulfillable: boolean;
    isbackorderable: boolean;
    itemimages_detail: {
        media: {
            urls: [
                {
                    altimagetext: string;
                    url: string;
                }
            ];
        };
    };
    onlinecustomerprice_detail: {
        onlinecustomerprice_formatted: string;
        onlinecustomerprice: number;
    };
    internalid: number;
    isstorepickupallowed: boolean;
    showoutofstockmessage: boolean;
    quantityavailableforstorepickup_detail: {
        locations: {
            internalid: number;
            qtyavailableforstorepickup: number;
        }[];
    };
    itemtype: string;
    itemoptions_detail: {};
    outofstockmessage: string;
    displayname: string;
    storedisplayname?: string;
    storedisplayname2?: string;
    parent?: string;
    pricelevel1: number;
    pricelevel1_formatted: string;
    pricelevel2?: number;
    pricelevel2_formatted?: string;
    pricelevel3?: number;
    pricelevel3_formatted?: string;
    pricelevel4?: number;
    pricelevel4_formatted?: string;
    pricelevel5?: number;
    pricelevel5_formatted?: string;
    urlcomponent: string;
    type?: string;
}

export interface TransactionOption {
    cartOptionId: string;
    label: string;
    value: {
        label?: string;
        internalid: string;
    };
    ismandatory: boolean;
}

export interface TransactionLine {
    internalid: string;
    quantity: number;
    rate: number;
    amount: number;
    tax_amount: number;
    tax_rate: string;
    tax_code: string;
    isfulfillable: boolean;
    location: string;
    discount: number;
    total: number;
    item: Partial<TransactionItem>;
    type: string;
    options: TransactionOption[];
    shipaddress: string;
    shipmethod: string;
    index: number;
    free_gift: boolean;
    discount_name?: string;
    rate_formatted: string;
    amount_formatted: string;
    tax_amount_formatted: string;
    fulfillmentChoice?: string;
    discount_formatted: string;
    total_formatted: string;
    quantityfulfilled: number;
    quantitypacked: number;
    quantitypicked: number;
    quantitybackordered: number;
    reason?: string;
    linegroup: string;
}

export interface TransactionAdjustment {
    internalid: string;
    total: string;
    tranid: string;
    trandate: string;
    paymentmethodstring: string;
    paymentmethod: TransactionPaymentMethod;
    ccnumber: string;
    ccexpdate: string;
    ccholdername: string;
    type: string;
    recordtype: string;
    amount: string;
    amount_formatted: string;
}

export interface Promocode {
    internalid: string;
    code: string;
    isvalid: boolean;
    discountrate_formatted: string;
}

export interface ShippingMethod {
    internalid: string;
    name: string;
    rate: number;
    rate_formatted: string;
    shipcarrier: string;
}

export interface TransactionPaymentMethod {
    terms?: {
        internalid: string;
    };
    type: string;
    returnurl?: string;
    creditcard: {
        ccnumber: string;
        ccexpiredate: string;
        ccname: string;
        internalid?: string;
        ccsecuritycode?: string;
        paymentmethod: {
            ispaypal: string; // T or F
            name: string;
            creditcard: string; // T or F
            internalid: string;
            merchantid?: string;
        };
    };
    primary?: boolean;
    internalid: string;
    purchasenumber?: string;
    merchantid?: string;
    name: string;
    paymentterms?: TransactionField;
}
