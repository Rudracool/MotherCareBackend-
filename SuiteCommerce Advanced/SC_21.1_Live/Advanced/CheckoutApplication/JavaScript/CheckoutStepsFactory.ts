/*
	© 2020 NetSuite Inc.
	User may not copy, modify, distribute, or re-bundle or otherwise make available this code;
	provided, however, if you are an authorized user with a NetSuite account or log-in, you
	may use this code subject to the terms that govern your access and use.
*/

/// <amd-module name="CheckoutStepsFactory"/>

import { requireModules } from '../../../Commons/Utilities/JavaScript/Utils';
import { jQuery } from '../../jQuerySCAExtras/JavaScript/jQuerySCAExtras';
import { Environment } from '../../../Commons/Core/JavaScript/Environment';
import { Standard } from './SC.Checkout.Configuration.Steps.Standard';
import { OPC } from './SC.Checkout.Configuration.Steps.OPC';
import { BillingFirst } from './SC.Checkout.Configuration.Steps.BillingFirst';
import { View } from '../../../Commons/Core/JavaScript/View';
import { WizardStepModule } from '../../Wizard/JavaScript/Wizard.StepModule';

export interface CheckoutStepGroup {
    name: string;
    steps: CheckoutStep[];
}

interface CheckoutModule {
    0: WizardStepModule;
    1?: { [key: string]: any };
}

interface CheckoutStep {
    name?: string;
    url: string;
    isActive?: () => boolean;
    modules: CheckoutModule[];
    bottomMessage?: string | (() => string);
    past?: () => Promise<void>;
    continueButtonLabel?: string | (() => string);
    save?: () => Promise<void>;
    hideContinueButton?: boolean;
    hideBackButton?: boolean;
    hideBreadcrumb?: boolean;
    hideSecondContinueButtonOnPhone?: boolean;
    headerView?: View<{}>;
}

export class CheckoutStepsFactory {
    private static instance: CheckoutStepsFactory;

    private implementationsMap: { [key: string]: CheckoutStepGroup[] } = {
        Standard: Standard,
        'One Page': OPC,
        'Billing First': BillingFirst
    };
    private checkoutName: string;

    private constructor() {
        const Application = Environment.getApplication();
        const { checkoutApp } = Application.getConfig();
        this.checkoutName = checkoutApp.checkoutSteps;
    }

    public getCheckoutSteps(): CheckoutStepGroup[] {
        return this.implementationsMap[this.checkoutName];
    }

    public loadCheckoutSteps(): Promise<void> {
        const promise = jQuery.Deferred();
        const implementation = this.getCheckoutSteps();
        if (implementation) {
            promise.resolve(implementation);
        } else {
            requireModules([this.checkoutName], promise.resolve, promise.reject);
        }

        return promise.then(
            (checkoutSteps): void => {
                this.implementationsMap[this.checkoutName] = checkoutSteps;
            }
        );
    }

    public static getInstance(): CheckoutStepsFactory {
        this.instance = this.instance || new CheckoutStepsFactory();
        return this.instance;
    }
}
