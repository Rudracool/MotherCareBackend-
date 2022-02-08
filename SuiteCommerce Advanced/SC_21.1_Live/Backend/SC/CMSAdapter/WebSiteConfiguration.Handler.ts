/**

	© 2020 NetSuite Inc.
	User may not copy, modify, distribute, or re-bundle or otherwise make available this code;
	provided, however, if you are an authorized user with a NetSuite account or log-in, you
	may use this code subject to the terms that govern your access and use.


 * @NApiVersion 2.x
 * @NModuleScope TargetAccount
 */

import * as log from 'N/log';
import { SmtDomain, DomainConfig, LanguageConfig } from '../../../ServiceContract/SC/CMSAdapter/CMSAdapter';
import { Configuration } from '../Libraries/Configuration/Configuration';
import { Website } from '../../Common/Website/Website';

export function getConfiguredDomains(): SmtDomain[] {
    const configuration: Configuration = Configuration.getInstance();
    let configuredDomains: DomainConfig[] = configuration.getConfiguredDomains();

    const hosts = {};
    const smtConfiguredDomains: SmtDomain[] = [];

    const website: Website = new Website(configuration.getSiteid());
    const defaultLanguage = website.getDefaultLanguage().locale;
    const currentDomain = configuration.getDomain();

    configuredDomains = _.filter(
        configuredDomains,
        (domainConfig: DomainConfig): boolean => {
            return (
                domainConfig &&
                domainConfig.cms &&
                domainConfig.cms.useCMS &&
                parseFloat(domainConfig.cms.adapterVersion) > 2
            );
        }
    );

    _.each(
        configuredDomains,
        (domainConfig: DomainConfig): void => {
            if (
                domainConfig.multiDomain &&
                domainConfig.multiDomain.hosts &&
                domainConfig.multiDomain.hosts.languages
            ) {
                _.each(
                    domainConfig.multiDomain.hosts.languages,
                    (language: LanguageConfig): void => {
                        if (
                            language.domain &&
                            language.locale &&
                            _.findWhere(configuredDomains, { domain: language.domain })
                        ) {
                            hosts[language.domain] = language.locale;
                        }
                    }
                );
            }

            hosts[domainConfig.domain] = hosts[domainConfig.domain] || defaultLanguage;
        }
    );

    if (!hosts[currentDomain]) {
        // Adding the current domain
        smtConfiguredDomains.push({
            name: currentDomain,
            locale: defaultLanguage
        });
    }

    _.each(
        hosts,
        (locale: string, domain: string): void => {
            smtConfiguredDomains.push({
                name: domain,
                locale: locale
            });
        }
    );

    return smtConfiguredDomains;
}