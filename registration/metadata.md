# Registration metadata

Every registration has several customization options, things that affect its behavior and resolution process.

* ## Initialization

Registration might specify an action, performed over a component during resolution.

```typescript
interface IInitializer<T> {
    (c:IContainer, item : T) : T;
}

/**
* @param {IInitializer<T>} action - lambda expression executed during component
* resolution, right after component initialization
*/
initializeBy(action : IInitializer<T>)
```

* ## Lazy instantiation

Specifies lazily resolved services.
[More info](../resolution/lazy-resolution.md)

```typescript
lazy()
```

* ## Naming

Registration might have a name associated with it. In this case, a service can be resolved using only the name specified. Named registrations are useful for registering the same service several times with different names.

```typescript
/**
* @param {string} name - registration name.
* A service will be resolved only using the name specified.
*/
named : (name: string)
```

* ## Reusability / life cycle

Reusability defines component repeated resolution behavior.

```typescript
/**
* Specifies transient resolution.
* Every time a service is resolved, a new instance of component is returned.
*/
transient()

/**
* Specifies singleton resolution.
* Every time a service is resolved, the same instance of component is returned.
*/
singleton()

/**
* Specifies instancePerContainer resolution.
* Every time a service is resolved, the same instance of component per
* container is returned.
*/
instancePerContainer()
```

[More info](../life-cycle/)

* ## Ownership

Ownership defines component disposal behavior if any provided.

```typescript
/**
* Component ownership is maintained by container (default behavior)
*/
ownedInternally()

/**
* Component ownership is maintained by external code
*/
ownedExternally()

interface IDisposer<T> {
    (item : T) : void;
}

/**
* For internal owned instances, where dispose action is specified,
* it is invoked during container disposal
* @param {IDisposer<T>} action - lambda expression for component disposal.
* It's invoked with an instance of component
*/
dispose : (action : IDisposer<T>)
```

[More info](../life-cycle/)

All the methods for the metadata specification are optional and implemented using cascading fluent interface. Cascading priorities: *initializeBy -> dispose -> named -> (transient | singleton | instancePerContainer) -> (ownedInternally | ownedExternally)*

#### TypeScript

```typescript
import * as typeioc from 'typeioc';

let state = '';

interface ICreate {
  init: () => void;
  cleanup: () => void;
}

const create = (): ICreate => ({
    init() {
        state+= ' initialized';
    },

    cleanup() {
        state+= ' disposed';
    }
});

const builder = typeioc.createBuilder();
builder.register<ICreate>('ServiceA')
    .as(() => create())
    .initializeBy((c, item) => {
      item.init();
      return item;
     })
    .dispose((item) => item.cleanup())
    .named('A')
    .transient()
    .ownedInternally();
```

<!--sec data-title="Run example" data-id="section0" data-show=true data-collapse=true ces-->

<iframe class="example" src="https://stackblitz.com/edit/tioc-registration-metadata-ts?embed=1&file=index.ts">
</iframe>

<!--endsec-->

#### JavaScript

```javascript
import * as typeioc from 'typeioc';

let state = '';

const create = () => ({
    init() {
        state+= ' initialized';
    },

    cleanup() {
        state+= ' disposed';
    }
});

const builder = typeioc.createBuilder();
builder.register('ServiceA')
    .as(() => create())
    .initializeBy((c, item) => {
      item.init();
      return item;
     })
    .dispose((item) => item.cleanup())
    .named('A')
    .transient()
    .ownedInternally();
```

<!--sec data-title="Run example" data-id="section1" data-show=true data-collapse=true ces-->

<iframe class="example" src="https://stackblitz.com/edit/tioc-registration-metadata-js?embed=1&file=index.js">
</iframe>

<!--endsec-->
