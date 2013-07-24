"use strict";

import RegoDefinitionsModule = require('../registration/definitions');

export class Defaults
{
    public static Scope : RegoDefinitionsModule.Scope = RegoDefinitionsModule.Scope.Hierarchy;
    public static Owner : RegoDefinitionsModule.Owner =  RegoDefinitionsModule.Owner.Externals;


}