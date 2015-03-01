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
    "./_MethodFlow"
], function (declare, _Handler, _MethodFlow) {
    /**
     * Base class for processing Incoming Requests
     * @class service.handler._Request
     * @mixes service.handler._MethodFlow
     * @mixes core._Handler
     * @interface
     */
    return declare([_Handler, _MethodFlow], {
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
        constructor: function(){
            this.setOrder([
                "init",
                "load",
                "addContainers",
                "applyTypes",
                "addLinks",
                "formatResponse",
                "send"
            ]);
        },
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

            return this.start(args);
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
        },
        send: function(args){
            //In case the request was proxied rely on the builder's subject IRI and not
            //  the request URL
            if (args.builder) {
                this.setLocation(args, args.builder.subject);
            }

            args.response.send(args.body).end();
        },
        setLocation: function(args, iri){
            if (iri.isNamed()){
                this.setHeader(args, "Location", iri.toString().replace("file:/", this.app().server.proxyName));
            }
        }
    });
});