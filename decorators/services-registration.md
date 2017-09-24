# Services registration

Service registration uses class level decorator to bind a real component to the service under resolution. For the components, ony **class** level decorations are supported. All registration entries start with the method **provide** and are finalized with a method **register**. The rest of the methods are optional. They follow cascading fluent interface and specify registration additional details.

### Synopsis

```typescript
/**
* Service registration
@param {any} service - component registration service
@returns {object} - registration type specification instance
*/
decorator.provide<T>(service: any)

/**
* Self service registration. The decorated class will be registered as self.
@returns {object} - registration type specification instance
*/
decorator.provideSelf<T>(service: any)

interface IInitializer<T> {
    (c:IContainer, item : T) : T;
}

/**
* @param {IInitializer<T>} action - lambda expression executed during component
* resolution. Takes two parametes: container and resolved component
*/
initializeBy(action : IInitializer<T>)

/**
* @param {string} name - registration name.
* A service will be resolved only using the name specified.
*/
named : (name: string)

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
* Every time a service is resolved,
* the same instance of component per container is returned.
*/
instancePerContainer()

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
* For internal owned instances, when dispose action is specified,
* it is invoked during container disposal
* @param {IDisposer<T>} action - lambda expression for component disposal.
* It's invoked with an instance of component
*/
dispose : (action : IDisposer<T>)

/** Finalizes component registration
*/
register()
```

#### TypeScript

```typescript
import * as typeioc from 'typeioc';

const decorator = typeioc.createDecorator();

class TestBase {
    get name() { return null; }
}

@decorator
.provide<Test>(TestBase)
.initializeBy((c, item) => { item.init(); return item; })
.dispose((item) => item.dispose())
.named('TestClass')
.register()
class Test extends TestBase {
    private _name = 'Test';

    constructor() {
        super();
    }

    get name() { return this._name; }

    public init() {
      this._name += ' initialized';
    }

    public dispose() {
      this._name += ' disposed';
    }
}
```

<!--sec data-title="Run example" data-id="section0" data-show=true data-collapse=true ces-->

<iframe class="example" src="https://stackblitz.com/edit/tioc-decorator-servce-ts?embed=1&file=index.ts">
</iframe>

<!--endsec-->
