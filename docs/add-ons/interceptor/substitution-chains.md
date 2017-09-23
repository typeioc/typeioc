# Substitution chains

When multiple substitutions for the same member provided, they form an execution chain. Every predecessor in the chain can pass a result of the execution to its successor. Every successor in the chain can receive a result of predecessor execution. If substitution does not invoke its successor, execution chain stops. Let's consider situations where multiple interceptions can occur:

* Multiple substitutions with the same method name.
    The simplest scenario. We deliberately specify multiple interceptors for the same member.

* Multiple substitutions with no member name
    Substitutions with no member name specified apply to all members.

## Invocation priorities

Multiple substitutions for the same member form a chain of prioritized calls.

* Substitutes with member name take higher priority than substitutes with no member specified.

* Substitutes of the same priority are invoked in the order they where defined.