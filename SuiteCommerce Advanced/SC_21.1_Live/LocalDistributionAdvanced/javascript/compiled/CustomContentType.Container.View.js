/*
    © 2020 NetSuite Inc.
    User may not copy, modify, distribute, or re-bundle or otherwise make available this code;
    provided, however, if you are an authorized user with a NetSuite account or log-in, you
    may use this code subject to the terms that govern your access and use.
*/
define("CustomContentType.Container.View", ["require", "exports", "custom_content_type_container.tpl", "Backbone.View"], function (require, exports, custom_content_type_container_tpl, BackboneView) {
    "use strict";
    return BackboneView.extend({
        template: custom_content_type_container_tpl,
        initialize: function initialize(options) {
            this.innerCustomContentType = options.innerCustomContentType;
            this.addChildViewInstances({
                'CCT-View': {
                    'CCT-View': {
                        childViewInstance: options.innerCustomContentType,
                        childViewIsExternal: true
                    }
                }
            });
        },
        getContextDataRequest: function () {
            if (this.innerCustomContentType) {
                return this.innerCustomContentType.getContextDataRequest();
            }
            return [];
        },
        setContextData: function (contextData) {
            if (this.innerCustomContentType) {
                if (this.cctSettings) {
                    this.innerCustomContentType.install(this.cctSettings, contextData);
                }
            }
        },
        getContextData: function (contextDataRequest) {
            if (this.innerCustomContentType) {
                return this.innerCustomContentType.getContextData(contextDataRequest);
            }
            return {};
        },
        validateContextDataRequest: function (contextData) {
            if (this.innerCustomContentType) {
                return this.innerCustomContentType.validateContextDataRequest(contextData);
            }
            return false;
        },
        // @method getContext
        // @return {CustomContentType.Container.View.Context}
        getContext: function getContext() {
            // @class CustomContentType.Container.View.Context
            return {
                // @property {String} instanceId
                instanceId: this.options.instanceId,
                // @property {String} classes
                classes: this.options.classes
            };
            // @class CustomContentType.Container.View
        }
    });
});

//# sourceMappingURL=CustomContentType.Container.View.js.map
