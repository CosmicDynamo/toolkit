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
 * @module $<class>$
 */
define([
    "./utf8Encode"
], function (utf8Encode) {
    // constants [§4.2.1]
    var K = [0x5a827999, 0x6ed9eba1, 0x8f1bbcdc, 0xca62c1d6];

    /**
     * function 'f' [§4.1.1]
     */
    function f(s, x, y, z) {
        switch (s) {
            case 0:
                return (x & y) ^ (~x & z);           // Ch()
            case 1:
                return x ^ y ^ z;                    // Parity()
            case 2:
                return (x & y) ^ (x & z) ^ (y & z);  // Maj()
            case 3:
                return x ^ y ^ z;                    // Parity()
        }
    }

    /**
     * rotate left (circular left shift) value x by n positions [§3.2.5]
     */
    function ROTL(x, n) {
        return (x << n) | (x >>> (32 - n));
    }

    /**
     * hexadecimal representation of a number
     *   (note toString(16) is implementation-dependant, and
     *   in IE returns signed numbers when used on full words)
     */
    function toHexStr(n) {
        var s = "", v;
        for (var i = 7; i >= 0; i--) {
            v = (n >>> (i * 4)) & 0xf;
            s += v.toString(16);
        }
        return s;
    }

    /**
     * SHA-1 implementation in JavaScript
     * @param {String} msg - String to be hashed
     * @return {String} Hash of msg as hex character string
     */
    function hash(msg) {
        var i, t;

        // PREPROCESSING
        msg = utf8Encode(msg) + String.fromCharCode(0x80);  // add trailing '1' bit (+ 0's padding) to string [§5.1.1]

        // convert string msg into 512-bit/16-integer blocks arrays of ints [§5.2.1]
        var l = msg.length / 4 + 2;  // length (in 32-bit integers) of msg + ‘1’ + appended length
        var N = Math.ceil(l / 16);   // number of 16-integer-blocks required to hold 'l' ints
        var M = new Array(N);

        for (i = 0; i < N; i++) {
            M[i] = new Array(16);
            for (var j = 0; j < 16; j++) {  // encode 4 chars per integer, big-endian encoding
                M[i][j] = (msg.charCodeAt(i * 64 + j * 4) << 24) | (msg.charCodeAt(i * 64 + j * 4 + 1) << 16) |
                (msg.charCodeAt(i * 64 + j * 4 + 2) << 8) | (msg.charCodeAt(i * 64 + j * 4 + 3));
            } // note running off the end of msg is ok 'cos bitwise ops on NaN return 0
        }
        // add length (in bits) into final pair of 32-bit integers (big-endian) [§5.1.1]
        // note: most significant word would be (len-1)*8 >>> 32, but since JS converts
        // bitwise-op args to 32 bits, we need to simulate this by arithmetic operators
        M[N - 1][14] = ((msg.length - 1) * 8) / Math.pow(2, 32);
        M[N - 1][14] = Math.floor(M[N - 1][14]);
        M[N - 1][15] = ((msg.length - 1) * 8) & 0xffffffff;

        // set initial hash value [§5.3.1]
        var H0 = 0x67452301;
        var H1 = 0xefcdab89;
        var H2 = 0x98badcfe;
        var H3 = 0x10325476;
        var H4 = 0xc3d2e1f0;

        // HASH COMPUTATION [§6.1.2]

        var W = new Array(80);
        var a, b, c, d, e;
        for (i = 0; i < N; i++) {

            // 1 - prepare message schedule 'W'
            for (t = 0; t < 16; t++) {
                W[t] = M[i][t];
            }
            for (t = 16; t < 80; t++) {
                W[t] = ROTL(W[t - 3] ^ W[t - 8] ^ W[t - 14] ^ W[t - 16], 1);
            }

            // 2 - initialise five working variables a, b, c, d, e with previous hash value
            a = H0;
            b = H1;
            c = H2;
            d = H3;
            e = H4;

            // 3 - main loop
            for (t = 0; t < 80; t++) {
                var s = Math.floor(t / 20); // seq for blocks of 'f' functions and 'K' constants
                var T = (ROTL(a, 5) + f(s, b, c, d) + e + K[s] + W[t]) & 0xffffffff;
                e = d;
                d = c;
                c = ROTL(b, 30);
                b = a;
                a = T;
            }

            // 4 - compute the new intermediate hash value
            H0 = (H0 + a) & 0xffffffff;  // note 'addition modulo 2^32'
            H1 = (H1 + b) & 0xffffffff;
            H2 = (H2 + c) & 0xffffffff;
            H3 = (H3 + d) & 0xffffffff;
            H4 = (H4 + e) & 0xffffffff;
        }

        return toHexStr(H0) + toHexStr(H1) + toHexStr(H2) + toHexStr(H3) + toHexStr(H4);
    }

    return hash;
});