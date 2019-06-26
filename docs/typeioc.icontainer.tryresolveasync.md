<!-- Do not edit this file. It is automatically generated by API Documenter. -->

[Home](./index.md) &gt; [typeioc](./typeioc.md) &gt; [IContainer](./typeioc.icontainer.md) &gt; [tryResolveAsync](./typeioc.icontainer.tryresolveasync.md)

## IContainer.tryResolveAsync() method

Asynchronously attempts to resolve a service with optional parameters.

<b>Signature:</b>

```typescript
tryResolveAsync<R>(service: {}, ...args: {}[]): Promise<R | undefined>;
```

## Parameters

|  Parameter | Type | Description |
|  --- | --- | --- |
|  service | <code>{}</code> | service value registered prior resolution |
|  args | <code>{}[]</code> | optional arguments for the service instantiation |

<b>Returns:</b>

`Promise<R | undefined>`

- promise, resolving with a registered instance of a service. If registration not found - returns a promise with undefined resolution If `null` or `undefined` service value rejects the promise with [ArgumentError](./typeioc.argumenterror.md)
