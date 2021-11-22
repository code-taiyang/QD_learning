function test(){
    var num = [];
    for(var i=0;i<10;i++){
        (function(i){
            num[i] = function(){
                return i;
            }//每次循环创建一个函数闭包，其i值引用上级作用域，即立即执行函数的i
        })(i)//立即执行函数的i是test函数的i值传入的，故这样通过闭包能够将每轮循环中的i的值保存下来
        
    }
    return num;
}
var f = test();
console.log(f[2]());//去掉4、8行则为10