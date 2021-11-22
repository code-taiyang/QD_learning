$(function(){
    var imgCount = $(".swiper-img").length;
    var index = 0;
    var flag = true;
    var timer = null;
    reSize();
    showBtns();
    autoPlay();
    // console.log( $(window).width());
    // console.log(window.innerWidth)
    //$(window).width()是返回视窗宽度（不加滚动条）即调试里面看到的盒子宽度
    //window.innerWidth是原生JS,返回视窗宽度（加上滚动条）

    $(window).resize(function(){
        clearInterval(timer);
        reSize();
        // console.log("window:"+$(window).width())
        // console.log($(".swiper-slide").offset().left)
        //轮播时改变视窗宽度解决办法
        //法1.发生改变就暂停轮播。paperYY方法
        //法2.实时获取视窗宽度
        autoPlay();
    });

    //点击按钮
    $(".swiper-btn").click(function(){
        // console.log($(this).index());
        //注意获取索引号，应该用this指向，若是$(".swiper-btn")，则是包含按钮的大对象（index为0），不是对应的按钮
        var width = $(window).width();
        index = $(this).index();//别忘了全局变量index在点击按钮后要同步
        var left = index*width;
        if(flag){
            flag = false;
            $(".swiper-slide").animate({
                left: "-"+left+"px"
            },function(){
                changeBtn();
                flag = true;
            });
        }
    });
    
    //鼠标移入停止动画、显示两侧按钮
    $(".arrow").hide();
    $(".swiper-wrapper").hover(function(){
        clearInterval(timer);
        $(".arrow").show();
    },function(){
        autoPlay();
        $(".arrow").hide();
    });

    $(".prev").click(function(){
        prevPic();
    });
    $(".next").click(function(){
        nextPic();
    });


    //只要改变视窗宽度，就重新设定图片和容器宽度
    function reSize(){
        var width = $(window).width();
        var left = -index*width;
        $(".swiper-slide").width(width*imgCount);
        $(".swiper-slide .swiper-img").width(width)
        $(".swiper-slide").offset({left:left});
        //除了改变尺寸，别忘了改变容器的定位，因为此时窗口变了但是定位仍为之前的，会导致图片显示不全
        //解决方法就是根据全局变量index来对容器定位。
    }

    //下一张
    function nextPic(){
        var width = $(window).width();
        if(flag){
            flag = false;
            index++;
            if(index==imgCount){
                index=0;
            }
            $(".swiper-slide").animate({
                left: "-"+index*width+"px"
            },function(){
                changeBtn();
                flag = true;       
            });
            // changeBtn1();
        }
        //animate是异步执行的（多次快速点击下一张图会创建对应数量的动画次数并直到全部执行完）
        //同理用节流阀和回调函数解决，注意flag必须在调用的函数外，index也要保护在节流阀中
    }

    //上一张
    function prevPic(){
        var width = $(window).width();
        if(flag){
            flag = false;
            index--;
            if(index==-1){
                index=imgCount-1;
            }
            $(".swiper-slide").animate({
                left: "-"+index*width+"px"
            },function(){
                changeBtn();
                flag = true;
            });
            // changeBtn1();
        }
    }

    //自动播放
    function autoPlay(){
        // timer = setInterval(nextPic,3000);
    }

    //添加按钮
    function showBtns(){
        btn = '<span class="swiper-btn"></span>';
        btn_wrapper = '<div class="btn-wrapper"></div>';
        $(".swiper-wrapper .prev").after(btn_wrapper);
        $(".btn-wrapper").addClass("centerX");//水平居中
        for(var i=0;i<imgCount;i++){
            $(".btn-wrapper").append(btn);
        }
         $(".swiper-btn:first").addClass("swiper-btn-active");
    }

    //按钮样式改变
    function changeBtn(){
        var width = $(window).width();
        var left = $(".swiper-slide").offset().left;
        var btn_index = -left/width;
        $(".swiper-btn").removeClass("swiper-btn-active");
        $(".swiper-btn").eq(btn_index).addClass("swiper-btn-active");
    }

    // function changeBtn1(){
    //     var width = $(window).width();
    //     var left = $(".swiper-slide").offset().left;
    //     var btn_index = -left/width + 1;
    //     if(btn_index==imgCount){
    //         btn_index = 0;
    //     }
    //     $(".swiper-btn").removeClass("swiper-btn-active");
    //     $(".swiper-btn").eq(btn_index).addClass("swiper-btn-active");
    // }
    //若想让按钮样式改变比异步动画快，需要修改该函数。参考黑马轮播图


    //添加平稳过渡效果注意：边界条件下的按钮样式改变
    
})
