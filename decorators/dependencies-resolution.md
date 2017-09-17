# Dependencies resolution

By using constructor level decorators, we instruct TypeIOC how component dependencies will be resolved in run time. There are two way to specify resolution mechanism: a more generic **by** method and very specific **resolveValue** method of decorator instance.

```typescript
/** Specifies dependency resolution by decorated service
* @param {any?} - service, if provided is used to resolve dependency,
* otherwise dependency parameter type is used
* @returns - resolution specification fluent API instance
*/
by(service? : any)

{
    args,
    attempt,
    name,
    cache,
    resolve
}

/** Specifies arguments passed during service resolution
* @param {Array<any>} - value, arguments used to resolve a component
*/
args(...value: Array<any>)


/** Instructs resolution process to not throw an exception
* if service registration not found
*/
attempt()

/** Specifies a value for the named resolution
@param {string} - value representing a name used to regiter a service
*/
name(value : string)

/** Caches resolved component
* @param {string} - name?, optional name to be cached under
*/
cache(name? : string)

/** Finalizes resolution specification.
*/
resolve()

/** Specifies a value to be used as dependency. It is used as parameter
* value and no resolution computation is preformed
*/
resolveValue(value: any)
```

#### TypeScript

```typescript
import * as typeioc from 'typeioc';

const decorator = typeioc.createDecorator();

@decorator
.provide('A')
.register()
class A {
    public get name() { return 'A'; }
}

@decorator
.provide('B')
.named('B1')
.register()
class B {
    public get name() { return 'B'; }
}

class C {
    public get name() { return 'C'; }
}

interface IDepedency {
  name: string;
}

@decorator
.provide('D')
.register()
class D {
  constructor(
    @decorator.by('A').resolve()
    private a: IDepedency,
    @decorator.by('B').name('B1').resolve()
    private b: IDepedency,
    @decorator.resolveValue(new C())
    private c: IDepedency) {

  }

  get name() : string {
    return `${this.a.name} ${this.b.name} ${this.c.name}`;
  }
}

const container = decorator.build();
const d = container.resolve<D>('D');
```

<!--sec data-title="Run example" data-id="section0" data-show=true data-collapse=true ces-->

<iframe class="example" src="https://stackblitz.com/edit/tioc-decorator-dependencies-ts?embed=1&file=index.ts">
</iframe>

<!--endsec-->