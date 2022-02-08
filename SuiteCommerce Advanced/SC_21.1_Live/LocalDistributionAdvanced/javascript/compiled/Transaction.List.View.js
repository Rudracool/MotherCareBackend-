/*
    © 2020 NetSuite Inc.
    User may not copy, modify, distribute, or re-bundle or otherwise make available this code;
    provided, however, if you are an authorized user with a NetSuite account or log-in, you
    may use this code subject to the terms that govern your access and use.
*/
define("Transaction.List.View", ["require", "exports", "underscore", "Utils", "Configuration", "Backbone.View", "Backbone"], function (require, exports, _, Utils, Configuration_1, BackboneView, Backbone) {
    "use strict";
    var TransactionListView = BackboneView.extend({
        _buildColumns: function (selectedColumns, transaction) {
            function createColumn(transaction, column) {
                switch (column.id) {
                    case 'origin':
                        return {
                            label: Utils.translate(column.label),
                            type: 'origin',
                            name: 'origin',
                            value: _.findWhere(Configuration_1.Configuration.get('transactionRecordOriginMapping'), {
                                origin: transaction.get('origin')
                            }).name
                        };
                    case 'status':
                        var value;
                        if (!transaction.get('status')) {
                            value = transaction.get('entitystatus').name;
                        }
                        else {
                            value = transaction.get('status').name;
                        }
                        return {
                            label: Utils.translate(column.label),
                            type: 'status',
                            name: 'status',
                            value: value
                        };
                    case 'amount':
                        return {
                            label: Utils.translate(column.label),
                            type: 'currency',
                            name: 'amount',
                            value: transaction.get('amount_formatted')
                        };
                    case 'entitystatus':
                        return {
                            label: Utils.translate(column.label),
                            type: 'status',
                            name: 'entitystatus',
                            value: transaction.get('entitystatus').name
                        };
                    default:
                        var init = {
                            label: Utils.translate(column.label),
                            value: transaction.get(column.id)
                        };
                        if (column.type) {
                            init.type = column.type;
                        }
                        else {
                            init.type = 'custom';
                        }
                        if (column.name) {
                            init.name = column.name;
                        }
                        else {
                            init.name = column.id;
                        }
                        if (column.visible === false) {
                            init.value = column.message;
                        }
                        return init;
                }
            }
            var initializedColumns = [];
            _.each(selectedColumns, function (column) {
                if (!column.composite) {
                    initializedColumns.push(createColumn(transaction, column));
                }
                else {
                    var composite = Utils.requireModules(column.composite);
                    var model = void 0;
                    if (column.fields) {
                        var modelFields_1 = {};
                        _.each(column.fields, function (field) {
                            var transactionField = transaction.get(field.toLowerCase()) || transaction.get(field); // Some attributes can be returned from the services in camelcase format
                            modelFields_1[field] = transactionField;
                        });
                        model = new Backbone.Model(modelFields_1);
                    }
                    else {
                        model = transaction;
                    }
                    var initialized = {
                        label: _(column.label),
                        type: column.type,
                        name: column.id,
                        compositeKey: column.compositeKey,
                        composite: new composite({ model: model })
                    };
                    initializedColumns.push(initialized);
                }
            });
            return initializedColumns;
        }
    });
    return TransactionListView;
});

//# sourceMappingURL=Transaction.List.View.js.map
