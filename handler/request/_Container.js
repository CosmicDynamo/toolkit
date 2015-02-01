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
 * @module service.handler.request._Container
 */
define([
    "dojo/_base/declare",
    "service/builder/Container",
    "RdfJs/node/Named"
], function (declare, Container, Named) {
    /**
     * Base class for GET requests
     * @class service.handler.request._Container
     * @mixes service.handler._Request
     */
    return declare([], {
        /**
         * @property
         * @type builder.Container
         */
        builder: null,
        /**
         * Handle the incoming GET Request
         * @param {Object} params - arguments that will be used to instantiate the builder
         * @returns {Promise<*> | *}
         * @override service.handler._Request#initBuilder
         */
        initBuilder: function(params){
            var subject = params.subject.toString();
            if (subject.indexOf("/id/") > -1){
                subject = subject.substr(0, subject.lastIndexOf("/". subject.length - 2));
            }

            params.memberSubject = new Named(subject);
            return this.builder = new Container(params);
        }
    });
});