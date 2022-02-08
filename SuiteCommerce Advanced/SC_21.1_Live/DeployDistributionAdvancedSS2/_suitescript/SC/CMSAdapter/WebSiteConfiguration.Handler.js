/**

    © 2020 NetSuite Inc.
    User may not copy, modify, distribute, or re-bundle or otherwise make available this code;
    provided, however, if you are an authorized user with a NetSuite account or log-in, you
    may use this code subject to the terms that govern your access and use.


 * @NApiVersion 2.x
 * @NModuleScope TargetAccount
 */
define(["require", "exports", "../Libraries/Configuration/Configuration", "../../Common/Website/Website"], function (require, exports, Configuration_1, Website_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    function getConfiguredDomains() {
        var configuration = Configuration_1.Configuration.getInstance();
        var configuredDomains = configuration.getConfiguredDomains();
        var hosts = {};
        var smtConfiguredDomains = [];
        var website = new Website_1.Website(configuration.getSiteid());
        var defaultLanguage = website.getDefaultLanguage().locale;
        var currentDomain = configuration.getDomain();
        configuredDomains = _.filter(configuredDomains, function (domainConfig) {
            return (domainConfig &&
                domainConfig.cms &&
                domainConfig.cms.useCMS &&
                parseFloat(domainConfig.cms.adapterVersion) > 2);
        });
        _.each(configuredDomains, function (domainConfig) {
            if (domainConfig.multiDomain &&
                domainConfig.multiDomain.hosts &&
                domainConfig.multiDomain.hosts.languages) {
                _.each(domainConfig.multiDomain.hosts.languages, function (language) {
                    if (language.domain &&
                        language.locale &&
                        _.findWhere(configuredDomains, { domain: language.domain })) {
                        hosts[language.domain] = language.locale;
                    }
                });
            }
            hosts[domainConfig.domain] = hosts[domainConfig.domain] || defaultLanguage;
        });
        if (!hosts[currentDomain]) {
            // Adding the current domain
            smtConfiguredDomains.push({
                name: currentDomain,
                locale: defaultLanguage
            });
        }
        _.each(hosts, function (locale, domain) {
            smtConfiguredDomains.push({
                name: domain,
                locale: locale
            });
        });
        return smtConfiguredDomains;
    }
    exports.getConfiguredDomains = getConfiguredDomains;
});
