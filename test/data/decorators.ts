
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

export module InitializeBy {
    export class TestBase {
        public foo() {
        }
    }

    export class TestBase1 {
        public foo() {
        }
    }

    @decorator.provide(InitializeBy.TestBase)
               .initializeBy((c, item: InitializeBy.Test2) => { item.text = 'foo 2'; })
                .register()
    export class Test2 extends TestBase {

        public text : string = null;

        public foo() {
            return 'Test : foo ' + this.text;
        }
    }

    @decorator.provide<InitializeBy.Test3>(InitializeBy.TestBase1)
               .initializeBy((c, item) => { item.text = 'foo 3'; })
                .register()
    export class Test3 extends TestBase {

        public text : string = null;

        public foo() {
            return 'Test : foo ' + this.text;
        }
    }
}


export module Scope {

    export class TestBase {
        public foo() {
        }
    }

    @decorator.provide<Scope.TestBase>(Scope.TestBase)
                .within(Typeioc.Types.Scope.None)
                .register()
    export class Test extends TestBase {

        public text : string = ' test none';

        public foo() {
            return 'Test : foo' + this.text;
        }
    }

    export class TestBase2 {

        public foo() {
        }
    }

    @decorator.provide<Scope.TestBase2>(Scope.TestBase2)
            .within(Typeioc.Types.Scope.Container)
            .register()
    export class Test2 extends TestBase2 {

        public text : string = ' test Container';

        public foo() {
            return 'Test : foo' + this.text;
        }
    }

    export class TestBase3 {

        public foo() {
        }
    }

    @decorator.provide<Scope.TestBase3>(Scope.TestBase3)
            .within(Typeioc.Types.Scope.Hierarchy)
            .register()
    export class Test3 extends TestBase3 {

        public text : string = ' test Hierarchy';

        public foo() {
            return 'Test : foo' + this.text;
        }
    }
}

export module Owner {
    export class TestBase1 {
        public foo() {
        }

        public dispose() {}
    }

    @decorator.provide<Owner.TestBase1>(Owner.TestBase1)
        .dispose((item:Test) => { item.dispose(); })
        .ownedBy(Typeioc.Types.Owner.Container)
        .register()
    export class Test extends TestBase1 {

        public text : string = 'test';

        public foo() {
            return 'Test : foo ' + this.text;
        }

        public dispose() {
            this.text = 'disposed';
        }
    }


    export class TestBase2 {
        public foo() {
        }

        public dispose() {}
    }

    @decorator.provide<Owner.TestBase2>(Owner.TestBase2)
        .dispose((item:TestBase2) => { item.dispose(); })
        .ownedBy(Typeioc.Types.Owner.Externals)
        .register()
    export class Test2 extends TestBase2 {

        public text : string = 'test';

        public foo() {
            return 'Test : foo ' + this.text;
        }

        public dispose() {
            this.text = 'disposed';
        }
    }
}

export module Named {

    export class TestBase {
        public foo() {
        }
    }

    @decorator.provide<Named.TestBase>(Named.TestBase)
            .named('Some name')
            .register()
    export class Test extends TestBase {

        public text : string = 'test';

        public foo() {
            return 'Test : foo ' + this.text;
        }
    }

    @decorator.provide<Named.TestBase>(Named.TestBase)
            .named('Some name 2')
            .register()
    export class Test2 extends TestBase {

        public text : string = 'test';

        public foo() {
            return 'Test2 : foo ' + this.text;
        }
    }
}

export module Resolve {

    export module ByValue {

        export class TestBase {
            public foo() {}
        }

        @decorator.provide<Resolve.ByValue.TestBase>(Resolve.ByValue.TestBase).register()
        export class Test1 extends TestBase {

            constructor(@decorator.resolveValue('decorator value')  private value) {
                super();
            }

            public foo() {
                return 'Test1 : ' + this.value;
            }
        }

        export class TestBase1 {
            public foo() {}
        }

        @decorator.provide<Resolve.ByValue.TestBase1>(Resolve.ByValue.TestBase1).register()
            export class Test2 extends TestBase1 {

                constructor(@decorator.resolveValue('value 1')  private value1,
                            @decorator.resolveValue('value 2')  private value2,
                            @decorator.resolveValue('value 3')  private value3) {
                super();
            }

            public foo() {
                return ['Test1 :', this.value1, this.value2, this.value3].join(' ');
            }
        }

    }

    export module ByService {
        export class TestBase {
            public foo() {}
        }

        export class TestBase1 {
            public foo() {}
        }

        export class TestBase2 {
            public foo() {}
        }

        @decorator.provide<Resolve.ByService.TestBase>(Resolve.ByService.TestBase).register()
        export class Test extends TestBase {

            public foo() {
                return 'Test';
            }
        }

        @decorator.provide<Resolve.ByService.TestBase2>(Resolve.ByService.TestBase2).register()
        export class Test2 extends TestBase2 {

            public foo() {
                return 'Test2';
            }
        }

        @decorator.provide<Resolve.ByService.TestBase1>(Resolve.ByService.TestBase1).register()
            export class Test1 extends TestBase1 {

                constructor(@decorator.by().resolve()  private value111 : Resolve.ByService.TestBase,
                            @decorator.by(Resolve.ByService.TestBase2).resolve() private value222,
                            @decorator.by(Resolve.ByService.TestBase).resolve()  private value333) {
                    super();
                }

                public foo() {
                    return ['Test1 :', this.value111.foo(), this.value222.foo(), this.value333.foo()].join(' ');
                }
        }
    }

    export module ByArgs {
        export class TestBase {
            public foo() {}
        }

        export class TestBase1 {
            public foo() {}
        }

        @decorator.provide<Resolve.ByArgs.TestBase>(Resolve.ByArgs.TestBase).register()
        export class Test extends TestBase {

            constructor(private val1: string, private val2 : string) {
                super();
            }

            public foo() {
                return ['Test', this.val1, this.val2].join(' ');
            }
        }

        @decorator.provide<Resolve.ByArgs.TestBase1>(Resolve.ByArgs.TestBase1).register()
        export class Test1 extends TestBase1 {

            constructor(@decorator.by().args('1','7').resolve()  private value : Resolve.ByArgs.TestBase) {
                super();
            }

            public foo() {
                return ['Test1 :', this.value.foo()].join(' ');
            }
        }
    }

    export module ByName {
        export class TestBase {
            public foo() {}
        }

        export class TestBase1 {
            public foo() {}
        }

        @decorator.provide<Resolve.ByName.TestBase>(Resolve.ByName.TestBase).named('Some name 1').register()
        @decorator.provide<Resolve.ByName.TestBase>(Resolve.ByName.TestBase).named('Some name 2').register()
        export class Test extends TestBase {

            public foo() {
                return 'Test';
            }
        }

        @decorator.provide<Resolve.ByName.TestBase1>(Resolve.ByName.TestBase1).register()
        export class Test1 extends TestBase1 {

            constructor(private value1 : Resolve.ByName.TestBase,
                        @decorator.by().name('Some name 1').resolve()  private value2 : Resolve.ByName.TestBase,
                        @decorator.by().name('Some name 2').resolve()  private value3 : Resolve.ByName.TestBase) {
                super();
            }

            public foo() {
                return ['Test1 :', this.value1.foo(), this.value2.foo(), this.value3.foo()].join(' ');
            }
        }
    }

    export module ByAttempt {

        export class TestBase {
            public foo() {}
        }

        @decorator.provide<Resolve.ByAttempt.TestBase>(Resolve.ByAttempt.TestBase).register()
        export class Test extends TestBase {

            public foo() {
                return 'Test' + (this.value1 || ' no value');
            }

            constructor(@decorator.by().attempt().resolve() private value1) {
                super();
            }
        }
    }

    export module ByCache {
        export class TestBase {
            public foo() {}
        }

        export class TestBase1 {
            public foo() {}
        }

        @decorator.provide<Resolve.ByCache.TestBase>(Resolve.ByCache.TestBase).register()
        export class Test extends TestBase {

            public foo() {
                return 'Test';
            }
        }

        @decorator.provide<Resolve.ByCache.TestBase1>(Resolve.ByCache.TestBase1).register()
        export class Test1 extends TestBase1 {

            constructor(@decorator.by().cache().resolve()  private value : Resolve.ByCache.TestBase) {
                super();
            }

            public foo() {
                return ['Test1 :', this.value.foo()].join(' ');
            }
        }
    }
}