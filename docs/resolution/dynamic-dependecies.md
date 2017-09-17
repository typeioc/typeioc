# Dynamic dependencies

Dynamic dependencies feature provides a way of resolving services using different dependencies from those specified initially. A service gets resolved with all the dependencies provided without affecting original registration. All the services resolved with dynamic dependencies get [transient](../life-cycle/transient.md) life cycle assigned regardless of initial life cycle specification. For a standalone resolution, **resolveWithDependencies** method from **IContainer** instance is used. When used within a fluent interface, **dependencies** method is used.

```typescript
interface IDynamicDependency {
    /* A service to be resolved as a dependency */
    service : any;

    /* A factory method for dependency resolution */
    factory?: IFactory<any>;

    /* A factory type for dependency resolution */
    factoryType? : any;

    /* A factory value for dependency resolution */
    factoryValue? : any;

    /* Specifies value for named resolution */
    named? : string;

    /* Specifies dependency initialization */
    initializer? : IInitializer<any>;

    /* Specifies optional resolution.
    * If true, returns null when no service registration found.
    * Default value - false
    */
    required? : boolean;
}

/** Resolves a service with dynamic dependencies
* @param {any} - service, registered service
* @param {IDynamicDependency[]} - dependencies,
* provided dependencies will substitute those provided during registration.
* @returns {R} - registered component
*/
resolveWithDependencies<R>(service: any, dependencies : IDynamicDependency[])

/** Resolves a service with dynamic dependencies
* @param {any} - service, registered service
* @param {IDynamicDependency[]} - dependencies,
* provided dependencies will substitute those provided during registration.
* @returns {Promise<R>} - promise, resolving with a registered component
*/
resolveWithDependenciesAsync<R>(
    service: any, dependencies : Typeioc.IDynamicDependency[]): Promise<R>;
```

Every dependency has to specify exactly one type of registration: [factory](../registration/factoy.md), [factory type](../registration/type.md) or [factory value](../registration/value.md).

```typescript
/** Specifies dynamically substituted dependencies during resolution
* @param {Typeioc.IDynamicDependency | Array<Typeioc.IDynamicDependency>} - data,
* a single instance or an array of dynamic dependencies
*/
dependencies(data : Typeioc.IDynamicDependency | Array<Typeioc.IDynamicDependency>)
```

#### TypeScript

```typescript
import * as typeioc from 'typeioc';

class ABase {
    name: string;
}

class A extends ABase {
    public get name() {
        return 'A';
    }
}

class B {
    constructor(private d: ABase) {
    }

    public get name() {
        return `B : ${this.d.name}`;
    }
}

const substitute = (value: string) => ({
    name: value
});

const builder = typeioc.createBuilder();
builder.register(ABase).asType(A);
builder.register('B1').asType(B, ABase);
builder.register('B2')
.as((c) => new B(c.resolve<ABase>(ABase)));

const container = builder.build();

const b1 = container.resolve<B>('B1');
const b2 = container.resolveWithDependencies<B>('B1', [{
    service: ABase,
    factory: () => substitute('A - Substitute 1')
}]);

const b3 = container.resolveWithDependencies<B>('B2', [{
    service: ABase,
    factory: () => substitute('A - Substitute 2')
}]);
```

<!--sec data-title="Run example" data-id="section0" data-show=true data-collapse=true ces-->

<iframe class="example" src="https://stackblitz.com/edit/tioc-dynamic-dependencies-ts?embed=1&file=index.ts">
</iframe>

<!--endsec-->


#### JavaScript

```javascript
import * as typeioc from 'typeioc';

class ABase {
}

class A extends ABase {
    get name() {
        return 'A';
    }
}

class B {
    constructor(d) {
        this.d = d;
    }

    get name() {
        return `B : ${this.d.name}`;
    }
}

const substitute = (value) => ({
    name: value
});

const builder = typeioc.createBuilder();
builder.register(ABase).asType(A);
builder.register('B1').asType(B, ABase);
builder.register('B2').as((c) => new B(c.resolve(ABase)));

const container = builder.build();

const b1 = container.resolve('B1');
const b2 = container.resolveWithDependencies('B1', [{
    service: ABase,
    factory: () => substitute('A - Substitute 1')
}]);

const b3 = container.resolveWithDependencies('B2', [{
    service: ABase,
    factory: () => substitute('A - Substitute 2')
}]);
```

<!--sec data-title="Run example" data-id="section1" data-show=true data-collapse=true ces-->

<iframe class="example" src="https://stackblitz.com/edit/tioc-dynamic-dependencies-js?embed=1&file=index.js">
</iframe>

<!--endsec-->
