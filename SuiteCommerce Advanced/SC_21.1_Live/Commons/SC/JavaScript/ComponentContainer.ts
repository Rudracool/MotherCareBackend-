/*
	© 2020 NetSuite Inc.
	User may not copy, modify, distribute, or re-bundle or otherwise make available this code;
	provided, however, if you are an authorized user with a NetSuite account or log-in, you
	may use this code subject to the terms that govern your access and use.
*/

/// <amd-module name="ComponentContainer"/>

import * as _ from 'underscore';

export class ComponentContainer {
    private static instance;
    private components = {};

    public registerComponent(component: any): void {
        if (component && component.componentName) {
            this.components[component.componentName] = this.sealComponent(
                component,
                component.componentName
            );
            return;
        }
        const error = new Error(
            'Invalid component parameter, make sure you specify a componentName property and getProxy method'
        );
        error.name = 'INVALID_PARAM';
        throw error;
    }

    public getComponent(component_name: string): any {
        return this.components[component_name] || null;
    }

    private sealComponent(component: any, component_name: any): any {
        try {
            _.each(component, function(value, prop) {
                Object.defineProperty(component, prop, {
                    get: function() {
                        return value;
                    },
                    set: function() {
                        throw new Error(
                            `You cannot override property ${prop} of component ${component_name}`
                        );
                    }
                });
            });
        } catch (e) {
            console.error(e);
        }

        return component;
    }

    public static getInstance() {
        this.instance = this.instance || new ComponentContainer();
        return this.instance;
    }
}
