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
 * @module jazzHands.test.unit.parser.match.required
 */
define([
    "qasht/package/Unit",
    "jazzHands/parser/match/required"
], function (TestPackage, required) {
    return new TestPackage({
        module: "jazzHands/parser/match/required",
        tests: [
            {
                name: "Passed input value through",
                exec: function (test) {
                    var value = "12345";

                    test.assertEqual(value, required(value));

                    test.complete();
                }
            },
            {
                name: "Throws exception if value is null",
                exec: function (test) {
                    var message = "Pass";

                    try {
                        required(null, message);
                    } catch (err){
                        test.assertEqual(message, err.message);
                    }

                    test.complete();
                }
            }
        ]
    });
});
/*
define([
    "jazzHands/parser/exception/MissingRequired"
], function (MissingRequired) {
    /**
     * Method to be used if the parser has gone down a path where only one possibility exists, and there is a value that MUST be present to fulfill it
     * @method required
     * @param {Promise<* | null> | * | null} value - The output from another parsing function.  Will handle the promise and validate if a result was returned
     * @param {String} message - Exception message should the required attribute be mixxing
     * @return {Promise<*> | *}
     * @throws {jazzHands.parser.exception.MissingRequired}
     *
    function required(value, message) {
        if (value === null) {
            throw new MissingRequired(message);
        }
        return value;
    }
    return required;
});*/