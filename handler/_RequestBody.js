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
    "core/convert",
    "blocks/promise/when",
    "dojo/_base/Deferred"
], function (declare, convert, when, Deferred) {
    /**
     * Base class for processing Incoming Requests
     * @class service.handler._Request
     * @mixes service._Request
     * @interface
     */
    return declare([], {
        /**
         * @property
         * @type {String}
         */
        reqBody: null,
        handle: function(iri, args){
            var request = args.request;
            var body = "";
            request.on('data', function (chunk) {
                body += chunk.toString();
            });

            var ready = new Deferred();
            request.on('end', function () {
                ready.resolve(body);
            });
            args.requestBOdy = ready;
            return this.inherited(arguments);
        },
        parseRequest: function(args) {
            var handler = this;
            var queue =  when(args.requestBOdy, function(string){
                var contentType = args.request.headers["content-type"];

                var failure = "";
                if (!contentType) {
                    failure = "Fatal Exception: Missing Content-Type Header";
                } else if (!convert.bestMatch(contentType, "RdfGraph")){
                    failure = "No parser found for Content-Type: " + contentType;
                }

                if (failure){
                    handler.setHeader(args, "Content-Type", "text/plain");
                    handler.setStatus(args, 406);
                    args.body(args, failure);
                    return handler.skipTo(args, "send");
                }
                return convert(string, contentType, "RdfGraph");
            });

            var baseUrl = this.app().server.proxyName;
            return when(queue, function(data){
                var replace = function (node) {
                    if (node.isNamed() && node.toString().indexOf(baseUrl) == 0) {
                        node.nominalValue = node.nominalValue.replace(baseUrl, "file:/");
                    }
                };

                data.forEach(function (triple) {
                    replace(triple.subject);
                    replace(triple.object);
                });
                args.builder.graph().addAll(data);
            });
        },
        persist: function(args){
            return this.app().data.persist(args.subject, args.builder.graph());
        }
    });
});