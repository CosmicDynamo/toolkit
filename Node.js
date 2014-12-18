/**
 * Created by Akeron on 2/26/14.
 */
define([
    "dojo/_base/lang",
    "blocks/parser/Data",
    "./parser/iriRef",
    "./node/Literal",
    "./node/Blank"
], function (lang, Data, iriRef, lNode, bNode) {
    return function (value) {
        if (value == null){
            return new bNode();
        }

        if (lang.isString(value)) {
            var data = new Data({
                input: value
            });
            if (/^_\:/.test(value)) {
                return bNode(value.substr(2));
            }

            if (/^[\'|\"]/.test(value)) {
                var str, datatype, language;
                var pos = 0;
                var start = value[pos];
                if (value[pos + 1] === start && value[pos + 2] === start){
                    start += start + start;
                }
                var end = value.lastIndexOf(start);

                if (end == -1){
                    throw this.Error("\"" + c + "\" quote does not have ending quote. \"" + input + "\"");
                }
                str = value.substring(start.length, end);
                pos = end + 1;

                if (value[pos] == '^' && value[pos + 1] == '^'){
                    //Datatype
                    pos += 2;
                    if (value[pos] == "<"){
                        end = value.indexOf(">", ++pos);
                        if (end === -1){
                            throw this.Error("^^ missing type IRI. \"" + input + "\"");
                        }
                    } else {
                        end = this.findEnd(value, pos, /[ \n]/, true)
                    }
                    datatype = value.substring(pos, end);
                }

                if (value[0] == "@"){
                    //language;
                    end = this.findEnd(value, pos + 1, /[a-zA-Z0-9]|\-/);
                    if (end >= value.length){
                        throw this.Error("Invalid language tag \"" + input + "\"");
                    }
                    language = value.substring(pos, end);
                }
                return new lNode({
                    value:str,
                    language:language,
                    datatype:datatype
                });
            }

            if (/^[$|?]/.test(value)) {
                return new vNode(value.substr(1));
            }

            return iriRef(data);
        }

        return null;
    }
});