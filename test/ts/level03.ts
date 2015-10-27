
'use strict';

import scaffold = require('./../scaffold');
import TestData = require('../data/test-data');

export module Level3 {

    var containerBuilder : Typeioc.IContainerBuilder;

    export function setUp(callback) {
        containerBuilder = scaffold.createBuilder();
        callback();
    }

    export function defaultScopingNone(test) {

        containerBuilder.register<TestData.Test1Base>(TestData.Test1Base)
            .as(() => new TestData.Test4("test 4"));

        var container = containerBuilder.build();
        var test1 = container.resolve<TestData.Test1>(TestData.Test1Base);
        test1.Name = "test 1";
        var test2 = container.resolve<TestData.Test1>(TestData.Test1Base);

        test.notEqual(test1, null);
        test.strictEqual(test1.Name, "test 1");
        test.notEqual(test2, null);
        test.strictEqual(test2.Name, "test 4");

        test.done();
    }

    export function defaultScopingChange(test) {

        scaffold.Types.Defaults.scope = Typeioc.Types.Scope.Hierarchy;
        containerBuilder.register(TestData.Test1Base).as(function () {
            return new TestData.Test4("test 4");
        });

        var container = containerBuilder.build();
        var test1 = container.resolve<TestData.Test1>(TestData.Test1Base);
        test1.Name = "test 1";
        var test2 = container.resolve<TestData.Test1>(TestData.Test1Base);

        test.notEqual(test1, null);
        test.strictEqual(test1.Name, "test 1");
        test.notEqual(test2, null);
        test.strictEqual(test2.Name, "test 1");
        test.strictEqual(test1, test2);

        test.done();
    }

    export function noScopingReuse(test) {

        containerBuilder.register<TestData.Test1Base>(TestData.Test1Base)
            .as(() => new TestData.Test4("test 4"))
            .within(Typeioc.Types.Scope.None);

        var container = containerBuilder.build();
        var test1 = container.resolve<TestData.Test4>(TestData.Test1Base);
        test1.Name = "test 1";
        var test2 = container.resolve<TestData.Test4>(TestData.Test1Base);

        test.notEqual(test1, null);
        test.strictEqual(test1.Name, "test 1");
        test.notEqual(test2, null);
        test.strictEqual(test2.Name, "test 4");

        test.done();
    }

    export function containerScoping(test) {

        containerBuilder.register<TestData.Test1Base>(TestData.Test1Base)
            .as(() => new TestData.Test4("test 4"))
            .within(Typeioc.Types.Scope.Container);

        var container = containerBuilder.build();
        var test1 = container.resolve<TestData.Test4>(TestData.Test1Base);
        test1.Name = "test 1";
        var test2 = container.resolve<TestData.Test4>(TestData.Test1Base);

        test.notEqual(test1, null);
        test.strictEqual(test1.Name, "test 1");
        test.notEqual(test2, null);
        test.strictEqual(test2.Name, "test 1");

        test.done();
    }

    export function hierarchyScoping(test) {

         containerBuilder.register(TestData.Test1Base).as(function () {
            return new TestData.Test4("test 4");
        })
        .within(Typeioc.Types.Scope.Hierarchy);

        var container = containerBuilder.build();
        var test1 = container.resolve<TestData.Test1>(TestData.Test1Base);
        test1.Name = "test 1";
        var test2 = container.resolve<TestData.Test1>(TestData.Test1Base);

        test.notEqual(test1, null);
        test.strictEqual(test1.Name, "test 1");
        test.notEqual(test2, null);
        test.strictEqual(test2.Name, "test 1");
        test.strictEqual(test1, test2);

        test.done();
    }

}