/*
	© 2020 NetSuite Inc.
	User may not copy, modify, distribute, or re-bundle or otherwise make available this code;
	provided, however, if you are an authorized user with a NetSuite account or log-in, you
	may use this code subject to the terms that govern your access and use.
*/

/// <amd-module name="CollectionView"/>
// @Typescript-partial
import * as _ from 'underscore';
import { View } from './View';
import { jQuery } from './jquery/JQueryExtras';

export abstract class CollectionView<
    TCollectionElement,
    TContext extends object,
    TEvent extends object = {}
> extends View<TContext, TEvent> {
    private cellViewInstances: View<object, object>[] = [];

    private readonly cellsContainerId: string = 'backbone.collection.view.cells';

    private readonly cellContainerId: string = 'backbone.collection.view.cell';

    private readonly rowsContainerId: string = 'backbone.collection.view.rows';

    private collection: TCollectionElement[];

    protected template = null;

    /**
     * @deprecated
     */
    protected cellTemplate: unknown | null = null;

    private readonly rowsCount = 12;

    private calculateSpanSize(): number {
        return this.rowsCount / this.getEffectiveCellViewsPerRow();
    }

    protected constructor(collection: TCollectionElement[]) {
        super();
        this.collection = collection;
    }
    protected abstract getCellViewInstance(
        element: TCollectionElement,
        index: number
    ): View<object, object>;

    protected getRowViewInstance(index: number): View<object, object> | null {
        return null;
    }

    private createCellElement(): JQuery<HTMLElement> {
        const data = this.placeholderData || {};
        const tag_name = data.childTagName || 'div';
        const element = jQuery(`<${tag_name}></${tag_name}>`);

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
    }

    private createCell(
        element: TCollectionElement,
        index: number,
        row: View<object, object> | null
    ): JQuery<HTMLElement> {
        const cellViewInstance = this.getCellViewInstance(element, index);
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
        const cellViewInstanceElements = (<any>cellViewInstance).$el.children();
        /*
		The cell will only be wraped by the element returned in 'this.createCellElement()'
		if the template have more than 1 root html tags
		ie: <div>...</div><div class="other-div">...</div>
		*/
        if (cellViewInstanceElements.length === 1) {
            cellViewInstance.setElement(cellViewInstanceElements[0]);
        }
        const cellViewInstance$el = (<any>cellViewInstance).$el;

        if (typeof this.cellTemplate === 'function') {
            let $cell = jQuery(
                this.cellTemplate({
                    ...cellViewInstance.getTemplateContext(),
                    spanSize: this.calculateSpanSize()
                })
            );
            const $placeholder = $cell.find(`[data-type="${this.cellContainerId}"]`);

            if ($placeholder.length) {
                $placeholder.replaceWith(cellViewInstance$el);
            } else {
                $cell = jQuery('<div></div>');
                $cell.append(cellViewInstance$el);
            }

            return $cell;
        }
        return cellViewInstance$el;
    }

    /**
     * Override to change the number of cells to render per row
     * Must be > 1 or 1 will be used instead.
     * (Deprecated) -> The returned value will be overwritten by the value
     * on 'data-viewsPerRow' html attribute on the placeholder the current
     * view will be rendered
     */
    protected getCellViewsPerRow(): number {
        return 3;
    }

    private getEffectiveCellViewsPerRow(): number {
        let viewsPerRow;
        /*
         * This block is only to be backward compatible, there is not current usage
         * in the app
         */
        if (this.placeholderData && this.placeholderData.viewsPerRow) {
            viewsPerRow = parseInt(this.placeholderData.viewsPerRow, 10);
        } else if (!viewsPerRow) {
            viewsPerRow = this.getCellViewsPerRow();
        }
        if (viewsPerRow < 1) {
            viewsPerRow = 1;
        }
        return viewsPerRow;
    }

    private appendCellsToRow(
        cells: JQuery<HTMLElement>[],
        $row: JQuery<HTMLElement>
    ): JQuery<HTMLElement> {
        const $cells = jQuery(
            _.map(
                cells,
                (element: JQuery<HTMLElement>): HTMLElement => {
                    return element.get(0);
                }
            )
        );

        const $placeholder = $row.find(`[data-type="${this.cellsContainerId}"]`);
        if ($placeholder.length) {
            $placeholder.replaceWith($cells);
        } else {
            $row = jQuery('<div></div>');
            $row.append($cells);
        }

        return $row;
    }

    public render(): this {
        if (this.template) {
            super.render();
        }
        const rows: JQuery<HTMLElement>[] = [];
        let cellsInRow: JQuery<HTMLElement>[] = [];
        this.destroyCellViewInstances();
        let row = this.getRowViewInstance(0);
        this.collection.forEach(
            (element: TCollectionElement, index: number): void => {
                const cell = this.createCell(element, index, row);

                if (row) {
                    cellsInRow.push(cell);

                    if (
                        this.getEffectiveCellViewsPerRow() === 1 ||
                        (index + 1) % this.getEffectiveCellViewsPerRow() === 0 ||
                        index + 1 === this.collection.length
                    ) {
                        row.render();

                        const $row: JQuery = (<any>row).$el;
                        const rowElements = $row.children();
                        if (rowElements.length === 1) {
                            row.setElement(rowElements[0]);
                        }

                        rows.push(this.appendCellsToRow(cellsInRow, (<any>row).$el));
                        row.parentView = this;
                        row.hasParent = true;
                        row = this.getRowViewInstance(
                            Math.floor(index / this.getEffectiveCellViewsPerRow()) + 1
                        );
                        cellsInRow = [];
                    }
                } else {
                    rows.push(cell);
                }
            }
        );

        const $content = jQuery(
            _.map(rows, function(element: JQuery<HTMLElement>): HTMLElement {
                return element.get(0);
            })
        );

        if (this.template) {
            this.$(`[data-type="${this.rowsContainerId}"]`).replaceWith($content);
        } else {
            this.$el.append($content);
        }
        return this;
    }
    private destroyCellViewInstances(): void {
        this.cellViewInstances.forEach(child => child.destroy());
        this.cellViewInstances = [];
    }
    public destroy(): void {
        this.destroyCellViewInstances();
        super.destroy();
    }
}
