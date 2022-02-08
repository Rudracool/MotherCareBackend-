/*
	© 2020 NetSuite Inc.
	User may not copy, modify, distribute, or re-bundle or otherwise make available this code;
	provided, however, if you are an authorized user with a NetSuite account or log-in, you
	may use this code subject to the terms that govern your access and use.
*/

/// <amd-module name="PageTypeView"/>
// @Typescript-full

import { View } from './View';
import { Application } from '../../ApplicationSkeleton/JavaScript/Application';
import * as Utils from '../../Utilities/JavaScript/Utils';
import * as jQuery from './jQuery';

export interface BreadCrumbPage {
    href: string;
    text?: string;
}

export interface PageInfo {
    addition_to_head: string;
    fields: {
        [key: string]: string;
    };
    type: number;
    siteId: number;
    template: string;
    url: string;
    urlPath: string;
    header: string;
    title: string;
    name: string;
    metaKeywords: string;
    metaDescription: string;
    additionToHeader: string;
    pageTypeId: number;
    pageTypeName: string;
    page_header: string;
    page_title: string;
    meta_keywords: string;
    meta_description: string;
    site_id: number;
}

interface RouterArguments {
    [index: number]: string;
    length: number;
}

export interface CommonViewOptions {
    application: Application;
    container: Application;
    routerArguments: RouterArguments;
}

export interface PageTypeViewOptions extends CommonViewOptions {
    pageInfo?: {
        name: string;
        url: string;
        header: string;
        title: string;
        fields: {
            [key: string]: string;
        };
    };
}

export abstract class PageTypeView<
    TContext extends object,
    TEvents extends object = {}
> extends View<TContext, TEvents> {
    protected readonly options: PageTypeViewOptions;

    // this method is needed by core to render proper breadcrumb, it should not be overwritten
    public readonly getBreadcrumbPages = (): BreadCrumbPage[] => {
        let breadCrumb: BreadCrumbPage[] = [];
        if (this.options.pageInfo && this.options.pageInfo.url) {
            const { pageInfo } = this.options;
            const { url } = pageInfo;
            const path = Utils.correctURL(url);
            breadCrumb = [{ href: path, text: pageInfo.title || pageInfo.header }];
        }
        return breadCrumb;
    };

    public constructor(options: PageTypeViewOptions) {
        super();
        this.options = options;
    }

    public beforeShowContent<T>(): Promise<T> {
        return jQuery.Deferred().resolve();
    }

    public showContent<T>(): Promise<T> {
        const application = this.options.application || this.options.container;
        return application && application.getLayout().showContent(this);
    }
}
