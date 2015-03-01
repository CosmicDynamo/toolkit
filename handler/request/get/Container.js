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
 * @module service.handler.request.get.Container
 */
define([
    "dojo/_base/declare",
    "../_Get",
    "../_Container"
], function (declare, _Get, _Container) {
    /**
     * @class service.handler.request.get.Instance
     * @mixes service.handler.request._Get
     * @mixes service.handler.request._Container
     */
    return declare([_Get, _Container], {
        /**
         * Fill in calculated values and add Hypermedia Controls
         * @returns {Promise | *}
         * @override service.handler._Request#responseLogic
         */
        load: function(args){
            return args.builder.load();
        },
        /**
         * Add the Hypermedia Link that will allow this object to be Updated
         */
        addLinks: function(args){
            var handler = this;
            var data = args.builder;

            if (handler.app().permission.canAdd(data.memberSubject, args.predicate, args.objectType, data)) {
                data.exposeNewItemTemplate();
            }

            return this.inherited(arguments);
        }
    });
});