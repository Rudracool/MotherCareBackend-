/*
    © 2020 NetSuite Inc.
    User may not copy, modify, distribute, or re-bundle or otherwise make available this code;
    provided, however, if you are an authorized user with a NetSuite account or log-in, you
    may use this code subject to the terms that govern your access and use.
*/
define("BackboneValidationExtras", ["require", "exports", "underscore", "Backbone", "Backbone.Validation"], function (require, exports, _, Backbone) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var newPatterns = {
        // Same as email but is more restrictive and matches the same emails as the Netsuite backend UI
        // Source: https://system.netsuite.com/javascript/NLUtil.jsp__NS_VER=2014.1.0&minver=154&locale=en_US.nlqs
        //        (Search for NLValidationUtil_SIMPLE_EMAIL_PATTERN)
        email: /^[-a-z0-9!#$%&'*+/=?^_`{|}~]+(?:\.[-a-z0-9!#$%&'*+/=?^_`{|}~]+)*@(?:[a-z0-9]+(?:-+[a-z0-9]+)*\.)+(?:xn--[a-z0-9]+|[a-z]{2,16})$/i,
        netsuiteEmail: /^[-a-z0-9!#$%&'*+/=?^_`{|}~]+(?:\.[-a-z0-9!#$%&'*+/=?^_`{|}~]+)*@(?:[a-z0-9]+(?:-+[a-z0-9]+)*\.)+(?:xn--[a-z0-9]+|[a-z]{2,16})$/i,
        // This validation is less restrictive than standard
        // and matches with the used in Netsuite backend
        netsuiteUrl: /^(https|http|ftp|file):\/\//,
        netsuiteFloat: /^-{0,1}([0-9])+(\.{1}[0-9]+)?$/,
        netsuiteInteger: /^-{0,1}([0-9])+$/,
        // Allow numbers bettwen 000.00 and 000100.00 ending with optional %
        netsuitePercent: /^0*((([0-9]{1,2})(\.[0-9]{1,2})?%?$)|(100(\.0{1,2})?%?$))/,
        // Allow any character 7 or more times
        // (this is the validation that the netsuite backend form does on phone type fields)
        netsuitePhone: /^.{7,}$/
    };
    var selectors = {
        controlGroup: { attr: 'data-validation', value: 'control-group' },
        control: { attr: 'data-validation', value: 'control' },
        error: { attr: 'data-validation-error', value: '' },
        errorInline: { attr: 'data-validation-error', value: 'inline' },
        errorBlock: { attr: 'data-validation-error', value: 'block' },
        build: function (selectorName) {
            var selector = selectors[selectorName];
            return "[" + selector.attr + "=\"" + selector.value + "\"]";
        }
    };
    var newCallbacks = {
        valid: function (view, attr, selector) {
            var $control = view.$el.find("[" + selector + "=\"" + attr + "\"]");
            // if its valid we remove the error classnames
            var $group = $control
                .closest(selectors.build('controlGroup'))
                .removeAttr(selectors.error.attr);
            var $target = $control.data('error-style') === 'inline'
                ? $group.find(selectors.build('errorInline'))
                : $group.find(selectors.build('errorBlock'));
            view.helpMessages = view.helpMessages || {};
            if (view.helpMessages[attr]) {
                $target.text(view.helpMessages[attr]);
            }
            // we also need to remove all of the error messages
            return $target.remove().end();
        },
        invalid: function (view, attr, error, selector) {
            // removes back-end errors
            view.hideError();
            var $target;
            var $control = view.$el.find("[" + selector + "=\"" + attr + "\"]");
            var $group = $control
                .closest(selectors.build('controlGroup'))
                .attr(selectors.error.attr, selectors.error.value);
            // This case happens when calling validation on attribute setting with { validate: true; }
            if (!view.$savingForm) {
                view.$savingForm = $control.closest('form');
            }
            if ($control.data('error-style') === 'inline') {
                // if we don't have a place holder for the error
                // we need to add it. $target will be the placeholder
                if (!$group.find(selectors.build('errorInline')).length) {
                    $group
                        .find(selectors.build('control'))
                        .append("<span " + selectors.errorInline.attr + "=\"" + selectors.errorInline.value + "\"></span>");
                }
                $target = $group.find(selectors.build('errorInline'));
            }
            else {
                // if we don't have a place holder for the error
                // we need to add it. $target will be the placeholder
                if (!$group.find(selectors.build('errorBlock')).length) {
                    $group
                        .find(selectors.build('control'))
                        .append("<p " + selectors.errorBlock.attr + "=\"" + selectors.errorBlock.value + "\"></p>");
                }
                $target = $group.find(selectors.build('errorBlock'));
            }
            view.helpMessages = view.helpMessages || {};
            view.helpMessages[attr] = $target.text();
            return $target.text(error);
        }
    };
    _.extend(Backbone.Validation.patterns, newPatterns);
    _.extend(Backbone.Validation.callbacks, newCallbacks);
});

//# sourceMappingURL=BackboneValidationExtras.js.map
