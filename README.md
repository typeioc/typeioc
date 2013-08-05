TypeIOC
=======

Dependancy injection container for node typescript.

###Install

```
npm install typeioc
```

###Usage

Load typeioc:

```
var typeioc = require('typeioc');
```

Assuming TestBase class and Test class exist somewhere 

Basic resolution:
```
var containerBuilder = new typeioc.ContainerBuilder();
containerBuilder.register(TestBase).as(() => new Test());
var container = containerBuilder.build();
var actual = container.resolve(TestBase);
```

With type checking:
```

import typeioc = require('node_modules/typeioc/lib/typeioc');

var containerBuilder = new typeioc.ContainerBuilder();
containerBuilder.register<TestBase>(TestBase).as(() => new Test());
var container = containerBuilder.build();
var actual = container.resolve<TestBase>(TestBase);
```

Registering with dependancies:
```
containerBuilder.register<Test2Base>(Test2Base).as(() => new Test2());
containerBuilder.register<Test1Base>(Test1Base).as((c) => {
    var test2 = c.resolve(Test2Base);
    return new Test3(test2);
});
```

Fluent API:
```
containerBuilder.register<Test1Base>(Test1Base).
  as(() => new Test5()).
  initializeBy((c, item) => { item.doSomethingCoolHere(); }).
  named("Some Name").
  within(typeioc.Constants.Scope.Hierarchy).
  ownedBy(typeioc.Constants.Owner.Container);
```

###Features

- [x] - Type complience checking.
- [x] - Late instances creation through lambda expressions.
- [x] - Dependancies resolution.
- [x] - Named instances resolution.
- [x] - Custom instance initialization.
- [x] - Instance scoping.
- [x] - Instance ownership.
- [x] - Fluent API.
- [x] - Configuration.


###Running the tests

Make sure you have nodeunit installed or pull it with dev depandancies.

```
node test/runner
```
