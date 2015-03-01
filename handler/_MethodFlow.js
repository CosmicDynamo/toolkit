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
 * @module service.handler._MethodFlow
 */
define([
    "dojo/_base/declare",
    "blocks/promise/when"
], function (declare, when) {
    /**
     * @class service.handler._MethodFlow
     */
    return declare([], {
        /**
         * @property
         * @type {String[]}
         * @private
         */
        _order: null,
        constructor: function(){
            this._order = [];
        },
        /**
         * Initializes the method order
         * @param {String[]} order - desired order for method execution
         */
        setOrder: function(order){
            this._order = order;
        },
        /**
         * Begins running through the method sequence
         * @return {Promise<*>}
         */
        start: function(args){
            args = args || {};
            args.index = args.index || 0;
            return this.next(args);
        },
        /**
         * Calls the next method in the sequence
         * @param {Object} args
         * @param {Number} args.index - The current position in the sequence
         * @return {Promise<*>}
         */
        next: function(args){
            var flow = this;

            var fn = flow[flow._order[args.index]];

            args.index++;
            var result = fn?fn.call(this, args):null;
            return when(result, function(){
                if (args.index >= flow._order.length){
                    return null;
                }
                return flow.next(args);
            });
        },
        /**
         * Skips to a different method in the sequence;
         * @param {Object} args
         * @param {Number} args.index - The current position in the sequence
         * @param targetMethod
         */
        skipTo: function(args, targetMethod){
            args.index = this._order.indexOf(targetMethod, args.index);

        },
        /**
         * Expands a step to include the new steps
         * @param {String} stepName - Name of the step that is being expanded
         * @param {...String} newStep - list of steps that will replace the target step
         */
        expandStep: function(stepName, newStep){
            var list = this._order;
            var args = [list.indexOf(stepName), 1];

            for(var idx = 1; idx < arguments.length; idx++){
                args.push(arguments[idx])
            }

            list.splice.apply(list, args);
        }
    });
});