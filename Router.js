/**
 * @copyright
 * The MIT License (MIT)
 *
 * Copyright (c) 2014 Cosmic Dynamo LLC
 *
 *  Permission is hereby granted, free of charge, to any person obtaining a copy
 *  of this software and associated documentation files (the "Software"), to deal
 *  in the Software without restriction, including without limitation the rights
 *  to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 *  copies of the Software, and to permit persons to whom the Software is
 *  furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in
 * all copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
 * THE SOFTWARE.
 * @module service.Router
 */
define([
    "dojo/_base/declare",
    "core/HandlerHub",
    "service/ontology/jss",
    "RdfJs/node/Named"
], function (declare, HandlerHub, jss, Named) {
    /**
     * @class service.Router
     * @mixes core.HandlerHub
     */
    return declare([HandlerHub], {
        configGraph: "RequestHandlers",
        /** @property {String} */
        handlerType: "http://vocab.cosmicdynamo.net/service.owl#RequestHandler",
        init: function () {
            var router = this;
            router.app().messaging.use(router.route.bind(router));
        },
        /**
         * Redirects the request to the correct logic module
         * @param req
         * @param res
         */
        route: function (req, res) {
            var app = this.app();
            var server = app.server;
            var router = this;

            var url = new Named(req.url.replace(app.proxyName, "file://"));

            var objectType = server.typeFromUrl(url);
            objectType = objectType || jss("BadRequest-TypeNotSupported");

            console.verbose("Request Identified As Type:".verbose, objectType.toNT().info);

            var custom = router.handle(url, {
                handleAs: objectType,
                objectType: objectType,
                request: req,
                response: res
            });

            return custom || router.handle(url, {
                handleAs: jss("DefaultRequestHandler"),
                objectType: objectType,
                request: req,
                response: res
            });
        }
    });
});