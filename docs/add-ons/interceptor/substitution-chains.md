# Substitution chains

When multiple substitutions for the same member provided, they form an execution chain. Every predecessor in the chain can pass a result of the execution to its successor. Every successor in the chain can receive a result of predecessor execution. If substitution does not invoke its successor, execution chain stops. Let's consider situations where multiple interceptions can occur:

* Multiple substitutions with the same method name.<br/>
    The simplest scenario. We deliberately specify multiple interceptors for the same member.

* Multiple substitutions with no member name.<br/>
    Substitutions with no member name specified apply to all members.

## Invocation priorities

Multiple substitutions for the same member form a chain of prioritized calls.

* Substitutes with member name take higher priority than substitutes with no member specified.

* Substitutes of the same priority are invoked in the order they where defined.

#### TypeScript

```typescript
import * as typeioc from 'typeioc';
import * as Addons from 'typeioc/addons';
import Interceptors = Addons.Interceptors;

const interceptor = Interceptors.create();

const math = interceptor.intercept(Math, [{
    wrapper : (callInfo) => callInfo.next(`${callInfo.result} 2`)
    }, {
        method: 'pow',
        type: Interceptors.CallInfoType.Method,
        wrapper : (callInfo) => callInfo.next(callInfo.args[0] + callInfo.args[1])
    }, {
        type: Interceptors.CallInfoType.Method,
        wrapper : (callInfo) => `${callInfo.result} 3`
    }, {
        method: 'pow',
        wrapper : (callInfo) => callInfo.next(`${callInfo.result} 1`)
    }, {
        method: 'round',
        wrapper : (callInfo) => callInfo.next(callInfo.args[0])
}]);
```

<!--sec data-title="Run example" data-id="section0" data-show=true data-collapse=true ces-->

<iframe class="example" src="https://stackblitz.com/edit/tioc-interceptor-chains-ts?embed=1&file=index.ts">
</iframe>

<!--endsec-->

#### JavaScript

```javascript
import * as Addons from 'typeioc/addons';
const Interceptors = Addons.Interceptors;

const interceptor = Interceptors.create();

const math = interceptor.intercept(Math, [{
    wrapper : (callInfo) => callInfo.next(`${callInfo.result} 2`)
    }, {
        method: 'pow',
        type: Interceptors.CallInfoType.Method,
        wrapper : (callInfo) => callInfo.next(callInfo.args[0] + callInfo.args[1])
    }, {
        type: Interceptors.CallInfoType.Method,
        wrapper : (callInfo) => `${callInfo.result} 3`
    }, {
        method: 'pow',
        wrapper : (callInfo) => callInfo.next(`${callInfo.result} 1`)
    }, {
        method: 'round',
        wrapper : (callInfo) => callInfo.next(callInfo.args[0])
}]);
```

<!--sec data-title="Run example" data-id="section1" data-show=true data-collapse=true ces-->

<iframe class="example" src="https://stackblitz.com/edit/tioc-interceptor-chains-js?embed=1&file=index.js">
</iframe>

<!--endsec-->
