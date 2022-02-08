/*
	© 2020 NetSuite Inc.
	User may not copy, modify, distribute, or re-bundle or otherwise make available this code;
	provided, however, if you are an authorized user with a NetSuite account or log-in, you
	may use this code subject to the terms that govern your access and use.
*/

/// <amd-module name="SC.Checkout.Starter.Dependencies"/>
// Auto generated at build time using configuration from distro.json

import '../../../Commons/Utilities/JavaScript/bootstrap';
import * as PageType from '../../../Commons/PageType/JavaScript/PageType';
import * as SCEnvironmentComponent from '../../SCA/JavaScript/SC.Environment.Component';
import * as GoogleMap from '../../StoreLocatorGoogleMapsImplementation/JavaScript/GoogleMap';
import * as GoogleMapConfiguration from '../../StoreLocatorGoogleMapsImplementation/JavaScript/GoogleMap.Configuration';
import * as BackboneViewPlugins from '../../../Commons/BackboneExtras/JavaScript/Backbone.View.Plugins';
import * as Location from '../../Location.SCA/JavaScript/Location';
import * as jQueryHtml from '../../../Commons/jQueryExtras/JavaScript/jQuery.html';
import * as PickupInStore from '../../PickupInStore/JavaScript/PickupInStore';
import * as CheckoutProfile from '../../../Commons/Profile/JavaScript/Checkout.Profile';

import * as NavigationHelper from '../../../Commons/NavigationHelper/JavaScript/NavigationHelper';
import * as NavigationHelperPluginsStandard from '../../../Commons/NavigationHelper/JavaScript/NavigationHelper.Plugins.Standard';
import * as NavigationHelperPluginsDataTouchPoint from '../../../Commons/NavigationHelper/JavaScript/NavigationHelper.Plugins.DataTouchPoint';
import * as NavigationHelperPluginsModals from '../../../Commons/NavigationHelper/JavaScript/NavigationHelper.Plugins.Modals';
import * as NavigationHelperPluginsPushers from '../../../Commons/NavigationHelper/JavaScript/NavigationHelper.Plugins.Pushers';
import * as Item from '../../../Commons/Item/JavaScript/Item';
import * as ProductViews from '../../../Commons/ProductViews/JavaScript/ProductViews';
import * as TransactionLineViews from '../../../Commons/Transaction.Line.Views/JavaScript/Transaction.Line.Views';
import * as Cart from '../../../Commons/Cart/JavaScript/Cart';
import * as LoginRegister from '../../LoginRegister/JavaScript/LoginRegister';
import * as Content from '../../Content/JavaScript/Content';
import * as Address from '../../../Commons/Address/JavaScript/Address';
import * as CustomFields from '../../../Commons/CustomFields/JavaScript/CustomFields';
import * as OrderWizard from '../../OrderWizard/JavaScript/OrderWizard';
import * as PaymentMethod from '../../PaymentMethod/JavaScript/PaymentMethod';
import * as Categories from '../../../Commons/Categories/JavaScript/Categories';
import * as ExternalPayment from '../../ExternalPayment/JavaScript/ExternalPayment';
import * as GoogleTagManager from '../../GoogleTagManager/JavaScript/GoogleTagManager';
import * as SocialSharing from '../../SocialSharing/JavaScript/SocialSharing';
import * as SocialSharingPluginsFacebook from '../../SocialSharing/JavaScript/SocialSharing.Plugins.Facebook';
import * as SocialSharingPluginsTwitter from '../../SocialSharing/JavaScript/SocialSharing.Plugins.Twitter';
import * as SocialSharingPluginsGooglePlus from '../../SocialSharing/JavaScript/SocialSharing.Plugins.GooglePlus';
import * as SocialSharingPluginsPinterest from '../../SocialSharing/JavaScript/SocialSharing.Plugins.Pinterest';
import * as SocialSharingPluginsPinterestHover from '../../SocialSharing/JavaScript/SocialSharing.Plugins.Pinterest.Hover';
import * as SocialSharingPluginsAddThis from '../../SocialSharing/JavaScript/SocialSharing.Plugins.AddThis';
import { AjaxRequestsKiller } from '../../../Commons/AjaxRequestsKiller/JavaScript/AjaxRequestsKiller';
import * as ImageNotAvailable from '../../ImageNotAvailable/JavaScript/ImageNotAvailable';
import * as Merchandising from '../../Merchandising/JavaScript/Merchandising';
import * as CheckoutSkipLogin from '../../CheckoutSkipLogin/JavaScript/CheckoutSkipLogin';

import * as CMSadapterInstaller from '../../CMSadapter/JavaScript/CMSadapterInstaller';
import * as RequestQuoteAccessPoints from '../../RequestQuoteAccessPoints/JavaScript/RequestQuoteAccessPoints';
import * as QuickOrderAccessPoints from '../../QuickOrderAccessPoints/JavaScript/QuickOrderAccessPoints';
import * as RequestQuoteWizard from '../../RequestQuoteWizard/JavaScript/RequestQuoteWizard';
import * as GoogleAdWords from '../../GoogleAdWords/JavaScript/GoogleAdWords';

import * as BrontoIntegration from '../../BrontoIntegration/JavaScript/BrontoIntegration';
import * as StoreLocatorAccessPoints from '../../StoreLocatorAccessPoints/JavaScript/StoreLocatorAccessPoints';
import * as StoreLocator from '../../StoreLocator/JavaScript/StoreLocator';
import * as SCCCTHtml from '../../SC.CCT.Html/JavaScript/SC.CCT.Html';
import '../../../Commons/ExtensibilityLayer/JavaScript/SCModel';
import '../../../Commons/ExtensibilityLayer/JavaScript/SCCollection';
import '../../../Commons/ExtensibilityLayer/JavaScript/SCView';
import '../../../Commons/ExtensibilityLayer/JavaScript/SCFormView';
import '../../../Commons/ExtensibilityLayer/JavaScript/SCCollectionView';
import * as LoggersAppenderElasticLoggerCart from '../../../Commons/Loggers/JavaScript/Loggers.Appender.ElasticLogger.Cart';
import * as SiteSearch from '../../SiteSearch/JavaScript/SiteSearch';
import * as ProfileComponent from '../../../Commons/Profile/JavaScript/Profile.Component';
import '../../ExtensibilityLayerOnline/JavaScript/PageType.Base.View';
import * as MyAccountMenuComponent from '../../../Commons/MenuTree/JavaScript/MyAccountMenu.Component';
import * as LoggersConfigurationSCA from '../../Loggers.SCA/JavaScript/Loggers.Configuration.SCA';
import * as Header from '../../Header/JavaScript/Header';
import * as SearchComponent from '../../../Commons/Search/JavaScript/Search.Component';
import WizardModule = require('../../../Advanced/Wizard/JavaScript/Wizard.Module');

import GoogleUniversalAnalytics = require('../../GoogleUniversalAnalytics/JavaScript/GoogleUniversalAnalytics');

export const entryPointModules = [
    PageType,
    SCEnvironmentComponent,
    BackboneViewPlugins,
    jQueryHtml,
    WizardModule,
    Location,
    PickupInStore,
    CheckoutProfile,
    Item,
    ProductViews,
    TransactionLineViews,
    Cart,
    LoginRegister,
    Content,
    Address,
    CustomFields,
    OrderWizard,
    PaymentMethod,
    Categories,
    ExternalPayment,
    NavigationHelper,
    NavigationHelperPluginsStandard,
    NavigationHelperPluginsDataTouchPoint,
    NavigationHelperPluginsModals,
    NavigationHelperPluginsPushers,
    SocialSharing,
    SocialSharingPluginsFacebook,
    SocialSharingPluginsTwitter,
    SocialSharingPluginsGooglePlus,
    SocialSharingPluginsPinterest,
    SocialSharingPluginsPinterestHover,
    SocialSharingPluginsAddThis,
    AjaxRequestsKiller,
    RequestQuoteAccessPoints,
    QuickOrderAccessPoints,
    RequestQuoteWizard,
    GoogleUniversalAnalytics,
    GoogleAdWords,
    GoogleTagManager,
    Merchandising,
    CheckoutSkipLogin,
    ImageNotAvailable,
    BrontoIntegration,
    CMSadapterInstaller,
    GoogleMap,
    GoogleMapConfiguration,
    StoreLocatorAccessPoints,
    StoreLocator,
    SCCCTHtml,
    LoggersAppenderElasticLoggerCart,
    SiteSearch,
    SearchComponent,
    ProfileComponent,
    MyAccountMenuComponent,
    LoggersConfigurationSCA,
    Header
];
