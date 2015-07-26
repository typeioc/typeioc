
/// <reference path='../../d.ts/typeioc.d.ts' />

//'use strict';   TODO: add this back when the bug fix is released

import scaffold = require('./../scaffold');


export module Registration {

    export class TestBase {
        public foo() {
        }
    }

    @scaffold.Decorators.register(Registration.TestBase)
    export class Test extends TestBase {

        public foo() {
            return 'Test : foo';
        }
    }
}

export module InitializeBy {

    export class TestBase {
        public foo() {
        }
    }

    @scaffold.Decorators.register(InitializeBy.TestBase, { initializeBy : (_, item) => item.text = ' test' })
    export class Test2 extends TestBase {

        public static text : string = null;

        public foo() {
            return 'Test : foo' + (Test2.text || '');
        }
    }
}

export module Scope {

    export class TestBase {
        public foo() {
        }
    }

    @scaffold.Decorators.register(TestBase, { initializeBy : (_, item) => item.text = ' test', within : Typeioc.Types.Scope.Hierarchy })
    export class Test extends TestBase {

        public static text : string = null;

        public foo() {
            return 'Test : foo' + (Test2.text || '');
        }
    }


    export class TestBase2 {
        public foo() {
        }
    }

    @scaffold.Decorators.register(TestBase, { initializeBy : (_, item) => item.text = ' test', within : Typeioc.Types.Scope.Container })
    export class Test2 extends TestBase {

        public static text : string = null;

        public foo() {
            return 'Test : foo' + (Test2.text || '');
        }
    }
}

export module Named {

    export class TestBase {
        public foo() {
        }
    }

    @scaffold.Decorators.register(Named.TestBase, { initializeBy : (_, item) => item.text = ' test', named : 'Some name' })
    export class Test extends TestBase {

        public static text : string = null;

        public foo() {
            return 'Test : foo' + (Test.text || '');
        }
    }

    @scaffold.Decorators.register(Named.TestBase, { initializeBy : (_, item) => item.text = ' test', named : 'Some name 2' })
    export class Test2 extends TestBase {

        public static text : string = null;

        public foo() {
            return 'Test2 : foo' + (Test2.text || '');
        }
    }
}