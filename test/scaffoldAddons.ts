/// <reference path='../d.ts/node.d.ts' />
/// <reference path='../d.ts/typeioc.addons.d.ts' />


'use strict';

var addons = require('../addons/index');

export function interceptor() : Addons.Interceptors.IInterceptor {
    return addons.Interceptors.create();
}
