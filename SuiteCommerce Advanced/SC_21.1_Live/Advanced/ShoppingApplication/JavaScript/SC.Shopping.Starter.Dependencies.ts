/*
	© 2020 NetSuite Inc.
	User may not copy, modify, distribute, or re-bundle or otherwise make available this code;
	provided, however, if you are an authorized user with a NetSuite account or log-in, you
	may use this code subject to the terms that govern your access and use.
*/

/// <amd-module name="SC.Shopping.Starter.Dependencies"/>
import * as PageType from '../../../Commons/PageType/JavaScript/PageType';
import * as SCEnvironmentComponent from '../../SCA/JavaScript/SC.Environment.Component';
import * as GoogleMap from '../../StoreLocatorGoogleMapsImplementation/JavaScript/GoogleMap';
import * as GoogleMapConfiguration from '../../StoreLocatorGoogleMapsImplementation/JavaScript/GoogleMap.Configuration';
import * as BackboneViewPlugins from '../../../Commons/BackboneExtras/JavaScript/Backbone.View.Plugins';
import * as Location from '../../Location.SCA/JavaScript/Location';
import * as jQueryHtml from '../../../Commons/jQueryExtras/JavaScript/jQuery.html';
import * as PickupInStore from '../../PickupInStore/JavaScript/PickupInStore';
import * as ProductDetails from '../../ProductDetails/JavaScript/ProductDetails';
import * as NavigationHelper from '../../../Commons/NavigationHelper/JavaScript/NavigationHelper';
import * as NavigationHelperPluginsStandard from '../../../Commons/NavigationHelper/JavaScript/NavigationHelper.Plugins.Standard';
import * as NavigationHelperPluginsDataTouchPoint from '../../../Commons/NavigationHelper/JavaScript/NavigationHelper.Plugins.DataTouchPoint';
import * as NavigationHelperPluginsModals from '../../../Commons/NavigationHelper/JavaScript/NavigationHelper.Plugins.Modals';
import * as NavigationHelperPluginsPushers from '../../../Commons/NavigationHelper/JavaScript/NavigationHelper.Plugins.Pushers';
import * as Item from '../../../Commons/Item/JavaScript/Item';
import * as ProductViews from '../../../Commons/ProductViews/JavaScript/ProductViews';
import * as TransactionLineViews from '../../../Commons/Transaction.Line.Views/JavaScript/Transaction.Line.Views';
import * as Cart from '../../../Commons/Cart/JavaScript/Cart';
import * as Content from '../../Content/JavaScript/Content';
import * as Categories from '../../../Commons/Categories/JavaScript/Categories';
import * as Facets from '../../../Commons/Facets/JavaScript/Facets';
import * as GoogleTagManager from '../../GoogleTagManager/JavaScript/GoogleTagManager';
import * as Home from '../../Home/JavaScript/Home';
import * as PromocodeSupport from '../../PromocodeSupport/JavaScript/PromocodeSupport';
import * as ItemRelations from '../../../Commons/ItemRelations/JavaScript/ItemRelations';
import * as RecentlyViewedItems from '../../../Commons/RecentlyViewedItems/JavaScript/RecentlyViewedItems';
import * as SocialSharing from '../../SocialSharing/JavaScript/SocialSharing';
import * as SocialSharingPluginsFacebook from '../../SocialSharing/JavaScript/SocialSharing.Plugins.Facebook';
import * as SocialSharingPluginsTwitter from '../../SocialSharing/JavaScript/SocialSharing.Plugins.Twitter';
import * as SocialSharingPluginsGooglePlus from '../../SocialSharing/JavaScript/SocialSharing.Plugins.GooglePlus';
import * as SocialSharingPluginsPinterest from '../../SocialSharing/JavaScript/SocialSharing.Plugins.Pinterest';
import * as SocialSharingPluginsPinterestHover from '../../SocialSharing/JavaScript/SocialSharing.Plugins.Pinterest.Hover';
import * as SocialSharingPluginsAddThis from '../../SocialSharing/JavaScript/SocialSharing.Plugins.AddThis';
import * as ProductReviews from '../../../Commons/ProductReviews/JavaScript/ProductReviews';
import { AjaxRequestsKiller } from '../../../Commons/AjaxRequestsKiller/JavaScript/AjaxRequestsKiller';
import * as CookieWarningBanner from '../../CookieWarningBanner/JavaScript/CookieWarningBanner';
import * as ImageNotAvailable from '../../ImageNotAvailable/JavaScript/ImageNotAvailable';
import * as Merchandising from '../../Merchandising/JavaScript/Merchandising';
import * as MerchandisingContextDefaultHandlers from '../../Merchandising/JavaScript/Merchandising.Context.DefaultHandlers';
import * as ProductListOnline from '../../ProductListOnline/JavaScript/ProductListOnline';
import * as UrlHelper from '../../../Commons/UrlHelper/JavaScript/UrlHelper';
import * as CMSadapterInstaller from '../../CMSadapter/JavaScript/CMSadapterInstaller';
import * as RequestQuoteAccessPoints from '../../RequestQuoteAccessPoints/JavaScript/RequestQuoteAccessPoints';
import * as QuickOrderAccessPoints from '../../QuickOrderAccessPoints/JavaScript/QuickOrderAccessPoints';
import * as BrontoIntegration from '../../BrontoIntegration/JavaScript/BrontoIntegration';
import * as QuantityPricing from '../../QuantityPricing/JavaScript/QuantityPricing';
import * as QuickOrder from '../../QuickOrder/JavaScript/QuickOrder';
import * as StoreLocatorAccessPoints from '../../StoreLocatorAccessPoints/JavaScript/StoreLocatorAccessPoints';
import * as Newsletter from '../../Newsletter/JavaScript/Newsletter';
import * as ProductDetailToQuote from '../../ProductDetailToQuote/JavaScript/ProductDetailToQuote';
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

import '../../../Commons/Utilities/JavaScript/bootstrap';

import GoogleUniversalAnalytics = require('../../GoogleUniversalAnalytics/JavaScript/GoogleUniversalAnalytics');

export const entryPointModules = [
    PageType,
    SCEnvironmentComponent,
    GoogleMap,
    GoogleMapConfiguration,
    BackboneViewPlugins,
    Location,
    jQueryHtml,
    PickupInStore,
    ProductDetails,
    NavigationHelper,
    NavigationHelperPluginsStandard,
    NavigationHelperPluginsDataTouchPoint,
    NavigationHelperPluginsModals,
    NavigationHelperPluginsPushers,
    Item,
    ProductViews,
    TransactionLineViews,
    Cart,
    Content,
    Categories,
    Facets,
    GoogleUniversalAnalytics,
    GoogleTagManager,
    Home,
    PromocodeSupport,
    ItemRelations,
    RecentlyViewedItems,
    SocialSharing,
    SocialSharingPluginsFacebook,
    SocialSharingPluginsTwitter,
    SocialSharingPluginsGooglePlus,
    SocialSharingPluginsPinterest,
    SocialSharingPluginsPinterestHover,
    SocialSharingPluginsAddThis,
    ProductReviews,
    AjaxRequestsKiller,
    CookieWarningBanner,
    ImageNotAvailable,
    Merchandising,
    MerchandisingContextDefaultHandlers,
    ProductListOnline,
    UrlHelper,
    CMSadapterInstaller,
    RequestQuoteAccessPoints,
    QuickOrderAccessPoints,
    BrontoIntegration,
    QuantityPricing,
    QuickOrder,
    StoreLocatorAccessPoints,
    Newsletter,
    ProductDetailToQuote,
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
