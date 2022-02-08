/*
    © 2020 NetSuite Inc.
    User may not copy, modify, distribute, or re-bundle or otherwise make available this code;
    provided, however, if you are an authorized user with a NetSuite account or log-in, you
    may use this code subject to the terms that govern your access and use.
*/
define("PageType.Component", ["require", "exports", "underscore", "Loggers", "PageType.Collection", "Utils", "jQuery", "Configuration", "SC.BaseComponent", "PageType.Router", "Backbone"], function (require, exports, _, Loggers_1, PageType_Collection_1, Utils, jQuery, Configuration_1, SC_BaseComponent_1, PageTypeRouter, Backbone) {
    "use strict";
    function checkNavigationSearchResults(options, result) {
        var optionsExist = false;
        var url_options = Utils.parseUrlOptions(window.location.search);
        if (url_options && url_options.keywords) {
            optionsExist = true;
            options.searchQuery = url_options.keywords.toString();
            options.searchPageNumber = 1;
            options.searchResultCount = 0;
            if (url_options.page) {
                options.searchPageNumber = parseInt(url_options.page.toString(), 10);
            }
            if (result.model && result.model.get('items')) {
                options.searchResultCount = result.model.get('items').length;
            }
        }
        return optionsExist;
    }
    function checkNavigationItem(options, result) {
        var optionsExist = false;
        var itemId = 0;
        if (result.model && result.model.get('item') && result.model.get('item').id) {
            itemId = result.model.get('item').id;
        }
        if (itemId) {
            optionsExist = true;
            options.itemId = itemId;
        }
        return optionsExist;
    }
    return function PageTypeComponentGenerator(application) {
        var Router = new PageTypeRouter(application);
        var CMSReady = jQuery.Deferred();
        var CMS;
        var routes = {};
        var pages = {};
        var allPageTypes = {};
        var templates = {};
        var types = {};
        var lastContext = {
            context: {},
            data: {
                promiseCMS: jQuery.Deferred(),
                rendered: false,
                timeoutId: 0
            }
        };
        Backbone.on('cms:loaded', function (cms) {
            CMS = cms;
            CMSReady.resolve();
        });
        CMSReady.done(function () {
            CMS.on('page:content:set', function (_promise, _ccts, contentContext) {
                var fullContext = PageTypeComponent._validateCurrentContext(contentContext);
                if (fullContext) {
                    var data = fullContext.data;
                    if (data.rendered) {
                        var cctComponent = PageTypeComponent.application.getComponent('CMS');
                        cctComponent.addContents();
                    }
                    else if (data.timeoutId) {
                        clearTimeout(data.timeoutId);
                    }
                    data.promiseCMS.resolve();
                }
            });
        });
        var PageTypeComponent = SC_BaseComponent_1.SCBaseComponent.extend({
            componentName: 'PageType',
            application: application,
            pageTypes: new PageType_Collection_1.PageTypeCollection((SC.ENVIRONMENT.PageTypes && SC.ENVIRONMENT.PageTypes.pageTypes) || []),
            _validateCurrentContext: function _validateCurrentContext(context) {
                var contextLast = lastContext.context;
                if (contextLast.path === context.path) {
                    return lastContext;
                }
                return null;
            },
            _getPage: function _getPage(url) {
                return pages[url];
            },
            _addPage: function _addPage(page, type, url) {
                if (type && url) {
                    if (!routes[type]) {
                        routes[type] = [];
                    }
                    if (_.indexOf(routes[type], url) === -1) {
                        routes[type].push(url);
                    }
                    pages[url] = page;
                }
            },
            _addRoute: function _addRoute(options) {
                _.each(options.routes, function (route) {
                    if (route[0] === '/') {
                        route = route.substr(1);
                    }
                    Router.route(route, options.type);
                });
            },
            _getPageType: function _getPageType(name) {
                return this.pageTypes.find(function (pageType) { return pageType.get('name') === name; });
            },
            _updatePageTypes: function _updatePageTypes() {
                this.pageTypes.fetch().done(function () {
                    var context = lastContext.context;
                    Backbone.history.navigate(context.path, { trigger: false });
                    Backbone.history.loadUrl(context.path);
                });
            },
            getPageTypes: function getPageTypes() {
                var data = {
                    layouts: templates,
                    types: {}
                };
                _.each(types, function (value, key) {
                    if (value.registered) {
                        data.types[key] = value;
                    }
                });
                return data;
            },
            getContext: function getContext() {
                return Utils.deepCopy(lastContext.context);
            },
            registerTemplate: function registerTemplate(templateData) {
                var template = templateData.template;
                if (!templates[template.name]) {
                    templates[template.name] = {
                        name: template.displayName,
                        thumbnail: template.thumbnail
                    };
                }
                _.each(templateData.pageTypes, function (pageType) {
                    if (!types[pageType]) {
                        types[pageType] = {
                            supportedLayoutIds: []
                        };
                    }
                    if (_.indexOf(types[pageType].supportedLayoutIds, template.name) === -1) {
                        types[pageType].supportedLayoutIds.push(template.name);
                    }
                });
            },
            _CmsViewPromises: function _CmsViewPromises(options) {
                var url = (Backbone.history.fragment && Backbone.history.fragment.split('?')[0]) ||
                    Backbone.history.location.hash;
                var path = Utils.correctURL(url);
                var context = {
                    path: options.path || path,
                    site_id: options.site_id || Configuration_1.Configuration.get('siteSettings.siteid'),
                    page_type: options.page_type || '',
                    page_type_display_name: options.page_type || ''
                };
                var pageTypeInfo = this._getPageType(options.page_type);
                if (pageTypeInfo) {
                    context.page_type_display_name = pageTypeInfo.get('displayName');
                }
                var data = {
                    promiseCMS: jQuery.Deferred(),
                    rendered: false,
                    timeoutId: 0
                };
                lastContext = {
                    context: context,
                    data: data
                };
                var self = this;
                var view = options.view;
                var promise = jQuery.Deferred();
                var promiseView = view ? jQuery.Deferred().resolve() : jQuery.Deferred().reject();
                if (view && view.beforeShowContent) {
                    promiseView = view.beforeShowContent();
                }
                if (!Configuration_1.Configuration.get('cms.useCMS')) {
                    data.promiseCMS.resolve();
                }
                else {
                    CMSReady.done(function () {
                        self.application.getLayout().once('beforeAppendView', function () {
                            if (self._validateCurrentContext(context) && !data.rendered) {
                                data.rendered = true;
                            }
                        });
                        var specialPageTypes = ['expired_link', 'internal-error', 'page-not-found'];
                        if (specialPageTypes.indexOf(context.page_type) === -1) {
                            CMS.trigger('app:page:changed', context);
                        }
                        promiseView.done(function () {
                            data.timeoutId = setTimeout(function () {
                                if (self._validateCurrentContext(context)) {
                                    data.rendered = true;
                                    data.promiseCMS.resolve();
                                }
                                else {
                                    data.promiseCMS.reject();
                                }
                            }, Configuration_1.Configuration.get('cms.contentWait', 200));
                        });
                    });
                }
                jQuery
                    .when(data.promiseCMS, promiseView)
                    .done(function () {
                    promise.resolve();
                })
                    .fail(function (promiseError) {
                    promise.reject(promiseError);
                });
                return promise;
            },
            registerPageType: function registerPageType(pagetype) {
                if (pagetype.name && pagetype.view) {
                    allPageTypes[pagetype.name] = pagetype;
                }
                if (pagetype.name && pagetype.routes && !pagetype.view && allPageTypes[pagetype.name]) {
                    pagetype.view = allPageTypes[pagetype.name].view;
                }
                var callback = function () {
                    var loggers = Loggers_1.Loggers.getLogger();
                    loggers.start('Navigation');
                    var view;
                    if (pagetype.view) {
                        var url = Backbone.history.fragment;
                        url = url.split('?')[0]; // remove options
                        var page = pages[url];
                        var options = _.extend({}, pagetype.options || {}, {
                            application: application,
                            container: application,
                            routerArguments: arguments
                        });
                        if (page) {
                            // adapt to a acceptable format for extensibility layer
                            options.pageInfo = {
                                name: page.get('name'),
                                url: page.get('urlPath'),
                                header: page.get('page_header'),
                                title: page.get('page_title'),
                                fields: page.get('fields')
                            };
                        }
                        view = new pagetype.view(options);
                    }
                    else if (pagetype.callback) {
                        view = pagetype.callback.apply(arguments);
                    }
                    var data = {
                        view: view,
                        page_type: pagetype.name
                    };
                    PageTypeComponent._CmsViewPromises(data).done(function () {
                        view._pagetype = true;
                        var showContentPromise = view.showContent();
                        showContentPromise &&
                            showContentPromise.done(function (result) {
                                var cctComponent = application.getComponent('CMS');
                                cctComponent.addContents();
                                var options = {};
                                if (pagetype.name === 'ProductDetails.Full.View') {
                                    checkNavigationItem(options, result);
                                }
                                else if (pagetype.name === 'facet-browse') {
                                    checkNavigationSearchResults(options, result);
                                }
                                if (view.inModal) {
                                    options.displayedInModal = true;
                                }
                                loggers.endLast('Navigation', options);
                                if (Configuration_1.Configuration.get('cms.useCMS')) {
                                    CMS.trigger('app:page:rendered');
                                }
                            });
                    });
                };
                if (pagetype.routes) {
                    _.each(pagetype.routes, function (route) {
                        if (route[0] === '/') {
                            route = route.substr(1);
                        }
                        Router.route(route, callback);
                    });
                }
                else {
                    Router[pagetype.name] = callback;
                    if (routes[pagetype.name]) {
                        var route = void 0;
                        while ((route = routes[pagetype.name].pop())) {
                            if (route[0] === '/') {
                                route = route.substr(1);
                            }
                            Router.route(route, pagetype.name);
                        }
                    }
                }
                if (!types[pagetype.name]) {
                    types[pagetype.name] = {
                        supportedLayoutIds: []
                    };
                }
                types[pagetype.name].registered = true;
                if (pagetype.defaultTemplate) {
                    templates[pagetype.defaultTemplate.name] = {
                        name: pagetype.defaultTemplate.displayName,
                        thumbnail: pagetype.defaultTemplate.thumbnail
                    };
                    types[pagetype.name].defaultLayoutId = pagetype.defaultTemplate.name;
                    types[pagetype.name].supportedLayoutIds.push(pagetype.defaultTemplate.name);
                }
            }
        });
        return PageTypeComponent;
    };
});

//# sourceMappingURL=PageType.Component.js.map
