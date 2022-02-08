/*
	© 2020 NetSuite Inc.
	User may not copy, modify, distribute, or re-bundle or otherwise make available this code;
	provided, however, if you are an authorized user with a NetSuite account or log-in, you
	may use this code subject to the terms that govern your access and use.
*/

/// <amd-module name="Case.Fields.Model"/>
// @Typescript-full

import * as Utils from '../../../Commons/Utilities/JavaScript/Utils';
import { Model } from '../../../Commons/Core/JavaScript/Model';
import { CaseFields } from '../../../ServiceContract/SC/Case/Case';

export class CaseFieldsModel extends Model<CaseFields> {
    protected urlRoot = (): string => Utils.getAbsoluteUrl('services/Case.Fields.ss', true);
    public constructor(
        attributes: CaseFields = {
            categories: [],
            origins: [],
            statuses: [],
            priorities: []
        },
        options?: never
    ) {
        super(attributes, options);
    }
}
