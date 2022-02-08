/**

	© 2020 NetSuite Inc.
	User may not copy, modify, distribute, or re-bundle or otherwise make available this code;
	provided, however, if you are an authorized user with a NetSuite account or log-in, you
	may use this code subject to the terms that govern your access and use.


 * @NApiVersion 2.x
 * @NModuleScope TargetAccount
 */

import * as log from 'N/log';
import { SalesOrderDao } from '../Salesorder/RecordAccess/Salesorder.Dao';
import { ActiveRecord } from '../../Common/ActiveRecord/ActiveRecord';
import { Format } from '../../Common/Format/Format';
import { SuiteTax } from '../../../ServiceContract/SC/SuiteTax/SuiteTax';
import * as _ from 'underscore';

export class SuiteTaxHandler {
    private format = Format.getInstance();

    protected getSummaryTaxTotals(record: ActiveRecord): SuiteTax[] {
        let result: SuiteTax[];
        try {
            const taxTotals = record.executeMacro<{ response: { taxTotals: SuiteTax[] } }>(
                'getSummaryTaxTotals'
            );

            result = [];
            if (taxTotals && taxTotals.response) {
                result = _.map(taxTotals.response.taxTotals, tax => {
                    tax.taxTotal = this.format.toCurrency(tax.taxTotal);
                    return tax;
                });
            }
        } catch (error) {
            log.error({
                title: 'Load Record Error',
                details: `You may need to enable Suite Tax Feature. ${error}`
            });
            result = null;
        }
        return result;
    }

    public getTaxesFromId(id: number): SuiteTax[] {
        const dao = new SalesOrderDao();
        const objRecord = dao.loadRecord(id, {
            isDynamic: true
        });
        return this.getSummaryTaxTotals(objRecord);
    }

    public getTaxesFromRecord(record: ActiveRecord): SuiteTax[] {
        return this.getSummaryTaxTotals(record);
    }
}