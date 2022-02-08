/**

	© 2020 NetSuite Inc.
	User may not copy, modify, distribute, or re-bundle or otherwise make available this code;
	provided, however, if you are an authorized user with a NetSuite account or log-in, you
	may use this code subject to the terms that govern your access and use.


 * @NApiVersion 2.x
 * @NModuleScope TargetAccount
 */

import { Search } from '../../Common/SearchRecord/Search';
import { ReturnAuthorizationHandler } from '../ReturnAuthorization/ReturnAuthorization.Handler';
import {
    Transaction,
    TransactionRecord,
    OrderHistoryCommons,
    TransactionField
} from '../../../ServiceContract/SC/Transaction/Transaction';
import { OrderHistory } from '../../../ServiceContract/SC/OrderHistory/OrderHistory';
import { ActiveRecord, RecordType } from '../../Common/ActiveRecord/ActiveRecord';
import { TransactionHandler } from '../Transaction/Transaction.Handler';
import { Listable } from '../../../ServiceContract/SC/Listable';
import { Schema } from '../../Common/Schema/Schema';
import { TransactionDao } from '../Transaction/RecordAccess/Transaction.Dao';

export class OrderHistoryHandler<OrderHistorySchema extends Schema> extends TransactionHandler<
    OrderHistorySchema
> {
    protected customColumnsKey = 'OrderHistory';

    protected dao: TransactionDao<OrderHistorySchema> = new TransactionDao();

    protected schema = this.dao.getSchema();

    protected currentRecordId: number;

    private getReturnAuthorizations(
        transaction: TransactionRecord,
        options: Listable<Transaction> & { recordtype?: string }
    ): Transaction[] {
        const createdFrom = _(transaction.receipts || []).pluck('internalid');

        createdFrom.push(transaction.internalid);
        return new ReturnAuthorizationHandler().search({
            ...options,
            createdfrom: createdFrom,
            getLines: true
        }).records;
    }

    private isSCISSource(source: string): boolean {
        return !source || source === 'SCIS';
    }

    private getOrigin(record: ActiveRecord, recordType: string, internalId: string) {
        let origin = 0;

        const source = record.getValue(this.schema.fields.source);
        const locationResult = Search.lookupFields<{ locationtype: { value: string } }>(
            [this.schema.joins.location.columns.locationtype],
            <RecordType>recordType,
            Number(internalId)
        );
        if (
            this.isSCISIntegrationEnabled &&
            this.isSCISSource(<string>source) &&
            record.getValue(this.schema.fields.location) &&
            locationResult.locationtype &&
            locationResult.locationtype.value ===
                this.configuration.get('locationTypeMapping.store.internalid')
        ) {
            origin = 1; // store
        } else if (source) {
            origin = 2; // online
        }
        return origin;
    }

    public get(
        id: string,
        options: Listable<Transaction> & { recordtype?: string }
    ): OrderHistoryCommons {
        this.currentRecordId = Number(id);
        const { fields } = this.schema;
        const transaction: TransactionRecord = super.get(id, options);

        const transactionCommons: OrderHistoryCommons = {
            ...transaction,
            returnauthorizations: this.getReturnAuthorizations(transaction, options),
            origin: this.getOrigin(
                this.currentLoadedRecord,
                this.schema.type.toString(),
                transaction.internalid
            ),
            ismultishipto: this.currentLoadedRecord.getValue<boolean>(fields.ismultishipto),
            receipts: super.search({
                createdfrom: transaction.internalid,
                filter: 'CustInvc,CashSale',
                order: 0,
                sort: null,
                from: null,
                to: null,
                page: null
            }).records,
            isReturnable: true,
            paymentevent:
                this.currentLoadedRecord.getValue(fields.paymethtype) === 'external_checkout'
                    ? {
                          holdreason: this.currentLoadedRecord.getValue(
                              fields.paymenteventholdreason
                          ),
                          redirecturl: this.generateUrl(
                              transaction.internalid,
                              this.schema.type.toString()
                          )
                      }
                    : {},
            recordtype: transaction.recordtype
                ? transaction.recordtype
                : this.schema.type.toString()
        };
        return transactionCommons;
    }

    protected getRecordTerms(): TransactionField {
        const fields = Search.lookupFields<{
            terms: { value: string; text: string };
        }>([this.schema.columns.terms], this.schema.type, this.currentRecordId);
        return (
            fields.terms &&
            fields.terms &&
            fields.terms.value && {
                internalid: fields.terms.value,
                name: fields.terms.text
            }
        );
    }
}