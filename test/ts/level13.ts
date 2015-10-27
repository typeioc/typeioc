//'use strict';

import TestData = require('../data/decorators');
import scaffold = require('./../scaffold');


export module Level13 {

    export function embedded_container_resolution(test) {

        var container = scaffold.getDecorator().build();

        var Actual: any = container.resolve<TestData.Registration.TestBase>(TestData.Registration.TestBase);
        var actual = <TestData.Registration.TestBase>new Actual();

        test.ok(actual);
        test.strictEqual(actual.foo(), 'Test : foo');

        test.done();
    }
    //
    //export function embedded_container_resolution_initializeBy(test) {
    //
    //    var container = scaffold.getDecorator().container;
    //
    //    var Actual = container.resolve<TestData.InitializeBy.TestBase>(TestData.InitializeBy.TestBase);
    //    var actual = <TestData.InitializeBy.TestBase>new (Actual.constructor());
    //
    //    test.ok(actual);
    //    test.strictEqual(actual.foo(), 'Test : foo test');
    //
    //    test.done();
    //}
    //
    //export function embedded_container_resolution_scope_hierarchy(test) {
    //
    //    var container = scaffold.getDecorator().container;
    //
    //    var Actual = container.resolve<TestData.Scope.TestBase>(TestData.Scope.TestBase);
    //    var actual = <TestData.Scope.TestBase>new (Actual.constructor());
    //
    //    test.ok(actual);
    //    test.strictEqual(actual.foo(), 'Test : foo test');
    //
    //    var child = container.createChild();
    //
    //    Actual = child.resolve<TestData.Scope.TestBase>(TestData.Scope.TestBase);
    //    actual = <TestData.Scope.TestBase>new (Actual.constructor());
    //
    //    test.ok(actual);
    //    test.strictEqual(actual.foo(), 'Test : foo test');
    //
    //    test.done();
    //}
    //
    //export function embedded_container_resolution_scope_container(test) {
    //
    //    var container = scaffold.getDecorator().container;
    //
    //    var Actual = container.resolve<TestData.Scope.Test2>(TestData.Scope.TestBase2);
    //
    //    var text = 'some text';
    //    Actual.text = text;
    //
    //    var Actual2 = container.resolve<TestData.Scope.Test2>(TestData.Scope.TestBase2);
    //
    //    test.strictEqual(Actual2.text, Actual.text);
    //    test.strictEqual(Actual2.text, text);
    //
    //    test.done();
    //}
    //
    //export function embedded_container_resolution_owner_container(test) {
    //
    //    var container = scaffold.getDecorator().container;
    //
    //    var Actual = container.resolve<TestData.Owner.TestBase1>(TestData.Owner.TestBase1);
    //    var actual = <TestData.Owner.TestBase1>new (Actual.constructor());
    //
    //    container.dispose();
    //
    //    test.strictEqual(actual.foo(), 'Test : foo test');
    //
    //    test.done();
    //}
    //
    //export function embedded_container_resolution_named(test) {
    //
    //    var container = scaffold.getDecorator().container;
    //
    //    var Actual = container.resolveNamed<TestData.Named.TestBase>(TestData.Named.TestBase, 'Some name');
    //    var actual = <TestData.Named.TestBase>new (Actual.constructor());
    //
    //    test.ok(actual);
    //    test.strictEqual(actual.foo(), 'Test : foo test');
    //
    //    Actual = container.resolveNamed<TestData.Named.TestBase>(TestData.Named.TestBase, 'Some name 2');
    //    actual = <TestData.Named.TestBase>new (Actual.constructor());
    //
    //    test.ok(actual);
    //    test.strictEqual(actual.foo(), 'Test2 : foo test');
    //
    //    test.done();
    //}
}