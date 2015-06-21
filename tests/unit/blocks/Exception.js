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
 * @module $<class>$
 */
define([
    "qasht/package/Unit",
    "blocks/Exception"
], function (TestPackage, Exception) {
    return new TestPackage({
        module: "blocks/Exception",
        tests: [
            {
                name: "ctor: message and error code are attached to Exception",
                setUp: function (test) {
                    test.exp = new Exception("This is a Test", 1234);
                },
                exec: function (test) {
                    test.assertEqual("This is a Test", test.exp.message);
                    //test.assertEqual(1234, test.exp.code);

                    test.complete();
                }
            }
        ]
    });
});