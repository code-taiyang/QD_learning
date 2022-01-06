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
    let punctuation_zn = /[|\：|\；|\、|\，|\。|\？|\！|\《|\》|\【|\】|\…|\“|\”|\‘|\’]+/g;
    let punctuation_en = /[|\:|\.|\,|\'|\"|\;|\\|\?|\!|\<|\>|\[|\]]+/g;
    let enReg = /\b[a-zA-Z\s|\:|\.|\,|\'|\"|\;|\\|\?|\!|\<|\>|\[|\]|\：|\；|\、|\，|\。|\？|\！|\《|\》|\【|\】|\…|\“|\”|\‘|\’]+/g;//英文,英文需要判断是句子还是词组，词组则视作中文
    let znReg = /[\u4e00-\u9fcb|]+/g 
    let result = {
        fullText: str,
        znText: str.match(znReg),
        enText: str.match(enReg)
    }
    return result;
}
let str1 = '设置this is a sentence.这个 He said: "I\'m very happy!"句子 zhit ....'
console.log('str1 :>> ', str1);
console.log('getEnText:>> ', getEnText(str1));
//英文句子和英文词组的区别：空格的数量，长度
//不对中文词组进行区分，一律为中文，因为英文句子中含有中文的情况很少
//英文标点 -- :;\,.?!<>[] '' ""
//中文标点 -- ：；、，。？！《》【】…… “” ‘’



// 段落拆分器
const ParagraphSplitter = (function (){
    
    function ParagraphSplitter(){

    }
    ParagraphSplitter.split = function(para){

    }
    return ParagraphSplitter;
})();
//输入段落，输出的是拆分后的段落句子，按中英文拆分
//英文句子的特征：以单词边界\b开头，句子中含有字母、空格和各种半角标点（在标点错误的情况下还会有全角标点），结尾为字母、空格或标点
//（中文句子中的）英文词组的特征：同上，但是空格（/\b\s+\b/）比较少<2,即三个单词


//拆分的方法思路：
//思路1：将段落用正则拆分为中文和英文句子（带标点），再对英文词组进行区分
//思路2：将段落中的所有标点先遍历并记录位置，因为标点检测只需要直到标点是否正确和位置，故去掉标点后再对句子进行拆分，对正则会简单一些，拆分出来的句子不会含标点，后面标点的判断只需判断标点位置是否在这个句子的范围内即可
//最后的操作都差不多

// 中文unicod编码表：\u4E00-\u9FA5(基本汉字)、\u9FA6-\u9FFF(基本汉字补充)