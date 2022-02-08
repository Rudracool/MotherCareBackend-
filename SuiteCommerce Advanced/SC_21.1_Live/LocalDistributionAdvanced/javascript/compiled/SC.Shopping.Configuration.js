/*
    © 2020 NetSuite Inc.
    User may not copy, modify, distribute, or re-bundle or otherwise make available this code;
    provided, however, if you are an authorized user with a NetSuite account or log-in, you
    may use this code subject to the terms that govern your access and use.
*/
define("SC.Shopping.Configuration", ["require", "exports", "underscore", "Utils", "jQuery", "Configuration", "Session", "Backbone"], function (require, exports, _, Utils, jQuery, Configuration_1, Session, Backbone) {
    "use strict";
    var Configuration = {
        // depending on the application we are configuring, used by the NavigationHelper.js
        currentTouchpoint: 'home',
        modulesConfig: {
            ProductDetails: { startRouter: true },
            Cart: { startRouter: true, saveForLater: true }
        },
        // @property {loginToSeePricesConfiguration} loginToSeePrices
        // @class loginToSeePricesConfiguration
        loginToSeePrices: {
            // @property {Array<String>} hiddenFacetNames That are the names
            // we are taking into consideration when hide any facet
            hiddenFacetNames: ['onlinecustomerprice']
        },
        colors: Configuration_1.Configuration.get('colors'),
        // @property {String} searchTitlePrefix Title prefix for the facet browse view.
        searchTitlePrefix: Utils.translate(''),
        // @property {String} searchTitleSuffix Title suffix for the facet browse view.
        searchTitleSuffix: Utils.translate('')
    };
    /**
     * SEO related configuration
     * Search Engine Optimization
     */
    var seo_title = function (layout) {
        var title = layout.$('[itemprop="name"]:eq(0)').text();
        return title && title.length ? String(title).trim() : '';
    };
    var seo_url = function () {
        return (window.location.protocol + '//' + window.location.hostname + '/' + Backbone.history.fragment);
    };
    var seo_domain = function () {
        return Session.get('touchpoints.home');
    };
    var seo_image = function (layout, number) {
        var $image = layout.$('[data-type="social-image"], [itemprop="image"]');
        var my_number = typeof number === 'undefined' ? 0 : number;
        var resized_image = $image.get(my_number)
            ? $image.get(my_number).src
            : Utils.getThemeAbsoluteUrlOfNonManagedResources('img/no_image_available.jpeg', Configuration_1.Configuration.get.apply(Configuration, ['imageNotAvailable']));
        var patt = new RegExp('https?://');
        var image_url = encodeURI(resized_image);
        if (!patt.exec(image_url)) {
            image_url = window.location.origin + encodeURI(resized_image);
        }
        return image_url;
    };
    var seo_site_name = function () {
        return SC.ENVIRONMENT.siteSettings.displayname;
    };
    var seo_description = function (layout) {
        var social_description = layout
            .$('[data-type="social-description"], [itemprop="description"]')
            .first()
            .text();
        social_description = String(social_description).trim().replace(/\s+/g, ' ');
        return social_description && social_description.length ? social_description : '';
    };
    var seo_twitter_description = function (layout) {
        var description = seo_description(layout);
        // Twitter cards requires a description less than 200 characters
        return description && description.length ? description.substring(0, 200) : '';
    };
    var seo_provider_name = function () {
        return SC.ENVIRONMENT.siteSettings.displayname;
    };
    var seo_price = function (layout) {
        var price = layout.$('[itemprop="price"]:eq(0)').text();
        price = String(price).trim();
        return price && price.length ? price : '';
    };
    var seo_price_standard_amount = function (layout) {
        var the_num = seo_price(layout);
        return the_num && the_num.length ? the_num.replace(/^\D+/g, '') : '';
    };
    var seo_price_currency = function (layout) {
        var price_currency = layout.$('[itemprop="priceCurrency"]').attr('content');
        price_currency = String(price_currency).trim();
        return price_currency && price_currency.length ? price_currency : '';
    };
    var seo_availability = function (layout) {
        var $availability_href = layout.$('[itemprop="availability"]');
        var result = '';
        var param = '';
        $availability_href = String($availability_href.attr('href')).trim();
        result = $availability_href.split('/');
        param = result[result.length - 1];
        return param && param.length ? param : '';
    };
    var seo_rating = function (layout) {
        var rating = layout.$('[itemprop="ratingValue"]:eq(0)').attr('content');
        return rating && rating.length ? rating : '';
    };
    var seo_rating_scale = function (layout) {
        var rating_scale = layout.$('[itemprop="bestRating"]:eq(0)').attr('content');
        return rating_scale && rating_scale.length ? rating_scale : '';
    };
    var seo_rating_count = function (layout) {
        var rating_count = layout.$('[itemprop="reviewCount"]:eq(0)').text();
        return rating_count && rating_count.length ? String(rating_count).trim() : '';
    };
    var seo_twitter_site = function () {
        return '';
    };
    var seo_twitter_creator = function () {
        return '';
    };
    var seo_twitter_label_one = function () {
        return 'PRICE';
    };
    var seo_twitter_price = function (layout) {
        return String(seo_price(layout).trim() + ' ' + seo_price_currency(layout));
    };
    var seo_twitter_label_two = function () {
        return 'AVAILABILITY';
    };
    var seo_twitter_image_cero = function (layout) {
        return seo_image(layout, 0);
    };
    var seo_twitter_image_one = function (layout) {
        return seo_image(layout, 1);
    };
    var seo_twitter_image_two = function (layout) {
        return seo_image(layout, 2);
    };
    var seo_twitter_image_three = function (layout) {
        return seo_image(layout, 3);
    };
    var seo_google_plus_authorship_author = function () {
        // Author for individual contents
        // return 'https://plus.google.com/+YourAuthorName';
    };
    var seo_google_plus_authorship_publisher = function () {
        // Publisher for brand contents
        // return 'https://plus.google.com/+YourPublisherName';
    };
    var fb_app_id = function () {
        return SC.CONFIGURATION.facebook.appId;
    };
    _.extend(Configuration, {
        // @property {Object} linkTagGooglePlusAuthorship
        linkTagGooglePlusAuthorship: {
            author: seo_google_plus_authorship_author,
            publisher: seo_google_plus_authorship_publisher
        },
        // @property {Object} metaTagMappingOg [Open Graph](http://ogp.me/)
        metaTagMappingOg: {
            'og:title': seo_title,
            'og:type': function () {
                return 'product';
            },
            'og:url': seo_url,
            'og:image': seo_image,
            'og:site_name': seo_site_name,
            'og:description': seo_description,
            'og:provider_name': seo_provider_name,
            'og:price:standard_amount': seo_price_standard_amount,
            'og:price:currency': seo_price_currency,
            'og:availability': seo_availability,
            'og:rating': seo_rating,
            'og:rating_scale': seo_rating_scale,
            'og:rating_count': seo_rating_count,
            'fb:app_id': fb_app_id
        },
        // @property {Object} metaTagMappingTwitterProductCard [Twitter Product Card](https://dev.twitter.com/docs/cards/types/product-card)
        metaTagMappingTwitterProductCard: {
            'twitter:card': function () {
                return 'product';
            },
            'twitter:site': seo_twitter_site,
            'twitter:creator': seo_twitter_creator,
            'twitter:title': seo_title,
            'twitter:description': seo_twitter_description,
            'twitter:image:src': seo_image,
            'twitter:domain': seo_domain,
            'twitter:data1': seo_twitter_price,
            'twitter:label1': seo_twitter_label_one,
            'twitter:data2': seo_availability,
            'twitter:label2': seo_twitter_label_two
        },
        // @property {Object} metaTagMappingTwitterGalleryCard [Twitter Gallery Card](https://dev.twitter.com/docs/cards/types/gallery-card)
        metaTagMappingTwitterGalleryCard: {
            'twitter:card': function () {
                return 'gallery';
            },
            'twitter:title': seo_title,
            'twitter:description': seo_twitter_description,
            'twitter:image0:src': seo_twitter_image_cero,
            'twitter:image1:src': seo_twitter_image_one,
            'twitter:image2:src': seo_twitter_image_two,
            'twitter:image3:src': seo_twitter_image_three
        }
    });
    // Deep extend
    jQuery.extend(true, Configuration_1.Configuration, Configuration);
    var module = Configuration_1.Configuration;
    return module;
});

//# sourceMappingURL=SC.Shopping.Configuration.js.map
