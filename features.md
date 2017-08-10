###Install

Install typeioc

```js
npm install typeioc
```

###Usage

#####Load typeioc:

```js
var typeioc = require('typeioc');
```

Assuming TestBase class and Test class exist somewhere 

#####Basic resolution (JS):

```js
var containerBuilder = typeioc.createBuilder();
containerBuilder.register(TestBase).as(() => new Test());
var container = containerBuilder.build();
var actual = container.resolve(TestBase);
```

#####With type checking (TS):

Copy typeioc.d.ts definition file from d.ts folder to your project and reference it within ts files.

```typescript
/// <reference path="typeioc.d.ts" />
import typeioc = require("typeioc");

const containerBuilder = typeioc.createBuilder();
containerBuilder.register<TestBase>(TestBase)
    .as(() => new Test());
const container = containerBuilder.build();
let actual = container.resolve<TestBase>(TestBase);
```

#####Registering with dependencies:

```typescript
containerBuilder.register<Test2Base>(Test2Base)
    .as(() => new Test2());
containerBuilder.register<Test1Base>(Test1Base)
    .as((c) => {
        let test2 = c.resolve(Test2Base);
        return new Test3(test2);
    });
```

#####Registering as types (JS/TS):
Applies to anything that could/should be constructed (class, function)

```js
containerBuilder.register(Test2Base).asType(Test2);
containerBuilder.register(Tes1tBase).asType(Test3, Test2Base);
```

#####Registering as self (JS/TS):
Applies to anything that could/should be constructed (class, function)

```js
containerBuilder.register(Test2).asSelf();
containerBuilder.register(Test3).asSelf(Test2);
```

#####Registering as value (JS/TS):
Applies to any value

```js
containerBuilder.register('some value service').asValue(123);
containerBuilder.register('some value service').asValue(123).named('val2');
```

#####Instance lifetime scoping (JS/TS):

```js
containerBuilder.register(Test2Base)
    .asType(Test2)
    .transient();   // returns new instance for every resolution call

containerBuilder.register(Test2Base)
    .asType(Test2)
    .singleton();   // returns same instance for every resolution call

containerBuilder.register(Test2Base)
    .asType(Test2)
    .instancePerContainer();    // returns same instance for every resolution call
                                // per container
```

#####Instance ownership (JS/TS):

```js
containerBuilder.register(Test2Base)
    .asType(Test2)
    .ownedInternally();   // ownership is maintained by container (affects disposal)

containerBuilder.register(Test2Base)
    .asType(Test2)
    .ownedExternally();   // ownership is maintained by external code

```


#####Fluent API:

```typescript
containerBuilder.register<Test1Base>(Test1Base)       // register component Test1Base
.as(() => new Test5())                                // as instance of Test5
.initializeBy((c, item) => {                          // invoke initialization on resolved instances
     item.coolMethodHere();
     return item;
})                                                   
.dispose((item : testData.Test5)  => item.Dispose())  // invoke disposal when disposing container
.named('Some Name')                                   // resolve with specific name
.within(typeioc.Types.Scope.Hierarchy)                // specifies instance re-usability
.ownedBy(typeioc.Types.Owner.Container);              // specifies instance ownership

// `.as(() => new Test5())` could be substituted with `asType(Test5)`.
// In this case Test5 is instantiated during resolution



const container = containerBuilder.build();                 // create an instance of container

container
.resolveWith<TestData.Test1Base>(Test1Base)    // resolve an instance of Test1Base
.args(arg1, arg2)                              // with arguments
.attempt()                                     // try resolve (do not throw if not found)
.name('someName')                              // with name (for named registrations)
.dependencies([d1, d2])                        // with dependencies (to substitute things Test1Base depends on)
.cache()                                       // with cached resolution value => container.cache.Test1Base
.exec();                                       // resolve, aslo execAsync() available for awaited call
// OR .execAsync();
```

#####Shortcuts:

```typescript
container.resolve<TestData.Test1Base>(Test1Base, ...args:any[]);
container.resolveAsync<TestData.Test1Base>(Test1Base, ...args:any[]);  // awaited call returns promise

container.tryResolve<TestData.Test1Base>(Test1Base, ...args:any[]);
container.tryResolveAsync<TestData.Test1Base>(Test1Base, ...args:any[]);  // awaited call returns promise

container.resolveNamed<TestData.Test1Base>(Test1Base, ...args:any[]);
container.resolveNamedAsync<TestData.Test1Base>(Test1Base, ...args:any[]);  // awaited call returns promise

container.tryResolveNamed<TestData.Test1Base>(Test1Base, name : string, ...args:any[]);
container.tryResolveNamedAsync<TestData.Test1Base>(Test1Base, name : string, ...args:any[]);  // awaited call returns promise

container.resolveWithDependencies<TestData.Test1Base>(Test1Base, dependencies : Typeioc.IDynamicDependency[]);
container.resolveWithDependencies<TestData.Test1Base>(Test1Base, dependencies : Typeioc.IDynamicDependency[]);  // awaited call returns promise

// resolveWithDependencies will substitute all the dependencies for the instance being resolved


container.dispose();  // dispose all owned instances
container.disposeAsync(); 

```

####Decorators (TS):

Compile ts files with experimentalDecorators and emitDecoratorMetadata flags.

```typescript
const decorator = typeioc.createDecorator();

export class TestBase {
    public foo() {}
}

export class TestBase1 {
    public foo() {}
}

export class TestBase2 {
    public foo() {}
}

@decorator.provide(TestBase).register()
export class Test extends TestBase {

    public foo() {
        return 'Test';
    }
}

@decorator.provide<TestBase2>(TestBase2).register()
export class Test2 extends TestBase2 {

    public foo() {
        return 'Test2';
    }
}

@decorator.provide(TestBase1).register()
export class Test1 extends TestBase1 {

    constructor(private value1 : TestBase,
                @decorator.by(TestBase2).resolve() private value2) {
        super();
    }

    public foo() {
        return `Test1 : ${this.value1.foo()}  ${this.value2.foo()}`;
    }
}

const container = decorator.build();
let actual = container.resolve<TestBase1>(TestBase1);
```

#####Decorators Fluent API:

Class level registration

```typescript
@decorator.provide(service)           // also accepts generic parameter: provide<T>(service)
.initializeBy((c, item) => {
    item.someCoolMethod();
    return item;
})
.dispose(item => item.dispose())
.named('Some name')
.within(typeioc.Types.Scope.None)
.ownedBy(typeioc.Types.Owner.Container)
.register()
class Test {
    public foo() {}
}
```

Constructor parameters resolution

```typescript

class Test {
    
    constructor(
       @decorator.by(service)        // service is optional and is not needed if _val type is specified
       .args(1, 2, 3)
       .attempt()
       .name()
       .cache()
       .resolve() private _val) {}

    public foo() {}
}
```

####Add-ons:

Copy typeioc.addons.d.ts definition file from d.ts folder to your project and reference it within ts files.


#####Interceptors

```typescript
/// <reference path="typeioc.d.ts" />
/// <reference path="typeioc.addons.d.ts" />

const typeioc = require('typeioc');
const addons = require('typeioc/addons');

const containerBuilder = typeioc.createBuilder();

containerBuilder.register(Math)
    .as(c => {

    var interceptor = addons.Interceptors.create();

  	return interceptor.intercept(Math, [{
            method: 'pow',
            type: addons.Interceptors.CallInfoType.Method,
            wrapper: function (callInfo:Addons.Interceptors.ICallInfo) {

                console.log('Before execute : ' + callInfo.args[0] + ' ' + callInfo.args[1]);
                const result = callInfo.invoke(callInfo.args);
                console.log('After execute : ' + result);
                return callInfo.args[0] + callInfo.args[1];
            }
        }]);
    });

const container = containerBuilder.build();
const actual = container.resolve<Math>(Math);
actual.pow(2,3); // 5
actual.log(1);   // still 0
```