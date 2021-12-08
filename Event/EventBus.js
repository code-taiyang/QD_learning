const EventBus = (function(){
    // 一个小demo，看到onlyoffice中editor.asc_registerCallback实现自定义事件注册的方式来的兴趣
    function EventBus(){
        // 此处的EventBus应当为全局单例，单例暂时不写
        this.Bus = {};//Bus为一个字典（可以用Map数据结构），key为事件名，value为事件队列
    }
    EventBus.prototype = {
        constructor: EventBus,
        /**
         * @description 注册事件
         * @param {String} eventName
         * @param {Function} eventHandle 传入的handler 后续考虑兼容传入args或数组
         */
        $on(eventName,eventHandle){
            let hasEvent = this.hasEvent(eventName);
            if(!hasEvent){
                this.Bus[eventName] = [];//若没有事件则初始化队列
            }
            this.Bus[eventName].push(eventHandle);//事件处理加入
        },
        // 取消事件
        $off(eventName,eventHandle){
            // eventHandle为可选，若存在则先判断是否为函数或数组
            //为函数则只清除掉队列中的指定handle
            //为数组，则进行比对，清除队列中存在的handle
            //若不填，则清空所有的队列，key也可清除掉
        },
        /**
         * @description 只触发一次
         * @param {String} eventName
         * @param {Function} eventHandle 传入的handler 后续考虑兼容传入args或数组
         */
        $once(eventName,eventHandle){
            // 注册的事件handle触发后需要销毁
        },
        /**
         * @description 判断Bus是否有该事件
         * @param {String} eventName
         * @returns {Boolean} 
         */
        hasEvent(eventName){
            return Object.prototype.hasOwnProperty.call(this.Bus, eventName);
        },
        /**
         * @description 获取事件处理的队列
         * @param {String} eventName
         * @returns {Array} 事件队列
         */
        getHandles(eventName){
            return this.Bus[eventName];
        },
        /**
         * @description 执行事件
         * @param {String} eventName
         * @param {Any} args 传入handle的若干参数
         * @returns {Boolean} 是否执行成功
         */
        $emit(eventName,...args){
            if(this.hasEvent(eventName)){
                this.Bus[eventName].forEach(handle => {
                    handle.apply(this || window, args);//args兼容写法：Array.prototype.slice.call(arguments, 1)
                });
                return true;
            }
            return false;
        }

    }
    return EventBus;
})();


/*测试*/
let eventBus = new EventBus();
eventBus.$on('say',function(str){
    console.log(str);
})
eventBus.$on('say',function(str){
    console.log('my name is sty');
})

let cnt = 0;
let timer = setInterval(() => {
    console.log('cnt :>> ', cnt++);
    eventBus.$emit('say','hello')
}, 2000);
setTimeout(() => {
    clearInterval(timer);
    timer = null;
}, 20000);
console.log('EventBus :>> ', eventBus);



