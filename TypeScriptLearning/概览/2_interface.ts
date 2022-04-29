// 构造器接口
interface PersonConstructor {
    new(name: string, age: number): PersonInterface;
}
// 实例接口
interface PersonInterface {
    name: string;
    age: number;
    say(msg: string): void;
}


// 实现接口（此时的构造器并没有被接口检测）
class Person_Male implements PersonInterface {
    static gender: string = 'male';
    name: string;
    age: number;
    constructor(name: string, age: number) {
        this.name = name;
        this.age = age;
    }
    say(msg: string) {
        console.log(`my name is ${this.name}, ${msg}`);
    }
}
class Person_Female implements PersonInterface {
    static gender: string = 'female';
    name: string;
    age: number;
    constructor(name: string, age: number) {
        this.name = name;
        this.age = age;
    }
    say(msg: string) {
        console.log(`my name is ${this.name}, ${msg}`);
    }
}

// 创建一个函数, 该函数接收构造器方法，就可以通过PersonConstructor接口对构造函数进行类型检测
/**
 * @param {constructor} ctor 构造器
 * @param {String} name 传入构造器的参数
 * @param {Number} age 传入构造器的参数
 */

function CreatePerson(ctor: PersonConstructor, name: string, age: number): PersonInterface {
    return new ctor(name, age);
}

// 使用
let personA = CreatePerson(Person_Male, 'xiaoming', 18);
let personB = CreatePerson(Person_Female, 'xiaohong', 17);

(function(){
    class Person {
        private type: string = '人类';
    }
    interface Skill_1 extends Person {
        teach(): void;
    }
    interface Skill_2 extends Person {
        study(): void;
    }
    class Teacher extends Person implements Skill_1{
        teach(){}
    }
    class Student extends Person implements Skill_2{
        study(){}
    }
    class Dog implements Skill_1 {
        private type:string = ''
        teach(){}
    }
})()
