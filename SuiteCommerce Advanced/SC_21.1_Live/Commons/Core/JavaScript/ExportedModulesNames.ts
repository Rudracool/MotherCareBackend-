/*
	© 2020 NetSuite Inc.
	User may not copy, modify, distribute, or re-bundle or otherwise make available this code;
	provided, however, if you are an authorized user with a NetSuite account or log-in, you
	may use this code subject to the terms that govern your access and use.
*/

/// <amd-module name="ExportedModulesNames"/>
/// <reference path="../../Utilities/JavaScript/GlobalDeclarations.d.ts"/>

import { Loggers } from '../../Loggers/JavaScript/Loggers';
import { requireModules } from '../../Utilities/JavaScript/Utils';

export function isModuleLoaded(moduleName: string): boolean {
    if (SC.ENVIRONMENT.TEMPLATES_MODULE_NAMES) {
        SC.ENVIRONMENT.EXTENSIONS_JS_MODULE_NAMES = SC.ENVIRONMENT.EXTENSIONS_JS_MODULE_NAMES || [];
        const {
            JS_MODULE_NAMES,
            TEMPLATES_MODULE_NAMES,
            EXTENSIONS_JS_MODULE_NAMES
        } = SC.ENVIRONMENT;
        return (
            JS_MODULE_NAMES.indexOf(moduleName) > -1 ||
            TEMPLATES_MODULE_NAMES.indexOf(moduleName) > -1 ||
            EXTENSIONS_JS_MODULE_NAMES.indexOf(moduleName) > -1
        );
    }
    try {
        const module = requireModules(moduleName);
        if (typeof module === 'object' && module.__esModule) {
            for (let property in module) {
                if (module.hasOwnProperty(property) && typeof module[property] === 'function') {
                    setModuleName(module[property], moduleName);
                }
            }
        } else if (typeof module === 'function') {
            setModuleName(module, moduleName);
        }
    } catch (e) {
        // console.log(`Couldn't load module ${moduleName} ${e}`);
        return false;
    }
    return true;
}

if (!SC.ENVIRONMENT.TEMPLATES_MODULE_NAMES) {
    Loggers.getLogger().info({ componentArea: 'REQUIRING_MODULE_FALLBACK_MODE' });
}

interface AMDModuleFunction extends Function {
    _AMDModuleName?: string[];
}

function setModuleName(module: AMDModuleFunction, name: string): void {
    module._AMDModuleName = [...(module._AMDModuleName || []), ...[name]];
}
