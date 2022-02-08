/*
	© 2020 NetSuite Inc.
	User may not copy, modify, distribute, or re-bundle or otherwise make available this code;
	provided, however, if you are an authorized user with a NetSuite account or log-in, you
	may use this code subject to the terms that govern your access and use.
*/

/// <amd-module name="Newsletter.Model"/>
// @Typescript-full
import * as Utils from '../../../Commons/Utilities/JavaScript/Utils';
import { Model } from '../../../Commons/Core/JavaScript/Model';
import {
    AttributeValidationRules,
    ValidationUtils
} from '../../../Commons/Core/JavaScript/Validator';

export interface Newsletter {
    email: string;
    code: string;
}
export class NewsletterModel extends Model<Newsletter> {
    protected urlRoot = () => Utils.getAbsoluteUrl('services/Newsletter.Service.ss');

    protected getValidationRules(): AttributeValidationRules<Newsletter> {
        return {
            email: [
                val =>
                    ValidationUtils.required(
                        val,
                        Utils.translate('Enter an email address to subscribe')
                    ),
                val =>
                    ValidationUtils.email(val, Utils.translate('Valid email address is required'))
            ]
        };
    }
}
