# Type registration

As opposite to factory registration, type registration is intended for construct-able types only: class, function, etc ... It uses new operator to instantiate the service being resolved. In exchange for this limitation, user gets an advantage of not declaring service dependencies construction. To register a type, we have to use method **asType** of builder registration.

### Synopsis

```typescript
/**
* Service registration using construct-able types
* @param {T} type - construct-able type: class, function, etc...
* @param {Array<any>} ...params - an array of services to be resolved as dependencies
* @returns - registration metadata specification instance
*/
asType(type: T, ...params: Array<any>)
```

**params** represent rest parameters for dependencies of construct-able type T and will be resolved automatically by container during resolution of type T.

#### TypeScript

```typescript
import * as typeioc from 'typeioc';

class ABase {
    public get name(): string {
        return null;
    }
}

class A extends ABase {
    public get name(): string {
        return 'A';
    }
}

class B {

    public get name(): string {
        return 'B';
    }
}

function C(a:A, b:B) {
    this._name = 'C';
    this._a = a;
    this._b = b;
}

C.prototype.name = function(): string {
    return `${this._a.name} ${this._b.name} ${this._name}`;
}

const builder = typeioc.createBuilder();
builder.register(ABase).asType(A);
builder.register('B').asType(B);
builder.register(C).asType(C, ABase, 'B');
```

<!--sec data-title="Run example" data-id="section0" data-show=true data-collapse=true ces-->

<iframe class="example" src="https://stackblitz.com/edit/tioc-type-registration-ts?embed=1&file=index.ts">
</iframe>

<!--endsec-->

#### JavaScript

```javascript
import * as typeioc from 'typeioc';

class ABase {
    get name() {
        return null;
    }
}

class A extends ABase {
    get name() {
        return 'A';
    }
}

class B {
    get name() {
        return 'B';
    }
}

function C(a, b) {
    this._name = 'C';
    this._a = a;
    this._b = b;
}

C.prototype.name = function() {
    return `${this._a.name} ${this._b.name} ${this._name}`;
}

const builder = typeioc.createBuilder();
builder.register(ABase).asType(A);
builder.register('B').asType(B);
builder.register(C).asType(C, ABase, 'B');
```

<!--sec data-title="Run example" data-id="section1" data-show=true data-collapse=true ces-->

<iframe class="example" src="https://stackblitz.com/edit/tioc-type-registration-js?embed=1&file=index.js">
</iframe>

<!--endsec-->
