"use strict";

import scaffold = require('./../scaffold');

export module Level20 {

    export const decorators_circular = {

        resolve_throws_when_two_services(test) {

            const decorator = scaffold.createDecorator();

            abstract class ABase {}

            abstract class BBase {}

            @decorator.provide<A>(ABase).register()
            class A extends ABase {
                constructor(private _b: BBase) {
                    super();
                 }
            }

            @decorator.provide<B>(BBase).register()
            class B extends BBase {
                constructor(private _a: ABase) {
                    super();
                }
            }

            const container = decorator.build();

            test.throws(() => {
                container.resolve(ABase)
            }, function (err) {
                return (err instanceof scaffold.Exceptions.CircularDependencyError) &&
                    /Circular dependency for service: class ABase/.test(err.message);
            });

            test.throws(() => {
                container.resolve(BBase)
            }, function (err) {
                return (err instanceof scaffold.Exceptions.CircularDependencyError) &&
                    /Circular dependency for service: class BBase/.test(err.message);
            });

            test.done();
        },

        resolve_throws_when_multple_services(test) {

            const decorator = scaffold.createDecorator();

            abstract class ABase {}

            abstract class BBase {}

            abstract class CBase {}

            @decorator.provide<A>(ABase).register()
            class A extends ABase {
                constructor(private _b: BBase) {
                    super();
                 }
            }

            @decorator.provide<B>(BBase).register()
            class B extends BBase {
                constructor(private _c: CBase) {
                    super();
                }
            }

            @decorator.provide<C>(CBase).register()
            class C extends CBase {
                constructor(@decorator.by(ABase).resolve() private _a) {
                    super();
                }
            }

            const container = decorator.build();

            test.throws(() => {
                container.resolve(CBase)
            }, function (err) {
                return (err instanceof scaffold.Exceptions.CircularDependencyError) &&
                    /Circular dependency for service: class CBase/.test(err.message);
            });

            test.done();
        }

    }
}
