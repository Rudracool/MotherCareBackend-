/**

	© 2020 NetSuite Inc.
	User may not copy, modify, distribute, or re-bundle or otherwise make available this code;
	provided, however, if you are an authorized user with a NetSuite account or log-in, you
	may use this code subject to the terms that govern your access and use.


 * @NApiVersion 2.x
 * @NModuleScope TargetAccount
 */

import { SCAServiceController } from '../Libraries/Controller/SCAServiceController';
import { ServiceContext } from '../../Common/Controller/ServiceController';
import { OrderHistory } from '../../../ServiceContract/SC/OrderHistory/OrderHistory';
import Auth, { requireLogin, requirePermissions, Permission } from '../Libraries/Auth/Auth';
import { HttpResponse } from '../../Common/Controller/HttpResponse';
import { Listable } from '../../../ServiceContract/SC/Listable';
import { Transaction } from '../../../ServiceContract/SC/Transaction/Transaction';
import { PaginationResponse } from '../../../ServiceContract/SC/PaginationResponse';
import { SalesOrder } from '../../../ServiceContract/SC/Salesorder/SalesOrder';
import { SalesOrderHandler } from '../Salesorder/Salesorder.Handler';
import { InvoicesHandler } from '../Invoices/Invoices.Handler';
import { InvoiceOrderHistory } from '../../../ServiceContract/SC/Invoice/Invoice';
import { SalesOrderSchema } from '../Salesorder/RecordAccess/Salesorder.Schema';
import { InvoiceSchema } from '../Invoices/RecordAccess/Invoice.Schema';

@requireLogin()
@requirePermissions({
    [Permission.EDIT]: [
        Auth.getPermissions().transaction.tranFind,
        Auth.getPermissions().transaction.tranSalesOrd
    ]
})
class OrderHistoryServiceController extends SCAServiceController {
    public name = 'OrderHistory.ServiceController2';

    private salesOrderHandler: SalesOrderHandler = new SalesOrderHandler();

    public get(parameters: Listable<Transaction>): HttpResponse<PaginationResponse<Transaction>> {
        return new HttpResponse(this.salesOrderHandler.search(parameters));
    }

    public getById(
        internalid: string,
        parameters: Listable<Transaction> & { recordtype?: string }
    ): HttpResponse<SalesOrder | InvoiceOrderHistory> {
        let result: SalesOrder | InvoiceOrderHistory;
        if (parameters.recordtype === SalesOrderSchema.getInstance().type) {
            result = this.salesOrderHandler.getSalesOrder(internalid, parameters);
        } else if (parameters.recordtype === InvoiceSchema.getInstance().type) {
            const invoiceHandler: InvoicesHandler = new InvoicesHandler();
            result = invoiceHandler.getInvoiceOrder(internalid, parameters);
        }
        return new HttpResponse(result);
    }

    public put(
        body: { status: string },
        parameters: Listable<Transaction> & { internalid: string }
    ): HttpResponse<SalesOrder & { cancel_response?: string }> {
        const cancelResult = this.salesOrderHandler.updateStatus(
            Number(parameters.internalid),
            body.status,
            this.request.headers
        );
        const salesOrder = this.salesOrderHandler.getSalesOrder(parameters.internalid, parameters);
        const record = { ...salesOrder, cancel_response: cancelResult };

        return new HttpResponse(record);
    }
}

export = {
    service(ctx: ServiceContext): void {
        new OrderHistoryServiceController(ctx).initialize();
    }
};