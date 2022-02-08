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
define("ApplicationLayout", ["require", "exports", "underscore", "Utils", "jQuery", "View", "Loggers", "CancelableEventEmitter", "GlobalViews.Message.View", "UrlHelper", "Backbone", "Notifications.View", "Tracker", "ErrorManagement.ExpiredLink.View", "ErrorManagement.InternalError.View", "ErrorManagement.PageNotFound.View", "Backbone.View"], function (require, exports, _, Utils, jQuery, View_1, Loggers_1, CancelableEventEmitter_1, GlobalViews_Message_View_1, UrlHelper_1, Backbone, NotificationsView, Tracker, ExpiredLinkView, InternalErrorView, PageNotFoundView, BackboneView) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var $current_modal_el;
    var current_modal_view;
    // @class ApplicationSkeleton.Layout The root view of the application.
    // It is installed in a container_element HTML element that must exists in the HTML DOM (div #main)
    // Implement the concept of a currentView, this is at any time there is a MAIN view in which the use
    // case implementation is shown. When the user navigates to different application use cases the
    // currentView will change and the afterAppendView event is triggered, offering an API to Modules to
    // react when a certain use case view is shown
    // @extends Backbone.View
    var ApplicationLayout = /** @class */ (function (_super) {
        __extends(ApplicationLayout, _super);
        function ApplicationLayout(application) {
            var _this = _super.call(this) || this;
            _this.container_element = '#main';
            _this.content_element = '#content';
            _this.events = {
                'click [data-type="post-to-touchpoint"]': 'touchpointPost',
                'click [data-action="items-expander"]': 'itemsExpander',
                'click [data-action="dropdown-expander"]': 'dropdownExpander'
            };
            _this.modalCurrentView = null;
            _this.errorMessageKeys = ['errorMessage', 'errors', 'error', 'message'];
            _this.emitter = new CancelableEventEmitter_1.DefaultCancelableEventEmitter();
            _this.application = application;
            _this.windowWidth = jQuery(window).width();
            _this.afterAppendViewPromise = jQuery.Deferred();
            _this.once('afterAppendView', function () {
                _this.afterAppendViewPromise.resolve();
            });
            jQuery(window).on('resize', _.throttle(function () { return _this.resize(); }, 1000));
            jQuery(document).ajaxError(function (error, jqXhr, options, errorText) {
                return _this.ajaxError(jqXhr, options, errorText);
            });
            return _this;
        }
        ApplicationLayout.prototype.getCancelableEmitter = function () {
            return this.emitter;
        };
        ApplicationLayout.prototype.resize = function () {
            if (Utils.getDeviceType(this.windowWidth) === Utils.getDeviceType(jQuery(window).width())) {
                return;
            }
            Utils.resetViewportWidth();
            this.updateOnReSize();
            this.windowWidth = jQuery(window).width();
            Backbone.trigger('resizeView');
        };
        ApplicationLayout.prototype.updateOnReSize = function () { };
        ApplicationLayout.prototype.getColorPalette = function (paletteName) {
            // @class Layout.ColorPalette This class works as a dictionary,
            // where each key is the color name (e.g. black) and each value
            // is the color value (hexa value expressed in the configuration)
            var color_palette = {};
            // empty palette_name is not allowed
            if (!paletteName) {
                return color_palette;
            }
            var configuration = this.application.getConfig();
            var layout = configuration.layout || {};
            _.each(layout.colorPalette || [], function (color_item) {
                if (color_item.paletteId === paletteName) {
                    if (color_item.colorValue) {
                        // if it is a color
                        color_palette[color_item.colorName] = color_item.colorValue;
                    }
                    else if (color_item.imgsrc) {
                        color_palette[color_item.colorName] = {
                            src: color_item.imgsrc,
                            height: color_item.imgheight,
                            width: color_item.imgwidth
                        };
                    }
                }
            });
            return color_palette;
            // @class ApplicationSkeleton.Layout
        };
        ApplicationLayout.prototype.render = function () {
            // @event beforeRender triggered before rendering this layout view
            this.trigger('beforeRender', this);
            _super.prototype.render.call(this);
            // @event afterRender triggered after rendering this layout view
            this.trigger('afterRender', this);
            return this;
        };
        // @method appendToDom append this layout view to the DOM in the element
        // pointed by property container_element
        ApplicationLayout.prototype.appendToDom = function () {
            var _this = this;
            this.afterAppendViewPromise.done(function () {
                // @event beforeAppendToDom triggered before this layout
                // view is appended to the DOM
                _this.trigger('beforeAppendToDom', _this);
                jQuery(_this.container_element).html(_this.el);
                // show main div
                jQuery(_this.container_element).css('display', 'block');
                // @event afterAppendToDom triggered after this layout view is appended to the DOM
                _this.trigger('afterAppendToDom', _this);
            });
        };
        // @method getApplication
        // @return {ApplicationSkeleton} this layout's application
        ApplicationLayout.prototype.getApplication = function () {
            return this.application;
        };
        // @method touchpointPost perform a POST operation to the specified
        // touchpoint ('post-touchpoint')
        ApplicationLayout.prototype.touchpointPost = function (e) {
            var touchpoint = this.$(e.target).data('post-touchpoint');
            var touchpoints = SC.getSessionInfo('touchpoints');
            var target_touchpoint = (touchpoints ? touchpoints[touchpoint] : '') || '';
            var new_url = UrlHelper_1.UrlHelper.fixUrl(target_touchpoint);
            Utils.doPost(new_url);
        };
        // @method itemsExpander
        ApplicationLayout.prototype.itemsExpander = function (e) {
            e.preventDefault();
            e.stopPropagation();
            jQuery(e.currentTarget)
                .parent()
                .find('[data-action="items-expander"] a i')
                .toggleClass('icon-minus')
                .end()
                .find('[data-content="items-body"]')
                .stop()
                .slideToggle();
        };
        // @method dropdownExpander
        ApplicationLayout.prototype.dropdownExpander = function (e) {
            e.preventDefault();
            e.stopPropagation();
            jQuery(e.currentTarget)
                .parent()
                .find('[data-action="dropdown-expander"] a i')
                .toggleClass('icon-chevron-up')
                .end()
                .find('[data-content="items-body"]')
                .stop()
                .slideToggle();
        };
        // @method showContent use view.shoContent or layout.showContent(aView) to set the currentView
        // @param {Backbone.View} view
        // @param {Boolean} dont_scroll
        ApplicationLayout.prototype.showContent = function (view, dontScroll) {
            var _this = this;
            return this.emitter.emitUnsafe('beforeAppendView', view).then(function () {
                if (!view._pagetype) {
                    var pageType = _this.application.getComponent('PageType');
                    var data = {
                        view: view,
                        page_type: (view.attributes && view.attributes.id) || ''
                    };
                    var promise_1 = jQuery.Deferred();
                    pageType._CmsViewPromises(data).done(function () {
                        _this._showContent(view, dontScroll);
                        promise_1.resolveWith(_this, [view]);
                    });
                    return promise_1;
                }
                return _this._showContent(view, dontScroll);
            });
        };
        ApplicationLayout.prototype._showContent = function (view, dont_scroll) {
            var first_show_content = !this.currentView;
            var current_view = this.currentView;
            // document's title
            document.title = view.getTitle() || '';
            if (!view.enhancedEcommercePage) {
                Tracker.getInstance().trackNonEcomemercePageView("/" + Backbone.history.fragment);
            }
            Tracker.getInstance().trackPageview("/" + Backbone.history.fragment);
            // if the current view displays a bootstrap modal manually
            // (without calling view.showInModal)
            // then it is necessary to clean up the modal backdrop manually here
            this.closeModal();
            if (view.inModal) {
                return view.showInModal();
            }
            // We render the layout only once, the first time showContent is called
            if (!this.rendered) {
                this.render();
                this.rendered = true;
            }
            // This line will destroy the view only if you are adding a different instance of a view
            if (current_view && current_view !== view) {
                current_view.destroy();
                if (current_view.bodyClass) {
                    this.$el.removeClass(current_view.bodyClass);
                }
            }
            // @property {Backbone.View} currentView The layout as a view
            // can contain many child views, but there is one that is mandatory
            // and important and is referenced by this property
            // The currentView is the one that is showing the use case  page that
            // the user is currently being working on. While the user navigates through our
            // application the currentView will be changing.
            // {Backbone.View} the single children of the layout should have only
            // one view, the currentView
            this.currentView = view;
            this._currentView = view;
            this.updateLayout();
            if (this.notifications) {
                this.notifications.render();
            }
            // keep the min height value to restore it later because the
            // .empty() will mess the current scrolling.
            var minHeight;
            if (!first_show_content) {
                minHeight = this.$(this.content_element).css('min-height');
                // set the height of 'content_element' to his current height
                // because after empty() there will be no scroll bar and the dont_scroll will not work
                this.$(this.content_element).css('min-height', this.$(this.content_element).height() + "px");
            }
            // Empties the content first, so events don't get unbind
            this.$(this.content_element).empty();
            view.render();
            this.processJsonLd();
            if (view.bodyClass) {
                this.$el.addClass(view.bodyClass);
            }
            // @event beforeAppendView
            this.trigger('beforeAppendView', view);
            this.$(this.content_element).append(view.$el);
            if (!first_show_content && minHeight) {
                this.$(this.content_element).css('min-height', minHeight);
            }
            // @event afterAppendView
            this.trigger('afterAppendView', view);
            view.isRenderedInLayout = true;
            // Sometimes we do not want to scroll top when the view is rendered
            // Eventually we might change view and dont_scroll to an option obj
            if (!dont_scroll && !first_show_content) {
                jQuery(document).scrollTop(0);
            }
            // we need to return a promise always, as show content might be async
            return jQuery.Deferred().resolveWith(this, [view]);
        };
        ApplicationLayout.prototype.processJsonLd = function () { };
        ApplicationLayout.prototype.updateLayout = function () { };
        // @method wrapModalView
        // @param {Backbone.View} view
        ApplicationLayout.prototype.wrapModalView = function (view) {
            var $modal_body = view.$containerModal.find(['data-type="modal-body"']);
            if (view.$('.modal-body').length && $modal_body.length) {
                $modal_body.removeClass('modal-body');
            }
            return this;
        };
        // @method prefixViewIds
        // @param {Backbone.View} view
        // @param {String} prefix
        ApplicationLayout.prototype.prefixViewIds = function (view, prefix) {
            if (typeof view === 'string') {
                prefix = view;
                view = this.currentView;
            }
            if (view instanceof Backbone.View) {
                prefix = prefix || '';
                // Adding the prefix to all ids
                view.$('[id]').each(function () {
                    var el = jQuery(this);
                    if (el.parents('svg').length > 0 || !!el.data('nonprefix')) {
                        return; // don't overwrite svg child ids & data-nonprefix="true"
                    }
                    el.attr('id', function (i, old_id) {
                        return prefix + old_id;
                    });
                });
                // Adding the prefix to all fors, so labels still work
                view.$('[for]').each(function () {
                    jQuery(this).attr('for', function (i, old_id) {
                        return prefix + old_id;
                    });
                });
            }
        };
        // @method addModalListeners
        // @param {Backbone.View} view
        ApplicationLayout.prototype.addModalListeners = function (view, current_view) {
            var _this = this;
            // hidden is an even triggered by the bootstrap modal plugin
            // we obliterate anything related to the view once the modal is closed
            view.$containerModal.on('hidden.bs.modal', function () {
                _this.$el.removeClass('modal-open');
                view.trigger('modal-close', view);
                current_view.destroy();
                view.$containerModal.remove();
                view.$containerModal = null;
                _this.$containerModal = null;
                _this.modalCurrentView = null;
                $current_modal_el = false;
                _this._currentView = _this.currentView;
                // After closing te modal, impose the underlying view's title
                document.title = (_this.currentView && _this.currentView.getTitle()) || '';
            });
            // Only trigger afterAppendView when finished showing the modal
            // (has animation which causes a delay)
            view.$containerModal.on('shown.bs.modal', function () {
                if (view.focusFirstInput ? view.focusFirstInput() : true) {
                    view.$('form:first *:input[type!=hidden]:first').focus();
                }
                _this.trigger('afterAppendView', view);
                view.$containerModal.modal('handleUpdate');
            });
        };
        // @method getCurrentView
        // @return {Backbone.View} the current view no matter if rendered normally or in a modal.
        ApplicationLayout.prototype.getCurrentView = function () {
            return this._currentView;
        };
        // @method showInPush
        // @param {Backbone.View} view
        // @param {Object} options
        ApplicationLayout.prototype.showInPush = function (view, options) {
            var _this = this;
            options = options || {};
            if (!this.$pusher_container) {
                this.$pusher_container = jQuery('<div data-action="pushable"></div>');
                this.$el.append(this.$pusher_container);
            }
            view.$pusher_container = this.$pusher_container;
            view.render();
            this.pushCurrentView = view;
            this.$pusher_container.append(view.$el);
            this.$pusher_container.scPush();
            this.$pusher_container.trigger('open');
            this.$pusher_container.on('afterClose', function () {
                if (!options.no_destroy) {
                    if (view) {
                        view.$el.empty();
                        view.destroy();
                        _this.$pusher_container.find('div:empty').remove();
                        _this.pushCurrentView = null;
                    }
                }
            });
            return jQuery.Deferred().resolveWith(this, [view]);
        };
        // @method closePush
        ApplicationLayout.prototype.closePush = function () {
            if (this.$pusher_container) {
                this.$pusher_container.trigger('close');
                this.$pusher_container.find('div:empty').remove();
            }
        };
        ApplicationLayout.prototype.showInModal = function (view, options) {
            var _this = this;
            return this.emitter
                .emitUnsafe('beforeAppendView', view)
                .then(function () { return _this._showInModal(view, options); });
        };
        // @method showInModal
        // @param {Backbone.View} view
        // @param {className:String,modalOptions:Object} options Optional object
        // @param {jQuery.Deferred}
        ApplicationLayout.prototype._showInModal = function (view, options) {
            var _this = this;
            var promise_result = jQuery.Deferred();
            options = jQuery.extend({ modalOptions: {} }, options);
            view.events = view.events || {};
            // We add the mousedown event on the 'Cancel' button to hide the modal, otherwise,
            // the validation could add a validation error and move the position of the 'Cancel' button
            // and fail to close the modal on the click event
            // Order of the events: mousedown, blur, click
            view.events['mousedown [data-dismiss="modal"]'] = function (e) {
                e.preventDefault();
            };
            view.on('destroy', function () {
                view.events['mousedown [data-dismiss="modal"]'] = null;
            });
            // we tell the view its being shown in a Modal
            view.inModal = true;
            // we need a different variable to know if the view has already been rendered in a modal
            // this is to add the Modal container only once to the DOM
            if (!view.hasRenderedInModal) {
                var element_id = view.$el.attr('id');
                var GlobalViewsModalView = this.getGlobalModalViewClass();
                GlobalViewsModalView.prototype.attributes = {};
                GlobalViewsModalView.prototype.className = "modal fade " + (view.modalClass || element_id ? "modal-" + element_id : '');
                GlobalViewsModalView.prototype.attributes.id =
                    view.modalId || element_id ? "modal-" + element_id : 'modal';
                current_modal_view = new GlobalViewsModalView({
                    childViewIstance: view,
                    pageHeader: view.page_header || view.getTitle() || ''
                });
                this.$containerModal = current_modal_view.$el;
                view.$containerModal = this.$containerModal;
                this.modalCurrentView = view;
                this._currentView = view;
                view.options.layout = this;
            }
            this.trigger('beforeAppendView', view);
            if (!view.hasRenderedInModal) {
                // if there was a modal opened we wait for close it
                this.closeModal().done(function () {
                    _this._showModalInDOM(view, options, current_modal_view, promise_result);
                });
            }
            else {
                this._renderModalView(view, current_modal_view);
                promise_result.resolveWith(this, [view]);
            }
            return promise_result;
        };
        ApplicationLayout.prototype.closeModal = function () {
            var promise = jQuery.Deferred();
            if ($current_modal_el) {
                $current_modal_el.on('hidden.bs.modal', promise.resolve);
                $current_modal_el
                    .removeClass('fade')
                    .modal('hide')
                    .data('bs.modal', null);
            }
            else {
                promise.resolve();
            }
            return promise;
        };
        // @method _renderModalView Internal method to render a view in a modal context
        // @param {Backbone.View} view
        // @param {jQuery} current_modal_view
        // @return {Void}
        ApplicationLayout.prototype._renderModalView = function (view, currentModalView) {
            // Generates the HTML for the view based on its template
            // http://backbonejs.org/#View-render
            if (!view.hasRenderedInModal) {
                currentModalView.render();
            }
            else {
                view.render();
            }
            this.wrapModalView(view).prefixViewIds(view, 'in-modal-');
        };
        // @method _showModalInDOM Internal auxiliary method responsible for render
        // the view and show it as a modal.
        // @param {Backbone.View} view
        // @param {Object} options
        // @param {jQuery} current_modal_view
        // @param {jQuery.Deferred} promise
        // @return {Void}
        ApplicationLayout.prototype._showModalInDOM = function (view, options, currentModalView, promise) {
            this._renderModalView(view, currentModalView);
            $current_modal_el = view.$containerModal;
            this.addModalListeners(view, currentModalView);
            // So, now we add the wrapper modal with the view in it to the DOM - we append
            // it to the Layout view instead of body, so modal links are managed by NavigationHelper.
            view.$containerModal.appendTo(this.el);
            // We trigger the plugin, it can be passed custom options
            // http://twitter.github.com/bootstrap/javascript.html#modals
            view.$containerModal.modal(options.modalOptions);
            // When we are in SiteBuilder all our CSS classes are wrapped up
            // with a container (#main generally)
            // and as  bootrap add the class modal-open at the body HTML element,
            // this makes unaccessible for boostrap selector due to the #main selector in the middle
            // In the and we need all boostrap events properly attached, so we fix it by adding
            // this class inside the main wrapper
            this.$el.addClass('modal-open');
            if (options.className) {
                view.$containerModal.addClass(options.className);
            }
            // the view has now been rendered in a modal
            view.hasRenderedInModal = true;
            promise.resolveWith(this, [view]);
        };
        // Defining the interface for this class. All modules will interact with the layout
        // trough this methods some others may be added as well
        // @method showError
        ApplicationLayout.prototype.showError = function (message, type, closable, disableElements) {
            this.hideError();
            // Finds or create the placeholder for the error message
            var placeholder = this.$('[data-type="alert-placeholder"]');
            if (!placeholder.length) {
                placeholder = jQuery('<div/>', { 'data-type': 'alert-placeholder' });
                this.$el.prepend(placeholder);
            }
            this.showMessage(placeholder, message, type || 'error', !_.isUndefined(closable) ? !!closable : false, true);
            // Re Enables all posible disableded buttons of the view
            if (!disableElements) {
                this.$(':disabled').attr('disabled', '');
            }
            // If the backToTop module is loaded, we scroll to the top of the view to show the error.
            if (this.application) {
                _.result(this.application.getLayout(), 'backToTop');
            }
        };
        ApplicationLayout.prototype.hideError = function () {
            this.$('[data-type="alert-placeholder"]').empty();
        };
        ApplicationLayout.prototype.showErrorInModal = function (message) {
            var view = new BackboneView({ application: this.application });
            view.setTitle(Utils.translate('Error'));
            view.render = function () {
                this.$el.append("<p class=\"error-message\">" + message + "</p>");
            };
            view.showInModal();
        };
        // @property {Object} childViews
        ApplicationLayout.prototype.getChildViews = function () {
            var _this = this;
            return {
                Notifications: function () {
                    _this.notifications = new NotificationsView();
                    return _this.notifications;
                }
            };
        };
        // @method notFound Shortcut to display the PageNotFoundView
        ApplicationLayout.prototype.notFound = function () {
            var _this = this;
            var view = new PageNotFoundView({
                application: this.application
            });
            view.showContent().done(function () {
                var cctComponent = _this.application.getComponent('CMS');
                cctComponent.addContents();
                Loggers_1.Loggers.getLogger().endLast('Navigation');
            });
        };
        // @method internalError Shortcut to display the InternalErrorView
        ApplicationLayout.prototype.internalError = function (message, pageHeader, title) {
            var _this = this;
            var view = new InternalErrorView({
                application: this.application,
                message: message,
                pageHeader: pageHeader,
                title: title
            });
            view.showContent().done(function () {
                var cctComponent = _this.application.getComponent('CMS');
                cctComponent.addContents();
                Loggers_1.Loggers.getLogger().endLast('Navigation');
            });
        };
        // @method expiredLink @param {String} message
        ApplicationLayout.prototype.expiredLink = function (message) {
            var _this = this;
            var view = new ExpiredLinkView({
                application: this.application,
                pageHeader: message,
                title: message
            });
            view.showContent().done(function () {
                var cctComponent = _this.application.getComponent('CMS');
                cctComponent.addContents();
                Loggers_1.Loggers.getLogger().endLast('Navigation');
            });
        };
        ApplicationLayout.prototype.parseErrorMessage = function (jqXhr, errorMessageKeys) {
            return this.errorMessageParser(jqXhr, errorMessageKeys || this.errorMessageKeys);
        };
        ApplicationLayout.prototype.ajaxError = function (jqXhr, options, errorText) {
            var intStatus = parseInt(jqXhr.status, 10);
            if (errorText === 'abort' || intStatus === 0) {
                return;
            }
            // Unauthorized Error, customer must be logged in -
            // we pass origin parameter with the right touchpoint for redirect the user after login
            // 206 is returned when someone else has logged in another browser
            // with the same user. In this case the first response is a 206
            // And the following are 401
            if (intStatus === 401 || intStatus === 206) {
                this.unauthorizedError(jqXhr.responseJSON && jqXhr.responseJSON.errorCode === 'ERR_USER_SESSION_TIMED_OUT');
                return;
            }
            // You can bypass all this logic by capturing the error callback
            // on the fetch using preventDefault = true on your jqXhr object
            if (!jqXhr.preventDefault) {
                // if its a write operation we will call the showError
                // of the currentView or of the modal if presetn
                var message = this.errorMessageParser(jqXhr, this.errorMessageKeys, options);
                if (!message || (_.isObject(message) && !message.errorCode)) {
                    message = Utils.translate('An internal error has occurred');
                }
                if (options.type === 'GET' && options.killerId) {
                    if (intStatus === 403) {
                        // Not Found error, we show that error
                        this.forbiddenError();
                    }
                    // Its a read operation that was ment to show a page
                    else if (intStatus === 404) {
                        // Not Found error, we show that error
                        this.notFound();
                    }
                    else {
                        // Other ways we just show an internal error page
                        this.internalError(message);
                    }
                }
                else if (this.currentView) {
                    // Do not show error message if forbidden
                    if (intStatus !== 403) {
                        // Calls the showError of the modal if present or the one of the
                        // currentView (content view)
                        if (this.modalCurrentView) {
                            this.modalCurrentView.showError(message);
                        }
                        else {
                            var childViewInstances = this.currentView.getChildViewInstances();
                            var activeView = _.find(childViewInstances, function (childView) {
                                return (childView &&
                                    (childView.$('.focused-form-view').length > 0 ||
                                        childView.$el.is('.focused-form-view')));
                            });
                            activeView = activeView || this.currentView;
                            activeView.showError(message);
                        }
                    }
                    else {
                        var view = this.modalCurrentView || this.currentView;
                        if (view && _.isFunction(view.forbiddenError)) {
                            view.forbiddenError(message);
                        }
                        else {
                            this.forbiddenError(message);
                        }
                    }
                }
                else {
                    // We allways default to showing the internalError of the layout
                    this.internalError();
                }
            }
        };
        ApplicationLayout.prototype.showMessage = function (placeholder, message, type, closable, append) {
            if (append === void 0) { append = false; }
            var MessageView = this.getGlobalMessageView();
            var globalViewMessage = new MessageView({
                message: message,
                type: type,
                closable: closable
            });
            var html = globalViewMessage.render().$el.html();
            if (append) {
                placeholder.append(html);
            }
            else {
                placeholder.html(html);
            }
        };
        ApplicationLayout.prototype.showConfirmationMessage = function (message, fixed) {
            var confirmation_message = this.$('[data-confirm-message]');
            this.showMessage(confirmation_message, message, 'success', true);
            if (!fixed) {
                setTimeout(function () {
                    confirmation_message.fadeOut(3000);
                }, 5000);
            }
        };
        ApplicationLayout.prototype.showXHRErrorMessage = function (placeholder, jqXhr, closable, append) {
            if (append === void 0) { append = false; }
            var message = this.errorMessageParser(jqXhr, this.errorMessageKeys);
            this.showMessage(placeholder, message, 'error', closable, append);
        };
        ApplicationLayout.prototype.getGlobalMessageView = function () {
            return GlobalViews_Message_View_1.GlobalViewsMessageView;
        };
        // @method getContext
        // @return {ApplicationSkeleton.Layout.Context}
        ApplicationLayout.prototype.getContext = function () {
            // @class ApplicationSkeleton.Layout.Context
            return {};
        };
        return ApplicationLayout;
    }(View_1.View));
    exports.ApplicationLayout = ApplicationLayout;
});

//# sourceMappingURL=ApplicationLayout.js.map
