/**

	© 2020 NetSuite Inc.
	User may not copy, modify, distribute, or re-bundle or otherwise make available this code;
	provided, however, if you are an authorized user with a NetSuite account or log-in, you
	may use this code subject to the terms that govern your access and use.


 * @NApiVersion 2.x
 * @NModuleScope TargetAccount
 */

import { requireLogin } from '../Libraries/Auth/Auth';
import { SCAServiceController } from '../Libraries/Controller/SCAServiceController';
import { ServiceContext } from '../../Common/Controller/ServiceController';
import { HttpResponse } from '../../Common/Controller/HttpResponse';
import { SuiteTaxHandler } from './SuiteTax.Handler';
import { SuiteTax } from '../../../ServiceContract/SC/SuiteTax/SuiteTax';

@requireLogin()
class SuiteTaxServiceController extends SCAServiceController {
    public name = 'SuiteTax.ServiceController2';

    private suiteTaxHandler: SuiteTaxHandler = new SuiteTaxHandler();

    public getById(internalid: string): HttpResponse<SuiteTax[]> {
        return new HttpResponse(this.suiteTaxHandler.getTaxesFromId(Number(internalid)));
    }
}

export = {
    service: function(ctx: ServiceContext): void {
        new SuiteTaxServiceController(ctx).initialize();
    },
    SuiteTaxServiceController
};