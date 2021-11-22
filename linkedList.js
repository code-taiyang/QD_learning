//JS双向链表
  //节点类
  var Node = function (pData) {
    this.next = null; //后继“指针”
    this.prev = null; //前驱"指针"
    this.data = pData;
  }
  //单链表(约定：头节点不放内容，当哨兵位，有效元素从头节点后的第1个元素开始)
  var DbLinkList = function () {
    this.head = new Node(null); //头节点   
    //插入新元素
    this.insert = function (pNodeValue) {
      var newNode = new Node(pNodeValue);
      //如果只有头节点
      if (this.head.next == null) {
        this.head.next = newNode;
        newNode.prev = this.head;
        return;
      }
      //否则遍历找到尾节点
      var p = this.head;
      while (p.next != null) {
        p = p.next;
      }
      p.next = newNode;
      newNode.prev = p;
    }
    //获取第n个元素的数据值
    this.getData = function (index) {
      if (index < 1 || index > this.size) {
        return null;
      }
      var p = this.head;
      var i = 1;
      while (p.next != null && i <= index) {
        p = p.next;
        i += 1;
      }
      return p.data;
    }
    //取尾节点
    this.getTail = function () {
      if (this.head.next == null) {
        return null;
      }
      var p = this.head.next;
      while (p.next != null) {
        p = p.next;
      }
      return p;
    }
    //删除指定位置的元素
    this.removeAt = function (index) {
      if (index < 1 || index > this.size) {
        return null;
      }
      var p = this.head;
      var i = 1;
      //从头开始遍历，找到index位置的前一个元素
      while (p.next != null && i < index) {
        p = p.next;
        i += 1;
      }
      p.next = p.next.next; //修改index位置前一个元素的后继指针
      p.next.prev = p;
      return p.data; //返回删除元素的值    
    }
    //打印所有元素
    this.print = function () {
      document.write("<br/>");
      if (this.head.next == null) {
        return;
      }
      var p = this.head.next;
      while (p.next != null) {
        document.write(p.data + " ");
        p = p.next;
      }
      document.write(p.data + " "); //最后一个元素，需要单独打印
      document.write("<br/>");
    }
    //从后打印所有元素
    this.printFromBack = function () {
      document.write("该链表共有" + this.size + "个元素，从后向前分别为:<br/>");
      var tail = this.getTail();
      var p = tail;
      if (p == null) {
        return;
      }
      while (p.prev != null) {
        document.write(p.data + " ");
        p = p.prev;
      }
      document.write("<br/>");
    }
    //插入排序
    this.insertSort = function () {
      if (this.head.next == null || this.head.next.next == null) {
        return;
      }
      var p = this.head.next;
      while (true) {
        if (p == null) {
          return;
        }
        var t = p.prev;
        //向前查找p之前的插入点
        while (t.prev != null && t.data > p.data) {
          t = t.prev;
        }
        //如果插入点就是p的前驱节点，不用调整，
        //忽略，直接进入下一轮
        if (t.next == p) {
          p = p.next;
          continue;
        }
        //将p的后续节点先保护起来，以便下一轮循环时确定起始位置
        var x = p.next;
        //将p从链表上摘下
        if (p.next != null) {
          p.next.prev = p.prev;
        }
        p.prev.next = p.next;
        //p插入到t之后
        t.next.prev = p;
        p.next = t.next;
        t.next = p;
        p.prev = t;
        this.print(); //打印输出，调试用  
        //重新将p定位到下一轮循环的"正确"起始节点
        p = x;
      }
    }
  }
  var linkTest = new DbLinkList();
  linkTest.insert(10);
  linkTest.insert(9);
  linkTest.insert(8);
  linkTest.insert(7);
  linkTest.insert(6);
  linkTest.insert(5);
  linkTest.insert(4);
  linkTest.insert(3);
  linkTest.insert(2);
  linkTest.insert(1);
  document.write("--排序前---<br/>")
  linkTest.print();
  linkTest.insertSort();
  document.write("<br/>--排序后---<br/>")
  linkTest.print();
