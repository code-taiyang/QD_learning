var module1 = (function(){
    var that = this;
    var a = 1;
    return {
        set: function (val){
            a = val;
        },
        get: function (){
            return a;
        },
        that: function(){
            return this
        }
    }
})();
console.log('module1.a :>> ', module1.a);
console.log(module1.that());
console.log(module1.get());
module1.set(4);
console.log(module1.get());