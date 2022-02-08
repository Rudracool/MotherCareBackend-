/*
	© 2020 NetSuite Inc.
	User may not copy, modify, distribute, or re-bundle or otherwise make available this code;
	provided, however, if you are an authorized user with a NetSuite account or log-in, you
	may use this code subject to the terms that govern your access and use.
*/

/// <amd-module name="Quote.Details.View"/>
// @Typescript-partial

import * as _ from 'underscore';
import * as quote_details_tpl from 'quote_details.tpl';
import * as Utils from '../../Utilities/JavaScript/Utils';
import { QuoteToSalesOrderWizardConfiguration } from '../../../Advanced/QuoteToSalesOrderWizard/JavaScript/QuoteToSalesOrderWizard.Configuration';
import { QuoteModel, QuoteLine, Quote } from './Quote.Model';
import { TransactionLineViewsCellNavigableView } from '../../Transaction.Line.Views/JavaScript/Transaction.Line.Views.Cell.Navigable.View';
import { Configuration } from '../../ApplicationSkeleton/JavaScript/Application';
import { AddressDetailsView } from '../../Address/JavaScript/Address.Details.View';
import { AjaxRequestsKiller } from '../../AjaxRequestsKiller/JavaScript/AjaxRequestsKiller';
import { UrlHelper } from '../../UrlHelper/JavaScript/UrlHelper';
import { ChildViews } from '../../Core/JavaScript/View';
import {
    PageTypeView,
    PageTypeViewOptions,
    BreadCrumbPage
} from '../../Core/JavaScript/PageTypeView';
import { ApplicationOnline } from '../../../Advanced/SCA/JavaScript/ApplicationOnline';
// Remove this once Item.Collection migrated to use CollectionView instead of Backbone.Collection
import BackboneCollectionView = require('../../Backbone.CollectionView/JavaScript/Backbone.CollectionView');

interface QuoteDetailsContext {
    tranid: string;
    model: QuoteModel;
    lineItemsLength: number;
    entityStatusName: string;
    pdfUrl: string;
    reviewQuoteURL: string;
    showPromocode: boolean;
    showDiscount: boolean;
    showBillingAddress: boolean;
    showMessage: boolean;
    message: string;
    showMemo: boolean;
    memo: string;
    collapseElements: boolean;
    summary: Summary;
    duedate: string;
    hasDuedate: boolean;
    hasSalesrep: boolean;
    salesrepName: string;
    salesrepPhone: string;
    salesrepEmail: string;
    disclaimerSummary: string;
    disclaimer: string;
    purchaseValidationErrors: string[];
    isOpen: boolean;
    showOpenedAccordion: boolean;
    hasPermission: boolean;
    showHandlingCost: boolean;
    showGiftCertificateMessage: boolean;
    hasPermissionAndHasErrors: boolean;
    showQuoteStatus: boolean;
    hasItemsWithHiddenPrice: boolean;
    disableDownloadAsPDF: boolean;
    quoteTotalFormatted: string;
}

interface StatusTranslationKey {
    INVALIDPERMISSION: string;
    INVALIDENTITYSTATUS: string;
    MISSINGSHIPMETHOD: string;
    MISSINGSHIPADDRESS: string;
    GIFTCERTIFICATENOTALLOWED: string;
    MISSINGSALESREP: string;
}

interface Summary {
    total_formatted: string;
    subtotal_formatted: string;
    discounttotal_formatted: string;
    discountrate_formatted: string;
    taxtotal_formatted: string;
    handlingcost: string;
}

interface Currency {
    symbol: string;
}

export class QuoteDetailsView extends PageTypeView<QuoteDetailsContext, {}> {
    private model: QuoteModel;

    private readonly statusTranslationKeys: StatusTranslationKey;

    private billaddress: string;

    private shipaddress: string;

    private reviewQuoteURL: string;

    private summary: Summary;

    private currency: Currency;

    private showGiftCertificateMessage: boolean;

    private configuration: Configuration;

    private quoteTotalFormatted: string;

    public attributes = {
        id: 'QuotesDetail',
        class: 'QuoteDetails'
    };

    protected template = quote_details_tpl;

    protected title = Utils.translate('Quote Details');

    public constructor(options: PageTypeViewOptions) {
        super(options);

        this.configuration = options.application.getConfig();

        this.model = new QuoteModel({
            internalid: options.routerArguments[0]
        });

        this.statusTranslationKeys = {
            INVALIDPERMISSION: Utils.translate('Not allowed'),
            INVALIDENTITYSTATUS: Utils.translate('Sales representative approval'),
            MISSINGSHIPMETHOD: Utils.translate('Shipping information'),
            MISSINGSHIPADDRESS: Utils.translate('Shipping information'),
            GIFTCERTIFICATENOTALLOWED: Utils.translate('Gift Certificate not allowed'),
            MISSINGSALESREP: Utils.translate('Sales Representative assigned')
        };
    }

    public beforeShowContent<Quote>(): JQuery.Deferred<Quote> {
        return this.model.fetch({
            killerId: AjaxRequestsKiller.getKillerId()
        });
    }

    public getSelectedMenu(): string {
        return 'quotes';
    }

    public readonly getBreadcrumbPages = (): BreadCrumbPage[] => {
        return [
            {
                text: Utils.translate('Quotes'),
                href: '/quotes'
            },
            {
                text: Utils.translate('Quote #$(0)', this.model.get('tranid') || ''),
                href: '/quotes'
            }
        ];
    };

    private itemsWithHiddenPrice(): boolean {
        const lines = this.model.get('lines') ? this.model.get('lines').models : [];

        const itemsWithHiddenPrice = _.filter(
            lines,
            (line: QuoteLine): boolean => {
                return line.get('item').get('ispricevisible') === false;
            }
        );

        return !!itemsWithHiddenPrice.length;
    }

    public showContent(): JQuery.Promise<this> {
        this.billaddress = this.model.get('addresses').get(this.model.get('billaddress'));
        this.shipaddress = this.model.get('addresses').get(this.model.get('shipaddress'));

        const first_step = _.first(
            _.flatten(_.pluck(QuoteToSalesOrderWizardConfiguration.steps || [], 'steps'))
        );
        this.reviewQuoteURL = (first_step && first_step.url) || '';
        this.reviewQuoteURL = UrlHelper.setUrlParameter(
            this.reviewQuoteURL,
            'quoteid',
            this.model.id
        );

        this.model.get('purchasablestatus').validationErrors = _.reject(
            this.model.get('purchasablestatus').validationErrors,
            (error_code): boolean => {
                if (error_code === 'GIFTCERTIFICATENOTALLOWED') {
                    this.showGiftCertificateMessage = true;
                    return true;
                }
                return false;
            }
        );

        return this.options.application && this.options.application.getLayout().showContent(this);
    }

    public getChildViews(): ChildViews {
        return {
            'Items.Collection': () => {
                // TODO: Migrate to use CollectionView once that component is integrated to ML
                return new BackboneCollectionView({
                    collection: this.model.get('lines'),
                    childView: TransactionLineViewsCellNavigableView,
                    viewsPerRow: 1,
                    childViewOptions: {
                        navigable:
                            this.options.application instanceof ApplicationOnline
                                ? !this.options.application.isStandalone()
                                : false,

                        detail1Title: Utils.translate('Qty:'),
                        detail1: 'quantity',

                        detail2Title: Utils.translate('List price:'),
                        detail2: 'rate_formatted',

                        detail3Title: Utils.translate('Amount:'),
                        detail3: 'total_formatted',

                        isEstimateDone:
                            (this.model.get('purchasablestatus') &&
                                this.model.get('purchasablestatus').isPurchasable) ||
                            this.model.get('status').internalid !== 'Open'
                    }
                });
            },
            'Billing.Address': (): AddressDetailsView => {
                return new AddressDetailsView({
                    model: this.billaddress,
                    hideDefaults: true,
                    hideActions: true,
                    hideSelector: true
                });
            }
        };
    }

    private generateErrorMessages(): string[] {
        const results = _.map(
            this.model.get('purchasablestatus').validationErrors,
            (error_key: string): string => {
                return this.statusTranslationKeys[error_key] || Utils.translate('Unknown error');
            }
        );

        if (this.itemsWithHiddenPrice()) {
            const priceNotVisibleMessage = Utils.translate(
                'Missing price details for one or more items updated'
            );
            results.push(priceNotVisibleMessage);
        }

        // If there two or more messages equal, this make a unique message
        return _.uniq(results);
    }

    private hideSummaryPrices(): void {
        const currencySymbol: string = this.currency ? this.currency.symbol : '';

        this.summary.total_formatted = currencySymbol;
        this.summary.subtotal_formatted = currencySymbol;
        this.summary.discounttotal_formatted = currencySymbol;
        this.summary.discountrate_formatted = currencySymbol;
        this.summary.taxtotal_formatted = currencySymbol;
        this.quoteTotalFormatted = '';
    }

    public getContext(): QuoteDetailsContext {
        const lineItemsLength = _.reduce(
            this.model.get('lines').pluck('quantity'),
            function(accum: number, quantity: number): number {
                return accum + quantity;
            },
            0
        );

        this.currency = Utils.getCurrencyByName(
            this.model.get('currency') ? this.model.get('currency').name : ''
        );
        this.summary = this.model.get('summary');
        this.quoteTotalFormatted = this.summary.total_formatted;

        const allowToPurchase = this.model.get('allowToPurchase');
        const itemsWithHiddenPrice = this.itemsWithHiddenPrice();
        const priceVisible: boolean =
            (allowToPurchase && this.model.get('purchasablestatus').isPurchasable) ||
            !itemsWithHiddenPrice ||
            this.model.get('entitystatus').name !== '';

        if (!priceVisible) {
            this.hideSummaryPrices();
        }

        return {
            tranid: this.model.get('tranid') || '',
            model: this.model,
            lineItemsLength: lineItemsLength,
            entityStatusName:
                (this.model.get('entitystatus') && this.model.get('entitystatus').name) ||
                (this.model.get('status') && this.model.get('status').internalid) ||
                '',
            pdfUrl: Utils.getDownloadPdfUrl({
                asset: 'quote-details',
                id: this.model.get('internalid')
            }),
            reviewQuoteURL: this.reviewQuoteURL,
            showPromocode: !!this.model.get('promocode'),
            showDiscount: !!this.model.get('discount'),
            showBillingAddress: !!this.billaddress,
            showMessage: !!this.model.get('message'),
            message: this.model.get('message'),
            showMemo: !!this.model.get('memo'),
            memo: this.model.get('memo'),
            collapseElements: this.configuration.sca.collapseElements,
            summary: this.summary,
            duedate: this.model.get('duedate') || '',
            hasDuedate: !!this.model.get('duedate'),
            hasSalesrep: !!(this.model.get('salesrep') && this.model.get('salesrep').fullname),
            salesrepName: this.model.get('salesrep') && this.model.get('salesrep').fullname,
            salesrepPhone:
                (this.model.get('salesrep') && this.model.get('salesrep').phone) ||
                this.configuration.quote.defaultPhone,
            salesrepEmail:
                (this.model.get('salesrep') && this.model.get('salesrep').email) ||
                this.configuration.quote.defaultEmail,
            disclaimerSummary: Utils.translate(this.configuration.quote.disclaimerSummary || ''),
            disclaimer: Utils.translate(this.configuration.quote.disclaimer || ''),
            purchaseValidationErrors: this.generateErrorMessages(),
            isOpen: this.model.get('isOpen') && !this.configuration.isBasic,
            showOpenedAccordion: Utils.isTabletDevice() || Utils.isDesktopDevice(),
            hasPermission: allowToPurchase,
            showHandlingCost: !!this.summary.handlingcost,
            showGiftCertificateMessage: this.showGiftCertificateMessage,
            hasPermissionAndHasErrors: allowToPurchase && !!this.generateErrorMessages().length,
            showQuoteStatus: !!(this.model.get('status') && this.model.get('status').internalid),
            hasItemsWithHiddenPrice: itemsWithHiddenPrice,
            disableDownloadAsPDF:
                this.model.get('entitystatus').name === '' && itemsWithHiddenPrice,
            quoteTotalFormatted: this.quoteTotalFormatted
        };
    }
}
