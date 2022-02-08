/// <amd-module name="ReorderItemCustom.Model"/>
/// <reference path="../../../Commons/Utilities/JavaScript/GlobalDeclarations.d.ts"/>
define("ReorderItemCustom.Model", ["require", "exports", "Utils", "Backbone"], function (require, exports, Utils, Backbone) {
    "use strict";
    var ReorderItemCustomModel = Backbone.Model.extend({
        urlRoot: Utils.getAbsoluteUrl('services/ReorderItems.Service.ss'),
    });
    return ReorderItemCustomModel;
});

//# sourceMappingURL=ReorderItemCustom.Model.js.map
