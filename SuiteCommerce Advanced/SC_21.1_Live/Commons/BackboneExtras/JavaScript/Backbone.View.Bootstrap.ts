/*
	© 2020 NetSuite Inc.
	User may not copy, modify, distribute, or re-bundle or otherwise make available this code;
	provided, however, if you are an authorized user with a NetSuite account or log-in, you
	may use this code subject to the terms that govern your access and use.
*/

/// <amd-module name="Backbone.View.Bootstrap"/>

/// <reference path="../../Utilities/JavaScript/GlobalDeclarations.d.ts" />

import * as _ from 'underscore';

export function backboneViewBootstrap(_$el, view) {
    if (!_.result(SC, 'isPageGenerator')) {
        if (view.$('[data-toggle="tooltip"]').length != 0)
            view.$('[data-toggle="tooltip"]').tooltip({ html: true });
        view.$('[data-toggle="dropdown"]').dropdown();
        // view.$('[data-toggle="collapse"]').collapse();
    }
}
