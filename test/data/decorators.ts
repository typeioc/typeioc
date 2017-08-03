/* istanbul ignore next */

'use strict';

import scaffold = require('./../scaffold');
import ScaffoldAddons = require('./../scaffoldAddons');

var interceptor = ScaffoldAddons.Interceptors.create();

export var decorator = scaffold.createDecorator();
export var decorator2 = scaffold.createDecorator();


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
               .initializeBy((c, item: InitializeBy.Test2) => { item.text = 'foo 2'; return item;})
                .register()
    export class Test2 extends TestBase {

        public text : string = null;

        public foo() {
            return 'Test : foo ' + this.text;
        }
    }

    @decorator.provide<InitializeBy.Test3>(InitializeBy.TestBase1)
               .initializeBy((c, item) => {
                    item.text = 'foo 3';
                    item = interceptor.interceptInstance(item, {
                            method : 'foo',
                            wrapper : function(callInfo) { return  this.text +  ' interceptor'; }
                        });
                    return item;
                })
                .register()
    export class Test3 extends TestBase1 {

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

                constructor(private value111 : Resolve.ByService.TestBase,
                            @decorator.by(Resolve.ByService.TestBase2).resolve() private value222,
                            @decorator.by(Resolve.ByService.TestBase).resolve()  private value333) {
                    super();
                }

                public foo() {
                    return ['Test1 :', this.value111.foo(), this.value222.foo(), this.value333.foo()].join(' ');
                }
        }
    }

    export module ByMultipleService {
        export class TestBase {
            public foo() {}
        }

        export class TestBase1 {
            public foo() {}
        }

        export class TestBase2 {
            public foo() {}
        }


        @decorator.provide<Resolve.ByMultipleService.TestBase>(Resolve.ByMultipleService.TestBase)
            .register()
        export class Test extends TestBase {

            constructor() {
                super();
            }

            public foo() {
                return 'Test';
            }
        }

        @decorator.provide<Resolve.ByMultipleService.TestBase1>(Resolve.ByMultipleService.TestBase1)
            .register()
        export class Test1 extends TestBase1 {

            constructor(private _value1 : Resolve.ByMultipleService.TestBase,
                        @decorator
                        .by(Resolve.ByMultipleService.TestBase)
                        .resolve() private _value2) {
                super();
            }

            public foo() {
                return ['Test1', this._value1.foo(), this._value2.foo()].join(' ');
            }
        }

        @decorator.provide<Resolve.ByMultipleService.TestBase2>(Resolve.ByMultipleService.TestBase2)
            .register()
        export class Test2 extends TestBase2 {

            constructor(@decorator
                        .by(Resolve.ByMultipleService.TestBase1)
                        .resolve() private _value1,
                        @decorator
                        .by(Resolve.ByMultipleService.TestBase)
                        .resolve() private _value2) {
                super();
            }

            public foo() {
                return ['Test2', this._value1.foo(), this._value2.foo()].join(' ');
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

        @decorator.provide(Resolve.ByName.TestBase).register()
        @decorator.provide(Resolve.ByName.TestBase).named('Some name 1').register()
        @decorator.provide(Resolve.ByName.TestBase).named('Some name 2').register()
        export class Test extends TestBase {

            public foo() {
                return 'Test';
            }
        }

        @decorator.provide(Resolve.ByName.TestBase1).register()
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

        export class TestBase1 {
            public foo1() {}
        }

        @decorator.provide(Resolve.ByAttempt.TestBase1).register()
        export class Test1 extends TestBase1 {
            public foo1() {
                return 'Test1';
            }
        }

        @decorator.provide<Resolve.ByAttempt.TestBase>(Resolve.ByAttempt.TestBase).register()
        export class Test extends TestBase {

            public foo() {
                return 'Test' + (this.value1 || ' no value ') + this.value2.foo1();
            }

            constructor(@decorator.by().attempt().resolve() private value1,
                        @decorator.by().attempt().resolve() private value2 : Resolve.ByAttempt.TestBase1) {
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

    export module FullResolution {
        export class TestBase {
            public foo() {}
        }

        export class TestBase1 {
            public foo() {}
        }

        export class TestBase2 {
            public foo() {}
        }

        export class TestBase3 {
            public foo() {}
        }

        export class TestBase4 {
            public foo() {}
        }

        @decorator.provide<Resolve.FullResolution.TestBase3>(Resolve.FullResolution.TestBase3)
        .named('Some name')
        .register()
        export class Test3 extends TestBase3 {

            constructor(private arg1, private arg2) {
                super();
            }

            public foo() {
                return ['Test', this.arg1, this.arg2].join(' ');
            }
        }

        @decorator.provide<Resolve.FullResolution.TestBase>(Resolve.FullResolution.TestBase).register()
        export class Test extends TestBase {

            constructor(private arg1, private arg2) {
                super();
            }

            public foo() {
                return ['Test', this.arg1, this.arg2].join(' ');
            }
        }

        @decorator.provide<Resolve.FullResolution.TestBase1>(Resolve.FullResolution.TestBase1).register()
        export class Test1 extends TestBase1 {

            constructor(private arg1 : Resolve.FullResolution.TestBase) {
                super();
            }

            public foo() {
                return ['Test', this.arg1.foo()].join(' ');
            }
        }

        @decorator.provide<Resolve.FullResolution.TestBase2>(Resolve.FullResolution.TestBase2).register()
        export class Test2 extends TestBase2 {

            constructor(private arg1 : Resolve.FullResolution.TestBase,
                        private arg2 : Resolve.FullResolution.TestBase1,
                        @decorator.by().name('Some name').resolve() private arg3 : Resolve.FullResolution.TestBase3) {
                super();
            }

            public foo() {
                return ['Test', this.arg1.foo(), this.arg2.foo(), this.arg3.foo()].join(' ');
            }
        }

        @decorator.provide<Resolve.FullResolution.TestBase4>(Resolve.FullResolution.TestBase4).register()
        export class Test4 extends TestBase4 {

            constructor(private arg1 : Resolve.FullResolution.TestBase,
                        private arg2 : Resolve.FullResolution.TestBase1,
                        @decorator.resolveValue('decorator value') private arg2_1,
                        @decorator.by(Resolve.FullResolution.TestBase3).name('Some name').resolve() private arg3) {
                super();
            }

            public foo() {
                return ['Test', this.arg1.foo(), this.arg2.foo(), this.arg2_1, this.arg3.foo()].join(' ');
            }
        }

        export class TestDep extends Resolve.FullResolution.TestBase {
            constructor() {
                super();
            }

            public foo() {
                return 'dependency';
            }
        }

        export class TestDep1 extends Resolve.FullResolution.TestBase1 {
            constructor() {
                super();
            }

            public foo() {
                return 'dependency 1';
            }
        }

        export class TestDep3 extends Resolve.FullResolution.TestBase3 {
            constructor() {
                super();
            }

            public foo() {
                return 'dependency 3';
            }
        }
    }

    export module DependenciesProperties {
        export class TestBase {
            public foo() {}
        }

        export class TestBase1 {
            public foo() {}
        }

        @decorator.provide<Resolve.DependenciesProperties.TestBase>(Resolve.DependenciesProperties.TestBase)
            .named('Some test name').register()
        export class Test extends TestBase {

            constructor(private arg1, private arg2) {
                super();
            }

            public foo() {
                return ['Test', this.arg1, this.arg2].join(' ');
            }
        }

        @decorator.provide<Resolve.DependenciesProperties .TestBase1>(Resolve.DependenciesProperties .TestBase1).register()
        export class Test1 extends TestBase1 {

            constructor(@decorator.by().name('Some test name').resolve() private arg1 : Resolve.DependenciesProperties.TestBase) {
                super();
            }

            public foo() {
                return ['Test', this.arg1.foo()].join(' ');
            }
        }

        export class TestDep extends Resolve.DependenciesProperties.TestBase {
            constructor() {
                super();
            }

            public foo() {
                return 'dependency Some test name';
            }
        }
    }

    export module DependenciesInit {

        export class TestBase {
            public foo() {}
        }

        @decorator.provide<Resolve.DependenciesInit.TestBase>(Resolve.DependenciesInit.TestBase)
            .initializeBy((c, item) => {
                            item.foo = function() {return 'Initialized'; };
                            return item;
                        })
            .register()
        export class Test extends TestBase{

            public foo() {
                return 'Test';
            }
        }

        @decorator.provide('some TestInit').register()
        export class TestInit {

            constructor(@decorator.by().resolve() private arg1 : Resolve.DependenciesInit.TestBase) {

            }

            public foo() {
                return ['Test', this.arg1.foo()].join(' ');
            }
        }

        export class TestDep extends Resolve.DependenciesInit.TestBase {
            constructor() {
                super();
            }

            public foo() {
                return 'dependency';
            }
        }
    }

    export module DependenciesNonRequired {
        export class TestBase {
            public foo() {}
        }

        export class TestBase1 {
            public foo() {}
        }

        @decorator.provide(Resolve.DependenciesNonRequired.TestBase).register()
        export class TestInit {

            constructor(@decorator.by(Resolve.DependenciesNonRequired.TestBase1).resolve() private arg1) {

            }

            public foo() {
                return ['Test', this.arg1.foo()].join(' ');
            }
        }

        export class TestDep extends Resolve.DependenciesNonRequired.TestBase1 {
            constructor() {
                super();
            }

            public foo() {
                return 'dependency';
            }
        }
    }

    export module ObjectResolution {

        export class TestBase {
            public foo() {}
        }

        @decorator.provide(ObjectResolution.TestBase).register()
        export class Test extends TestBase {

            constructor(@decorator.by('dependency').resolve() private _arg1) {
                super();
            }

            public foo() {
                return ['Test', this._arg1.foo()].join(' ');
            }
        }

        @decorator.provide('dependency').register()
        export class Test1 {

            public foo() {
                return 'Test1';
            }
        }
    }

    export module NumberResolution {

        export class TestBase {
            public foo() {}
        }

        @decorator.provide(NumberResolution.TestBase).register()
        export class Test extends TestBase {

            constructor(@decorator.by(123).resolve() private _arg1) {
                super();
            }

            public foo() {
                return ['Test', this._arg1.foo()].join(' ');
            }
        }

        @decorator.provide(123).register()
        export class Test1 {

            public foo() {
                return 'Test1';
            }
        }
    }

    export module MultipleDecorators {

        export class TestBase {
            public foo() {}
        }

        export class TestBase1 {
            public foo() {}
        }

        export class TestBase2 {
            public foo() {}
        }

        @decorator.provide(MultipleDecorators.TestBase).register()
        @decorator2.provide(MultipleDecorators.TestBase).register()
        export class Test extends TestBase{
            public foo() {
                return 'Test';
            }
        }

        @decorator.provide(MultipleDecorators.TestBase1).register()
        @decorator2.provide(MultipleDecorators.TestBase1).register()
        export class Test1 extends TestBase1 {

            constructor(@decorator.by().resolve() @decorator2.by().resolve() private _arg1 : TestBase,
                        @decorator.by('decorator').resolve() @decorator2.by('decorator 2').resolve() private _arg2,
                        private _arg3 : TestBase2) {
                super();
            }

            public foo() {
                return ['Test 1 ', this._arg1.foo(), this._arg2.foo(), this._arg3.foo()].join(' ');
            }
        }

        @decorator.provide('decorator').register()
        @decorator2.provide('decorator 2').register()
        export class Test2 {
            public foo() {
                return 'Test2';
            }
        }

        @decorator.provide(MultipleDecorators.TestBase2).register()
        @decorator2.provide(MultipleDecorators.TestBase2).register()
        export class Test3 extends TestBase2 {
            public foo() {
                return 'Test3';
            }
        }

    }
}