/*
	© 2020 NetSuite Inc.
	User may not copy, modify, distribute, or re-bundle or otherwise make available this code;
	provided, however, if you are an authorized user with a NetSuite account or log-in, you
	may use this code subject to the terms that govern your access and use.
*/

/// <amd-module name="SC.MyAccount.Starter"/>
/// <reference path="../../../Commons/Utilities/JavaScript/GlobalDeclarations.d.ts" />

import * as Utils from '../../../Commons/Utilities/JavaScript/Utils';
import * as jQuery from '../../../Commons/Core/JavaScript/jQuery';
import { MyAccount } from '../../MyAccountApplication/JavaScript/SC.MyAccount';
import { Environment } from '../../../Commons/Core/JavaScript/Environment';

import { entryPointModules } from './SC.MyAccount.Starter.Dependencies';

import Backbone = require('../../../Commons/Utilities/JavaScript/backbone.custom');
import extensionsPromise = require('../../../Commons/SC.Extensions/JavaScript/SC.Extensions');

class MyAccountStarter {
    private myAccount;

    public constructor() {
        this.myAccount = MyAccount.getInstance();
        const self = this;
        jQuery(function(): any {
            extensionsPromise.then(
                (...entryPointExtensionsModules): void =>
                    self.init(entryPointModules.concat(entryPointExtensionsModules))
            );
        });
    }

    private init(allModules): void {
        this.myAccount.start(
            allModules,
            (): void => {
                this.checkForErrors();
                this.myAccount.getLayout().appendToDom();
            }
        );
    }

    private checkForErrors(): void {
        const SC = Environment.getSC();
        if (SC.ENVIRONMENT.contextError) {
            this.myAccount
                .getLayout()
                .$('#site-header')
                .hide();
            this.myAccount
                .getLayout()
                .$('#site-footer')
                .hide();
            this.myAccount
                .getLayout()
                .internalError(
                    SC.ENVIRONMENT.contextError.errorMessage,
                    `Error ${SC.ENVIRONMENT.contextError.errorStatusCode}: ${
                        SC.ENVIRONMENT.contextError.errorCode
                    }`
                );
        } else {
            const { fragment } = Utils.parseUrlOptions(location.search);
            if (fragment && !location.hash) {
                location.hash = decodeURIComponent(fragment.toString());
            }
            Backbone.history.start();
        }
    }
}

export = new MyAccountStarter();
