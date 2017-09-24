# Value registration

Value registration is the simplest form of registration. It is useful when no type construction / factory invocation needed at all. We are just registering a value of any type as is to be used by different components. To register a value, we have to use method **asValue** of builder registration.

### Synopsis

```typescript
/**
* @param {any} value - value to be registered
* @returns {object} - registration type specification instance
*/
asValue(value)
```

#### TypeScript

```typescript
import * as typeioc from 'typeioc';

const create = (data: string) => ({
    get value() {
        return data;
    }
});

const builder = typeioc.createBuilder();
builder.register(1).asValue('A');
builder.register(2).asValue('B');
builder.register('service')
.as((c) => {
    const a = create(c.resolve<string>(1)).value;
    const b = create(c.resolve<string>(2)).value;
    return `${a} ${b}`;
});
```

<!--sec data-title="Run example" data-id="section0" data-show=true data-collapse=true ces-->

<iframe class="example" src="https://stackblitz.com/edit/tioc-value-registration-ts?embed=1&file=index.ts">
</iframe>

<!--endsec-->

#### JavaScript

```javascript
import * as typeioc from 'typeioc';

const create = (data) => ({
    get value() {
        return data;
    }
});

const builder = typeioc.createBuilder();
builder.register(1).asValue('A');
builder.register(2).asValue('B');
builder.register('service')
.as((c) => {
    const a = create(c.resolve(1)).value;
    const b = create(c.resolve(2)).value;
    return `${a} ${b}`;
});
```

<!--sec data-title="Run example" data-id="section1" data-show=true data-collapse=true ces-->

<iframe class="example" src="https://stackblitz.com/edit/tioc-value-registration-js?embed=1&file=index.js">
</iframe>
