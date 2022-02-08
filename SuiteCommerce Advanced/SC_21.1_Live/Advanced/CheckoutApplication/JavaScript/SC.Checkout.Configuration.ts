/*
	© 2020 NetSuite Inc.
	User may not copy, modify, distribute, or re-bundle or otherwise make available this code;
	provided, however, if you are an authorized user with a NetSuite account or log-in, you
	may use this code subject to the terms that govern your access and use.
*/

/// <amd-module name="SC.Checkout.Configuration"/>

import * as _ from 'underscore';
import * as Utils from '../../../Commons/Utilities/JavaScript/Utils';
import * as jQuery from '../../../Commons/Core/JavaScript/jQuery';
import { Configuration as BaseConfiguration } from '../../SCA/JavaScript/Configuration';
import { Environment } from '../../../Commons/Core/JavaScript/Environment';

const SC = Environment.getSC();

// window.screen = false; //always comment this line on production !!
// Calculates the width of the device, it will try to use the real screen size.
const screen_width = Utils.getViewportWidth();

const Configuration: any = {
    currentTouchpoint: Utils.isInShopping()
        ? 'viewcart'
        : Utils.getParameterByName(window.location.href, 'is') === 'login'
        ? 'login'
        : 'checkout',

    modulesConfig: {
        Cart: { startRouter: Utils.isInShopping() },
        LoginRegister: { startRouter: Utils.isCheckoutDomain() }
    },

    startCheckoutWizard: Utils.isCheckoutDomain(),

    sca: {
        collapseElements: false
    },
    // External Payment configuration.
    // You need to set the url (fragment) to redirect the customer after
    // returns from external payment gateway.
    externalPayment: {
        SALESORDER: {
            // record type
            doneFragment: 'confirmation',
            failFragment: 'billing' // for one page checkout change this value to 'opc'
        }
    }
};

if (SC.ENVIRONMENT.CHECKOUT.skipLogin) {
    Configuration.checkout = Configuration.checkout || {};
    Configuration.checkout.skipLogin = SC.ENVIRONMENT.CHECKOUT.skipLogin;
    delete SC.ENVIRONMENT.CHECKOUT.skipLogin;
}

// Phone Specific
if (screen_width < 768) {
    _.extend(Configuration, {
        collapseElements: true
    });
}
// Tablet Specific
else if (screen_width >= 768 && screen_width <= 978) {
    _.extend(Configuration, {});
}
// Desktop Specific
else {
    _.extend(Configuration, {});
}

// Deep extend
jQuery.extend(true, BaseConfiguration, Configuration);

export = BaseConfiguration;
