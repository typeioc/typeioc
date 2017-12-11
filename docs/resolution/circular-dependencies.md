# Circular dependency

When two or more services depend on each other directly on indirectly with have a situation of circular dependency. As a result none of the dependent services could be resolved as they quickly get into infinite recursion cycle. Consider following example:

```typescript

builder.register(A)
.as(c => {
    const b = c.resolve(B);

    return { b };
});

builder.register(B)
.as(c => {
    const a = c.resolve(A);

    return { a };
})
```

To prevent this situation from happening TypeIOC has build in mechanism of circular dependency run-time detection. In the situation above an attempt to resolve either of services results a run-time exception explaining which service is circularly dependent.

#### TypeScript

```typescript
import * as typeioc from 'typeioc';

const builder = typeioc.createBuilder();

class A {
    constructor(private b){}
}

class B {
    constructor(private a){}
}

builder.register(A)
.as((c) => {
    const b = c.resolve(B);
    return new A(b);
});

builder.register(B)
.as((c) => {
    const a = c.resolve(A);
    return new B(a);
});
```

<!--sec data-title="Run example" data-id="section0" data-show=true data-collapse=true ces-->

<iframe class="example" src="https://stackblitz.com/edit/tioc-circular-dependency-ts?embed=1&file=index.ts">
</iframe>

<!--endsec-->

#### JavaScript

```javascript
import * as typeioc from 'typeioc';

const builder = typeioc.createBuilder();

class A {
    constructor(b){}
}

class B {
    constructor(a){}
}

builder.register(A)
.as((c) => {
    const b = c.resolve(B);
    return new A(b);
});

builder.register(B)
.as((c) => {
    const a = c.resolve(A);
    return new B(a);
});
```

<!--sec data-title="Run example" data-id="section1" data-show=true data-collapse=true ces-->

<iframe class="example" src="https://stackblitz.com/edit/tioc-circular-dependency-js?embed=1&file=index.js">
</iframe>

<!--endsec-->
