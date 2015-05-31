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
 * @module RdfJs.node.Literal
 */
define([
    "dojo/_base/declare",
    "dojo/date/stamp",
    "./_Node"
], function (declare, stamp, _Node) {
    /* Implementation of <http://www.w3.org/TR/rdf-interfaces/#idl-def-Literal> */

    //Maps xsd: datatype to javascript datatypes, could be extended to include other types
    var typeMap = {
        "http://www.w3.org/2001/XMLSchema#string": "string",
        "http://www.w3.org/2001/XMLSchema#boolean": "boolean",
        "http://www.w3.org/2001/XMLSchema#dateTime": "iso8601",
        "http://www.w3.org/2001/XMLSchema#date": "iso8601",
        "http://www.w3.org/2001/XMLSchema#time": "iso8601", //TODO: validate
        "http://www.w3.org/2001/XMLSchema#int": "int",
        "http://www.w3.org/2001/XMLSchema#double": "float",
        "http://www.w3.org/2001/XMLSchema#float": "float",
        "http://www.w3.org/2001/XMLSchema#decimal": "float",
        "http://www.w3.org/2001/XMLSchema#positiveInteger": "int",
        "http://www.w3.org/2001/XMLSchema#integer": "int",
        "http://www.w3.org/2001/XMLSchema#nonPositiveInteger": "int",
        "http://www.w3.org/2001/XMLSchema#negativeInteger": "int",
        "http://www.w3.org/2001/XMLSchema#long": "int",
        "http://www.w3.org/2001/XMLSchema#short": "int",
        "http://www.w3.org/2001/XMLSchema#byte": "int",
        "http://www.w3.org/2001/XMLSchema#nonNegativeInteger": "int",
        "http://www.w3.org/2001/XMLSchema#unsignedLong": "int",
        "http://www.w3.org/2001/XMLSchema#unsignedInt": "int",
        "http://www.w3.org/2001/XMLSchema#unsignedShort": "int",
        "http://www.w3.org/2001/XMLSchema#unsignedByte": "int"
    };

    return declare([_Node], {
        interfaceName: "Literal",
        language: null,
        datatype: null,
        constructor: function (value, language, dataType) {
            var lNode = this;
            lNode.language = value.language || language;
            lNode.datatype = value.datatype || dataType;
        },
        toString: function () {
            /* http://www.w3.org/TR/rdf-interfaces/#widl-RDFNode-toString-DOMString */
            var tmp = '"' + this.nominalValue + '"';
            if (this.language != null) {
                tmp = tmp + "@" + this.language;
            } else if (this.datatype != null) {
                tmp += "^^<" + this.datatype + ">";
            }

            return tmp;
        },
        valueOf: function () {
            /* http://www.w3.org/TR/rdf-interfaces/#widl-RDFNode-valueOf-any */
            var nValue = this.nominalValue;
            if (this.datatype == null) {
                return nValue;
            }

            //TODO: Create a base set of primitive to/from xsd type converters
            //TODO:   Then update this code to just call off to the converter
            if (typeMap[this.datatype]) {
                switch (typeMap[this.datatype]) {
                    case "int":
                        return this._numeric(nValue, parseInt);
                    case "float":
                        return this._numeric(nValue, parseFloat);
                    case "iso8601":
                        return stamp.fromISOString(nValue);
                    case "boolean":
                        if (nValue === true || nValue === 'true' || nValue === '1' || nValue === 1) {
                            return true;
                        }
                        if (nValue === false || nValue === 'false' || nValue === '0' || nValue === 0) {
                            return false;
                        }

                        throw {message: "Value '" + nValue + "' cannot be cast to a javascript boolean"};
                    case "string":
                    case null:
                        return nValue === null || nValue === undefined ? undefined : '' + nValue;
                }
            }

            console.warn("DataType '" + this.datatype + "' has not been implemented in Literal Node");
            return nValue;
        },
        equals: function (toCompare) {
            var match = this.inherited(arguments);
            if (match && toCompare.interfaceName) {
                return this.datatype == toCompare.datatype && this.language == toCompare.language;
            }

            return match;
        },
        _numeric: function (value, parse){
            if (value === "INF") {
                return Number.POSITIVE_INFINITY;
            }
            if (value === "-INF"){
                return Number.NEGATIVE_INFINITY;
            }
            return parse(value);
        }
    });
});