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
 * @module jazzHands.parser.match.find
 */
define([
    "dojo/_base/lang",
    "blocks/promise/when",
    "blocks/require"
], function (lang, when, require) {
    /**
     * This method will execute each of the input modules in order until one returns a success result
     * @method jazzHands.parser.match#find
     * @param {jazzHands.parser.Data} data - Information about the parsing process
     * @param {Array<String | jazzHands.parser._Parser>} parsers -  list of module ids or instances to be tried
     * @param {Number} [idx ]- start index
     * @return {Promise<*> | * | null} - Promise might be created if the module needs to be required in
     */
    function find(data, parsers, idx){
        idx = idx || 0;
        function go(parse){
            var ready = parse(data);
            return when(ready, function(result){
                if (result !== null){
                    return result;
                }
                return find(data, parsers, idx+1);
            })
        }

        var parser = parsers[idx];
        if (lang.isString(parser)){
            return require([parser], go);
        }
        return go(parser);
    }
    return find;
});