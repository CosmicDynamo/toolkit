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
 * @module blocks.parser.range
 */
define([
    "dojo/_base/lang",
    "./keyWord",
    "blocks/promise/when"
], function (lang, keyWord, when) {
    function async(data, max, fn, separator, optional, list) {
        if (data.isEnd() || (list.length >= max && max > -1)) {
            return list;
        }

        return when(fn.call(this, data), function (val) {
            var keepOn = val !== null;
            if (keepOn) {
                if (lang.isArray(val)) {
                    list = list.concat(val);
                } else {
                    list.push(val);
                }
            }
            if (separator !== undefined) {
                if (keyWord(data, separator, true, true) === null) {
                    if (!optional) {
                        keepOn = false;
                    }
                } else {
                    keepOn = true;
                }
            }
            return keepOn ? async(data, max, fn, separator, optional, list) : list;
        })
    }

    /**
     * Will execute an input method untill the requested range of results are received
     * @description If the min number cannot be found; the parse position will be reset and a null value returned
     * @param {jazzHands.parser.Data} data - Information about the parsing process
     * @param {Number} min - The minimum number of times Function should return a result to be valid
     * @param {Number} max - The maximum number of times Function will execute; or -1 if unlimited
     * @param {Function} fn - The method to execute looking for results
     * @param {String} [separator] - The value that appears between each value picked up by fn
     * @param {Boolean} [optional] - Is the separator required to be between each value
     * @return {Array<*> | Promise<Array<*>>} An array containing zero or more result values
     */
    function range(data, min, max, fn, separator, optional) {
        var start = data.pos;

        return when(async(data, max, fn, separator, optional, []), function (list) {

            if (list.length < min) {
                data.pos = start;
                return null;
            }
            return list;
        });
    }

    return range;
});