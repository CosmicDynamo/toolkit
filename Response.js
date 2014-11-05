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
 * @module server.Response
 */
define([
    "dojo/_base/declare",
    "service/io/Builder"
], function (declare, Builder) {
    /**
     * @class server.Response
     * @mixes service.io.Builder
     */
    return declare([Builder], {
        request: null,
        response: null,
        /** @property {String} */
        rawBody: null,
        /** @property {String | RdfJs.Graph} */
        body: null,
        /** @property {String} */
        output: null,
        /** @property {Number} */
        statusCode: null,
        /** @property {service.builder} */
        builder: null,
        constructor: function (req, res) {
            this.request = req;
            this.response = res;
            this.output = "";
        },
        write: function () {
            this.statusCode = this.statusCode || 200; //TODO: consider exceptions
            this.response.writeHead(this.statusCode, response.headers);
            this.response.write(this.output);
            this.response.end();
        }
    });
});