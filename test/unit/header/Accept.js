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
 * @module core.test.unit.header.accept
 */
define([
    "qasht/package/Unit",
    "core/header/accept",
    "RdfJs/test/fake/Node"
], function (TestPackage, bestMatch, Node) {
    return new TestPackage({
        module: "core/header/accept",
        tests: [
            {
                name: "direct match",
                exec: function (test) {
                    var match = bestMatch(['application/xbel+xml', 'application/xml'], 'application/xbel+xml');

                    test.assertEqual('application/xbel+xml', match);

                    test.complete();
                }
            },
            {
                name: "direct match with a q parameter",
                exec: function (test) {
                    var match = bestMatch(['application/xbel+xml', 'application/xml'], 'application/xbel+xml; q=1');

                    test.assertEqual('application/xbel+xml', match);

                    test.complete();
                }
            },
            {
                name: "direct match of our second choice with a q parameter",
                exec: function (test) {
                    var match = bestMatch(['application/xbel+xml', 'application/xml'], 'application/xml; q=1');

                    test.assertEqual('application/xml', match);

                    test.complete();
                }
            },
            {
                name: "match using a subtype wildcard",
                exec: function (test) {
                    var match = bestMatch(['application/xml', 'application/xbel+xml'], 'application/*; q=1');

                    test.assertEqual('application/xml', match);

                    test.complete();
                }
            },
            {
                name: "match using a type wildcard",
                exec: function (test) {
                    var match = bestMatch(['application/xml', 'application/xbel+xml'], '*/*');

                    test.assertEqual('application/xml', match);

                    test.complete();
                }
            },
            {
                name: "match using a type versus a lower weighted subtype",
                exec: function (test) {
                    var match = bestMatch(['application/xbel+xml', 'text/xml'], 'text/*;q=0.5,*/*; q=0.1');

                    test.assertEqual('text/xml', match);

                    test.complete();
                }
            },
            {
                name: "fail to match anything",
                exec: function (test) {
                    var match = bestMatch(['application/xbel+xml', 'text/xml'], 'text/html,application/atom+xml; q=0.9');

                    test.assertUndefined(match);

                    test.complete();
                }
            },
            {
                name: "common AJAX scenario",
                exec: function (test) {
                    var match = bestMatch(['application/json', 'text/xml'], 'application/json, text/javascript, */*');

                    test.assertEqual('application/json', match);

                    test.complete();
                }
            },
            {
                name: "verify fitness ordering",
                exec: function (test) {
                    var match = bestMatch(['application/json', 'text/xml'], 'application/json, text/html;q=0.9');

                    test.assertEqual('application/json', match);

                    test.complete();
                }
            },
            {
                name: "test ordering preference (best supported is last)",
                exec: function (test) {
                    var match1 = bestMatch(['application/json', 'application/xml'],  'application/json, application/xml');
                    var match2 = bestMatch(['application/xml', 'application/json'],  'application/json, application/xml');

                    test.assertEqual('application/json', match1);
                    test.assertEqual('application/xml', match2);

                    test.complete();
                }
            }
        ]
    });
});
