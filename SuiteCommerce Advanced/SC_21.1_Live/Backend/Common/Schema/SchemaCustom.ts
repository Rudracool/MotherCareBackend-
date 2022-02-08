/**

	© 2020 NetSuite Inc.
	User may not copy, modify, distribute, or re-bundle or otherwise make available this code;
	provided, however, if you are an authorized user with a NetSuite account or log-in, you
	may use this code subject to the terms that govern your access and use.


 * @NApiVersion 2.x
 * @NModuleScope TargetAccount
 */

import { SchemaColumn } from './SchemaColumn';
import { SchemaField } from './SchemaField';
import { SchemaJoin } from './SchemaJoin';
import { SchemaSublist } from './SchemaSublist';

export type Select = object;

export interface SchemaCustom {
    fields?: { [name: string]: SchemaField };
    columns?: { [name: string]: SchemaColumn };
    filters?: { [name: string]: SchemaColumn };
    sublists?: {
        [id: string]: SchemaSublist;
    };
}