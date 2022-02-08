/*
	© 2020 NetSuite Inc.
	User may not copy, modify, distribute, or re-bundle or otherwise make available this code;
	provided, however, if you are an authorized user with a NetSuite account or log-in, you
	may use this code subject to the terms that govern your access and use.
*/

/// <amd-module name="Footer.Simplified.View"/>

import '../../SCA/JavaScript/Configuration';
import * as footer_simplified_tpl from 'footer_simplified.tpl';
import * as jQuery from '../../../Commons/Core/JavaScript/jQuery';
import { View } from '../../../Commons/Core/JavaScript/View';
import { Application } from '../../../Commons/ApplicationSkeleton/JavaScript/Application';

import { GlobalViewsBackToTopView } from '../../../Commons/GlobalViews/JavaScript/GlobalViews.BackToTop.View';

// @Typescript-partial
// window object could be undefined
export class FooterSimplifiedView extends View<{}, {}> {
    protected template = footer_simplified_tpl;

    private application: Application;

    protected childViews = {
        'Global.BackToTop': () => {
            return new GlobalViewsBackToTopView();
        }
    };

    public constructor(options: { application: Application }) {
        super();
        this.application = options.application;
        this.application.getLayout().on('afterAppendView', () => {
            // after appended to DOM, we add the footer height as the content bottom padding,
            // so the footer doesn't go on top of the content
            const footer_height = this.$el.find('#site-footer').height();
            if (footer_height) {
                this.$el.find('#content').css('padding-bottom', footer_height);
            }

            // Please note that this solution is taken from this view relative 'Footer.View',
            // and its way to solve sticky footer behavior.
            // Also see the comments there as they apply to here as well.
            setTimeout(() => {
                const headerMargin: number = parseInt(
                    jQuery('#site-header').css('marginBottom'),
                    10
                );
                const contentHeight: number =
                    jQuery(window).innerHeight() -
                    jQuery('#site-header')[0].offsetHeight -
                    headerMargin -
                    jQuery('#site-footer')[0].offsetHeight;
                jQuery('#main-container').css('min-height', contentHeight);
            }, 10);
        });
    }

    public getContext(): {} {
        return {};
    }
}
