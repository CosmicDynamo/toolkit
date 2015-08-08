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
 * @module jazzHands.query.function.uuid
 */
define([
    "RdfJs/node/Literal",
    "blocks/string/sha1Hash"
], function (LiteralNode, sha1Hash) {
    var global = this;

    /**
     * Returns a new Literal node with a UUID
     * @return {RdfJs.node.Literal<Boolean>}
     * @throws err:FORG0006, Invalid argument type
     */
    function struuid(v4) {
        var value = 'xxxxxxxxxxxx4xxxyxxxxxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
            var r = Math.random() * 16 | 0,
                v = c === 'x' ? r : (r & 0x3 | 0x8);
            return v.toString(16);
        });

        if (!v4) {
            // Binary Value
            var binary = '';
            for (var i = 0; i < value.length; i += 2) {	// Convert each character to a bit
                binary += String.fromCharCode(parseInt(value.charAt(i) + value.charAt(i + 1), 16));
            }

            var domain = (global.location || "http://example.com").toString();
            var hash = sha1Hash(binary + domain);
            value = hash.substring(0, 8) +	//8 digits
            '-' + hash.substring(8, 12) + //4 digits
//			// four most significant bits holds version number 5
            '-' + ((parseInt(hash.substring(12, 16), 16) & 0x0fff) | 0x5000).toString(16) +
//			// two most significant bits holds zero and one for variant DCE1.1
            '-' + ((parseInt(hash.substring(16, 20), 16) & 0x3fff) | 0x8000).toString(16) +
            '-' + hash.substring(20, 32);	//12 digits
        }

        return new LiteralNode(value, null, null);
    }

    return struuid;
});