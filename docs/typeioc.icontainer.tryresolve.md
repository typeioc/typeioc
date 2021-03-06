<!-- Do not edit this file. It is automatically generated by API Documenter. -->

[Home](./index.md) &gt; [typeioc](./typeioc.md) &gt; [IContainer](./typeioc.icontainer.md) &gt; [tryResolve](./typeioc.icontainer.tryresolve.md)

## IContainer.tryResolve() method

Attempts to resolve a service with optional parameters.

<b>Signature:</b>

```typescript
tryResolve<R>(service: {}, ...args: {}[]): R | undefined;
```

## Parameters

|  Parameter | Type | Description |
|  --- | --- | --- |
|  service | <code>{}</code> | service value registered prior resolution. If service is <code>null</code> or <code>undefined</code> [ArgumentError](./typeioc.argumenterror.md) is thrown |
|  args | <code>{}[]</code> | optional arguments for the service instantiation |

<b>Returns:</b>

`R | undefined`

- registered instance of a service. If registration not found - returns undefined

