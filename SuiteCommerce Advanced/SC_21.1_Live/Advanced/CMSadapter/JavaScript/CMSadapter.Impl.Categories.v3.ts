/*
	© 2020 NetSuite Inc.
	User may not copy, modify, distribute, or re-bundle or otherwise make available this code;
	provided, however, if you are an authorized user with a NetSuite account or log-in, you
	may use this code subject to the terms that govern your access and use.
*/

/// <amd-module name="CMSadapter.Impl.Categories.v3"/>
/// <reference path="../../../Commons/Utilities/JavaScript/GlobalDeclarations.d.ts" />
// @Typescript-partial

import * as _ from 'underscore';
import * as Utils from '../../../Commons/Utilities/JavaScript/Utils';
import * as jQuery from '../../../Commons/Core/JavaScript/jQuery';
import {
    CategoriesCollection,
    CollectionOptions
} from '../../../Commons/Categories/JavaScript/Categories.Collection';
import { CmsObject, Application } from './CMSadapter.v3';
import { CategoryTree, Category } from '../../../ServiceContract/SC/Category/Category';
import { Configuration } from '../../SCA/JavaScript/Configuration';
import { ProfileModel } from '../../../Commons/Profile/JavaScript/Profile.Model';

import Categories = require('../../../Commons/Categories/JavaScript/Categories');
import FacetsRouter = require('../../../Commons/Facets/JavaScript/Facets.Router');
import FacetsModel = require('../../../Commons/Facets/JavaScript/Facets.Model');
import ItemModel = require('../../../Commons/Item/JavaScript/Item.Model');
import ItemCollection = require('../../../Commons/Item/JavaScript/Item.Collection');
import Backbone = require('../../../Commons/Utilities/JavaScript/backbone.custom');

import Deferred = JQuery.Deferred;

interface environmentAccount {
    backendAccountDomain: string;
}

interface previewSegmentApplyData {
    pcv_all_items: boolean;
    pcv_groups: string[];
}

interface siteDateChangedData {
    siteDate: string;
}

interface CategoriesNavigateData {
    url: string;
}

export class CMSadapterImplCategories3 {
    private cms: CmsObject;

    private application: Application;

    private currentDate: string;

    private backendAccountDomain: string;

    private itemEndpointUrl: string;

    private pcvGroups: string;

    private pcvAllItems: string;

    private fullUrl: string;

    public constructor(application: Application, cms: CmsObject) {
        this.cms = cms;
        this.application = application;
        this.currentDate = null;
        this.backendAccountDomain = null;
        this.itemEndpointUrl = null;
        this.listenForCMS();
    }

    private listenForCMS(): void {
        // CMS listeners - CMS tells us to do something, could fire anytime.

        this.cms.on(
            'categories:navigate',
            (promise: Deferred<void>, data: CategoriesNavigateData) => {
                FacetsModel.prototype.ignoreCache = true;

                this.fullUrl = Utils.correctURL(data.url);

                Backbone.history.navigate(this.fullUrl, { trigger: false });
                // navigate event should not force the reload of all categories information
                // but the app is not subscribed to any event to know when a category was updated
                // so on every navigation the categories info is reloaded
                this.reloadCategories().then(() => {
                    promise.resolve();
                });
            }
        );

        this.cms.on('categories:reload', (promise: Deferred<void>) => {
            this.setUpEndPoints()
                .then(() => {
                    this.reloadCategories()
                        .then(function() {
                            promise.resolve();
                        })
                        .fail(function() {
                            promise.reject();
                        });
                })
                .fail(function() {
                    promise.reject();
                });
        });

        this.cms.on('site:date:changed', (promise: Deferred<void>, data: siteDateChangedData) => {
            this.setUpEndPoints()
                .then(() => {
                    this.currentDate = data.siteDate;
                    this.changeServices();
                    this.reloadCategories()
                        .then(function() {
                            promise.resolve();
                        })
                        .fail(function() {
                            promise.reject();
                        });
                })
                .fail(function() {
                    promise.reject();
                });
        });

        this.cms.on(
            'preview:segment:apply',
            (promise: Deferred<void>, data: previewSegmentApplyData) => {
                this.setUpEndPoints()
                    .then(() => {
                        this.pcvAllItems = data.pcv_all_items ? 'T' : 'F';
                        this.pcvGroups = data.pcv_groups ? data.pcv_groups.join() : '';

                        SC.ENVIRONMENT.pcvGroups = this.pcvGroups;
                        SC.ENVIRONMENT.pcvAllItems = this.pcvAllItems;

                        this.changeServices();
                        this.reloadCategories()
                            .then(() => {
                                promise.resolve();
                            })
                            .fail(() => {
                                promise.reject();
                            });
                    })
                    .fail(() => {
                        promise.reject();
                    });
            }
        );
    }

    private categoriesRefresh(menu: CategoryTree) {
        Categories.setTopLevelCategoriesUrlComponents(menu);
        // update the router with new urls
        const router = new FacetsRouter(this.application);
        router.addUrl(Categories.getTopLevelCategoriesUrlComponent(), 'categoryLoading');
        Categories.addToNavigationTabs(menu);

        this.refreshPLP();
    }

    private setUpEndPoints(): Deferred<void> {
        const promise = jQuery.Deferred();

        if (!this.backendAccountDomain || !this.itemEndpointUrl) {
            jQuery
                .getJSON(
                    Utils.getAbsoluteUrl(
                        `services/NS_SC_Environment.ss?n=${SC.ENVIRONMENT.siteSettings.siteid}`,
                        true
                    )
                )
                .then((env: environmentAccount) => {
                    this.backendAccountDomain = `https://${env.backendAccountDomain}`;
                    this.itemEndpointUrl = `https://${env.backendAccountDomain}/api/items`;
                    promise.resolve();
                });
        } else {
            promise.resolve();
        }
        return promise;
    }

    private reloadCategories(): JQueryXHR {
        const options: CollectionOptions = {
            backendAccountDomain: this.backendAccountDomain,
            pcvGroups: this.pcvGroups,
            pcvAllItems: this.pcvAllItems,
            level: Configuration.get('categories.menuLevel'),
            effectiveDate: this.currentDate
        };

        const collection = new CategoriesCollection(options);

        return collection.fetch().done(menu => {
            const categoriesMenu = menu ? menu.data : [];
            this.categoriesRefresh(categoriesMenu);
        });
    }

    private refreshPLP(): void {
        const currentBaseUrl: string = Backbone.history.getFragment().split('/')[0];
        if (
            currentBaseUrl === Configuration.defaultSearchUrl ||
            _.find(Categories.getTopLevelCategoriesUrlComponent(), (cat: string) => {
                return cat.substring(1) === currentBaseUrl;
            })
        ) {
            // if is a category or shop, reload the page
            Backbone.history.loadUrl(Backbone.history.getFragment());
        }
    }

    private changeServices(): void {
        const self = this;

        ProfileModel.prototype.getSearchApiUrl = () => {
            return this.itemEndpointUrl;
        };

        function wrapItemsApiFetch(modelOrCollection) {
            modelOrCollection.prototype.fetch = _.wrap(modelOrCollection.prototype.fetch, function(
                fn,
                options
            ) {
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
                const fethReturn = fn.call(this, options);
                SC.dontSetRequestHeaderTouchpoint = false;
                return fethReturn;
            });
        }
        wrapItemsApiFetch(ItemModel);
        wrapItemsApiFetch(ItemCollection);
        wrapItemsApiFetch(FacetsModel);
    }
}
