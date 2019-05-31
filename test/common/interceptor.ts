import { IContainerBuilder, ISubstituteInfo, IInterceptor } from '@lib'

export type ResolveBridge = {
    interceptor?: IInterceptor,
    builder?: IContainerBuilder
}

export type Context = {
    resolve: <R>(register: any, subject: R, substitutes?: ISubstituteInfo[]) => R
}

export const createResolve = (bridge: ResolveBridge) =>
    <R>(register: any, subject: R, substitutes?: ISubstituteInfo[]): R => {

        if (!substitutes) {
            substitutes = []
        }

        const register2 = 'test'

        bridge.builder!.register(register)
            .as(c => {
                const resolution = c.resolve<R>(register2)
                return bridge.interceptor!.intercept(resolution, substitutes)
            })

        bridge.builder!.register(register2).as(() => subject)

        const container = bridge.builder!.build()
        return container.resolve<R>(register)
    }
