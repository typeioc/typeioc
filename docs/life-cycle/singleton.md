# Singleton instance

Singleton life time cycle prescribes instances to be created only once regardless of scope nesting level. In other words, every single resolution of the same service will return the instance for exactly the same component.

```typescript
/**
* Specifies singleton resolution.
* Every time a service is resolved, the same instance of component is returned.
*/
registration.singleton()
```
