/*
    © 2020 NetSuite Inc.
    User may not copy, modify, distribute, or re-bundle or otherwise make available this code;
    provided, however, if you are an authorized user with a NetSuite account or log-in, you
    may use this code subject to the terms that govern your access and use.
*/
define("CMSadapter.Impl.Merchandising.v2", ["require", "exports", "underscore", "CMSadapter.Impl.Merchandising"], function (require, exports, _, CMSadapterImplMerchandising) {
    "use strict";
    /*
    
    @module CMSadapter
    
    @class CMSadapter.Impl.Merchandising.v2
    */
    var CMSadapterImplMerchandising2 = function (application, CMS) {
        CMSadapterImplMerchandising.call(this, application, CMS);
    };
    CMSadapterImplMerchandising2.prototype = Object.create(CMSadapterImplMerchandising.prototype);
    CMSadapterImplMerchandising2.prototype.listenForCMS = function listenForCMS() {
        // CMS listeners - CMS tells us to do something, could fire anytime.
        var self = this;
        self.CMS.on('adapter:get:cart:items', function () {
            var cart = self.application.getComponent('Cart');
            var linesId = [];
            if (cart) {
                cart.getLines().then(function (lines) {
                    _.each(lines, function (line) {
                        if (line.item && line.item.internalid) {
                            linesId.push(line.item.internalid);
                        }
                    });
                    self.CMS.trigger('adapter:got:cart:items', linesId);
                });
            }
            else {
                self.CMS.trigger('adapter:got:cart:items', linesId);
            }
        });
        self.CMS.on('adapter:get:current:item', function () {
            var pdp = self.application.getComponent('PDP');
            var linesId = [];
            if (pdp) {
                var product = pdp.getItemInfo();
                if (product && product.item && product.item.internalid) {
                    linesId.push(product.item.internalid);
                }
            }
            self.CMS.trigger('adapter:got:current:item', linesId);
        });
    };
    return CMSadapterImplMerchandising2;
});

//# sourceMappingURL=CMSadapter.Impl.Merchandising.v2.js.map
