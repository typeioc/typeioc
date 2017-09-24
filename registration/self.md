# Self registration

Self registration is very similar to type registration, hence shares same benefits and limitations. For self registration we are registering a type as a type itself to participate in resolution process. To register a type, we have to use method **asSelf** of builder registration.



```typescript
/**
* Service registration using construct-able type as self
* @param {Array<any>} ...params - an array of services to be resolved as dependencies
* @returns - registration metadata specification instance
*/
asSelf(...params : Array<any>)
```

**params** represent rest parameters for dependencies of construct-able type and will be resolved automatically by container during resolution of type itself.

#### TypeScript

```typescript
import * as typeioc from 'typeioc';

class A {
    public get name(): string {
        return 'A';
    }
}

class B {

    constructor(private a: A) {
    }

    public get name(): string {
        return `${this.a.name} B`;
    }
}

const builder = typeioc.createBuilder();
builder.register(A).asSelf();
builder.register(B).asSelf(A);
```

<!--sec data-title="Run example" data-id="section0" data-show=true data-collapse=true ces-->

<iframe class="example" src="https://stackblitz.com/edit/tioc-self-registration-ts?embed=1&file=index.ts">
</iframe>

<!--endsec-->

#### JavaScript

```javascript
import * as typeioc from 'typeioc';

class A {
    get name() {
        return 'A';
    }
}

class B {

    constructor(a) {
        this.a = a;
    }

    get name() {
        return `${this.a.name} B`;
    }
}

const builder = typeioc.createBuilder();
builder.register(A).asSelf();
builder.register(B).asSelf(A);
```

<!--sec data-title="Run example" data-id="section1" data-show=true data-collapse=true ces-->

<iframe class="example" src="https://stackblitz.com/edit/tioc-self-registration-js?embed=1&file=index.js">
</iframe>

<!--endsec-->
