/*
	© 2020 NetSuite Inc.
	User may not copy, modify, distribute, or re-bundle or otherwise make available this code;
	provided, however, if you are an authorized user with a NetSuite account or log-in, you
	may use this code subject to the terms that govern your access and use.
*/

/// <amd-module name="SC.MyAccount.Layout"/>

import * as myaccount_layout_tpl from 'myaccount_layout.tpl';
import { MyAccountMenu } from '../../Header/JavaScript/MyAccountMenu';
import * as Utils from '../../../Commons/Utilities/JavaScript/Utils';
import { ApplicationOnlineLayout } from '../../SCA/JavaScript/ApplicationOnlineLayout';
import { ChildViews } from '../../../Commons/Core/JavaScript/View';
import { MyAccount } from './SC.MyAccount';

import MenuTreeView = require('../../../Commons/MenuTree/JavaScript/MenuTree.View');
import HeaderView = require('../../Header/JavaScript/Header.View');
import Backbone = require('../../../Commons/Utilities/JavaScript/backbone.custom');

export class MyAccountLayout extends ApplicationOnlineLayout {
    protected template = myaccount_layout_tpl;
    protected className = 'layout-container';
    protected breadcrumbPrefix = [
        {
            href: '#',
            'data-touchpoint': 'home',
            'data-hashtag': '#',
            text: Utils.translate('Home')
        },
        {
            href: '#',
            'data-touchpoint': 'customercenter',
            'data-hashtag': '#overview',
            text: Utils.translate('My Account')
        }
    ];
    private selectedMenu: string;

    public constructor(application: MyAccount) {
        super(application);

        this.on('afterAppendView', (view): void => this.afterAppendView(view));
    }

    private afterAppendView(view): void {
        const selected_menu = this.getSelectedMenu(view);
        const menuTree = MenuTreeView.getInstance();
        menuTree.updateSidebar(selected_menu);

        this.updateLayoutSB(selected_menu);
    }

    protected updateOnReSize(): void {
        super.updateOnReSize();
        this.updateLayoutSB();
    }

    private updateLayoutSB(selectedMenu?: string): void {
        this.selectedMenu = selectedMenu || this.selectedMenu;
        const siteSettings = this.application.getConfig().siteSettings || {};
        if (siteSettings.sitetype === 'STANDARD') {
            if (Utils.isPhoneDevice() && this.selectedMenu === 'home') {
                // show side nav hide content
                this.$('.myaccount-layout-side-nav').removeClass('hide');
                this.$('.myaccount-layout-main').hide();
            } else if (!Utils.isPhoneDevice()) {
                // show side nav and content
                this.$('.myaccount-layout-side-nav').removeClass('hide');
                this.$('.myaccount-layout-main').show();
            } else {
                // hide side nav show content
                this.$('.myaccount-layout-side-nav').addClass('hide');
                this.$('.myaccount-layout-main').show();
            }
        }
    }

    // @method showContent Extends the original show content and adds support
    // to update the sidebar and the breadcrumb
    public showContent(view, dontScroll): JQuery.Promise<any> {
        const promise = super.showContent(view, dontScroll);
        const selectedMenu = this.getSelectedMenu(view);

        MenuTreeView.getInstance().updateSidebar(selectedMenu);

        this.updateLayoutSB(selectedMenu);

        return promise;
    }

    private getSelectedMenu(view): string {
        const myAccountMenu = MyAccountMenu.getInstance();
        let selected_menu = '';
        if (view.getSelectedMenu) {
            selected_menu = view.getSelectedMenu();
        } else {
            selected_menu = myAccountMenu.getMenuIdByUrl(Backbone.history.fragment);
        }
        return selected_menu;
    }

    // @propery {Object} childViews
    public getChildViews(): ChildViews {
        const childViews = super.getChildViews();
        childViews.Header = (): any => {
            return new HeaderView({
                application: this.application
            });
        };

        childViews.MenuTree = function(): any {
            const menuTreeViewInstance = MenuTreeView.getInstance();
            menuTreeViewInstance.addChildViewInstances(menuTreeViewInstance.getChildViews(), true);
            return menuTreeViewInstance;
        };

        return childViews;
    }

    public getContext(): {} {
        return {
            // @property {Boolean} isStandalone
            isStandalone: this.application.isStandalone()
        };
    }
}
