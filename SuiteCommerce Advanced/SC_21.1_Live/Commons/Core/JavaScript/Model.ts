/*
	© 2020 NetSuite Inc.
	User may not copy, modify, distribute, or re-bundle or otherwise make available this code;
	provided, however, if you are an authorized user with a NetSuite account or log-in, you
	may use this code subject to the terms that govern your access and use.
*/

/// <amd-module name="Model"/>
// @Typescript-full

import * as Backbone from './backbone/BackboneExtras';
import { ValidationConfig } from './backbone/BackboneValidationExtras';
import { Collection } from './Collection';
import { AttributeValidationRules, ValidationErrors, Validator } from './Validator';
import { PropertiesName } from './Types';

export interface ModelEventsDefinition<TModel, TServiceContract> {
    sync: (model: TModel, resp: TServiceContract) => void;
    change: (model: TModel) => void;
    destroy: (model: TModel) => void;
    invalid: (model: TModel) => void;
}
export abstract class Model<
    TEntity,
    TServiceContract = TEntity,
    TEvents extends object = {}
> extends Backbone.Model<TEntity, TServiceContract, TEvents> {
    private operationIds: string[] = [];

    protected validation?: ValidationConfig;

    protected validationError: ValidationErrors<TEntity> | null;

    public url = (): string => {
        let base = this.urlRoot();
        if (!base && this.collection instanceof Collection) {
            base = this.collection.url();
        }
        if (this.isNew()) {
            return base;
        }
        const sep = base.indexOf('?') === -1 ? '?' : '&';
        return `${base + sep}internalid=${encodeURIComponent(this.id)}`;
    };

    protected urlRoot = (): string => '';

    // @method url SCA Overrides @?property Backbone.Model.idAttribute
    // to add model's 'internalid' as parameter @return {String}
    protected idAttribute: string = 'internalid';

    public deepCopy(): TEntity {
        return this.attributes;
    }

    public sync(
        method: Backbone.SyncMethod,
        model: this,
        options: Backbone.SyncOptions
    ): JQueryXHR {
        return Backbone.sync.call(this, method, model, options).always(
            (body, status, xhr): void => {
                try {
                    if (xhr.getResponseHeader) {
                        this.addOperationId(xhr.getResponseHeader('x-n-operationid'));
                    }
                } catch (e) {
                    console.error('Error fetching Operation Id from header.');
                }
            }
        );
    }

    public addOperationId(ids: string[]): void {
        if (Array.isArray(ids)) {
            this.operationIds = this.operationIds.concat(ids);
        } else {
            this.operationIds.push(ids);
        }
    }

    public getOperationIds(): string[] {
        return this.operationIds;
    }

    public set<E extends PropertiesName<TEntity>>(
        attributeName: E,
        value: TEntity[E],
        options?: { silent: boolean }
    ): this {
        if (attributeName == null) return this;

        // Handle both `"key", value` and `{key: value}` -style arguments,
        // required by extensibility layer (SCModel supported this)
        let attrs: any;
        let opts: any = options;
        if (typeof attributeName === 'object') {
            attrs = attributeName;
            opts = value;
        } else {
            attrs = {};
            attrs[attributeName] = value;
        }
        return super.set(attrs, { validate: true, ...opts });
    }

    public getLatestOperationIds(lastOperationIdIndex: number): string[] {
        return this.getOperationIds().slice(lastOperationIdIndex);
    }

    protected validate(attributes?: Partial<TEntity>): ValidationErrors<TEntity> | null {
        if (typeof attributes !== 'undefined') {
            const validator = new Validator(this.getValidationRules());
            return validator.validate(attributes);
        }

        return null;
    }

    // this method overrides the _validate method of Backbone
    protected _validate(attributes: Partial<TEntity>) {
        this.validationError = this.validate(attributes);
        return !this.validationError;
    }

    protected getValidationRules(): AttributeValidationRules<TEntity> {
        return {};
    }

    public getValidationErrors(): ValidationErrors<TEntity> | null {
        return this.validationError;
    }
}
