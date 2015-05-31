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
 * @module RdfJs.test.unit.parser.langTag
 */
define([
    "qasht/package/Unit",
    "RdfJs/parser/langTag",
    "blocks/parser/Data"
], function (TestPackage, langTag, Data) {
    return new TestPackage({
        module: "RdfJs/parser/langTag",
        tests: [
            {
                name: "supports simple language tag",
                input: "@en@fr@es Done",
                exec: function (test) {
                    test.assertEqual("en", langTag(test.data));
                    test.assertEqual("fr", langTag(test.data));
                    test.assertEqual("es", langTag(test.data));

                    test.assertNull(langTag(test.data));

                    test.complete();
                }
            },
            {
                name: "language tag w/ dash",
                input: "@es-mx@en-uk@es-005 Done",
                exec: function (test) {
                    test.assertEqual("es-mx", langTag(test.data));
                    test.assertEqual("en-uk", langTag(test.data));
                    test.assertEqual("es-005", langTag(test.data));

                    test.assertNull(langTag(test.data));

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