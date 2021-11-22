$(function(){
    //登录选项的选择和对应模块的显示
    $(".option").click(function(){
        var index = $(this).index();
        $(".option").removeClass("option-active");
        $(this).addClass("option-active");
        //注意对应的登录选项要绑定对应模块,由于只有2个选项，可以用if判断其index来实现效果
        //注意index返回的是该元素在父元素中的序号，而不是查找的元素对象中的序号
        if(index){
            $(".wx-wrapper").hide();
            $(".user-wrapper").show();
        }else{
            $(".wx-wrapper").show();
            $(".user-wrapper").hide();
        }
    });
    //下次自动登录选单
    $(".auto-login").click(function(){
        //prop获取选单选中状态并取反赋值给选单（注意attr不会返回checked属性的bool值）
        var isChecked = $("#auto-login").prop("checked");
        $("#auto-login").prop("checked",!isChecked);
        //将选中状态对应的icon类添加或移出
        $(".checkbox").toggleClass("unchecked");
    });
    //切换手机号登录和账号密码登录
    $(".login-change .login").click(function(){
        $(".login").show();
        $(this).hide();
        $(".login1").toggle();
        $(".login2").toggle();
    });
    
});

$(function(){
    $("#login-qr-img").click(function(){
       getLoginQrImg();
    });
    getLoginQrImg();
});

/*******************************************微信登录相关**************************************/
var max_count = 5;
var count = 0;
var extra = null;
var ticket = null;
var verify = null;
var refresh = null;
function getLoginQrImg(){
    $("#login-qr-img").attr("src","./imgs/qrcode_loading.gif");
    getLoginTicket();
}
function getLoginTicket(){
    if(verify){
        clearTimeout(verify);
    }
    if(refresh){
        clearTimeout(refresh);
    }
    //每次请求二维码都先初始话定时器
    if(count>max_count){
        $("#login-qr-img").attr("src","./imgs/lose.png");
        clearTimeout(verify);
        clearTimeout(refresh);//超过次数后清除定时器
        count = 0;
        return false;//快速结束函数
    }else{
        var nowTime = new Date().getTime();
        $.ajax({
            type: 'get',//请求
            url: 'https://www.paperyy.com/weixin/ajax.aspx?oper=login_ticket&t=' + nowTime,//接口地址'
            dataType: 'json',
            async: true,
            success: function(data){
                if(data.result == 1){
                    extra = data.extra;
                    count++;
                    ticket = data.returnval;//获取二维码的密钥
                    var qr_url = 'https://mp.weixin.qq.com/cgi-bin/showqrcode?ticket=' + ticket + '&t=' + nowTime;
                    $("#login-qr-img").attr("src",qr_url);
                    verify = setTimeout(loginVerify,2000);//每2秒确认二维码状态
                    refresh = setTimeout(getLoginQrImg1,180000);//一段时间后刷新二维码

                }else{
                    //获取data错误，处理语句待定（可以是报错，也可以再次获取）
                }
            },
            error: function(){
                //请求错误，处理函数待定
            }
        });
    }
}
function loginVerify(){
    if($("#login-qr-img").is(':hidden')){
        verify = setTimeout(loginVerify,2000);
        return;
        //当点击切换为账号登录时，从这里递归调用函数，使函数不执行请求操作而是进入循环等待
    }
    var nowTime = new Date().getTime();
    $.ajax({
        type: 'get',
        url: 'https://www.paperyy.com/weixin/ajax.aspx?oper=login_verify&t=' + nowTime + '&login_s=' + extra,
        dataType: 'json',
        async: true,
        success: function(data){
            if(data.result == 1){//检查二维码是否被扫描并关注
                loginSuccess();
            }else{
                verify = setTimeout(loginVerify,2000);//否则2秒后再请求一次
            }
        },
        error: function(){
            //待定
        }
    });
}
function getLoginQrImg1(){
    if(verify){
        clearTimeout(verify);
    }//先清空确认状态的定时器再请求图片
    getLoginQrImg();
}
function loginSuccess(){
    //登录上后记得清除计时器
    if(verify){
        clearTimeout(verify);
    }
    if(refresh){
        clearTimeout(refresh);
    }
    top.location.href = 'https://www.baidu.com';//登录成功后跳转的页面
}
/*****************************************验证码登录**************************************/
/*
    手机号判断：
    1. 判断错误手机号情况：手机号为空、手机号错误（正则表达式）
    2. 提示语：在P元素的后面添加em元素（p需要额外加class）,或者找该表单元素的上一个兄弟元素，再其中插入em
    3. 事件发生对象：点击获取验证码（也可以再加提交按钮）进行判断
    4. 判断错误后，点击表单（onfocus）时提示语消失
    5. 手机号首尾去空格
    6. 点击获取短信验证码后倒计时结束才能继续获取
        -倒计时可以用settimeout闭包或递归实现，也可用setInterval实现
        -获取验证码按钮若不是按钮或表单元素，则用节流阀，否则就用disabled属性来时倒计时中的按钮失效
        -比较推荐用简单的方式（按钮+setInterval）实现
    7. 同一手机号短信验证码前面几次不用图片验证码，后面都需要(一般后台决定，根据返回data中的状态判断是否弹出图片验证码输入)
*/
$(function(){
    var flag = true;//异步请求节流阀
    var maxtime = 10;
    var timer = null;
    String.prototype.trim = function(){
        return this.replace(/(^\s*)|(\s*$)/g,'');
    }//除去手机号首尾空格
    //当表单获取焦点时清除提示字
    $("input").on('focus',function(){
        $(this).prev().find("em.input-error").text("");
    });
    //获取验证码点击事件
    $(".login2 .get-v-code").click(function(){
        var tele_num = $(".login2 .input-tele").val();
        tele_num = tele_num.trim();
        if(tele_num == ''){
            $(".input-tele").prev().find("em.input-error").text("*请输入手机号");
        }else if(!isTele(tele_num)){
            $(".input-tele").prev().find("em.input-error").text("*请输入正确的手机号");
        }else{
            $(".input-tele").prev().find("em.input-error").text("");
            if(flag){
                flag = false;
                teleAjax();//手机号格式正确就发送验证码请求    
            }
        }
    });
    //关闭弹出栏
    $(".popup .close").click(function(){
        $(".popup-wrapper").hide();
    });
    //图片验证码点击刷新
    $(".popup2 .imgCode").click(refreshImgCode);
    //提交图片验证码按钮
    $(".submit-imgCode").click(function(){
        var value = $("#imgCodeValue").val();
        value = value.trim();
        if(value == ''){
            $(".popup2 .input-error").text("*请输入验证码");
        }else if(value.length != 6){
            $(".popup2 .input-error").text("*验证码格式不正确");
        }else{
            submitImgCode();
        }
    });

    



    function teleAjax(){   
        timer = setTimeout(countDown,500);
        $.ajax({
            type: 'get',
            url: 'https://www.paperyy.com/mobile/code/v2/login/code',
            data: {
                mobile: $(".input-tele").val(),
                code: $("#imgCodeValue").val(),//图片验证码
                codeId: $(".popup2 .imgCode").attr("data-clientid"),
            },
            dataType: 'json',
            async: true,
            success: function(d){
                console.log('获取手机验证码');
                console.log(d)
                if(d.code=="0"){
                    if(d.data=="failed"){
                        $('.popup-login2').show();
                        refreshImgCode();
                    }else {
                        
                    }
                }else {
                    $(".v-code-wrapper").prev().find("em.input-error").text("*"+d.msg);
                    clearTimeout(timer);
                    $(".login2 .get-v-code").text("获取验证码");
                    flag = true;//别忘了中断定时器后要重置节流阀
                }
            },
            error: function(){}
        });
    }
    function countDown(){
        // var oldtime = 60;
        // while(maxtime--){
        //     //注意闭包
        //     //会同时创建多个异步函数同时执行,故需要每个函数的开始时间不同（maxtime*1000）(正计时)
        //     //(oldtime-maxtime)*1000)倒计时
        //     (function(maxtime){
        //         timer = setTimeout(function(){
        //             console.log(maxtime);
        //         },(oldtime-maxtime)*1000);
        //     })(maxtime)
        // }
        
        //递归形式的倒计时
        maxtime--;
        $(".login2 .get-v-code").text(maxtime + 's 后获取');
        if(maxtime!=0){
            timer = setTimeout(countDown,1000);
        }else{
            $(".login2 .get-v-code").text('获取验证码');
            flag = true;
            maxtime = 10;
        }
    }
    function refreshImgCode(){
        $.ajax({
            type: 'get',
            url: 'https://www.paperyy.com/code/getCode?update=' + Math.random(),
            dataType: 'json',
            async: true,
            success: function(d){
                // console.log('刷新图片验证码');
                // console.log(d);
                if(d.code == 0){
                    $(".popup2 .imgCode").attr("data-clientId",d.body.id);
                    $(".popup2 .imgCode").attr("src",'https://www.paperyy.com/code/getImage?id='+d.body.id+ '&update=' + Math.random());
                }else{
                    $(".popup2 .input-error").text(d.returnval);
                }
            },
            error: function(){}
        });
    }
    function submitImgCode(){
        var id = $(".popup2 .imgCode").attr("data-clientid");
        var code = $("#imgCodeValue").val().trim();
        $.ajax({
            type: 'get',
            dataType: 'json',
            url: 'https://www.paperyy.com/code/verifyCode?id=' + id + '&code=' + code,
            async: true,
            success: function(d){
                // console.log('提交验证码');
                // console.log(d)
                if(d.code == 0){
                    $(".popup-wrapper").hide();//图片验证成功，关闭验证栏，再次获取短信验证码
                    teleAjax();
                }else{
                    $(".popup2 .input-error").text("*验证码错误");
                }
            },
            error: function(){}
        });
    }
});
function isTele(tele_num){
    var result = /^(13[0-9]|14[5|7]|15[0-9]|18[0-9])\d{8}$/.test(tele_num);
    return result;
}

//未完

/****************************************************************************************/
