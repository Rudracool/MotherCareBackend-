/**

    © 2020 NetSuite Inc.
    User may not copy, modify, distribute, or re-bundle or otherwise make available this code;
    provided, however, if you are an authorized user with a NetSuite account or log-in, you
    may use this code subject to the terms that govern your access and use.


 * @NApiVersion 2.x
 * @NModuleScope TargetAccount
 */
define(["require", "exports", "N/search", "N/record", "N/format", "N/file", "N/runtime", "../Libraries/Configuration/Configuration", "../../Common/Controller/RequestErrors", "../../Common/SspLibraries/SS2Utils"], function (require, exports, search, record, format, file, runtime, Configuration_1, RequestErrors_1, SS2Utils) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var SubscriptionsModel = /** @class */ (function () {
        function SubscriptionsModel(subscription_id) {
            this.name = 'SubscriptionsModel';
            this.configuration = Configuration_1.Configuration.getInstance();
            this.plans = {};
            if (subscription_id) {
                try {
                    this.subscriptionRecord = record.load({
                        type: record.Type.SUBSCRIPTION,
                        id: subscription_id,
                        isDynamic: true
                    });
                    if (parseInt(this.subscriptionRecord.getValue({ fieldId: 'customer' }).toString()) !== runtime.getCurrentUser().id) {
                        throw RequestErrors_1.forbiddenError;
                    }
                }
                catch (e) {
                    throw RequestErrors_1.forbiddenError;
                }
            }
        }
        SubscriptionsModel.prototype.searchFilterSubscriptionBase = function () {
            return [
                ['status', search.Operator.ANYOF, ['ACTIVE', 'SUSPENDED']],
                'and',
                ['customer', search.Operator.IS, runtime.getCurrentUser().id]
            ];
        };
        SubscriptionsModel.prototype.searchBillingAccounts = function () {
            var billingAccounts = [];
            var billingAccountsIds = [];
            var columns = [
                { name: 'name', join: 'billingaccount' },
                { name: 'billingaccount' }
            ];
            var filters = this.searchFilterSubscriptionBase();
            var result_search = search
                .create({
                type: search.Type.SUBSCRIPTION,
                columns: columns,
                filters: filters
            })
                .run();
            result_search.each(function (billing_account_row) {
                var billing_account = {
                    internalId: billing_account_row.getValue('billingaccount'),
                    name: billing_account_row.getValue({
                        name: 'name',
                        join: 'billingaccount'
                    })
                };
                if (billingAccountsIds[billing_account.internalId] === undefined) {
                    billingAccountsIds[billing_account.internalId] = billing_account.internalId;
                    billingAccounts.push(billing_account);
                }
                return true;
            });
            return { billingAccounts: billingAccounts };
        };
        SubscriptionsModel.prototype.search = function (data) {
            var subscriptions = [];
            var columns = [
                { name: 'nextbillcycledate', join: 'billingaccount' },
                { name: 'lastbilldate', join: 'billingaccount' },
                { name: 'nextrenewalstartdate' },
                { name: 'name', join: 'billingaccount' },
                { name: 'datecreated' },
                { name: 'enddate', sort: search.Sort.ASC },
                { name: 'subscriptionplan' },
                { name: 'internalid' },
                { name: 'name' },
                { name: 'startdate' },
                { name: 'status' }
            ];
            var filters = this.searchFilterSubscriptionBase();
            if (data.filter && data.filter !== 'all') {
                filters.push('and', ['billingaccount', search.Operator.ANYOF, data.filter.split(',')]);
            }
            var range_column = 'enddate';
            if (data.from && data.to) {
                data.from = data.from.split('-');
                data.to = data.to.split('-');
                filters.push('and', [
                    'datecreated',
                    search.Operator.WITHIN,
                    format.format({
                        value: new Date(data.from[0], data.from[1] - 1, data.from[2]),
                        type: format.Type.DATE
                    }),
                    format.format({
                        value: new Date(data.to[0], data.to[1] - 1, data.to[2]),
                        type: format.Type.DATE
                    })
                ]);
            }
            else if (data.from) {
                data.from = data.from.split('-');
                filters.push('and', [
                    range_column,
                    search.Operator.ONORAFTER,
                    format.format({
                        value: new Date(data.from[0], data.from[1] - 1, data.from[2]),
                        type: format.Type.DATE
                    })
                ]);
            }
            else if (data.to) {
                data.to = data.to.split('-');
                filters.push('and', [
                    range_column,
                    search.Operator.ONORBEFORE,
                    format.format({
                        value: new Date(data.to[0], data.to[1] - 1, data.to[2]),
                        type: format.Type.DATE
                    })
                ]);
            }
            if (data.sort) {
                _.each(data.sort.split(','), function (column_name) {
                    var column = columns.filter(function (col) { return col.name === column_name; })[0];
                    column.sort = data.order >= 0 ? search.Sort.ASC : search.Sort.DESC;
                });
            }
            var subscription_ids = [];
            var search_subscriptions = SS2Utils.iterateAllSearchResults(search.Type.SUBSCRIPTION, columns, filters, data.page, function (subscription) {
                subscription_ids.push(subscription.getValue({ name: 'internalid' }));
                var result = {
                    internalId: subscription.getValue({ name: 'internalid' }),
                    dateCreated: subscription.getValue({ name: 'datecreated' }),
                    startDate: subscription.getValue({ name: 'startdate' }),
                    endDate: subscription.getValue({ name: 'enddate' }),
                    name: subscription.getValue({ name: 'name' }),
                    status: subscription.getValue({ name: 'status' }),
                    subscriptionPlan: subscription.getValue({ name: 'subscriptionplan' }),
                    billingAccount: subscription.getValue({ name: 'billingaccount' }),
                    nextRenewalStartDate: subscription.getValue({ name: 'nextrenewalstartdate' }),
                    lastBillDate: subscription.getValue({
                        name: 'lastbilldate',
                        join: 'billingaccount'
                    }),
                    nextBillCycleDate: subscription.getValue({
                        name: 'nextbillcycledate',
                        join: 'billingaccount'
                    })
                };
                subscriptions.push(result);
            });
            this.setProcessingSubscriptions(subscriptions, subscription_ids);
            return {
                subscriptions: subscriptions,
                totalRecordsFound: search_subscriptions,
                recordsPerPage: 20
            };
        };
        SubscriptionsModel.prototype.get = function (subscription_id) {
            var _this = this;
            var lines_collection = [];
            var items_id_collection = [];
            var price_interval_collection = this.getPriceIntervals();
            // Get the change orders of the subscription into the lines
            var change_orders = this.searchExistingChangeOrders(null, true, null, true);
            var lines_changes = this.getLinesChanges(change_orders);
            var line_field_values = {
                billingMode: 'billingmode',
                catalogType: 'catalogtype',
                discount: 'discount',
                quantity: 'quantity',
                status: 'status',
                subscriptionLineType: 'subscriptionlinetype',
                lineNumber: 'linenumber',
                item: 'item',
                internalId: 'subscriptionline',
                prorateEndDate: 'prorateenddate',
                prorateStartDate: 'proratestartdate'
            };
            var line_field_texts = {
                endDate: 'enddate',
                startDate: 'startdate'
            };
            var line_field_texts_and_values = {
                subscriptionLineTypeObj: 'subscriptionlinetype'
            };
            SS2Utils.iterateSublist(this.subscriptionRecord, 'subscriptionline', function () {
                var serialized_record = SS2Utils.getFieldsAsObject(_this.subscriptionRecord, line_field_values, line_field_texts, line_field_texts_and_values, 'subscriptionline');
                var price_intervals = price_interval_collection[serialized_record.lineNumber];
                var frequency = price_intervals.length ? price_intervals[0].frequency : null;
                if (serialized_record.item) {
                    items_id_collection.push(serialized_record.item);
                }
                lines_collection.push(_.extend(serialized_record, {
                    priceIntervals: price_intervals,
                    isProrated: serialized_record.prorateEndDate || serialized_record.prorateStartDate,
                    isProcessing: !!lines_changes[serialized_record.internalId],
                    subscriptionLineType: parseInt(serialized_record.subscriptionLineType),
                    canBeSuspended: serialized_record.status === 'ACTIVE' &&
                        _this.configuration.get('subscriptions.lineStatusChange') !==
                            "Don't Allow Status Changes" &&
                        frequency !== 'ONETIME' &&
                        (serialized_record.catalogType !== 'REQUIRED' ||
                            _this.configuration.get('subscriptions.allowToCancelSuspendRequiredLines')) &&
                        !_.find(lines_changes[serialized_record.internalId], function (change) {
                            return change !== 'SUSPEND';
                        }),
                    canBeReactivated: serialized_record.status === 'SUSPENDED' &&
                        _this.configuration.get('subscriptions.lineStatusChange') ===
                            'Allow Suspending / Resuming' &&
                        !_.find(lines_changes[serialized_record.internalId], function (change) {
                            return change !== 'REACTIVATE';
                        }),
                    canChangeQuantity: serialized_record.subscriptionLineType != 3 && // Usage
                        (!_this.configuration.get('subscriptions.disallowUpgradeQuantity') ||
                            (!_this.configuration.get('subscriptions.disallowDowngradeQuantity') &&
                                serialized_record.quantity > 1)) &&
                        !_.find(lines_changes[serialized_record.internalId], function (change) {
                            return (change !== 'ACTIVATE' &&
                                change !== 'MODIFY_PRICING' &&
                                change !== 'REACTIVATE');
                        }),
                    pricePlanTypeObj: price_intervals.length > 0 &&
                        price_intervals[0].pricePlan &&
                        price_intervals[0].pricePlan.pricePlanTypeObj
                        ? price_intervals[0].pricePlan.pricePlanTypeObj
                        : null,
                    frequencyObj: price_intervals.length > 0 && price_intervals[0].frequencyObj
                        ? price_intervals[0].frequencyObj
                        : null
                }));
            });
            var items_collection = this.getItems(items_id_collection);
            _.each(lines_collection, function (line) {
                line.item = items_collection[line.item];
            });
            var valid_states = ['ACTIVE', 'SUSPENDED', 'PENDING_ACTIVATION', 'CLOSED'];
            var required_lines_collection = _.filter(lines_collection, function (line) {
                return valid_states.indexOf(line.status) >= 0 && line.catalogType === 'REQUIRED';
            });
            var optional_lines_collection = _.filter(lines_collection, function (line) {
                return valid_states.indexOf(line.status) >= 0 && line.catalogType !== 'REQUIRED';
            });
            var non_included_lines_collection = _.filter(lines_collection, function (line) {
                return !(valid_states.indexOf(line.status) >= 0) && line.catalogType === 'OPTIONAL';
            });
            var sub_field_values = {
                internalId: 'internalid',
                name: 'name',
                billingAccount: 'billingaccount',
                status: 'billingsubscriptionstatus'
            };
            var sub_field_texts = {
                dateCreated: 'datecreated',
                startDate: 'startdate',
                endDate: 'enddate',
                nextBillCycleDate: 'nextbillcycledate',
                lastBillDate: 'lastbilldate',
                nextRenewalStartDate: 'nextrenewalstartdate'
            };
            var serialized_subscription = SS2Utils.getFieldsAsObject(this.subscriptionRecord, sub_field_values, sub_field_texts);
            var will_be_suspended = _.find(change_orders, function (co) {
                return (co.getValue({ fieldId: 'action' }) == 'SUSPEND' ||
                    _this.noActiveLinesInChangeOrder(co, 'SUSPEND'));
            });
            if (will_be_suspended) {
                // Although this will take affect tomorrow,
                // we need to give immediate feedback to the user
                serialized_subscription.status = 'SUSPENDED';
                serialized_subscription.isProcessing = true;
            }
            return _.extend(serialized_subscription, {
                optionalSubscriptionLines: optional_lines_collection,
                requiredSubscriptionLines: required_lines_collection,
                nonIncludedLinesCollection: non_included_lines_collection,
                canBeSuspended: serialized_subscription.status === 'ACTIVE' &&
                    this.configuration.get('subscriptions.generalStatusChange') !==
                        "Don't Allow Status Changes" &&
                    !will_be_suspended,
                canBeReactivated: serialized_subscription.status === 'SUSPENDED' &&
                    this.configuration.get('subscriptions.generalStatusChange') ===
                        'Allow Suspending / Resuming' &&
                    !_.find(change_orders, function (co) {
                        return (co.getValue({ fieldId: 'action' }) !== 'REACTIVATE' ||
                            _this.noActiveLinesInChangeOrder(co, 'REACTIVATE'));
                    })
            });
        };
        SubscriptionsModel.prototype.noActiveLinesInChangeOrder = function (co, operation) {
            var status_from = 'ACTIVE';
            var status_to = 'SUSPENDED';
            if (operation == 'REACTIVATE') {
                status_from = 'SUSPENDED';
                status_to = 'ACTIVE';
            }
            var no_active_lines_in_change_order = true;
            SS2Utils.iterateSublist(co, 'subline', function () {
                var status = co.getCurrentSublistValue({
                    sublistId: 'subline',
                    fieldId: 'status'
                });
                var new_status = co.getCurrentSublistValue({
                    sublistId: 'subline',
                    fieldId: 'statusnew'
                });
                if (status == status_from && new_status != status_to) {
                    no_active_lines_in_change_order = false;
                }
            });
            return no_active_lines_in_change_order;
        };
        SubscriptionsModel.prototype.updateLine = function (data) {
            this.processLineAction(data);
        };
        SubscriptionsModel.prototype.reactivateSubscription = function (data) {
            this.processSubscriptionAction('REACTIVATE');
        };
        SubscriptionsModel.prototype.suspendLine = function (data) {
            this.processLineAction(_.extend(data, { action: 'SUSPEND' }));
        };
        SubscriptionsModel.prototype.suspendSubscription = function () {
            this.processSubscriptionAction('SUSPEND');
        };
        SubscriptionsModel.prototype.setProcessingSubscriptions = function (subscriptions, subscription_ids) {
            if (!subscriptions || !subscriptions.length)
                return;
            var change_orders = this.searchExistingChangeOrders(null, true, subscription_ids);
            _.each(subscriptions, function (result) {
                result.isProcessing =
                    change_orders[result.internalId] && change_orders[result.internalId].length;
            });
        };
        SubscriptionsModel.prototype.getPlanInformation = function (price_plan_id) {
            var _this = this;
            if (!price_plan_id)
                return;
            if (!this.plans[price_plan_id]) {
                var price_plan_1 = record.load({
                    type: record.Type.PRICE_PLAN,
                    id: price_plan_id,
                    isDynamic: true
                });
                var fields_1 = {
                    maxamount: 'maxamount',
                    minamount: 'minamount',
                    value: 'value',
                    fromVal: 'fromval',
                    pricingOption: 'pricingoption'
                };
                // type=2 => tiered, type=4 => volume
                var type = price_plan_1.getValue({ fieldId: 'priceplantype' });
                this.plans[price_plan_id] = {
                    priceTiers: [],
                    pricePlanType: parseInt(type),
                    pricePlanTypeObj: {
                        pricePlanTypeText: price_plan_1.getText({ fieldId: 'priceplantype' }),
                        pricePlanTypeValue: price_plan_1.getValue({ fieldId: 'priceplantype' })
                    },
                    pricePlanId: price_plan_id
                };
                SS2Utils.iterateSublist(price_plan_1, 'pricetiers', function () {
                    var serialized_tier = SS2Utils.getFieldsAsObject(price_plan_1, fields_1, null, null, 'pricetiers');
                    _this.plans[price_plan_id].priceTiers.push(_.extend(serialized_tier, {
                        showSingleValue: serialized_tier.maxamount - serialized_tier.minamount === 1,
                        // TODO: Get currency
                        valueFormatted: '$' +
                            format.format({
                                value: serialized_tier.value,
                                type: format.Type.CURRENCY
                            })
                    }));
                });
            }
            return this.plans[price_plan_id];
        };
        SubscriptionsModel.prototype.getPriceIntervals = function () {
            var _this = this;
            var price_interval_collection = {};
            var fields = {
                status: 'status',
                line: 'linenumber',
                catalogType: 'catalogtype',
                chargeType: 'chargetype',
                discount: 'discount',
                frequency: 'frequency',
                includedQuantity: 'includedquantity',
                quantity: 'quantity',
                startOffsetUnit: 'startoffsetunit',
                recurringAmount: 'recurringamount',
                repeatEvery: 'repeatevery',
                pricePlan: 'priceplan',
                startDateValue: 'startdate'
            };
            var texts = {
                startDate: 'startdate'
            };
            var texts_and_fields = {
                frequencyObj: 'frequency'
            };
            SS2Utils.iterateSublist(this.subscriptionRecord, 'priceinterval', function () {
                var serialized_interval = SS2Utils.getFieldsAsObject(_this.subscriptionRecord, fields, texts, texts_and_fields, 'priceinterval');
                if (!price_interval_collection[serialized_interval.line]) {
                    price_interval_collection[serialized_interval.line] = [];
                }
                // For sorting
                serialized_interval.startDateInt = new Date(serialized_interval.startDateValue).getTime();
                delete serialized_interval.startDateValue;
                price_interval_collection[serialized_interval.line].push(_.extend(serialized_interval, {
                    pricePlan: _this.getPlanInformation(serialized_interval.pricePlan)
                }));
            });
            // Each line can have several prices chaning on the date.
            // We need to remove the outdated prices
            var now = new Date().getTime();
            var filtered_price_interval_collection = {};
            _.each(price_interval_collection, function (value, key) {
                // Sort in descending order
                var sorted_tiers = _.sortBy(value, 'startDateInt').reverse();
                var last_valid;
                _.each(sorted_tiers, function (tier, i) {
                    if (now >= tier.startDateInt) {
                        last_valid = i;
                    }
                });
                filtered_price_interval_collection[key] = _.first(sorted_tiers, last_valid + 1).reverse();
            });
            return filtered_price_interval_collection;
        };
        SubscriptionsModel.prototype.getItems = function (items_id_collection) {
            if (!items_id_collection || !items_id_collection.length)
                return {};
            var items_collection = {};
            var filters = [['internalid', search.Operator.ANYOF, items_id_collection]];
            var columns = [
                'internalid',
                'itemid',
                'storedisplayname',
                'cost',
                'storedisplayimage',
                'storedescription',
                'storedetaileddescription'
            ];
            SS2Utils.iterateAllSearchResults(search.Type.ITEM, columns, filters, '', function (result) {
                var store_display_image = result.getValue('storedisplayimage');
                if (store_display_image !== '') {
                    var fileObj = file.load({ id: store_display_image });
                    store_display_image = fileObj.url;
                }
                if (!items_collection[result.id]) {
                    items_collection[result.id] = {
                        id: result.id,
                        recordType: result.recordType,
                        cost: result.getValue('cost'),
                        storeDisplayName: result.getValue('storedisplayname'),
                        imageUrl: store_display_image,
                        storedetailedDescription: result.getValue('storedetaileddescription'),
                        storeDescription: result.getValue('storedescription'),
                        itemId: result.getValue('itemid')
                    };
                }
            });
            return items_collection;
        };
        SubscriptionsModel.prototype.getLinesChanges = function (change_orders) {
            var changes = {};
            _.each(change_orders, function (change_order) {
                var change_order_type = change_order.getValue({ fieldId: 'action' });
                SS2Utils.iterateSublist(change_order, 'subline', function () {
                    var apply = change_order.getCurrentSublistValue({
                        sublistId: 'subline',
                        fieldId: 'apply'
                    });
                    if (!apply)
                        return;
                    var subscription_line = change_order.getCurrentSublistText({
                        sublistId: 'subline',
                        fieldId: 'subscriptionline'
                    });
                    if (!changes[subscription_line])
                        changes[subscription_line] = [];
                    changes[subscription_line].push(change_order_type);
                });
            });
            return changes;
        };
        SubscriptionsModel.prototype.processLineAction = function (data) {
            this.subscriptionRecord.selectLine({
                sublistId: 'subscriptionline',
                line: data.lineNumber - 1
            });
            var fields = {
                catalogType: 'catalogtype',
                subscriptionLine: 'subscriptionline',
                status: 'status',
                quantity: 'quantity',
                subscriptionLineType: 'subscriptionlinetype'
            };
            var serialized_line = SS2Utils.getFieldsAsObject(this.subscriptionRecord, fields, null, null, 'subscriptionline');
            if (data.action === 'SUSPEND' &&
                (!this.configuration.get('subscriptions.allowToCancelSuspendRequiredLines') &&
                    serialized_line.catalogType === 'REQUIRED')
            /* ||
            frequency == 'ONETIME'*/
            ) {
                throw 'This line is required and cannot be cancelled. Please contact your sales representative.';
            }
            if (data.quantity && serialized_line.quantity !== data.quantity) {
                if (this.configuration.get('subscriptions.disallowUpgradeQuantity') &&
                    serialized_line.quantity < data.quantity) {
                    throw 'You cannot upgrade your subscription. Please contact your sales representative.';
                }
                if (this.configuration.get('subscriptions.disallowDowngradeQuantity') &&
                    serialized_line.quantity > data.quantity) {
                    throw 'You cannot downgrade your subscription. Please contact your sales representative.';
                }
            }
            if (serialized_line.status === 'NOT_INCLUDED' && data.action !== 'SUSPEND') {
                this.subscriptionRecord.setCurrentSublistValue({
                    sublistId: 'subscriptionline',
                    fieldId: 'isincluded',
                    value: true
                });
                this.subscriptionRecord.commitLine({ sublistId: 'subscriptionline' });
                this.subscriptionRecord.save();
            }
            else if (serialized_line.status === 'SUSPENDED') {
                if (this.configuration.get('subscriptions.lineStatusChange') ===
                    'Allow Suspending / Resuming') {
                    this.performAction({ lineNumber: data.lineNumber, action: 'REACTIVATE' }, serialized_line.subscriptionLine, serialized_line.status);
                }
                else {
                    throw 'Reactivation of lines is not allowed. Please contact your sales representative.';
                }
            }
            if (['NOT_INCLUDED', 'DRAFT'].indexOf(serialized_line.status) >= 0 &&
                data.action !== 'SUSPEND') {
                record.submitFields({
                    type: record.Type.SUBSCRIPTION_LINE,
                    id: serialized_line.subscriptionLine,
                    values: {
                        subscriptionlinestatus: 'PENDING_ACTIVATION'
                    }
                });
            }
            if (data.action === 'SUSPEND') {
                this.performAction({ lineNumber: data.lineNumber, action: 'SUSPEND' }, serialized_line.subscriptionLine, serialized_line.status);
            }
            else if (['NOT_INCLUDED', 'DRAFT', 'PENDING_ACTIVATION'].indexOf(serialized_line.status) >= 0) {
                this.performAction({ lineNumber: data.lineNumber, action: 'ACTIVATE' }, serialized_line.subscriptionLine, serialized_line.status);
                if (data.quantity > 1 && serialized_line.subscriptionLineType !== 3) {
                    this.performAction({ lineNumber: data.lineNumber, quantity: data.quantity, action: 'MODIFY_PRICING' }, serialized_line.subscriptionLine, serialized_line.status);
                }
            }
            else if (data.quantity &&
                serialized_line.quantity !== data.quantity &&
                serialized_line.subscriptionLineType !== 3) {
                this.performAction({ lineNumber: data.lineNumber, quantity: data.quantity, action: 'MODIFY_PRICING' }, serialized_line.subscriptionLine, serialized_line.status);
            }
        };
        // Search for change orders for tomorrow and analyzing them if that is the case.
        SubscriptionsModel.prototype.searchExistingChangeOrders = function (action, check_for_update, subscription_ids, load) {
            var tomorrow = new Date();
            tomorrow.setDate(tomorrow.getDate() + 1);
            var matching_change_orders = [];
            var matching_change_orders_obj = {};
            var columns = ['internalid', 'effectivedate', 'action', 'subscription'];
            var filters = [
                [
                    'subscription',
                    subscription_ids ? search.Operator.ANYOF : search.Operator.IS,
                    subscription_ids || [this.subscriptionRecord.id]
                ],
                'and',
                [
                    'effectivedate',
                    search.Operator.ON,
                    format.format({
                        value: tomorrow,
                        type: format.Type.DATE
                    })
                ]
            ];
            if (!check_for_update) {
                if (action === 'MODIFY_PRICING') {
                    filters.push('and');
                    filters.push([
                        'action',
                        search.Operator.NONEOF,
                        ['MODIFY_PRICING', 'ACTIVATE', 'REACTIVATE']
                    ]);
                }
                else if (action) {
                    filters.push('and');
                    filters.push(['action', search.Operator.NONEOF, [action]]);
                }
            }
            else if (action) {
                filters.push('and');
                filters.push(['action', search.Operator.IS, [action]]);
            }
            SS2Utils.iterateAllSearchResults(search.Type.SUBSCRIPTION_CHANGE_ORDER, columns, filters, '', function (change_order) {
                var subscription_id = change_order.getValue('subscription').toString();
                if (load) {
                    change_order = record.load({
                        type: record.Type.SUBSCRIPTION_CHANGE_ORDER,
                        id: change_order.getValue('internalid').toString(),
                        isDynamic: true
                    });
                }
                if (subscription_ids) {
                    if (!matching_change_orders_obj[subscription_id]) {
                        matching_change_orders_obj[subscription_id] = [];
                    }
                    matching_change_orders_obj[subscription_id].push(change_order);
                }
                else {
                    matching_change_orders.push(change_order);
                }
            });
            return subscription_ids ? matching_change_orders_obj : matching_change_orders;
        };
        // Checking if the line to be updated is applied in any change order found
        // If that is the case an exception is raised
        // TODO: Remove this function, reuse the lines_changes
        SubscriptionsModel.prototype.checkChangeOrderIsNotForLine = function (change_order_internal_id, lineId, fail) {
            var lines = [];
            var change_order = record.load({
                type: record.Type.SUBSCRIPTION_CHANGE_ORDER,
                id: change_order_internal_id,
                isDynamic: true
            });
            SS2Utils.iterateSublist(change_order, 'subline', function () {
                var subscriptionline = change_order.getCurrentSublistText({
                    sublistId: 'subline',
                    fieldId: 'subscriptionline'
                });
                if (parseInt(subscriptionline) === lineId) {
                    var apply = change_order.getCurrentSublistValue({
                        sublistId: 'subline',
                        fieldId: 'apply'
                    });
                    if (apply) {
                        if (fail) {
                            throw new Error('Operation cannot be completed. Please contact your Sales Rep.');
                        }
                        else {
                            lines.push(subscriptionline);
                        }
                    }
                }
            });
            return lines;
        };
        SubscriptionsModel.prototype.updateExistantChangeOrder = function (action, lineId) {
            var change_order = record.load({
                type: record.Type.SUBSCRIPTION_CHANGE_ORDER,
                id: action.changeOrderId,
                isDynamic: true
            });
            var line_updated = false;
            SS2Utils.iterateSublist(change_order, 'subline', function () {
                var subscriptionline = change_order.getCurrentSublistText({
                    sublistId: 'subline',
                    fieldId: 'subscriptionline'
                });
                if (lineId) {
                    if (parseInt(subscriptionline) === parseInt(lineId)) {
                        if (action.quantity) {
                            change_order.setCurrentSublistValue({
                                sublistId: 'subline',
                                fieldId: 'quantitynew',
                                value: action.quantity
                            });
                        }
                        change_order.setCurrentSublistValue({
                            sublistId: 'subline',
                            fieldId: 'apply',
                            value: true
                        });
                        change_order.commitLine({ sublistId: 'subline' });
                        line_updated = true;
                        return false; //break
                    }
                }
                else {
                    var subscription_line_apply = change_order.getCurrentSublistValue({
                        sublistId: 'subline',
                        fieldId: 'apply'
                    });
                    if (!subscription_line_apply) {
                        change_order.setCurrentSublistValue({
                            sublistId: 'subline',
                            fieldId: 'apply',
                            value: true
                        });
                        line_updated = true;
                    }
                }
            });
            if (line_updated) {
                change_order.save();
            }
            return line_updated;
        };
        SubscriptionsModel.prototype.processSubscriptionAction = function (action) {
            var _this = this;
            var change_orders = this.searchExistingChangeOrders(null, true, null, true);
            var status = this.subscriptionRecord.getValue({ fieldId: 'billingsubscriptionstatus' });
            var change_order;
            var status_from;
            if (action === 'SUSPEND') {
                status_from = 'ACTIVE';
                var can_be_suspended = status === 'ACTIVE' &&
                    this.configuration.get('subscriptions.generalStatusChange') !==
                        "Don't Allow Status Changes" &&
                    !_.find(change_orders, function (co) {
                        return (co.getValue({ fieldId: 'action' }) !== 'SUSPEND' ||
                            _this.noActiveLinesInChangeOrder(co, 'SUSPEND'));
                    });
                if (!can_be_suspended) {
                    throw 'This subscription cannot be suspended. Try again tomorrow or contact your sales representative.';
                }
                change_order = _.find(change_orders, function (co) {
                    return co.getValue({ fieldId: 'action' }) === 'SUSPEND';
                });
            }
            else if (action === 'REACTIVATE') {
                status_from = 'SUSPENDED';
                var can_be_reactivated = status === 'SUSPENDED' &&
                    this.configuration.get('subscriptions.generalStatusChange') ===
                        'Allow Suspending / Resuming' &&
                    !_.find(change_orders, function (co) {
                        return (co.getValue({ fieldId: 'action' }) !== 'REACTIVATE' ||
                            _this.noActiveLinesInChangeOrder(co, 'REACTIVATE'));
                    });
                if (!can_be_reactivated) {
                    throw 'This subscription cannot be reactivated. Try again tomorrow or contact your sales representative.';
                }
                change_order = _.find(change_orders, function (co) {
                    return co.getValue({ fieldId: 'action' }) === 'REACTIVATE';
                });
            }
            if (!change_order) {
                var tomorrow = new Date();
                tomorrow.setDate(tomorrow.getDate() + 1);
                change_order = record.create({
                    type: record.Type.SUBSCRIPTION_CHANGE_ORDER,
                    isDynamic: true,
                    defaultValues: {
                        action: action,
                        subscription: this.subscriptionRecord.id,
                        effectivedate: format.format({ value: tomorrow, type: format.Type.DATE })
                    }
                });
            }
            var count = change_order.getLineCount({
                sublistId: 'subline'
            });
            for (var i = 0; i < count; i++) {
                change_order.selectLine({
                    sublistId: 'subline',
                    line: i
                });
                if (change_order.getCurrentSublistValue({
                    sublistId: 'subline',
                    fieldId: 'status'
                }) == status_from) {
                    change_order.setCurrentSublistValue({
                        sublistId: 'subline',
                        fieldId: 'apply',
                        value: true
                    });
                    change_order.commitLine({ sublistId: 'subline' });
                }
            }
            change_order.save();
        };
        SubscriptionsModel.prototype.performAction = function (action_request, lineId, currentLineStatus) {
            var _this = this;
            var tomorrow = new Date();
            tomorrow.setDate(tomorrow.getDate() + 1);
            var change_order_not_action = this.searchExistingChangeOrders(action_request.action, false);
            _.each(change_order_not_action, function (change_order) {
                _this.checkChangeOrderIsNotForLine(change_order.getValue('internalid'), lineId, true);
            });
            var change_order_for_update = this.searchExistingChangeOrders(action_request.action, true);
            if (change_order_for_update && change_order_for_update.length > 0) {
                this.updateExistantChangeOrder({ changeOrderId: change_order_for_update[0].id, quantity: action_request.quantity }, lineId);
            }
            else {
                var new_change_order = void 0;
                new_change_order = record.create({
                    type: record.Type.SUBSCRIPTION_CHANGE_ORDER,
                    isDynamic: true,
                    defaultValues: {
                        action: action_request.action,
                        subscription: this.subscriptionRecord.id,
                        effectivedate: format.format({ value: tomorrow, type: format.Type.DATE })
                    }
                });
                new_change_order.selectLine({
                    sublistId: 'subline',
                    line: action_request.lineNumber - 1
                });
                new_change_order.setCurrentSublistValue({
                    sublistId: 'subline',
                    fieldId: 'quantitynew',
                    value: action_request.quantity
                });
                new_change_order.setCurrentSublistValue({
                    sublistId: 'subline',
                    fieldId: 'apply',
                    value: true
                });
                new_change_order.commitLine({ sublistId: 'subline' });
                new_change_order.save();
            }
        };
        return SubscriptionsModel;
    }());
    exports.SubscriptionsModel = SubscriptionsModel;
});
