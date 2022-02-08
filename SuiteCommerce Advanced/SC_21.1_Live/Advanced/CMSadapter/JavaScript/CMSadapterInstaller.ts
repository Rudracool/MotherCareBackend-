/*
	© 2020 NetSuite Inc.
	User may not copy, modify, distribute, or re-bundle or otherwise make available this code;
	provided, however, if you are an authorized user with a NetSuite account or log-in, you
	may use this code subject to the terms that govern your access and use.
*/

/// <amd-module name="CMSadapterInstaller"/>

import { Configuration } from '../../SCA/JavaScript/Configuration';
import { CMSadapter3 } from './CMSadapter.v3';

import CMSadapter2 = require('./CMSadapter.v2');

// @module CMSadapterInstaller

// @class CMSadapterInstaller responsible of initializing the
// CMSAdapter depending on the configured CMS version.
export function mountToApp(application) {
    const cms_adapter_version = Configuration.get('cms.adapterVersion');
    let cms_adapter = null;

    switch (cms_adapter_version) {
        case '2':
            cms_adapter = CMSadapter2;
            break;

        case '3':
            cms_adapter = new CMSadapter3();
            break;
    }

    if (cms_adapter) {
        return cms_adapter.mountAdapter(application);
    }
}
