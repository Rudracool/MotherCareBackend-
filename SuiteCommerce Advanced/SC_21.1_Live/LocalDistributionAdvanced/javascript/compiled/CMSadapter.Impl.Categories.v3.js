/*
    © 2020 NetSuite Inc.
    User may not copy, modify, distribute, or re-bundle or otherwise make available this code;
    provided, however, if you are an authorized user with a NetSuite account or log-in, you
    may use this code subject to the terms that govern your access and use.
*/
define("CMSadapter.Impl.Categories.v3", ["require", "exports", "underscore", "Utils", "jQuery", "Categories.Collection", "Configuration", "Profile.Model", "Categories", "Facets.Router", "Facets.Model", "Item.Model", "Item.Collection", "Backbone"], function (require, exports, _, Utils, jQuery, Categories_Collection_1, Configuration_1, Profile_Model_1, Categories, FacetsRouter, FacetsModel, ItemModel, ItemCollection, Backbone) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var CMSadapterImplCategories3 = /** @class */ (function () {
        function CMSadapterImplCategories3(application, cms) {
            this.cms = cms;
            this.application = application;
            this.currentDate = null;
            this.backendAccountDomain = null;
            this.itemEndpointUrl = null;
            this.listenForCMS();
        }
        CMSadapterImplCategories3.prototype.listenForCMS = function () {
            // CMS listeners - CMS tells us to do something, could fire anytime.
            var _this = this;
            this.cms.on('categories:navigate', function (promise, data) {
                FacetsModel.prototype.ignoreCache = true;
                _this.fullUrl = Utils.correctURL(data.url);
                Backbone.history.navigate(_this.fullUrl, { trigger: false });
                // navigate event should not force the reload of all categories information
                // but the app is not subscribed to any event to know when a category was updated
                // so on every navigation the categories info is reloaded
                _this.reloadCategories().then(function () {
                    promise.resolve();
                });
            });
            this.cms.on('categories:reload', function (promise) {
                _this.setUpEndPoints()
                    .then(function () {
                    _this.reloadCategories()
                        .then(function () {
                        promise.resolve();
                    })
                        .fail(function () {
                        promise.reject();
                    });
                })
                    .fail(function () {
                    promise.reject();
                });
            });
            this.cms.on('site:date:changed', function (promise, data) {
                _this.setUpEndPoints()
                    .then(function () {
                    _this.currentDate = data.siteDate;
                    _this.changeServices();
                    _this.reloadCategories()
                        .then(function () {
                        promise.resolve();
                    })
                        .fail(function () {
                        promise.reject();
                    });
                })
                    .fail(function () {
                    promise.reject();
                });
            });
            this.cms.on('preview:segment:apply', function (promise, data) {
                _this.setUpEndPoints()
                    .then(function () {
                    _this.pcvAllItems = data.pcv_all_items ? 'T' : 'F';
                    _this.pcvGroups = data.pcv_groups ? data.pcv_groups.join() : '';
                    SC.ENVIRONMENT.pcvGroups = _this.pcvGroups;
                    SC.ENVIRONMENT.pcvAllItems = _this.pcvAllItems;
                    _this.changeServices();
                    _this.reloadCategories()
                        .then(function () {
                        promise.resolve();
                    })
                        .fail(function () {
                        promise.reject();
                    });
                })
                    .fail(function () {
                    promise.reject();
                });
            });
        };
        CMSadapterImplCategories3.prototype.categoriesRefresh = function (menu) {
            Categories.setTopLevelCategoriesUrlComponents(menu);
            // update the router with new urls
            var router = new FacetsRouter(this.application);
            router.addUrl(Categories.getTopLevelCategoriesUrlComponent(), 'categoryLoading');
            Categories.addToNavigationTabs(menu);
            this.refreshPLP();
        };
        CMSadapterImplCategories3.prototype.setUpEndPoints = function () {
            var _this = this;
            var promise = jQuery.Deferred();
            if (!this.backendAccountDomain || !this.itemEndpointUrl) {
                jQuery
                    .getJSON(Utils.getAbsoluteUrl("services/NS_SC_Environment.ss?n=" + SC.ENVIRONMENT.siteSettings.siteid, true))
                    .then(function (env) {
                    _this.backendAccountDomain = "https://" + env.backendAccountDomain;
                    _this.itemEndpointUrl = "https://" + env.backendAccountDomain + "/api/items";
                    promise.resolve();
                });
            }
            else {
                promise.resolve();
            }
            return promise;
        };
        CMSadapterImplCategories3.prototype.reloadCategories = function () {
            var _this = this;
            var options = {
                backendAccountDomain: this.backendAccountDomain,
                pcvGroups: this.pcvGroups,
                pcvAllItems: this.pcvAllItems,
                level: Configuration_1.Configuration.get('categories.menuLevel'),
                effectiveDate: this.currentDate
            };
            var collection = new Categories_Collection_1.CategoriesCollection(options);
            return collection.fetch().done(function (menu) {
                var categoriesMenu = menu ? menu.data : [];
                _this.categoriesRefresh(categoriesMenu);
            });
        };
        CMSadapterImplCategories3.prototype.refreshPLP = function () {
            var currentBaseUrl = Backbone.history.getFragment().split('/')[0];
            if (currentBaseUrl === Configuration_1.Configuration.defaultSearchUrl ||
                _.find(Categories.getTopLevelCategoriesUrlComponent(), function (cat) {
                    return cat.substring(1) === currentBaseUrl;
                })) {
                // if is a category or shop, reload the page
                Backbone.history.loadUrl(Backbone.history.getFragment());
            }
        };
        CMSadapterImplCategories3.prototype.changeServices = function () {
            var _this = this;
            var self = this;
            Profile_Model_1.ProfileModel.prototype.getSearchApiUrl = function () {
                return _this.itemEndpointUrl;
            };
            function wrapItemsApiFetch(modelOrCollection) {
                modelOrCollection.prototype.fetch = _.wrap(modelOrCollection.prototype.fetch, function (fn, options) {
                    options = Utils.deepExtend(options || {}, {
                        cache: false,
                        data: {
                            as_of_date: self.currentDate,
                            force_avoid_redirect: true
                        },
                        xhrFields: {
                            withCredentials: true
                        },
                        crossDomain: true
                    });
                    // The 'true' value prevents jQuery ajax from sending the 'X-SC-Touchpoint' header, it's not supported
                    // by CORS request to the items API
                    SC.dontSetRequestHeaderTouchpoint = true;
                    var fethReturn = fn.call(this, options);
                    SC.dontSetRequestHeaderTouchpoint = false;
                    return fethReturn;
                });
            }
            wrapItemsApiFetch(ItemModel);
            wrapItemsApiFetch(ItemCollection);
            wrapItemsApiFetch(FacetsModel);
        };
        return CMSadapterImplCategories3;
    }());
    exports.CMSadapterImplCategories3 = CMSadapterImplCategories3;
});

//# sourceMappingURL=CMSadapter.Impl.Categories.v3.js.map
