/*
	© 2020 NetSuite Inc.
	User may not copy, modify, distribute, or re-bundle or otherwise make available this code;
	provided, however, if you are an authorized user with a NetSuite account or log-in, you
	may use this code subject to the terms that govern your access and use.
*/

/// <amd-module name="ApplicationLayout"/>

import * as _ from 'underscore';
import * as Utils from '../../Utilities/JavaScript/Utils';
import * as jQuery from '../../Core/JavaScript/jQuery';
import { ChildViews, View } from '../../Core/JavaScript/View';
import { Loggers } from '../../Loggers/JavaScript/Loggers';
import {
    CancelableEventEmitter,
    DefaultCancelableEventEmitter
} from '../../Core/JavaScript/CancelableEventEmitter';
import { GlobalViewsMessageView } from '../../GlobalViews/JavaScript/GlobalViews.Message.View';

import { UrlHelper } from '../../UrlHelper/JavaScript/UrlHelper';
import Backbone = require('../../Utilities/JavaScript/backbone.custom');
import NotificationsView = require('../../Notifications/JavaScript/Notifications.View');
import Tracker = require('../../Tracker/JavaScript/Tracker');
import ExpiredLinkView = require('../../ErrorManagement/JavaScript/ErrorManagement.ExpiredLink.View');
import InternalErrorView = require('../../ErrorManagement/JavaScript/ErrorManagement.InternalError.View');
import PageNotFoundView = require('../../ErrorManagement/JavaScript/ErrorManagement.PageNotFound.View');
import BackboneView = require('../../BackboneExtras/JavaScript/Backbone.View');

let $current_modal_el;
let current_modal_view: any;

interface LayoutEvents {
    beforeAppendView: (view: View<{}, {}>) => void;
    afterAppendView: (view: View<{}, {}>) => void;
    beforeRender: (view: ApplicationLayout) => void;
    afterRender: (view: ApplicationLayout) => void;
    beforeAppendToDom: (view: ApplicationLayout) => void;
    afterAppendToDom: (view: ApplicationLayout) => void;
}

interface LayoutCancelableEvents {
    beforeAppendView: (view: View<{}, {}>) => void;
}

// @class ApplicationSkeleton.Layout The root view of the application.
// It is installed in a container_element HTML element that must exists in the HTML DOM (div #main)
// Implement the concept of a currentView, this is at any time there is a MAIN view in which the use
// case implementation is shown. When the user navigates to different application use cases the
// currentView will change and the afterAppendView event is triggered, offering an API to Modules to
// react when a certain use case view is shown
// @extends Backbone.View
export abstract class ApplicationLayout extends View<{}, LayoutEvents> {
    protected application;
    protected errorMessageParser;
    protected container_element = '#main';
    protected content_element = '#content';
    public events = {
        'click [data-type="post-to-touchpoint"]': 'touchpointPost',
        'click [data-action="items-expander"]': 'itemsExpander',
        'click [data-action="dropdown-expander"]': 'dropdownExpander'
    };
    private windowWidth: number;
    private afterAppendViewPromise: JQuery.Deferred<any>;
    private _currentView: any;
    protected currentView: any;
    private pushCurrentView: any;
    private $pusher_container: any;
    private rendered: boolean;
    private notifications: any;
    protected modalCurrentView: any = null;
    public $containerModal: any;
    protected errorMessageKeys = ['errorMessage', 'errors', 'error', 'message'];
    private readonly emitter: CancelableEventEmitter<
        LayoutCancelableEvents
    > = new DefaultCancelableEventEmitter();

    public constructor(application: any) {
        super();
        this.application = application;
        this.windowWidth = jQuery(window).width();
        this.afterAppendViewPromise = jQuery.Deferred();

        this.once(
            'afterAppendView',
            (): void => {
                this.afterAppendViewPromise.resolve();
            }
        );

        jQuery(window).on('resize', _.throttle((): void => this.resize(), 1000));
        jQuery(document).ajaxError(
            (error: any, jqXhr: any, options: any, errorText: any): void =>
                this.ajaxError(jqXhr, options, errorText)
        );
    }

    public getCancelableEmitter(): CancelableEventEmitter<LayoutCancelableEvents> {
        return this.emitter;
    }

    protected resize(): void {
        if (Utils.getDeviceType(this.windowWidth) === Utils.getDeviceType(jQuery(window).width())) {
            return;
        }

        Utils.resetViewportWidth();

        this.updateOnReSize();

        this.windowWidth = jQuery(window).width();

        Backbone.trigger('resizeView');
    }

    protected updateOnReSize(): void {}

    public getColorPalette(paletteName: string): any {
        // @class Layout.ColorPalette This class works as a dictionary,
        // where each key is the color name (e.g. black) and each value
        // is the color value (hexa value expressed in the configuration)
        const color_palette = {};

        // empty palette_name is not allowed
        if (!paletteName) {
            return color_palette;
        }

        const configuration = this.application.getConfig();
        const layout = configuration.layout || {};
        _.each(layout.colorPalette || [], function(color_item: any): void {
            if (color_item.paletteId === paletteName) {
                if (color_item.colorValue) {
                    // if it is a color
                    color_palette[color_item.colorName] = color_item.colorValue;
                } else if (color_item.imgsrc) {
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
    }

    public render(): this {
        // @event beforeRender triggered before rendering this layout view
        this.trigger('beforeRender', this);
        super.render();
        // @event afterRender triggered after rendering this layout view
        this.trigger('afterRender', this);
        return this;
    }

    // @method appendToDom append this layout view to the DOM in the element
    // pointed by property container_element
    public appendToDom(): void {
        this.afterAppendViewPromise.done(
            (): void => {
                // @event beforeAppendToDom triggered before this layout
                // view is appended to the DOM
                this.trigger('beforeAppendToDom', this);

                jQuery(this.container_element).html(this.el);

                // show main div
                jQuery(this.container_element).css('display', 'block');

                // @event afterAppendToDom triggered after this layout view is appended to the DOM
                this.trigger('afterAppendToDom', this);
            }
        );
    }

    // @method getApplication
    // @return {ApplicationSkeleton} this layout's application
    public getApplication(): any {
        return this.application;
    }

    // @method touchpointPost perform a POST operation to the specified
    // touchpoint ('post-touchpoint')
    public touchpointPost(e: any): void {
        const touchpoint = this.$(e.target).data('post-touchpoint');
        const touchpoints = SC.getSessionInfo('touchpoints');
        const target_touchpoint = (touchpoints ? touchpoints[touchpoint] : '') || '';
        const new_url = UrlHelper.fixUrl(target_touchpoint);

        Utils.doPost(new_url);
    }

    // @method itemsExpander
    public itemsExpander(e: any): void {
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
    }

    // @method dropdownExpander
    public dropdownExpander(e: any): void {
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
    }

    // @method showContent use view.shoContent or layout.showContent(aView) to set the currentView
    // @param {Backbone.View} view
    // @param {Boolean} dont_scroll
    public showContent(view?: any, dontScroll?: boolean): JQuery.Promise<any> {
        return this.emitter.emitUnsafe('beforeAppendView', view).then(
            (): any => {
                if (!view._pagetype) {
                    const pageType = this.application.getComponent('PageType');

                    const data = {
                        view: view,
                        page_type: (view.attributes && view.attributes.id) || ''
                    };

                    const promise = jQuery.Deferred();

                    pageType._CmsViewPromises(data).done(
                        (): void => {
                            this._showContent(view, dontScroll);
                            promise.resolveWith(this, [view]);
                        }
                    );

                    return promise;
                }
                return this._showContent(view, dontScroll);
            }
        );
    }

    private _showContent(view: any, dont_scroll: boolean): JQuery.Deferred<any> {
        const first_show_content = !this.currentView;
        const current_view = this.currentView;

        // document's title
        document.title = view.getTitle() || '';

        if (!view.enhancedEcommercePage) {
            Tracker.getInstance().trackNonEcomemercePageView(`/${Backbone.history.fragment}`);
        }

        Tracker.getInstance().trackPageview(`/${Backbone.history.fragment}`);

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
        let minHeight: any;
        if (!first_show_content) {
            minHeight = this.$(this.content_element).css('min-height');
            // set the height of 'content_element' to his current height
            // because after empty() there will be no scroll bar and the dont_scroll will not work
            this.$(this.content_element).css(
                'min-height',
                `${this.$(this.content_element).height()}px`
            );
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
    }

    protected processJsonLd(): void {}
    protected updateLayout(): void {}

    // @method wrapModalView
    // @param {Backbone.View} view
    public wrapModalView(view: any): this {
        const $modal_body = view.$containerModal.find(['data-type="modal-body"']);
        if (view.$('.modal-body').length && $modal_body.length) {
            $modal_body.removeClass('modal-body');
        }

        return this;
    }

    // @method prefixViewIds
    // @param {Backbone.View} view
    // @param {String} prefix
    public prefixViewIds(view: any, prefix: string): void {
        if (typeof view === 'string') {
            prefix = view;
            view = this.currentView;
        }

        if (view instanceof Backbone.View) {
            prefix = prefix || '';
            // Adding the prefix to all ids
            view.$('[id]').each(function(): void {
                const el = jQuery(this);

                if (el.parents('svg').length > 0 || !!el.data('nonprefix')) {
                    return; // don't overwrite svg child ids & data-nonprefix="true"
                }

                el.attr('id', function(i: any, old_id: any): string {
                    return prefix + old_id;
                });
            });

            // Adding the prefix to all fors, so labels still work
            view.$('[for]').each(function(): void {
                jQuery(this).attr('for', function(i: any, old_id: any): string {
                    return prefix + old_id;
                });
            });
        }
    }

    // @method addModalListeners
    // @param {Backbone.View} view
    public addModalListeners(view: any, current_view: any): void {
        // hidden is an even triggered by the bootstrap modal plugin
        // we obliterate anything related to the view once the modal is closed
        view.$containerModal.on(
            'hidden.bs.modal',
            (): void => {
                this.$el.removeClass('modal-open');

                view.trigger('modal-close', view);

                current_view.destroy();
                view.$containerModal.remove();
                view.$containerModal = null;
                this.$containerModal = null;
                this.modalCurrentView = null;
                $current_modal_el = false;

                this._currentView = this.currentView;

                // After closing te modal, impose the underlying view's title
                document.title = (this.currentView && this.currentView.getTitle()) || '';
            }
        );

        // Only trigger afterAppendView when finished showing the modal
        // (has animation which causes a delay)
        view.$containerModal.on(
            'shown.bs.modal',
            (): void => {
                if (view.focusFirstInput ? view.focusFirstInput() : true) {
                    view.$('form:first *:input[type!=hidden]:first').focus();
                }
                this.trigger('afterAppendView', view);
                view.$containerModal.modal('handleUpdate');
            }
        );
    }

    // @method getCurrentView
    // @return {Backbone.View} the current view no matter if rendered normally or in a modal.
    public getCurrentView(): any {
        return this._currentView;
    }

    // @method showInPush
    // @param {Backbone.View} view
    // @param {Object} options
    public showInPush(view: any, options: any): any {
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

        this.$pusher_container.on(
            'afterClose',
            (): void => {
                if (!options.no_destroy) {
                    if (view) {
                        view.$el.empty();
                        view.destroy();
                        this.$pusher_container.find('div:empty').remove();
                        this.pushCurrentView = null;
                    }
                }
            }
        );

        return jQuery.Deferred().resolveWith(this, [view]);
    }

    // @method closePush
    public closePush(): void {
        if (this.$pusher_container) {
            this.$pusher_container.trigger('close');
            this.$pusher_container.find('div:empty').remove();
        }
    }

    public showInModal(view: any, options: any): any {
        return this.emitter
            .emitUnsafe('beforeAppendView', view)
            .then((): any => this._showInModal(view, options));
    }

    // @method showInModal
    // @param {Backbone.View} view
    // @param {className:String,modalOptions:Object} options Optional object
    // @param {jQuery.Deferred}
    private _showInModal(view: any, options: any): any {
        const promise_result = jQuery.Deferred();

        options = jQuery.extend({ modalOptions: {} }, options);

        view.events = view.events || {};
        // We add the mousedown event on the 'Cancel' button to hide the modal, otherwise,
        // the validation could add a validation error and move the position of the 'Cancel' button
        // and fail to close the modal on the click event
        // Order of the events: mousedown, blur, click
        view.events['mousedown [data-dismiss="modal"]'] = function(e: any): void {
            e.preventDefault();
        };

        view.on('destroy', function(): void {
            view.events['mousedown [data-dismiss="modal"]'] = null;
        });

        // we tell the view its being shown in a Modal
        view.inModal = true;

        // we need a different variable to know if the view has already been rendered in a modal
        // this is to add the Modal container only once to the DOM
        if (!view.hasRenderedInModal) {
            const element_id = view.$el.attr('id');

            const GlobalViewsModalView = this.getGlobalModalViewClass();
            GlobalViewsModalView.prototype.attributes = {};
            GlobalViewsModalView.prototype.className = `modal fade ${
                view.modalClass || element_id ? `modal-${element_id}` : ''
            }`;
            GlobalViewsModalView.prototype.attributes.id =
                view.modalId || element_id ? `modal-${element_id}` : 'modal';

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
            this.closeModal().done(
                (): void => {
                    this._showModalInDOM(view, options, current_modal_view, promise_result);
                }
            );
        } else {
            this._renderModalView(view, current_modal_view);
            promise_result.resolveWith(this, [view]);
        }

        return promise_result;
    }

    protected abstract getGlobalModalViewClass(): any;

    public closeModal(): any {
        const promise = jQuery.Deferred();

        if ($current_modal_el) {
            $current_modal_el.on('hidden.bs.modal', promise.resolve);

            $current_modal_el
                .removeClass('fade')
                .modal('hide')
                .data('bs.modal', null);
        } else {
            promise.resolve();
        }

        return promise;
    }

    // @method _renderModalView Internal method to render a view in a modal context
    // @param {Backbone.View} view
    // @param {jQuery} current_modal_view
    // @return {Void}
    private _renderModalView(view: any, currentModalView: any): void {
        // Generates the HTML for the view based on its template
        // http://backbonejs.org/#View-render
        if (!view.hasRenderedInModal) {
            currentModalView.render();
        } else {
            view.render();
        }

        this.wrapModalView(view).prefixViewIds(view, 'in-modal-');
    }

    // @method _showModalInDOM Internal auxiliary method responsible for render
    // the view and show it as a modal.
    // @param {Backbone.View} view
    // @param {Object} options
    // @param {jQuery} current_modal_view
    // @param {jQuery.Deferred} promise
    // @return {Void}
    private _showModalInDOM(view: any, options: any, currentModalView: any, promise: any): void {
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
    }

    // Defining the interface for this class. All modules will interact with the layout
    // trough this methods some others may be added as well
    // @method showError
    public showError(message, type?, closable?, disableElements?): void {
        this.hideError();

        // Finds or create the placeholder for the error message
        let placeholder = this.$('[data-type="alert-placeholder"]');

        if (!placeholder.length) {
            placeholder = jQuery('<div/>', { 'data-type': 'alert-placeholder' });
            this.$el.prepend(placeholder);
        }

        this.showMessage(
            placeholder,
            message,
            type || 'error',
            !_.isUndefined(closable) ? !!closable : false,
            true
        );

        // Re Enables all posible disableded buttons of the view
        if (!disableElements) {
            this.$(':disabled').attr('disabled', '');
        }

        // If the backToTop module is loaded, we scroll to the top of the view to show the error.
        if (this.application) {
            _.result(this.application.getLayout(), 'backToTop');
        }
    }

    public hideError(): void {
        this.$('[data-type="alert-placeholder"]').empty();
    }

    public showErrorInModal(message): void {
        const view = new BackboneView({ application: this.application });

        view.setTitle(Utils.translate('Error'));
        view.render = function(): void {
            this.$el.append(`<p class="error-message">${message}</p>`);
        };
        view.showInModal();
    }

    // @property {Object} childViews
    public getChildViews(): ChildViews {
        return {
            Notifications: (): any => {
                this.notifications = new NotificationsView();
                return this.notifications;
            }
        };
    }

    // @method notFound Shortcut to display the PageNotFoundView
    public notFound(): void {
        const view = new PageNotFoundView({
            application: this.application
        });

        view.showContent().done(
            (): void => {
                Loggers.getLogger().endLast('Navigation');
            }
        );
    }

    // @method internalError Shortcut to display the InternalErrorView
    public internalError(message?, pageHeader?, title?): void {
        const view = new InternalErrorView({
            application: this.application,
            message: message,
            pageHeader: pageHeader,
            title: title
        });

        view.showContent().done(
            (): void => {
                Loggers.getLogger().endLast('Navigation');
            }
        );
    }

    // @method expiredLink @param {String} message
    public expiredLink(message): void {
        const view = new ExpiredLinkView({
            application: this.application,
            pageHeader: message,
            title: message
        });

        view.showContent().done(
            (): void => {
                Loggers.getLogger().endLast('Navigation');
            }
        );
    }

    public abstract unauthorizedError(user_session_timedOut): void;
    public abstract forbiddenError(res?): void;

    public parseErrorMessage(jqXhr: JQuery.jqXHR, errorMessageKeys: any): string {
        return this.errorMessageParser(jqXhr, errorMessageKeys || this.errorMessageKeys);
    }

    private ajaxError(jqXhr, options, errorText): void {
        const intStatus = parseInt(jqXhr.status, 10);

        if (errorText === 'abort' || intStatus === 0) {
            return;
        }

        // Unauthorized Error, customer must be logged in -
        // we pass origin parameter with the right touchpoint for redirect the user after login
        // 206 is returned when someone else has logged in another browser
        // with the same user. In this case the first response is a 206
        // And the following are 401
        if (intStatus === 401 || intStatus === 206) {
            this.unauthorizedError(
                jqXhr.responseJSON && jqXhr.responseJSON.errorCode === 'ERR_USER_SESSION_TIMED_OUT'
            );
            return;
        }

        // You can bypass all this logic by capturing the error callback
        // on the fetch using preventDefault = true on your jqXhr object
        if (!jqXhr.preventDefault) {
            // if its a write operation we will call the showError
            // of the currentView or of the modal if presetn
            let message = this.errorMessageParser(jqXhr, this.errorMessageKeys, options);

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
                } else {
                    // Other ways we just show an internal error page
                    this.internalError(message);
                }
            } else if (this.currentView) {
                // Do not show error message if forbidden
                if (intStatus !== 403) {
                    // Calls the showError of the modal if present or the one of the
                    // currentView (content view)
                    if (this.modalCurrentView) {
                        this.modalCurrentView.showError(message);
                    } else {
                        const childViewInstances = this.currentView.getChildViewInstances();

                        let activeView = _.find(childViewInstances, function(childView: any): any {
                            return (
                                childView &&
                                (childView.$('.focused-form-view').length > 0 ||
                                    childView.$el.is('.focused-form-view'))
                            );
                        });
                        activeView = activeView || this.currentView;
                        activeView.showError(message);
                    }
                } else {
                    const view = this.modalCurrentView || this.currentView;
                    if (view && _.isFunction(view.forbiddenError)) {
                        view.forbiddenError(message);
                    } else {
                        this.forbiddenError(message);
                    }
                }
            } else {
                // We allways default to showing the internalError of the layout
                this.internalError();
            }
        }
    }

    public showMessage(
        placeholder: JQuery,
        message: string,
        type: 'success' | 'warning' | 'error',
        closable: boolean,
        append: boolean = false
    ): void {
        const MessageView = this.getGlobalMessageView();
        const globalViewMessage = new MessageView({
            message: message,
            type: type,
            closable: closable
        });

        const html = globalViewMessage.render().$el.html();
        if (append) {
            placeholder.append(html);
        } else {
            placeholder.html(html);
        }
    }

    public showConfirmationMessage(message: string, fixed?: boolean) {
        const confirmation_message = this.$('[data-confirm-message]');
        this.showMessage(confirmation_message, message, 'success', true);

        if (!fixed) {
            setTimeout(function() {
                confirmation_message.fadeOut(3000);
            }, 5000);
        }
    }

    public showXHRErrorMessage(
        placeholder: JQuery,
        jqXhr: JQuery.jqXHR,
        closable: boolean,
        append: boolean = false
    ): void {
        const message = this.errorMessageParser(jqXhr, this.errorMessageKeys);
        this.showMessage(placeholder, message, 'error', closable, append);
    }

    protected getGlobalMessageView(): any {
        return GlobalViewsMessageView;
    }

    // @method getContext
    // @return {ApplicationSkeleton.Layout.Context}
    public getContext(): {} {
        // @class ApplicationSkeleton.Layout.Context
        return {};
    }
}
