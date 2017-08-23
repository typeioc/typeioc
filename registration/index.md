# Registration

We start using TypeIOC by registering our services. The power of the service is that it could be represented by any JavaScript object. But there are different ways of registering it.

* [Factory registration](./factory.md)
* [Type registration](./type.md)
* [Self registration](./self.md)
* [Value registration](./value.md)

Depending on a type of registration chosen, there are certain constraints applied to the algorithm of resolution. Registration also defines additional service metadata:

* [Initialization](./metadata.md#initialization)
* [Naming](./metadata.md#naming)
* [Life cycle](../life-cycle/index.md)
* [Ownership](./metadata.md#ownership)

To register a service, we have to create an instance of ContainerBuilder object. It exposes method **register** for all forms of registration.

```typescript
/**
* Service registration
@param {any} service - component registration service
@returns {object} - registration type specification instance
*/
regiser(service: any)
```

```typescript
const builder = typeioc.createBuilder();
builder.register('service').as(...);
```