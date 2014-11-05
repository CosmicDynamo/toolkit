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
 * @module core.headers.contentType
 */
define([
    "dojo/_base/declare",
    "blocks/Container"
], function (declare, Container) {
    /**
     * @class core.headers.contentType
     */
    return declare([], {
        type: null,
        params: null,
        constructor: function (value) {
            this.params = new Container();
            if (value) {
                var parts = value.split(";");
                this.type = parts[0];
                for (var idx = 1; idx < parts.length; idx++) {
                    var p = parts[idx].split("=");

                    this.params.set(p[0], p[1]);
                }
            }
        },
        toString: function () {
            var out = [this.type];

            this.params.keys().forEach(function (key) {
                out.push(key + "=" + this.params.get(key));
            }.bind(this));

            return out.join(";");
        }
    });
});