/*
    © 2020 NetSuite Inc.
    User may not copy, modify, distribute, or re-bundle or otherwise make available this code;
    provided, however, if you are an authorized user with a NetSuite account or log-in, you
    may use this code subject to the terms that govern your access and use.
*/
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
define("CollectionView", ["require", "exports", "underscore", "View", "JQueryExtras"], function (require, exports, _, View_1, JQueryExtras_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var CollectionView = /** @class */ (function (_super) {
        __extends(CollectionView, _super);
        function CollectionView(collection) {
            var _this = _super.call(this) || this;
            _this.cellViewInstances = [];
            _this.cellsContainerId = 'backbone.collection.view.cells';
            _this.cellContainerId = 'backbone.collection.view.cell';
            _this.rowsContainerId = 'backbone.collection.view.rows';
            _this.template = null;
            /**
             * @deprecated
             */
            _this.cellTemplate = null;
            _this.rowsCount = 12;
            _this.collection = collection;
            return _this;
        }
        CollectionView.prototype.calculateSpanSize = function () {
            return this.rowsCount / this.getEffectiveCellViewsPerRow();
        };
        CollectionView.prototype.getRowViewInstance = function (index) {
            return null;
        };
        CollectionView.prototype.createCellElement = function () {
            var data = this.placeholderData || {};
            var tag_name = data.childTagName || 'div';
            var element = JQueryExtras_1.jQuery("<" + tag_name + "></" + tag_name + ">");
            if (data.childId) {
                element.attr('id', data.childId);
            }
            if (data.childClass) {
                element.addClass(data.childClass);
            }
            if (data.childDataAction) {
                element.attr('data-action', data.childDataAction);
            }
            if (data.childDataType) {
                element.attr('data-type', data.childDataType);
            }
            return element;
        };
        CollectionView.prototype.createCell = function (element, index, row) {
            var cellViewInstance = this.getCellViewInstance(element, index);
            // const child_view_instance = new this.childView(options);
            // Required only to destroy instances properly
            this.cellViewInstances.push(cellViewInstance);
            if (!cellViewInstance.attributes['data-root-component-id']) {
                cellViewInstance.attributes['data-root-component-id'] =
                    this.attributes['data-root-component-id'] || '';
            }
            cellViewInstance.parentView = row || cellViewInstance.parentView || this;
            cellViewInstance.hasParent = true;
            cellViewInstance.setElement(this.createCellElement());
            cellViewInstance.render();
            /*
            Casting to avoid making $el a public attribute on "View", re-arrangement of DOM
            is required to be compatible with Backbone.CollectionView
             */
            var cellViewInstanceElements = cellViewInstance.$el.children();
            /*
            The cell will only be wraped by the element returned in 'this.createCellElement()'
            if the template have more than 1 root html tags
            ie: <div>...</div><div class="other-div">...</div>
            */
            if (cellViewInstanceElements.length === 1) {
                cellViewInstance.setElement(cellViewInstanceElements[0]);
            }
            var cellViewInstance$el = cellViewInstance.$el;
            if (typeof this.cellTemplate === 'function') {
                var $cell = JQueryExtras_1.jQuery(this.cellTemplate(__assign({}, cellViewInstance.getTemplateContext(), { spanSize: this.calculateSpanSize() })));
                var $placeholder = $cell.find("[data-type=\"" + this.cellContainerId + "\"]");
                if ($placeholder.length) {
                    $placeholder.replaceWith(cellViewInstance$el);
                }
                else {
                    $cell = JQueryExtras_1.jQuery('<div></div>');
                    $cell.append(cellViewInstance$el);
                }
                return $cell;
            }
            return cellViewInstance$el;
        };
        /**
         * Override to change the number of cells to render per row
         * Must be > 1 or 1 will be used instead.
         * (Deprecated) -> The returned value will be overwritten by the value
         * on 'data-viewsPerRow' html attribute on the placeholder the current
         * view will be rendered
         */
        CollectionView.prototype.getCellViewsPerRow = function () {
            return 3;
        };
        CollectionView.prototype.getEffectiveCellViewsPerRow = function () {
            var viewsPerRow;
            /*
             * This block is only to be backward compatible, there is not current usage
             * in the app
             */
            if (this.placeholderData && this.placeholderData.viewsPerRow) {
                viewsPerRow = parseInt(this.placeholderData.viewsPerRow, 10);
            }
            else if (!viewsPerRow) {
                viewsPerRow = this.getCellViewsPerRow();
            }
            if (viewsPerRow < 1) {
                viewsPerRow = 1;
            }
            return viewsPerRow;
        };
        CollectionView.prototype.appendCellsToRow = function (cells, $row) {
            var $cells = JQueryExtras_1.jQuery(_.map(cells, function (element) {
                return element.get(0);
            }));
            var $placeholder = $row.find("[data-type=\"" + this.cellsContainerId + "\"]");
            if ($placeholder.length) {
                $placeholder.replaceWith($cells);
            }
            else {
                $row = JQueryExtras_1.jQuery('<div></div>');
                $row.append($cells);
            }
            return $row;
        };
        CollectionView.prototype.render = function () {
            var _this = this;
            if (this.template) {
                _super.prototype.render.call(this);
            }
            var rows = [];
            var cellsInRow = [];
            this.destroyCellViewInstances();
            var row = this.getRowViewInstance(0);
            this.collection.forEach(function (element, index) {
                var cell = _this.createCell(element, index, row);
                if (row) {
                    cellsInRow.push(cell);
                    if (_this.getEffectiveCellViewsPerRow() === 1 ||
                        (index + 1) % _this.getEffectiveCellViewsPerRow() === 0 ||
                        index + 1 === _this.collection.length) {
                        row.render();
                        var $row = row.$el;
                        var rowElements = $row.children();
                        if (rowElements.length === 1) {
                            row.setElement(rowElements[0]);
                        }
                        rows.push(_this.appendCellsToRow(cellsInRow, row.$el));
                        row.parentView = _this;
                        row.hasParent = true;
                        row = _this.getRowViewInstance(Math.floor(index / _this.getEffectiveCellViewsPerRow()) + 1);
                        cellsInRow = [];
                    }
                }
                else {
                    rows.push(cell);
                }
            });
            var $content = JQueryExtras_1.jQuery(_.map(rows, function (element) {
                return element.get(0);
            }));
            if (this.template) {
                this.$("[data-type=\"" + this.rowsContainerId + "\"]").replaceWith($content);
            }
            else {
                this.$el.append($content);
            }
            return this;
        };
        CollectionView.prototype.destroyCellViewInstances = function () {
            this.cellViewInstances.forEach(function (child) { return child.destroy(); });
            this.cellViewInstances = [];
        };
        CollectionView.prototype.destroy = function () {
            this.destroyCellViewInstances();
            _super.prototype.destroy.call(this);
        };
        return CollectionView;
    }(View_1.View));
    exports.CollectionView = CollectionView;
});

//# sourceMappingURL=CollectionView.js.map
