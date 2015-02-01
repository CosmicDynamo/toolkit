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
    "../_Container",
    "blocks/promise/when"
], function (declare, _Get, _Container, when) {
    /**
     * @class service.handler.request.get.Instance
     * @mixes service.handler.request._Get
     * @mixes service.handler.request._Instance
     */
    return declare([_Get, _Container], {
        /**
         * Fill in calculated values and add Hypermedia Controls
         * @returns {Promise | *}
         * @override service.handler._Request#logic
         */
        logic: function(){
            var handler = this;

            var ready = handler.builder.load();

            ready = when(ready, function(){
                if (handler.preventSave){
                    return null;
                }

                return handler.addNewItemTemplate(handler);
            });

            return ready;
        },
        /**
         * Add the Hypermedia Link that will allow this object to be Updated
         */
        addNewItemTemplate: function(){
            var handler = this;
            var data = handler.builder;

            if (handler.app().permission.canAdd(data.memberSubject, data.predicate, data.objectType, data)) {
                data.exposeNewItemTemplate();
            }
        }
    });
});