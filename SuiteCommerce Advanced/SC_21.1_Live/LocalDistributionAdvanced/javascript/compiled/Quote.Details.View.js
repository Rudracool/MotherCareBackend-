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
define("Quote.Details.View", ["require", "exports", "underscore", "quote_details.tpl", "Utils", "QuoteToSalesOrderWizard.Configuration", "Quote.Model", "Transaction.Line.Views.Cell.Navigable.View", "Address.Details.View", "AjaxRequestsKiller", "UrlHelper", "PageTypeView", "ApplicationOnline", "Backbone.CollectionView"], function (require, exports, _, quote_details_tpl, Utils, QuoteToSalesOrderWizard_Configuration_1, Quote_Model_1, Transaction_Line_Views_Cell_Navigable_View_1, Address_Details_View_1, AjaxRequestsKiller_1, UrlHelper_1, PageTypeView_1, ApplicationOnline_1, BackboneCollectionView) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var QuoteDetailsView = /** @class */ (function (_super) {
        __extends(QuoteDetailsView, _super);
        function QuoteDetailsView(options) {
            var _this = _super.call(this, options) || this;
            _this.attributes = {
                id: 'QuotesDetail',
                class: 'QuoteDetails'
            };
            _this.template = quote_details_tpl;
            _this.title = Utils.translate('Quote Details');
            _this.getBreadcrumbPages = function () {
                return [
                    {
                        text: Utils.translate('Quotes'),
                        href: '/quotes'
                    },
                    {
                        text: Utils.translate('Quote #$(0)', _this.model.get('tranid') || ''),
                        href: '/quotes'
                    }
                ];
            };
            _this.configuration = options.application.getConfig();
            _this.model = new Quote_Model_1.QuoteModel({
                internalid: options.routerArguments[0]
            });
            _this.statusTranslationKeys = {
                INVALIDPERMISSION: Utils.translate('Not allowed'),
                INVALIDENTITYSTATUS: Utils.translate('Sales representative approval'),
                MISSINGSHIPMETHOD: Utils.translate('Shipping information'),
                MISSINGSHIPADDRESS: Utils.translate('Shipping information'),
                GIFTCERTIFICATENOTALLOWED: Utils.translate('Gift Certificate not allowed'),
                MISSINGSALESREP: Utils.translate('Sales Representative assigned')
            };
            return _this;
        }
        QuoteDetailsView.prototype.beforeShowContent = function () {
            return this.model.fetch({
                killerId: AjaxRequestsKiller_1.AjaxRequestsKiller.getKillerId()
            });
        };
        QuoteDetailsView.prototype.getSelectedMenu = function () {
            return 'quotes';
        };
        QuoteDetailsView.prototype.itemsWithHiddenPrice = function () {
            var lines = this.model.get('lines') ? this.model.get('lines').models : [];
            var itemsWithHiddenPrice = _.filter(lines, function (line) {
                return line.get('item').get('ispricevisible') === false;
            });
            return !!itemsWithHiddenPrice.length;
        };
        QuoteDetailsView.prototype.showContent = function () {
            var _this = this;
            this.billaddress = this.model.get('addresses').get(this.model.get('billaddress'));
            this.shipaddress = this.model.get('addresses').get(this.model.get('shipaddress'));
            var first_step = _.first(_.flatten(_.pluck(QuoteToSalesOrderWizard_Configuration_1.QuoteToSalesOrderWizardConfiguration.steps || [], 'steps')));
            this.reviewQuoteURL = (first_step && first_step.url) || '';
            this.reviewQuoteURL = UrlHelper_1.UrlHelper.setUrlParameter(this.reviewQuoteURL, 'quoteid', this.model.id);
            this.model.get('purchasablestatus').validationErrors = _.reject(this.model.get('purchasablestatus').validationErrors, function (error_code) {
                if (error_code === 'GIFTCERTIFICATENOTALLOWED') {
                    _this.showGiftCertificateMessage = true;
                    return true;
                }
                return false;
            });
            return this.options.application && this.options.application.getLayout().showContent(this);
        };
        QuoteDetailsView.prototype.getChildViews = function () {
            var _this = this;
            return {
                'Items.Collection': function () {
                    // TODO: Migrate to use CollectionView once that component is integrated to ML
                    return new BackboneCollectionView({
                        collection: _this.model.get('lines'),
                        childView: Transaction_Line_Views_Cell_Navigable_View_1.TransactionLineViewsCellNavigableView,
                        viewsPerRow: 1,
                        childViewOptions: {
                            navigable: _this.options.application instanceof ApplicationOnline_1.ApplicationOnline
                                ? !_this.options.application.isStandalone()
                                : false,
                            detail1Title: Utils.translate('Qty:'),
                            detail1: 'quantity',
                            detail2Title: Utils.translate('List price:'),
                            detail2: 'rate_formatted',
                            detail3Title: Utils.translate('Amount:'),
                            detail3: 'total_formatted',
                            isEstimateDone: (_this.model.get('purchasablestatus') &&
                                _this.model.get('purchasablestatus').isPurchasable) ||
                                _this.model.get('status').internalid !== 'Open'
                        }
                    });
                },
                'Billing.Address': function () {
                    return new Address_Details_View_1.AddressDetailsView({
                        model: _this.billaddress,
                        hideDefaults: true,
                        hideActions: true,
                        hideSelector: true
                    });
                }
            };
        };
        QuoteDetailsView.prototype.generateErrorMessages = function () {
            var _this = this;
            var results = _.map(this.model.get('purchasablestatus').validationErrors, function (error_key) {
                return _this.statusTranslationKeys[error_key] || Utils.translate('Unknown error');
            });
            if (this.itemsWithHiddenPrice()) {
                var priceNotVisibleMessage = Utils.translate('Missing price details for one or more items updated');
                results.push(priceNotVisibleMessage);
            }
            // If there two or more messages equal, this make a unique message
            return _.uniq(results);
        };
        QuoteDetailsView.prototype.hideSummaryPrices = function () {
            var currencySymbol = this.currency ? this.currency.symbol : '';
            this.summary.total_formatted = currencySymbol;
            this.summary.subtotal_formatted = currencySymbol;
            this.summary.discounttotal_formatted = currencySymbol;
            this.summary.discountrate_formatted = currencySymbol;
            this.summary.taxtotal_formatted = currencySymbol;
            this.quoteTotalFormatted = '';
        };
        QuoteDetailsView.prototype.getContext = function () {
            var lineItemsLength = _.reduce(this.model.get('lines').pluck('quantity'), function (accum, quantity) {
                return accum + quantity;
            }, 0);
            this.currency = Utils.getCurrencyByName(this.model.get('currency') ? this.model.get('currency').name : '');
            this.summary = this.model.get('summary');
            this.quoteTotalFormatted = this.summary.total_formatted;
            var allowToPurchase = this.model.get('allowToPurchase');
            var itemsWithHiddenPrice = this.itemsWithHiddenPrice();
            var priceVisible = (allowToPurchase && this.model.get('purchasablestatus').isPurchasable) ||
                !itemsWithHiddenPrice ||
                this.model.get('entitystatus').name !== '';
            if (!priceVisible) {
                this.hideSummaryPrices();
            }
            return {
                tranid: this.model.get('tranid') || '',
                model: this.model,
                lineItemsLength: lineItemsLength,
                entityStatusName: (this.model.get('entitystatus') && this.model.get('entitystatus').name) ||
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
                salesrepPhone: (this.model.get('salesrep') && this.model.get('salesrep').phone) ||
                    this.configuration.quote.defaultPhone,
                salesrepEmail: (this.model.get('salesrep') && this.model.get('salesrep').email) ||
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
                disableDownloadAsPDF: this.model.get('entitystatus').name === '' && itemsWithHiddenPrice,
                quoteTotalFormatted: this.quoteTotalFormatted
            };
        };
        return QuoteDetailsView;
    }(PageTypeView_1.PageTypeView));
    exports.QuoteDetailsView = QuoteDetailsView;
});

//# sourceMappingURL=Quote.Details.View.js.map
