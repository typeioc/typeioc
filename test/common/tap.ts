
type Action<TContext> = (test: Test<TContext>) => void

type Test<TContext> = {
    throws(action: Function, error?: Error | string): void
    ok(value: any): void
    notOk(value: any): void
    equal(actual: any, expected: any): void
    notEqual(actual: any, expected: any): void
    strictSame(actual: any, expected: any): void
    plan(count: number): void

    test(name: string, action: Action<TContext>): void
    context: TContext
    done(): void
}

export type Tap = {
    beforeEach<TContext>(action: (done: Function, setUp?: { context: TContext }) => void): void
    test<TContext>(name: string, action: Action<TContext>): void
}
