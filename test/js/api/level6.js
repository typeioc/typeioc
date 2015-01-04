
'use strict';


exports.api = {

    level6 : (function() {

        var scaffold = require('../../scaffold');
        var testData = scaffold.TestModule;

        var containerBuilder;

        return {

            setUp: function (callback) {
                containerBuilder = scaffold.createBuilder();
                callback();
            },

            fluentApiInitializeByDisposedNamedWithinOwnedBy : function (test) {

                containerBuilder.register(testData.Test1Base)
                    .as(function () { return new testData.Test5(); })
                    .initializeBy(function (c, item) { })
                    .dispose(function (item) { return item.Dispose(); })
                    .named("Some Name")
                    .within(scaffold.Types.Scope.Hierarchy)
                    .ownedBy(scaffold.Types.Owner.Container);

                test.done();
            },

            fluentApiAs : function (test) {

                var registration = containerBuilder.register(testData.Test1Base)
                    .as(function () { return new testData.Test5(); });

                test.equal(registration['as'], undefined);
                test.notEqual(registration['initializeBy'], undefined);
                test.notEqual(registration['initializeBy'], null);
                test.notEqual(registration['dispose'], undefined);
                test.notEqual(registration['dispose'], null);
                test.notEqual(registration['named'], undefined);
                test.notEqual(registration['named'], null);
                test.notEqual(registration['ownedBy'], undefined);
                test.notEqual(registration['ownedBy'], null);
                test.notEqual(registration['within'], undefined);
                test.notEqual(registration['within'], null);

                test.done();
            },

            fluentApiInitializeBy : function (test) {

                var registration = containerBuilder.register(testData.Test1Base)
                    .as(function () { return new testData.Test5(); })
                    .initializeBy(function (c, item) { });

                test.equal(registration['as'], undefined);
                test.equal(registration['initializeBy'], undefined);
                test.notEqual(registration['dispose'], undefined);
                test.notEqual(registration['dispose'], null);
                test.notEqual(registration['named'], undefined);
                test.notEqual(registration['named'], null);
                test.notEqual(registration['ownedBy'], undefined);
                test.notEqual(registration['ownedBy'], null);
                test.notEqual(registration['within'], undefined);
                test.notEqual(registration['within'], null);

                test.done();
            },


            fluentApiDispose : function(test) {

                var registration = containerBuilder.register(testData.Test1Base)
                    .as(function () { return new testData.Test5(); })
                    .dispose(function (item) { return item.Dispose(); });

                test.equal(registration['as'], undefined);
                test.equal(registration['initializeBy'], undefined);
                test.equal(registration['dispose'], undefined);
                test.notEqual(registration['named'], undefined);
                test.notEqual(registration['named'], null);
                test.notEqual(registration['ownedBy'], undefined);
                test.notEqual(registration['ownedBy'], null);
                test.notEqual(registration['within'], undefined);
                test.notEqual(registration['within'], null);

                test.done();
            },

            fluentApiNamed : function (test) {

                var registration = containerBuilder.register(testData.Test1Base)
                    .as(function () { return new testData.Test5(); })
                    .named("Some Name");

                test.equal(registration['as'], undefined);
                test.equal(registration['initializeBy'], undefined);
                test.equal(registration['dispose'], undefined);
                test.equal(registration['named'], undefined);
                test.notEqual(registration['ownedBy'], undefined);
                test.notEqual(registration['ownedBy'], null);
                test.notEqual(registration['within'], undefined);
                test.notEqual(registration['within'], null);

                test.done();
            },

            fluentApiWithin : function (test) {

                var containerBuilder = scaffold.createBuilder();
                var registration = containerBuilder.register(testData.Test1Base)
                    .as(function () { return new testData.Test5(); })
                    .within(scaffold.Types.Scope.Hierarchy);

                test.equal(registration['as'], undefined);
                test.equal(registration['initializeBy'], undefined);
                test.equal(registration['dispose'], undefined);
                test.equal(registration['named'], undefined);
                test.equal(registration['within'], undefined);
                test.notEqual(registration['ownedBy'], undefined);
                test.notEqual(registration['ownedBy'], null);

                test.done();
            },

            factoryNotDefinedError : function (test) {

                var registration = containerBuilder.register(testData.Test1Base);

                var delegate = function () {
                    return containerBuilder.build();
                };

                test.expect(2);

                test.throws(delegate, function (err) {

                    test.strictEqual(err.data, testData.Test1Base);

                    return (err instanceof scaffold.Exceptions.ArgumentNullError) &&
                            /Factory is not defined/.test(err.message);
                });

                test.done();
            }
        }
    })()
};