/*
	© 2020 NetSuite Inc.
	User may not copy, modify, distribute, or re-bundle or otherwise make available this code;
	provided, however, if you are an authorized user with a NetSuite account or log-in, you
	may use this code subject to the terms that govern your access and use.
*/

/// <amd-module name="Newsletter"/>
// @Typescript-full
import { FooterView } from '../../Footer/JavaScript/Footer.View';
import { NewsletterView } from './Newsletter.View';

export function mountToApp(): void {
    // Set the Newsletter subscription form on the footer
    FooterView.addChildViews({
        FooterContent: function() {
            return new NewsletterView();
        }
    });
}
