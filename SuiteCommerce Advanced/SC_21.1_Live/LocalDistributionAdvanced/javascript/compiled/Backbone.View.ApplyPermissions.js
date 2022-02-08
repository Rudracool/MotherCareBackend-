/*
    © 2020 NetSuite Inc.
    User may not copy, modify, distribute, or re-bundle or otherwise make available this code;
    provided, however, if you are an authorized user with a NetSuite account or log-in, you
    may use this code subject to the terms that govern your access and use.
*/
define("Backbone.View.ApplyPermissions", ["require", "exports", "underscore", "jQuery"], function (require, exports, _, jQuery) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    function backboneViewApplyPermissions(template) {
        if (!_.result(SC, 'isPageGenerator')) {
            // We need to wrap the template in a container so then we can find
            // and remove parent nodes also (jQuery.find only works in descendants).
            var $permissioned_elements = template.find('[data-permissions]');
            $permissioned_elements.each(function () {
                var $el = jQuery(this);
                var element_permission = $el.data('permissions');
                var perms = element_permission.split(/[\s,]+/);
                var perm_operator = $el.data('permissions-operator') || 'AND';
                var perm_eval;
                var perm_evaluation = perm_operator !== 'OR';
                _.each(perms, function (perm) {
                    var perm_tokens = perm.split('.');
                    perm_eval = !(perm_tokens.length === 3 &&
                        perm_tokens[2] < 5 &&
                        SC.ENVIRONMENT.permissions &&
                        SC.ENVIRONMENT.permissions[perm_tokens[0]] &&
                        SC.ENVIRONMENT.permissions[perm_tokens[0]][perm_tokens[1]] < perm_tokens[2]);
                    if (perm_operator === 'OR') {
                        perm_evaluation = perm_evaluation || perm_eval;
                    }
                    else {
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
    exports.backboneViewApplyPermissions = backboneViewApplyPermissions;
});

//# sourceMappingURL=Backbone.View.ApplyPermissions.js.map
