<!-- Do not edit this file. It is automatically generated by API Documenter. -->

[Home](./index.md) &gt; [typeioc](./typeioc.md)

## typeioc package

Dependency injection container for TypeScript / JavaScript

## Classes

|  Class | Description |
|  --- | --- |
|  [ApplicationError](./typeioc.applicationerror.md) | Represents general purpose application error |
|  [ArgumentError](./typeioc.argumenterror.md) | Represents argument error. It is thrown when the argument value does not comply with the method specification |
|  [CircularDependencyError](./typeioc.circulardependencyerror.md) | Represents circular dependency error. It is thrown when two or more service resolutions depend on each other directly on indirectly |
|  [DecoratorError](./typeioc.decoratorerror.md) | Represents decorator error. It is thrown when an exception happens during service parts decoration (class, parameter, etc...) |
|  [ProxyError](./typeioc.proxyerror.md) | Represents proxy error. It is thrown when an exception happens during proxy - interceptor construction |
|  [ResolutionError](./typeioc.resolutionerror.md) | Represents resolution error. It is thrown when an error happens during service resolution / instantiation |

## Interfaces

|  Interface | Description |
|  --- | --- |
|  [ICache](./typeioc.icache.md) | Represents cached resolutions interface. |
|  [ICallInfo](./typeioc.icallinfo.md) | Represents a substitute parameters specification interface |
|  [IContainer](./typeioc.icontainer.md) | Represents container interface |
|  [IContainerBuilder](./typeioc.icontainerbuilder.md) | Represents container builder interface |
|  [IDecorator](./typeioc.idecorator.md) | Represents a decorator style fluent cascading API services registration / resolution interface |
|  [IDecoratorRegistration](./typeioc.idecoratorregistration.md) | Represents an entry into service registration fluent cascading API interface |
|  [IDecoratorResolution](./typeioc.idecoratorresolution.md) | Represents fluent cascading interface for services resolution |
|  [IDynamicDependency](./typeioc.idynamicdependency.md) | Represents dynamic dependency interface |
|  [IInterceptor](./typeioc.iinterceptor.md) | Represents interceptor specification interface |
|  [IName](./typeioc.iname.md) | Specifies named registration interface with no additional steps within fluent cascading API Receives a value to be used named registrations / resolutions |
|  [IRegisterWithAs](./typeioc.iregisterwithas.md) | Represents an entry step within registration fluent cascading API sequence |
|  [IRegistration](./typeioc.iregistration.md) | Represents an entry into service registration fluent cascading API interface |
|  [IResolveWith](./typeioc.iresolvewith.md) | Represents fluent cascading interface for services resolution |
|  [ISubstituteInfo](./typeioc.isubstituteinfo.md) | Represents substitute information encapsulation interface |
|  [IWithSubstituteResult](./typeioc.iwithsubstituteresult.md) | Represents fluent cascading API interface for substitutes specification |

## Variables

|  Variable | Description |
|  --- | --- |
|  [builder](./typeioc.builder.md) | Creates an instance on [IContainerBuilder](./typeioc.icontainerbuilder.md) interface |
|  [callInfo](./typeioc.callinfo.md) | Represents original substituted subject member type |
|  [decorator](./typeioc.decorator.md) | Creates an instance on [IDecorator](./typeioc.idecorator.md) interface |
|  [interceptor](./typeioc.interceptor.md) | Creates an instance on [IInterceptor](./typeioc.iinterceptor.md) interface |
|  [scope](./typeioc.scope.md) | Represents resolution life-cycle type definition |

## Type Aliases

|  Type Alias | Description |
|  --- | --- |
|  [CallInfoType](./typeioc.callinfotype.md) | Represents member substitution type values |
|  [Disposer](./typeioc.disposer.md) | Specifies an instance of the dispose action to be used during resolution disposal Receives an instance of the resolution |
|  [Factory](./typeioc.factory.md) | Represents factory method registration interface. Receives an instance of a container [IContainer](./typeioc.icontainer.md) and an array of optional parameters provided during resolution |
|  [Initializer](./typeioc.initializer.md) | Specifies an instance of the initialization action to be used during resolution instantiation. Receives an instance of a container [IContainer](./typeioc.icontainer.md) and an instance of the resolved service |
|  [RegisterWithInitializeBy](./typeioc.registerwithinitializeby.md) | Represents a step within fluent cascading API registration sequence where <code>initializeBy</code> method was omitted |
|  [RegisterWithLazy](./typeioc.registerwithlazy.md) | Represents a step within fluent cascading API registration sequence where <code>lazy</code> and <code>dispose</code> methods were omitted |
|  [RegisterWithName](./typeioc.registerwithname.md) | Represents a step within fluent cascading API registration sequence where <code>named</code> method was omitted |
|  [ResolveWithArgs](./typeioc.resolvewithargs.md) | Represents a step within fluent cascading API resolution sequence where <code>args</code> method was omitted |
|  [ResolveWithAttempt](./typeioc.resolvewithattempt.md) | Represents a step within fluent cascading API resolution sequence where <code>attempt</code> method was omitted |
|  [ResolveWithCache](./typeioc.resolvewithcache.md) | \* Represents final step within fluent cascading API resolution sequence |
|  [ResolveWithName](./typeioc.resolvewithname.md) | Represents a step within fluent cascading API resolution sequence where <code>name</code> method was omitted |
|  [ScopeType](./typeioc.scopetype.md) | Represents resolution life-cycle type values |
|  [WithDecoratorRegister](./typeioc.withdecoratorregister.md) | Represents a step within fluent cascading API registration sequence where registration is finalized |
|  [WithDecoratorRegisterInitializeBy](./typeioc.withdecoratorregisterinitializeby.md) | Represents a step within fluent cascading API registration sequence where <code>initializeBy</code> method was omitted |
|  [WithDecoratorRegisterLazy](./typeioc.withdecoratorregisterlazy.md) | Represents a step within fluent cascading API registration sequence where <code>lazy</code> and <code>dispose</code> methods were omitted |
|  [WithDecoratorRegisterName](./typeioc.withdecoratorregistername.md) | Represents a step within fluent cascading API registration sequence where <code>named</code> method was omitted |
|  [WithDecoratorResolver](./typeioc.withdecoratorresolver.md) | Represents service resolution fluent API step |
|  [WithDecoratorResolverArgs](./typeioc.withdecoratorresolverargs.md) | Represents service resolution fluent API step where <code>args</code> method was omitted |
|  [WithDecoratorResolverAttempt](./typeioc.withdecoratorresolverattempt.md) | Represents service resolution fluent API step where <code>attempt</code> method was omitted |
|  [WithDecoratorResolverName](./typeioc.withdecoratorresolvername.md) | Represents service resolution fluent API step where <code>name</code> method was omitted |

