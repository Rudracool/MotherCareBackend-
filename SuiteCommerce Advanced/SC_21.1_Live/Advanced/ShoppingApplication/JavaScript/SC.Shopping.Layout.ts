/*
	© 2020 NetSuite Inc.
	User may not copy, modify, distribute, or re-bundle or otherwise make available this code;
	provided, however, if you are an authorized user with a NetSuite account or log-in, you
	may use this code subject to the terms that govern your access and use.
*/

/// <amd-module name="SC.Shopping.Layout"/>

import * as shopping_layout_tpl from 'shopping_layout.tpl';
import * as Utils from '../../../Commons/Utilities/JavaScript/Utils';
import * as Backbone from '../../../Commons/Core/JavaScript/backbone/BackboneExtras';
import { ApplicationOnlineLayout } from '../../SCA/JavaScript/ApplicationOnlineLayout';

export class ShoppingLayout extends ApplicationOnlineLayout {
    protected template = shopping_layout_tpl;
    protected className = 'layout-container';
    protected breadcrumbPrefix = [
        {
            href: '/',
            'data-touchpoint': 'home',
            'data-hashtag': '#',
            text: Utils.translate('Home')
        }
    ];

    public constructor(application: any) {
        super(application);
        this.events['change select[data-type="navigator"]'] = 'changeUrl';
    }

    public changeUrl(e): void {
        // Disable other navigation links before redirection
        this.$('select[data-type="navigator"], .pagination-links a').attr('disabled', 'disabled');

        // Get the value of the select and navigate to it
        // http://backbonejs.org/#Router-navigate
        Backbone.history.navigate(<string>this.$(e.target).val(), { trigger: true });
    }
}
