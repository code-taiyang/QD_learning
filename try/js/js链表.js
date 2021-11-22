//JS的链表分为2个对象，大对象即链表，包含链表的一些属性（长度，头尾节点等）和操作方法（输出，增加节点等）
//小对象是节点，包含节点的值和对下一个或上一个节点的引用

function Node(value) { 
    this.value = value;
    this.next = null;
}
function List() {
    this.head = null;
    this.tail = this.head;
    var length = 0;
    this.appendNode = function(v){
        var node = new Node(v);
        if(this.head==null){
            this.head = node;
            this.tail = this.head;
        }else{
            this.tail.next = node;
            this.tail = node;
        }
        length++;//别忘了更新长度
    }
 //以下index均为从0开始
    //插入节点
    this.insertAfter = function(index,value){
        if(index>length||index<0){
            console.log("index范围出错");
            return;
        }
        var node = new Node(value);
        var p = this.indexOf(index);
        if(index == length-1){//插在表尾
            this.tail.next = node;
            this.tail = node;
        }else{
            node.next = p.next;
            p.next = node;
        }
        length++;//别忘了更新长度
        return node;
    }
    this.insertBefore = function(index,value){
        if(index>length||index<0){
            console.log("index范围出错");
            return;
        }
        var p ;
        var node = new Node(value);
        if(index == 0){//插在表头前时
            node.next = this.head;
            this.head = node;
        }else{
            p = this.indexOf(index-1);
            node.next = p.next;
            p.next = node;
        }
        length++;//别忘了更新长度
        return node;
    }
    //删除指定节点
    //待改进，请务必分清楚删除第一个和最后一个节点以及其它节点的情况，必须更新head和tail和长度
    this.removeNode = function(index){
        if(index>length||index<0){
            console.log("index范围出错");
            return;
        }
        var listLength = length;
        if(index == 0){
            var node = this.head;
            this.head = this.head.next;
            node.value = null;
            node.next = null;    
            length--;//别忘了更新长度
            return;
        }
        var p = this.indexOf(index);
        var q = this.indexOf(index-1);
        q.next = p.next;
        p.value = null;
        p.next = null;
        if(index == (listLength-1)){
            this.tail = q;
            this.tail.next = null;
        }
        length--;//别忘了更新长度
    }
    //删除链表
    this.removeList = function(){
        var index = 0;
        var listLength = this.getLength();//length在每次循环都会减少，不要直接用length
        for(var i=0;i<listLength;i++){
            this.removeNode(index);
        }
        if(length==0){
            console.log("链表已删除");
        }
    }
    //翻转链表*****重要，必须掌握
    this.reverseList = function(){
        var current = this.head.next;
        var temp = null;
        var pre = this.head;
        while(current!=null){
            temp = current.next;
            pre.next = temp;
            current.next = this.head;
            this.head = current;
            current = temp;
        }
        this.tail = pre;       
    }
    //输出链表
    this.toString = function(){
        var p = this.head;
        var str = "";
        if(!p){
            console.log("无数据");
            return;
        }
        do{
            console.log(p.value);
            str+= p.value+" "
            p = p.next;
        }while(p);
        return str;//记得返回字符串
        //若想输出数组形式，用push()方法遍历即可
    }
    //找到指定节点
    this.indexOf = function(index){
        var p = this.head;
        if(index>=length||index<0){
            console.log(length);//
            console.log("index范围出错!");
            return;
        }
        if(index == 0){
            return this.head;
        }
        for(var i=0;i<index;i++){
            p = p.next;
        }
        return p;
    }
    //按值查找
    this.find = function(value){
        var p = this.head;
        while(p.next!=null&&p.value != value){
            p = p.next;
        }
        if(p.value != value){
            console.log("为找到该节点");
            return -1;
        }
        return p;
    }
    this.indexOfValue = function(index){
        var p = this.indexOf(index);
        return p.value;
    }
    this.getLength = function(){
        return length;
    }
    this.getLastValue = function(){
        return this.tail.value;
    }
    this.getFirstValue = function(){
        return this.head.value;
    }
}
var sy = new List();
console.log("********1********");
sy.appendNode(5);
sy.appendNode(4);
sy.appendNode(3);
sy.appendNode(2);
sy.appendNode(1);

sy.reverseList();

sy.toString();

console.log("********2********");
sy.insertAfter(1,5);
sy.insertBefore(0,6);
sy.insertAfter(5,5);
sy.toString();
console.log("listLength = "+sy.getLength())
console.log(sy.toString())
console.log("********3********");
sy.removeNode(0);
sy.removeNode(2);
sy.removeNode(sy.getLength()-1);
sy.toString();
console.log("listLength = "+sy.getLength())

console.log("********4********");
console.log("listLength = "+sy.getLength())
console.log("first = "+sy.getFirstValue())
console.log("last = "+sy.getLastValue())
console.log("index = 0 : "+sy.indexOfValue(0))
console.log("index = last : "+sy.indexOfValue(sy.getLength()-1))
console.log(sy.find(1));
console.log("********5********");
sy.removeList();
sy.toString();

