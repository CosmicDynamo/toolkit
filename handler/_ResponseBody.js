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
        formatResponse: function(args){
            var accept = args.request.headers["accept"];

            if (!accept){
                this.setHeader("Content-Type", "text/plane");
                this.setStatus(406);
                args.body = "Fatal Exception: Missing Accept Header";
                return;
            }

            var data = args.builder.graph();
            var baseUrl = this.app().server.proxyName;
            var replace = function (node) {
                if (node.isNamed() && node.toString().indexOf("file:/") == 0) {
                    node.nominalValue = node.nominalValue.replace("file:/", baseUrl);
                }
            };

            data.forEach(function (triple) {
                replace(triple.subject);
                replace(triple.object);
            });

            var match = (convert.bestMatch("RdfGraph", accept) || {}).mimeType;
            if (!match){
                this.setHeader("Content-Type", "text/plane");
                this.setStatus(406);
                args.body = "Fatal Exception: No acceptable serializer found for " + accept;
                return;
            }

            this.setHeader(args, "Content-Type", match);

            return when(convert(data, "RdfGraph", accept), function(body){
                args.body = body;
            });
        }
    });
});