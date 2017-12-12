"use strict";

import scaffold = require('./../scaffold');

export module Level21 {

    let decorator: Typeioc.Decorators.IDecorator;
    let builder: Typeioc.IContainerBuilder;

    export const decorators_lazy = {
        setUp: function (callback) {
            decorator = scaffold.createDecorator();
            builder = scaffold.createBuilder();
            callback();
        },

        self_resolution: (test) => {
        
            @decorator
                .provide<A>(A)
                .lazy()
                .register()
            class A {
                public get value() {
                    return 'value';
                }

                public child() {
                    const t = this.a as any as () => A;
                    return t();
                }
                
                constructor(private a: A) {
                }
            }

            const container = decorator.build();
            const a = container.resolve<() => A>(A)();

            test.strictEqual(a.value, 'value');
            test.strictEqual(a.child().value, 'value');

            test.done();
        },

        self_resolution_param_resolve: (test) => {
            
            @decorator
                .provide<A>(A)
                .lazy()
                .register()
            class A {
                public get value() {
                    return 'value';
                }

                public child() {
                    const t = this.a as () => A;
                    return t();
                }
                
                constructor(@decorator.by(A).resolve() private a) {
                }
            }

            const container = decorator.build();
            const a = container.resolve<() => A>(A)();

            test.strictEqual(a.value, 'value');
            test.strictEqual(a.child().value, 'value');

            test.done();
        },

        fibonacci: (test) => {

            @decorator
            .provide<F>(F)
            .lazy()
            .register()
            class F {
                constructor(@decorator.by(F).resolve() private f) {
                }

                public next(h, n) {
                    
                    const value = h;
                    const that = this;

                    return {
                        value,
                        get next() {
                            return (that.f() as F).next(n, h+n);
                        }
                    }
                }
            }
            
            const builder = decorator.build();
            
            const f = builder.resolve<() => F>(F)();
            const lazy = f.next(0, 1);

            const data = [...Array(10).keys()].reduce((acc, curnet) => {
                acc.result.push(acc.lazy.value);
                acc.lazy = acc.lazy.next;
                return acc;
            }, { lazy, result: [] });

            const expected = [0, 1, 1, 2, 3, 5, 8, 13, 21, 34];
            data.result.map((item, index) => {
                test.strictEqual(item, expected[index], `index : ${index}`);
            });

            test.done();
        },

        chain_resolution: (test) => {
            
            @decorator
            .provide<A>('A')
            .lazy()
            .register()
            class A {

                public get value() {
                    return 'A';
                }

                public get next() {
                    return this.b;
                }

                constructor(@decorator.by('B').resolve() private b) {
                }
            }
            
            @decorator
            .provide<B>('B')
            .register()
            class B {
                public get value() {
                    return 'B';
                }

                public get next() {
                    return this.c();
                }
                
                constructor(@decorator.by('C').resolve() private c) {
                }
            }
            
            @decorator
            .provide<C>('C')
            .lazy()
            .register()
            class C {
                public get value() {
                    return 'C';
                }

                public get next() {
                    return this.a();
                }

                constructor(@decorator.by('A').resolve() private a) {
                }
            }
        
            const container = decorator.build();
            const a = container.resolve<() => A>('A')();
            const b = container.resolve<B>('B');
            const c = container.resolve<() => C>('C')();

            test.strictEqual(a.value, 'A');
            test.strictEqual(a.next.value, 'B');
            test.strictEqual(b.next.value, 'C');
            test.strictEqual(c.value, 'C');
            test.strictEqual(c.next.value, 'A');
            
            test.done();
        },
        
        factory_decorator_lazy_side_by_side: (test) => {
            
            interface IFib {
                value: number;
                next: IFib;
            }
            
            builder.register('F')
            .as((c: Typeioc.IContainer, h, n) => {
                const a = c.resolve<() => IFib>('F', n, h + n);
               
                return {
                    value: h,
                    get next() {
                        return a();
                    }
               };
            })
            .lazy();
            
            @decorator
            .provide<F>(F)
            .lazy()
            .register()
            class F {
                constructor(@decorator.by(F).resolve() private f) {
                }
            
                public next(h, n) {
                    
                    const value = h;
                    const that = this;
            
                    return {
                        value,
                        get next() {
                            return (that.f() as F).next(n, h+n);
                        }
                    }
                }
            }
            
            decorator.import(builder);
            const container = decorator.build();
            
            const lazy1 = container.resolve<() => IFib>('F', 0, 1)();
            
            const data1 = [...Array(10).keys()].reduce((acc, curnet) => {
                acc.result.push(acc.lazy.value);
                acc.lazy = acc.lazy.next;
                return acc;
            }, { lazy: lazy1, result: [] });
            
            const f = container.resolve<() => F>(F)();
            const lazy2 = f.next(0, 1);
        
            const data2 = [...Array(10).keys()].reduce((acc, curnet) => {
                acc.result.push(acc.lazy.value);
                acc.lazy = acc.lazy.next;
                return acc;
            }, { lazy: lazy2, result: [] });
        

            test.deepEqual(data1.result, data2.result);

            test.done();
        }
            
    }        
}