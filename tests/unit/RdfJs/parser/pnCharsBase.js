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
 * @module jazzHands.test.unit.parser.match.pnCharsBase
 */
define([
    "qasht/package/Unit",
    "RdfJs/parser/pnCharsBase",
    "blocks/parser/Data"
], function (TestPackage, pnCharsBase, Data) {
    return new TestPackage({
        module: "RdfJs/parser/pnCharsBase",
        tests: [
            {
                name: "Handles Lower Case Alpha Chars",
                setUp: function (test) {
                    var char = "a";
                    while (char <= "z") {
                        test.data.input += char;
                        char++;
                    }
                },
                exec: function (test) {
                    for (var idx = 0; idx < test.data.input.length; idx++) {
                        test.assertEqual(test.data.input[idx], pnCharsBase(test.data));
                    }

                    test.assertTrue(test.data.isEnd(), "Progressed to the end of the string");

                    test.complete();
                }
            },
            {
                name: "Handles Upper Case Alpha Chars",
                setUp: function (test) {
                    var char = "A";
                    while (char <= "Z") {
                        test.data.input += char;
                        char++;
                    }
                },
                exec: function (test) {
                    for (var idx = 0; idx < test.data.input.length; idx++) {
                        test.assertEqual(test.data.input[idx], pnCharsBase(test.data));
                    }

                    test.assertTrue(test.data.isEnd(), "Progressed to the end of the string");

                    test.complete();
                }
            },
            {
                name: "Handles 0x00C0-0x00D6",
                setUp: function (test) {
                    var char = 0x00C0;
                    while (char <= 0x00D6) {
                        test.data.input += String.fromCharCode(char);
                        char++;
                    }
                    test.data.input += String.fromCharCode(0x00D7);
                    test.data.input += String.fromCharCode(0x00BF);
                },
                exec: function (test) {
                    for (var idx = 0; idx < test.data.input.length - 2; idx++) {
                        test.assertEqual(test.data.input[idx], pnCharsBase(test.data));
                    }

                    test.assertNull(pnCharsBase(test.data), "Upper Bounds Test");
                    test.data.pos++;

                    test.assertNull(pnCharsBase(test.data), "Lower Bounds Test");
                    test.data.pos++;

                    test.assertTrue(test.data.isEnd(), "Progressed to the end of the string");

                    test.complete();
                }
            },
            {
                name: "Handles 0x00D8-0x00F6",
                setUp: function (test) {
                    var char = 0x00D8;
                    while (char <= 0x00F6) {
                        test.data.input += String.fromCharCode(char);
                        char++;
                    }
                    test.data.input += String.fromCharCode(0x00F7);
                    test.data.input += String.fromCharCode(0x00D7);
                },
                exec: function (test) {
                    for (var idx = 0; idx < test.data.input.length - 2; idx++) {
                        test.assertEqual(test.data.input[idx], pnCharsBase(test.data));
                    }

                    test.assertNull(pnCharsBase(test.data), "Upper Bounds Test");
                    test.data.pos++;

                    test.assertNull(pnCharsBase(test.data), "Lower Bounds Test");
                    test.data.pos++;

                    test.assertTrue(test.data.isEnd(), "Progressed to the end of the string");

                    test.complete();
                }
            },
            {
                name: "Handles 0x00F8-0x02FF",
                setUp: function (test) {
                    var char = 0x00F8;
                    while (char <= 0x02FF) {
                        test.data.input += String.fromCharCode(char);
                        char++;
                    }
                    test.data.input += String.fromCharCode(0x0300);
                    test.data.input += String.fromCharCode(0x00F7);
                },
                exec: function (test) {
                    for (var idx = 0; idx < test.data.input.length - 2; idx++) {
                        test.assertEqual(test.data.input[idx], pnCharsBase(test.data));
                    }

                    test.assertNull(pnCharsBase(test.data), "Upper Bounds Test");
                    test.data.pos++;

                    test.assertNull(pnCharsBase(test.data), "Lower Bounds Test");
                    test.data.pos++;

                    test.assertTrue(test.data.isEnd(), "Progressed to the end of the string");

                    test.complete();
                }
            },
            {
                name: "Handles 0x0370-0x037D",
                setUp: function (test) {
                    var char = 0x0370;
                    while (char <= 0x037D) {
                        test.data.input += String.fromCharCode(char);
                        char++;
                    }
                    test.data.input += String.fromCharCode(0x037E);
                    test.data.input += String.fromCharCode(0x036F);
                },
                exec: function (test) {
                    for (var idx = 0; idx < test.data.input.length - 2; idx++) {
                        test.assertEqual(test.data.input[idx], pnCharsBase(test.data));
                    }

                    test.assertNull(pnCharsBase(test.data), "Upper Bounds Test");
                    test.data.pos++;

                    test.assertNull(pnCharsBase(test.data), "Lower Bounds Test");
                    test.data.pos++;

                    test.assertTrue(test.data.isEnd(), "Progressed to the end of the string");

                    test.complete();
                }
            },
            {
                name: "Handles 0x037F-0x1FFF",
                setUp: function (test) {
                    var char = 0x037F;
                    while (char <= 0x1FFF) {
                        test.data.input += String.fromCharCode(char);
                        char += 2;
                    }
                    test.data.input += String.fromCharCode(0x2000);
                    test.data.input += String.fromCharCode(0x037E);
                },
                exec: function (test) {
                    for (var idx = 0; idx < test.data.input.length - 2; idx++) {
                        test.assertEqual(test.data.input[idx], pnCharsBase(test.data));
                    }

                    test.assertNull(pnCharsBase(test.data), "Upper Bounds Test");
                    test.data.pos++;

                    test.assertNull(pnCharsBase(test.data), "Lower Bounds Test");
                    test.data.pos++;

                    test.assertTrue(test.data.isEnd(), "Progressed to the end of the string");

                    test.complete();
                }
            },
            {
                name: "Handles 0x200C-0x200D",
                setUp: function (test) {
                    var char = 0x200C;
                    while (char <= 0x200D) {
                        test.data.input += String.fromCharCode(char);
                        char++;
                    }
                    test.data.input += String.fromCharCode(0x200E);
                    test.data.input += String.fromCharCode(0x200B);
                },
                exec: function (test) {
                    for (var idx = 0; idx < test.data.input.length - 2; idx++) {
                        test.assertEqual(test.data.input[idx], pnCharsBase(test.data));
                    }

                    test.assertNull(pnCharsBase(test.data), "Upper Bounds Test");
                    test.data.pos++;

                    test.assertNull(pnCharsBase(test.data), "Lower Bounds Test");
                    test.data.pos++;

                    test.assertTrue(test.data.isEnd(), "Progressed to the end of the string");

                    test.complete();
                }
            },
            {
                name: "Handles 0x2070-0x218F",
                setUp: function (test) {
                    var char = 0x2070;
                    while (char <= 0x218F) {
                        test.data.input += String.fromCharCode(char);
                        char++;
                    }
                    test.data.input += String.fromCharCode(0x2190);
                    test.data.input += String.fromCharCode(0x206F);
                },
                exec: function (test) {
                    for (var idx = 0; idx < test.data.input.length - 2; idx++) {
                        test.assertEqual(test.data.input[idx], pnCharsBase(test.data));
                    }

                    test.assertNull(pnCharsBase(test.data), "Upper Bounds Test");
                    test.data.pos++;

                    test.assertNull(pnCharsBase(test.data), "Lower Bounds Test");
                    test.data.pos++;

                    test.assertTrue(test.data.isEnd(), "Progressed to the end of the string");

                    test.complete();
                }
            },
            {
                name: "Handles 0x2C00-0x2FEF",
                setUp: function (test) {
                    var char = 0x2C00;
                    while (char <= 0x2FEF) {
                        test.data.input += String.fromCharCode(char);
                        char++;
                    }
                    test.data.input += String.fromCharCode(0x2FF0);
                    test.data.input += String.fromCharCode(0x2BFF);
                },
                exec: function (test) {
                    for (var idx = 0; idx < test.data.input.length - 2; idx++) {
                        test.assertEqual(test.data.input[idx], pnCharsBase(test.data));
                    }

                    test.assertNull(pnCharsBase(test.data), "Upper Bounds Test");
                    test.data.pos++;

                    test.assertNull(pnCharsBase(test.data), "Lower Bounds Test");
                    test.data.pos++;

                    test.assertTrue(test.data.isEnd(), "Progressed to the end of the string");

                    test.complete();
                }
            },
            {
                name: "Handles 0x3001-0xD7FF",
                setUp: function (test) {
                    var char = 0x3001;
                    while (char <= 0xD7FF) {
                        test.data.input += String.fromCharCode(char);
                        char += 4;
                    }
                    test.data.input += String.fromCharCode(0xD800);
                    test.data.input += String.fromCharCode(0x3000);
                },
                exec: function (test) {
                    for (var idx = 0; idx < test.data.input.length - 2; idx++) {
                        test.assertEqual(test.data.input[idx], pnCharsBase(test.data));
                    }

                    test.assertNull(pnCharsBase(test.data), "Upper Bounds Test");
                    test.data.pos++;

                    test.assertNull(pnCharsBase(test.data), "Lower Bounds Test");
                    test.data.pos++;

                    test.assertTrue(test.data.isEnd(), "Progressed to the end of the string");

                    test.complete();
                }
            },
            {
                name: "Handles 0xF900-0xFDCF",
                setUp: function (test) {
                    var char = 0xF900;
                    while (char <= 0xFDCF) {
                        test.data.input += String.fromCharCode(char);
                        char += 2;
                    }
                    test.data.input += String.fromCharCode(0xFDD0);
                    test.data.input += String.fromCharCode(0xF8FF);
                },
                exec: function (test) {
                    for (var idx = 0; idx < test.data.input.length - 2; idx++) {
                        test.assertEqual(test.data.input[idx], pnCharsBase(test.data));
                    }

                    test.assertNull(pnCharsBase(test.data), "Upper Bounds Test");
                    test.data.pos++;

                    test.assertNull(pnCharsBase(test.data), "Lower Bounds Test");
                    test.data.pos++;

                    test.assertTrue(test.data.isEnd(), "Progressed to the end of the string");

                    test.complete();
                }
            },
            {
                name: "Handles 0xFDF0-0xFFFD",
                setUp: function (test) {
                    var char = 0xFDF0;
                    while (char <= 0xFFFD) {
                        test.data.input += String.fromCharCode(char);
                        char++;
                    }
                    test.data.input += String.fromCharCode(0xFFFE);
                    test.data.input += String.fromCharCode(0xFDEF);
                },
                exec: function (test) {
                    for (var idx = 0; idx < test.data.input.length - 2; idx++) {
                        test.assertEqual(test.data.input[idx], pnCharsBase(test.data));
                    }

                    test.assertNull(pnCharsBase(test.data), "Upper Bounds Test");
                    test.data.pos++;

                    test.assertNull(pnCharsBase(test.data), "Lower Bounds Test");
                    test.data.pos++;

                    test.assertTrue(test.data.isEnd(), "Progressed to the end of the string");

                    test.complete();
                }
            },
            {
                name: "Handles 0x10000-0xEFFFF",
                setUp: function (test) {
                    var char = 0x10000;
                    while (char <= 0xEFFFF) {
                        var value = char - 0x10000;
                        test.data.input += String.fromCharCode(((value >>> 10) & 0x3FF) | 0xD800);
                        value = 0xDC00 | (value & 0x3FF);

                        test.data.input += String.fromCharCode(value);

                        char += 100;
                    }

                    char = 0xF0000;
                    value = char - 0x10000;
                    test.data.input += String.fromCharCode(((value >>> 10) & 0x3FF) | 0xD800);
                    value = 0xDC00 | (value & 0x3FF);
                    test.data.input += String.fromCharCode(value);

                    test.data.input += String.fromCharCode(0xFFFF);
                },
                exec: function (test) {
                    for (var idx = 0; idx < test.data.input.length - 3; idx += 2) {
                        test.assertEqual(test.data.input.substr(idx, 2), pnCharsBase(test.data));
                    }

                    test.assertNull(pnCharsBase(test.data), "Upper Bounds Test (2ch ASCII)");
                    test.data.pos++;
                    test.assertNull(pnCharsBase(test.data), "Upper Bounds Test (2ch ASCII)");
                    test.data.pos++;

                    test.assertNull(pnCharsBase(test.data), "Lower Bounds Test");
                    test.data.pos++;

                    test.assertTrue(test.data.isEnd(), "Progressed to the end of the string");

                    test.complete();
                }
            }
        ],
        setUp: function (test) {
            test.data = new Data({
                input: ""
            });
        }
    });
});