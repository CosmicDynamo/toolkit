/**
 * @copyright
 * The MIT License (MIT)
 *
 * Copyright (c) 2014-2015 Cosmic Dynamo LLC
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
 * @module blocks.test.unit.Container
 */
define([
    "qasht/package/Unit",
    "blocks/Container"
], function (TestPackage, Container) {
    return new TestPackage({
        module: "blocks/Container",
        tests: [
            {
                name: "get/set: Able to set a value and re-get it",
                exec: function (test) {
                    var v1 = "A String";
                    var v2 = { an: "Object"};

                    test.assertNull(test.container.get("field1"), "Does not have a value before it is set");
                    test.assertNull(test.container.get("field2"), "Does not have a value before it is set");

                    test.container.set("field1", v1);
                    test.container.set("field2", v2);

                    test.assertEqual(v1, test.container.get("field1"), "Is now set to new value");
                    test.assertEqual(v2, test.container.get("field2"), "Is now set to new value");

                    test.complete();
                }
            },
            {
                name: "keys: returns the list of names in this Container",
                exec: function (test) {
                    test.assertEqual(0, test.container.keys().length, "Returns empty array before data is added");

                    test.container.set("aColumn1", "value");
                    test.container.set("aColumn2", "value");
                    test.container.set("aColumn3", "value");
                    test.container.set("aColumn4", "value");
                    test.container.set("aColumn4", "SetAgain");

                    var columns = test.container.keys();

                    test.assertEqual(4, columns.length, "Four Values were added");
                    var values = {};
                    columns.forEach(function (name) {
                        values[name] = true;
                    });

                    test.assertTrue(values["aColumn1"], "Expected value Found");
                    test.assertTrue(values["aColumn2"], "Expected value Found");
                    test.assertTrue(values["aColumn3"], "Expected value Found");
                    test.assertTrue(values["aColumn4"], "Expected value Found");

                    test.complete();
                }
            }
        ],
        setUp: function (test) {
            test.container = new Container();
        }
    });
});