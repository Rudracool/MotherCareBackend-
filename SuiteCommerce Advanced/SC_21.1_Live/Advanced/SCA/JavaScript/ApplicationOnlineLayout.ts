/*
	© 2020 NetSuite Inc.
	User may not copy, modify, distribute, or re-bundle or otherwise make available this code;
	provided, however, if you are an authorized user with a NetSuite account or log-in, you
	may use this code subject to the terms that govern your access and use.
*/

/// <amd-module name = "ApplicationOnlineLayout"/>

import * as _ from 'underscore';
import { WebPage as JsonldWebPage } from 'schema-dts';
import * as jQuery from '../../../Commons/Core/JavaScript/jQuery';
import { ApplicationLayout } from '../../../Commons/ApplicationSkeleton/JavaScript/ApplicationLayout';
import { Loggers } from '../../../Commons/Loggers/JavaScript/Loggers';
import { Configuration } from '../../../Commons/Utilities/JavaScript/Configuration';
import * as Backbone from '../../../Commons/Core/JavaScript/backbone/BackboneExtras';
import { FooterView } from '../../Footer/JavaScript/Footer.View';
import { JSONObject, JSONArray } from '../../../Commons/Utilities/JavaScript/Utils.Interfaces';
import { ChildViews } from '../../../Commons/Core/JavaScript/View';
import { ApplicationOnline } from './ApplicationOnline';
import { ProfileModel } from '../../../Commons/Profile/JavaScript/Profile.Model';

import HeaderView = require('../../Header/JavaScript/Header.View');
import ForbiddenErrorView = require('../../ErrorManagementOnline/JavaScript/ErrorManagementOnline.ForbiddenError.View');
import { UrlHelper } from '../../../Commons/UrlHelper/JavaScript/UrlHelper';
import Session = require('../../../Commons/Session/JavaScript/Session');
import GlobalViewsBreadcrumbView = require('../../GlobalViewsOnline/JavaScript/GlobalViews.Breadcrumb.View');
import ResponseErrorParser = require('../../ErrorManagementOnline/JavaScript/ErrorManagementOnline.ResponseErrorParser');
import GlobalViewsModalView = require('../../GlobalViewsOnline/JavaScript/GlobalViews.Modal.View');

export class ApplicationOnlineLayout extends ApplicationLayout {
    private headerView;
    private originalHeaderView;
    private footerView;
    private originalFooterView;
    protected breadcrumbPrefix: any;
    private breadcrumbPages: any;
    private headerViewInstance: any;
    private footerViewInstance: any;
    private breadcrumbViewInstance: any;

    public constructor(application: ApplicationOnline) {
        super(application);

        this.errorMessageParser = ResponseErrorParser;

        this.headerView = HeaderView;
        this.footerView = FooterView;

        this.originalHeaderView = this.headerView;
        this.originalFooterView = this.footerView;
    }

    protected updateOnReSize(): void {
        this.updateHeader();
        this.updateFooter();
    }

    public getBreadcrumbPrefix(): any {
        return this.breadcrumbPrefix;
    }

    public getBreadcrumbPages(): any {
        return this.breadcrumbPages;
    }

    private updateHeader(): void {
        const siteSettings = this.application.getConfig().siteSettings || {};
        if (siteSettings.sitetype === 'ADVANCED' && this.headerViewInstance) {
            this.headerViewInstance.render();
        }
    }

    private updateFooter(): void {
        const siteSettings = this.application.getConfig().siteSettings || {};
        if (siteSettings.sitetype === 'ADVANCED' && this.footerViewInstance) {
            this.footerViewInstance.render();
        }
    }

    protected updateLayout(): void {
        // update the header and footer
        this.headerView =
            this.currentView.getHeaderView && this.currentView.getHeaderView()
                ? this.currentView.getHeaderView()
                : this.originalHeaderView;

        this.footerView =
            this.currentView.getFooterView && this.currentView.getFooterView()
                ? this.currentView.getFooterView()
                : this.originalFooterView;

        if (
            (this.headerViewInstance && !(this.headerViewInstance instanceof this.headerView)) ||
            (this.footerViewInstance && !(this.footerViewInstance instanceof this.footerView))
        ) {
            const headerChildViewInst = this.getChildViewInstance('Header');
            if (headerChildViewInst) {
                headerChildViewInst.undelegateEvents();
            }

            const footerChildViewInst = this.getChildViewInstance('Footer');
            if (footerChildViewInst) {
                footerChildViewInst.undelegateEvents();
            }

            this.addChildViewInstances({
                Header: this.childViews.Header,
                Footer: this.childViews.Footer
            });

            this.render();
        }

        // update the breadcrumb
        const breadcrumb_pages = this.currentView.getBreadcrumbPages
            ? this.currentView.getBreadcrumbPages()
            : null;

        if (breadcrumb_pages && this.breadcrumbViewInstance) {
            this.breadcrumbViewInstance.pages = this.updateCrumbtrail(breadcrumb_pages || []);
            this.breadcrumbViewInstance.render();
        } else {
            this.hideBreadcrumb();
        }
    }

    private updateCrumbtrail(pages: any): any {
        if (!_.isArray(pages)) {
            pages = [pages];
        }

        this.breadcrumbPages = _.union(this.breadcrumbPrefix, pages);

        return this.breadcrumbPages;
    }

    private hideBreadcrumb(): void {
        if (this.breadcrumbViewInstance) {
            this.breadcrumbViewInstance.$el.empty();
        }
    }

    protected processJsonLd(): void {
        // If the JsonLd markup is selected on the configuration and the properties used
        // in markup microdata do not exist, JsonLd script will be added to head.
        const configuration = this.application.getConfig();
        const structureddatamarkup = configuration.structureddatamarkup || {};
        if (structureddatamarkup.type !== 'JSON-LD') {
            return;
        }

        if (jQuery('[itemscope]').length || jQuery('[itemtype^="https://schema.org"]').length) {
            // eslint-disable-next-line no-console
            console.warn(
                'This template is not compatible with JsonLd. Template must be based on 20.1 Base Theme.'
            );

            return;
        }

        const fullJsonLd: JSONArray = [];
        const promises = [
            this.currentView.getViewJsonLd() as JSONObject,
            this.breadcrumbViewInstance.getJsonLd() as JsonldWebPage
        ];

        jQuery.when(...promises).then(
            (...jsonLds: JSONArray): void => {
                _.each(
                    jsonLds,
                    (jsonLdResult: JSONObject): void => {
                        if (!_.isEmpty(jsonLdResult)) {
                            let jsonLdWithContext = {
                                '@context': 'https://schema.org'
                            };
                            jsonLdWithContext = { ...jsonLdWithContext, ...jsonLdResult };
                            fullJsonLd.push(jsonLdWithContext);
                        }
                    }
                );
                if (!_.isEmpty(fullJsonLd)) {
                    jQuery('head script[type="application/ld+json"]').remove();
                    jQuery(
                        `<script type="application/ld+json">${JSON.stringify(fullJsonLd)}</script>`
                    ).appendTo('head');
                }
            }
        );
    }

    public forbiddenError(): void {
        const view = new ForbiddenErrorView({
            application: this.application
        });
        view.showContent().done(
            (): void => {
                Loggers.getLogger().endLast('Navigation');
            }
        );
    }

    public getChildViews(): ChildViews {
        const childViews = super.getChildViews();
        childViews.Header = function(): any {
            const options = {
                application: this.application
            };

            if (this.currentView && this.currentView.getHeaderViewOptions) {
                _.extend(options, this.currentView.getHeaderViewOptions());
            }

            const View = this.headerView;
            this.headerViewInstance = new View(options);
            return this.headerViewInstance;
        };

        childViews.Footer = function(): any {
            const options = {
                application: this.application
            };

            if (this.currentView && this.currentView.getFooterViewOptions) {
                _.extend(options, this.currentView.getFooterViewOptions());
            }

            const View = this.footerView;
            this.footerViewInstance = new View(options);
            return this.footerViewInstance;
        };

        childViews['Global.Breadcrumb'] = function(): any {
            this.breadcrumbViewInstance = new GlobalViewsBreadcrumbView({
                pages: this.breadcrumbPages
            });

            return this.breadcrumbViewInstance;
        };

        return childViews;
    }

    public unauthorizedError(user_session_timedOut): void {
        const { currentTouchpoint } = this.application.getConfig();
        if (currentTouchpoint === 'login') {
            // This case can happen when more than one concurrent XHR is made and both
            // return a user session time-out error
            return;
        }
        ProfileModel.getInstance().set({
            isLoggedIn: 'F',
            isGuest: 'F'
        });

        let base_url = UrlHelper.setUrlParameter(
            Session.get('touchpoints.login'),
            'origin',
            currentTouchpoint
        );
        base_url = UrlHelper.setUrlParameter(
            base_url,
            'origin_hash',
            (<any>Backbone.history).fragment
        );
        Configuration.currentTouchpoint = 'login';

        window.location = user_session_timedOut
            ? UrlHelper.setUrlParameter(base_url, 'timeout', 'T')
            : base_url;
    }

    protected getGlobalModalViewClass(): any {
        return GlobalViewsModalView;
    }
}
