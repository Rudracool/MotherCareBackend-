/*
	© 2020 NetSuite Inc.
	User may not copy, modify, distribute, or re-bundle or otherwise make available this code;
	provided, however, if you are an authorized user with a NetSuite account or log-in, you
	may use this code subject to the terms that govern your access and use.
*/

/// <amd-module name="QuoteToSalesOrderWizard"/>

import { ProfileModel } from '../../../Commons/Profile/JavaScript/Profile.Model';
import { QuoteToSalesOrderWizardConfiguration } from './QuoteToSalesOrderWizard.Configuration';

import QuoteToSalesOrderWizardRouter = require('./QuoteToSalesOrderWizard.Router');
import QuoteToSalesOrderView = require('./QuoteToSalesOrderWizard.View');
import QuoteToSalesOrderModel = require('../../QuoteToSalesOrder/JavaScript/QuoteToSalesOrder.Model');

// @class QuoteToSalesOrderWizard @extend ApplicationModule

// @method mountToApp
// @param {ApplicationSkeleton} application
// @return {QuoteToSalesOrderWizard.Router} A new instance of the router class
export function mountToApp(application) {
    const quoteRouter = new QuoteToSalesOrderWizardRouter(application, {
        steps: QuoteToSalesOrderWizardConfiguration.steps,
        model: new QuoteToSalesOrderModel(),
        profile: ProfileModel.getInstance()
    });

    QuoteToSalesOrderView.wizard = quoteRouter;

    return quoteRouter;
}
