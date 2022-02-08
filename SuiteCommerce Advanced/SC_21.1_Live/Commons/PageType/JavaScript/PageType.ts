/*
	© 2020 NetSuite Inc.
	User may not copy, modify, distribute, or re-bundle or otherwise make available this code;
	provided, however, if you are an authorized user with a NetSuite account or log-in, you
	may use this code subject to the terms that govern your access and use.
*/

/// <amd-module name="PageType"/>

import PageTypeComponent = require('./PageType.Component');

// @module PageType
// @class PageType @extends ApplicationModule

export function mountToApp(application) {
    return PageTypeComponent(application);
}
