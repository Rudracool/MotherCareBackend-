/*
    © 2020 NetSuite Inc.
    User may not copy, modify, distribute, or re-bundle or otherwise make available this code;
    provided, however, if you are an authorized user with a NetSuite account or log-in, you
    may use this code subject to the terms that govern your access and use.
*/
define("Utilities.ResizeImage", ["require", "exports", "underscore", "Configuration", "Utils"], function (require, exports, _, Configuration_1, Utils) {
    "use strict";
    function resizeImage(url, size) {
        url =
            url ||
                Utils.getThemeAbsoluteUrlOfNonManagedResources('img/no_image_available.jpeg', Configuration_1.Configuration.get('imageNotAvailable'));
        size = Configuration_1.Configuration['imageSizeMapping.' + size] || size;
        var resize = _.first(_.where(Configuration_1.Configuration.get('siteSettings.imagesizes', []), { name: size }));
        if (resize) {
            return url + (~url.indexOf('?') ? '&' : '?') + resize.urlsuffix;
        }
        return url;
    }
    return resizeImage;
});

//# sourceMappingURL=Utilities.ResizeImage.js.map
