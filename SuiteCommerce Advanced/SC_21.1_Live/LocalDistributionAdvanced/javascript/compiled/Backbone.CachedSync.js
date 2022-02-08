/*
    © 2020 NetSuite Inc.
    User may not copy, modify, distribute, or re-bundle or otherwise make available this code;
    provided, however, if you are an authorized user with a NetSuite account or log-in, you
    may use this code subject to the terms that govern your access and use.
*/
define("Backbone.CachedSync", ["require", "exports", "underscore", "jQuery", "Backbone"], function (require, exports, _, jQuery, Backbone) {
    "use strict";
    // @module Backbone @class Backbone
    // @property {Object<String,jQuery.Deferred>} localCache The cache is an object where keys are a request identifier and values are a the result of the request and some metadata. @static
    Backbone.localCache = {};
    // @property {Number} cacheSize We will cap the size of the cache by an arbitratry number, fell free to change it to meet your needs.
    Backbone.cacheSize = 100;
    // Removes the oldest requests once the limit is reached
    function evictRecords() {
        var keys = _.keys(Backbone.localCache);
        var cache_size = keys.length;
        if (cache_size > Backbone.cacheSize) {
            delete Backbone.localCache[keys[0]];
        }
    }
    // @method cachedSync
    // This method is the base for implementing backbone model caching in memory. Adds a cache
    // layer to all read requests, but leaves all write actions unmodified. Can be used
    // interchangeably with Backbone.sync (has the same API), it will retun a jQuery promise once
    // it's done will call the apropiate function
    // @return {jQuery.Deferred} Generates a new deferred for every new sync, no matter if its
    // or not in the cache. This promise is / already-was resolved with the ajax call.
    Backbone.cachedSync = function (action, self, options) {
        // Generates an uninque url that will be used as the request identifier
        var url = normalizeUrl(_.result(this, 'url'), options.data);
        if (action === 'read') {
            var deferred_1 = jQuery.Deferred();
            // jQuery.ajax maps error to fail and success to done
            deferred_1.error = deferred_1.fail;
            deferred_1.success = deferred_1.done;
            // Now we make sure the success and error options are called
            deferred_1.success(options.success);
            deferred_1.error(options.error);
            // We then delete them from the options that will be passed to the real call so they are not called twice, for the 1st request
            delete options.success;
            delete options.error;
            if (options.cache !== false) {
                // Force ajaxSetup cache to be true and not append a &_={timestamp} to the end of the URL
                options.cache = true;
            }
            if (options.cache && Backbone.localCache[url]) {
                deferred_1.resolveWith(this, [
                    Backbone.localCache[url],
                    'success',
                    {
                        response: Backbone.localCache[url],
                        status: 'success',
                        statusCode: '200',
                        readyState: 4,
                        statusText: 'OK',
                        responseText: false // So it will use response instead of responseText
                    }
                ]);
            }
            else {
                var syncResult_1 = Backbone.sync.apply(this, arguments);
                syncResult_1.then(
                // Success Callback
                function (response, status, jqXhr) {
                    Backbone.localCache[url] = response;
                    // Sometimes parse modifies the responce object (that is passed by reference)
                    response = jqXhr.responseText ? JSON.parse(jqXhr.responseText) : response;
                    // now we resolve the defered one with results
                    deferred_1.resolveWith(syncResult_1, [response, status, jqXhr]);
                    // This make sure the cache is keept short
                    evictRecords();
                }, 
                // Error Callback
                function () {
                    // if it fails we make sure the next time its requested, dont read from cache
                    delete Backbone.localCache[url];
                    deferred_1.rejectWith(syncResult_1, arguments);
                }, 
                // Progess Callback
                function () {
                    deferred_1.notifyWith(syncResult_1, arguments);
                });
            }
            // Then we just return the defered
            return deferred_1;
            // Bottom line: we are piping a fake ajax deferred from the original one
        }
        var result = Backbone.sync.apply(this, arguments);
        result.done(function (r) {
            delete Backbone.localCache[url];
        });
        return result;
    };
    // @module BackboneExtras
    // @class Backbone.CachedModel @method addToCache @param data @param {Object} params
    // @class Backbone.CachedCollection @method addToCache @param data @param {Object} params
    function addToCache(data, params) {
        /* jshint validthis:true*/
        // Generates an unique url that will be used as the request identifier
        var url = normalizeUrl(_.result(this, 'url'), params);
        // This defered will be used as a fake Ajax Request we are gonna store in the cache
        var deferred = jQuery.Deferred();
        // We resolve the defered with the data you sent and some fake ajax info
        deferred.resolveWith(this, [
            data,
            'success',
            {
                response: data,
                status: 'success',
                statusCode: '200',
                readyState: 4,
                statusText: 'OK',
                responseText: false // So it will use response instead of responseText
            }
        ]);
        // Stores this fake promice in the cache
        Backbone.localCache[url] = data;
    }
    // @class Backbone.CachedModel @method isCached @param {Object} params @return {Boolean}
    // @class Backbone.CachedCollection @method isCached @param {Object} params @return {Boolean}
    function isCached(params) {
        /* jshint validthis:true*/
        // Generates an uninque url that will be used as the request identifier
        var url = normalizeUrl(_.result(this, 'url'), params);
        return !!Backbone.localCache[url];
    }
    function normalizeUrl(url, params) {
        if (params) {
            try {
                var sorted = _.keys(params).sort();
                var sorted_params = [];
                for (var i = 0; i < sorted.length; i++) {
                    sorted_params.push(sorted[i] + '=' + params[sorted[i]]);
                }
                var question_pos = url.indexOf('?');
                url += (question_pos > 0 ? '&' : '?') + sorted_params.join('&');
            }
            catch (e) {
                url += (~url.indexOf('?') ? '&' : '?') + jQuery.param(params);
            }
        }
        return url;
    }
    return {
        cachedSync: Backbone.cachedSync,
        addToCache: addToCache,
        isCached: isCached
    };
});

//# sourceMappingURL=Backbone.CachedSync.js.map
