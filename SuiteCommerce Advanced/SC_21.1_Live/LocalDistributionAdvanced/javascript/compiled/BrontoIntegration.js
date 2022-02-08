/*
    © 2020 NetSuite Inc.
    User may not copy, modify, distribute, or re-bundle or otherwise make available this code;
    provided, however, if you are an authorized user with a NetSuite account or log-in, you
    may use this code subject to the terms that govern your access and use.
*/
define("BrontoIntegration", ["require", "exports", "jQuery", "Configuration"], function (require, exports, jQuery, Configuration_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    /*
    @class BrontoIntegration
    
    Loads Bronto Adapter script once on afterAppendView if it runs on the browser and the Bronto instanceId is set in the Configuration
    
    loadScript() appends the Bronto adapter script based on the configuration (instance id and adapter url). data-bronto-integrations attribute is set to the instance id
    mountToApp() runs only on the browser and if the Bronto account id is set, attaches the loadScript to once afterAppendView
    */
    // @property {String} instanceId
    exports.instanceId = '';
    // @property {String} adapterUrl
    exports.adapterUrl = '';
    // @method loadScript @return {Void}
    function loadScript() {
        jQuery('body').append(jQuery("<script src=\"" + this.adapterUrl + "\" data-bronto-integrations=\"" + this.instanceId + "\"></script>"));
    }
    exports.loadScript = loadScript;
    // @method mountToApp @return {Void}
    function mountToApp(application) {
        if (SC.ENVIRONMENT.jsEnvironment === 'browser') {
            var bronto_config = Configuration_1.Configuration.bronto;
            if (bronto_config && bronto_config.accountId) {
                this.instanceId = bronto_config.accountId;
                this.adapterUrl = bronto_config.adapterUrl;
                application.getLayout().once('afterAppendView', jQuery.proxy(this, 'loadScript'));
            }
        }
    }
    exports.mountToApp = mountToApp;
});

//# sourceMappingURL=BrontoIntegration.js.map
