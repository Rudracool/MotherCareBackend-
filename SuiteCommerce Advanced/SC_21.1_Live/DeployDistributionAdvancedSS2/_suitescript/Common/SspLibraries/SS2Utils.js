/**

    © 2020 NetSuite Inc.
    User may not copy, modify, distribute, or re-bundle or otherwise make available this code;
    provided, however, if you are an authorized user with a NetSuite account or log-in, you
    may use this code subject to the terms that govern your access and use.


 * @NApiVersion 2.x
 * @NModuleScope TargetAccount
 */
define(["require", "exports", "N/search"], function (require, exports, search) {
    "use strict";
    return {
        getFieldsAsObject: function (rec, values, texts, texts_and_values, sublist_name) {
            var obj = {};
            if (sublist_name) {
                _.each(values, function (value, key) {
                    obj[key] = rec.getCurrentSublistValue({
                        sublistId: sublist_name,
                        fieldId: value
                    });
                });
                _.each(texts, function (value, key) {
                    obj[key] = rec.getCurrentSublistText({
                        sublistId: sublist_name,
                        fieldId: value
                    });
                });
                _.each(texts_and_values, function (value, key) {
                    obj[key] = {};
                    obj[key][value.concat('Value')] = rec.getCurrentSublistValue({
                        sublistId: sublist_name,
                        fieldId: value
                    });
                    obj[key][value.concat('Text')] = rec.getCurrentSublistText({
                        sublistId: sublist_name,
                        fieldId: value
                    });
                });
            }
            else {
                _.each(values, function (value, key) {
                    obj[key] = rec.getValue({ fieldId: value });
                });
                _.each(texts, function (value, key) {
                    obj[key] = rec.getText({ fieldId: value });
                });
                _.each(texts_and_values, function (value, key) {
                    obj[key] = {};
                    obj[key][value.concat('Value')] = rec.getValue({
                        fieldId: value
                    });
                    obj[key][value.concat('Text')] = rec.getText({
                        fieldId: value
                    });
                });
            }
            return obj;
        },
        iterateSublist: function (rec, sublist_name, fn) {
            var lines_length = rec.getLineCount({
                sublistId: sublist_name
            });
            for (var line = 0; line < lines_length; line++) {
                rec.selectLine({
                    sublistId: sublist_name,
                    line: line
                });
                var result = fn(line);
                if (result === false) {
                    break;
                }
            }
        },
        iterateAllSearchResults: function (type, columns, filters, page, fn) {
            var paged = !!page
                ? {
                    pageSize: 20
                }
                : {};
            var paged_search = search
                .create({
                type: type,
                columns: columns,
                filters: filters
            })
                .runPaged(paged);
            if (paged_search.count == 0)
                return;
            if (!!page) {
                var my_page = paged_search.fetch({ index: page - 1 });
                my_page.data.forEach(fn);
                return my_page.pagedData.count;
            }
            else {
                paged_search.pageRanges.forEach(function (pageRange) {
                    var my_page = paged_search.fetch({ index: pageRange.index });
                    my_page.data.forEach(fn);
                });
            }
        }
    };
});
