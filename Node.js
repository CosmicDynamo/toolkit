/**
 * Created by Akeron on 2/26/14.
 */
define([
    "dojo/_base/lang",
    "blocks/parser/Data",
    "./parser/string",
    "./parser/langTag",
    "./parser/iriRef",
    "./node/Literal",
    "./node/Blank"
], function (lang, Data, string, langTag, iriRef, lNode, bNode) {
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

            var str = string(data);
            if (str != null) {
                var datatype, language;

                if (value[data.pos] == '^' && value[data.pos + 1] == '^'){
                    data.pos += 2;
                    datatype = iriRef(data).toString();
                }

                language = langTag(data);

                return new lNode(str, language, datatype);
            }

            if (/^[$|?]/.test(value)) {
                return new vNode(value.substr(1));
            }

            return iriRef(data);
        }

        return null;
    }
});