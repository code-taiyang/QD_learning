/*传统异步回调*/
function timeOut(ms){//嵌套回调执行异步任务
    setTimeout((t)=>{console.log(t); 
        setTimeout((t)=>{console.log(t);
            setTimeout((t)=>{console.log(t);},ms*4,ms*4+'ms')
        },ms*2,ms*2+'ms')
    },ms,ms+'ms')
}
timeOut(500)


/*promise链式调用*/
function timeOut1(ms){//定义异步开始的函数
    return new Promise((resolve,reject)=>{//创建一个异步任务
        setTimeout(resolve,ms,ms);//第三个参数即传入resolve的参数
    });
}
timeOut1(600)
    .then((ms)=>{//第一个任务完成后执行回调，并创建第二个异步....
        console.log('又过去了'+ms+'ms');
        return timeOut1(2*ms)
    })
    .then((ms)=>{
        console.log('又过去了'+ms+'ms');
        return timeOut1(2*ms);
    })
    .then((ms)=>{
        console.log('又过去了'+ms+'ms');
    })

    
/*async+await*/
function setTime(ms){
    return new Promise((resolve)=>{setTimeout(resolve,ms,ms);})
}
async function timeOut2(ms){//await使异步操作以同步方式执行
    const t1 = await setTime(ms).then((a)=>{console.log('->'+a+'ms')});
    const t2 = await setTime(ms*2).then((a)=>{console.log('->'+a+'ms')});
    const t3 = await setTime(ms*4).then((a)=>{console.log('->'+a+'ms')});
}
timeOut2(700);
