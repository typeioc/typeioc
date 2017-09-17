# Interceptor

Interceptor add-on is used to intercept calls to methods/getters/setters/fields of provided component. This technique is widely used in Aspect Oriented Programming and helps having a clearer separation of concerns when dealing with vertical slices of functionality.

## Features

* Instance methods substitution

* Prototype methods substitution

* Getters and setters separate substitution

* Fields substitution

* Multiple substitution chains

```typescript
/** Returns an instance of interceptors factory
*/
addons.Interceptors

/** Returns an instance of an interceptor
*/
Interceptors.create()

interface ISubstituteInfo {

    // method, field or property name to substitute,
    // if no name specified, substitution applies to all members
    method? : string;

    // substitution type, check CallInfoType for details,
    // if no name specified, member type is used
    type? : CallInfoType;

    // lambda expression executed during substitution call
    // To execute wrapper in the context of subsitute proxy, provide function
    // check ICallInfo for details
    wrapper : (callInfo: ICallInfo) => any;
}

// represents substitution type
enum CallInfoType {
    // substitute method
    Method = 1,

    // substitute getter
    Getter = 2,

    // substitute setter
    Setter = 3,

    // substitute getter and setter
    GetterSetter = 4,

    // substitute any type (method, getter, setter, field)
    Any = 5,

    // substitute field
    Field = 6
}

// specifies parameters of the substituted call
interface ICallInfo {
    // member name to substitue
    name: string;

    // substitution invokation arguments
    args: Array<any>;

    // lambda expression to invoke original method
    invoke: (args? : Array<any>) => any;

    // represents substitution type, check CallInfoType or details
    type: CallInfoType;

    // lambda expression to invoke original getter
    get?: () => any;

    // lambda expression to invoke original setter
    set?: (any) => void;

    // lambda expression to invoke next substitution in a chain
    // check substitution chains for more details
    next? : (result? : any)=> any;

    // result of previous substitution in a chain
    // check substitution chains for more details
    result? : any;
}

/** Substitutes members of an object instance
* @param {R} - subject, instance of an object
* @param {ISubstituteInfo | Array<ISubstituteInfo>} - substitutes, optional
* parameter. Represents a single instance or an array of substitutes.
* If substitutes are applied to the same member, they are chained
* check substitution chains for more details
* @returns {R} - decorated instance
*/
interceptor.interceptInstance<R extends Object>(subject : R, substitutes? : ISubstituteInfo | Array<ISubstituteInfo>) : R;

/** Substitutes members of a prototypical/constructable function
* @param {R} - subject, prototypical/constructable function
* @param {ISubstituteInfo | Array<ISubstituteInfo>} - substitutes, optional
* parameter. Represents a single instance or an array of substitutes.
* If substitutes are applied to the same member, they are chained
* check substitution chains for more details
* @returns {R} - decorated prototype
*/
interceptor.interceptPrototype<R extends Function>(subject : R, substitutes? : ISubstituteInfo | Array<ISubstituteInfo>) : R;


/** Substitutes members of a given subject. For instances of a object
* interceptInstance is used, for prototypical/constructible functions
* interceptPrototype is used
* @param {R} - subject, prototypical/constructable function or an instance
* of an abject
* @param {ISubstituteInfo | Array<ISubstituteInfo>} - substitutes, optional
* parameter. Represents a single instance or an array of substitutes.
* If substitutes are applied to the same member, they are chained
* check substitution chains for more details
* @returns {R} - decorated subject
*/
interceptor.intercept<R extends Function | Object>(subject : R, substitutes? : ISubstituteInfo | Array<ISubstituteInfo>) : R;
```

#### TypeScript

```typescript
import * as typeioc from 'typeioc';
import * as Addons from 'typeioc/addons';
import Interceptors = Addons.Interceptors;

class CalcAdd {
    private _a: number;
    private _b: number;

    public get a(): number {
        return this._a;
    }

    public set a(value: number) {
        this._a = value;;
    }

    public get b(): number {
        return this._b;
    }

    public set b(value: number) {
        this._b = value;;
    }

    public add() {
        return this.a + this.b;
    }
}

const interceptor = Interceptors.create();

const CalcAddIntercepted = interceptor
.interceptPrototype(CalcAdd, [{
  method: 'a',

  // intercept 'a' getter
  type: Interceptors.CallInfoType.Getter,

  // invoke getter in the context of interceptor proxy
  wrapper: function(callInfo) { return callInfo.get() + this.b; }
}, {
  method: 'add',

  // invoke original method
  wrapper: (callInfo) => callInfo.invoke()
}]);

const builder = typeioc.createBuilder();

builder.register(CalcAdd)
.asType(CalcAddIntercepted);

builder.register(CalcAdd)
.asSelf().named('original');
```

<!--sec data-title="Run example" data-id="section0" data-show=true data-collapse=true ces-->

<iframe class="example" src="https://stackblitz.com/edit/tioc-interceptor-basic-ts?embed=1&file=index.ts">
</iframe>

<!--endsec-->

#### JavaScript

```javascript
import * as typeioc from 'typeioc';
import * as Addons from 'typeioc/addons';
const Interceptors = Addons.Interceptors;

class CalcAdd {
    get a() {
        return this._a;
    }

    set a(value) {
        this._a = value;
    }

    get b() {
        return this._b;
    }

    set b(value) {
        this._b = value;;
    }

    add() {
        return this.a + this.b;
    }
}

const interceptor = Interceptors.create();

const CalcAddIntercepted = interceptor
.interceptPrototype(CalcAdd, [{
  method: 'a',

  // intercept 'a' getter
  type: Interceptors.CallInfoType.Getter,

  // invoke getter in the context of interceptor proxy
  wrapper: function(callInfo) { return callInfo.get() + this.b; }
}, {
  method: 'add',

  // invoke original method
  wrapper: (callInfo) => callInfo.invoke()
}]);

const builder = typeioc.createBuilder();

builder.register(CalcAdd)
.asType(CalcAddIntercepted);

builder.register(CalcAdd)
.asSelf().named('original');
```

<!--sec data-title="Run example" data-id="section1" data-show=true data-collapse=true ces-->

<iframe class="example" src="https://stackblitz.com/edit/tioc-interceptor-basic-js?embed=1&file=index.js">
</iframe>

<!--endsec-->
