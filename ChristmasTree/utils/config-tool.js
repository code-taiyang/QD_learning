/**
 * @description 获取默认配置
 * @param {Function} Constructor 构造函数
 * @returns {Object} 默认配置
 */
function getDefaultConfig(Constructor){
    if(Constructor.getDefaultConfig){
        return Constructor.getDefaultConfig();
    }
    return null;
}

/**
 * @description 检测配置是否正确
 * @param {Object} config 输入的配置参数
 * @param {Object} DefaultConfig 默认的配置和校验 
 * @returns {Boolean}
 * DefaultConfig数组成员必须要有：defaultVal、type、required属性
 */
function checkConfig(config , DefaultConfig = {}){
    if(isEmpty(config)){
        return false;
    }
    for(let key in DefaultConfig){
        if(config[key] === undefined){ // 没传入检测其必要性
            if(DefaultConfig[key].required){
                if(DefaultConfig[key].msg){
                    console.error(DefaultConfig[key].msg);
                }
                throw new Error(`缺少必须参数：${key}！`);
            }
        }else{// 传入了就检测其类型
            if(config[key].constructor !== DefaultConfig[key].type){//通过constructor检测类型
                if(DefaultConfig[key].msg){
                    console.error(DefaultConfig[key].msg);
                }
                throw new Error(`类型错误：参数${key}必须是${DefaultConfig[key].type.name}类型`);
            } 
        }
    }
    return true;
}

/**
 * @description 合并配置
 * @param {Object} config 输入的配置参数
 * @param {Object} DefaultConfig 默认的配置和校验 
 * @returns 合并后的配置
 */
function mergeConfig(config, DefaultConfig){
    let checkFlag = checkConfig(config, DefaultConfig);
    let defaultConfig = {};
    for(let key in DefaultConfig){
        defaultConfig[key] = DefaultConfig[key].defaultVal;
    }
    if(isEmpty(config)){
        return defaultConfig;
    }
    if(checkFlag){
        // for(var key in config){
        //     if(DefaultConfig.hasOwnProperty(key)){
        //         DefaultConfig[key] = config[key];
        //     }
        // }
        return {...defaultConfig, ...config}
    }else{
        return defaultConfig;
    }
}
/**
 * @description 判断对象是否为空
 * @param {Object} config 输入的配置参数
 * @returns {Boolean}
 */
function isEmpty(config){
    for(let key in config){
        return false;
    }
    return true;
}

/**
 * @description 随机生成id
 * @param {Number} randomLength 输入的配置参数
 * @returns {String} id
 */
function GenNonDuplicateID(prefix = '', randomLength = 3){
    return prefix + Number(Math.random().toString().substr(3,randomLength) + Date.now()).toString(36);
}
/**
 * @description 是否为Number数组
 * @param {Array} arr
 * @returns {Boolean} 
 */
function isNumberArr(arr){
    if(Array.isArray(arr)){
        for(let i=0; i<arr.length; i++){
            if(typeof arr[i] != 'number'){
                return false;
            }
        }
        return true;
    }
    return false;
}