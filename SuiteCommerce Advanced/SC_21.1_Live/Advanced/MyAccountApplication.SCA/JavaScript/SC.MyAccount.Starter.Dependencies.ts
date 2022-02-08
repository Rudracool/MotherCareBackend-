/*
	© 2020 NetSuite Inc.
	User may not copy, modify, distribute, or re-bundle or otherwise make available this code;
	provided, however, if you are an authorized user with a NetSuite account or log-in, you
	may use this code subject to the terms that govern your access and use.
*/

/// <amd-module name="SC.MyAccount.Starter.Dependencies"/>

import '../../../Commons/Utilities/JavaScript/bootstrap';
import * as PageType from '../../../Commons/PageType/JavaScript/PageType';
import * as SCEnvironmentComponent from '../../SCA/JavaScript/SC.Environment.Component';
import * as GoogleMap from '../../StoreLocatorGoogleMapsImplementation/JavaScript/GoogleMap';
import * as GoogleMapConfiguration from '../../StoreLocatorGoogleMapsImplementation/JavaScript/GoogleMap.Configuration';
import * as BackboneViewPlugins from '../../../Commons/BackboneExtras/JavaScript/Backbone.View.Plugins';
import * as Location from '../../Location.SCA/JavaScript/Location';
import * as jQueryHtml from '../../../Commons/jQueryExtras/JavaScript/jQuery.html';
import * as MyAccountProfile from '../../../Commons/Profile/JavaScript/MyAccount.Profile';
import * as Overview from '../../Overview/JavaScript/Overview';
import * as PickupInStore from '../../PickupInStore/JavaScript/PickupInStore';
import * as NavigationHelper from '../../../Commons/NavigationHelper/JavaScript/NavigationHelper';
import * as NavigationHelperPluginsStandard from '../../../Commons/NavigationHelper/JavaScript/NavigationHelper.Plugins.Standard';
import * as NavigationHelperPluginsDataTouchPoint from '../../../Commons/NavigationHelper/JavaScript/NavigationHelper.Plugins.DataTouchPoint';
import * as NavigationHelperPluginsModals from '../../../Commons/NavigationHelper/JavaScript/NavigationHelper.Plugins.Modals';
import * as NavigationHelperPluginsPushers from '../../../Commons/NavigationHelper/JavaScript/NavigationHelper.Plugins.Pushers';
import * as Item from '../../../Commons/Item/JavaScript/Item';
import * as ProductViews from '../../../Commons/ProductViews/JavaScript/ProductViews';
import * as TransactionLineViews from '../../../Commons/Transaction.Line.Views/JavaScript/Transaction.Line.Views';
import * as Cart from '../../../Commons/Cart/JavaScript/Cart';
import * as Address from '../../../Commons/Address/JavaScript/Address';
import * as Content from '../../Content/JavaScript/Content';
import * as Categories from '../../../Commons/Categories/JavaScript/Categories';
import * as ExternalPayment from '../../ExternalPayment/JavaScript/ExternalPayment';
import * as OrderHistory from '../../OrderHistory/JavaScript/OrderHistory';
import * as ReturnAuthorization from '../../ReturnAuthorization/JavaScript/ReturnAuthorization';
import * as ReorderItems from '../../ReorderItems/JavaScript/ReorderItems';
import * as Receipt from '../../Receipt/JavaScript/Receipt';
import * as GoogleTagManager from '../../GoogleTagManager/JavaScript/GoogleTagManager';
import * as AjaxRequestsKiller from '../../../Commons/AjaxRequestsKiller/JavaScript/AjaxRequestsKiller';
import * as Merchandising from '../../Merchandising/JavaScript/Merchandising';
import * as Balance from '../../Balance/JavaScript/Balance';
import * as Invoice from '../../Invoice/JavaScript/Invoice';
import * as LivePayment from '../../LivePayment/JavaScript/LivePayment';
import * as PaymentWizard from '../../PaymentWizard/JavaScript/PaymentWizard';
import * as PaymentMethod from '../../PaymentMethod/JavaScript/PaymentMethod';
import * as TransactionHistory from '../../TransactionHistory/JavaScript/TransactionHistory';
import * as ProductListOnline from '../../ProductListOnline/JavaScript/ProductListOnline';
import * as PrintStatement from '../../PrintStatement/JavaScript/PrintStatement';
import * as Quote from '../../../Commons/Quote/JavaScript/Quote';
import * as QuoteToSalesOrderWizard from '../../QuoteToSalesOrderWizard/JavaScript/QuoteToSalesOrderWizard';
import * as CMSadapterInstaller from '../../CMSadapter/JavaScript/CMSadapterInstaller';
import * as RequestQuoteAccessPoints from '../../RequestQuoteAccessPoints/JavaScript/RequestQuoteAccessPoints';
import * as QuickOrderAccessPoints from '../../QuickOrderAccessPoints/JavaScript/QuickOrderAccessPoints';
import * as RequestQuoteWizard from '../../RequestQuoteWizard/JavaScript/RequestQuoteWizard';
import * as Case from '../../Case/JavaScript/Case';
import * as BrontoIntegration from '../../BrontoIntegration/JavaScript/BrontoIntegration';
import * as QuantityPricing from '../../QuantityPricing/JavaScript/QuantityPricing';
import * as QuickOrder from '../../QuickOrder/JavaScript/QuickOrder';
import * as StoreLocatorAccessPoints from '../../StoreLocatorAccessPoints/JavaScript/StoreLocatorAccessPoints';
import * as SCCCTHtml from '../../SC.CCT.Html/JavaScript/SC.CCT.Html';
import * as SearchComponent from '../../../Commons/Search/JavaScript/Search.Component';
import '../../../Commons/ExtensibilityLayer/JavaScript/SCModel';
import '../../../Commons/ExtensibilityLayer/JavaScript/SCCollection';
import '../../../Commons/ExtensibilityLayer/JavaScript/SCView';
import '../../../Commons/ExtensibilityLayer/JavaScript/SCFormView';
import '../../../Commons/ExtensibilityLayer/JavaScript/SCCollectionView';
import * as SiteSearch from '../../SiteSearch/JavaScript/SiteSearch';
import * as ProfileComponent from '../../../Commons/Profile/JavaScript/Profile.Component';
import '../../ExtensibilityLayerOnline/JavaScript/PageType.Base.View';
import * as MyAccountMenuComponent from '../../../Commons/MenuTree/JavaScript/MyAccountMenu.Component';
import * as LoggersConfigurationSCA from '../../Loggers.SCA/JavaScript/Loggers.Configuration.SCA';
import * as Header from '../../Header/JavaScript/Header';
import * as Subscriptions from '../../Subscriptions/JavaScript/Subscriptions';

import WizardModule = require('../../../Advanced/Wizard/JavaScript/Wizard.Module');

import GoogleUniversalAnalytics = require('../../GoogleUniversalAnalytics/JavaScript/GoogleUniversalAnalytics');

export const entryPointModules = [
    PageType,
    SCEnvironmentComponent,
    BackboneViewPlugins,
    WizardModule,
    Location,
    PickupInStore,
    jQueryHtml,
    MyAccountProfile,
    Overview,
    Item,
    ProductViews,
    TransactionLineViews,
    Cart,
    Address,
    Content,
    Categories,
    ExternalPayment,
    OrderHistory,
    ReturnAuthorization,
    ReorderItems,
    Receipt,
    NavigationHelper,
    NavigationHelperPluginsStandard,
    NavigationHelperPluginsDataTouchPoint,
    NavigationHelperPluginsModals,
    NavigationHelperPluginsPushers,
    AjaxRequestsKiller,
    GoogleUniversalAnalytics,
    GoogleTagManager,
    Merchandising,
    Balance,
    Invoice,
    LivePayment,
    PaymentWizard,
    PaymentMethod,
    TransactionHistory,
    ProductListOnline,
    PrintStatement,
    Quote,
    QuoteToSalesOrderWizard,
    RequestQuoteAccessPoints,
    QuickOrderAccessPoints,
    RequestQuoteWizard,
    Case,
    BrontoIntegration,
    CMSadapterInstaller,
    QuantityPricing,
    QuickOrder,
    GoogleMap,
    GoogleMapConfiguration,
    StoreLocatorAccessPoints,
    SCCCTHtml,
    SiteSearch,
    SearchComponent,
    ProfileComponent,
    MyAccountMenuComponent,
    LoggersConfigurationSCA,
    Header,
    Subscriptions
];
