define([
    "dojo/_base/declare",
    "qasht/_Fake",
    "./Node"
], function (declare, _Fake, Node) {
    /**
     * @class RdfJs.test.fake.Triple
     * @mixes RdfJs.Triple
     * @mixes qasht._Fake
     */
    var Triple = declare([_Fake], {
        postscript: function (subject, predicate, object) {
            this.inherited(arguments);
            var test = this.test;

            this.subject = new Node(subject.subject || subject, test);
            this.predicate = new Node(subject.predicate || predicate, test);
            this.object = new Node(subject.object || object, test);

            test.assertIsObject(this.subject);
            test.assertIsObject(this.predicate);
            test.assertIsObject(this.object);
        },
        toNT: function () {
            var test = this.test;
            test.assertEqual(0, arguments.length);

            return this.subject.toNT() + " " + this.predicate.toNT() + " " + this.object.toNT();
        },
        toString: function () {
            var test = this.test;
            test.assertEqual(0, arguments.length);

            return this.subject.toNT() + " " + this.predicate.toNT() + " " + this.object.toNT() + " .";
        },
        equals: function (t) {
            var test = this.test;
            Triple.testApi(t, test);

            return this.subject.equals(t.subject) && this.predicate.equals(t.predicate) && this.object.equals(t.object);
        }
    });

    /**
     * @method RdfJs.test.fake.Triple#testApi
     * @param {*} object - The object being tested
     * @param {qasht.Test} test - The test instance being executed
     */
    Triple.testApi = function (object, test) {
        test.assertIsObject(object);

        test.assertIsObject(object.subject);
        test.assertIsObject(object.predicate);
        test.assertIsObject(object.object);

        test.assertIsFunction(object.toString);
        test.assertIsFunction(object.equals);
    };

    return Triple;
});