# Substitution chains

When multiple substitutions for the same member provided, they form an execution chain. Every predecessor in the chain can pass a result of the execution to its successor. Every successor in the chain can receive a result of predecessor execution. If substitution does not invoke its successor, execution chain stops. Let's consider situations where multiple interceptions can occur:

* Multiple substitutions with the same method name.
    The simplest scenario. We deliberately specify multiple interceptors for the same member.

* Multiple substitutions with no type.
    Substitutions with no type specified for a member.

## Invocation priorities

Multiple substitutions for the same member form a chain of prioritized calls.

* Substitutes with no type take higher priority than substitutes with type specified.

* Substitutes of the same priority are invoked in the order they where defined.

#### Typescript

```typescript
import * as Addons from 'typeioc/addons';
import Interceptors = Addons.Interceptors;

const interceptor = Interceptors.create();

const math = interceptor.intercept(Math, [{
    method: 'pow',
    type: Interceptors.CallInfoType.Method,
    wrapper: (callInfo) => {
        return callInfo.next(`${callInfo.result} 2`);
    }
},{
    method: 'pow',
    wrapper: (callInfo) => {
        return callInfo.next(callInfo.args[0] + callInfo.args[1]);
    }
}, {
    method: 'pow',
    type: Interceptors.CallInfoType.Method,
    wrapper: (callInfo) => {
        return `${callInfo.result} 3`;
    }
}, {
    method: 'pow',
    wrapper: (callInfo) => {
        return callInfo.next(`${callInfo.result} 1`);
    }
}]);
```