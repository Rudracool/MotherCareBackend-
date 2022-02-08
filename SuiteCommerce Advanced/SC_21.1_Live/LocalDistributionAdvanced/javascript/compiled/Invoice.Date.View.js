/*
    © 2020 NetSuite Inc.
    User may not copy, modify, distribute, or re-bundle or otherwise make available this code;
    provided, however, if you are an authorized user with a NetSuite account or log-in, you
    may use this code subject to the terms that govern your access and use.
*/
define("Invoice.Date.View", ["require", "exports", "invoice_date.tpl", "Backbone.View"], function (require, exports, invoice_date_tpl, BackboneView) {
    "use strict";
    // @class Invoice.Date.View @extends Backbone.View
    var InvoiceDateView = BackboneView.extend({
        // @property {Function} template
        template: invoice_date_tpl,
        // @method getContext @returns {Invoice.Date.View.Context}
        getContext: function () {
            var payment = this.model.get('payment');
            // @class Invoice.Date.View.Context
            return {
                // @property {String} dueDate
                dueDate: this.model.get('dueDate') || '',
                // @property {Boolean} showOverdueFlag
                showOverdueFlag: !!this.model.get('isOverdue'),
                // @property {Boolean} showPartiallyPaid
                showPartiallyPaid: !!this.model.get('isPartiallyPaid'),
                // @property {Boolean} showUnapprovedPayment
                showUnapprovedPayment: payment && payment.status === 'unapprovedPayment'
            };
        }
    });
    return InvoiceDateView;
});

//# sourceMappingURL=Invoice.Date.View.js.map
