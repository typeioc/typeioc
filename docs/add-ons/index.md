# Add-ons

Add-ons are designed to extend basic TypeIOC functionality. They are optional but might be useful in different use cases.

For TypeScript add the path to TypeIOC addons definition file into your tsconfig.json:

```json
{
  ...

  "files": [
    "node_modules/typeioc/d.ts/typeioc.addons.d"
    ...
  ]
}
```

The main entry point of add-ons is 'typeioc/addons' sub-folder.

```typescript
import * as Addons from 'typeioc/addons';
```
