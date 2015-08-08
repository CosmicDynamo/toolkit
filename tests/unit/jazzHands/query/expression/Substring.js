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
 * @module jazzHands.test.unit.query.expression.Substring
 */
define([
    "qasht/package/Unit",
    "jazzHands/query/expression/Substring",
    "RdfJs/test/fake/Node"
], function (TestPackage, Substring, Node) {
    return new TestPackage({
        module: "jazzHands/query/expression/Substring",
        tests: [
            {
                name: "string,length: returns substring",
                setUp: function(test){
                    test.string = new Node('"motor car"');
                    test.start = new Node('"6"^^<http://www.w3.org/2001/XMLSchema#integer>');
                    test.length = null;
                    test.expr.length = null;

                    test.expected = new Node('" car"^^<http://www.w3.org/2001/XMLSchema#string>');
                },
                exec: function (test) {
                    var rtn = test.expr.resolve(test.dataRow);

                    Node.testApi(rtn, test);
                    test.assertEqual(test.expected, rtn);

                    test.complete();
                }
            },
            {
                name: "string,length: returns substring",
                setUp: function(test){
                    test.string = new Node('"metadata"');
                    test.start = new Node('"4"^^<http://www.w3.org/2001/XMLSchema#integer>');
                    test.length = new Node('"3"^^<http://www.w3.org/2001/XMLSchema#integer>');

                    test.expected = new Node('"ada"^^<http://www.w3.org/2001/XMLSchema#string>');
                },
                exec: function (test) {
                    var rtn = test.expr.resolve(test.dataRow);

                    Node.testApi(rtn, test);
                    test.assertEqual(test.expected, rtn);

                    test.complete();
                }
            },
            {
                name: "string,length: returns substring",
                setUp: function(test){
                    test.string = new Node('"12345"');
                    test.start = new Node('"1.5"^^<http://www.w3.org/2001/XMLSchema#float>');
                    test.length = new Node('"2.6"^^<http://www.w3.org/2001/XMLSchema#float>');

                    test.expected = new Node('"234"^^<http://www.w3.org/2001/XMLSchema#string>');
                },
                exec: function (test) {
                    var rtn = test.expr.resolve(test.dataRow);

                    Node.testApi(rtn, test);
                    test.assertEqual(test.expected, rtn);

                    test.complete();
                }
            },
            {
                name: "string,length: returns substring",
                setUp: function(test){
                    test.string = new Node('"12345"');
                    test.start = new Node('"0"^^<http://www.w3.org/2001/XMLSchema#integer>');
                    test.length = new Node('"3"^^<http://www.w3.org/2001/XMLSchema#integer>');

                    test.expected = new Node('"12"^^<http://www.w3.org/2001/XMLSchema#string>');
                },
                exec: function (test) {
                    var rtn = test.expr.resolve(test.dataRow);

                    Node.testApi(rtn, test);
                    test.assertEqual(test.expected, rtn);

                    test.complete();
                }
            },
            {
                name: "string,length: returns substring",
                setUp: function(test){
                    test.string = new Node('"12345"');
                    test.start = new Node('"5"^^<http://www.w3.org/2001/XMLSchema#integer>');
                    test.length = new Node('"-3"^^<http://www.w3.org/2001/XMLSchema#integer>');

                    test.expected = new Node('""^^<http://www.w3.org/2001/XMLSchema#string>');
                },
                exec: function (test) {
                    var rtn = test.expr.resolve(test.dataRow);

                    Node.testApi(rtn, test);
                    test.assertEqual(test.expected, rtn);

                    test.complete();
                }
            },
            {
                name: "string,length: returns substring",
                setUp: function(test){
                    test.string = new Node('"12345"');
                    test.start = new Node('"-3"^^<http://www.w3.org/2001/XMLSchema#integer>');
                    test.length = new Node('"5"^^<http://www.w3.org/2001/XMLSchema#integer>');

                    test.expected = new Node('"1"^^<http://www.w3.org/2001/XMLSchema#string>');
                },
                exec: function (test) {
                    var rtn = test.expr.resolve(test.dataRow);

                    Node.testApi(rtn, test);
                    test.assertEqual(test.expected, rtn);

                    test.complete();
                }
            },
            {
                name: "string,length: returns substring",
                setUp: function(test){
                    test.string = new Node('"12345"');
                    test.start = new Node('"NaN"^^<http://www.w3.org/2001/XMLSchema#integer>');
                    test.length = new Node('"3"^^<http://www.w3.org/2001/XMLSchema#integer>');

                    test.expected = new Node('""^^<http://www.w3.org/2001/XMLSchema#string>');
                },
                exec: function (test) {
                    var rtn = test.expr.resolve(test.dataRow);

                    Node.testApi(rtn, test);
                    test.assertEqual(test.expected, rtn);

                    test.complete();
                }
            },
            {
                name: "string,length: returns substring",
                setUp: function(test){
                    test.string = new Node('"12345"');
                    test.start = new Node('"1"^^<http://www.w3.org/2001/XMLSchema#integer>');
                    test.length = new Node('"NaN"^^<http://www.w3.org/2001/XMLSchema#integer>');

                    test.expected = new Node('""^^<http://www.w3.org/2001/XMLSchema#string>');
                },
                exec: function (test) {
                    var rtn = test.expr.resolve(test.dataRow);

                    Node.testApi(rtn, test);
                    test.assertEqual(test.expected, rtn);

                    test.complete();
                }
            },
            {
                name: "string,length: returns substring",
                setUp: function(test){
                    test.string = new Node('"12345"');
                    test.start = new Node('"-42"^^<http://www.w3.org/2001/XMLSchema#integer>');
                    test.length = new Node('"INF"^^<http://www.w3.org/2001/XMLSchema#integer>');

                    test.expected = new Node('"12345"^^<http://www.w3.org/2001/XMLSchema#string>');
                },
                exec: function (test) {
                    var rtn = test.expr.resolve(test.dataRow);

                    Node.testApi(rtn, test);
                    test.assertEqual(test.expected, rtn);

                    test.complete();
                }
            },
            {
                name: "string,length: returns substring",
                setUp: function(test){
                    test.string = new Node('"12345"');
                    test.start = new Node('"-INF"^^<http://www.w3.org/2001/XMLSchema#integer>');
                    test.length = new Node('"INF"^^<http://www.w3.org/2001/XMLSchema#integer>');

                    test.expected = new Node('""^^<http://www.w3.org/2001/XMLSchema#string>');
                },
                exec: function (test) {
                    var rtn = test.expr.resolve(test.dataRow);

                    Node.testApi(rtn, test);
                    test.assertEqual(test.expected, rtn);

                    test.complete();
                }
            }
        ],
        setUp: function(test){
            test.dataRow = {
                "string":test.string,
                "length":test.length,
                "start":test.start
            };
            test.expr = new Substring({
                string: {
                    resolve: function(obj){
                        test.assertEqual(test.dataRow, obj);
                        return test.string;
                    }
                },
                start: {
                    resolve: function(obj){
                        test.assertEqual(test.dataRow, obj);
                        return test.start;
                    }
                },
                length: {
                    resolve: function(obj){
                        test.assertEqual(test.dataRow, obj);
                        return test.length;
                    }
                }
            })
        }
    });
});