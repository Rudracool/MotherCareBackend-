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

class InvoiceServiceController extends SCAServiceController {
    public name = 'InvoiceServiceController ';
}

export = {
    service(ctx: ServiceContext): void {
        new InvoiceServiceController(ctx).initialize();
    }
};