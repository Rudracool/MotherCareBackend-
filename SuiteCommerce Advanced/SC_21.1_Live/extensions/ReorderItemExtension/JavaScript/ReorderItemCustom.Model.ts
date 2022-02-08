

/// <amd-module name="ReorderItemCustom.Model"/>
/// <reference path="../../../Commons/Utilities/JavaScript/GlobalDeclarations.d.ts"/>

import * as _ from 'underscore';
import * as Utils from '../../../Commons/Utilities/JavaScript/Utils';
import Backbone = require('../../../Commons/Utilities/JavaScript/backbone.custom');

const ReorderItemCustomModel: any = Backbone.Model.extend({
    urlRoot: Utils.getAbsoluteUrl('services/ReorderItems.Service.ss'),

})
export = ReorderItemCustomModel;

