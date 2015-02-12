/**
 * Created by Akeron on 3/4/14.
 */
define([
    "qasht/package/Unit", "RdfJs/Node", "dojo/_base/lang"
], function (TestPackage, Node, lang) {
    return new TestPackage({
        module: "RdfJs/Node",
        tests: [
            {
                name: "Create Named Node by String",
                exec: function (test) {
                    var out = new Node("<urn:NamedNode>");

                    test.assertTrue(lang.isObject(out));
                    test.assertEqual("urn:NamedNode", out.nominalValue);
                    test.assertEqual("NamedNode", out.interfaceName);

                    test.assertEqual("<urn:NamedNode>", out.toNT());
                    test.assertEqual("urn:NamedNode", out.valueOf());
                    test.assertEqual("urn:NamedNode", out.toString());

                    test.complete();
                }
            },
            {
                name: "Create Literal Node by String",
                exec: function (test) {
                    var out = new Node("\"value\"^^<http://www.w3.org/2001/XMLSchema#string>");

                    test.assertTrue(lang.isObject(out));
                    test.assertEqual("value", out.nominalValue);
                    test.assertEqual("http://www.w3.org/2001/XMLSchema#string", out.datatype);
                    test.assertEqual("Literal", out.interfaceName);

                    test.assertEqual("\"value\"^^<http://www.w3.org/2001/XMLSchema#string>",
                        out.toNT());
                    test.assertEqual(out.toNT(), out.toString());
                    test.assertEqual("value", out.valueOf());

                    test.complete();
                }
            },
            {
                name: "Create Blank Node by String",
                exec: function (test) {
                    var out = new Node("_:001");

                    test.assertTrue(lang.isObject(out));
                    test.assertEqual("001", out.nominalValue);
                    test.assertEqual("BlankNode", out.interfaceName);

                    test.assertEqual("_:001", out.toNT());
                    test.assertEqual("_:001", out.toString());
                    test.assertEqual("001", out.valueOf());

                    test.complete();
                }
            }
        ]
    });
});