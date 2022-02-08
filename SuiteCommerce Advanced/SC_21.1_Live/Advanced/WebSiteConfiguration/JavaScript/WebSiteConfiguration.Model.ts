/*
	© 2020 NetSuite Inc.
	User may not copy, modify, distribute, or re-bundle or otherwise make available this code;
	provided, however, if you are an authorized user with a NetSuite account or log-in, you
	may use this code subject to the terms that govern your access and use.
*/

/// <amd-module name="WebSiteConfiguration.Model"/>

import * as Utils from '../../../Commons/Utilities/JavaScript/Utils';

import { Model } from '../../../Commons/Core/JavaScript/Model';
import { SmtDomain } from '../../../ServiceContract/SC/CMSAdapter/CMSAdapter';

// TODO: We should extend of CachedModel once available
export class WebSiteConfigurationModel extends Model<SmtDomain[]> {
    public urlRoot = () => Utils.getAbsoluteUrl('services/WebSiteConfiguration.ss', true);
}
