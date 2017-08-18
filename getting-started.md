# Getting started

Import TypeIOC instance first:

```typescript
import * as typeioc from 'typeioc'; // ES2015

const typeioc = require('typeioc'); // CommonJS
```

For TypeScript add the path to TypeIOC definition file into your tsconfig.json as well as support for experimental decorators:

```json
{
  "compilerOptions": {
    "experimentalDecorators" : true,
    "emitDecoratorMetadata" : true
    ...
  },
  "files": [
    "node_modules/typeioc/d.ts/typeioc.d.ts"
    ...
  ]
}
```

Before we get into detailed explanation, let's take a look at quick example:

```typescript
class SimpleClass {
    private _notSoSimple: NotSoSimpleClass;

    constructor() {
        this._notSoSimple = new NotSoSimpleClass();
    }
}
```

There are a couple of problems with the code above.

SimpleClass knows "too much" about details of NotSoSimpleClass. For example, nin future NotSoSimpleClass might take dependencies on its own to compliate things even more. Instantiaton of _notSoSimple property might be moved to any arbitrary method of SimpleClass creating not so clear dependency. Unit testing SimpleClass requires substitution on _notSoSimple with some sort of mock, yet setting up different value for the private property. Effectively, this way unit test knows "too much" about SimpleClass internal details.

Let's rewrite SimpleClass slightly differently.

```typescript
class SimpleClass {
    constructor(private _notSoSimple: NotSoSimpleClass) {
        ...
    }
}

class NotSoSimpleClass {
    ...
}
```

Here we made our dependency explicit. But there is a price to pay. Somebody has to instantiate NotSoSimpleClass.

<br/>
> Hollywood Principle<br/>
> Don’t Call Us, We’ll Call You!

Hollywood Principle helps reducing couping in software. It provides a mechanism for keeping classes/components loosely coupled by removing unnecessary references. Dependency Injecting is one example of Hollywood Principle implementation. It provides a mechanism for automatic dependency "substitution" for requested component. This way, for our example, SimpleClass is created with all the dependencies resolved.

## So what is TypeIOC used for

* Dependencies management
* Component life cycle management
* Component behavior manipulation.
* Syntactic sugar / type checking if used with typescript

## How is it used

* Create a container builder instance
* Define dependencies between objects by registering all the required services as components/dependencies
* Create container instance
* Resolve services by calling "factory method" to get an instance of dependencies needed

<br/>

Let's register all the components with their dependencies and resolve then when needed.

#### TypeScript

```typescript
import * as typeioc from 'typeioc'

class SimpleClass {
    constructor(private _notSoSimple: NotSoSimpleClass) {
    }

    public get name() : string {
        return `Simple : ${this._notSoSimple.name}`;
    }
}

class NotSoSimpleClass {
    public get name() : string {
        return 'Not So Simple';
    }
}

const builder = typeioc.createBuilder();
builder.register(NotSoSimpleClass)
.as(() => new NotSoSimpleClass());

builder.register(SimpleClass)
.as((c) => {
    const notSoSimple = c.resolve<NotSoSimpleClass>(NotSoSimpleClass);
    return new SimpleClass(notSoSimple);
});

const container = builder.build();
const instance = container.resolve<SimpleClass>(SimpleClass);
```

<!--sec data-title="Run example" data-id="section0" data-show=true data-collapse=true ces-->

<iframe class="example" src="https://stackblitz.com/edit/tioc-getting-started-ts?embed=1&file=index.ts">
</iframe>

<!--endsec-->

#### JavaScript

```javascript
import * as typeioc from 'typeioc';

class SimpleClass {

    constructor(notSoSimple) {
      this._notSoSimple = notSoSimple;
    }

    get name() {
        return `Simple : ${this._notSoSimple.name}`;
    }
}

class NotSoSimpleClass {
    get name() {
        return 'Not So Simple';
    }
}

const builder = typeioc.createBuilder();
builder.register(NotSoSimpleClass)
.as(() => new NotSoSimpleClass());

builder.register(SimpleClass)
.as((c) => {
    const notSoSimple = c.resolve(NotSoSimpleClass);
    return new SimpleClass(notSoSimple);
});

const container = builder.build();
const instance = container.resolve(SimpleClass);
```

<!--sec data-title="Run example" data-id="section1" data-show=true data-collapse=true ces-->

<iframe class="example" src="https://stackblitz.com/edit/tioc-getting-started-js?embed=1&file=index.js">
</iframe>

<!--endsec-->
