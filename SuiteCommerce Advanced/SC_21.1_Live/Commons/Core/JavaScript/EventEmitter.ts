/*
	© 2020 NetSuite Inc.
	User may not copy, modify, distribute, or re-bundle or otherwise make available this code;
	provided, however, if you are an authorized user with a NetSuite account or log-in, you
	may use this code subject to the terms that govern your access and use.
*/

/// <amd-module name="EventEmitter"/>
// @Typescript-partial

import * as _ from 'underscore';

type FunctionPropertyNames<T> = { [K in keyof T]: T[K] extends Function ? K : never }[keyof T];
type FunctionProperties<T> = Pick<T, FunctionPropertyNames<T>>;

export interface EventEmitter<T extends FunctionProperties<T>> {
    on<E extends FunctionPropertyNames<T>>(eventName: E, callback: T[E]);
    once<E extends FunctionPropertyNames<T>>(eventName: E, callback: T[E]);
    emit<E extends FunctionPropertyNames<T>>(eventName: E, ...args: Parameters<T[E]>): void;
    off<E extends FunctionPropertyNames<T>>(eventName: E, callback: T[E]): void;
}

export class DefaultEventEmitter<T extends FunctionProperties<T>> implements EventEmitter<T> {
    private readonly listeners: any;
    private readonly onceListeners: any;

    public constructor() {
        this.listeners = {};
        this.onceListeners = {};
    }

    private getEventListeners(eventName) {
        return this.listeners[eventName];
    }

    private getEventOnceListeners(eventName): any[] {
        return this.onceListeners[eventName];
    }

    public on<E extends FunctionPropertyNames<T>>(eventName: E, callback: T[E]): void {
        if (!_.find(this.getEventListeners(eventName), listener => listener === callback)) {
            this.listeners[eventName] = this.listeners[eventName] || [];
            this.listeners[eventName].push(callback);
        }
    }

    public once<E extends FunctionPropertyNames<T>>(eventName: E, callback: T[E]): void {
        if (!_.find(this.getEventOnceListeners(eventName), listener => listener === callback)) {
            this.onceListeners[eventName] = this.onceListeners[eventName] || [];
            this.onceListeners[eventName].push(callback);
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

    public emit<E extends FunctionPropertyNames<T>>(eventName: E, ...args: Parameters<T[E]>): void {
        _.map(this.getEventListeners(eventName), (listener: any) => listener(...args));

        const onceListeners = this.getEventOnceListeners(eventName);
        while (onceListeners && onceListeners.length) {
            const listener = onceListeners.pop();
            listener(...args);
        }
    }
}
