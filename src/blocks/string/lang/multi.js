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
    "./single"
], function (declare, single) {
    return declare([single], {
        ompareNonCollVal: null,
        compare: function (a, b) {
            if (sortKey) {
                a = a[sortKey];
                b = b[sortKey];
            }

            if (a === b) return 0;

            var multiPointIndexes = {}, multiSearch = false, aArray, bArray, i, length,
                aHashPoint = -1, bHashPoint = -1, aIndex = -1, bIndex = -1, collationLen = lasca.language.collationLength,
                collation = lasca.language.collation, aI = 0, bI = 0;
            var collationPosition = function (c) {
                for (var i = 0; i < collationLen; i++)
                    if (collation[i] === c) return i;

                return -1;
            };

            multiPointIndexes.a = {};
            multiPointIndexes.b = {};

            var findMultiPointLetters = function () {
                var multiLetters = lasca.language.multiLetters, i = 0, length = multiLetters.length;

                /*
                 * TODO: we might need to skip sub strings of previous matches
                 * if they are within the same range in the string. depends on
                 * a, b comapre implementation below and language variations
                 */
                for (i; i < length; i++) {
                    aIndex = a.indexOf(multiLetters[i].codePoints);
                    bIndex = b.indexOf(multiLetters[i].codePoints);

                    if (aIndex !== -1) {
                        multiPointIndexes.a[aIndex] = multiLetters[i].collationWeight;
                        multiSearch = true;
                    }
                    if (bIndex !== -1) {
                        multiPointIndexes.b[bIndex] = multiLetters[i].collationWeight;
                        multiSearch = true;
                    }

                    aIndex = -1;
                    bIndex = -1;
                }
            };

            findMultiPointLetters();

            if (!multiSearch) {
                return this.inherited(arguments);
            }
            aArray = a.split('');
            bArray = b.split('');
            length = Math.min(aArray.length, bArray.length);
            var compareNonColl = this.ompareNonCollVal || this.compareAscii;

            for (i = 0; i < length; i++) {
                aHashPoint = multiPointIndexes.a[i];
                bHashPoint = multiPointIndexes.b[i];

                aIndex = (aHashPoint && aHashPoint !== -1) ? aHashPoint : collationPosition(aArray[i]);
                bIndex = (bHashPoint && bHashPoint !== -1) ? bHashPoint : collationPosition(bArray[i]);

                if (aIndex !== -1 && bIndex !== -1) {
                    if (aIndex > bIndex) {
                        return 1;
                    }
                    if (aIndex < bIndex) {
                        return -1;
                    }
                } else {
                    var compareNonCollResult = compareNonColl(aArray[i], bArray[i]);
                    if (compareNonCollResult !== 0) {
                        return compareNonCollResult;
                    }
                }

                // TODO: skipping ahead might be necessary
                if (aHashPoint !== -1 || bHashPoint !== -1) {
                    if (aHashPoint !== -1) {
                        aI += collation[aHashPoint].length;
                    }
                    if (bHashPoint !== -1) {
                        bI += collation[bHashPoint].length;
                    }
                } else {
                    aI++;
                    bI++;
                }

                aHashPoint = -1;
                bHashPoint = -1;

                // one string was a substring of the other; the shorter string comes first
                return this.compareLength(a, b);
            }
        }
    });
});