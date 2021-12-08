const StringUnit = (function(){
    function StringUnit(unitArr){
        this.units = unitArr||[];
    }
    StringUnit.create = function(sText){
        let arr = [];
        let unitArr = [];
        arr = sText.split('');
        unitArr = arr.map((item,i) => {
            return {
                index: i,//在字符串中的位置
                value: item,//字符
            }
        });
        return new StringUnit(unitArr);
    }
    return StringUnit;
})();

const brackets = {
    '{':'}',
    '<':'>',
    '《':'》',
    '（':'）',
    '(':')',
    '“':'”',
    '‘':'’',
    '【':'】',
    '[':']',//该方法不能判断英文单双引号的闭合
};
function checkClose(str){
    const stack = [];
    const values = Object.values(brackets);
    let stringUnits = StringUnit.create(str);
    let units = stringUnits.units;
    let unColsedPos = [];
    for(let i=0; i<units.length; i++){//遍历字符数组
        let item = units[i];
        if(values.includes(item.value)){//若字符是反括号
            if( stack.length == 0 || item.value != brackets[stack[stack.length-1].value] ){//栈空或反括号与栈顶不匹配
                unColsedPos.push(item);
            }else{
                stack.pop();//如果匹配，则弹出
            }
        }else if(brackets[item.value]){//若为正括号，则入栈
            stack.push(item);
        }
    }
    unColsedPos = [...stack, ...unColsedPos];//stack中多余的正括号和未匹配的反括号就是没闭合的括号
    return unColsedPos;
}
let str = '{[)}]'

// console.log('checkClose(str) :>> ', checkClose(str));
function getEnText(str){
    let enReg = /\b[a-zA-Z\s\:\.\,\'\"\;\\\?\!<>\[\]]+/g;//英文,英文需要判断是句子还是词组，词组则视作中文
    let znReg = / /g 
    return str.match(enReg);
}
let str1 = 'this is a sentence. He said: "I\'m very happy!"'
console.log('str1 :>> ', str1);
console.log('getEnText:>> ', getEnText(str1)[0]);
//英文句子和英文词组的区别：空格的数量，长度
//不对中文词组进行区分，一律为中文，因为英文句子中含有中文的情况很少
//英文标点 -- :;\,.?!<>[] '' ""
//中文标点 -- ：；、，。？！《》【】…… “” ‘’