export interface SmtDomain {
    name: string;
    locale: string;
}

export interface LanguageConfig {
    domain: string;
    locale: string;
}

export interface DomainConfig {
    domain: string;
    cms: {
        useCMS: boolean;
        adapterVersion: string;
    };
    multiDomain: {
        hosts: {
            languages: LanguageConfig[];
        };
    };
}
