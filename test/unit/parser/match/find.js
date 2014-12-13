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
 * @module jazzHands.test.unit.parser.match.find
 */
define([
    "qasht/package/Unit",
    "jazzHands/parser/match/find",
    "jazzHands/parser/Data"
], function (TestPackage, find, Data) {
    return new TestPackage({
        module: "jazzHands/parser/match/find",
        tests: [
            {
                name: "Requires each parser until one returns a value",
                input: "Pass",
                exec: function (test) {
                    var ready = find(test.data, [
                        "jazzHands/test/unit/parser/match/resource/returnNull",
                        "jazzHands/test/unit/parser/match/resource/returnValue"
                    ]);
                    test.assertNotEqual(ready, test.data.input, "Went async to require modules");

                    test.whenResolved(ready, function(result){
                        test.assertEqual(result, test.data.input);

                        test.complete();
                    })
                }
            },
            {
                name: "Handles promise returned by parser",
                input: "Pass",
                exec: function (test) {
                    var ready = find(test.data, [
                        "jazzHands/test/unit/parser/match/resource/returnPromise",
                        "jazzHands/test/unit/parser/match/resource/returnValue"
                    ]);
                    test.assertNotEqual(ready, test.data.input, "Went async to require modules");

                    test.whenResolved(ready, function(result){
                        test.assertEqual(result, test.data.input);

                        test.complete();
                    })
                }
            },
            {
                name: "Supports passing a parser directly into array",
                input: "Pass",
                exec: function (test) {
                    var result = find(test.data, [
                        function(data){
                            return data.input
                        }
                    ]);
                    test.assertEqual(result, test.data.input);

                    test.complete();

                }
            }
        ],
        setUp: function (test) {
            test.data = new Data({
                input: test.input
            })
        }
    });
});
/*
define([
    "dojo/_base/lang",
    "blocks/AsyncArray",
    "blocks/promise/when",
    "blocks/require"
], function (lang, AsyncArray, when, require) {
    /**
     * This method will execute each of the input modules in order until one returns a success result
     * @param {jazzHands.parser.Data} data - Information about the parsing process
     * @param {Array<String | jazzHands.parser._Parser>} parsers -  list of module ids or instances to be tried
     * @return {Promise<*> | * | null} - Promise might be created if the module needs to be required in
     *
    function find(data, parsers){
        return (new AsyncArray(parsers)).find(function(mid){
            var ready = mid;
            if (lang.isString(mid)){
                ready = require([mid]);
            }
            return when(ready, function(parser){
                return parser.parse(data);
            });
        })
    }
    return find;
});*/