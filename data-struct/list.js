const List = (function () {
  function List(...arr) {
    this.length = 0;//链表长度
    this.head = null;//链表头
    this.tail = null;//链表尾
    this.appendNode(...arr);//生成链表
  };
  function Node({name,age}){//节点
    this.name = name;
    this.age = age;
    this.next = null;
    this.prev = null;
  };
  List.create = function (...arr) {
    return new List(...arr);
  },
  List.prototype = {
    constructor: List,
    getListInfo: function (){
      console.log('this.length :>> ', this.length);
      console.log('this.head :>> ', this.head);
      console.log('this.tail :>> ', this.tail);
    },
    appendNode: function (...arr) {
      let nodeArr = arr.map(node => {
        return new Node(node);
      });
      for(let i=0; i<nodeArr.length; i++){
        // let currentNode = null;
        if(this.head){
          // currentNode = this.head;
          // while(currentNode.next){
          //   currentNode = currentNode.next;
          // }此处用于遍历出尾节点
          // currentNode.next = nodeArr[i];
          let prev = this.tail;//缓存当前尾节点，当尾节点更新后可作为prev传入新的尾节点
          this.tail.next = nodeArr[i];//若类中定义过尾节点，可直接存储和更新，无需遍历
          this.tail = nodeArr[i];
          this.tail.prev = prev;
        }else{
          this.head = this.tail = nodeArr[i];
        }
        this.length++;
      }
    },
    // 从前面拼接节点
    prependNode: function(...arr){
      let nodeArr = arr.map(node => {
        return new Node(node);
      });
      for(let i=0; i<nodeArr.length; i++){//倒序连结
        let next = this.head;//缓存当前的head节点
        this.head.prev = nodeArr[i];
        this.head = nodeArr[i];//更新头节点
        this.head.next = next;
        this.length++;
      }
    },
    // 从指定序号后插入节点
    insertNodeByIndex: function(index, ...arr){
      let targetNode = this.getNodeByIndex(index);
      let nextNode = targetNode ? targetNode.next : null;// 若target为尾节点，则该值为null，注意链表无节点的情况
      this.tail = targetNode; //重新定义尾节点
      this.appendNode(...arr); //拼接新的节点
      if(nextNode){ //若target不为尾节点，则拼接并更新尾节点
        this.tail.next = nextNode;
        nextNode.prev = this.tail;
        while(this.tail.next){
          this.tail = this.tail.next;//遍历出新的尾节点
        }
      }
    },
    // 通过name获取节点（只获取第一个）
    getNodeByName: function (name) {},
    getNodesByName: function (name) {},
    // 通过序号获取节点
    getNodeByIndex: function (index) {
      let currentNode = this.head;//若index为0则输出head
      for(let i=0; i<index; i++){
        if(currentNode == this.tail){
          break;
        }
        currentNode = currentNode.next;
      }
      return currentNode;
    },
    editNode: function () {},
    // 删除节点
    deleteNodeByIndex: function (index) {
      let targetNode = this.getNodeByIndex(index);
      if(targetNode == null){
        throw new Error('未查询到节点信息，可能链表长度为0');
      }
      let prev = targetNode.prev;
      let next = targetNode.next;
      if(next){
        next.prev = prev;
      }
      if(prev){
        prev.next = next;
      }
      if(targetNode == this.head){// 边界条件时别忘记更新首/尾节点
        this.head = next;
      }
      if(targetNode == this.tail){
        this.tail = prev;
      }
      targetNode.prev = targetNode.next = null;//释放目标节点
      targetNode = null;
      this.length--;// 更新长度
      this.getListInfo();
    },
    // 删除整个链表
    deleteList: function () {
      for(;;){
        try {
          this.deleteNodeByIndex(0);
        } catch (error) {
          alert('删除完成！');
          return this;
        }
      }
    },
    printList: function(){
      let currentNode = this.head;
      if(currentNode == null){

      }else{
        while(currentNode.next){
          currentNode = currentNode.next;
          console.log(`node.con`);
        }
      }
    },
    revertPrint: function(){},
    // 链表的排序
    // 链表的遍历map/foreach等高阶函数
  }
  return List;
})()
