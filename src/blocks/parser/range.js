/**
 * @copyright
 * The MIT License (MIT)
 *
 * Copyright (c) 2014-2015 Cosmic Dynamo LLC
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
 * @module blocks.parser.range
 */
define([
    "./keyWord",
    "blocks/promise/when"
], function (keyWord, when) {

    /**
     * Will execute an input method untill the requested range of results are received
     * @description If the min number cannot be found; the parse position will be reset and a null value returned
     * @param {blocks.parser.Data} data - Information about the parsing process
     * @param {Number} min - The minimum number of times Function should return a result to be valid
     * @param {Number} max - The maximum number of times Function will execute; or -1 if unlimited
     * @param {Function} fn - The method to execute looking for results
     * @param {String} [separator] - The value that appears between each value picked up by fn
     * @param {Boolean} [optional] - Is the separator required to be between each value
     * @return {Array<*> | Promise<Array<*>>} An array containing zero or more result values
     */
    function range (data, min, max, fn, separator, optional) {
        function isDone(val){
            if (separator !== undefined) {
                if (keyWord(data, separator, true, true) !== null){
                    return data.isEnd();
                } else if (!optional) {
                    return true;
                }
            }
            if (val === null) {
                return true;
            }
            return data.isEnd();
        }

        function onNext(details){
            if (details.stop || data.isEnd()){
                return details.results;
            }
            var keepOn = false;
            do {
                var async = when(fn.call(this, data), function(val){
                    if (val !== null) {
                        details.results.push(val);
                    }
                    keepOn = !isDone(val, data, separator, optional);
                    if (max > 0) {
                        keepOn = keepOn && details.results.length < max;
                    }
                    details.stop = !keepOn;
                    return details;
                });

                if (async.then){
                    return when(async, onNext);
                }
            } while (keepOn);

            return details.results;
        }

        var start = data.pos;
        return when(onNext({results:[], stop:false}), function(results){
            if (results.length < min){
                data.pos = start;
                return null;
            }
            return results;
        })
    }

    return range;
});