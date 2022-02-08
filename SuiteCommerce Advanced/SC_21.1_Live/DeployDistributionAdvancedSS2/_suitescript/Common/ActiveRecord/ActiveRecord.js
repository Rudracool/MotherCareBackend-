/**

    © 2020 NetSuite Inc.
    User may not copy, modify, distribute, or re-bundle or otherwise make available this code;
    provided, however, if you are an authorized user with a NetSuite account or log-in, you
    may use this code subject to the terms that govern your access and use.


 * @NApiVersion 2.x
 * @NModuleScope TargetAccount
 */
define(["require", "exports", "N/record"], function (require, exports, Nrecord) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.Type = Nrecord.Type;
    var ActiveRecord = /** @class */ (function () {
        function ActiveRecord(recordOptions) {
            recordOptions.isDynamic = recordOptions.isDynamic || true;
            recordOptions.defaultValues = recordOptions.defaultValues || {};
            this.Schema = recordOptions.schema;
            if (recordOptions.record) {
                this.record = recordOptions.record;
            }
            else if (recordOptions.fromSchema) {
                this.record = Nrecord.transform({
                    fromType: recordOptions.fromSchema.type,
                    fromId: recordOptions.id,
                    toType: recordOptions.schema.type,
                    isDynamic: recordOptions.isDynamic,
                    defaultValues: recordOptions.defaultValues
                });
            }
            else if (recordOptions.id) {
                this.record = Nrecord.load({
                    id: recordOptions.id,
                    type: recordOptions.recordtype || recordOptions.schema.type,
                    isDynamic: recordOptions.isDynamic,
                    defaultValue: recordOptions.defaultValues
                });
            }
            else {
                this.record = Nrecord.create({
                    type: recordOptions.schema.type,
                    isDynamic: recordOptions.isDynamic,
                    defaultValues: recordOptions.defaultValues
                });
            }
        }
        ActiveRecord.prototype.save = function (options) {
            if (options === void 0) { options = { enablesourcing: true, ignoreMandatoryFields: false }; }
            return this.record.save({
                enableSourcing: options.enablesourcing,
                ignoreMandatoryFields: options.ignoreMandatoryFields
            });
        };
        ActiveRecord.prototype.getField = function (field) {
            return this.record.getField({ fieldId: field.fieldId });
        };
        ActiveRecord.prototype.getValue = function (field) {
            // TODO: infer return type from SchemaRecordField (T)
            return this.record.getValue({ fieldId: field.fieldId });
        };
        ActiveRecord.prototype.getText = function (field) {
            return this.record.getText({ fieldId: field.fieldId });
        };
        ActiveRecord.prototype.getFieldSelectOptions = function (field) {
            return this.getField(field).getSelectOptions();
        };
        ActiveRecord.prototype.getSublistText = function (field, line) {
            return this.record.getSublistText({
                sublistId: field.sublistId,
                fieldId: field.fieldId,
                line: line
            });
        };
        ActiveRecord.prototype.getSublistValue = function (field, line) {
            return this.record.getSublistValue({
                sublistId: field.sublistId,
                fieldId: field.fieldId,
                line: line
            });
        };
        ActiveRecord.prototype.removeLine = function (sublist, line) {
            this.record.removeLine({
                sublistId: sublist.sublistId,
                line: line
            });
        };
        ActiveRecord.prototype.getLineCount = function (sublist) {
            return this.record.getLineCount({
                sublistId: sublist.sublistId
            });
        };
        ActiveRecord.prototype.isFieldMandatory = function (field) {
            return this.getField(field).isMandatory;
        };
        ActiveRecord.prototype.setValue = function (field, value) {
            this.record.setValue({
                fieldId: field.fieldId,
                value: value
            });
        };
        ActiveRecord.prototype.setText = function (field, text) {
            this.record.setText({
                fieldId: field.fieldId,
                text: text
            });
        };
        ActiveRecord.prototype.cancelLine = function (sublist) {
            this.record.cancelLine({
                sublistId: sublist.sublistId
            });
        };
        ActiveRecord.prototype.selectLine = function (sublist, line) {
            this.record.selectLine({
                sublistId: sublist.sublistId,
                line: line
            });
        };
        ActiveRecord.prototype.insertLine = function (sublist, line, ignoreRecalc) {
            if (ignoreRecalc === void 0) { ignoreRecalc = false; }
            this.record.insertLine({
                sublistId: sublist.sublistId,
                line: line,
                ignoreRecalc: ignoreRecalc
            });
        };
        ActiveRecord.prototype.selectNewLine = function (sublist) {
            this.record.selectNewLine({
                sublistId: sublist.sublistId
            });
        };
        ActiveRecord.prototype.commitLine = function (sublist) {
            this.record.commitLine({
                sublistId: sublist.sublistId
            });
        };
        ActiveRecord.prototype.setCurrentSublistText = function (subfield, text, ignoreFieldChange) {
            if (ignoreFieldChange === void 0) { ignoreFieldChange = false; }
            this.record.setCurrentSublistText({
                sublistId: subfield.sublistId,
                fieldId: subfield.fieldId,
                text: text,
                ignoreFieldChange: ignoreFieldChange
            });
        };
        ActiveRecord.prototype.setCurrentSublistValue = function (subfield, value, ignoreFieldChange) {
            if (ignoreFieldChange === void 0) { ignoreFieldChange = false; }
            this.record.setCurrentSublistValue({
                sublistId: subfield.sublistId,
                fieldId: subfield.fieldId,
                value: value,
                ignoreFieldChange: ignoreFieldChange
            });
        };
        ActiveRecord.prototype.setSublistValue = function (subfield, line, value) {
            this.record.setSublistValue({
                sublistId: subfield.sublistId,
                fieldId: subfield.fieldId,
                line: line,
                value: value
            });
        };
        ActiveRecord.prototype.getCurrentSublistText = function (subfield) {
            return this.record.getCurrentSublistText({
                sublistId: subfield.sublistId,
                fieldId: subfield.fieldId
            });
        };
        ActiveRecord.prototype.getCurrentSublistValue = function (subfield) {
            return this.record.getCurrentSublistValue({
                sublistId: subfield.sublistId,
                fieldId: subfield.fieldId
            });
        };
        ActiveRecord.prototype.executeMacro = function (id, params) {
            return this.record.executeMacro({
                id: id,
                params: params
            });
        };
        ActiveRecord.prototype.getSubrecord = function (recordField) {
            return new ActiveRecord({
                record: this.record.getSubrecord({ fieldId: recordField.fieldId })
            });
        };
        ActiveRecord.prototype.getSublistFields = function (field) {
            return this.record.getSublistFields({
                sublistId: field.fieldId
            });
        };
        return ActiveRecord;
    }());
    exports.ActiveRecord = ActiveRecord;
});
