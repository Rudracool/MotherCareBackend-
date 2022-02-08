/**

	© 2020 NetSuite Inc.
	User may not copy, modify, distribute, or re-bundle or otherwise make available this code;
	provided, however, if you are an authorized user with a NetSuite account or log-in, you
	may use this code subject to the terms that govern your access and use.


 * @NApiVersion 2.x
 * @NModuleScope TargetAccount
 */

import * as log from 'N/log';
import { CacheDuration } from 'N/http';
import { SCAServiceController } from '../Libraries/Controller/SCAServiceController';
import { ServiceContext } from '../../Common/Controller/ServiceController';
import { HttpResponse } from '../../Common/Controller/HttpResponse';
import { getConfiguredDomains } from './WebSiteConfiguration.Handler';
import { SmtDomain } from '../../../ServiceContract/SC/CMSAdapter/CMSAdapter';

class WebSiteConfigurationServiceController extends SCAServiceController {
    public readonly name = 'WebSiteConfiguration.ServiceController2';

    public get(): HttpResponse<SmtDomain[]> {
        const smtDomains = getConfiguredDomains();
        return new HttpResponse(smtDomains, {
            cache: CacheDuration.SHORT
        });
    }
}

export = {
    service: function(ctx: ServiceContext): void {
        new WebSiteConfigurationServiceController(ctx).initialize();
    }
};