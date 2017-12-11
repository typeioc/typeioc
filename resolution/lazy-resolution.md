# Lazy Resolution

Lazy resolution is used for situations where resolution of services has to be differed until results are needed by other services/computations. Specifically, arguments passed to a services are not evaluated before they are passed to a function/constructor, but only when their values are actually used. It is a responsibility of the calling services to evaluate lazy dependencies when needed.
All dependencies configured as lazy are passed as functions. The process of evaluation involves invoking corresponding functions and using their results.

To configure lazy service we mark it as *lazy* during registration as part of registration fluent API process. Lazy registration is also available for decorator style API registration.

#### TypeScript

```typescript
import * as typeioc from 'typeioc';

const builder = typeioc.createBuilder();

interface IFib {
    value: number;
    next: IFib;
}

builder.register('F')
.as((c: Typeioc.IContainer, h, n) => {
    const a = c.resolve<() => IFib>('F', n, h + n);

    return {
        value: h,
        get next() {
            return a();
        }
   };
})
.lazy();

const continer = builder.build();
const lazy = continer.resolve<() => IFib>('F', 0, 1)();

const data = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9].reduce((acc) => {
    acc.result.push(acc.lazy.value);
    acc.lazy = acc.lazy.next;
    return acc;
}, { lazy, result: [] });

```

<!--sec data-title="Run example" data-id="section0" data-show=true data-collapse=true ces-->

<iframe class="example" src="https://stackblitz.com/edit/tioc-lazy-resolution-ts?embed=1&file=index.ts">
</iframe>

<!--endsec-->

#### JavaScript

```javascript
import * as typeioc from 'typeioc';

const builder = typeioc.createBuilder();

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

const data = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9].reduce((acc) => {
    acc.result.push(acc.lazy.value);
    acc.lazy = acc.lazy.next;
    return acc;
}, { lazy, result: [] });

```

<!--sec data-title="Run example" data-id="section1" data-show=true data-collapse=true ces-->

<iframe class="example" src="https://stackblitz.com/edit/tioc-lazy-resolution-js?embed=1&file=index.js">
</iframe>

<!--endsec-->
