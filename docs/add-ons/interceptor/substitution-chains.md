# Substitution chains

When providing multiple substitution for the same member or substitutions applying to multiple members, all intercepted call are chained. Every predecessor in the chain can pass a result of the execution to its successor. Every successor in the chain can receive a result of predecessor execution. Let's consider situations where multiple interceptions can occur:

* Multiple substitutions with the same method name.
    The simplest scenario. We deliberately specify multiple interceptors for the same member.

* Multiple substitutions with no name.
    Substitutions with no method name apply to all the members with the same type if type was specified.

* Combination of name and no name substitutions.
    It is possible to define different name substitutions combined with one or multiple no name substitutions. In this case every interceptor will be combined out of one name and one or multiple no name substitutions.

## Invocation priorities

Multiple substitutions for the same member form a chain of prioritized calls.

* Substitutes with no name take higher priority than substitutes with a name.

* Substitutes with the same priority are invoked in the order they were defined.

#### Typescript

```typescript

```