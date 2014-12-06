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
 * @module core.test.unit.converter
 */
define([
    "qasht/package/Unit",
    "core/convert",
    "RdfJs/test/fake/Node"
], function (TestPackage, convert) {
    return new TestPackage({
        module: "core/convert",
        tests: [
            {
                name: "API",
                exec: function (test) {
                    test.assertIsFunction(convert, "Converter is a Function");
                    test.assertIsFunction(convert.register, "Converter.register is a Function");
                    test.assertIsFunction(convert.deregister, "Converter.parse is a Function");

                    test.complete();
                }
            },
            {
                name: "parse: returns null if no available parser found",
                exec: function(test){
                    var out = convert("Invalid", "NotReal");
                    test.assertNull(out);

                    test.complete();
                }
            },
            {
                name: "deregister: removes a serializer to the converter",
                exec: function(test){
                    var data = "This is some data";
                    var promise = convert("application/test", "RdfGraph", data);
                    test.whenResolved(promise, function(rtn){
                        test.assertEqual("Test->RdfGraph: " + data, rtn);
                        convert.deregister({
                            "1": "application/test",
                            "2": "RdfGraph",
                            "1-2":true
                        });
                        var empty = convert("application/test", "RdfGraph", data);
                        test.assertNull(empty, "Did not convert value");

                        test.complete();
                    });
                }
            },
            {
                name: "parse: will run registered From X to Y parser",
                exec: function(test){
                    var data = "This is some data";
                    var promise = convert("application/test", "RdfGraph", data);
                    test.whenResolved(promise, function(rtn){
                        test.assertEqual("Test->RdfGraph: " + data, rtn);

                        test.complete();
                    });
                }
            },
            {
                name: "parse: understands Content-Type Header style from value",
                exec: function(test){
                    var data = "Some Different Data";
                    var promise = convert("application/ld+json; charset=UTF-1234", "RdfGraph", data);
                    test.whenResolved(promise, function(rtn){
                        test.assertEqual("JSON-LD(charset is UTF-1234)->RdfGraph: " + data, rtn);

                        test.complete();
                    });
                }
            },
            {
                name: "parse: understands Accept Header style to value",
                exec: function(test){
                    var data = "And More Data";
                    var promise1 = convert("RdfGraph", "text/*; q=0.5, application/non+exist, application/*; q=0.8", data);
                    var promise2 = convert("RdfGraph", "text/*, application/*; q=0.5", data);
                    test.whenResolved(promise1, function(rtn1){
                        test.assertEqual("RdfGraph->JSON-LD: " + data, rtn1);

                        test.whenResolved(promise2, function(rtn2){
                            test.assertEqual("RdfGraph->turtle: " + data, rtn2);

                            test.complete();
                        });
                    });
                }
            }
        ],
        setUp: function (test) {
            convert.register({
                    "type1": "application/test",
                    "type2": "RdfGraph",
                    "type3":"application/ld+json",
                    "type4":"text/turtle",
                    "type1-type2":"core/test/unit/resource/test-rdf",
                    "type2-type1":"core/test/unit/resource/rdf-test",
                    "type3-type2":"core/test/unit/resource/jsonld-rdf",
                    "type2-type3":"core/test/unit/resource/rdf-jsonld",
                    "type2-type4":"core/test/unit/resource/rdf-turtle"
            });
        },
        tearDown: function (test) {
            convert.deregister({
                "type1": "application/test",
                "type2": "RdfGraph",
                "type3":"application/ld+json",
                "type4":"text/turtle",
                "type1-type2":true,
                "type2-type1":true,
                "type3-type2":true,
                "type4-type2":true
            })
        }
    });
});