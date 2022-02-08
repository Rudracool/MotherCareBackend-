/*
    © 2020 NetSuite Inc.
    User may not copy, modify, distribute, or re-bundle or otherwise make available this code;
    provided, however, if you are an authorized user with a NetSuite account or log-in, you
    may use this code subject to the terms that govern your access and use.
*/
define("Backbone.View.toggleReset", ["require", "exports", "underscore", "jQuery", "Backbone.View"], function (require, exports, _, jQuery, BackboneView) {
    "use strict";
    // Backbone.View.toggleReset.js
    // -----------------------
    // @module Backbone @class Backbone.View @method toggleReset
    // Backbones' view extension for showing/hiding a "reset" button that restore all form's fields that have changed
    // You have to assign the change event of the inputs of a form to call this function
    // For example in the "events" array of a view:
    //
    //		'change form' : 'toggleReset'
    //
    _.extend(BackboneView.prototype, {
        // the "debounce" add a small delay between the eventr and the function triggering
        // it's useful when the user is writting so we don't trigger the event after every keypress
        toggleReset: _.debounce(function (e) {
            var $form = jQuery(e.target).closest('form');
            var model = this.model;
            var attribute;
            var value;
            // look for the changed fields
            var fields_changed = _.filter($form.serializeObject(), function (item, key) {
                attribute = model.get(key);
                value = String(item).trim();
                return attribute ? attribute !== value : !!value;
            });
            // if some field changed, the reset button is shown
            $form
                .find('[data-action="reset"]')[fields_changed.length ? 'removeClass' : 'addClass']('hide');
            return this;
        }, 300)
    });
    return BackboneView.prototype.toggleReset;
});

//# sourceMappingURL=Backbone.View.toggleReset.js.map
