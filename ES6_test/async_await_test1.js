function sleep(t){
    return new Promise((resolve,reject)=>{
        setTimeout(resolve,t,t);
    });
}
async function test(){
    console.log("2222222222")//
    var a1 = sleep(1000)//不用await,函数返回promise，反之返回resolve的输入参数
    var a2 = sleep(1000).then((m)=>{console.log(m+'ms')});
    var a3 = await sleep(1000)
    var a4 = await sleep(1000).then((m)=>{console.log(m+'ms')});
    //解析：创建了4个异步，其中await有2个，故a1-a3会同时执行，再执行a4。
    for(let i=0;i<5;i++){
        console.log(i);
        await sleep(1000).then((a)=>{console.log(a)})//await将异步方法用同步的方式实现。若无await则会直接输出01234，同时创建5个1s异步同时执行。
    }
    console.log("1-",a1)//promise{1000}
    console.log("2-",a2)//promise{undefined}
    console.log("3-",a3)//1000
    console.log("4-",a4)//undefined
    //解析：无await的a1,a2会返回promise对象，a1有传入resolve的参数，a2的then返回新promise无resolve参数
    //带有await的promise会返回传入resolve的参数。
    await sleep(1000).then((m)=>{console.log(m+'ms')});
    return await sleep(1000);
    //对于async的返回：不写return会隐式返回promise对象，该对象状态由async中所有await决定
    //如果在函数中 return 一个直接量，async 会把这个直接量通过 Promise.resolve() 封装成 Promise 对象（值传给resolve）
    //，若返回异步任务，则先执行任务，再返回值给resolve
    //无论异步任务是否加await，都是返回传给resolve的值.return中的await异步也遵从await的同步特性
}
console.log("1111111111")
test().then((m)=>{console.log("test-return",m)})
console.log("3333333333")
//带有await的promise会用同步方式执行，带有await和不带有await的promise会同时执行，因为后者为普通异步

/*
    【注意】：
        1. await等的是promise对象或其他值，然后会进行运算。为其它值时，运算返回结果就是值本身；
           为promise对象时，会先等promise的异步操作完成，获取其传给resolve的值并返回
        2. async是异步函数，表示其中还有await(可以不含，但这样无意义)，在async内部的await异步操作才会以同步的方式执行
           async本身在js代码中是异步执行的（所有await被async封装在promise中）。
*/