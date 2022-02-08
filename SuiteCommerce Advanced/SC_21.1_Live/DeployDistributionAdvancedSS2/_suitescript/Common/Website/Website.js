/**

    © 2020 NetSuite Inc.
    User may not copy, modify, distribute, or re-bundle or otherwise make available this code;
    provided, however, if you are an authorized user with a NetSuite account or log-in, you
    may use this code subject to the terms that govern your access and use.


 * @NApiVersion 2.x
 * @NModuleScope TargetAccount
 */
define(["require", "exports", "N/commerce/recordView", "../Controller/RequestErrors"], function (require, exports, NrecordView, RequestErrors_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    // A WebsiteSchema may be a better option than this enum.
    var WebsiteSetting;
    (function (WebsiteSetting) {
        WebsiteSetting["imagesizes"] = "imagesizes";
        WebsiteSetting["wsdkcancelcarturl"] = "wsdkcancelcarturl";
        WebsiteSetting["paymentmethods"] = "paymentmethods";
        WebsiteSetting["wsdkcancelcheckouturl"] = "wsdkcancelcheckouturl";
        WebsiteSetting["analytics"] = "analytics";
        WebsiteSetting["defaultpricelevel"] = "defaultpricelevel";
        WebsiteSetting["wsdkcompleteloginurl"] = "wsdkcompleteloginurl";
        WebsiteSetting["scripttemplateinvoice"] = "scripttemplateinvoice";
        WebsiteSetting["autoapplypromotionsenabled"] = "autoapplypromotionsenabled";
        WebsiteSetting["siteid"] = "siteid";
        WebsiteSetting["entrypoints"] = "entrypoints";
        WebsiteSetting["id"] = "id";
        WebsiteSetting["multipleshippingenabled"] = "multipleshippingenabled";
        WebsiteSetting["showshippingestimator"] = "showshippingestimator";
        WebsiteSetting["touchpoints"] = "touchpoints";
        WebsiteSetting["sitelanguage"] = "sitelanguage";
        WebsiteSetting["wsdkcompletecheckouturl"] = "wsdkcompletecheckouturl";
        WebsiteSetting["defaultshippingcountry"] = "defaultshippingcountry";
        WebsiteSetting["shipstoallcountries"] = "shipstoallcountries";
        WebsiteSetting["iswsdk"] = "iswsdk";
        WebsiteSetting["shipallcountries"] = "shipallcountries";
        WebsiteSetting["loginallowed"] = "loginallowed";
        WebsiteSetting["registration"] = "registration";
        WebsiteSetting["custromeregistrationtype"] = "custromeregistrationtype";
        WebsiteSetting["sortfield"] = "sortfield";
        WebsiteSetting["requireloginforpricing"] = "requireloginforpricing";
        WebsiteSetting["isinactive"] = "isinactive";
        WebsiteSetting["siteregion"] = "siteregion";
        WebsiteSetting["showextendedcart"] = "showextendedcart";
        WebsiteSetting["shipstocountries"] = "shipstocountries";
        WebsiteSetting["siteloginrequired"] = "siteloginrequired";
        WebsiteSetting["pricesincludevat"] = "pricesincludevat";
        WebsiteSetting["cartsharingmode"] = "cartsharingmode";
        WebsiteSetting["checkout"] = "checkout";
        WebsiteSetting["defaultshipcountry"] = "defaultshipcountry";
        WebsiteSetting["loginrequired"] = "loginrequired";
        WebsiteSetting["languages"] = "languages";
        WebsiteSetting["shiptocountries"] = "shiptocountries";
        WebsiteSetting["requireshippinginformation"] = "requireshippinginformation";
        WebsiteSetting["wsdkcancelloginurl"] = "wsdkcancelloginurl";
        WebsiteSetting["includevatwithprices"] = "includevatwithprices";
        WebsiteSetting["defaultshippingmethod"] = "defaultshippingmethod";
        WebsiteSetting["iswebstoreoffline"] = "iswebstoreoffline";
        WebsiteSetting["shippingrequired"] = "shippingrequired";
        WebsiteSetting["sitecurrency"] = "sitecurrency";
        WebsiteSetting["displayname"] = "displayname";
        WebsiteSetting["facetfield"] = "facetfield";
        WebsiteSetting["subsidiaries"] = "subsidiaries";
        WebsiteSetting["cookiepolicy"] = "cookiepolicy";
        WebsiteSetting["showcookieconsentbanner"] = "showcookieconsentbanner";
        WebsiteSetting["currencies"] = "currencies";
        WebsiteSetting["groupseparator"] = "groupseparator";
        WebsiteSetting["decimalseparator"] = "decimalseparator";
        WebsiteSetting["negativeprefix"] = "negativeprefix";
        WebsiteSetting["negativesuffix"] = "negativesuffix";
    })(WebsiteSetting = exports.WebsiteSetting || (exports.WebsiteSetting = {}));
    var Website = /** @class */ (function () {
        function Website(id) {
            if (!id) {
                throw RequestErrors_1.missingWebsiteIdParameter;
            }
            this.id = id;
        }
        Website.prototype.getSiteSettings = function (settings) {
            return NrecordView.viewWebsite({
                id: this.id,
                fields: _.flatten(settings.map(function (field) { return field.split('|'); }))
            });
        };
        Website.prototype.getCurrency = function (currencyId) {
            var currencies = this.getSiteSettings([WebsiteSetting.currencies]).currencies;
            var currency = _.find(currencies, { currency: currencyId });
            return currency || (currencies ? currencies[0] : { displaysymbol: '$' });
        };
        Website.prototype.getDefaultLanguage = function () {
            var languages = this.getSiteSettings([WebsiteSetting.languages]);
            return _.find(languages.languages, function (language) {
                return language.isdefault === true;
            });
        };
        Website.prototype.getId = function () {
            return this.id;
        };
        return Website;
    }());
    exports.Website = Website;
});
