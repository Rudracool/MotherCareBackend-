/**

	© 2020 NetSuite Inc.
	User may not copy, modify, distribute, or re-bundle or otherwise make available this code;
	provided, however, if you are an authorized user with a NetSuite account or log-in, you
	may use this code subject to the terms that govern your access and use.


 * @NApiVersion 2.x
 * @NModuleScope TargetAccount
 */

import { InvoicesDao } from './RecordAccess/Invoices.Dao';
import { InvoiceSchema } from './RecordAccess/Invoice.Schema';
import { Search } from '../../Common/SearchRecord/Search';
import { Transaction, TransactionLine } from '../../../ServiceContract/SC/Transaction/Transaction';
import { Listable } from '../../../ServiceContract/SC/Listable';
import { OrderHistoryHandler } from '../OrderHistory/OrderHistory.Handler';
import { InvoiceOrderHistory } from '../../../ServiceContract/SC/Invoice/Invoice';

export class InvoicesHandler extends OrderHistoryHandler<InvoiceSchema> {
    protected customColumnsKey = 'Invoices';
    protected dao: InvoicesDao = new InvoicesDao();
    protected schema: InvoiceSchema = this.dao.getSchema();

    public getInvoiceOrder(
        id: string,
        options: Listable<Transaction> & { recordtype?: string }
    ): InvoiceOrderHistory {
        const invoice = super.get(id, options);
        const { fields } = this.schema;
        const location = this.currentLoadedRecord.getValue(fields.location);
        invoice.lines.forEach(
            (line: TransactionLine): void => {
                line.quantityfulfilled = line.quantity;
                line.location = location;
                line.linegroup = 'instore';
            }
        );
        const appliedToTransaction: string[] = [invoice.internalid];
        if (appliedToTransaction && appliedToTransaction.length) {
            invoice.adjustments = this.getRecordAdjustments(
                {
                    paymentMethodInformation: true,
                    appliedToTransaction
                },
                invoice.internalid
            );
        }
        return invoice;
    }
}