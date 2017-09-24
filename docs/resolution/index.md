# Resolution

Resolution is the process dual to registration. Once all the services were registered, we can start resolving them getting constructed components. All the component dependencies are resolved as well. Every resolution starts with a container - the root life cycle scope. To create a container we use a method **build** from **ContainerBuilder** instance. Services also could be resolved with [dynamic dependences](./dynamic-dependecies.md) and [cached](./cached-resolution.md) option.

Having an instance of container we can use different methods to resolve registered service in a several ways.

### Synopsis

```typescript
/** Creates an instance of container
* @returns {IContainer} - container instance
*/
build()

/** Resolves a service with optional parameters.
* Throws ResolutionException if not registration found
* @param {any} - service, registered service
* @param {any:[]} - args, optional arguments.
* @returns {R} - registered component
*/
resolve<R>(service: any, ...args:any[])

/** Resolves a service with optional parameters
* @param {any} - service, registered service
* @param {any:[]} - args, optional arguments.
* @returns {Promise<R>} - promise, resolving with a registered component
*/
resolveAsync<R>(service: any, ...args:any[])

/** Resolves a service with optional parameters.
* Returns null if no registration found
* @param {any} - service, registered service
* @param {any:[]} - args, optional arguments.
* @returns {R} - registered component
*/
tryResolve<R>(service: any, ...args:any[])

/** Resolves a service with optional parameters
* @param {any} - service, registered service
* @param {any:[]} - args, optional arguments.
* @returns {Promise<R>} - promise, resolving with a registered component
* or null if not found
*/
tryResolveAsync<R>(service: any, ...args:any[])

/** Resolves a service registered with specific name
* Throws ResolutionException if not registration found
* @param {any} - service, registered service
* @param {string} - name, a unique named used to register a service
* @param {any:[]} - args, optional arguments.
* @returns {R} - registered component
*/
resolveNamed<R>(service: any, name : string, ...args:any[])

/** Resolves a service registered with specific name
* @param {any} - service, registered service
* @param {string} - name, a unique named used to register a service
* @param {any:[]} - args, optional arguments.
* @returns {Promise<R>} - promise, resolving with a registered component
*/
resolveNamedAsync<R>(service: any, name : string, ...args:any[])

/** Resolves a service registered with specific name
* Returns null if no registration found
* @param {any} - service, registered service
* @param {string} - name, a unique named used to register a service
* @param {any:[]} - args, optional arguments.
* @returns {R} - registered component or null if not found
*/
tryResolveNamed<R>(service: any, name : string, ...args:any[])

/** Resolves a service registered with specific name
* @param {any} - service, registered service
* @param {string} - name, a unique named used to register a service
* @param {any:[]} - args, optional arguments.
* @returns {Promise<R>} - promise, resolving with a registered component
* or null if not found
*/
tryResolveNamedAsync<R>(service: any, name : string, ...args:any[])

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
    service: any, dependencies : Typeioc.IDynamicDependency[])

/** Creates nested life cycle scope
* @returns {IContainer} - container
*/
createChild()

/** Disposes all resolved internally owned instances registered with disposal method
* @returns {IContainer} - container
*/
dispose()

/** Disposes all resolved internally owned instances registered with disposal method
* @returns {Promise<void>} - promise
*/
disposeAsync()

/** Represents an object with keys matching services registered with cache option
* @returns {any} - object
*/
cache : any;

/** Resolves a service using fluent cascading interface
* @param {any} - service, registered service
* @returns {IResolveWith<R>} - resolution metadata specification instance
*/
resolveWith<R>(service : any)

IResolveWith<R> {
    args,
    attempt,
    name,
    dependencies,
    cache,
    exec,
    execAsync
}

/** Specifies arguments passed during service resolution
* @param {any[]} - args, arguments used to resolve a component
*/
args(...args : any[])

/** Instructs resolution process to not throw an exception
* if service registration not found
*/
attempt()

/** Specifies a value for the named resolution
@param {string} - value representing a name used to regiter a service
*/
name(value : string)

/** Specifies dynamically substituted dependencies during resolution
* @param {Typeioc.IDynamicDependency | Array<Typeioc.IDynamicDependency>} -
* data, a single instance or an array of dynamic dependencies
*/
dependencies(data : Typeioc.IDynamicDependency | Array<Typeioc.IDynamicDependency>)

/** Caches resolved component
* @param {string} - name?, optional name to be cached under
*/
cache(name? : string)

/** Finalizes service resolution
@returns {R} - resolved component
*/
exec()

/** Finalizes service resolution
@returns {Promise<R>} - promise, resolves with a register component
*/
execAsync()
```

#### TypeScript

```typescript
import * as typeioc from 'typeioc';

const builder = typeioc.createBuilder();
builder.register('A')
.as((c, value) => ({ a: value }));

builder.register('B')
.as(() => ({ b: 'b' }))
.named('B1');

const container = builder.build();

const a = container.resolve<{a: string}>('A', 'a');
const b = container.resolveNamed<{b : string}>('B', 'B1');
const c = container.tryResolve('C');

const b1 = container.resolveWith<{b: string}>('B')
.attempt()
.name('B1')
.exec();
```

<!--sec data-title="Run example" data-id="section0" data-show=true data-collapse=true ces-->

<iframe class="example" src="https://stackblitz.com/edit/tioc-resolution-ts?embed=1&file=index.ts">
</iframe>

<!--endsec-->

#### JavaScript

```javascript
import * as typeioc from 'typeioc';

const builder = typeioc.createBuilder();
builder.register('A')
.as((c, value) => ({ a: value }));

builder.register('B')
.as(() => ({ b: 'b' }))
.named('B1');

const container = builder.build();

const a = container.resolve('A', 'a');
const b = container.resolveNamed('B', 'B1');
const c = container.tryResolve('C');

const b1 = container.resolveWith('B')
.attempt()
.name('B1')
.exec();
```

<!--sec data-title="Run example" data-id="section1" data-show=true data-collapse=true ces-->

<iframe class="example" src="https://stackblitz.com/edit/tioc-resolution-js?embed=1&file=index.js">
</iframe>

<!--endsec-->
