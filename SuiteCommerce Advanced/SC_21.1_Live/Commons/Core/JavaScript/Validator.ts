/*
	© 2020 NetSuite Inc.
	User may not copy, modify, distribute, or re-bundle or otherwise make available this code;
	provided, however, if you are an authorized user with a NetSuite account or log-in, you
	may use this code subject to the terms that govern your access and use.
*/

/// <amd-module name="Validator"/>
// @Typescript-full

import * as _ from 'underscore';
import { PropertiesName } from './Types';

export type ValidationErrors<TEntity> = Partial<{ [key in PropertiesName<TEntity>]: string }>;
export type AttributeValidationRules<TEntity> = Partial<
    { [key in PropertiesName<TEntity>]: ValidationRule<key, TEntity[key]>[] }
>;

type ValidationRule<TAttr, TVal> = (val: TVal, attr: TAttr) => string;

export class Validator<TEntity> {
    private readonly validationRules: AttributeValidationRules<TEntity>;
    public constructor(validationRules: AttributeValidationRules<TEntity>) {
        this.validationRules = validationRules;
    }
    public validate(
        attributes: Partial<{ [key in PropertiesName<TEntity>]: TEntity[key] }>
    ): ValidationErrors<TEntity> | null {
        const validationErrors: ValidationErrors<TEntity> = {};
        Object.keys(attributes).forEach(<E extends PropertiesName<TEntity>>(attr: string) => {
            const error = this.validateAttribute(attributes[attr], <E>attr);
            if (error) {
                validationErrors[attr] = error;
            }
        });
        return Object.keys(validationErrors).length ? validationErrors : null;
    }
    public validateAttribute<E extends PropertiesName<TEntity>>(val: TEntity[E], attr: E): string {
        const validationRules = this.validationRules[attr];
        let error = '';
        let i = 0;
        if (validationRules) {
            // Report the first error found
            while (i < validationRules.length && !error) {
                error = validationRules[i](val, attr);
                i++;
            }
        }
        return error;
    }
}

function hasValue(value): boolean {
    return !(
        _.isNull(value) ||
        _.isUndefined(value) ||
        (_.isString(value) && value.trim() === '') ||
        (_.isArray(value) && _.isEmpty(value))
    );
}
// Keeping regex out of functions body to improve performance
const commonPatterns = {
    // Same as email but is more restrictive and matches the same emails as the Netsuite backend UI
    // Source: https://system.netsuite.com/javascript/NLUtil.jsp__NS_VER=2014.1.0&minver=154&locale=en_US.nlqs
    //        (Search for NLValidationUtil_SIMPLE_EMAIL_PATTERN)
    email: /^[-a-z0-9!#$%&'*+/=?^_`{|}~]+(?:\.[-a-z0-9!#$%&'*+/=?^_`{|}~]+)*@(?:[a-z0-9]+(?:-+[a-z0-9]+)*\.)+(?:xn--[a-z0-9]+|[a-z]{2,16})$/i,

    netsuiteEmail: /^[-a-z0-9!#$%&'*+/=?^_`{|}~]+(?:\.[-a-z0-9!#$%&'*+/=?^_`{|}~]+)*@(?:[a-z0-9]+(?:-+[a-z0-9]+)*\.)+(?:xn--[a-z0-9]+|[a-z]{2,16})$/i,

    // This validation is less restrictive than standard
    // and matches with the used in Netsuite backend
    netsuiteUrl: /^(https|http|ftp|file):\/\//,

    netsuiteFloat: /^-{0,1}([0-9])+(\.{1}[0-9]+)?$/,

    netsuiteInteger: /^-{0,1}([0-9])+$/,
    // Allow numbers bettwen 000.00 and 000100.00 ending with optional %
    netsuitePercent: /^0*((([0-9]{1,2})(\.[0-9]{1,2})?%?$)|(100(\.0{1,2})?%?$))/,

    // Allow any character 7 or more times
    // (this is the validation that the netsuite backend form does on phone type fields)
    netsuitePhone: /^.{7,}$/,

    // Matches any digit(s) (i.e. 0-9)
    digits: /^\d+$/,

    // Matches any number (e.g. 100.000)
    number: /^-?(?:\d+|\d{1,3}(?:,\d{3})+)(?:\.\d+)?$/,

    // Mathes any valid url (e.g. http://www.xample.com)
    url: /^(https?|ftp):\/\/(((([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!$&'()*+,;=]|:)*@)?(((\d|[1-9]\d|1\d\d|2[0-4]\d|25[0-5])\.(\d|[1-9]\d|1\d\d|2[0-4]\d|25[0-5])\.(\d|[1-9]\d|1\d\d|2[0-4]\d|25[0-5])\.(\d|[1-9]\d|1\d\d|2[0-4]\d|25[0-5]))|((([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])*([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])))\.)+(([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])*([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])))\.?)(:\d*)?)(\/((([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!$&'()*+,;=]|:|@)+(\/(([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!$&'()*+,;=]|:|@)*)*)?)?(\?((([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!$&'()*+,;=]|:|@)|[\uE000-\uF8FF]|\/|\?)*)?(#((([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!$&'()*+,;=]|:|@)|\/|\?)*)?$/i
};

function pattern(value: any, regExp: RegExp, msg: string): string {
    return !hasValue(value) || !value.toString().match(regExp) ? msg : '';
}

function required(val: any, msg: string): string {
    return !hasValue(val) ? msg : '';
}

function email(value: any, msg: string): string {
    return pattern(value, commonPatterns.email, msg);
}

function netsuiteEmail(value: any, msg: string): string {
    return pattern(value, commonPatterns.netsuiteEmail, msg);
}

function netsuiteUrl(value: any, msg: string): string {
    return pattern(value, commonPatterns.netsuiteUrl, msg);
}

function netsuiteFloat(value: any, msg: string): string {
    return pattern(value, commonPatterns.netsuiteFloat, msg);
}

function netsuiteInteger(value: any, msg: string): string {
    return pattern(value, commonPatterns.netsuiteInteger, msg);
}

function netsuitePercent(value: any, msg: string): string {
    return pattern(value, commonPatterns.netsuitePercent, msg);
}

function netsuitePhone(value: any, msg: string): string {
    return pattern(value, commonPatterns.netsuitePhone, msg);
}

function digits(value: any, msg: string): string {
    return pattern(value, commonPatterns.digits, msg);
}

function number(value: any, msg: string): string {
    return pattern(value, commonPatterns.number, msg);
}

function url(value: any, msg: string): string {
    return pattern(value, commonPatterns.url, msg);
}

export const ValidationUtils = {
    required,
    pattern,
    email,
    netsuiteEmail,
    netsuiteUrl,
    netsuiteFloat,
    netsuiteInteger,
    netsuitePercent,
    netsuitePhone,
    digits,
    number,
    url
};
