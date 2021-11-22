let sy1 = Symbol('sy');//S1，未登记
let sy2 = Symbol('sy');//S2，未登记
let sy3 = Symbol.for('sy');//S3，创建后登记
let sy4 = Symbol.for('sy');//S3，已登记
let sy5 = Symbol.for('sy1');
console.log(sy1===sy1)//true
console.log(sy1===sy2)//false
console.log(Symbol('sy')===Symbol('sy'))//false
console.log(Symbol.for('sy')===Symbol('sy'))//false
console.log(sy2===sy3)//false
console.log(sy3===sy4)//true
console.log(Symbol.for('sy')===Symbol.for('sy'))//true
console.log(Symbol('a').toString())
let a = Symbol('a')
if(a){console.log("1111")}
console.log(Boolean(a))
console.log(a)