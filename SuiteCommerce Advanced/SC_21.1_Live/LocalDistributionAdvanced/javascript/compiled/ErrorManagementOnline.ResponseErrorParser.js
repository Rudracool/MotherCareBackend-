/*
    © 2020 NetSuite Inc.
    User may not copy, modify, distribute, or re-bundle or otherwise make available this code;
    provided, however, if you are an authorized user with a NetSuite account or log-in, you
    may use this code subject to the terms that govern your access and use.
*/
define("ErrorManagementOnline.ResponseErrorParser", ["require", "exports", "underscore", "Utils"], function (require, exports, _, Utils) {
    "use strict";
    var ResponseErrorParser = function ErrorManagementErrorParser(jqXhr, messageKeys, options) {
        var message = null;
        var current_key;
        try {
            // Tries to parse the responseText and try to read the most common keys for error messages
            var response = JSON.parse(jqXhr.responseText);
            if (response) {
                for (var i = 0; i < messageKeys.length; i++) {
                    current_key = messageKeys[i];
                    if (response[current_key]) {
                        message = Utils.getTranslatedMessage(response.errorCode || 'ERR_WS_UNHANDLED_ERROR', _.isArray(response[current_key])
                            ? response[current_key][0]
                            : response[current_key], []);
                        break;
                    }
                }
            }
        }
        catch (err) {
            if (options) {
                console.error('Impossible to parse backend error - Request', JSON.stringify(options));
            }
            console.error('Impossible to parse backend error - Response', jqXhr.responseText);
        }
        return message;
    };
    return ResponseErrorParser;
});

//# sourceMappingURL=ErrorManagementOnline.ResponseErrorParser.js.map
