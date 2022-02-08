/*
    © 2020 NetSuite Inc.
    User may not copy, modify, distribute, or re-bundle or otherwise make available this code;
    provided, however, if you are an authorized user with a NetSuite account or log-in, you
    may use this code subject to the terms that govern your access and use.
*/
define("Loggers.Appender.Sensors.Bundle", ["require", "exports"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    /// <reference path="../../../Commons/Utilities/JavaScript/GlobalDeclarations.d.ts" />
    function bundle() {
        var metadata = SC.ENVIRONMENT.RELEASE_METADATA || {};
        var data = {
            bundleId: metadata.prodbundle_id || '',
            bundleName: metadata.name || '',
            bundleVersion: metadata.version || '',
            buildNo: metadata.buildno || '',
            dateLabel: metadata.datelabel || '',
            baseLabel: metadata.baselabel || ''
        };
        return data;
    }
    exports.bundle = bundle;
});

//# sourceMappingURL=Loggers.Appender.Sensors.Bundle.js.map
