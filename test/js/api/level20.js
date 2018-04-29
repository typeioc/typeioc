'use strict';

const scaffold = require('../scaffold');
let builder;

exports.api = {
    level20: {

        circular_dependency: {
            setUp: function (callback) {
                builder = scaffold.createBuilder();
                callback();
            },

            resolution_throws_when_two_components: (test) => {
                
                builder.register('A')
                .as((c) => {
                    const b = c.resolve('B');
                    return { b };
                });

                builder.register('B')
                .as((c) => {
                    const a = c.resolve('A');
                    return { a };
                });

                const container = builder.build();
                const child = container.createChild();
                
                test.throws(() => {
                    container.resolve('A');
                }, function (err) {
                    return (err instanceof scaffold.Exceptions.CircularDependencyError) && /Circular dependency for service: A/.test(err.message);
                });

                test.throws(() => {
                    child.resolve('B');
                }, function (err) {
                    return (err instanceof scaffold.Exceptions.CircularDependencyError) && /Circular dependency for service: A/.test(err.message);
                });
  
                test.done();
            },

            resolution_throws_when_one_component: (test) => {
                
                builder.register('A')
                .as((c) => {
                    const b = c.resolve('A');
                    return { b };
                });
                
                const container = builder.build();
                
                test.throws(() => {
                    container.resolve('A');
                }, function (err) {
                    return (err instanceof scaffold.Exceptions.CircularDependencyError) && /Circular dependency for service: A/.test(err.message);
                });

                test.done();
            },

            resolution_throws_when_container_scope: (test) => {
                
                builder.register('A')
                .as((c) => {
                    const b = c.resolve('B');
                    return { b };
                });

                builder.register('B')
                .as((c) => {
                    const a = c.resolve('A');
                    return { a };
                })
                .instancePerContainer();
                
                const container = builder.build();
                const child = container.createChild();

                test.throws(() => {
                    container.resolve('A');
                }, function (err) {
                    return (err instanceof scaffold.Exceptions.CircularDependencyError) && /Circular dependency for service: A/.test(err.message);
                });

                test.throws(() => {
                    child.resolve('B');
                }, function (err) {
                    return (err instanceof scaffold.Exceptions.CircularDependencyError) && /Circular dependency for service: B/.test(err.message);
                });

                test.done();
            },

            resolution_throws_when_hierarchy_scope: (test) => {
                
                builder.register('A')
                .as((c) => {
                    const b = c.resolve('B');
                    return { b };
                });

                builder.register('B')
                .as((c) => {
                    const a = c.resolve('A');
                    return { a };
                })
                .singleton();
                
                const container = builder.build();
                const child = container.createChild();

                test.throws(() => {
                    container.resolve('A');
                }, function (err) {
                    return (err instanceof scaffold.Exceptions.CircularDependencyError) && /Circular dependency for service: A/.test(err.message);
                });

                test.throws(() => {
                    child.resolve('B');
                }, function (err) {
                    return (err instanceof scaffold.Exceptions.CircularDependencyError) && /Circular dependency for service: B/.test(err.message);
                });

                test.done();
            },

            resolution_throws_when_multiple_nodes_in_chain: (test) => {
                
                builder.register('A')
                .as((c) => {
                    const b = c.resolve('B');
                    return { b };
                });

                builder.register('B')
                .as((c) => {
                    const _c = c.resolve('C');
                    return { _c };
                });

                builder.register('C')
                .as((c) => {
                    const d = c.resolve('D');
                    return { d };
                });

                builder.register('D')
                .as((c) => {
                    const b = c.resolve('B');
                    return { b };
                });
                
                const container = builder.build();
                
                test.throws(() => {
                    container.resolve('A');
                }, function (err) {
                    return (err instanceof scaffold.Exceptions.CircularDependencyError) && /Circular dependency for service: B/.test(err.message);
                });

                test.done();
            },

            resolution_with_promises_throws: (test) => {
                
                builder.register('A')
                .as((c) => {
                    const b = c.resolve('B');
                    return { b };
                });

                builder.register('B')
                .as((c) => {
                    const _c = c.resolve('C');
                    return { _c };
                });

                builder.register('C')
                .as((c) => {
                    const d = c.resolve('D');
                    return { d };
                });

                builder.register('D')
                .as((c) => {
                    const b = c.resolve('C');
                    return { b };
                });
                
                const container = builder.build();
                
                const promises = [
                    container.resolveAsync('A').catch(error => error),
                    container.resolveAsync('B').catch(error => error),
                    container.resolveAsync('C').catch(error => error),
                    container.resolveAsync('D').catch(error => error)
                ];

                Promise.all(promises)
                .then(([a, b, c, d]) => {

                    const verifyError = (error, errorService) => {
                        test.ok(error instanceof scaffold.Exceptions.CircularDependencyError);
                        const regex = new RegExp(`Circular dependency for service: ${errorService}`);
                        test.ok(regex.test(error.message));
                    };

                    verifyError(a, 'C');
                    verifyError(b, 'C');
                    verifyError(c, 'C');
                    verifyError(d, 'D');
                    
                    test.done();
                });
            },

            resolution_with_promises_resolves: (test) => {
                
                builder.register('A')
                .as((c) => {
                    const b = c.resolve('B');
                    return { b };
                });

                builder.register('B')
                .as((c) => {
                    const _c = c.resolve('C');
                    return { _c };
                });

                builder.register('C')
                .as((c) => {
                    const d = c.resolve('D');
                    return { d };
                });

                builder.register('D')
                .as((c) => {
                    return { d: 'd' };
                });
                
                const container = builder.build();
                
                const promises = [
                    container.resolveAsync('A'),
                    container.resolveAsync('B'),
                    container.resolveAsync('A'),
                    container.resolveAsync('C'),
                    container.resolveAsync('D')
                ];

                Promise.all(promises)
                .then(([a, b, a1,c, d]) => {

                    test.ok(a);
                    test.ok(b);
                    test.ok(a1);
                    test.ok(c);
                    test.ok(d);

                    test.done();
                });
            },

            resolution_with_types_throws: (test) => {

                class A {
                    constructor(b) {
                        this.b = b;
                    }
                }

                class B {
                    constructor(a) {
                        this.a = a;
                    }
                }

                builder.register(A).asType(A, 'B');
                builder.register('B').asType(B, A);
                
                const container = builder.build();

                test.throws(() => {
                    container.resolve(A);
                }, function (err) {
                    return (err instanceof scaffold.Exceptions.CircularDependencyError) && /Circular dependency for service:/.test(err.message);
                });

                test.done();
            },

            resolution_with_types_throws: (test) => {

                class A {
                    constructor(b) {
                        this.b = b;
                    }
                }

                class B {
                    constructor(a) {
                        this.a = a;
                    }
                }

                builder.register(A).asType(A, 'B');
                builder.register('B').asType(B, A);
                
                const container = builder.build();
                
                test.throws(() => {
                    container.resolve(A);
                }, function (err) {
                    return (err instanceof scaffold.Exceptions.CircularDependencyError) && /Circular dependency for service:/.test(err.message);
                });
               
                test.done();
            },

            resolution_with_mixed_types_throws: (test) => {
                
                class A {
                    constructor(b) {
                        this.b = b;
                    }
                }

                function B(a) {
                    this.a = a;
                }

                builder.register(A).asType(A, 'B');
                builder.register('B').asType(B, A);
                
                const container = builder.build();
                
                test.throws(() => {
                    container.resolve(A);
                }, function (err) {
                    return (err instanceof scaffold.Exceptions.CircularDependencyError) && /Circular dependency for service:/.test(err.message);
                });
               
                test.done();
            },

            resolution_throws_with_dynamic_dependencies: (test) => {
                
                builder.register('A')
                .as((c) => ({ a: c.resolve('C') }));

                builder.register('B')
                .as((c) => ({ b: c.resolve('B')}));

                builder.register('C')
                .as(() => ({ c: 'c'}));

                const container = builder.build();
                
                test.throws(() => {
                    container.resolveWithDependencies('A', [{
                        service: 'C',
                        factory: (c) => {
                            return c.resolve('B') 
                        }
                    }]);
                }, function (err) {
                    return (err instanceof scaffold.Exceptions.CircularDependencyError) &&
                        /Circular dependency for service: B/.test(err.message);
                });
                
                test.done();
            },

            resolution_fix_with_dynamic_dependencies: (test) => {
                
                builder.register('A')
                .as((c) => ({ a: c.resolve('B') }));

                builder.register('B')
                .as((c) => ({ b: c.resolve('C')}));

                builder.register('C')
                .as((c) => ({ c: c.resolve('A')}));

                const container = builder.build();
                
                test.throws(() => {
                    container.resolve('A');
                }, function (err) {
                    return (err instanceof scaffold.Exceptions.CircularDependencyError) &&
                        /Circular dependency for service: A/.test(err.message);
                });

                test.throws(() => {
                    container.resolve('B');
                }, function (err) {
                    return (err instanceof scaffold.Exceptions.CircularDependencyError) &&
                        /Circular dependency for service: B/.test(err.message);
                });

                test.throws(() => {
                    container.resolve('C');
                }, function (err) {
                    return (err instanceof scaffold.Exceptions.CircularDependencyError) &&
                        /Circular dependency for service: C/.test(err.message);
                });

                const actual = container.resolveWithDependencies('A', [{
                    service: 'B',
                    factory: (c) => 'AAA'
                }]);
                
                test.strictEqual(actual.a, 'AAA');

                test.done();
            }
        }
    }
}