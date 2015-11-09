
/// <reference path='../../d.ts/typeioc.d.ts' />

'use strict';

import scaffold = require('./../scaffold');


var decorator = scaffold.getDecorator();

export module Registration {

    export class TestBase {
        public foo() {
        }
    }

    export class TestBase1 {
        public foo1() {
        }
    }

    export class TestBase2 {
        public foo2() {
        }
    }

    @decorator.provide(Registration.TestBase).register()
    export class Test extends TestBase {

        public foo() {
            return 'Test : foo';
        }
    }

    @decorator.provide(Registration.TestBase1).register()
    export class Test1 implements TestBase1 {

        constructor(private TestBase : TestBase) {}

        public foo1() {

            return this.TestBase.foo() + ' : foo1';
        }
    }

    @decorator.provide(Registration.TestBase2).register()
    export class Test2 implements TestBase2 {

        constructor(private testBase : TestBase, private testBase1 : TestBase1) {}

        public foo2() {

            return [this.testBase.foo(), this.testBase1.foo1(), 'foo2'].join(' | ');
        }
    }
}

//export module InitializeBy {
//
//    export class TestBase {
//        public foo() {
//        }
//    }
//
//    @decorator.register<InitializeBy.TestBase>(InitializeBy.TestBase, { initializeBy : (_, item : Test2) => item.text = ' test' })
//    export class Test2 extends TestBase {
//
//        public text : string = null;
//
//        public foo() {
//            return 'Test : foo' + (this.text || '');
//        }
//    }
//}
//
//export module Scope {
//
//    export class TestBase {
//        public foo() {
//        }
//    }
//
//    @decorator.register<Scope.TestBase>(Scope.TestBase, { within : Typeioc.Types.Scope.Hierarchy })
//    export class Test extends TestBase {
//
//        public text : string = ' test';
//
//        public foo() {
//            return 'Test : foo' + (this.text || '');
//        }
//    }
//
//    export class TestBase2 {
//
//        public foo() {
//        }
//    }
//
//    @decorator.register<Scope.TestBase2>(Scope.TestBase2, { within : Typeioc.Types.Scope.Container })
//    export class Test2 extends TestBase2 {
//
//        public text : string = ' test';
//
//        public foo() {
//            return 'Test : foo' + (this.text || '');
//        }
//    }
//}
//
//export module Owner {
//    export class TestBase1 {
//        public foo() {
//        }
//
//        public dispose() {}
//    }
//
//    @decorator.register<TestBase1>(TestBase1, {
//        ownedBy: Typeioc.Types.Owner.Container,
//        dispose: ((item:Test) => { item.dispose(); })
//    })
//    export class Test extends TestBase1 {
//
//        public text : string = ' test';
//
//        public foo() {
//            return 'Test : foo' + (this.text || '');
//        }
//
//        public dispose() {
//            this.text = 'disposed';
//        }
//    }
//
//
//    export class TestBase2 {
//        public foo() {
//        }
//
//        public dispose() {}
//    }
//
//    @decorator.register<TestBase2>(TestBase2, {
//        ownedBy : Typeioc.Types.Owner.Externals,
//        dispose : ((item: TestBase2) => { item.dispose(); })
//    })
//    export class Test2 extends TestBase2 {
//
//        public text : string = ' test';
//
//        public foo() {
//            return 'Test : foo' + (this.text || '');
//        }
//
//        public dispose() {
//            this.text = 'disposed';
//        }
//    }
//}
//
//export module Named {
//
//    export class TestBase {
//        public foo() {
//        }
//    }
//
//    @decorator.register<Named.TestBase>(Named.TestBase, { named : 'Some name' })
//    export class Test extends TestBase {
//
//        public static text : string = ' test';
//
//        public foo() {
//            return 'Test : foo' + (Test.text || '');
//        }
//    }
//
//    @decorator.register<Named.TestBase>(Named.TestBase, { named : 'Some name 2' })
//    export class Test2 extends TestBase {
//
//        public static text : string = ' test';
//
//        public foo() {
//            return 'Test2 : foo' + (Test2.text || '');
//        }
//    }
//}