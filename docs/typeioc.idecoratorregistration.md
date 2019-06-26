<!-- Do not edit this file. It is automatically generated by API Documenter. -->

[Home](./index.md) &gt; [typeioc](./typeioc.md) &gt; [IDecoratorRegistration](./typeioc.idecoratorregistration.md)

## IDecoratorRegistration interface

Represents an entry into service registration fluent cascading API interface

<b>Signature:</b>

```typescript
export interface IDecoratorRegistration<T> 
```

## Methods

|  Method | Description |
|  --- | --- |
|  [dispose(action)](./typeioc.idecoratorregistration.dispose.md) | Specifies disposer action during resolution disposal. |
|  [initializeBy(action)](./typeioc.idecoratorregistration.initializeby.md) | Specifies initialization action during service instantiation |
|  [instancePerContainer()](./typeioc.idecoratorregistration.instancepercontainer.md) | Specifies instance per container scope resolution. Every resolution of a service returns the same instance per instance of a container Is similar to Scope.Container, scope.container [Scope](./typeioc.scope.md) |
|  [lazy()](./typeioc.idecoratorregistration.lazy.md) | Specifies lazy registration. Resolution of services is differed until results are needed by other services/computations |
|  [named(name)](./typeioc.idecoratorregistration.named.md) | Specifies named registration. Registration can be resolved only using the name provided |
|  [ownedBy(owner)](./typeioc.idecoratorregistration.ownedby.md) | Specifies resolution disposal behavior |
|  [ownedExternally()](./typeioc.idecoratorregistration.ownedexternally.md) | Specifies ownership model maintained externally |
|  [ownedInternally()](./typeioc.idecoratorregistration.ownedinternally.md) | Specifies ownership model maintained by container (default behavior) |
|  [register()](./typeioc.idecoratorregistration.register.md) | Finalizes service registration |
|  [singleton()](./typeioc.idecoratorregistration.singleton.md) | Specifies singleton scope resolution. Every resolution of service returns same instance Is similar to Scope.Hierarchy, scope.hierarchy [Scope](./typeioc.scope.md) |
|  [transient()](./typeioc.idecoratorregistration.transient.md) | Specifies transient scope resolution. Every resolution of service returns new instance Is similar to Scope.None, scope.none [Scope](./typeioc.scope.md) (default behavior) |
|  [within(scope)](./typeioc.idecoratorregistration.within.md) | Specifies resolution instance scope. Scope determines how resolved service instances behave in between resolutions |
