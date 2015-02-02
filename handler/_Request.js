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
 * @module service.handler._Request
 */
define([
    "dojo/_base/declare",
    "core/_Handler",
    "blocks/promise/when"
], function (declare, _Handler, when) {
    /**
     * Base class for processing Incoming Requests
     * @class service.handler._Request
     * @mixes core._Handler
     * @interface
     */
    return declare([_Handler], {
        /**
         * @property
         * @type {Number}
         */
        statusCode: null,
        /**
         * @property
         * @type {express.Request}
         */
        request:null,
        /**
         * @property
         * @type {express.Response}
         */
        response:null,
        /**
         * @property
         * @type {RdfJs.node.Named}
         */
        objectType: null,
        /**
         * Handle the incoming Request
         * @param {RdfJs.Node} iri - The URL of the request being handled
         * @param {Object} args - arguments that can be used to control how the data is handled
         * @param {express.Request} args.request - The express Request object
         * @param {express.Response} args.response - The express Response object
         * @param {RdfJs.Node} args.objectType - The owl:Class this data is being represented as
         * @override core._Handler#handle
         */
        handle: function(iri, args){
            args.subject = iri;

            return this.initBuilder(args);
        },
        /**
         * Initializes the builder object that will be used to manipulate/read data for this request
         * @param {service.handler._Request} args - arguments that will be used to instantiate the builder
         * @return {Promise | *} - Promise that is resolved when initialization is complete
         */
        initBuilder: function (args){
            return this.logic(args);
        },
        logic: function(args){
            return this.finalize();
        },
        /**
         * Fill in request headers and perform any operations that should be done before response is sent
         * @return {Promise | *}
         */
        finalize: function(args) {
            var handler = this;

            var built = handler.formatResponse(args);

            return when(built, function(body){
                if (body === null){
                    return handler.invalidAccept(args);
                }

                handler.sendBody(args, body);
            });
        },
        end: function(args){
            //In case the request was proxied rely on the builder's subject IRI and not
            //  the request URL
            this.setLocation(args, args.builder.subject);

            args.response.end();
        },
        formatResponse: function(body){
            this.setStatus(501);

            return 'Not Implemented';
        },
        sendBody: function(args, body){
            args.response.send(body);
        },
        invalidAccept: function(args){
            this.setStatus(args, 406);

            this.sendBody(args, "Could not find serializer for Accept Header");
        },
        setLocation: function(args, iri){
            if (iri.isNamed()){
                this.setHeader(args, "Location", iri.toString().replace("file:/", this.app().server.proxyName));
            }
        },
        setHeader: function(args, name, value){
            var response = args.response;

            //CORS requires that every header that you want to make readable should be exposed
            var expose = (response.getHeader("Access-Control-Expose-Headers") || "").split(", ");
            if (expose.indexOf(name) === -1) {
                expose.push(name);
                response.setHeader("Access-Control-Expose-Headesr", expose.join(", "))
            }

            response.setHeader(name, value);
        },
        setStatus: function(args, value){
            var code = Math.max(args.response.statusCode || 0, value);
            args.response.status(code);

            args.response.statusCode = code;
        }
    });
});