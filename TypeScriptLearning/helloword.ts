console.log('hello word')
// tsc --init 创建tsconfig.ts文件
// ts-node xxxx.ts
interface Student {
  id: number;
  learn(course: string): void;
}
class Person implements Student{
  id: number = 1;
  learn(course: string): void {
      // ...具体实现
  }
  name: string = 's'
  constructor(){}
}
let arr: [] = []
let obj = {}
function setObj(arr: any, obj: any){
  arr = [1]
  obj = {b: 2};
}
console.log('arr :>> ', arr);
console.log('obj :>> ', obj);