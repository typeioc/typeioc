# Decorators

In TypeIOC, decorators are used as an alternative way to register services. All the APIs available through regular registration are available using decorators. There are two types of decorators used: class decorators and constructor decorators. Class decorators are used to describe service registration, where constructor decorators are for describing component dependencies. All decorator features are available for TypeScript only.

* [Class decorators](./services-registration.md)
* [Constructor decorators](./dependencies-resolution.md)

Just like regular style registration, decorators use cascading fluent API interface. First step for using this style of registration is to create an instance of a decorator.

```typescript
import * as typeioc from 'typeioc';

const decorator = typeioc.createDecorator();
```