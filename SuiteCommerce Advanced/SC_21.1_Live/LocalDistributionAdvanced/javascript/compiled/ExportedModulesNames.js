/*
    © 2020 NetSuite Inc.
    User may not copy, modify, distribute, or re-bundle or otherwise make available this code;
    provided, however, if you are an authorized user with a NetSuite account or log-in, you
    may use this code subject to the terms that govern your access and use.
*/
define("ExportedModulesNames", ["require", "exports", "Loggers", "Utils"], function (require, exports, Loggers_1, Utils_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    function isModuleLoaded(moduleName) {
        if (SC.ENVIRONMENT.TEMPLATES_MODULE_NAMES) {
            SC.ENVIRONMENT.EXTENSIONS_JS_MODULE_NAMES = SC.ENVIRONMENT.EXTENSIONS_JS_MODULE_NAMES || [];
            var _a = SC.ENVIRONMENT, JS_MODULE_NAMES = _a.JS_MODULE_NAMES, TEMPLATES_MODULE_NAMES = _a.TEMPLATES_MODULE_NAMES, EXTENSIONS_JS_MODULE_NAMES = _a.EXTENSIONS_JS_MODULE_NAMES;
            return (JS_MODULE_NAMES.indexOf(moduleName) > -1 ||
                TEMPLATES_MODULE_NAMES.indexOf(moduleName) > -1 ||
                EXTENSIONS_JS_MODULE_NAMES.indexOf(moduleName) > -1);
        }
        try {
            var module = Utils_1.requireModules(moduleName);
            if (typeof module === 'object' && module.__esModule) {
                for (var property in module) {
                    if (module.hasOwnProperty(property) && typeof module[property] === 'function') {
                        setModuleName(module[property], moduleName);
                    }
                }
            }
            else if (typeof module === 'function') {
                setModuleName(module, moduleName);
            }
        }
        catch (e) {
            // console.log(`Couldn't load module ${moduleName} ${e}`);
            return false;
        }
        return true;
    }
    exports.isModuleLoaded = isModuleLoaded;
    if (!SC.ENVIRONMENT.TEMPLATES_MODULE_NAMES) {
        Loggers_1.Loggers.getLogger().info({ componentArea: 'REQUIRING_MODULE_FALLBACK_MODE' });
    }
    function setModuleName(module, name) {
        module._AMDModuleName = (module._AMDModuleName || []).concat([name]);
    }
});

//# sourceMappingURL=ExportedModulesNames.js.map
