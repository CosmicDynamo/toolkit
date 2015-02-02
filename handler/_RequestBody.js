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
    "blocks/promise/when"
], function (declare, convert, when) {
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
            this.reqBody = ready;

            return this.inherited(arguments);
        },
        parseRequestBody: function(){
            var handler = this;
            return when(handler.reqBody, function(data){
                var contentType = handler.request.headers["Content-Type"];

                if (!contentType){
                    handler.setHeader("Content-Type", "text/plane");
                    handler.setStatus(406);
                    handler.requestFailed = true;
                    return "Fatal Exception: Missing Content-Type Header";
                }

                var out = convert(data, contentType, "RdfGraph");

                handler.builder.graph().addAll(out);
            })
        }
    });
});