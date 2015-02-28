

 'use strict';

 //public static fromPrototype(parent : Function,
 //    interceptor? : Typeioc.Interceptors.IInterceptor |
 //    Array<Typeioc.Interceptors.IInterceptor> ) : Function {
 //
 //    var argument : any = interceptor;
 //
 //    var interceptors =  [];
 //
 //    if(argument) {
 //        interceptors = Utils.Reflection.isArray(argument) ? argument : [argument];
 //    }
 //
 //    interceptors.forEach(item => {
 //        var error;
 //
 //        if(!item) {
 //            error = new Exceptions.ArgumentError('method', 'Missing method to intercept');
 //            error.data = item;
 //            throw error;
 //        }
 //
 //        if(!item.method) {
 //            error = new Exceptions.ArgumentError('method', 'Missing method to intercept');
 //            error.data = item;
 //            throw error;
 //        }
 //
 //        if(!item.type) {
 //            error = new Exceptions.ArgumentError('type', 'Missing interceptor type');
 //            error.data = item;
 //            throw error;
 //        }
 //
 //        if(!item.wrapper) {
 //            error = new Exceptions.ArgumentError('wrapper', 'Missing interceptor wrapper');
 //            error.data = item;
 //            throw error;
 //        }
 //    });
 //
 //
 //    return null;
 //}
