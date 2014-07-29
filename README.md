TypeIOC
=======

 [![NPM version](https://badge.fury.io/js/typeioc.svg)](http://badge.fury.io/js/typeioc)
 [![Build Status](https://travis-ci.org/maxgherman/TypeIOC.svg?branch=master)](https://travis-ci.org/maxgherman/TypeIOC)
 [![Coverage Status](https://img.shields.io/coveralls/maxgherman/TypeIOC.svg)](https://coveralls.io/r/maxgherman/TypeIOC?branch=master)
 [![Code Climate](https://codeclimate.com/github/maxgherman/TypeIOC.png)](https://codeclimate.com/github/maxgherman/TypeIOC)


Dependency injection container for node typescript.

###Install

Install typescript globally

```
npm install typescript -g
```

Install typeioc

```
npm install typeioc
```

###Usage

Load typeioc:

```
var typeioc = require('typeioc');
```

Assuming TestBase class and Test class exist somewhere 

Basic resolution (JS):
```
var containerBuilder = typeioc.createBuilder();
containerBuilder.register(TestBase).as(function() {return  new Test() });
var container = containerBuilder.build();
var actual = container.resolve(TestBase);
```

With type checking (TS):
Copy typeioc.d.ts definition file from d.ts folder to your project and reference it in ts files.

```
/// <reference path="typeioc.d.ts" />
import typeioc = require("typeioc");

var containerBuilder = typeioc.createBuilder();
containerBuilder.register<TestBase>(TestBase)
    .as(() => new Test());
var container = containerBuilder.build();
var actual = container.resolve<TestBase>(TestBase);
```

Registering with dependencies:
```
containerBuilder.register<Test2Base>(Test2Base)
    .as(() => new Test2());
containerBuilder.register<Test1Base>(Test1Base)
    .as((c) => {
        var test2 = c.resolve(Test2Base);
        return new Test3(test2);
    });
```

Fluent API:
```
containerBuilder.register<Test1Base>(Test1Base)                  // register component Test1Base
    .as(() => new Test5())                                       // as instance of Test5
    .initializeBy((c, item) => { item.doSomethingCoolHere(); })  // invoke initialization on resolved instances
    .dispose((item : testData.Test5)  => { item.Dispose(); })    // invoke disposal when disposing container
    .named("Some Name")                                          // resolve with specific name
    .within(typeioc.Types.Scope.Hierarchy)                       // specifies instance reusability
    .ownedBy(typeioc.Types.Owner.Container);                     // specifies instance ownership




```

###Features

- [x] - Type compliance checking.
- [x] - Late instances creation through lambda expressions.
- [x] - Dependencies resolution.
- [x] - Named instances resolution.
- [x] - Custom instance initialization.
- [x] - Custom instance disposal.
- [x] - Instance scoping.
- [x] - Instance ownership.
- [x] - Module registration
- [x] - Fluent API.
- [x] - Configuration (JS).
- [ ] - Runtime dependencies substitution.
- [ ] - Promises configuration
- [ ] - Configuration (JSON).
- [ ] - Instance lifetime scoping.
- [ ] - Full API documentation.

###Running the tests

Make sure you have nodeunit installed or pull it with dev dependencies.

```
npm test
```
