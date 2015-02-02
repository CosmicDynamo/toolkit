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
 * @module service.handler.request._Put
 */
define([
    "dojo/_base/declare",
    "../_Request",
    "../_ResponseBody",
    "../_RequestBody",
    "blocks/promise/when"
], function (declare, _Request, _ResponseBody, _RequestBody, when) {
    /**
     * Base class for GET requests
     * @class service.handler.request._Get
     * @mixes service.handler._Request
     * @override service.handler._Request#handle
     */
    return declare([_Request, _ResponseBody, _RequestBody], {
        /**
         * Handle the incoming GET Request
         * @param {RdfJs.Node} iri - The URL of the request being handled
         * @param {Object} args - arguments that can be used to control how the data is handled
         * @returns {Promise<*>}
         */
        handle: function(iri, args) {
            var ready = this.inherited(arguments);

            ready = when(ready, this.parseRequestBody.bind(this));

            ready = when(ready, this.logic.bind(this));

            return when(ready, this.finalize.bind(this));
        },
        /**
         * Perform Business logic and add Hypermedia Controls
         * @return {Promise | *}
         */
        logic: function(){
            //NOOP
        },
        /**
         * Fill in request headers and perform any operations that should be done before response is sent
         * @return {Promise | *}
         */
        finalize: function() {
            var handler = this;

            var built = handler.buildResponseBody(handler.builder);

            return when(built, function(body){
                if (body === null){
                    handler.setStatus(406);
                    body = "Could not find serializer for Accept Header";
                }
                //In case the request was proxied rely on the builder's subject IRI and not
                //  the request URL
                var iri = handler.builder.subject;
                if (iri.isNamed()){
                    handler.setHeader("Location", iri.toString().replace("file:/", handler.app().server.proxyName));
                }

                handler.response.send(body).end();
            });
        }
    });
});