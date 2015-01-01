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
    "./parser/bNodeLabel"
], function (lang, Data, string, langTag, iriRef, lNode, bNodeLabel) {
    return function (value) {
        var data = new Data({
            input: value
        });

        var str = string(data);
        if (str != null) {
            var datatype, language;

            if (value[data.pos] == '^' && value[data.pos + 1] == '^') {
                data.pos += 2;
                datatype = iriRef(data).toString();
            }

            language = langTag(data);

            return new lNode(str, language, datatype);
        }

        return iriRef(data) || bNodeLabel(data);
    }
});