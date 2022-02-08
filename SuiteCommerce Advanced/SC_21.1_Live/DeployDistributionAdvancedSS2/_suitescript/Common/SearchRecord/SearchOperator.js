/**

    © 2020 NetSuite Inc.
    User may not copy, modify, distribute, or re-bundle or otherwise make available this code;
    provided, however, if you are an authorized user with a NetSuite account or log-in, you
    may use this code subject to the terms that govern your access and use.


 * @NApiVersion 2.x
 * @NModuleScope TargetAccount
 */
define(["require", "exports"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var LogicalSearchOperator;
    (function (LogicalSearchOperator) {
        LogicalSearchOperator["AND"] = "and";
        LogicalSearchOperator["OR"] = "or";
        LogicalSearchOperator["NOT"] = "not";
    })(LogicalSearchOperator || (LogicalSearchOperator = {}));
    var StringSearchOperator;
    (function (StringSearchOperator) {
        StringSearchOperator["ANY"] = "any";
        StringSearchOperator["CONTAINS"] = "contains";
        StringSearchOperator["DOESNOTCONTAIN"] = "doesnotcontain";
        StringSearchOperator["DOESNOTSTARTWITH"] = "doesnotstartwith";
        StringSearchOperator["EQUALTO"] = "equalto";
        StringSearchOperator["HASKEYWORDS"] = "haskeywords";
        StringSearchOperator["IS"] = "is";
        StringSearchOperator["ISEMPTY"] = "isempty";
        StringSearchOperator["ISNOT"] = "isnot";
        StringSearchOperator["STARTSWITH"] = "startwith";
    })(StringSearchOperator || (StringSearchOperator = {}));
    var NumberSearchOperator;
    (function (NumberSearchOperator) {
        NumberSearchOperator["ANY"] = "any";
        NumberSearchOperator["BETWEEN"] = "between";
        NumberSearchOperator["EQUALTO"] = "equalto";
        NumberSearchOperator["GREATERTHAN"] = "greaterthan";
        NumberSearchOperator["GREATERTHANOREQUALTO"] = "greaterthanorequalto";
        NumberSearchOperator["ISEMPTY"] = "isempty";
        NumberSearchOperator["ISNOTEMPTY"] = "isnotempty";
        NumberSearchOperator["LESSTHAN"] = "lessthan";
        NumberSearchOperator["LESSTHANOREQUALTO"] = "lessthanorequalto";
        NumberSearchOperator["NOTBETWEEN"] = "notbetween";
        NumberSearchOperator["NOTEQUALTO"] = "notequalto";
        NumberSearchOperator["NOTGREATERTHAN"] = "notgreaterthan";
        NumberSearchOperator["NOTGREATERTHANOREQUALTO"] = "notgreaterthanorequalto";
        NumberSearchOperator["NOTLESSTHAN"] = "notlessthan";
        NumberSearchOperator["NOTLESSTHANOREQUALTO"] = "notlessthanorequalto";
    })(NumberSearchOperator || (NumberSearchOperator = {}));
    var SelectSearchOperator;
    (function (SelectSearchOperator) {
        SelectSearchOperator["ANYOF"] = "anyof";
        SelectSearchOperator["NONEOF"] = "noneof";
    })(SelectSearchOperator || (SelectSearchOperator = {}));
    var DateSearchOperator;
    (function (DateSearchOperator) {
        DateSearchOperator["AFTER"] = "after";
        DateSearchOperator["BEFORE"] = "before";
        DateSearchOperator["ISEMPTY"] = "isempty";
        DateSearchOperator["ISNOTEMPTY"] = "isnotempty";
        DateSearchOperator["NOTAFTER"] = "notafter";
        DateSearchOperator["NOTBEFORE"] = "notbefore";
        DateSearchOperator["NOTON"] = "noton";
        DateSearchOperator["NOTONORAFTER"] = "notonorafter";
        DateSearchOperator["NOTONORBEFORE"] = "notonorbefore";
        DateSearchOperator["NOTWITHIN"] = "notwithin";
        DateSearchOperator["ON"] = "on";
        DateSearchOperator["ONORAFTER"] = "onorafter";
        DateSearchOperator["ONORBEFORE"] = "onorbefore";
        DateSearchOperator["STARTSWITH"] = "startwith";
        DateSearchOperator["WITHIN"] = "within";
    })(DateSearchOperator || (DateSearchOperator = {}));
    var ArraySearchOperator;
    (function (ArraySearchOperator) {
        ArraySearchOperator["ALLOF"] = "allof";
        ArraySearchOperator["ANYOF"] = "anyof";
        ArraySearchOperator["NONEOF"] = "noneof";
        ArraySearchOperator["NOTALLOF"] = "notallof";
    })(ArraySearchOperator || (ArraySearchOperator = {}));
    var BooleanSearchOperator;
    (function (BooleanSearchOperator) {
        BooleanSearchOperator["EQUALTO"] = "equalto";
        BooleanSearchOperator["IS"] = "is";
    })(BooleanSearchOperator || (BooleanSearchOperator = {}));
    exports.SearchOperator = {
        Logical: LogicalSearchOperator,
        String: StringSearchOperator,
        Number: NumberSearchOperator,
        Select: SelectSearchOperator,
        Date: DateSearchOperator,
        Array: ArraySearchOperator,
        Boolean: BooleanSearchOperator
    };
});
