"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
const scaffold = require("./../scaffold");
var Level21;
(function (Level21) {
    let decorator;
    Level21.decorators_lazy = {
        setUp: function (callback) {
            decorator = scaffold.createDecorator();
            callback();
        },
        self_resolution: (test) => {
            let A = A_1 = class A {
                constructor(a) {
                    this.a = a;
                }
                get value() {
                    return 'value';
                }
                child() {
                    const t = this.a;
                    return t();
                }
            };
            A = A_1 = __decorate([
                decorator
                    .provide(A_1)
                    .lazy()
                    .register(),
                __metadata("design:paramtypes", [A])
            ], A);
            const container = decorator.build();
            const a = container.resolve(A)();
            test.strictEqual(a.value, 'value');
            test.strictEqual(a.child().value, 'value');
            test.done();
            var A_1;
        },
        self_resolution_param_resolve: (test) => {
            let A = A_2 = class A {
                constructor(a) {
                    this.a = a;
                }
                get value() {
                    return 'value';
                }
                child() {
                    const t = this.a;
                    return t();
                }
            };
            A = A_2 = __decorate([
                decorator
                    .provide(A_2)
                    .lazy()
                    .register(),
                __param(0, decorator.by(A_2).resolve()),
                __metadata("design:paramtypes", [Object])
            ], A);
            const container = decorator.build();
            const a = container.resolve(A)();
            test.strictEqual(a.value, 'value');
            test.strictEqual(a.child().value, 'value');
            test.done();
            var A_2;
        },
        fibonacci: (test) => {
            let F = F_1 = class F {
                constructor(f) {
                    this.f = f;
                }
                next(h, n) {
                    const value = h;
                    const that = this;
                    return {
                        value,
                        get next() {
                            return that.f().next(n, h + n);
                        }
                    };
                }
            };
            F = F_1 = __decorate([
                decorator
                    .provide(F_1)
                    .lazy()
                    .register(),
                __param(0, decorator.by(F_1).resolve()),
                __metadata("design:paramtypes", [Object])
            ], F);
            const builder = decorator.build();
            const f = builder.resolve(F)();
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
            var F_1;
        },
        chain_resolution: (test) => {
            let A = class A {
                constructor(b) {
                    this.b = b;
                }
                get value() {
                    return 'A';
                }
                get next() {
                    return this.b;
                }
            };
            A = __decorate([
                decorator
                    .provide('A')
                    .lazy()
                    .register(),
                __param(0, decorator.by('B').resolve()),
                __metadata("design:paramtypes", [Object])
            ], A);
            let B = class B {
                constructor(c) {
                    this.c = c;
                }
                get value() {
                    return 'B';
                }
                get next() {
                    return this.c();
                }
            };
            B = __decorate([
                decorator
                    .provide('B')
                    .register(),
                __param(0, decorator.by('C').resolve()),
                __metadata("design:paramtypes", [Object])
            ], B);
            let C = class C {
                constructor(a) {
                    this.a = a;
                }
                get value() {
                    return 'C';
                }
                get next() {
                    return this.a();
                }
            };
            C = __decorate([
                decorator
                    .provide('C')
                    .lazy()
                    .register(),
                __param(0, decorator.by('A').resolve()),
                __metadata("design:paramtypes", [Object])
            ], C);
            const container = decorator.build();
            const a = container.resolve('A')();
            const b = container.resolve('B');
            const c = container.resolve('C')();
            test.strictEqual(a.value, 'A');
            test.strictEqual(a.next.value, 'B');
            test.strictEqual(b.next.value, 'C');
            test.strictEqual(c.value, 'C');
            test.strictEqual(c.next.value, 'A');
            test.done();
        }
    };
})(Level21 = exports.Level21 || (exports.Level21 = {}));
//# sourceMappingURL=level21.js.map