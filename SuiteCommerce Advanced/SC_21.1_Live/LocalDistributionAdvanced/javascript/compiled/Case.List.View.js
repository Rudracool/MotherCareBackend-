/*
    © 2020 NetSuite Inc.
    User may not copy, modify, distribute, or re-bundle or otherwise make available this code;
    provided, however, if you are an authorized user with a NetSuite account or log-in, you
    may use this code subject to the terms that govern your access and use.
*/
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
define("Case.List.View", ["require", "exports", "underscore", "case_list.tpl", "Utils", "Case.Collection", "MyAccountListView", "Case.Fields.Model", "ListHeader.View", "CaseListItemsCollectionView", "JQueryExtras", "GlobalViews.Pagination.View", "GlobalViews.ShowingCurrent.View", "AjaxRequestsKiller"], function (require, exports, _, case_list_tpl, Utils, Case_Collection_1, MyAccountListView_1, Case_Fields_Model_1, ListHeader_View_1, CaseListItemsCollectionView_1, JQueryExtras_1, GlobalViews_Pagination_View_1, GlobalViews_ShowingCurrent_View_1, AjaxRequestsKiller_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var CaseListView = /** @class */ (function (_super) {
        __extends(CaseListView, _super);
        function CaseListView(options) {
            var _this = _super.call(this, options) || this;
            _this.template = case_list_tpl;
            _this.title = Utils.translate('Support Cases');
            _this.pageHeader = Utils.translate('Support Cases');
            _this.sortOptions = [
                {
                    value: 'caseNumber',
                    name: Utils.translate('by Case number'),
                    selected: true
                },
                {
                    value: 'createdDate',
                    name: Utils.translate('by Creation date')
                },
                {
                    value: 'lastMessageDate',
                    name: Utils.translate('by Last Message date')
                }
            ];
            _this.attributes = {
                id: 'CasesList',
                class: 'caseManagement'
            };
            _this.getBreadcrumbPages = function () {
                return [
                    {
                        text: _this.title,
                        href: '/cases'
                    }
                ];
            };
            _this.collection = new Case_Collection_1.CaseCollection();
            _this.fields = new Case_Fields_Model_1.CaseFieldsModel();
            _this.isLoading = true;
            _this.listenCollection();
            _this.listHeader = _this.setupListHeader();
            _this.showCurrentPage = true;
            _this.informNewCase = false;
            _this.newCaseInternalId = '';
            _this.newCaseMessage = '';
            return _this;
        }
        CaseListView.prototype.setupListHeader = function () {
            return new ListHeader_View_1.ListHeaderView({
                view: this,
                application: this.options.application,
                collection: this.collection,
                sorts: this.sortOptions,
                hidePagination: true
            });
        };
        CaseListView.prototype.setLoading = function (value) {
            this.isLoading = value;
        };
        CaseListView.prototype.listenCollection = function () {
            var _this = this;
            this.collection.on('reset', function () {
                _this.setLoading(false);
                _this.render();
            });
            this.collection.on('request', function () {
                _this.setLoading(true);
            });
        };
        CaseListView.prototype.beforeShowContent = function () {
            var self = this;
            return this.fields
                .fetch({
                killerId: AjaxRequestsKiller_1.AjaxRequestsKiller.getKillerId()
            })
                .then(function () {
                self.listHeader.filters = self.initializeFilterOptions();
                if (self.options.application.getLayout().getCurrentView()) {
                    var newCaseId = self.options.application.getLayout().getCurrentView().newCaseId;
                    var newCaseMessage = self.options.application.getLayout().getCurrentView().newCaseMessage;
                    if (newCaseMessage && newCaseId) {
                        self.newCaseMessage = newCaseMessage;
                        self.newCaseInternalId = newCaseId;
                        self.informNewCase = true;
                        delete self.options.application.getLayout().getCurrentView().newCaseId;
                        delete self.options.application.getLayout().getCurrentView()
                            .newCaseMessage;
                    }
                }
            });
        };
        // Array of default filter options
        // filters always apply on the original collection
        CaseListView.prototype.initializeFilterOptions = function () {
            var filterOptions = [
                {
                    value: 'all',
                    name: Utils.translate('Show All Statuses'),
                    selected: true
                }
            ];
            var statuses = this.fields ? this.fields.get('statuses') : [];
            _.each(statuses, function (status) {
                var filterOption = {
                    value: status.id,
                    name: status.text
                };
                filterOptions.push(filterOption);
            });
            return filterOptions;
        };
        CaseListView.prototype.getSelectedMenu = function () {
            return 'cases_all';
        };
        CaseListView.prototype.render = function () {
            _super.prototype.render.call(this);
            if (this.informNewCase) {
                this.informNewCaseCreation();
                if (!this.isLoading) {
                    this.informNewCase = false;
                }
            }
            return this;
        };
        CaseListView.prototype.informNewCaseCreation = function () {
            this.highlightNewCase(this.newCaseInternalId);
            if (this.newCaseMessage) {
                this.options.application.getLayout().showConfirmationMessage(this.newCaseMessage);
            }
        };
        CaseListView.prototype.highlightNewCase = function (internalId) {
            var $list_dom = JQueryExtras_1.jQuery(this.el).find("a[data-id=" + internalId + "]");
            if ($list_dom && $list_dom.length === 1) {
                $list_dom.addClass('case-list-new-case-highlight');
                setTimeout(function () {
                    $list_dom.removeClass('case-list-new-case-highlight');
                }, 3000);
            }
        };
        CaseListView.prototype.getChildViews = function () {
            var _this = this;
            return {
                'Case.List.Items': function () {
                    var recordsCollection = _this.collection.map(function (current_case) {
                        return {
                            title: Utils.translate('Case #$(0)', current_case.get('caseNumber')),
                            detailsURL: "#/cases/" + current_case.get('internalid'),
                            internalid: "" + current_case.get('internalid'),
                            columns: [
                                {
                                    label: Utils.translate('Subject:'),
                                    type: 'subject',
                                    name: 'subject',
                                    value: current_case.get('title')
                                },
                                {
                                    label: Utils.translate('Creation Date:'),
                                    type: 'creation-date',
                                    name: 'creation-date',
                                    value: current_case.get('createdDate').split(' ')[0]
                                },
                                {
                                    label: Utils.translate('Last Message:'),
                                    type: 'date',
                                    name: 'last-message',
                                    value: current_case.get('lastMessageDate').split(' ')[0]
                                },
                                {
                                    label: Utils.translate('Status:'),
                                    type: 'status',
                                    name: 'status',
                                    value: _.isObject(current_case.get('status'))
                                        ? current_case.get('status').name
                                        : current_case.get('status').name
                                }
                            ]
                        };
                    });
                    return new CaseListItemsCollectionView_1.CaseListItemsCollectionView(recordsCollection);
                },
                'GlobalViews.Pagination': function () {
                    return new GlobalViews_Pagination_View_1.GlobalViewsPaginationView(_.extend({
                        totalPages: Math.ceil(_this.collection.totalRecordsFound / _this.collection.recordsPerPage)
                    }, _this.options.application.getConfig().defaultPaginationSettings));
                },
                'GlobalViews.ShowCurrentPage': function () {
                    return new GlobalViews_ShowingCurrent_View_1.GlobalViewsShowingCurrentView({
                        items_per_page: _this.collection.recordsPerPage,
                        total_items: _this.collection.totalRecordsFound,
                        total_pages: Math.ceil(_this.collection.totalRecordsFound / _this.collection.recordsPerPage)
                    });
                },
                'List.Header': function () {
                    return _this.listHeader;
                }
            };
        };
        CaseListView.prototype.getContext = function () {
            return {
                pageHeader: this.pageHeader,
                hasCases: this.collection.length,
                isLoading: this.isLoading,
                showPagination: !!(this.collection.totalRecordsFound && this.collection.recordsPerPage),
                showCurrentPage: this.showCurrentPage,
                showBackToAccount: this.options.application.getConfig().siteSettings.sitetype === 'STANDARD'
            };
        };
        return CaseListView;
    }(MyAccountListView_1.MyAccountListView));
    exports.CaseListView = CaseListView;
});

//# sourceMappingURL=Case.List.View.js.map
