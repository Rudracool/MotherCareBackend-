/*
	© 2020 NetSuite Inc.
	User may not copy, modify, distribute, or re-bundle or otherwise make available this code;
	provided, however, if you are an authorized user with a NetSuite account or log-in, you
	may use this code subject to the terms that govern your access and use.
*/

/// <amd-module name="SC.Shopping"/>

import '../../../Commons/BackboneExtras/JavaScript/Backbone.Model';
import '../../../Commons/BackboneExtras/JavaScript/Backbone.Sync';
import '../../../Commons/Core/JavaScript/backbone/BackboneExtras';
import '../../../Commons/BackboneExtras/JavaScript/Backbone.View';
import '../../../Commons/BackboneExtras/JavaScript/Backbone.View.render';
import '../../../Commons/BackboneExtras/JavaScript/Backbone.View.saveForm';
import '../../../Commons/BackboneExtras/JavaScript/Backbone.View.toggleReset';
import '../../../Commons/BootstrapExtras/JavaScript/Bootstrap.Rate';
import '../../../Commons/BootstrapExtras/JavaScript/Bootstrap.Slider';
import '../../../Commons/jQueryExtras/JavaScript/jQuery.scPush';
import '../../../Commons/NativesExtras/JavaScript/String.format';
import * as Utils from '../../../Commons/Utilities/JavaScript/Utils';
import { jQuery } from '../../jQuerySCAExtras/JavaScript/jQuerySCAExtras';
import { ApplicationOnline } from '../../SCA/JavaScript/ApplicationOnline';
import { ShoppingLayout } from './SC.Shopping.Layout';
import { Environment } from '../../../Commons/Core/JavaScript/Environment';

import Configuration = require('../../ShoppingApplication/JavaScript/SC.Shopping.Configuration');

export class Shopping extends ApplicationOnline {
    protected static instance: Shopping;

    private constructor() {
        super();
        this.layout = new ShoppingLayout(this);
        this.configuration = Configuration.get();
        // This is only to avoid break extensions in 20.2 release. Should be deleted asap
        this.Configuration = this.configuration;

        // Setup global cache for this application
        jQuery.ajaxSetup({ cache: true });
        jQuery.ajaxPrefilter(this.ajaxPrefilter);
    }

    private ajaxPrefilter(options): void {
        const SC = Environment.getSC();
        if (options.url) {
            if (options.type === 'GET' && options.data) {
                const join_string = ~options.url.indexOf('?') ? '&' : '?';
                options.url = options.url + join_string + options.data;
                options.data = '';
            }

            options.url = Utils.reorderUrlParams(options.url);
        }

        if ((<any>options).pageGeneratorPreload && SC.ENVIRONMENT.jsEnvironment === 'server') {
            jQuery('<img />', { src: options.url, alt: '', style: 'display: none;' }).prependTo(
                'body'
            );
        }
    }

    public static getInstance(): Shopping {
        this.instance = this.instance || new Shopping();
        return this.instance;
    }

    public getName(): string {
        return 'Shopping';
    }
}
