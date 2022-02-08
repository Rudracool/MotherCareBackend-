/*
	© 2020 NetSuite Inc.
	User may not copy, modify, distribute, or re-bundle or otherwise make available this code;
	provided, however, if you are an authorized user with a NetSuite account or log-in, you
	may use this code subject to the terms that govern your access and use.
*/

/// <amd-module name="SC.Checkout.Layout"/>

import * as checkout_layout_tpl from 'checkout_layout.tpl';
import * as Utils from '../../../Commons/Utilities/JavaScript/Utils';

import { ApplicationOnlineLayout } from '../../SCA/JavaScript/ApplicationOnlineLayout';

export class CheckoutLayout extends ApplicationOnlineLayout {
    protected template = checkout_layout_tpl;
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
            'data-touchpoint': 'checkout',
            'data-hashtag': '#',
            text: Utils.translate('Checkout')
        }
    ];
}
