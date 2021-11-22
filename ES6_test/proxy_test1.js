let obj = {
    a: 1,
    b: 2,
};
let pro = new Proxy(obj,{
    get: function(target,propKey,receiver){
        console.log("触发拦截"+propKey);
        if(propKey==='say'){
            target[propKey] = function(){
                console.log('hello')
            }
        }
        return target[propKey];
    }
});
pro.a;
pro.c;
obj.a;
pro.say();
obj.d = 4;
pro.d