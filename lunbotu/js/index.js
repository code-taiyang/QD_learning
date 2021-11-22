window.onload = function(){

    if(!document.getElementsByClassName||!document.getElementsByTagName) return false;

    var right_arrow = document.getElementById("right_arrow");
    var left_arrow = document.getElementById("left_arrow");
    var imgs = document.getElementsByClassName("imgs");//图片容器
    var album = document.getElementsByClassName("album");//轮播图方框
    var album_btn = document.getElementsByClassName("album_btn")//底部按钮容器
    var btns = album_btn[0].getElementsByTagName("span");//别忘了album_btn是数组
    var first_rpos = -2884;//第一张图位置
    var last_rpos = 0;//最后一张图位置
    var img_width = 721;//位移距离
    var timer = null;//定时器引用
    var selected = "btn_selected";//按钮选中状态的样式名
    imgs[0].style.right = first_rpos + "px";//初始化容器位置

    right_arrow.onclick = function(){
        nextPic();
    }
    left_arrow.onclick = function(){
        prevPic();
    }

    /*自动轮播功能*/
    // autoShow();//自动轮播
    album[0].onmouseenter = function(){
        clearInterval(timer);
    }
    album[0].onmouseleave = function(){
        // autoShow();//若上面的自动轮播注释掉，触发该事件后，仍会开始轮播
    }
    //这里用album而不用imgs的原因是：能够在鼠标置于手动轮播按钮上停止自动轮播
    //使自动轮播在手动轮播结束后开始，解决了手动和自动同时生效导致的问题（详见注意点6内容）

    chooseBtn();



    /*位移函数*/
    function NextPic(){
        // console.log("style:"+parseInt(imgs[0].style.right)+'\n'+imgs[0].offsetLeft)
        var rpos = parseInt(imgs[0].style.right) + img_width;
        //目前位置转换成数字并加上位移
        imgs[0].style.right = rpos + "px";
        if(rpos>last_rpos){//容器位置大于最后一张则回到第一张图
            toFirst();
        }
        btnSelected();//记得改变样式
        // console.log("Left:"+imgs[0].offsetLeft+'\n'+(first_rpos-rpos))
    }
    var flag = true;//节流阀
    function nextPic(){
        if(flag){
            flag = false;
            NextPic();
            setTimeout(function(){
                flag = true;
                // right_arrow.click();
                //甚至可以通过模拟鼠标点击达到自动播放
            },800);
        }
    }
  


    function prevPic(){
        var rpos = parseInt(imgs[0].style.right) - img_width;
        imgs[0].style.right = rpos + "px";
        if(rpos<first_rpos){
            toLast();
        }
        btnSelected();//记得改变样式
    }

    /*边界处理函数*/
    function toFirst(){
        imgs[0].style.right =  first_rpos+"px";
    }
    function toLast(){
        imgs[0].style.right =  last_rpos+"px";
    }

    /*定时轮播函数*/
    function autoShow(){
        timer = setInterval(nextPic,3000);//将自动轮播函数交给timer引用，便于其他函数操作
    }

    /*确定按钮状态*/
    //这里先初始化所有按钮的状态，再通过图片的当前位置来换算出对应的按钮，并向其添加样式
    function btnSelected(){
        var index = 0;
        for(var i=0;i<btns.length;i++){
            btns[i].className = "";//这里直接用的HTML-DOM属性
        }
        index = btns.length-1 + parseInt(imgs[0].style.right)/img_width;//因为用的right，位置为负数，故用加号
        btns[index].className = selected;
    }

    /*选择按钮轮播图片*/
    function chooseBtn(){
        for(var i=0;i<btns.length;i++){
            (function(i){
                btns[i].onclick = function(){
                    var right = i*img_width + first_rpos;//当前按钮序号*宽度+初始值=当前位置
                    imgs[0].style.right = right + "px";
                    btnSelected();//别忘了改变样式
                }
            })(i)
        }
    }

}

/*
    轮播图功能1：两侧按钮手动轮播
        --点击右键时，容器imgs向左发生位移(查询当前位置并加上一段位移)。
        --判断当为最后一张图时，将容器位置改为第一张图时的位置
        --左边同理  
    轮播图功能2：自动轮播
        --通过定时器函数setInterval()实现
        --当鼠标置于图片区域时，停止轮播。需要用到鼠标移入、移出事件和clearInterval函数
    轮播图功能3：底部按钮
        --底部按钮随自动轮播和手动轮播改变样式，即该功能的函数应该被它们影响，所有要存在于nextPic和prevPic中
        --点击底部按钮能够自动跳转到对应图片
*/
/*
    注意：
        1-函数要平稳退化、对象检测
        2-记得在函数功能完成后将其中的常量、变量或重复用到的语句抽象出来
          如：图片宽度(位移距离)、第一张图的坐标、最后一张图的坐标、边界处理函数
        3-可以将onclick中的代码和边界处理函数一起打包成next_pic/prev_pic方便后面其他函数调用
        4-容器的style.right是字符串，不能直接叠加数字，需要对应的函数转换
        5-left与right同时使用的问题：
            -在CSS学习中学过，定位的元素也要满足宽度公式，即left+margin+border+padding+width+right = 父盒子width
            -若有未确定的值（auto）且不满足父元素宽度，则会强行拉伸该值，这些值有优先度区别
            -当定位元素确定了宽度时，同时设置left和right偏移会使right失效（因为左上优先于右下）
            -故设置容器位移，只用单一的属性即可（最好是left）
        6-定时器自动轮播和手动轮播不会冲突，但是在即将自动轮播时手动轮播（左/右）会导致图片回到当前图片/跳过一张图的情况
          视觉体验不好，希望能手动点击之后再重新启动定时器，而不是两者同时起作用
        7-定时器函数需要交给一个变量引用（timer），方便后面的函数操作，如鼠标置于图片时停止函数
        8-底部按钮样式的排他属性，有且只能有一个按钮有被选中样式。即再添加样式前应初始化所有按钮样式
        9-对于点击底部按钮切换图片的功能，涉及到了一定的闭包。因为按钮有多个，每一个按钮都需要注册onclick事件
          这时就需要遍历了，对于遍历和事件处理函数需要知道，事件处理函数是异步执行的！------例子见下方
        10-代码汉能进一步改进：如图片宽度用offsetWidth获取；鼠标移入图才显示两侧箭头；底部按钮数量随
        图片数量变化（渐进增强）等








        *//*第9注意点：
        创建4个按钮，依次点击观察输出
        var test_btn = document.getElementsByTagName("button");
        for(var i=0;i<test_btn.length;i++){
            test_btn[i].onclick = function(){
                console.log(i);
            }
        }
        输出为4，4，4，4.
        这是因为事件的触发时异步执行的，代码给4个按钮注册完事件后并不会立即执行事件处理函数，只是将i下标贴上去了
        然后就跳过了事件处理函数，继续执行后面的代码（可以再事件函数后面再加一个console.log观察i为0，1，2，3）。
        由于事件处理函数在内部，而内部的函数作用域是能够访问外部的变量的，故等事件注册完，for也执行完了，此时的i为
        4（不是3）， 当发生事件后，事件函数绑定的是i本身而不是其循环值，故当访问上层作用域的i，只会输出4.

        解决方法：利用闭包和立即执行函数，将外部作用域的变量i每轮循环的状态锁住并作为参数传给事件处理函数内部。
        见https://blog.csdn.net/aoyou3037/article/details/101543500
        
        -为什么要立即执行？
        因为事件处理函数是异步执行的，循环中并不会触发事件，故事件处理函数内部只能访问循环结束后的i值。
        而若在事件处理函数外再套一层立即执行函数（该函数包含或返回事件处理函数，并需要传参数）使事件处理
        函数成为立即执行函数的闭包，则立即执行函数能够再每次循环中执行（传入每轮循环的i）并返回对应的闭包
        （此时闭包中引用的i就是每轮循环的i值了）
        -立即执行函数与辅助函数的区别
        立即执行函数使匿名函数，匿名函数一般只能赋值给变量而不能直接定义（因为定义function需要函数名）
        故匿名函数不能直接在赋值给变量时执行，但是可以给函数外加括号（立即调用函数），但是只在函数外加
        括号也不够（因为匿名函数不能直接定义，故不能直接调用），所以要将函数体用括号包起来：如下：
        IIFE(立即执行函数)：(function(形参){...})(实参)====>var a= function(形参){...};a(实参);
        立即执行函数的定义形式多种多样，自己找，上面是最常用的一种，也可(function(形参){}(实参))


        --方法0：利用元素是对象的性质解决;
        参考https://www.jianshu.com/p/366e374e108d
        因为可以再对象外添加属性，如var a = new Object();a.index = 1;
        故在事件处理函数外部给对象遍历的元素对象添加属性index，每个对象的index即为当前循环的i值
        var btns = document.getElementsByTagName("button");
        for(var i=0; i<btns.length; i++){
            btns[i].index = i;
            btns[i].onclick = function(){
                console.log(this.index)
            }
        }
        但是请注意：添加的index不能直接引用，不能用btn[i].index引用（因为处理函数的i为4）.只能通过this来引用
        
        --方法0.1：原理类似上面，每轮循环为按钮添加一个index属性，并将i值保存进去。
        需要index就用this.getAttribute()。代码略

        --方法1：使用立即执行函数
        var test_btn = document.getElementsByTagName("button");
        for(var i=0;i<test_btn.length;i++){
            (function(i){
                test_btn[i].onclick = function(){
                    console.log(i);
                }
            })(i)
        }
////////////////以上等效于///////////////////////////////////
            var a = function(i){
                test_btn[i].onclick = function(){
                    console.log(i);
                }
            }
            a(i);
//////////////////也可将a函数定义于循环外//////////////////////

        --方法2：由于匿名函数不能直接定义，故这里将其赋值给a，同样传入参数并立即执行
        var test_btn = document.getElementsByTagName("button");
        for(var i=0;i<test_btn.length;i++){
            var a = function(i){
                test_btn[i].onclick = function(){
                    console.log(i);
                }
            }(i)
        }
        --方法3：将立即执行函数在循环外定义（严格说并不算立即执行函数，只是辅助函数，但跟立即执行函数一样，在每轮循环中都会执行）
         function a(i){
            return function(){console.log(i);}
        }       
        var test_btn = document.getElementsByTagName("button");
        for(var i=0;i<test_btn.length;i++){
            test_btn[i].onclick = a(i)//不加括号就使将函数赋值了
        }
        --方法4：利用ES6的块级作用域，即let的性质，用let定义循环中的i（let和var的区别见一起的实习笔记或自己找资料）
        var test_btn = document.getElementsByTagName("button");
        for(let i=0;i<test_btn.length;i++){
            test_btn[i].onclick = function(){
                console.log(i);
            }
        }
        --方法5：（这个只用于setTimeout类函数）利用函数的额外传参功能
        setTimeout(匿名函数(记得带形参),时间,实参)
        for(var i=0;i<10;i++){
            setTimeout(function(m){console.log(m);},1000,i)//注意IE兼容性不高
        }
        --方法5.1 通过bind函数
        for(var i=0;i<10;i++){
            setTimeout(function(m){console.log(m);}.bind(null,i),1000)//注意IE兼容性不高
        }
        --方法6：promise函数（以下自己查书或资料）
        for(var i=0; i < 10; i++) {
        new Promise((resolve, reject) => {
             var j = i;
             setTimeout(function() {
                console.log(j)
              }, 1000);
            })
        }
        --方法7：async函数
        async function foo() {
        for(var i=0; i < 10; i++) {
        let result = await new Promise((resolve, reject) => {
            setTimeout(function() {
                resolve(i);
                }, 1000);
        });
        console.log(result);
        }
        }
        foo(); 
        // 每隔1s打印数字 0 - 9

        总结：想要事件处理函数能够绑定每次循环的i值，就必须在其外部创建一个函数，该函数要能传i参数
        到函数中且在循环中立即执行，同时使事件处理函数形成闭包，从而能访问每轮循环的i值。外部函数的创建
        方式有多种，如：立即执行函数形式;匿名函数赋值给变量，再让变量执行。函数定义在循环内则包含住事件；
        循环外定义，不包含事件时则需要将事件处理函数作为返回值，包含事件时只需在循环内执行函数即可。
*/