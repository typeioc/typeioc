/*---------------------------------------------------------------------------------------------------
 * Copyright (c) 2017 Maxim Gherman
 * typeioc - Dependency injection container for node typescript / javascript
 * @version v2.0.0
 * @link https://github.com/maxgherman/TypeIOC
 * @license MIT
 * --------------------------------------------------------------------------------------------------*/



declare module Addons {

    module Interceptors {

        function create() : IInterceptor;

        const enum CallInfoType {
            Method = 1,
            Getter = 2,
            Setter = 3,
            GetterSetter = 4,
            Any = 5,
            Field = 6
        }

        interface IInterceptor {
            interceptPrototype<R extends Function>(subject : R, substitutes? : ISubstituteInfo | Array<ISubstituteInfo>) : R;
            interceptInstance<R extends Object>(subject : R, substitutes? : ISubstituteInfo | Array<ISubstituteInfo>) : R;
            intercept<R extends Function | Object>(subject : R, substitutes? : ISubstituteInfo | Array<ISubstituteInfo>) : R;
        }

        interface ICallInfo {
            name : string;
            args : Array<any>;
            invoke: (args? : Array<any>) => any;
            type : CallInfoType;
            get? : () => any;
            set? : (any) => void;
            next? : (result? : any)=> any;
            result? : any;
        }

        interface ISubstituteInfo {
            method? : string;
            type? : CallInfoType;
            wrapper : (ICallInfo) => any;
        }

        interface ISubstitute extends ISubstituteInfo {
            method? : string;
            type : CallInfoType;
            next? : ISubstitute;
        }
    }
}

declare module "typeioc/addons" {
    export = Addons;
}