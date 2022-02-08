/**

	© 2020 NetSuite Inc.
	User may not copy, modify, distribute, or re-bundle or otherwise make available this code;
	provided, however, if you are an authorized user with a NetSuite account or log-in, you
	may use this code subject to the terms that govern your access and use.


 * @NApiVersion 2.x
 * @NModuleScope TargetAccount
 */

import * as log from 'N/log';
import { SearchOptions, TransactionFilterList } from '../Transaction/Transaction.Handler';
import { Search } from '../../Common/SearchRecord/Search';
import {
    Fulfillment,
    Transaction,
    OrderHistoryCommons,
    TransactionField,
    TransactionLine
} from '../../../ServiceContract/SC/Transaction/Transaction';
import { Listable } from '../../../ServiceContract/SC/Listable';
import { SalesOrderDao } from './RecordAccess/Salesorder.Dao';
import { SalesOrderSchema } from './RecordAccess/Salesorder.Schema';
import BigNumber from '../../third_parties/bignumber';
import { Address } from '../Libraries/Address/Address';
import { SearchFilter } from '../../Common/SearchRecord/SearchFilter';
import { SearchOperator } from '../../Common/SearchRecord/SearchOperator';
import { SalesOrder } from '../../../ServiceContract/SC/Salesorder/SalesOrder';
import { HttpClient, HttpHeaders } from '../../Common/HttpClient/HttpClient';
import { OrderHistory } from '../../../ServiceContract/SC/OrderHistory/OrderHistory';
import { WebsiteSetting } from '../../Common/Website/Website';
import { OrderHistoryHandler } from '../OrderHistory/OrderHistory.Handler';
import { Format } from '../../Common/Format/Format';

enum FulfillmentChoices {
    SHIP = '1',
    PICKUP = '2',
    SHIPTEXT = 'ship',
    PICKUPTEXT = 'pickup'
}

interface FullfillmentSearchResult {
    line: string;
    internalid: string;
    quantityshiprecv: string;
    date: string;
    shipmethod: string;
    trackingnumbers: string[];
    quantityuom: string;
    status: TransactionField;
    lines?: { internalid: string; quantity: number }[];
    quantity: number;
    item: string;
    shipto: string;
    trandate: string;
    shipaddress: string;
    shipaddress1: string;
    shipaddress2: string;
    shipaddressee: string;
    shipattention: string;
    shipcity: string;
    shipcountry: string;
    shipstate: string;
    shipzip: string;
    quantitypicked: string;
    quantitypacked: string;
}

export class SalesOrderHandler extends OrderHistoryHandler<SalesOrderSchema> {
    protected customColumnsKey = 'orderHistory';

    protected dao: SalesOrderDao = new SalesOrderDao();

    protected query: Search<OrderHistory> = this.dao.createSearch<OrderHistory>();

    protected schema: SalesOrderSchema = this.dao.getSchema();

    private pickPackShipIsEnabled: boolean = this.runtime.isFeatureInEffect('PICKPACKSHIP');

    private isPickupInStoreEnabled: boolean =
        this.configuration.get('isPickupInStoreEnabled') &&
        this.runtime.isFeatureInEffect('STOREPICKUP');

    protected format = Format.getInstance();

    protected addColumns(): void {
        super.addColumns();
        this.query.addColumn(this.schema.columns.trackingnumbers, {
            trackingnumbers: (value: string): string[] => value && value.split('<BR>')
        });
        if (this.isSCISIntegrationEnabled) {
            this.query.addColumn(this.schema.columns.formulatext, { origin: Number });
        }
    }

    protected getFilters(options: SearchOptions): Partial<TransactionFilterList> {
        const filterMap = super.getFilters(options);
        const { filters } = this.schema;
        const [filter] = options.filter || [null];

        if (filter === 'status:open') {
            filterMap.typeOperator = SearchOperator.Logical.AND;
            filterMap.type = new SearchFilter(filters.type, SearchOperator.Array.ANYOF, [
                'SalesOrd'
            ]);
            filterMap.statusOperator = SearchOperator.Logical.AND;
            filterMap.status = new SearchFilter(filters.status, SearchOperator.Array.ANYOF, [
                'SalesOrd:A',
                'SalesOrd:B',
                'SalesOrd:D',
                'SalesOrd:E',
                'SalesOrd:F'
            ]);
        } else if (this.isSCISIntegrationEnabled) {
            const scisFilter = [
                SearchOperator.Logical.AND,
                new SearchFilter(filters.createdfromtype, SearchOperator.Array.NONEOF, [
                    'SalesOrd'
                ]),
                SearchOperator.Logical.AND,
                new SearchFilter(
                    this.schema.joins.location.filters.locationtype,
                    SearchOperator.String.IS,
                    this.configuration.get('locationTypeMapping.store.internalid')
                ),
                SearchOperator.Logical.AND,
                new SearchFilter(filters.source, SearchOperator.Array.ANYOF, ['@NONE@', 'SCIS'])
            ];

            if (filter === 'origin:instore') {
                // SCIS Integration enabled, only In Store
                // records (Including Sales Orders from SCIS)
                filterMap.scisrecordsOperator = SearchOperator.Logical.AND;
                scisFilter.unshift(
                    new SearchFilter(filters.type, SearchOperator.Array.ANYOF, [
                        'CashSale',
                        'CustInvc',
                        'SalesOrd'
                    ])
                );
                filterMap.scisrecords = scisFilter;
            } else {
                // SCIS Integration enabled, all records
                delete filterMap.typeOperator;
                delete filterMap.type;
                filterMap.scisrecordsOperator = SearchOperator.Logical.AND;
                scisFilter.unshift(
                    new SearchFilter(filters.type, SearchOperator.Array.ANYOF, [
                        'CashSale',
                        'CustInvc'
                    ])
                );
                filterMap.scisrecords = [
                    scisFilter,
                    SearchOperator.Logical.OR,
                    new SearchFilter(filters.type, SearchOperator.Array.ANYOF, ['SalesOrd'])
                ];
            }
        } else {
            // SCIS Integration is disabled, show all the Sales Orders
            filterMap.typeOperator = SearchOperator.Logical.AND;
            filterMap.type = new SearchFilter(filters.type, SearchOperator.Array.ANYOF, [
                'SalesOrd'
            ]);
        }

        const email: string = this.user.getEmail();
        const siteSettings = this.runtime
            .getCurrentWebsite()
            .getSiteSettings([WebsiteSetting.cartsharingmode]);
        if (siteSettings && siteSettings.cartsharingmode === 'PER_CONTACT' && email) {
            filterMap.emailOperator = SearchOperator.Logical.AND;
            filterMap.email = new SearchFilter(filters.email, SearchOperator.String.IS, email);
        }

        return filterMap;
    }

    private removePrices(line: TransactionLine): TransactionLine {
        delete line.item.onlinecustomerprice_detail;
        delete line.item.pricelevel1;
        delete line.item.pricelevel2;
        delete line.item.pricelevel3;
        delete line.item.pricelevel4;
        delete line.item.pricelevel5;
        delete line.item.pricelevel1_formatted;
        delete line.item.pricelevel2_formatted;
        delete line.item.pricelevel3_formatted;
        delete line.item.pricelevel4_formatted;
        delete line.item.pricelevel5_formatted;

        return line;
    }

    public getSalesOrder(
        id: string,
        options: Listable<Transaction> & { recordtype?: string }
    ): SalesOrder {
        const transactionCommons: OrderHistoryCommons = super.get(id, options);
        const statusId = this.currentLoadedRecord.getValue(this.schema.fields.statusRef);
        const salesOrder: SalesOrder = {
            ...transactionCommons,
            fulfillments: [],
            isCancelable: transactionCommons.status.internalid === 'pendingApproval',
            isReturnable:
                statusId !== 'pendingFulfillment' &&
                statusId !== 'pendingApproval' &&
                statusId !== 'closed' &&
                statusId !== 'cancelled'
        };

        salesOrder.fulfillments = this.getSalesOrderFulfillments(salesOrder);

        const itemSublist = this.schema.sublists.item;
        for (let i = 0; i < salesOrder.lines.length; i++) {
            let lineGroupId = '';
            const item_fulfillment_choice = this.currentLoadedRecord.getSublistValue<string>(
                itemSublist.fields.itemfulfillmentchoice,
                salesOrder.lines[i].index - 1
            );
            salesOrder.lines[i].location = this.currentLoadedRecord.getSublistValue<string>(
                itemSublist.fields.location,
                salesOrder.lines[i].index - 1
            );
            if (item_fulfillment_choice) {
                if (item_fulfillment_choice === FulfillmentChoices.SHIP) {
                    salesOrder.lines[i].fulfillmentChoice = FulfillmentChoices.SHIPTEXT;
                } else if (item_fulfillment_choice === FulfillmentChoices.PICKUP) {
                    salesOrder.lines[i].fulfillmentChoice = FulfillmentChoices.PICKUPTEXT;
                }
            }
            if (
                (this.isPickupInStoreEnabled &&
                    salesOrder.lines[i].fulfillmentChoice === FulfillmentChoices.PICKUPTEXT) ||
                (!salesOrder.ismultishipto &&
                    (!salesOrder.lines[i].isfulfillable || !salesOrder.shipaddress)) ||
                (salesOrder.ismultishipto &&
                    (!salesOrder.lines[i].shipaddress || !salesOrder.lines[i].shipmethod))
            ) {
                lineGroupId =
                    (this.isSCISIntegrationEnabled && salesOrder.origin === 1) ||
                    (this.isPickupInStoreEnabled &&
                        salesOrder.lines[i].fulfillmentChoice === FulfillmentChoices.PICKUPTEXT)
                        ? 'instore'
                        : 'nonshippable';
            } else {
                lineGroupId = 'shippable';
            }

            if (!salesOrder.lines[i].item.ispricevisible) {
                salesOrder.lines[i] = this.removePrices(salesOrder.lines[i]);
            }

            salesOrder.lines[i].linegroup = lineGroupId;
        }

        const appliedToTransaction: string[] = _(
            _.where(salesOrder.receipts || [], { recordtype: 'invoice' })
        ).pluck('internalid');
        if (appliedToTransaction && appliedToTransaction.length) {
            salesOrder.adjustments = this.getRecordAdjustments(
                {
                    paymentMethodInformation: true,
                    appliedToTransaction
                },
                salesOrder.internalid
            );
        }

        return salesOrder;
    }

    private getFulfillments(id: number): FullfillmentSearchResult[] {
        const { filters, columns, joins } = this.schema;
        const search = this.dao.createSearch<FullfillmentSearchResult>();
        search.setFilters([
            new SearchFilter(filters.internalid, SearchOperator.String.IS, id),
            SearchOperator.Logical.AND,
            new SearchFilter(filters.mainline, SearchOperator.String.IS, 'F'),
            SearchOperator.Logical.AND,
            new SearchFilter(filters.shipping, SearchOperator.String.IS, 'F'),
            SearchOperator.Logical.AND,
            new SearchFilter(filters.taxline, SearchOperator.String.IS, 'F')
        ]);
        const fulfilling = joins.fulfillingtransaction.columns;
        search.addColumn(columns.line);
        search.addColumn(columns.fulfillingtransaction, { internalid: this.format.toValue });
        search.addColumn(columns.quantityshiprecv);
        search.addColumn(columns.actualshipdate, { date: this.format.toValue });
        search.addColumn(columns.quantity, { quantity: Number });
        search.addColumn(fulfilling.item, { item: this.format.toValue });
        search.addColumn(fulfilling.shipmethod, { shipmethod: this.format.toValue });
        search.addColumn(fulfilling.shipto, { shipto: this.format.toValue });
        search.addColumn(fulfilling.trackingnumbers, {
            trackingnumbers: (value: string): string[] => (value ? value.split('<BR>') : null)
        });
        search.addColumn(fulfilling.trandate, { trandate: this.format.toValue });
        search.addColumn(fulfilling.status, { status: this.toTransactionField });
        search.addColumn(fulfilling.shipaddress, { shipaddress: this.format.toValue });
        search.addColumn(fulfilling.shipaddress1, { shipaddress1: this.format.toValue });
        search.addColumn(fulfilling.shipaddress2, { shipaddress2: this.format.toValue });
        search.addColumn(fulfilling.shipaddressee, { shipaddressee: this.format.toValue });
        search.addColumn(fulfilling.shipattention, { shipattention: this.format.toValue });
        search.addColumn(fulfilling.shipcity, { shipcity: this.format.toValue });
        search.addColumn(fulfilling.shipcountry, { shipcountry: this.format.toValue });
        search.addColumn(fulfilling.shipstate, { shipstate: this.format.toValue });
        search.addColumn(fulfilling.shipzip, { shipzip: this.format.toValue });

        if (this.pickPackShipIsEnabled) {
            search.addColumn(columns.quantitypicked);
            search.addColumn(columns.quantitypacked);
        }
        if (this.runtime.isFeatureInEffect('UNITSOFMEASURE')) {
            search.addColumn(columns.quantityuom);
        }
        const results: FullfillmentSearchResult[] = search.getAll();
        results.forEach(
            (result): void => {
                const fulfillmentAddress: Address = new Address({
                    country: result.shipcountry,
                    state: result.shipstate,
                    city: result.shipcity,
                    zip: result.shipzip,
                    addr1: result.shipaddress1,
                    addr2: result.shipaddress2,
                    attention: result.shipattention,
                    addressee: result.shipaddressee
                });
                result.shipaddress = fulfillmentAddress.getId();
            }
        );
        return results;
    }

    private getSalesOrderFulfillments(salesOrder: SalesOrder): Fulfillment[] {
        const fulfillments = this.getFulfillments(Number(salesOrder.internalid));
        fulfillments.forEach(
            (fulfillment): void => {
                const lineId = `${salesOrder.internalid}_${fulfillment.line}`;
                const quantity = new BigNumber(fulfillment.quantity);
                const zero = new BigNumber(0);
                const fulfillmentId = fulfillment.internalid;

                if (fulfillmentId) {
                    const addr: Address = new Address({
                        country: fulfillment.shipcountry,
                        state: fulfillment.shipstate,
                        city: fulfillment.shipcity,
                        zip: fulfillment.shipzip,
                        addr1: fulfillment.shipaddress1,
                        addr2: fulfillment.shipaddress2,
                        attention: fulfillment.shipaddressee,
                        addressee: fulfillment.shipaddressee
                    });
                    if (addr.getId()) {
                        salesOrder.addresses.push(addr.getAddressBook());
                    }
                    const existingFullfilment: FullfillmentSearchResult = _.findWhere(
                        fulfillments,
                        { internalid: fulfillment.internalid }
                    );

                    if (existingFullfilment) {
                        existingFullfilment.lines = existingFullfilment.lines || [];
                        existingFullfilment.lines.push({
                            internalid: lineId,
                            quantity: Number(quantity)
                        });
                    }

                    if (!salesOrder.fulfillments[fulfillmentId]) {
                        const newFulfillment: Fulfillment = {
                            internalid: fulfillmentId,
                            date: fulfillment.date,
                            lines: fulfillment.lines,
                            shipaddress: fulfillment.shipaddress,
                            shipmethod: fulfillment.shipmethod,
                            status: fulfillment.status,
                            trackingnumbers: fulfillment.trackingnumbers
                        };

                        salesOrder.fulfillments[fulfillmentId] = newFulfillment;
                    }
                }

                const existingLine: TransactionLine = _.findWhere(salesOrder.lines, {
                    internalid: lineId
                });

                if (existingLine) {
                    const quantityUom = fulfillment.quantityuom
                        ? new BigNumber(fulfillment.quantityuom)
                        : new BigNumber(0);
                    const quantityFulfilled = new BigNumber(fulfillment.quantityshiprecv);
                    const quantityPicked = new BigNumber(fulfillment.quantitypicked);
                    const quantityPacked = new BigNumber(fulfillment.quantitypacked);
                    const conversionUnits =
                        quantity.gt(zero) && quantityUom.gt(zero)
                            ? quantity.dividedBy(quantityUom)
                            : new BigNumber(1);
                    existingLine.quantityfulfilled = quantityFulfilled;

                    let existingLineQuantityPacked: typeof BigNumber;
                    let existingLineQuantityPicked: typeof BigNumber;
                    let existingLineQuantitybackordered: typeof BigNumber;
                    if (
                        existingLine.fulfillmentChoice &&
                        existingLine.fulfillmentChoice === 'pickup'
                    ) {
                        existingLineQuantityPicked = this.pickPackShipIsEnabled
                            ? quantityPicked.minus(quantityFulfilled)
                            : zero;
                        existingLineQuantitybackordered = quantity
                            .minus(quantityFulfilled)
                            .minus(existingLineQuantityPicked);
                    } else {
                        existingLineQuantityPacked = this.pickPackShipIsEnabled
                            ? quantityPacked.minus(quantityFulfilled)
                            : zero;
                        existingLineQuantityPicked = this.pickPackShipIsEnabled
                            ? quantityPicked
                                  .minus(existingLineQuantityPacked)
                                  .minus(quantityFulfilled)
                            : zero;
                        existingLineQuantitybackordered = quantity
                            .minus(quantityFulfilled)
                            .minus(existingLineQuantityPacked)
                            .minus(existingLineQuantityPicked);
                        existingLineQuantityPacked = existingLineQuantitybackordered
                            .dividedBy(conversionUnits)
                            .toNumber();
                    }

                    existingLine.quantityfulfilled = quantityFulfilled
                        .dividedBy(conversionUnits)
                        .toNumber();
                    existingLine.quantitypicked = existingLineQuantityPicked
                        .dividedBy(conversionUnits)
                        .toNumber();
                    existingLine.quantitybackordered = existingLineQuantitybackordered
                        .dividedBy(conversionUnits)
                        .toNumber(); // Add big number type here
                }
            }
        );

        return _.values(salesOrder.fulfillments);
    }

    public updateStatus(id: number, status: string, headers: HttpHeaders): string {
        let result = 'OK';

        if (status === 'cancelled') {
            const url = `https://${this.runtime.getHost()}/app/accounting/transactions/salesordermanager.nl?type=cancel&xml=T&id=${id}`;
            const cancelResponse = new HttpClient().get(url, headers);

            if (cancelResponse.code === 206) {
                const fields = Search.lookupFields<{ statusRef: { value: string } }>(
                    [this.schema.columns.statusRef],
                    this.schema.type,
                    id
                );
                result =
                    fields.statusRef && fields.statusRef.value !== 'cancelled'
                        ? 'ERR_ALREADY_APPROVED_STATUS'
                        : 'ERR_ALREADY_CANCELLED_STATUS';
            }
        }

        return result;
    }
}