# Registration metadata

Every registration has several customization options, things that affect its behavior and resolution process.

##### Initialization

Registration might specify an action, performed over a component during resolution.

```typescript
interface IInitializer<T> {
    (c:IContainer, item : T) : T;
}

/**
* @param {IInitializer<T>} action - lambda expression executed during component resulution,
* rigth after component initialization
*/
initializeBy(action : IInitializer<T>)
```

##### Naming

Registration might have a name associated with it. In this case, a service can be resolved using only the name specified. Named registrations are useful for registering the same service several times with different names.

```typescript
/**
* @param {string} name - registration name.
* A service will be resolved only using the name specified.
*/
named : (name: string)
```

##### Reusability / life cycle

Reusability defines component repeated resolution behavior.

```typescript
/**
* Specifies transient resolution.
* Every time a service is resolved, a new instance of component is returned.
*/
transient()

/**
* Specifies singleton resolution.
* Every time a service is resolved, the same instance of component is returned.
*/
singleton()

/**
* Specifies instancePerContainer resolution.
* Every time a service is resolved, the same instance of component per container is returned.
*/
instancePerContainer()
```

[More info](../life-cycle/)

##### Ownership


All the methods for the metadata specification are implemented in fluent API manner with priorities