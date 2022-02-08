/**

	© 2020 NetSuite Inc.
	User may not copy, modify, distribute, or re-bundle or otherwise make available this code;
	provided, however, if you are an authorized user with a NetSuite account or log-in, you
	may use this code subject to the terms that govern your access and use.


 * @NApiVersion 2.x
 * @NModuleScope TargetAccount
 */

import { InvoiceSchema } from './Invoice.Schema';
import { TransactionDao } from '../../Transaction/RecordAccess/Transaction.Dao';

export class InvoicesDao extends TransactionDao<InvoiceSchema> {
    protected schema: InvoiceSchema = InvoiceSchema.getInstance();

    public constructor() {
        super();
        this.getSchema().columns.formulanumeric.formula = '{amountremaining} / {exchangerate}';
    }
}