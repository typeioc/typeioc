# Cached resolution

Every resolution has an option to cache its results. Cached result is not the same as [singleton](../life-cycle/singleton.md) life cycle instance result. Caching keeps components aside for the sake of providing high performance access. Cache option is available as part of fluent cascading interface starting with **resolveWith** method.

### Synopsis

```typescript
/** Caches resolved component
* @param {string} - name?, optional name to be cached under
*/
cache(name? : string)
```

**Container** instance has a **cache** property. It represents a dictionary of cached components. After component was cached, the access to it is available through the property of **cache**. The rules of computing property name have following priorities (from highest to lowest).

* **name** parameter for **cache** method specified during resolution.
* **name** parameter used for named registrations.
* service parameter represents an object with **name** property.
* service parameter represent a string object.

#### TypeScript

```typescript
import * as typeioc from 'typeioc';

class A {
    public get name() { return 'A'; }
}

class B {
    public get name() { return 'B'; }
}

const builder = typeioc.createBuilder();
builder.register('A')
    .as(()=> new A());
builder.register('B')
    .as(() => new B())
    .named('b1');

const c = { name: 'C' };

builder.register(c).asValue(c);

const container = builder.build();
const a1 = container
    .resolveWith<A>('A')
    .cache('a1')
    .exec();

const b1 = container
    .resolveWith<B>('B')
    .name('b1')
    .cache()
    .exec();

const c1 = container
    .resolveWith<{name: string}>(c)
    .cache()
    .exec();

const a2 = <A>container.cache.a1;
const b2 = <B>container.cache.b1;
const c2 = container.cache.C;
```

<!--sec data-title="Run example" data-id="section0" data-show=true data-collapse=true ces-->

<iframe class="example" src="https://stackblitz.com/edit/tioc-cached-resolution-ts?embed=1&file=index.ts">
</iframe>

<!--endsec-->

#### JavaScript

```javascript
import * as typeioc from 'typeioc';

class A {
    get name() { return 'A'; }
}

class B {
    get name() { return 'B'; }
}

const builder = typeioc.createBuilder();
builder.register('A')
    .as(()=> new A());
builder.register('B')
    .as(() => new B())
    .named('b1');

const c = { name: 'C' };

builder.register(c).asValue(c);

const container = builder.build();
const a1 = container
    .resolveWith('A')
    .cache('a1')
    .exec();
const b1 = container
    .resolveWith('B')
    .name('b1')
    .cache()
    .exec();

const c1 = container
    .resolveWith(c)
    .cache()
    .exec();

const a2 = container.cache.a1;
const b2 = container.cache.b1;
const c2 = container.cache.C;
```

<!--sec data-title="Run example" data-id="section1" data-show=true data-collapse=true ces-->

<iframe class="example" src="https://stackblitz.com/edit/tioc-cached-resolution-js?embed=1&file=index.js">
</iframe>

<!--endsec-->
