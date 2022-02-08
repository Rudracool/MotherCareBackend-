/*
	© 2020 NetSuite Inc.
	User may not copy, modify, distribute, or re-bundle or otherwise make available this code;
	provided, however, if you are an authorized user with a NetSuite account or log-in, you
	may use this code subject to the terms that govern your access and use.
*/

/// <amd-module name="Address.Collection"/>
// @Typescript-full
import { AddressModel } from './Address.Model';
import { Collection } from '../../Core/JavaScript/Collection';

export class AddressCollection extends Collection<AddressModel> {
    protected model: typeof AddressModel = AddressModel;

    public url = (): string => 'services/Address.Service.ss';

    public comparator = (model: AddressModel): number => {
        return model.get('defaultbilling') === 'T' || model.get('defaultshipping') === 'T' ? 0 : 1;
    };

    public getCollectionForRendering(): this | null {
        if (this && !!this.length) {
            const cloned_collection: this = this.clone();
            const new_address = this.first().clone();

            new_address.set('internalid', '-1');

            cloned_collection.models.push(new_address);

            return cloned_collection;
        }

        return null;
    }
}
