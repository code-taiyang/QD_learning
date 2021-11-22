/*
  定义：Function.prototype.call(thisArg, arg1, arg2, ...)
  用途：
  1. 修改函数执行上下文
  2. 子类实现继承

  注意：
  1. call不填任何参数（或第一个参数值为null/undefined）时，this默认指向全局对象。在严格模式下，则为undefined，(故此时用this引用会报错)
*/ 

a = 'global';
var obj = {
  a: 'obj',
  print: function(){
    console.log('this.a :>> ', this.a);
  },
}
var obj1 = {
  a: 'obj1',
}
obj.print();//obj
obj.print.call(obj1);//obj1
obj.print.call(globalThis);//global






// 父类
function Person(name,age){
  this.name = name;
  this.age = age;
}

// 子类
function Male(name,age){
  Person.call(this, name, age);//通过改变this指向，在类中添加父类的属性
  this.gender = '男';
}

// 子类
function Female(name,age){
  Person.call(this, name, age);
  this.gender = '女';
}
var sy = new Male('sy',18);//男
var sty = new Female('sty',18);//女


var arr = [
  1,
  2,
  3,
]
function setArr(){
  console.log('this :>> ', this);
  console.log('this.toString() :>> ', this.toString()+1);;
}
for(let i=0; i<arr.length; i++){
  setArr.call(arr[i]);
}
console.log('arr :>> ', arr);