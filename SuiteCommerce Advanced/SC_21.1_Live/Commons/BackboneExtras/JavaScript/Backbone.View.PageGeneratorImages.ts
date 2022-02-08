/*
	© 2020 NetSuite Inc.
	User may not copy, modify, distribute, or re-bundle or otherwise make available this code;
	provided, however, if you are an authorized user with a NetSuite account or log-in, you
	may use this code subject to the terms that govern your access and use.
*/

/// <amd-module name="Backbone.View.PageGeneratorImages"/>
/// <reference path="../../Utilities/JavaScript/GlobalDeclarations.d.ts" />

import { Environment } from '../../Core/JavaScript/Environment';

export function backboneViewPageGeneratorImages(tmpl_str) {
    const SC = Environment.getSC();
    if (SC.isPageGenerator()) {
        return tmpl_str.replace(
            /(<img\s+[^>]*>\s*<\/img>|<img\s+[^>]*\/>|(?:<img\s+[^>]*>)(?!\s*<\/img>))(?!\s*<\s*\/noscript\s*>)/gim,
            '<noscript>$1</noscript>'
        );
    }

    return tmpl_str;
}
