/*
	© 2020 NetSuite Inc.
	User may not copy, modify, distribute, or re-bundle or otherwise make available this code;
	provided, however, if you are an authorized user with a NetSuite account or log-in, you
	may use this code subject to the terms that govern your access and use.
*/

/// <amd-module name="CancelableEventEmitter"/>
// @Typescript-partial

import * as _ from 'underscore';
import * as jQuery from './jQuery';
import { deepCopy } from '../../Utilities/JavaScript/Utils';

type FunctionPropertyNames<T> = { [K in keyof T]: T[K] extends Function ? K : never }[keyof T];
type FunctionProperties<T> = Pick<T, FunctionPropertyNames<T>>;

export interface CancelableEventEmitter<T extends FunctionProperties<T>> {
    on<E extends FunctionPropertyNames<T>>(eventName: E, callback: T[E]);
    emit<E extends FunctionPropertyNames<T>>(
        eventName: E,
        ...args: Parameters<T[E]>
    ): JQuery.Promise<any>;
    emitUnsafe<E extends FunctionPropertyNames<T>>(
        eventName: E,
        ...args: Parameters<T[E]>
    ): JQuery.Promise<any>;
    off<E extends FunctionPropertyNames<T>>(eventName: E, callback: T[E]): void;
    enable<E extends FunctionPropertyNames<T>>(eventName: E): void;
    disable<E extends FunctionPropertyNames<T>>(eventName: E): void;
}

export class DefaultCancelableEventEmitter<T extends FunctionProperties<T>>
    implements CancelableEventEmitter<T> {
    private readonly listeners: any;
    private readonly disabledListeners: any;

    public constructor() {
        this.listeners = {};
        this.disabledListeners = {};
    }

    private getEventListeners(eventName) {
        return this.listeners[eventName];
    }

    public on<E extends FunctionPropertyNames<T>>(eventName: E, callback: T[E]): void {
        if (!_.find(this.getEventListeners(eventName), listener => listener === callback)) {
            this.listeners[eventName] = this.listeners[eventName] || [];
            this.listeners[eventName].push(callback);
        }
    }

    public off<E extends FunctionPropertyNames<T>>(eventName: E, callback: T[E]): void {
        if (this.listeners[eventName]) {
            const index = this.listeners[eventName].indexOf(callback);
            if (index >= 0) {
                this.listeners[eventName].splice(index, 1);
            }
        }
    }

    private getSafeParameters(args: any[]): any[] {
        return args !== undefined ? args : deepCopy(args);
    }

    private internalEmit<E extends FunctionPropertyNames<T>>(
        eventName: E,
        safe: boolean,
        ...args: Parameters<T[E]>
    ): JQuery.Promise<any> {
        const promises = _.map(this.getEventListeners(eventName), (listener: any) => {
            try {
                const parameters: any = safe ? _.map(args, this.getSafeParameters) : args;
                return listener(...parameters);
            } catch (error) {
                return jQuery.Deferred().reject(error);
            }
        });

        return jQuery.when(...promises);
    }

    public emit<E extends FunctionPropertyNames<T>>(
        eventName: E,
        ...args: Parameters<T[E]>
    ): JQuery.Promise<any> {
        return this.internalEmit(eventName, true, ...args);
    }

    public emitUnsafe<E extends FunctionPropertyNames<T>>(
        eventName: E,
        ...args: Parameters<T[E]>
    ): JQuery.Promise<any> {
        return this.internalEmit(eventName, false, ...args);
    }

    public enable<E extends FunctionPropertyNames<T>>(eventName: E): void {
        if (!_.isEmpty(this.disabledListeners[eventName])) {
            this.listeners[eventName] = _.union(
                this.listeners[eventName],
                this.disabledListeners[eventName]
            );
            this.disabledListeners[eventName] = [];
        }
    }

    public disable<E extends FunctionPropertyNames<T>>(eventName: E): void {
        if (_.isEmpty(this.disabledListeners[eventName])) {
            this.disabledListeners[eventName] = this.listeners[eventName];
            this.listeners[eventName] = [];
        }
    }
}
