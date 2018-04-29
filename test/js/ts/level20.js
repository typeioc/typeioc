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
var Level20;
(function (Level20) {
    Level20.decorators_circular = {
        resolve_throws_when_two_services(test) {
            const decorator = scaffold.createDecorator();
            class ABase {
            }
            class BBase {
            }
            let A = class A extends ABase {
                constructor(_b) {
                    super();
                    this._b = _b;
                }
            };
            A = __decorate([
                decorator.provide(ABase).register(),
                __metadata("design:paramtypes", [BBase])
            ], A);
            let B = class B extends BBase {
                constructor(_a) {
                    super();
                    this._a = _a;
                }
            };
            B = __decorate([
                decorator.provide(BBase).register(),
                __metadata("design:paramtypes", [ABase])
            ], B);
            const container = decorator.build();
            test.throws(() => {
                container.resolve(ABase);
            }, function (err) {
                return (err instanceof scaffold.Exceptions.CircularDependencyError) &&
                    /Circular dependency for service: class ABase/.test(err.message);
            });
            test.throws(() => {
                container.resolve(BBase);
            }, function (err) {
                return (err instanceof scaffold.Exceptions.CircularDependencyError) &&
                    /Circular dependency for service: class BBase/.test(err.message);
            });
            test.done();
        },
        resolve_throws_when_multple_services(test) {
            const decorator = scaffold.createDecorator();
            class ABase {
            }
            class BBase {
            }
            class CBase {
            }
            let A = class A extends ABase {
                constructor(_b) {
                    super();
                    this._b = _b;
                }
            };
            A = __decorate([
                decorator.provide(ABase).register(),
                __metadata("design:paramtypes", [BBase])
            ], A);
            let B = class B extends BBase {
                constructor(_c) {
                    super();
                    this._c = _c;
                }
            };
            B = __decorate([
                decorator.provide(BBase).register(),
                __metadata("design:paramtypes", [CBase])
            ], B);
            let C = class C extends CBase {
                constructor(_a) {
                    super();
                    this._a = _a;
                }
            };
            C = __decorate([
                decorator.provide(CBase).register(),
                __param(0, decorator.by(ABase).resolve()),
                __metadata("design:paramtypes", [Object])
            ], C);
            const container = decorator.build();
            test.throws(() => {
                container.resolve(CBase);
            }, function (err) {
                return (err instanceof scaffold.Exceptions.CircularDependencyError) &&
                    /Circular dependency for service: class CBase/.test(err.message);
            });
            test.done();
        }
    };
})(Level20 = exports.Level20 || (exports.Level20 = {}));
//# sourceMappingURL=level20.js.map