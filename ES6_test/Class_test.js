// ES5写法
class Person {
    constructor(name, age) {
        this.name = name;
        this.age = age;
        // this.getName = this.getName.bind(this);
        this.getName = function (){
            return this.name;
        }
    }
    getName(){
        console.log(this)
        return this.name;
    }
    
}
let sy = new Person('sy', 18);
let getName = sy.getName;
getName();
