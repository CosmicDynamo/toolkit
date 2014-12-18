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
 * @module jazzHands.test.unit.parser.match.comment
 */
define([
    "qasht/package/Unit",
    "RdfJs/parser/comment",
    "blocks/parser/Data"
], function (TestPackage, comment, Data) {
    return new TestPackage({
        module: "jazzHands/parser/match/comment",
        tests: [
            {
                name: "first char is a '#' will scan to end of line",
                input: "#This is an RDF '#' comment <So There >'",
                exec: function (test) {
                    var out = comment(test.data);

                    test.assertEqual("#", out);
                    test.assertEqual(test.input.length, test.data.pos);

                    test.complete();
                }
            },
            {
                name: "Stop if first char is not '#'",
                input: " #This is an RDF '#' comment <So There >'\nSome More Text",
                exec: function (test) {
                    var out = comment(test.data);

                    test.assertNull(out);
                    test.assertEqual(0, test.data.pos);

                    test.complete();
                }
            },
            {
                name: "Will leave text after the new line",
                input: "#This is an RDF '#' comment <So There >'\nSome More Text",
                exec: function (test) {
                    var out = comment(test.data);

                    test.assertEqual("#", out);
                    test.assertEqual("Some More Text", test.data.input.substr(test.data.pos));

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
 "./hasChar",
 "./range"
 ], function (hasChar, range) {
 /**
 * Strips off an RDF comment from the input string
 * @param {jazzHands.parser.Data} data - Information about the parsing process
 * @return {*}
 *
 function comment(data) {
 if (!hasChar(data, "#")) {
 return null;
 }

 return range(data, 0, -1, function () {
 if (hasChar(data, "\n")) {
 return null;
 }
 data.next();
 return "#";
 });
 }
 return comment;
 });*/