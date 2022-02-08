/**

    © 2020 NetSuite Inc.
    User may not copy, modify, distribute, or re-bundle or otherwise make available this code;
    provided, however, if you are an authorized user with a NetSuite account or log-in, you
    may use this code subject to the terms that govern your access and use.


 * @NApiVersion 2.x
 * @NModuleScope TargetAccount
 */
define(["require", "exports", "../../Common/Format/Format", "../Libraries/Configuration/Configuration", "../../Common/SearchRecord/SearchOperator", "../../Common/SearchRecord/SearchFilter", "../../Common/SearchRecord/Search", "./RecordAccess/CaseDao", "../Libraries/Auth/User"], function (require, exports, Format_1, Configuration_1, SearchOperator_1, SearchFilter_1, Search_1, CaseDao_1, User_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var CaseHandler = /** @class */ (function () {
        function CaseHandler() {
            this.caseDao = new CaseDao_1.CaseDao();
            this.schema = this.caseDao.getSchema();
            this.configuration = Configuration_1.Configuration.getInstance();
            this.format = Format_1.Format.getInstance();
            this.user = User_1.User.getInstance();
        }
        CaseHandler.prototype.searchCase = function (filters, sort, order) {
            if (order === void 0) { order = Search_1.SearchColumnSort.ASC; }
            var toCaseField = function (value, text) { return ({ id: value, name: text }); };
            var search = this.caseDao.createSearch();
            search
                .sortBy(sort, order)
                .setFilters(filters)
                .addColumn(this.schema.columns.internalid)
                .addColumn(this.schema.columns.title)
                .addColumn(this.schema.columns.email)
                .addColumn(this.schema.columns.status, { status: toCaseField })
                .addColumn(this.schema.columns.origin, { origin: toCaseField })
                .addColumn(this.schema.columns.category, { category: toCaseField })
                .addColumn(this.schema.columns.company, { company: toCaseField })
                .addColumn(this.schema.columns.priority, { priority: toCaseField })
                .addColumn(this.schema.columns.casenumber, { caseNumber: this.format.toValue })
                .addColumn(this.schema.columns.createddate, { createdDate: this.format.toDateString })
                .addColumn(this.schema.columns.lastmessagedate, {
                lastMessageDate: this.format.toDateString
            });
            return search;
        };
        CaseHandler.prototype.searchMessage = function (caseId) {
            var _this = this;
            var search = this.caseDao.createSearch();
            search.setFilters([
                new SearchFilter_1.SearchFilter(this.schema.filters.internalid, SearchOperator_1.SearchOperator.String.IS, caseId),
                SearchOperator_1.SearchOperator.Logical.AND,
                new SearchFilter_1.SearchFilter(this.schema.joins.messages.filters.internalonly, SearchOperator_1.SearchOperator.String.IS, 'F')
            ]);
            return search
                .addColumn(this.schema.joins.messages.columns.author, {
                author: function (value, text) {
                    return (value === String(_this.user.getId()) ? 'You' : text);
                }
            })
                .addColumn(this.schema.joins.messages.columns.internalid, {
                internalid: this.format.toValue
            })
                .addColumn(this.schema.joins.messages.columns.message, { text: this.format.stripHTML })
                .addColumn(this.schema.joins.messages.columns.messagedate, {
                messageDate: this.format.toValue
            })
                .sortBy('messageDate', Search_1.SearchColumnSort.DESC)
                .getAll();
        };
        CaseHandler.prototype.appendMessagesToCase = function (record) {
            var _this = this;
            var caseRecord = record;
            var messageResult = this.searchMessage(caseRecord.internalid);
            caseRecord.messages_count = messageResult.length;
            var messagesByDate = _.groupBy(messageResult, function (message, index) {
                var todayDate = _this.format.toDateString(new Date());
                var msgDate = _this.format.toDateString(message.messageDate);
                var dateToShow = todayDate === msgDate ? 'Today' : msgDate;
                message.messageDate = _this.format.toTimeOfDay(message.messageDate);
                message.initialMessage = index === messageResult.length - 1;
                return dateToShow;
            });
            caseRecord.grouped_messages = _.map(messagesByDate, function (messages, date) { return ({
                date: date,
                messages: messages
            }); });
            return caseRecord;
        };
        CaseHandler.prototype.get = function (id) {
            var search = this.searchCase([
                new SearchFilter_1.SearchFilter(this.schema.filters.internalid, SearchOperator_1.SearchOperator.String.IS, id),
                SearchOperator_1.SearchOperator.Logical.AND,
                new SearchFilter_1.SearchFilter(this.schema.filters.isinactive, SearchOperator_1.SearchOperator.String.IS, 'F')
            ]);
            var record = search.getFirst();
            return record ? this.appendMessagesToCase(record) : null;
        };
        CaseHandler.prototype.search = function (listHeaderData) {
            var selectedFilter = parseInt(listHeaderData.filter, 10);
            var filters = [
                new SearchFilter_1.SearchFilter(this.schema.filters.isinactive, SearchOperator_1.SearchOperator.String.IS, 'F')
            ];
            if (selectedFilter) {
                filters.push(SearchOperator_1.SearchOperator.Logical.AND);
                filters.push(new SearchFilter_1.SearchFilter(this.schema.filters.status, SearchOperator_1.SearchOperator.Select.ANYOF, selectedFilter));
            }
            var search = this.searchCase(filters, listHeaderData.sort, listHeaderData.order > 0 ? Search_1.SearchColumnSort.DESC : Search_1.SearchColumnSort.ASC);
            return search.getPaginated(listHeaderData.page, this.configuration.get('suitescriptResultsPerPage'));
        };
        CaseHandler.prototype.getCaseFields = function () {
            var record = this.caseDao.createRecord();
            var createCaseField = function (selectOptions) {
                return _(selectOptions).map(function (selectOption) { return ({
                    id: selectOption.value,
                    text: selectOption.text
                }); });
            };
            return {
                origins: createCaseField(record.getFieldSelectOptions(this.schema.fields.origin)),
                categories: createCaseField(record.getFieldSelectOptions(this.schema.fields.category)),
                statuses: createCaseField(record.getFieldSelectOptions(this.schema.fields.status)),
                priorities: createCaseField(record.getFieldSelectOptions(this.schema.fields.priority))
            };
        };
        CaseHandler.prototype.create = function (data) {
            var record = this.caseDao.createRecord();
            record.setValue(this.schema.fields.title, this.format.sanitizeHTML(data.title));
            record.setValue(this.schema.fields.incomingmessage, this.format.sanitizeHTML(data.message));
            record.setValue(this.schema.fields.category, data.category);
            record.setValue(this.schema.fields.company, this.user.getId());
            record.setValue(this.schema.fields.email, data.email || this.user.getEmail());
            record.setValue(this.schema.fields.origin, this.configuration.getDefault('cases.defaultValues.origin.id'));
            record.setValue(this.schema.fields.status, this.configuration.getDefault('cases.defaultValues.statusStart.id'));
            return record.save();
        };
        CaseHandler.prototype.update = function (data) {
            var fields = {
                status: data.statusid
            };
            if (data.reply && data.reply.length) {
                fields.incomingmessage = this.format.sanitizeHTML(data.reply);
                fields.messagenew = 'T';
            }
            this.caseDao.submitFields(fields, data.id);
        };
        return CaseHandler;
    }());
    exports.CaseHandler = CaseHandler;
});
