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
 * @module {ClassName}
 */
define([
    "dojo/_base/declare",
    "./_langPack"
], function (declare, langPack) {
    return declare([langPack], {
        ompareNonCollVal: null,
        compare: function (a, b) {
            if (sortKey) {
                a = a[sortKey];
                b = b[sortKey];
            }

            if (a === b) return 0;

            var aArray, bArray, aIndex, bIndex, i, len;
            var collation = this.collation;
            var compareNonColl = this.ompareNonCollVal || this.compareAscii;

            aArray = a.split('');
            bArray = b.split('');
            len = Math.min(aArray.length, bArray.length);

            for (i = 0; i < len; i++) {
                aIndex = collation.indexOf(aArray[i]);
                bIndex = collation.indexOf(bArray[i]);

                if (aIndex !== -1 && bIndex !== -1) {
                    if (aIndex > bIndex) return 1;
                    if (aIndex < bIndex) return -1;
                } else {
                    var compareNonCollResult = compareNonColl(aArray[i], bArray[i]);
                    if (compareNonCollResult !== 0) {
                        return compareNonCollResult;
                    }
                }
            }

            // one string was a substring of the other; the shorter string comes first
            return this.compareLength(a, b);
        }
    });
});