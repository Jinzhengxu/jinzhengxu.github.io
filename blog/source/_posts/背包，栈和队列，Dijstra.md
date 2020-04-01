---
title: 背包，栈和队列，Dijstra
categories:
  - 程序设计
date: 2018-09-26 16:28:35
tags:
  - 算法
copyright:
---

### 1.栈与队列

堆：先进后出 栈：先进先出dfgv ![Screenshot from 2018-09-26 23-16-05.png](https://jason87459473.files.wordpress.com/2018/09/screenshot-from-2018-09-26-23-16-05.png)

#### 1.1栈

先看一个简单的例子：Stack of String 下面给出API
```
public class StackOfString()
             StackOfString()  生成一个空栈
        void push()           在栈中加入一个新字符串
      String pop()            删除并返回最近添加的一个字符串
     boolean isEmpty()        栈是否为空 
         int size()           栈中字符串个数
```
“-”符号代表remove
```
public static void main(String\[\] args)
{
 StackOfStrings stack = new StackOfStrings();
 while (!StdIn.isEmpty())
 {
 String s = StdIn.readString();
 if (s.equals("-")) StdOut.print(stack.pop());
 else stack.push(s);
 }
}
```
#### 1.1.1堆栈：链表表示法

![Screenshot from 2018-09-26 23-55-44.png](https://jason87459473.files.wordpress.com/2018/09/screenshot-from-2018-09-26-23-55-44.png) 上图描述了链表构造的栈是如何工作的。

#### 1.1.1.1链表栈的Java实现

首先构造内部类：
```
public class LinkedListOfStack {
    private Node first = null;

    private class Node {
        String item;
        Node next;
    }

    public boolean isEmpty() {
        return first == null;
    }

    public void push(String item) {
        Node oldfist = first;   //save link to the list 
        first = new Node();     //create a new node for the beginning
        first.item = item;
        first.next = oldfist;   //set the instance variables in the new node
    }

    public String pop() {
        String item = first.item; // save item to return
        first = first.next;      // delete first node
        return item;            // return save item
    }
}
```
1.1.1.2 链表法的性能 每个操作需要花费常数的时间，一个有N个元素的链表需要40N Bite ![Screenshot from 2018-09-27 00-24-48.png](https://jason87459473.files.wordpress.com/2018/09/screenshot-from-2018-09-27-00-24-48.png)

#### 1.1.2 栈的数组实现

通过数组实现栈就更加容易了，首先声明一个数组（注意这里数组的长度一般不会给出，我们稍后介绍可变数组）。这样push()操作即为为S\[N\]赋值，而pop()操作即为将S\[N-1\]取出并置零。

#### 1.1.2.1数组法的Java实现
```
public class FixedCapacityStackOFStrings {
private String\[\] s;
private int N = 0;
public FixedCapacityStackOFStrings(int capacity){
s = new String\[capacity\];
}
public boolean isEmpty(){
return N==0;
}
public void push(String item){
s\[N++\]=item;
}
public String pop(){
String item = s\[N--\];
s\[N\] = 0;
return item;
}
}
```
1.2可变数组 首先可能会考虑每次当数组长度增加的时候，新建一个n+1的数组然后将原数组复制到新数组内部并添加新元素。可是这样无疑会产生大量不必要的操作，所以我们在每次扩大的时候将新数组设定为原数组两倍的大小。那么何时将数组减小呢，毕竟维护一个大数组需要使用大量的内存，在N变为原来的二分之一是缩小数组似乎是个办法，但是考虑一种名为“抖动”的情况，这种情况下N在二分之一处不停加一减一，使得新建数组的操作十分频繁，于是我们定义缩小数组在四分之一时，这样既能避免频繁新建数组了。
```
public class ResizingArrayStackOfStrings{
private String\[\] s;
private int N;
public void ResizingArrayStackOfStrings(){
s = new String\[1\];
}
public void push(String item){
if(N==s.length) resize(2*s.length);
s\[N++\]=item;
}
private void resize(int capacity){
String\[\] copy = new String\[capacity\];
for(int i =0;i<N;i++){
copy\[i\] = s\[i\];
}
s=copy;
}
public String pop(){
String item = s\[--N\];
s\[N\] = null;
if(N>0 && N==s.length/4) resize(s.length/2);
return item;
}
}
```
下面来分析可变数组实现的栈的性能：在最坏的情况下pop和push操作都是N。 ![Screenshot from 2018-09-27 21-30-28.png](https://jason87459473.files.wordpress.com/2018/09/screenshot-from-2018-09-27-21-30-28.png) ![Screenshot from 2018-09-27 21-31-02.png](https://jason87459473.files.wordpress.com/2018/09/screenshot-from-2018-09-27-21-31-02.png) ![Screenshot from 2018-09-27 21-31-05.png](https://jason87459473.files.wordpress.com/2018/09/screenshot-from-2018-09-27-21-31-05.png) 空间复杂度：在8N-32N之间![Screenshot from 2018-09-27 20-55-52.png](https://jason87459473.files.wordpress.com/2018/09/screenshot-from-2018-09-27-20-55-52.png)

#### 1.2队列

队列遵循先进先出的原则，下面给出队列的API：
```
 public class QueueOfStrings
              QueueOfStrings()       生成一个新数组
         void enqueue(String item) 在队列中新插入一个元素
       String dequeue()       删除并返回最早进入队列的元素
      boolean isEmpty()            返回队列是否为空
          int size()                队列中元素的数量
```
#### 1.2.1队列的链表实现

![Screenshot from 2018-09-27 21-58-24.png](https://jason87459473.files.wordpress.com/2018/09/screenshot-from-2018-09-27-21-58-24.png)
```
public class LinkedQueueOfStrings {
    private class Node {
        String item;
        Node next;
    }
    private Node first,last;
    public boolean isEmpty(){
        return first==null;
    }
    public void enqueue(String item){
        Node oldlast = last;
        last = new Node();
        last.item = item;
        last.next=null;
        if(isEmpty()) first=last;
        else oldlast.next=last;
    }
    public String dequeue() {
        String item = first.item;
        first = first.next;
        if(isEmpty()) last=null;
        return item;
    }
}
```
#### 1.2.2队列的可变数组实现
```
public class ResizingArrayQueueOfStrings{
    private String\[\] s=new String\[2\];
    private int head =0;
    private int tail =0;
    public boolean isEmpty(){
        return head==tail;
    }
    public void enqueue(String item){
        s\[tail++\]=item;
        if(tail==s.length-1&&(tail-head)==s.length-1){
            String\[\] news = new String\[s.length*2\];
            int count=0;
            for(int i=head;i<=tail;i++){
                news\[count++\]=s\[i\];
            }
            s=news;
            head = 0;
            tail = (s.length/2-1);
        }else if(tail==s.length-1&&(tail-head)<s.length-1){
            for(int i=0;i<(tail-head);i++){
                s\[i\]=s\[head+i\];
            }
            tail -= head;
            head =0;
        }
    }
    
    public String dequeue(){
        String item = s\[head\];
        s\[head\]=null;
        head++;
        if((tail-head)<(s.length/4)){
            String\[\] news = new String\[s.length/2\];
            for(int i=0;i<(tail-head);i++){
                news\[i\]=s\[head+i\];
            }
            tail -= head ;
            head =0;
        }
        return item;
    }
}
```
### 2.泛型

我们实现了针对字符串的栈实现，但是我们不仅仅只有字符串需要栈的数据结构，所以我们引入泛型的概念。

#### 2.1Java泛型实现链表栈

![Screenshot from 2018-09-27 23-36-17.png](https://jason87459473.files.wordpress.com/2018/09/screenshot-from-2018-09-27-23-36-17.png) 2.2Java泛型实现数组栈 注意Java不允许泛型数组，所以改用对象数组实现 ![Screenshot from 2018-09-27 23-38-48.png](https://jason87459473.files.wordpress.com/2018/09/screenshot-from-2018-09-27-23-38-48.png) 使用泛型来构造可以使客户端调用采用自动封装 ![Screenshot from 2018-09-28 00-16-44.png](https://jason87459473.files.wordpress.com/2018/09/screenshot-from-2018-09-28-00-16-44.png)

### 3.迭代器

使用Java实现java.lang.Iterable(可遍历类)的接口，这将会使得代码更加紧凑。Iterable可以返回一个Iterator迭代器，Iterator迭代器是一个有hasnext(),next(),remove()方法的类，其中我们不使用remove()方法，因为这容易成为调试隐患。这样大费周章是为了能够在客户端使用极为精简的代码来遍历集合中的元素，即for-reach语句。如：

for( String:stack)

即可遍历集合中的所有元素。如果不使用迭代器的话我们会有许多不必要的出入站栈操作。

#### 3.1迭代器实现链表栈：
```
import java.util.Iterator;
public class Stack implements Iterable
{
 ...
 public Iterator iterator() { return new ListIterator(); }
 private class ListIterator implements Iterator
 {
 private Node current = first;
 public boolean hasNext() { return current != null; }
 public void remove() { /* not supported */ }
 public Item next()
 {
 Item item = current.item;
 current = current.next;
 return item;
 }
 }
}
```
#### 3.2迭代器实现数组栈：
```
import java.util.Iterator;
public class Stack implements Iterable
{
 …
 public Iterator iterator()
 { return new ReverseArrayIterator(); }
 private class ReverseArrayIterator implements Iterator
 {
 private int i = N;
 public boolean hasNext() { return i > 0; }
 public void remove() { /* not supported */ }
 public Item next() { return s\[--i\]; }
 }
}
```
### 4.背包

有时候我们不考虑集合元素顺序，所以可以采用背包，背包就是栈除去pop()操作或队列除去dequeue()操作，下面给出背包的API：
```
public class Bag implements Iterable
                  Bag()        create an empty bag
             void add(Item x)  insert a new item onto bag
              int size()       number of items in bag
         Iterable iterator()   iterator for all items in bag
```
### 5.Dijstra算法

![Screenshot from 2018-09-28 11-35-20.png](https://jason87459473.files.wordpress.com/2018/09/screenshot-from-2018-09-28-11-35-20.png) 给出一个表达式：( 1 + ( ( 2 + 3 ) * ( 4 * 5 ) ) ) ，如何计算他的值，将数值存入数值栈，将符号存入符号栈，其中左括号忽略，每次遇到右括号将数值栈中取出两个数，符号栈中取出一个数运算并将结果存入数值栈中。 5.1Java实现Dijstra
```
public class Evaluate{
    public static void main(String\[\] args){
        Stack<String> ops = new Stack<String>();
        Stack<Double> vals = new Stack<Double>();
        while(!StdIn.isEmpty()){
            String s = StdIn.readString();
            if(s.equals(")"));
            else if(s.equals("*")) ops.push(s);
            else if(s.equals("+")) ops.push(s);
            else if(s.equals("-")) ops.push(s);
            else if(s.equals("/")) ops.push(s);
            else if(s.equals(")")){
                String op = ops.pop();
                if(op=="*") vals.push(vals.pop()*vals.pop());
                else if(op=="+") vals.push(vals.pop()+vals.pop());
                else if(op=="-") vals.push(vals.pop()-vals.pop());
                else if(op=="/") vals.push(vals.pop()/vals.pop());
            }
            else vals.push(Double.parseDouble(s));
        }
        StdOut.println(vals.pop());
    }
}
```