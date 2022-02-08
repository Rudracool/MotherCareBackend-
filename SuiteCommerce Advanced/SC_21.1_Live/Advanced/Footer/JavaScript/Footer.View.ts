/*
	© 2020 NetSuite Inc.
	User may not copy, modify, distribute, or re-bundle or otherwise make available this code;
	provided, however, if you are an authorized user with a NetSuite account or log-in, you
	may use this code subject to the terms that govern your access and use.
*/

/// <amd-module name="Footer.View"/>
// @Typescript-partial
/*
 * It's partially migrated because configuration import is not right
 * */

import * as footer_tpl from 'footer.tpl';
import * as jQuery from '../../../Commons/Core/JavaScript/jQuery';
import { View } from '../../../Commons/Core/JavaScript/View';
import { GlobalViewsBackToTopView } from '../../../Commons/GlobalViews/JavaScript/GlobalViews.BackToTop.View';
import { Configuration } from '../../SCA/JavaScript/Configuration';
import { ApplicationOnline } from '../../SCA/JavaScript/ApplicationOnline';

interface FooterViewContext {
    showFooterNavigationLinks: boolean;
    footerNavigationLinks: string[];
}
export class FooterView extends View<FooterViewContext> {
    protected template = footer_tpl;

    private application: ApplicationOnline;

    public childViews = {
        'Global.BackToTop': () => {
            return new GlobalViewsBackToTopView();
        }
    };

    public constructor(options: { application: ApplicationOnline }) {
        super();
        this.application = options.application;

        /* after appended to DOM, we add the footer height as the content bottom padding,
        so the footer doesn't go on top of the content wrap it in a setTimeout because
        if not, calling height() can take >150 ms in slow devices - forces the browser
        to re-compute the layout.
        */
        this.application.getLayout().on('afterAppendToDom', function(): void {
            const headerMargin = 25;

            setTimeout(function() {
                const contentHeight: number =
                    jQuery(window).innerHeight() -
                    jQuery('#site-header')[0].offsetHeight -
                    headerMargin -
                    jQuery('#site-footer')[0].offsetHeight;
                jQuery('#main-container').css('min-height', contentHeight);
            }, 10);
        });
    }

    public getContext(): FooterViewContext {
        const footerNavigationLinks = Configuration.get('footer.navigationLinks', []);
        return {
            showFooterNavigationLinks: !!footerNavigationLinks.length,
            footerNavigationLinks: footerNavigationLinks
        };
    }
}
