# Singleton instance

Singleton life time cycle prescribes instances to be created only once regardless of scope nesting level. In other words, every single resolution of the same service will return the instance for exactly the same component.

```typescript
/**
* Specifies singleton resolution.
* Every time a service is resolved, the same instance of component is returned.
*/
registration.singleton()
```

#### Typescript

```typescript
import * as typeioc from 'typeioc';

const state = {
    data: {},
    add: (value) => {
        const bucket = state.data[value] || 0;
        state.data[value] = bucket + 1;
    }
};

class A {
    constructor() {
        state.add('A');
    }
}

const create = () => {
    state.add('B');

    return { };
};

const builder = typeioc.createBuilder();
builder.register('create')
.as(() => create())
.singleton();

builder.register('A')
.asType(A).singleton();
builder.register(A)
.asSelf().singleton();
```

<!--sec data-title="Run example" data-id="section0" data-show=true data-collapse=true ces-->

<iframe class="example" src="https://stackblitz.com/edit/tioc-singleton-scope-ts?embed=1&file=index.ts">
</iframe>

<!--endsec-->

#### JavaScript

```javascript
import * as typeioc from 'typeioc';

const state = {
    data: {},
    add: (value) => {
        const bucket = state.data[value] || 0;
        state.data[value] = bucket + 1;
    }
};

class A {
    constructor() {
        state.add('A');
    }
}

const create = () => {
    state.add('B');

    return { };
};

const builder = typeioc.createBuilder();
builder.register('create')
.as(() => create())
.singleton();

builder.register('A')
.asType(A).singleton();
builder.register(A)
.asSelf().singleton();
```

<!--sec data-title="Run example" data-id="section1" data-show=true data-collapse=true ces-->

<iframe class="example" src="https://stackblitz.com/edit/tioc-singleton-scope-js?embed=1&file=index.js">
</iframe>

<!--endsec-->
