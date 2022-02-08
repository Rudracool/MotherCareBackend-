/*
	© 2020 NetSuite Inc.
	User may not copy, modify, distribute, or re-bundle or otherwise make available this code;
	provided, however, if you are an authorized user with a NetSuite account or log-in, you
	may use this code subject to the terms that govern your access and use.
*/

/// <amd-module name="Url"/>
// @Typescript-full

/**
 * REFERENCES
 * https://tools.ietf.org/html/rfc1808
 */

interface NetLocComponent {
    user: string;
    password: string;
    domain: string;
    port: string;
}

export class Url {
    private schema: string;

    private netLoc: string;

    private strUrl: string;

    private path: string;

    private parameters: string;

    private fragment: string;

    private query: string;

    private netLocComponet: NetLocComponent;

    public constructor(url: string) {
        let match: RegExpMatchArray;
        const parametersRegex = /([^;]*)(;(.*))*/;
        const queryRegex = /([^?]*)(\?(.*))*/;
        const netLocRegex = /^\/\/([^\/]*)(.*)/;
        const squemaNameRegex = /^([a-zA-Z+\-.]+):(.+)/;
        const fragmentRegex = /([^#]*)(#(.*))*/;
        const netLocComponentsRegex = /(([^:@]*)(:([^@]*))?@)*([\d\w.-]+)$/;

        this.strUrl = url;

        // Parse Fragment
        match = url.match(fragmentRegex);
        if (match) {
            this.fragment = match[3];
            url = match[1];
        }

        // Parse Schema
        match = url.match(squemaNameRegex);
        if (match) {
            this.schema = match[1];
            url = match[2];
        }

        // Parse NetLoc
        match = url.match(netLocRegex);
        if (match) {
            this.netLoc = match[1];
            url = match[2];
        }

        // Parse Query
        match = url.match(queryRegex);
        if (match) {
            this.query = match[3];
            url = match[1];
        }

        // Parse Parameters
        match = url.match(parametersRegex);
        if (match) {
            this.parameters = match[3];
            url = match[1];
        }

        // Set Path
        this.path = url;

        // Parse NetLocComponents
        // todo: implement parsing validations
        if (this.netLoc) {
            match = this.netLoc.match(netLocComponentsRegex);
            let user;
            let password;
            let domain;
            let port;
            if (match) {
                if (match[2] !== undefined) {
                    user = match[2];
                    // password can only be considered if a user was provided
                    if (match[4] !== undefined) {
                        password = match[4];
                    }
                }
                if (match[5] !== undefined) {
                    domain = match[5];
                    if (match[7] !== undefined) {
                        port = match[7];
                    }
                }
            }
            this.netLocComponet = { user, password, domain, port };
        }
    }

    public toString(): string {
        let url = '';
        if (this.schema) {
            url += `${this.schema}:`;
        }
        if (this.netLoc) {
            url += `//${this.netLoc}`;
        }
        if (this.path) {
            url += this.path;
        }
        if (this.parameters) {
            url += `;${this.parameters}`;
        }
        if (this.query) {
            url += `?${this.query}`;
        }
        if (this.fragment) {
            url += `#${this.fragment}`;
        }
        return url;
    }

    public resolve(baseUrlStr: string): Url {
        const baseUrl: Url = new Url(baseUrlStr);

        // step 1
        if (!baseUrl.strUrl) {
            return this;
        }
        // step 2 - a
        if (!this.strUrl) {
            return baseUrl;
        }

        const absoluteUrl: Url = new Url(this.strUrl);

        // step 2 - b
        if (this.schema) {
            return this;
        }

        // step 2 - c
        absoluteUrl.schema = baseUrl.schema;

        // step 3
        if (!this.netLoc) {
            absoluteUrl.netLoc = baseUrl.netLoc;
            // step 4
            if (this.path.indexOf('/') !== 0) {
                // step 5
                if (!this.path) {
                    absoluteUrl.path = baseUrl.path;
                    // step 5 - a
                    if (!this.parameters) {
                        absoluteUrl.parameters = baseUrl.parameters;
                        if (!this.query) {
                            absoluteUrl.query = baseUrl.query;
                        }
                    }
                } else {
                    // step 6
                    const basePath = baseUrl.path.substr(0, baseUrl.path.lastIndexOf('/'));
                    absoluteUrl.path = basePath + '/' + this.path;
                    // step 6 - a,b
                    absoluteUrl.path = absoluteUrl.path.replace(/(\/\.\/)|(\/\.$)/g, '/');
                    // step 6 - c
                    let tmpPath = '';
                    while (tmpPath !== absoluteUrl.path) {
                        tmpPath = absoluteUrl.path;
                        absoluteUrl.path = absoluteUrl.path.replace(/\/*[^./]+\/\.\.\//, '/');
                    }
                    // step 6 - d
                    absoluteUrl.path = absoluteUrl.path.replace(/\/*[^./]+\/\.\.$/, '/');
                }
            }
        }
        return absoluteUrl;
    }

    public getNetLocComponets(): NetLocComponent {
        return this.netLocComponet;
    }
}
