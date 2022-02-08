/*
	© 2020 NetSuite Inc.
	User may not copy, modify, distribute, or re-bundle or otherwise make available this code;
	provided, however, if you are an authorized user with a NetSuite account or log-in, you
	may use this code subject to the terms that govern your access and use.
*/

/// <amd-module name = "Application"/>

import * as _ from 'underscore';
import * as jQuery from '../../Core/JavaScript/jQuery';
import * as Backbone from '../../Core/JavaScript/backbone/BackboneExtras';
import { DefaultEventEmitter, EventEmitter } from '../../Core/JavaScript/EventEmitter';
import { ComponentContainer } from '../../SC/JavaScript/ComponentContainer';
import { ApplicationLayout } from './ApplicationLayout';
import { setPathFromObject } from '../../Utilities/JavaScript/Utils';
import { Environment } from '../../Core/JavaScript/Environment';

import GenericLayoutComponent = require('./Generic.LayoutComponent');

interface ApplicationEvents {
    beforeStart: (app: Application) => void;
    afterModulesLoaded: (app: Application) => void;
    afterStart: (app: Application) => void;
}

export type Configuration = any;

export abstract class Application {
    private modulesMountToAppResult = [];
    private appPromises = [];
    private modules: any[];
    private readonly emitter: EventEmitter<ApplicationEvents> = new DefaultEventEmitter();
    protected configuration: any;
    // This is only to avoid break extensions in 20.2 release. Should be deleted asap
    protected Configuration: any;
    protected layout: ApplicationLayout;

    protected constructor() {
        // This is to avoid a circular dependency with Backbone.View.
        // getCurrent should be used instead.
        const SC = Environment.getSC();
        SC.Application = this;

        jQuery(window).on('hashchange', (): void => this.controlValidNavigation());
    }

    public abstract resizeImage(url: string, size: string): any;

    public abstract getKeyMapping(): any;

    public getConfig(): Configuration {
        return this.configuration;
    }

    /**
     * @deprecated
     */
    public setConfig(key: string, value: any): void {
        setPathFromObject(this.configuration, key, value);
    }

    public getLayout(): ApplicationLayout {
        return this.layout;
    }

    public waitForPromise(promise: JQuery.Deferred<any>): void {
        this.appPromises.push(promise);
    }

    /**
     * @deprecated
     */
    public trigger(event: any, ...args: any[]): void {
        this.emitter.emit(event, ...args);
    }

    /**
     * @deprecated
     */
    public on(event: any, listner: Function): void {
        this.emitter.on(event, listner);
    }

    /**
     * @deprecated
     */
    public once(event: any, listner?: Function): void {
        this.emitter.once(event, listner);
    }

    /**
     * @deprecated
     */
    public off(event: any, listner?: Function): void {
        this.emitter.off(event, listner);
    }

    public getEmitter(): EventEmitter<ApplicationEvents> {
        return this.emitter;
    }

    public start(modules: any[], done?: Function): void {
        this.emitter.emit('beforeStart', this);
        this.modules = modules;
        this.registerComponent(GenericLayoutComponent(this));

        // we mount each module to our application
        _.each(
            this.modules,
            (module: any): void => {
                if (module && _.isFunction(module.mountToApp)) {
                    try {
                        const mountToAppResult = module.mountToApp(this);
                        if (mountToAppResult && mountToAppResult.componentName) {
                            this.registerComponent(mountToAppResult);
                        } else {
                            this.modulesMountToAppResult.push(mountToAppResult);
                        }
                    } catch (error) {
                        console.error(error);
                    }
                }
            }
        );

        // This checks if you have registered modules
        if (!Backbone.history) {
            throw new Error(
                'No Backbone.Router has been initialized (Hint: Are your modules properly set?).'
            );
        }

        // @event afterModulesLoaded triggered after all modules have been loaded
        this.emitter.emit('afterModulesLoaded', this);

        jQuery.when(...this.appPromises).then(
            (): void => {
                if (done) {
                    done(this);
                }
                // @event afterStart triggered after the application
                // finish starting and after the start() callback is called.
                this.emitter.emit('afterStart', this);
                this.controlValidNavigation();
            }
        );
    }

    private controlValidNavigation(): void {
        // find a router for the current fragment
        if (!(<any>Backbone.history).started) {
            return;
        }

        const fragment = Backbone.history.getFragment();
        const match = _(Backbone.history.handlers).some(function(handler: any): boolean {
            return handler.callback && handler.route.exec(fragment);
        });

        // if not found a router for the current fragment the page not found is displayed.
        if (!match) {
            this.layout.notFound();
        }
    }

    public registerComponent(component: any): void {
        const componentContainer = ComponentContainer.getInstance();
        componentContainer.registerComponent(component);
    }

    public getComponent(componentName: string): any {
        const componentContainer = ComponentContainer.getInstance();
        return componentContainer.getComponent(componentName);
    }

    public isStandalone(): boolean {
        return false;
    }

    public isReorderEnabled(): boolean {
        return true;
    }
}
