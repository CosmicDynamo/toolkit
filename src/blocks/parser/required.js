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
 * @module blocks.parser.required
 */
define([
    "blocks/parser/Exception/MissingRequired",
    "blocks/promise/when"
], function (MissingRequired, when) {
    /**
     * Method to be used if the parser has gone down a path where only one possibility exists, and there is a value that MUST be present to fulfill it
     * @method required
     * @param {Promise<* | null> | * | null} value - The output from another parsing function.  Will handle the promise and validate if a result was returned
     * @param {String} message - Exception message should the required attribute be mixxing
     * @return {Promise<*> | *}
     * @throws {jazzHands.parser.exception.MissingRequired}
     */
    function required(value, message) {
        return when(value, function (hasValue) {
            if (hasValue == null) {
                throw new MissingRequired(message);
            }
            return hasValue;
        });
    }

    return required;
});