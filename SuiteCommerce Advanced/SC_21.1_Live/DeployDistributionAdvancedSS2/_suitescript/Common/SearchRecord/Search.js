/**

    © 2020 NetSuite Inc.
    User may not copy, modify, distribute, or re-bundle or otherwise make available this code;
    provided, however, if you are an authorized user with a NetSuite account or log-in, you
    may use this code subject to the terms that govern your access and use.


 * @NApiVersion 2.x
 * @NModuleScope TargetAccount
 */
define(["require", "exports", "N/search", "../Format/Format", "./SearchFilter", "../../third_parties/underscore.js"], function (require, exports, search_1, Format_1, SearchFilter_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.SearchColumnSummary = search_1.Summary;
    var SearchColumnSort;
    (function (SearchColumnSort) {
        SearchColumnSort["DESC"] = "DESC";
        SearchColumnSort["ASC"] = "ASC";
        SearchColumnSort["NONE"] = "NONE";
    })(SearchColumnSort = exports.SearchColumnSort || (exports.SearchColumnSort = {}));
    var Search = /** @class */ (function () {
        function Search(type) {
            this.columns = {};
            this.columnMap = {};
            this.sort = {};
            this.type = type;
        }
        Search.prototype.addColumn = function (column, alias) {
            var _a;
            var _this = this;
            if (alias === void 0) { alias = {}; }
            var columnFormula = column.formula;
            var columnSummary = column.summary;
            var columnName = column.columnName;
            var columnJoin;
            // default alias
            if (_.isEmpty(alias)) {
                alias[columnName] = Format_1.Format.getInstance().toValue;
            }
            // handle joins:
            if (columnName.indexOf('.') > -1) {
                _a = columnName.split('.'), columnJoin = _a[0], columnName = _a[1];
            }
            var columnOptions = { name: columnName };
            if (columnJoin) {
                columnOptions.join = columnJoin;
            }
            if (columnFormula) {
                columnOptions.formula = columnFormula;
            }
            if (columnSummary) {
                columnOptions.summary = columnSummary;
            }
            // add column
            this.columns[columnName] = search_1.createColumn(columnOptions);
            this.columnMap = _.extend(this.columnMap, _.mapObject(alias, function (converter) { return ({
                column: _this.columns[columnName],
                alias: converter
            }); }));
            return this;
        };
        Search.prototype.sortBy = function (alias, sort) {
            if (sort === void 0) { sort = SearchColumnSort.ASC; }
            if (alias) {
                this.sort[alias] = sort;
            }
            return this;
        };
        Search.prototype.setFilters = function (expressions) {
            var getFilter = function (expression) {
                if (Array.isArray(expression)) {
                    return expression.map(getFilter);
                }
                return expression instanceof SearchFilter_1.SearchFilter ? expression.get() : expression;
            };
            if (!Array.isArray(expressions)) {
                expressions = [expressions];
            }
            this.filters = expressions.map(getFilter);
            return this;
        };
        Search.prototype.getAll = function () {
            var result = [];
            this.run().each(function (row) {
                result.push(row);
                return true;
            });
            return this.convertResult(result);
        };
        Search.prototype.getPaginated = function (page, resultsPerPage) {
            if (page === void 0) { page = 1; }
            if (resultsPerPage === void 0) { resultsPerPage = 20; }
            var search = this.run(resultsPerPage);
            if (!(page > 0)) {
                page = 1;
            }
            var result = search.count ? search.fetch({ index: page - 1 }).data : [];
            if (result.length && result.length > resultsPerPage) {
                // the Nsearch.fetch minimum results per page is 5.
                result = result.slice(0, resultsPerPage);
            }
            return {
                page: String(page),
                recordsPerPage: resultsPerPage,
                totalRecordsFound: search.count,
                records: this.convertResult(result)
            };
        };
        Search.prototype.getFirst = function () {
            return this.convertResult(this.run().getRange({ start: 0, end: 1 }))[0];
        };
        Search.prototype.convertResult = function (results) {
            var _this = this;
            return results.map(function (result) {
                var fields = {};
                _.each(_this.columnMap, function (columnData, alias) {
                    fields[alias] = (columnData.alias || _.identity).call(Format_1.Format.getInstance(), result.getValue(columnData.column), result.getText(columnData.column), result.recordType);
                });
                return fields;
            });
        };
        Search.prototype.run = function (pageRange) {
            var _this = this;
            _.each(this.sort, function (sort, name) {
                if (_this.columnMap[name] && _this.columnMap[name].column) {
                    _this.columnMap[name].column.sort = sort;
                }
            });
            var search = search_1.create({
                type: this.type,
                columns: _.values(this.columns),
                filters: this.filters
            });
            return Number(pageRange) > 0 ? search.runPaged({ pageSize: pageRange }) : search.run();
        };
        Search.lookupFields = function (columns, type, id) {
            if (id === void 0) { id = 1; }
            try {
                var resultsArray = search_1.lookupFields({
                    type: type,
                    id: id,
                    columns: columns.map(function (column) { return column.columnName; })
                });
                var results = _.mapObject(resultsArray, function (result) {
                    return result[0];
                });
                return results;
            }
            catch (e) {
                return null;
            }
        };
        return Search;
    }());
    exports.Search = Search;
});
