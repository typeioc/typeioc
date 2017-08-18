# Factory registration

Factory registration is the most generic type of registration. It accepts a lambda expression to register a service. Lambda expression serves as a factory method when service registration is resolved. To register a lambda expression, we have to use method **as** exposed by a builder registration. It takes a lambda as a parameter that has to return an instance of a service.

```typescript
interface IFactory<T> {
    /**
    * Lambda expression for service instanciation
    * @param {IContainer} c - container instance
    * @param {Array<any>} ...args - array of rest arguments passed during resolution
    * @returns {T} - instance of a service
    */
    (c: IContainer, ...args: Array<any>) : T;
}

/**
* Service registration using factory function
* @param {any} factory - lambda expression for service instanciation
* @returns {object} - registration metadata specification instance
*/
as(factory: IFactory)
```

 #### TypeScript

```typescript
import * as typeioc from 'typeioc';

class AClass {

    get name() {
        return 'A';
    }
}

class BClass {

    constructor(private aClass: AClass){}

    public get name() {
        return `B ${this.aClass.name}`;
    }
}

class CClassBase {
    public get name() {}
}

class CClass extends CClassBase {

    constructor(
        private p1: string,
        private p2: string,
        private p2: string){}
        // these parameters will be pased as part of factory resolution

    public get name() {
        return `C ${this.p1} ${this.p2} ${this.p2}`;
    }
}

const builder = typeioc.createBuilder();
builder.register('A Class')
    .as(() => new AClass());

builder.register('B Class')
    .as((c) => {
        const a = c.Resolve('A Class');
        return new BClass(a);
    });

builder.register(CClassBase)
    .as((c, p1, p2, p3) => new CClass(p1, p2, p3));
```

<!--sec data-title="Run example" data-id="section0" data-show=true data-collapse=true ces-->

<iframe class="example" src="https://stackblitz.com/edit/tioc-factory-registration-ts?embed=1&file=index.ts">
</iframe>

<!--endsec-->

#### JavaScript

```javascript
import * as typeioc from 'typeioc';

class AClass {

    get name() {
        return 'A';
    }
}

class BClass {

    constructor(aClass){
        this.aClass = aClass;
    }

    get name() {
        return `${this.aClass.name} B`;
    }
}

class CClassBase {
    get name() { return null; }
}

class CClass extends CClassBase {

    constructor(p1, p2, p3) {
          super();
          this.p1 = p1;
          this.p2 = p2;
          this.p3 = p3;
    } // these parameters will be pased as part of factory resolution

    get name() {
        return `C ${this.p1} ${this.p2} ${this.p3}`;
    }
}

const builder = typeioc.createBuilder();
builder.register('A Class')
    .as(() => new AClass());

builder.register('B Class')
    .as((c) => {
        const a = c.resolve('A Class');
        return new BClass(a);
    });

builder.register(CClassBase)
    .as((c, p1, p2, p3) => new CClass(p1, p2, p3));

```

<!--sec data-title="Run example" data-id="section1" data-show=true data-collapse=true ces-->

<iframe class="example" src="https://stackblitz.com/edit/tioc-factory-registration-js?embed=1&file=index.js">
</iframe>

<!--endsec-->
