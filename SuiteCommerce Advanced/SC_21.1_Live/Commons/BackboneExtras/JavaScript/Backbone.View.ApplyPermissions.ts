/*
	© 2020 NetSuite Inc.
	User may not copy, modify, distribute, or re-bundle or otherwise make available this code;
	provided, however, if you are an authorized user with a NetSuite account or log-in, you
	may use this code subject to the terms that govern your access and use.
*/

/// <amd-module name="Backbone.View.ApplyPermissions"/>

/// <reference path="../../Utilities/JavaScript/GlobalDeclarations.d.ts" />

import * as _ from 'underscore';
import * as jQuery from '../../Core/JavaScript/jQuery';

export function backboneViewApplyPermissions(template): string {
    if (!_.result(SC, 'isPageGenerator')) {
        // We need to wrap the template in a container so then we can find
        // and remove parent nodes also (jQuery.find only works in descendants).
        const $permissioned_elements = template.find('[data-permissions]');

        $permissioned_elements.each(function() {
            const $el = jQuery(this);
            const element_permission = $el.data('permissions');
            const perms = element_permission.split(/[\s,]+/);
            const perm_operator = $el.data('permissions-operator') || 'AND';
            let perm_eval;
            let perm_evaluation = perm_operator !== 'OR';

            _.each(perms, function(perm: any) {
                const perm_tokens = perm.split('.');

                perm_eval = !(
                    perm_tokens.length === 3 &&
                    perm_tokens[2] < 5 &&
                    SC.ENVIRONMENT.permissions &&
                    SC.ENVIRONMENT.permissions[perm_tokens[0]] &&
                    SC.ENVIRONMENT.permissions[perm_tokens[0]][perm_tokens[1]] < perm_tokens[2]
                );

                if (perm_operator === 'OR') {
                    perm_evaluation = perm_evaluation || perm_eval;
                } else {
                    perm_evaluation = perm_evaluation && perm_eval;
                }
            });

            if (!perm_evaluation) {
                $el.remove();
            }
        });
    }

    return template;
}
