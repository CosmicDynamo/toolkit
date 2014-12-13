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
 * @module jazzHands.test.unit.parser.match.rdfType
 */
define([
    "qasht/package/Unit",
    "jazzHands/parser/match/rdfType",
    "jazzHands/parser/Data"
], function (TestPackage, rdfType, Data) {
    return new TestPackage({
        module: "jazzHands/parser/match/rdfType",
        tests: [
            {
                name: "If next word is 'a' will return RdfJs.Node for rdf:type",
                input: "a",
                exec: function (test) {
                    var out = rdfType(test.data);

                    test.assertEqual("<http://www.w3.org/1999/02/22-rdf-syntax-ns#type>", out.toNT());
                    test.assertEqual(1, test.data.pos, "position incremented");

                    test.complete();
                }
            },
            {
                name: "Will strip leading white space",
                input: " \n\t\r #A comment\r\n a",
                exec: function (test) {
                    var out = rdfType(test.data);

                    test.assertEqual("<http://www.w3.org/1999/02/22-rdf-syntax-ns#type>", out.toNT());
                    test.assertTrue(test.data.isEnd(), "position incremented");

                    test.complete();
                }
            },
            {
                name: "Returns null if char is not 'a'",
                input: "fail",
                exec: function (test) {
                    var out = rdfType(test.data);

                    test.assertNull(out);
                    test.assertEqual(0, test.data.pos, "position not moved");

                    test.complete();
                }
            },
            {
                name: "Returns null if char is not 'a' - Case Sensitive",
                input: "A",
                exec: function (test) {
                    var out = rdfType(test.data);

                    test.assertNull(out);
                    test.assertEqual(0, test.data.pos, "position not moved");

                    test.complete();
                }
            }
        ],
        setUp: function (test) {
            test.data = new Data({
                input: test.input
            });
        }
    });
});
/*
define([
    "./keyWord",
    "jazzHands/RdfType"
], function (keyWord, RdfType) {
    /**
     * Detects an 'a' term for rdf:type
     * @param {jazzHands.parser.Data} data - Information about the parsing process
     *
    function type(data) {
        return keyWord(data, "a", true, true) ? RdfType() : null;
    }
    return type;
});*/