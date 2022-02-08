/*
	© 2020 NetSuite Inc.
	User may not copy, modify, distribute, or re-bundle or otherwise make available this code;
	provided, however, if you are an authorized user with a NetSuite account or log-in, you
	may use this code subject to the terms that govern your access and use.
*/

/// <amd-module name="Case.List.View"/>
/// <reference path="../../../Commons/Utilities/JavaScript/GlobalDeclarations.d.ts" />
// @Typescript-full

import * as _ from 'underscore';
import * as case_list_tpl from 'case_list.tpl';
import * as Utils from '../../../Commons/Utilities/JavaScript/Utils';
import { CaseCollection } from './Case.Collection';
import {
    FilterOptions,
    MyAccountListView,
    SortOptions
} from '../../RecordViews/JavaScript/MyAccountListView';
import { CaseFieldsModel } from './Case.Fields.Model';
import { ListHeaderView } from '../../../Commons/ListHeader/JavaScript/ListHeader.View';
import { BreadCrumbPage, PageTypeViewOptions } from '../../../Commons/Core/JavaScript/PageTypeView';
import { CaseFieldText } from '../../../ServiceContract/SC/Case/Case';
import { CaseModel } from './Case.Model';
import { CaseListItemElement, CaseListItemsCollectionView } from './CaseListItemsCollectionView';
import { jQuery } from '../../../Commons/Core/JavaScript/jquery/JQueryExtras';
import { ChildViews } from '../../../Commons/Core/JavaScript/View';
import { GlobalViewsPaginationView } from '../../../Commons/GlobalViews/JavaScript/GlobalViews.Pagination.View';
import { GlobalViewsShowingCurrentView } from '../../../Commons/GlobalViews/JavaScript/GlobalViews.ShowingCurrent.View';
import { AjaxRequestsKiller } from '../../../Commons/AjaxRequestsKiller/JavaScript/AjaxRequestsKiller';

interface CaseListViewContext {
    pageHeader: string;
    hasCases: number;
    isLoading: boolean;
    showPagination: boolean;
    showCurrentPage: boolean;
    showBackToAccount: boolean;
}

export class CaseListView extends MyAccountListView<CaseCollection, CaseListViewContext> {
    protected template = case_list_tpl;

    protected title = Utils.translate('Support Cases');

    protected pageHeader = Utils.translate('Support Cases');

    private sortOptions: SortOptions[] = [
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

    public attributes = {
        id: 'CasesList',
        class: 'caseManagement'
    };

    protected collection: CaseCollection;

    private readonly fields: CaseFieldsModel;

    private isLoading: boolean;

    private readonly listHeader: ListHeaderView;

    private newCaseMessage: string;

    private newCaseInternalId: string;

    private informNewCase: boolean;

    private readonly showCurrentPage: boolean;

    public constructor(options: PageTypeViewOptions) {
        super(options);
        this.collection = new CaseCollection();
        this.fields = new CaseFieldsModel();
        this.isLoading = true;
        this.listenCollection();
        this.listHeader = this.setupListHeader();
        this.showCurrentPage = true;
        this.informNewCase = false;
        this.newCaseInternalId = '';
        this.newCaseMessage = '';
    }

    protected setupListHeader(): ListHeaderView {
        return new ListHeaderView({
            view: this,
            application: this.options.application,
            collection: this.collection,
            sorts: this.sortOptions,
            hidePagination: true
        });
    }

    private setLoading(value: boolean): void {
        this.isLoading = value;
    }

    private listenCollection(): void {
        this.collection.on(
            'reset',
            (): void => {
                this.setLoading(false);
                this.render();
            }
        );
        this.collection.on(
            'request',
            (): void => {
                this.setLoading(true);
            }
        );
    }

    public beforeShowContent<CaseFieldsModel>(): Promise<CaseFieldsModel> {
        const self = this;
        return this.fields
            .fetch({
                killerId: AjaxRequestsKiller.getKillerId()
            })
            .then(
                (): void => {
                    self.listHeader.filters = self.initializeFilterOptions();
                    if (self.options.application.getLayout().getCurrentView()) {
                        const { newCaseId } = self.options.application.getLayout().getCurrentView();
                        const {
                            newCaseMessage
                        } = self.options.application.getLayout().getCurrentView();
                        if (newCaseMessage && newCaseId) {
                            self.newCaseMessage = newCaseMessage;
                            self.newCaseInternalId = newCaseId;
                            self.informNewCase = true;
                            delete self.options.application.getLayout().getCurrentView().newCaseId;
                            delete self.options.application.getLayout().getCurrentView()
                                .newCaseMessage;
                        }
                    }
                }
            );
    }

    // Array of default filter options
    // filters always apply on the original collection
    private initializeFilterOptions(): FilterOptions[] {
        const filterOptions: FilterOptions[] = [
            {
                value: 'all',
                name: Utils.translate('Show All Statuses'),
                selected: true
            }
        ];

        const statuses: CaseFieldText[] = this.fields ? this.fields.get('statuses') : [];

        _.each(statuses, function(status: CaseFieldText): void {
            const filterOption: FilterOptions = {
                value: status.id,
                name: status.text
            };
            filterOptions.push(filterOption);
        });

        return filterOptions;
    }

    protected getSelectedMenu(): string {
        return 'cases_all';
    }

    public getBreadcrumbPages = (): BreadCrumbPage[] => {
        return [
            {
                text: this.title,
                href: '/cases'
            }
        ];
    };

    public render(): this {
        super.render();
        if (this.informNewCase) {
            this.informNewCaseCreation();

            if (!this.isLoading) {
                this.informNewCase = false;
            }
        }
        return this;
    }

    private informNewCaseCreation(): void {
        this.highlightNewCase(this.newCaseInternalId);
        if (this.newCaseMessage) {
            this.options.application.getLayout().showConfirmationMessage(this.newCaseMessage);
        }
    }

    private highlightNewCase(internalId: string): void {
        const $list_dom = jQuery(this.el).find(`a[data-id=${internalId}]`);

        if ($list_dom && $list_dom.length === 1) {
            $list_dom.addClass('case-list-new-case-highlight');

            setTimeout(function(): void {
                $list_dom.removeClass('case-list-new-case-highlight');
            }, 3000);
        }
    }

    protected getChildViews(): ChildViews {
        return {
            'Case.List.Items': (): CaseListItemsCollectionView => {
                const recordsCollection: CaseListItemElement[] = this.collection.map(function(
                    current_case: CaseModel
                ): CaseListItemElement {
                    return {
                        title: Utils.translate('Case #$(0)', current_case.get('caseNumber')),
                        detailsURL: `#/cases/${current_case.get('internalid')}`,
                        internalid: `${current_case.get('internalid')}`,

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

                return new CaseListItemsCollectionView(recordsCollection);
            },
            'GlobalViews.Pagination': (): GlobalViewsPaginationView => {
                return new GlobalViewsPaginationView(
                    _.extend(
                        {
                            totalPages: Math.ceil(
                                this.collection.totalRecordsFound / this.collection.recordsPerPage
                            )
                        },
                        this.options.application.getConfig().defaultPaginationSettings
                    )
                );
            },
            'GlobalViews.ShowCurrentPage': (): GlobalViewsShowingCurrentView => {
                return new GlobalViewsShowingCurrentView({
                    items_per_page: this.collection.recordsPerPage,
                    total_items: this.collection.totalRecordsFound,
                    total_pages: Math.ceil(
                        this.collection.totalRecordsFound / this.collection.recordsPerPage
                    )
                });
            },
            'List.Header': (): ListHeaderView => {
                return this.listHeader;
            }
        };
    }

    public getContext(): CaseListViewContext {
        return {
            pageHeader: this.pageHeader,
            hasCases: this.collection.length,
            isLoading: this.isLoading,
            showPagination: !!(this.collection.totalRecordsFound && this.collection.recordsPerPage),
            showCurrentPage: this.showCurrentPage,
            showBackToAccount:
                this.options.application.getConfig().siteSettings.sitetype === 'STANDARD'
        };
    }
}
