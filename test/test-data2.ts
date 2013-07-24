
export module ServiceModule1 {
    export class TestBaseClass {
        public name() {
            return null;
        }
    }
}

export module ServiceModule2 {
    export function TestBaseFunction() {

    }
}

export module ServiceModule3 {
    export class TestBaseClass1 {
        public name() {
            return null;
        }
    }

    export class TestBaseClass2 {
        public age() {
            return null;
        }
    }

    export class TestBaseClass3 {
        public date() {
            return null;
        }
    }
}

export module SubstituteModule1 {

    export class ConcreteTestClass extends ServiceModule1.TestBaseClass {
        public name() {
            return "Concrete class";
        }
    }
}

export module SubstituteModule2 {

    export class ConcreteTestClass {
        public name() {
            return "Concrete class";
        }
    }
}

export module SubstituteModule3 {

    export class ConcreteTestClass {

        private age : number;
        private anotherParam : string;

        constructor(age : number, anotherParam : string) {
            this.age = age;
            this.anotherParam = anotherParam;
        }


        public name() {
            return "Concrete class" + this.age + this.anotherParam;
        }
    }
}

export module SubstituteModule4 {

    export class ConcreteTestClass1 {
        public name() {
            return "Concrete class1";
        }
    }

    export class ConcreteTestClass2 {
        public name() {
            return "Concrete class2";
        }
    }
}


export module SubstituteModule5 {
    export class ConcreteClass1 {
        public name() {
            return "name";
        }
    }

    export class ConcreteClass2 {
        public age() {
            return "age";
        }
    }

    export class ConcreteClass3 {
        public date() {
            return "date";
        }
    }
}

export module SubstituteModule6 {
    export class ConcreteClass1 {
        private _dependancy : SubstituteModule3.ConcreteTestClass;

        constructor(dependancy : SubstituteModule3.ConcreteTestClass) {
            this._dependancy = dependancy;
        }

        public name() {
            return "Module6 - Class 1 - " + this._dependancy.name();
        }
    }
}