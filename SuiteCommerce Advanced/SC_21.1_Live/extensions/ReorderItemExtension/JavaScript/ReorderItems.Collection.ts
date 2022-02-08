/*
	© 2020 NetSuite Inc.
	User may not copy, modify, distribute, or re-bundle or otherwise make available this code;
	provided, however, if you are an authorized user with a NetSuite account or log-in, you
	may use this code subject to the terms that govern your access and use.
*/

/// <amd-module name="ReorderItems.Collection"/>
import { ReorderItemsModel } from '../../../Advanced/ReorderItems/JavaScript/ReorderItems.Model';
import * as _ from 'underscore';
import TransactionLineCollection = require('../../../Commons/Transaction/JavaScript/Transaction.Line.Collection');
import TransactionCollection = require('../../../Commons/Transaction/JavaScript/Transaction.Collection');
const ReorderItemsCollection: any = TransactionLineCollection.extend({
    url: 'services/ReorderItems.Service.ss',

    model: ReorderItemsModel,
   

    parse: function(response) {
        this.totalRecordsFound = response.totalRecordsFound;
        this.recordsPerPage = response.recordsPerPage;
         this.htmlFile=response.htmlFile;
         this.customAlldata=response.customAllData;
         
        return response.records ;
    },

    update: function(options, list_header) {
        const range = options.range || {};
        const data_filters: any = {
            sort: options.sort.value,
            order_id: this.order_id,
            order: options.order,
            from: range.from,
            to: range.to,
            page: options.page
        };
        
       
        if (!this.order_id) {
            let date_string = options.filter.value.apply(list_header.view);
            date_string = date_string && date_string.split('T');
            if( _.isEmpty(data_filters.from)){
                data_filters.from = date_string[0];
                
            }
            if(_.isEmpty(data_filters.to)){
                data_filters.to = date_string[1];
            }
        }
        this.fetch({
            data: data_filters,
            reset: true,
            killerId: options.killerId
        });
        this.CustomData_filters=data_filters;
    },
    CustomDateFilter:function(){
        return this.CustomDateObject={
            fromDate:this.CustomData_filters.from,
            toDate:this.CustomData_filters.to
        }
       
    }
});

export = ReorderItemsCollection;
