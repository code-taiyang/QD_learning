// IE8以下不支持bind方法，此处进行重写
(function(){
  if (!Function.prototype.bind) {
        Function.prototype.bind = function (oThis) {
          if (typeof this !== "function") {
            throw new TypeError("Function.prototype.bind - what is trying to be bound is not callable");
          }
          var aArgs = Array.prototype.slice.call(arguments, 1),
          fToBind = this,
          fNOP = function () {},
          fBound = function () {
            return fToBind.apply(this instanceof fNOP && oThis
            ? this
            : oThis,
            aArgs.concat(Array.prototype.slice.call(arguments)));
          };
          fNOP.prototype = this.prototype;
          fBound.prototype = new fNOP();
          return fBound;
      };
    }
}());


(function (win, doc) {
  "use strict";
  // 使用单例模式
  var getSingle = function(fn){
    var result;
    return function(){
      if(result){
        console.log('已存在单例 :>> ', result);
        result.open();
      }else{
        console.log('创建单例');
      }
      return result || (result = fn.apply(this, arguments));
    }
  }
  // 判断对象是否为空
  function isEmpty(obj) {
    for(var prop in obj){//为了兼容IE8
      return false;
    }
    return true;
  }

  // 对象深拷贝
  function deepClone(obj){
    return obj;//JSON方法不太适用，暂时搁置
  };
  // 配置合并方法
  function mergeConfig(config,defaultConfig){
    if(isEmpty(config)){
      return defaultConfig;
    }
    // 类型检测后再合并
    if(!configCheck(config,Dialog.getConfigRules())){
      return defaultConfig;
    }
    for(var key in config){
      if(defaultConfig.hasOwnProperty(key)){
        defaultConfig[key] = config[key];
      }
    }
    return defaultConfig;//为了不影响defaultConfig，传入函数的defaultConfig需要先进行拷贝
  }
  
  //解析弹窗配置 
  function resolveConfig(dialog){//传入单例
    var config = dialog.config;
    var domArr = [
       "<div class='container'>"
      , config.hasMask
        ?"<div class='mask'></div>"
        :""
      , "<div class='dialog'>"
      ,   config.hasClose
          ?"<i class='close-icon'><i class='line l-line'></i><i class='line r-line'></i></i>"
          :""
      ,   "<div class='title'>"+config.title+"</div>"
      ,   "<div class='content'>"
      ,   config.template.length == 0
          ?"<div class='content-txt'>"+config.content+"</div>"
          :"<div class='template'>"+config.template.join('')+"</div>"
      ,     "<div class='btn-box'>"
      ,       config.hasCancel
              ?"<button class='button cancel-btn'>"+config.cancelTxt+"</button>"
              :""
      ,       config.hasOk
              ?"<button class='button ok-btn'>"+config.okTxt+"</button>"
              :""
      ,     "</div>"
      ,     "<div class='bottom-slot'></div>"
      ,   "</div>"
      , "</div>"
      ,"</div>"
    ]; 
    var div = document.createElement('div');
    div.innerHTML = domArr.join('');
    div.setAttribute('id',config.id);
    div.style.display='none';
    document.body.appendChild(div);
    return div;
  };
  // 渲染弹窗样式
  function renderDialog(dialog){
    dialog.open();//因为在解析DOM时，默认添加了display:none，此处渲染需要重新打开
    // 暂时用css文件替代

    // 计算定位偏移,因为兼容IE8，所以此处偷懒不用transform，而是直接计算
    var info = dialog.getInfo();
    dialog.dialogDiv.style.marginLeft = -info.offsetWidth / 2 + 'px';
    dialog.dialogDiv.style.marginTop = -info.offsetHeight / 2 + 'px';
    dialog.close();
    // 此处若不使用close，可用惰性单例模式（点击按钮时才渲染弹窗DOM）
    // 使用close的话，create初次创建的弹窗将自动关闭（除非外部手动开启），故此时不能用惰性单例，因为点击按钮渲染出来的DOM为display:none
  }
  // 添加事件处理
  function addEventHandle(dialog){//传入单例
    var config = dialog.config;
    var mask = document.querySelector('#'+config.id+' .mask');
    var closeBtn = document.querySelector('#'+config.id+' .close-icon');
    var okBtn = document.querySelector('#'+config.id+' .ok-btn');
    var cancelBtn = document.querySelector('#'+config.id+' .cancel-btn');

    // 注意结合配置进行判断

    // 遮罩
    if(dialog.config.hasMask && config.maskClose){
      Dialog.on(mask, 'click', function(){
        dialog.close();
      });
    }
    // 确定按钮
    dialog.config.hasOk && Dialog.on(okBtn, 'click', function(e){
      if(this.config.asyncOk){
        // this.config.onOk.bind(this)(e);//如果确认按钮处理含有异步请求，则将this传入，手动this.close()关闭
        // 异步请注意添加放重复提交功能，在此处或使用者在外部手动添加
        this.startLoading();
        this.config.onOk(e,this);//将单例通过参数传入或许更好？
      }else{
        this.config.onOk(e);
        this.close();
      }
    }.bind(dialog));
    // 取消按钮
    dialog.config.hasCancel && Dialog.on(cancelBtn, 'click', function(e){
      this.config.onCancel(e);
      this.close();
    }.bind(dialog));
    // 关闭按钮
    dialog.config.hasClose && Dialog.on(closeBtn, 'click', function(e){
      this.config.onClose(e);
      this.close();
    }.bind(dialog));
  }



  // 默认配置
  var defaultConfig = {};
  // 配置项的定义要求, 保证输入的配置合理
  var configRules = {
    id: {
      required: false,
      type: String,
      defaultVal: 'my-dialog',
    },
    title: {
      required: false,
      type: String,
      defaultVal: '默认标题',
    },
    content: {
      required: false,
      type: String,
      defaultVal: '默认内容',
    },
    // 用于插入DOM，可以插入一些简单的表单或元素，不建议复杂的DOM和逻辑
    template: {
      required: false,
      type: Array,
      defaultVal: []
    },
    //是否需要遮罩
    hasMask: {
      required: false,
      type: Boolean,
      defaultVal: true,
    },
    // 点击遮罩是否关闭弹窗
    maskClose: {
      required: false,
      type: Boolean,
      defaultVal: false,
    },
    hasOk: {
      required: false,
      type: Boolean,
      defaultVal: true,
    },
    hasCancel: {
      required: false,
      type: Boolean,
      defaultVal: true,
    },
    hasClose: {
      required: false,
      type: Boolean,
      defaultVal: true,
    },
    // ok异步关闭
    asyncOk: {
      required: false,
      type: Boolean,
      defaultVal: false,
    },
    hasLoading: {
      required: false,
      type: Boolean,
      defaultVal: true,
    },
    loadingAnimation: {
      required: false,
      type: Boolean,
      defaultVal: false,
    },
    // 目前只在确认按钮上显示loading
    loadingTxt: {
      required: false,
      type: String,
      defaultVal: '加载中',
    },
    loadingColor: {
      required: false,
      type: String,
      defaultVal: '#779ef8',
    },
    okColor: {
      required: false,
      type: String,
      defaultVal: '#467AF2',
    },
    okTxt: {
      required: false,
      type: String,
      defaultVal: '确定',
    },
    cancelColor: {
      required: false,
      type: String,
      defaultVal: '#EDF2F7',
    },
    cancelTxt: {
      required: false,
      type: String,
      defaultVal: '取消',
    },
    onOk: {
      required: false,//ok若没有回调则默认关闭弹窗
      type: Function,
      defaultVal: function(){
        console.log('onOk config:>> ', this);
      },
    },
    onCancel: {
      required: false,
      type: Function,
      defaultVal: function(){
        console.log('onCancel config:>> ', this);
      },
    },
    onClose: {
      required: false,
      type: Function,
      defaultVal: function(){
        console.log('onClose config:>> ', this);
      },
    }
  };
  // 配置检测，配置不合理则报错。
  function configCheck(config, configRules){
    for(var key in configRules){
      var value = config[key];
      if(value === undefined){
        if(configRules[key].required){
          throw new Error('缺少配置：'+'字段'+key+'必须传入');
        }
      }else{
        if(value.constructor !== configRules[key].type){//通过constructor检测类型（不知道会不会有问题？）
          throw new Error('类型错误：'+'字段'+key+'必须是'+configRules[key].type.name+'类型');
        }
      }
    }
    return true;
  }




  // 构造函数
  function Dialog(config){
    this.config = mergeConfig(config,Dialog.getDefaultConfig());
    this.dialogInfo = {};
    this.loadingTimer = null;
    this.init();
  };
  // 创建Dialog单例
  Dialog.create = getSingle(function (config){
    return new Dialog(config);
  });
  // 添加监听器
  Dialog.on = function (ele, eventName, handle, useCapture){
    if(useCapture === undefined){
      useCapture = false;
    }
    // 此处可以用惰性函数进行优化，不需要每次调用都进行判断，第一次全局判断后，后面就都使用判断的结果
    if(ele.addEventListener){
      ele.addEventListener(eventName, handle, useCapture);
    }else if(ele.attachEvent){
      ele.attachEvent('on'+eventName, handle.bind(ele));//IE8及以下,注意此处this指向和事件名
    }else{
      ele['on'+eventName] = handle;
    }
    return ele;
  };
  // 移除监听器
  Dialog.off = function (ele,eventName,handle){
    if(ele.removeEventListener){
      ele.removeEventListener(eventName,handle,false);
    }else if(ele.detachEvent){
      ele.detachEvent('on'+eventName,handle.bind(ele));
    }else{
      ele['on'+eventName] = '';
    }
  };
  // 获取默认配置
  Dialog.getDefaultConfig = function(){
    var rules = Dialog.getConfigRules();
    for(var key in rules){
      defaultConfig[key] = rules[key].defaultVal;
    }
    return deepClone(defaultConfig);
  };
  // 获取配置项要求
  Dialog.getConfigRules = function(){
    return deepClone(configRules);
  };
  // 在原型链上添加方法
  Dialog.prototype = {
    constructor: Dialog,//使用对象字面量重写prototype时必须加上
    // 初始化弹窗
    init: function(){
      this.container = resolveConfig(this);
      this.dialogDiv = document.querySelector('#'+this.config.id+' .dialog');
      addEventHandle(this);
      renderDialog(this);
      this.getInfo();
    },
    // 弹窗开启
    open: function(){
      if(!this.container){
        this.init();
      }
      this.container.style.display = 'block';
    },
    // 弹窗关闭
    close: function(){
      // 若设置了loading样式，则需要换还原
      this.clearLoading();
      this.container.style.display = 'none';
    },
    // 销毁弹窗
    remove: function(){
      document.body.removeChild(this.container);//只是将元素移出DOM树，但仍在内存中
      this.container = null;
    },
    // 获取弹窗的尺寸和位置
    getInfo: function(){
      var position = this.dialogDiv.getBoundingClientRect();
      this.dialogInfo = {
        offsetWidth: position.right - position.left,
        offsetHeight: position.bottom - position.top,
        top: position.top,
        bottom: position.bottom,
        right: position.right,
        left: position.left,
      };
      console.log('this.dialogInfo :>> ', this.dialogInfo);
      return this.dialogInfo;
    },
    startLoading: function(){
      if(this.loadingTimer) return false;//loading防重复
      if(this.config.hasLoading){
        var okBtn = this.dialogDiv.querySelector('.ok-btn');
        okBtn.innerText = this.config.loadingTxt;
        okBtn.style.backgroundColor = this.config.loadingColor;
        if(this.config.loadingAnimation){//开启简单的loading动画
          var cnt = 0;
          okBtn.style.cursor = 'wait';
          this.loadingTimer = setInterval(function(dialog){
            okBtn.innerText += '.';
            cnt++;
            if(cnt>3){
              cnt = 0;
              okBtn.innerText = dialog.config.loadingTxt;
            }
          },500,this);//注意this指向变了,定时器第三个参数是传入回调的，IE9及以下不支持，待修改
        }
      }
      
    },
    clearLoading: function(){
      if(this.config.hasLoading){
        var okBtn = this.dialogDiv.querySelector('.ok-btn');
        okBtn.innerText = this.config.okTxt;
        okBtn.style.backgroundColor = this.config.okColor;
        okBtn.style.cursor = 'pointer';
        clearInterval(this.loadingTimer);
        this.loadingTimer = null;// 注意loading计时器引用要清空
      }
    },
  }
  window.Dialog = Dialog;
  return Dialog;
})(typeof window !== "undefined" ? window : this, document);

