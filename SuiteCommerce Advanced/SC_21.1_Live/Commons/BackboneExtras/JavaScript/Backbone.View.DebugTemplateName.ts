/*
	© 2020 NetSuite Inc.
	User may not copy, modify, distribute, or re-bundle or otherwise make available this code;
	provided, however, if you are an authorized user with a NetSuite account or log-in, you
	may use this code subject to the terms that govern your access and use.
*/

/// <amd-module name="Backbone.View.DebugTemplateName"/>

import * as _ from 'underscore';
import * as Utils from '../../Utilities/JavaScript/Utils';

export function backboneViewDebugTemplateName(tmpl_str, view) {
    if (!_.result(SC, 'isPageGenerator')) {
        const template_name = view.template.Name;
        const prefix = Utils.isPageGenerator()
            ? ''
            : '\n\n<!-- TEMPLATE STARTS: ' + template_name + '-->\n';
        const posfix = Utils.isPageGenerator()
            ? ''
            : '\n<!-- TEMPLATE ENDS: ' + template_name + ' -->\n';

        tmpl_str = prefix + tmpl_str + posfix;

        // Fixing backward compatibility of templates due to a security fix on JQuery 3.5.0: https://blog.jquery.com/2020/04/10/jquery-3-5-0-released/
        tmpl_str = tmpl_str.replace(/>[\s\n\t\r]*</g, '><');
    }

    return tmpl_str;
}
