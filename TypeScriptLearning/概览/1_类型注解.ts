
/**
 * 声明：ts是js的超集，是编写js程序的一个类型辅助，可以完全兼容原始的js写法。
 */


/**
 * @description 基本注解
 * @语法 声明关键字 标识符: 类型名 [= value];
 */
let isStudent: boolean = false;
const nAge: number = 1;
const sName: string = 'sy';
function func1(sName: string, nAge: number = 1): string{
    return '';
}

/**
 * @description 数组注解
 * @语法 声明关键字 标识符: 类型名[] = [= value];
 */
const arr1: number[] = [1,2,3];
let arr2: string[];
// arr2 = arr1;报错，类型不匹配

/**
 * @description 接口注解，可以将多个类型声明合并。【暂时可以理解为，对[一种]对象字面量的属性的声明】
 * @语法 interface 标识符 {
 *          prop1: 类型1;
 *          prop2: 类型2;【注意是分号，且接口声明不能有初始化操作】
 *      }
 * @使用 将声明的接口注解作为一个类型，给一个标识符作为类型注解即可。
 */
interface student {
    sName: string;
    nAge: number;
}

let sy1: student = {
    sName: 'sy',
    nAge: 18,
};//有且只能有接口中声明的属性，且属性类型正确。

/**
 * @description 内联类型注解
 * @语法 和接口类似，但更像创建一个对象字面量的方式，声明的内联名即标识符名。
 */

let inline : {//相当于对[一个]对象字面量进行了属性类型的注解
    sName: string;
    nAge: number;
}

inline = {
    sName: 'sy',
    nAge: 18
}
//inline的类型仅代表这个对象字面量，若有多个对象都是这样，可以考虑抽象为[接口]。

/**
 * 类型中的特殊类型，any/null/undeined/void
 */
/**
 * @description any类型，这个类型会关闭ts的类型检查，即回到js的动态类型。
 * @用法 不建议多用，毕竟这是TypeScript，不是AnyScript!!
 */
let number: any;
number = 1;
number = '2';

/**
 * @description null/undefined
 * 前者在js中表示对象但值为空，后者表示未赋值
 * 在ts中是其它类型的子集，即不受类型的限制【strictNullChecks选项关闭的前提下】。
 */
let num: number;
// num = null;//报错，strictNullChecks选项要为false才可以赋值
// num = undefined;

/**
 * @description void 表示函数没有且[不能有]返回值
 */
function func2(): void{
    console.log('hello');
    // return '';报错
    // return; 不报错
}

/**
 * @description 泛型。
 */
function add<T>(a:T, b: T):T {
    return a;
    // return a + b;会报错，可能是因为+运算符会导致无法预测的类型改变（隐式转换）
}
function slice<T>(arr: T[], index: number):T[] {
    return arr.slice(index);
}
slice<string>(['1','2'], 1);
slice<number>(['1','2'], 1);//报错，泛型类型不一致
slice([1,2], 1);// 可以不去指明泛型，ts编译器可以自己推导。
//返回的数组成员类型也一定是指定的泛型

/**
 * @description 联合类型，让变量可以拥有多种类型选择
 */
let a: number | string;//类型取并集
function hello(name: string | string[]): string{
    return ''
}

interface A {
    name: string
    age: number
  }
  
interface B {
    name: number
    id: string
}

type Union = A | B;
const c: Union = {
    name: 12,
    age: 1,
    id: 'as',
}
console.log(c);

/**
 * @description 交叉类型
 */
let a1: number & string = 1;//报错，因为number和string无交集
let b: (string | number) & string = '1';//类型取交集
interface IPerson {
    id: string;
    age: number;
    name: string;
}

interface IWorker {
    name: number;
    companyId: string;
}

type IStaff = IPerson & IWorker;

const staff: IStaff = {
    id: 'E1006',
    name: 'sy',
    age: 33,
    companyId: 'EFT'
};

console.dir(staff)
  

/**
 * @description 元组
 */
let metaArr: [number, number, number];
metaArr = [1, 1, 1];