# Instance per container

For situations where component instances have to be nested per scopes, instance per container life cycle is used. When this option is specified, every nested container will have its own and only one instance of a component. This option provides the best mechanism for dealing with multiple short lived cascading computations, while collecting their results.

### Synopsis

```typescript
/**
* Specifies instance per container resolution.
* Every time a service is resolved, the same instance of component
* per container is returned.
*/
registration.instancePerContainer()
```

#### TypeScript

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
.instancePerContainer();

builder.register('A')
.asType(A).instancePerContainer();
builder.register(A)
.asSelf().instancePerContainer();
```

<!--sec data-title="Run example" data-id="section0" data-show=true data-collapse=true ces-->

<iframe class="example" src="https://stackblitz.com/edit/tioc-instance-per-container-scope-ts?embed=1&file=index.ts">
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
.instancePerContainer();

builder.register('A')
.asType(A)
.instancePerContainer();
builder.register(A)
.asSelf()
.instancePerContainer();
```

<!--sec data-title="Run example" data-id="section1" data-show=true data-collapse=true ces-->

<iframe class="example" src="https://stackblitz.com/edit/tioc-instance-per-container-scope-js?embed=1&file=index.js">
</iframe>

<!--endsec-->