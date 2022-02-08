/*
    © 2020 NetSuite Inc.
    User may not copy, modify, distribute, or re-bundle or otherwise make available this code;
    provided, however, if you are an authorized user with a NetSuite account or log-in, you
    may use this code subject to the terms that govern your access and use.
*/
define("ReturnAuthorization.Form.View", ["require", "exports", "underscore", "return_authorization_form.tpl", "Utils", "jQuery", "Configuration", "ListHeader.View", "AjaxRequestsKiller", "Transaction.Line.Collection", "ReturnAuthorization.GetReturnableLines", "Backbone.CollectionView", "Transaction.Line.Views.Cell.SelectableActionableNavigable.View", "ReturnAuthorization.Form.Item.Summary.View", "ReturnAuthorization.Form.Item.Actions.View", "Transaction.Line.Views.Cell.Navigable.View", "ReturnAuthorization.Model", "OrderHistory.Model", "Backbone", "Backbone.View"], function (require, exports, _, return_authorization_form_tpl, Utils, jQuery, Configuration_1, ListHeader_View_1, AjaxRequestsKiller_1, TransactionLineCollection, ReturnLinesCalculator, BackboneCollectionView, TransactionLineViewsCellSelectableActionableNavigableView, ReturnAuthorizationFormItemSummaryView, ReturnAuthorizationFormItemActionsView, Transaction_Line_Views_Cell_Navigable_View_1, ReturnAuthorizationModel, OrderHistoryModel, Backbone, BackboneView) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.ReturnAuthorizationFormView = BackboneView.extend({
        template: return_authorization_form_tpl,
        title: Utils.translate('Return Products'),
        page_header: Utils.translate('Return Products'),
        events: {
            'click [data-action="return-line"]': 'toggleSelectUnselectLine',
            'click [data-action="apply-reason"]': 'applyReasonHandler',
            'change [data-action="reasons"]': 'changeReasonHandler',
            'change [data-action="quantity"]': 'changeQuantityHandler',
            'blur [data-action="reason-text"]': 'textReasonHandler',
            'change [data-action="comments"]': 'changeCommentHandler',
            'submit form': 'saveForm'
        },
        attributes: {
            class: 'ReturnAuthorizationForm'
        },
        initialize: function (options) {
            var self = this;
            this.application = options.application;
            this.model = new ReturnAuthorizationModel({ recordtype: 'returnauthorization' });
            this.createdFromModel = new OrderHistoryModel({
                internalid: options.routerArguments[1],
                recordtype: options.routerArguments[0]
            });
            this.reasons = Configuration_1.Configuration.get('returnAuthorization.reasons', []);
            this.createdFromModel.once('sync', jQuery.proxy(this, 'initListHeader'));
            this.model.on('save', function () {
                Backbone.history.navigate("/returns/confirmation/" + self.model.get('recordtype') + "/" + self.model.get('internalid'), { trigger: true });
            });
        },
        beforeShowContent: function beforeShowContent() {
            return this.createdFromModel.fetch({
                killerId: AjaxRequestsKiller_1.AjaxRequestsKiller.getKillerId(),
                data: { recordtype: this.options.routerArguments[0] }
            });
        },
        getLinkedRecordUrl: function () {
            return "/purchases/view/" + this.createdFromModel.get('recordtype') + "/" + this.createdFromModel.get('internalid');
        },
        initListHeader: function () {
            var lines = this.getLines();
            this.listHeader = new ListHeader_View_1.ListHeaderView({
                view: this,
                application: this.application,
                hideFilterExpandable: true,
                collection: lines,
                selectable: true
            });
            if (lines.length === 1) {
                this.selectAll();
            }
            return this;
        },
        // @method getSelectedMenu
        getSelectedMenu: function () {
            return 'returns';
        },
        // @method getBreadcrumbPages
        getBreadcrumbPages: function () {
            return [
                {
                    text: Utils.translate('Returns'),
                    href: '/returns'
                },
                {
                    text: Utils.translate('Return products'),
                    href: '/returns'
                }
            ];
        },
        getLineId: function (target) {
            return this.$(target)
                .closest('[data-action="return-line"]')
                .data('id');
        },
        // @method unselectAll This method is called by the ListHeader when the 'select all' option is clicked
        selectAll: function () {
            return this.setLines({
                checked: true
            }).render();
        },
        // @method unselectAll This method is called by the ListHeader when the 'unselect all' option is clicked
        unselectAll: function () {
            return this.setLines({
                reason: null,
                checked: false,
                returnQty: null,
                textReason: null
            }).render();
        },
        setLines: function (attributes) {
            this.getLines().each(function (line) {
                line.set(attributes);
            });
            return this;
        },
        setActiveLines: function (attributes) {
            _.each(this.getActiveLines(), function (line) {
                line.set(attributes);
            });
            return this;
        },
        // @method toggleSelectUnselectLine This method is executed each time a line is selected/unselected
        toggleSelectUnselectLine: function (e) {
            var $target = this.$(e.target);
            if ($target.data('toggle') !== false) {
                this.toggleLine(this.getLineId($target));
            }
        },
        toggleLine: function (id) {
            var line = this.getLine(id);
            line.set('checked', !line.get('checked'));
            if (!line.get('checked')) {
                line.set({
                    reason: null,
                    returnQty: null,
                    textReason: null
                });
            }
            return this.render();
        },
        // Set in the model which lines are returnable (these are left in the lines property with its quantities updated) and which are already returned
        // (these are saved in invalidLines collection in the current model)
        parseLines: function () {
            var not_consider_fulfillments = this.createdFromModel.get('recordtype') !== 'salesorder';
            var returnable_calculator = new ReturnLinesCalculator(this.createdFromModel, {
                notConsiderFulfillments: not_consider_fulfillments
            });
            var lines_group = returnable_calculator.calculateLines();
            var lines = this.createdFromModel.get('lines');
            this.createdFromModel.set('invalidLines', new TransactionLineCollection(lines_group.invalidLines));
            lines.remove(lines_group.invalidLines);
            lines.each(function (line) {
                line.set('quantity', lines_group.validLineIdsQuantities[line.id]);
            });
            return this;
        },
        getLines: function () {
            return this.lines || (this.lines = this.parseLines().createdFromModel.get('lines'));
        },
        getLine: function (id) {
            return this.getLines().get(id);
        },
        getActiveLines: function () {
            return this.getLines().filter(function (line) {
                return line.get('checked');
            });
        },
        getTotalItemsToReturn: function () {
            return _.reduce(this.getActiveLines(), function (memo, line) {
                return memo + parseFloat(line.get('returnQty') || line.get('quantity'));
            }, 0);
        },
        changeQuantityHandler: function (e) {
            var target = e.target;
            var line_id = this.getLineId(target);
            return this.setLine(line_id, 'returnQty', Math.min(target.value, this.getLine(line_id).get('quantity'))).render();
        },
        changeReasonHandler: function (e) {
            var target = e.target;
            var line_id = this.getLineId(target);
            var selected_reason = _.findWhere(this.reasons, { id: +target.value });
            this.setLine(line_id, 'reason', selected_reason).render();
            this.$("[data-action=\"return-line\"][data-id=\"" + line_id + "\"] input[name=\"reason-text\"]").focus();
        },
        textReasonHandler: function (e) {
            var target = e.target;
            return this.setLine(this.getLineId(target), 'textReason', target.value);
        },
        changeCommentHandler: function (e) {
            this.comments = e.target.value;
            return this;
        },
        setLine: function (id, attribute, value) {
            this.getLine(id).set(attribute, value);
            return this;
        },
        applyReasonHandler: function (e) {
            var current_line = this.getLine(this.getLineId(e.target));
            e.preventDefault();
            e.stopPropagation();
            return this.setActiveLines({
                reason: current_line.get('reason'),
                textReason: current_line.get('textReason')
            }).render();
        },
        saveForm: function (e) {
            var created_from = this.createdFromModel;
            var data = {
                id: created_from.get('internalid'),
                type: created_from.get('recordtype'),
                lines: this.getActiveLinesData(),
                comments: this.comments || ''
            };
            e.preventDefault();
            if (this.isValid(data)) {
                return BackboneView.prototype.saveForm.call(this, e, this.model, data);
            }
        },
        isValid: function (data) {
            var self = this;
            var lines = data.lines;
            var errors = [];
            var comments = data.comments;
            var no_reason_lines = _.filter(lines, function (line) {
                return !line.reason;
            });
            var big_reason_lines = _.filter(lines, function (line) {
                return line.reason && line.reason.length > 4000;
            });
            if (!lines.length) {
                errors.push(Utils.translate('You must select at least one item for this return request.'));
            }
            if (no_reason_lines.length) {
                _.each(no_reason_lines, function (line) {
                    self.$("[data-id=\"" + line.id + "\"] .control-group").addClass('error');
                });
                errors.push(Utils.translate('You must select a reason for return.'));
            }
            if (big_reason_lines.length) {
                _.each(big_reason_lines, function (line) {
                    self.$("[data-id=\"" + line.id + "\"] .control-group").addClass('error');
                });
                errors.push(Utils.translate('The reason contains more that the maximum number (4000) of characters allowed.'));
            }
            if (comments && comments.length > 999) {
                errors.push(Utils.translate('The comment contains more than the maximum number (999) of characters allowed.'));
            }
            if (errors.length) {
                return this.showError(errors.join('<br/>'));
            }
            return true;
        },
        getActiveLinesData: function () {
            var reason = null;
            var selected_reason;
            return _.map(this.getActiveLines(), function (line) {
                reason = line.get('reason');
                selected_reason = null;
                if (reason) {
                    selected_reason = reason.isOther ? line.get('textReason') : reason.text;
                }
                return {
                    id: line.get('internalid'),
                    quantity: line.get('returnQty') || line.get('quantity'),
                    reason: selected_reason
                };
            });
        },
        childViews: {
            ListHeader: function () {
                return this.listHeader;
            },
            'Returnable.Lines.Collection': function () {
                return new BackboneCollectionView({
                    collection: this.getLines(),
                    childView: TransactionLineViewsCellSelectableActionableNavigableView,
                    viewsPerRow: 1,
                    childViewOptions: {
                        SummaryView: ReturnAuthorizationFormItemSummaryView,
                        ActionsView: ReturnAuthorizationFormItemActionsView,
                        actionsOptions: {
                            activeLinesLength: this.getActiveLines().length || 0,
                            reasons: this.reasons
                        },
                        application: this.application,
                        navigable: !this.application.isStandalone(),
                        actionType: 'return-line'
                    }
                });
            },
            'Invalid.Lines.Collection': function () {
                return new BackboneCollectionView({
                    collection: this.createdFromModel.get('invalidLines'),
                    childView: Transaction_Line_Views_Cell_Navigable_View_1.TransactionLineViewsCellNavigableView,
                    viewsPerRow: 1,
                    childViewOptions: {
                        navigable: !this.application.isStandalone(),
                        detail1Title: Utils.translate('Qty:'),
                        detail1: 'quantity',
                        detail2Title: Utils.translate('Unit price'),
                        detail2: 'rate_formatted',
                        detail3Title: Utils.translate('Amount:'),
                        detail3: 'total_formatted',
                        ignorePriceVisibility: true
                    }
                });
            }
        },
        // @method getContext @return ReturnAuthorization.Form.View.Context
        getContext: function () {
            var active_lines = this.getActiveLines();
            var items_to_return_length = this.getTotalItemsToReturn();
            var invalid_lines = this.createdFromModel.get('invalidLines');
            // @class ReturnAuthorization.Form.View.Context
            return {
                // @property {OrderHistory.Model} model
                model: this.createdFromModel,
                // @property {String} pageHeader
                pageHeader: this.page_header,
                // @property {String} createdFromURL
                createdFromURL: this.getLinkedRecordUrl(),
                // @property {Boolean} activeLinesLengthGreaterThan1
                activeLinesLengthGreaterThan1: active_lines.length > 1,
                // @property {Number} activeLinesLength
                activeLinesLength: active_lines.length,
                // @property {Boolean} hasAtLeastOneActiveLine
                hasAtLeastOneActiveLine: !!active_lines.length,
                // @property {Booelan} itemsToReturnLengthGreaterThan1
                itemsToReturnLengthGreaterThan1: items_to_return_length > 1,
                // @property {Number} itemsToReturnLength
                itemsToReturnLength: items_to_return_length,
                // @property {Booelan} showInvalidLines
                showInvalidLines: !!invalid_lines.length,
                // @property {Number} invalidLinesLength
                invalidLinesLength: invalid_lines.length,
                // @property {String} comments
                comments: this.comments || '',
                // @property {Boolean} showBackToAccount
                showBackToAccount: Configuration_1.Configuration.get('siteSettings.sitetype') === 'STANDARD'
            };
        }
    });
});

//# sourceMappingURL=ReturnAuthorization.Form.View.js.map
