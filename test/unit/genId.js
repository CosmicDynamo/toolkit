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
 * @module $<class>$
 */
define([
    "qasht/package/Unit",
    "blocks/genId"
], function (TestPackage, genId) {
    return new TestPackage({
        module: "blocks/genId",
        tests: [
            {
                name: "genId: uses each code",
                exec: function (test) {
                    for(var idx = 0; idx < genId.codes.length; idx++){
                        test.assertEqual( genId.codes[idx], genId(), "code " + idx + "used");
                    }

                    test.complete();
                }
            },
            {
                name: "genId: Each Code is unique",
                exec: function (test) {
                    var generated = {};
                    for(var idx = 0; idx < genId.codes.length; idx++){
                        var id = genId();
                        test.assertUndefined(generated[id], "Id is unique");
                        generated[id] = true;
                    }

                    test.complete();
                }
            },
            {
                name: "genId: After all combinations are used, adds a char and starts over",
                setUp: function(){
                    for(var idx = 0; idx < genId.codes.length; idx++){
                       genId();
                    }
                },
                exec: function (test) {
                    for(var idx1 = 0; idx1 < genId.codes.length; idx1++){
                        for(var idx = 0; idx < genId.codes.length; idx++){
                            var expected = genId.codes[idx1] + genId.codes[idx];
                            test.assertEqual(expected, genId(), "code " + expected + "used");
                        }
                    }

                    test.complete();
                }
            }
        ],
        setUp: function (test) {
            genId.id = [-1];
        }
    });
});