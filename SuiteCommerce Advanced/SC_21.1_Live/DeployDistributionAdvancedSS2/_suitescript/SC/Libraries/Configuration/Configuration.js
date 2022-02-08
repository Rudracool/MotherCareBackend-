/**

    © 2020 NetSuite Inc.
    User may not copy, modify, distribute, or re-bundle or otherwise make available this code;
    provided, however, if you are an authorized user with a NetSuite account or log-in, you
    may use this code subject to the terms that govern your access and use.


 * @NApiVersion 2.x
 * @NModuleScope TargetAccount
 */
define(["require", "exports", "N/search", "N/log", "./configurationManifest", "../../../Common/SspLibraries/Utils", "../../../Common/ActivationContext/ActivationContext", "../../../Common/Environment/Environment"], function (require, exports, search, log, configurationManifest_1, Utils, ActivationContext_1, Environment_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var Configuration = /** @class */ (function () {
        function Configuration() {
            this.recordType = 'customrecord_ns_sc_configuration';
            this.custrecordNsSccKey = 'custrecord_ns_scc_key';
            this.custrecordNsSccValue = 'custrecord_ns_scc_value';
        }
        Configuration.getInstance = function () {
            if (!this.instance) {
                this.instance = new Configuration();
            }
            return this.instance;
        };
        Configuration.prototype.getConfiguredDomains = function () {
            var _this = this;
            var configuredDomains = [];
            try {
                var configurationRecords = search
                    .create({
                    type: this.recordType,
                    columns: [
                        search.createColumn({ name: this.custrecordNsSccValue }),
                        search.createColumn({ name: this.custrecordNsSccKey })
                    ],
                    filters: [
                        search.createFilter({
                            name: this.custrecordNsSccKey,
                            operator: search.Operator.CONTAINS,
                            values: this.siteid + "|"
                        })
                    ]
                })
                    .run();
                configurationRecords.each(function (configurationRow) {
                    var domainConfig;
                    try {
                        domainConfig = JSON.parse((configurationRow.getValue(_this.custrecordNsSccValue)));
                    }
                    catch (e) {
                        log.error('Error trying to parse domain configuration', JSON.stringify(e));
                        return true;
                    }
                    var key = configurationRow.getValue(_this.custrecordNsSccKey);
                    domainConfig.domain = key.substring(key.indexOf('|') + 1);
                    configuredDomains.push(domainConfig);
                    return true;
                });
            }
            catch (e) {
                log.error('No configuration record found', JSON.stringify(e));
            }
            return configuredDomains;
        };
        Configuration.prototype.get = function (path) {
            return Utils.getPathFromObject(this.getValues(), path);
        };
        Configuration.prototype.set = function (path, value) {
            Utils.setPathFromObject(this.getValues(), path, value);
        };
        Configuration.prototype.getDefault = function (path) {
            var defaultValues = this.getDefaultValues();
            return Utils.getPathFromObject(defaultValues, path);
        };
        Configuration.prototype.getDefaultValues = function () {
            if (!this.defaultValues) {
                this.defaultValues = Utils.deepExtend(configurationManifest_1.configurationManifest(), ActivationContext_1.getExtensionsDefaultValues(this.domain, this.requestedUrl));
                this.adaptValuesByHost();
            }
            return this.defaultValues;
        };
        Configuration.prototype.getValues = function () {
            if (!this.values) {
                this.values = this.allConfigurations();
                this.adaptValuesByHost();
            }
            return this.values;
        };
        /**
         * Merge and return all default and custom configuration.
         */
        Configuration.prototype.allConfigurations = function () {
            var valuesFromModules = this.getDefaultValues();
            // from record (custom configuration):
            var customValuesFromRecord = this.getValuesFromRecord();
            return Utils.deepExtend(valuesFromModules, customValuesFromRecord);
        };
        Configuration.prototype.getValuesFromRecord = function () {
            var key = this.siteid + "|" + (this.domain || 'all');
            var configurationRecord;
            // Search without SearchRecordHelper to avoid circular dependencies
            try {
                configurationRecord = search
                    .create({
                    type: this.recordType,
                    columns: [search.createColumn({ name: this.custrecordNsSccValue })],
                    filters: [
                        search.createFilter({
                            name: this.custrecordNsSccKey,
                            operator: search.Operator.IS,
                            values: key
                        })
                    ]
                })
                    .run()
                    .getRange({ start: 0, end: 1 })[0];
            }
            catch (e) {
                log.debug('No configuration record found', { key: key });
            }
            return configurationRecord
                ? JSON.parse(configurationRecord.getValue(this.custrecordNsSccValue))
                : {};
        };
        Configuration.prototype.adaptValuesByHost = function () {
            var _this = this;
            var multiDomain = this.get('multiDomain');
            if (multiDomain && multiDomain.hosts && multiDomain.hosts.languages) {
                var domainLanguages = multiDomain.hosts.languages;
                domainLanguages.forEach(function (language) {
                    var hosts = _this.get('hosts') || [];
                    var storedHost = _.find(hosts, function (host) { return host.title === language.host; });
                    var hostLanguaje = {
                        title: language.title,
                        host: language.domain,
                        locale: language.locale
                    };
                    if (!storedHost) {
                        hosts.push({
                            title: language.host,
                            languages: [hostLanguaje],
                            currencies: _.filter(_this.get('multiDomain.hosts.currencies'), function (currency) { return currency.host === language.host; })
                        });
                    }
                    else {
                        storedHost.languages.push(hostLanguaje);
                    }
                    _this.set('hosts', hosts);
                });
                if (!Environment_1.Environment.getInstance().isFeatureInEffect('COMMERCECATEGORIES')) {
                    this.set('categories', false);
                }
            }
        };
        /**
         * We have no method in SS2 to get domain name and site id, which are
         * necessary to create the key that is related to the specific configuration record.
         *
         * Call this method to setup configuration with specific domain and site.
         */
        Configuration.prototype.setSiteAndDomain = function (siteid, domain, requestedUrl) {
            this.siteid = siteid;
            this.domain = domain;
            this.requestedUrl = requestedUrl;
        };
        Configuration.prototype.getDomain = function () {
            return this.domain;
        };
        Configuration.prototype.getSiteid = function () {
            return this.siteid;
        };
        return Configuration;
    }());
    exports.Configuration = Configuration;
});
