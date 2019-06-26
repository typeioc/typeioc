<!-- Do not edit this file. It is automatically generated by API Documenter. -->

[Home](./index.md) &gt; [typeioc](./typeioc.md) &gt; [IRegistration](./typeioc.iregistration.md) &gt; [asType](./typeioc.iregistration.astype.md)

## IRegistration.asType() method

Sets registration to be marked as type registration

<b>Signature:</b>

```typescript
asType(type: T, ...params: any[]): IRegisterWithAs<T>;
```

## Parameters

|  Parameter | Type | Description |
|  --- | --- | --- |
|  type | <code>T</code> | type representative to be used for the instance construction |
|  params | <code>any[]</code> | optional array of parameters to be used for the type instance construction |

<b>Returns:</b>

`IRegisterWithAs<T>`

- an instance of [IRegisterWithAs](./typeioc.iregisterwithas.md) interface

## Remarks

Registration is provided as a type. An instance of the type is instantiated during resolution. It is intended for construct-able types only. Uses new operator for type construction
