/*
	© 2020 NetSuite Inc.
	User may not copy, modify, distribute, or re-bundle or otherwise make available this code;
	provided, however, if you are an authorized user with a NetSuite account or log-in, you
	may use this code subject to the terms that govern your access and use.
*/

/// <amd-module name="ErrorManagementOnline.ResponseErrorParser"/>

import * as _ from 'underscore';
import * as Utils from '../../../Commons/Utilities/JavaScript/Utils';

const ResponseErrorParser: any = function ErrorManagementErrorParser(jqXhr, messageKeys, options) {
    let message = null;
    let current_key;

    try {
        // Tries to parse the responseText and try to read the most common keys for error messages
        const response = JSON.parse(jqXhr.responseText);
        if (response) {
            for (let i = 0; i < messageKeys.length; i++) {
                current_key = messageKeys[i];
                if (response[current_key]) {
                    message = Utils.getTranslatedMessage(
                        response.errorCode || 'ERR_WS_UNHANDLED_ERROR',
                        _.isArray(response[current_key])
                            ? response[current_key][0]
                            : response[current_key],
                        []
                    );
                    break;
                }
            }
        }
    } catch (err) {
        if (options) {
            console.error('Impossible to parse backend error - Request', JSON.stringify(options));
        }
        console.error('Impossible to parse backend error - Response', jqXhr.responseText);
    }
    return message;
};

export = ResponseErrorParser;
