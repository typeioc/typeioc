'use strict';

const scaffold = require('./../../scaffold');
let builder;

exports.api = {
    level21: {

        lazy_resolution: {
            setUp: function (callback) {
                builder = scaffold.createBuilder();
                callback();
            },

            self_resoltion: (test) => {
                
                builder.register('A')
                .as((c) => {
                   const a = c.resolve('A');
                   
                    return {
                        a: 'a',
                        get next() {
                            return a;
                        }
                   };     
                })
                .lazy();

                const continer = builder.build();
                const lazy = continer.resolve('A');
                const actual = lazy();
                const next = actual.next();
                const next2 = actual.next();

                test.strictEqual(actual.a, 'a');
                test.strictEqual(next.a, 'a');
                test.strictEqual(next2.a, 'a');
                test.done();
            },

            fibonacci: (test) => {

                builder.register('F')
                .as((c, h, n) => {
                    const a = c.resolve('F', n, h + n);
                   
                    return {
                        value: h,
                        get next() {
                            return a();
                        }
                   };
                })
                .lazy();

                const continer = builder.build();
                const lazy = continer.resolve('F', 0, 1)();

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

                builder.register('A')
                .as((c) => {
                    const b = c.resolve('B');
                    return { 
                        value: 'A',
                        b
                    };
                })
                .lazy();

                builder.register('B')
                .as((c) => {
                    const _c = c.resolve('C');
                    return { 
                        get value() {
                            return _c();
                        }
                    };
                });

                builder.register('C')
                .as((c) => {
                    const d = c.resolve('A');
                    return {
                        value: 'C',
                        d
                    };
                })
                .lazy();

                const container = builder.build();
                const a = container.resolve('A')();
                const b = container.resolve('B');
                const c = container.resolve('C')();

                test.strictEqual(a.value, 'A');
                test.strictEqual(b.value.value, 'C');
                test.strictEqual(c.value, 'C');
                test.done();
            },

            type_resolution: (test) => {
                
                class Type {
                    
                    constructor(dependency) {
                        this._d = dependency;
                        this._value = 'type';
                    }
                    
                    get value() {
                        return this._value;
                    }

                    set value(value) {
                        this._value = value;
                    }

                    get next() {
                        const d = this._d();
                        d.value = `${d.value || ''}:${this.value}`;
                        
                        return d;
                    }
                }

                builder.register('T')
                .asType(Type, 'T')
                .lazy();

                const container = builder.build();
                const t = container.resolve('T')(); 
                t.value = 'type';

                test.strictEqual(t.next.value, 'type:type');
                test.strictEqual(t.next.next.value, 'type:type:type');
                test.strictEqual(t.next.next.next.value, 'type:type:type:type');

                test.done();
            },

            type_chain_resolution: (test) => {
                
                class Type {
                    constructor(d) {
                        this._d = d;
                    }

                    get value() {
                        return 'type';
                    }

                    get next() {
                        return this._d;
                    }
                }

                function Type2(d) {
                    this._d = d;
                    this.value = 'type2';

                    this.next = function() {
                        return this._d();
                    }
                }

                function Type3(d) {
                    this._d = d;
                    this.value = 'type3';

                    this.next = function() {
                        return this._d;
                    }
                }

                builder.register('T1')
                .asType(Type, 'T2');

                builder.register('T2')
                .asType(Type2, 'T3');

                builder.register('T3')
                .asType(Type3, 'T1')
                .lazy();

                const container = builder.build();
                const t = container.resolve('T1'); 
                 
                test.strictEqual(t.value, 'type');
                test.strictEqual(t.next.value, 'type2');
                test.strictEqual(t.next.next().value, 'type3');
                test.strictEqual(t.next.next().next().value, 'type');

                test.done();
            }
        }
    }
}