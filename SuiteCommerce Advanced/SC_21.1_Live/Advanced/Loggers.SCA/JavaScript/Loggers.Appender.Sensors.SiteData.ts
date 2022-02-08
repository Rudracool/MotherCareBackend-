/*
	© 2020 NetSuite Inc.
	User may not copy, modify, distribute, or re-bundle or otherwise make available this code;
	provided, however, if you are an authorized user with a NetSuite account or log-in, you
	may use this code subject to the terms that govern your access and use.
*/

/// <amd-module name="Loggers.Appender.Sensors.SiteData"/>

import { Environment } from '../../../Commons/Core/JavaScript/Environment';
import { ComponentContainer } from '../../../Commons/SC/JavaScript/ComponentContainer';

interface Site {
    sitePage: string;
    siteFragment: string;
    sitePageDisplayName: string;
    siteUrl: string;
}
export function site(): Site {
    const componentContainer = ComponentContainer.getInstance();
    const pageType = componentContainer.getComponent('PageType');
    const context = pageType.getContext();
    const data = {
        sitePage: context.page_type,
        siteFragment: context.path,
        sitePageDisplayName: context.page_type_display_name,
        siteUrl: Environment.getSC().ENVIRONMENT.shoppingDomain
    };
    return data;
}
