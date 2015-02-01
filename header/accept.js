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
 * @module core.headers.accept
 */
define([
    "./MimeType"
], function(MimeType) {
    /**
     * Carves up a mime-type and returns its details
     * @param {String} mimeType
     * @return {MimeType}
     * @example:
     * input:  "application/xhtml;q=0.5"
     * return {
     *    type: "application",
     *    subtype: "xhtml",
     *    param: { q: 0.5 }
     * }
     */
    function parseMimeType(mimeType) {
        var fullType, typeParts
            , params ={ q: 1 }
            , parts = mimeType.split(';');
        parts.forEach(function(part){
            var p = part.split('=');
            if (p.length == 2) {
                params[p[0].trim()] = p[1].trim();
            }
        });

        fullType = parts[0].trim();

        typeParts = fullType.split('/');
        return new MimeType(typeParts[0],typeParts[1], params);
    }
    /**
     * Find the best match for a given mime-type against a list of media ranges
     * @param {String} mimeType
     * @param {MimeType[]} parsedRanges
     * @return {{mimeType: String, fitness: Number, q: Number }}
     */
    function parseFitnessAndQuality (mimeType, parsedRanges) {
        var target = parseMimeType(mimeType);
        var best = {
            mimeType:mimeType,
            fitness:-1,
            q:0
        };

        var tParam = target.param.keys().filter(function(key){return key != 'q';});

        parsedRanges.filter(function(parsed){
            return (parsed.type == target.type || parsed.type == "*") &&
                   (parsed.subtype == target.subtype || parsed.subtype == "*")
        }).forEach(function(parsed){
            var matchCount = tParam.filter(function(key){
                return parsed.param.get(key) == target.param.get(key);
            }).length;

            var fitness = (parsed.type == target.type || parsed.type == "*") ? 100 : 0;
            fitness += (parsed.subtype == target.subtype || parsed.subtype == "*") ? 10 : 0;
            fitness += matchCount;

            if (fitness > best.fitness) {
                best.fitness = fitness;
                best.q = parseFloat(parsed.param.get('q'));
            }
        });

        return best;
    }

    /**
     * Parses a command-delimited list of mime-types
     * @pram {String} ranges
     * @return {MimeType[]}
     */
    function parseRanges(ranges) {
        return ranges.split(",").map(function(range){
            return parseMimeType(range);
        });
    }

    /**
     *Takes a list of supported mime-types and finds the best match for all the media-ranges listed in header
     * @param {String[]} supported - List of supported mime-types
     * @param {String} header - the header being parsed
     * @return {String | undefined}
     */
    function bestMatch(supported, header) {
        var parsedHeader = parseRanges(header);

        return supported.map(function(mimeType){
            return parseFitnessAndQuality(mimeType, parsedHeader);
        }).filter(function(mimeType){
            return mimeType.fitness > 0;
        }).sort(function(comp, to){
            return comp.q < to.q;
        })[0];
    }
    return bestMatch;
});