

declare module Typeioc {

     interface IContainer {
        resolve<R>(service: any, ...args:any[]) : R;
        tryResolve<R>(service: any, ...args:any[]) : R;
        resolveNamed<R>(service: any, name : string, ...args:any[]) : R;
        tryResolveNamed<R>(service: any, name : string, ...args:any[]) : R;

        createChild : () => IContainer;
        dispose: () =>  void;
    }
}