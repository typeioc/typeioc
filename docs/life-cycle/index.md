# Component life cycle

Component life cycle determines how component instance behaves in between resolutions. It affects when and how many times an instance is resolved. TypeIOC supports three types of component life cycle:

* [Transient](./transient.md)
* [Singleton](singleton.md)
* [Instance per container](./instance-per-container.md)

Every instance of a component is associated with exactly one type of life cycle. This association is defined during service registration and cannot be changed.
Life cycle determines boundaries of life time scope. After all registrations are made, we build an instance of a container using **build** method provided by **ContainerBuilder**. Container represents a standalone self sufficient collection of registrations and defines a life time scope boundary. Containers could be nested, representing nested life time scopes. The choice of component life cycle would dictate which life time scopes / containers an instance of a component would belong to and how it would be resolved. Nested containers are created using **createChild** method of **Container** instance.

### Synopsis

```typescript

/**
* Creates nested container
@returns {IConteiner} child container
*/
createChild()
```

Child container inherits all the registrations from parent container. Component instances owned by a container are tracked and disposed when the instance of container is disposed. Containers are disposed using **dispose** method.

### Synopsis

```typescript

/**
* Disposes container instance.
* All container owned instances are disposed if corresponding
* disposal mechanism provided
*/
dispose()
```