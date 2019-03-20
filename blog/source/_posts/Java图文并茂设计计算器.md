---
title: Java图文并茂设计计算器
date: 2018-12-03 19:56:34
tags:
- Java
- 作业
categories: 忒修斯之船
comments: true
copyright: true
---

* 体系框架 
* 实现思路
* 中缀表达式转后缀表达式
* LinkList实现栈相关功能
* 界面设计
* 源代码文件

### 体系框架
实现复杂四则运算，小数点，Java swing设计界面，通过`JMenu`来切换鼠标输入和键盘输入模式。
<img src="https://s2.ax1x.com/2019/02/19/kcbljO.gif" alt="计算器演示" width="60%" />

整个文件由三个类构成，分别是MyCalcutor.java(界面类)，Postfix.java（计算类）,test.java（功能类）。通过在MyCalcutor.java(界面类)中实例化Postfix.java（计算类）来达到计算用户输入并输出的功能。
API of Postfix
```
class Postfix
    Type       Method
    void      setStr(String str)  //将得到的字符串分成单个字符储存到链表里
    double    getResult() //获得计算结果
    void      transferToPostfix(LinkedList<String> list) //转化为后缀表达式
    double    calculate() //根据后缀表达式计算结果
    boolean   isOperator(String oper) //判断是否操作符
    int       priority(String s) //计算操作符的优先级
    double    cal(double num1,double num2,String operator)//执行运算符所代表的运算
```
API of Postfix:
```
class MyCalcutor extends JFrame implements ActionListener
    Type      Method
    void      MyCalcutor() //构造方法
    void      actionPerformed(ActionEvent e) //监听方法 
    void      init() //初始化方法被构造方法调用
    void      setChar() //设置字体方法被init方法调用
内部类
class AWT_ONVALUECHANGED implements TextListener
     void      textValueChanged(TextEvent t)
```
### 实现思路
    
总体思路是获得用户输入的字符串并计算该字符串所表示算数表达式的值。细分功能有：小数点运算，多零输入，（）运算，高级数学运算（平方，开根，求模等）等。
第一步，将算数表达式分割，给按钮“=”添加监听，当用户发事件“=”时将输入的字符串传递给Postfix类，Postfix的setStr将算数运算式由字符串转换成单个字符组成的链表，再通过调用transferToPostfix方法得到后缀表达式，此时再通过calculate方法计算表达式的值即可。整个运算过程就结束了。

通过`JFrame`来创造页面，通过监听`JMenu`切换不同的`JPanel`实现鼠标和键盘的切换。
通过内部类`AWT_ONVALUECHANGED`实现`TextListener`接口来监控键盘输入页面的键盘输入，当在用户键入换行符时自动计算表达式的值。
### 中缀表达式转后缀表达式
所谓中缀表达式就是像我们平时书写的算式一样，但是后缀表达式表达方式则是将数字放在前符号放在后，所有计算按运算符出现的顺序，严格从从左向右进行，这恰好符合我们对用栈来计算值的想法不谋而合。读后缀表达式时，如果读到操作数就将它压入栈S中，如果读到n元操作符，则取出由栈顶向下的n个元素按操作符运算，再将运算的结果代替原栈顶的n项，压入栈S中。剩下的运算符中，若其优先级高于其它所有的运算符，直接入栈。

将中缀表达式转换为后缀表达式的是` transferToPostfix`,举个例子:
```
9+1*3+(3+4)*3
```
转换为后缀表达式就是:
```
9 1 3 * + 3 3 4 + * +
```
但是如果想要计算高位的数字就要在数字中加上特殊符号来分割数字。这个在转化为后缀表达式是在转换之前对中缀表达式进行处理，因为中缀表达式的形式比较适合分割数字。
### LinkList实现栈相关功能
实际上使用Linklist和Stack都可以实现，将后缀表达式与栈进行数据交换。将构造方法`MyCalcutor`传来的中缀表达式中数值和符号全部分隔开然后按原有顺序存储到链表里，然后通过Linklist的迭代器把数值按照后缀表达式表示规则，将字符使用StringBuilder类对象sb储存成后缀表达式。
### 界面设计
采用`BorderLayout`布局同时实实现将已计算表达式储存到上方`JTextArea`中采用滚动条浏览设置为不可编辑。中间为`JTextFiled`可以编辑，后是实时显示结果采用`JTestArea`，下方的`JButton`采用`GridLayout`布局并增加*Donate*按键打开本人的个人网站。
<center>
<img src="https://s2.ax1x.com/2019/02/19/kcbwgf.png"
alt="初始页面" width="40%"  />
初始页面
</center>      
<center>
<img src="https://s2.ax1x.com/2019/02/19/kcbDKS.png"
alt="复杂运算滚动条"  width="40%"  />
复杂运算滚动条
</center>
<center>
<img src="https://s2.ax1x.com/2019/02/19/kcb0v8.png"
alt="键盘输入" width="40%"  />
键盘输入
</center>
### 源代码文件
MyCalcutor.java
```java
import javax.swing.*;
import java.awt.*;
import java.awt.event.ActionEvent;
import java.awt.event.ActionListener;
import java.awt.event.TextEvent;
import java.awt.event.TextListener;
import java.util.Stack;

public class MyCalcutor extends JFrame implements ActionListener{

    private JPanel panel = new JPanel();
    private JPanel BasicMode = new JPanel(new BorderLayout());
    private JPanel KeyBoardMode = new JPanel(new GridLayout(4, 1));

    private JMenuBar bar = new JMenuBar();
    private JMenu menu = new JMenu("Menu");
    private JMenuItem itemInitial = new JMenuItem("BasicMode");
    private JMenuItem itemChange = new JMenuItem("KeyboardMode");

    private JButton bnum[] = new JButton[10];
    private JButton minus = new JButton("-");
    private JButton plus = new JButton("+");
    private JButton mult = new JButton("*");
    private JButton div = new JButton("÷");
    private JButton equl = new JButton("=");
    private JButton mod = new JButton("%");
    private JButton sqrt = new JButton("√");
    private JButton pow = new JButton("^");
    private JButton setzero = new JButton("C");
    private JButton rightres = new JButton(")");
    private JButton leftres = new JButton("(");
    private JButton ret = new JButton("<-");
    private JButton dot = new JButton(".");
    private JButton donate = new JButton("Donate");

    private JLabel pi = new JLabel("上方可以切换输入模式");
    private JTextArea front = new JTextArea(4, 10);
    private JScrollPane front2 = new JScrollPane(front);
    private JTextArea in = new JTextArea(4, 10);
    private JTextArea out = new JTextArea(4, 10);
    private JTextArea head = new JTextArea(4, 10);

    //private JTextArea kym_front = new JTextArea();
    private TextArea kym_front = new TextArea();
    //private JTextField kym_in = new JTextField();
    private JTextField kym_out = new JTextField();
    private java.awt.TextArea kym_in = new java.awt.TextArea();

    private Font font2 = new Font("TimesRoman", Font.ITALIC, 20);
    private Font font = new Font("TimesRoman", Font.BOLD, 30);
    private JPanel up = new JPanel(new BorderLayout());
    private JPanel med = new JPanel(new GridLayout(4, 6));
    private JPanel down = new JPanel(new FlowLayout());

    //private StackCal stackCal = new StackCal();
    private Postfix cal = new Postfix();

    class AWT_ONVALUECHANGED implements TextListener {
        public void textValueChanged(TextEvent t) {
            String inputkeyboard;
            inputkeyboard = kym_in.getText();
            int inputlen = inputkeyboard.length();
            if (inputlen > 1) {
                if ((inputkeyboard.charAt(inputlen - 1)) == '\n') {
                    StringBuffer argstocal = new StringBuffer(inputkeyboard);
                    String args = argstocal.substring(0, inputlen - 1);
                    cal.setStr(args);
                    kym_front.append(args + "=" + cal.getResult() + "\n");
                    kym_in.setText("");
                    kym_out.setText("Result:" + "\n" + cal.getResult() + "");
                }
            }
        }
    }

    MyCalcutor() {
        setDefaultCloseOperation(JFrame.EXIT_ON_CLOSE);
        setVisible(true);
        setLayout(new BorderLayout());
        setBackground(Color.black);
        setSize(700, 840);

        init();
        front.setText("");
        panel.add(BasicMode);
        add(panel);
        head.setFont(new Font("TimesRoman", Font.ITALIC, 22));
        head.append("  Input your own expression in orange area and press ENTER.\n\n" +
                "                 The result will explain in blue area.\n\n" +
                "                But please obey the rule of expression.\n\n" +
                "                       Enjoy the KeyboardMode :)");
        out.append("Result:");
        kym_out.setText("Result:");
    }

    public void actionPerformed(ActionEvent e) {

        if (e.getSource() == itemChange) {    //改变图形化界面为“KeyBoardMode”的界面。
            panel.removeAll();
            panel.add(KeyBoardMode);          //切换代码。
            panel.validate();
            repaint();
        } else if (e.getSource() == itemInitial) {//改变图形化界面为“BasicMode”界面。
            panel.removeAll();
            panel.add(BasicMode);
            panel.validate();
            repaint();
        } else if (e.getSource() == bnum[0]) {
            in.setText(in.getText() + "0");
        } else if (e.getSource() == bnum[1]) {
            in.setText(in.getText() + "1");
        } else if (e.getSource() == bnum[2]) {
            in.setText(in.getText() + "2");
        } else if (e.getSource() == bnum[3]) {
            in.setText(in.getText() + "3");
        } else if (e.getSource() == bnum[4]) {
            in.setText(in.getText() + "4");
        } else if (e.getSource() == bnum[5]) {
            in.setText(in.getText() + "5");
        } else if (e.getSource() == bnum[6]) {
            in.setText(in.getText() + "6");
        } else if (e.getSource() == bnum[7]) {
            in.setText(in.getText() + "7");
        } else if (e.getSource() == bnum[8]) {
            in.setText(in.getText() + "8");
        } else if (e.getSource() == bnum[9]) {
            in.setText(in.getText() + "9");
        } else if (e.getSource() == div) {
            in.setText(in.getText() + "÷");
        } else if (e.getSource() == minus) {
            in.setText(in.getText() + "-");
        } else if (e.getSource() == mult) {
            in.setText(in.getText() + "*");
        } else if (e.getSource() == plus) {
            in.setText(in.getText() + "+");
        } else if (e.getSource() == mod) {
            in.setText(in.getText() + "%");
        } else if (e.getSource() == sqrt) {
            in.setText(in.getText() + "√");
        } else if (e.getSource() == pow) {
            in.setText(in.getText() + "^");
        } else if (e.getSource() == rightres) {
            in.setText(in.getText() + ")");
        } else if (e.getSource() == leftres) {
            in.setText(in.getText() + "(");
        } else if (e.getSource() == dot) {
            in.setText(in.getText() + ".");
        } else if (e.getSource() == setzero) {
            in.setText("");
        } else if (e.getSource() == ret) {
            String str1 = in.getText();
            int strlen = str1.length();
            String str2;
            if (strlen != 0) {
                str2 = str1.substring(0, strlen - 1);
            } else {
                str2 = "";
            }
            in.setText(str2);
        } else if (e.getSource() == donate) {
            try {
                String url = "jinzhnegxu.online";
                java.net.URI uri = java.net.URI.create(url);
                // 获取当前系统桌面扩展
                Desktop dp = Desktop.getDesktop();
                // 判断系统桌面是否支持要执行的功能
                if (dp.isSupported(Desktop.Action.BROWSE)) {
                    //File file = new File("D:\\aa.txt");
                    //dp.edit(file);// 　编辑文件
                    dp.browse(uri);// 获取系统默认浏览器打开链接
                    // dp.open(file);// 用默认方式打开文件
                    // dp.print(file);// 用打印机打印文件
                }
            } catch (NullPointerException er) {
                // 此为uri为空时抛出异常
                er.printStackTrace();
            } catch (java.io.IOException er) {
                // 此为无法获取系统默认浏览器
                er.printStackTrace();
            }
        } else if (e.getSource() == equl) {
            cal.setStr(in.getText());
            front.append(in.getText() + "=" + cal.getResult() + "\n");
            in.setText("");
            out.setText("Result:" + "\n" + cal.getResult() + "");
        }
    }

    public void init() {

        for (int i = 0; i < bnum.length; i++) {
            bnum[i] = new JButton(i + "");
            bnum[i].setFont(font);
            bnum[i].setBorder(BorderFactory.createRaisedBevelBorder());
            bnum[i].addActionListener(this);
        }

        front2.setVerticalScrollBarPolicy(JScrollPane.VERTICAL_SCROLLBAR_ALWAYS);
        front.setEditable(false);
        in.setEditable(false);
        out.setEditable(false);
        up.add(front2, BorderLayout.NORTH);
        up.add(in, BorderLayout.CENTER);
        up.add(out, BorderLayout.SOUTH);
        BasicMode.add(up, BorderLayout.NORTH);

        minus.addActionListener(this);
        plus.addActionListener(this);
        mult.addActionListener(this);
        div.addActionListener(this);
        equl.addActionListener(this);
        mod.addActionListener(this);
        sqrt.addActionListener(this);
        pow.addActionListener(this);
        setzero.addActionListener(this);
        rightres.addActionListener(this);
        leftres.addActionListener(this);
        ret.addActionListener(this);
        dot.addActionListener(this);
        donate.addActionListener(this);

        med.add(bnum[7]);
        med.add(bnum[8]);
        med.add(bnum[9]);
        med.add(div);
        med.add(ret);
        med.add(setzero);
        med.add(bnum[4]);
        med.add(bnum[5]);
        med.add(bnum[6]);
        med.add(mult);
        med.add(leftres);
        med.add(rightres);
        med.add(bnum[3]);
        med.add(bnum[2]);
        med.add(bnum[1]);
        med.add(minus);
        med.add(pow);
        med.add(sqrt);
        med.add(bnum[0]);
        med.add(dot);
        med.add(mod);
        med.add(plus);
        med.add(donate);
        med.add(equl);
        BasicMode.add(med, BorderLayout.CENTER);

        down.add(pi);
        BasicMode.add(down, BorderLayout.SOUTH);

        kym_front.setEditable(false);
        kym_in.setEditable(true);
        kym_out.setEditable(false);

        head.setEditable(true);
        head.setLineWrap(true);
        kym_in.setBackground(Color.orange);
        kym_out.setBackground(Color.cyan);
        KeyBoardMode.add(head);
        KeyBoardMode.add(kym_front);
        KeyBoardMode.add(kym_in);
        KeyBoardMode.add(kym_out);

        this.setChar();
        itemInitial.addActionListener(this);
        itemChange.addActionListener(this);
        bar.add(menu);
        menu.add(itemInitial);
        menu.add(itemChange);
        panel.setLayout(new GridLayout(1, 1));
        add(panel);
        panel.add(BasicMode);
        setJMenuBar(bar);
        kym_in.addTextListener(new AWT_ONVALUECHANGED());
        /*kym_in.addTextListener(new TextListener() {
            @Override
            public void textValueChanged(TextEvent e) {
                String inputkeyboard;
                inputkeyboard = kym_in.getText();
                int inputlen = inputkeyboard.length();
                if ((inputkeyboard.charAt(inputlen-1)) == '\n') {
                    StringBuffer argstocal = new StringBuffer(inputkeyboard);
                    String args = argstocal.substring(0,inputlen-1);
                    cal.setStr(args);
                    kym_front.append(args+ "=" + cal.getResult() + "\n");
                    kym_in.setText("");
                    kym_out.setText("Result:" + "\n" + cal.getResult() + "");
                }
            }
        });
        */
    }

    private void setChar() {
        out.setBackground(Color.ORANGE);

        minus.setBorder(BorderFactory.createRaisedBevelBorder());
        plus.setBorder(BorderFactory.createRaisedBevelBorder());
        mult.setBorder(BorderFactory.createRaisedBevelBorder());
        div.setBorder(BorderFactory.createRaisedBevelBorder());
        equl.setBorder(BorderFactory.createRaisedBevelBorder());
        mod.setBorder(BorderFactory.createRaisedBevelBorder());
        sqrt.setBorder(BorderFactory.createRaisedBevelBorder());
        pow.setBorder(BorderFactory.createRaisedBevelBorder());
        setzero.setBorder(BorderFactory.createRaisedBevelBorder());
        rightres.setBorder(BorderFactory.createRaisedBevelBorder());
        leftres.setBorder(BorderFactory.createRaisedBevelBorder());
        ret.setBorder(BorderFactory.createRaisedBevelBorder());
        dot.setBorder(BorderFactory.createRaisedBevelBorder());
        donate.setBorder(BorderFactory.createRaisedBevelBorder());
        //pi.setBorder(BorderFactory.createRaisedBevelBorder());
        front.setBorder(BorderFactory.createRaisedBevelBorder());
        in.setBorder(BorderFactory.createRaisedBevelBorder());
        out.setBorder(BorderFactory.createRaisedBevelBorder());

        kym_in.setFont(font);
        kym_front.setFont(font);
        kym_out.setFont(font);
        minus.setFont(font);
        plus.setFont(font);
        mult.setFont(font);
        div.setFont(font);
        equl.setFont(font);
        mod.setFont(font);
        sqrt.setFont(font);
        pow.setFont(font);
        setzero.setFont(font);
        rightres.setFont(font);
        leftres.setFont(font);
        ret.setFont(font);
        dot.setFont(font);
        donate.setFont(font2);
        pi.setFont(font);
        front.setFont(font);
        in.setFont(font);
        out.setFont(font);
        head.setFont(font2);
    }
}
```
Postfix.java
```java
import java.util.Iterator;
import java.util.LinkedList;

public class Postfix {
    //用于记录操作符
    private static LinkedList<String> operators=new LinkedList<>();
    //用于记录输出
    private static LinkedList<String> output=new LinkedList<>();
    //用于展示后缀表达式
    private static StringBuilder sb=new StringBuilder();

    private String str;

    private double result;

    public void setStr(String str) {
        this.str = str;
        LinkedList<String> list = new LinkedList<>();
        StringBuffer num = new StringBuffer();
        for(int i=0;i<str.length();i++){
                list.add(str.charAt(i) + "");
        }
        transferToPostfix(list);
        result=calculate();
    }

    public double getResult() {
        return result;
    }

    //中缀表达式转为后缀表达式
    public void transferToPostfix(LinkedList<String> list){
        Iterator<String> it=list.iterator();
        String pro = null;
        boolean flag = true;
        while (it.hasNext()) {
            String s = it.next();
            if (isOperator(s)) {
                if (operators.isEmpty()) {
                    operators.push(s);
                }
                else {
                    //如果读入的操作符为非")"且优先级比栈顶元素的优先级高或一样，则将操作符压入栈
                    if (priority(operators.peek())<=priority(s)&&!s.equals(")")) {
                        operators.push(s);
                    }
                    else if(!s.equals(")")&&priority(operators.peek())>priority(s)){
                        while (operators.size()!=0&&priority(operators.peek())>=priority(s)
                                &&!operators.peek().equals("(")) {
                            if (!operators.peek().equals("(")) {
                                String operator=operators.pop();
                                sb.append(operator).append("#");
                                output.push(operator);
                            }
                        }
                        operators.push(s);
                    }
                    //如果读入的操作符是")"，则弹出从栈顶开始第一个"("及其之前的所有操作符
                    else if (s.equals(")")) {
                        while (!operators.peek().equals("(")) {
                            String operator=operators.pop();
                            sb.append(operator).append("#");
                            output.push(operator);
                        }
                        //弹出"("
                        operators.pop();
                    }
                }
            }
            //读入的为非操作符
            else {
                if(flag||isOperator(pro)) {
                    sb.append(s).append("#");
                    output.push(s);
                    flag=false;
                }else{
                    sb.append(s);jiaohuan
                    output.push(s);
                }
            }
            pro=s;
        }
        if (!operators.isEmpty()) {
            Iterator<String> iterator=operators.iterator();
            while (iterator.hasNext()) {
                String operator=iterator.next();
                sb.append(operator).append("#");
                output.push(operator);
                iterator.remove();
            }
        }
    }

    //根据后缀表达式计算结果
    public double calculate(){
        LinkedList<String> mList=new LinkedList<>();
        String[] postStr=sb.toString().split("#");
        for (String s:postStr) {
            if (isOperator(s)){
                if (!mList.isEmpty()){
                    double num1;//=Double.valueOf(mList.pop());
                    double num2;//=Double.valueOf(mList.pop());
                    double newNum;
                    if(s.equals("√")){
                        num1=Double.valueOf(mList.pop());
                        newNum=cal(num1,0,s);
                        num1=0.0;num2=0.0;
                    }else if(s.equals(".")){
                        num1=Double.valueOf(mList.pop());
                        if(!mList.isEmpty())
                            num2=Double.valueOf(mList.pop());
                        else
                            num2=0.0;
                        while(num1>1){
                            num1 =num1/10;
                        }
                        newNum = cal(num2, num1, s);
                        num1=0.0;num2=0.0;
                    }else {
                        num1=Double.valueOf(mList.pop());
                        num2=Double.valueOf(mList.pop());
                        if (s.equals("/")||s.equals("÷")&&num2==0.0){
                            System.out.println("除数不能为0");
                            return 0.0;
                        }
                        newNum = cal(num2, num1, s);
                        num1=0.0;num2=0.0;
                    }
                    mList.push(String.valueOf(newNum));
                }
            }
            else {
                //数字则压入栈中
                mList.push(s);
            }
        }
        if (!mList.isEmpty()){
            //System.out.println("result: "+mList.pop());
            return Double.parseDouble(mList.pop());
        }
        return 0.0;
    }

    //判断是否操作符
    public boolean isOperator(String oper){
        if (oper.equals("+")||oper.equals("-")||oper.equals("/")||oper.equals("*")||oper.equals("√")||oper.equals(".")
                ||oper.equals("(")||oper.equals(")")||oper.equals("%")||oper.equals("^")||oper.equals("÷")) {
            return true;
        }
        return false;
    }
    //计算操作符的优先级
    public int priority(String s){
        switch (s) {
            case "-":return 1;
            case "+":return 1;
            case "*":return 2;
            case "/":return 2;
            case "%":return 2;
            case "÷":return 2;
            case "^":return 3;
            case "√":return 3;
            case ".":return 3;
            case "(":return 4;
            case ")":return 4;
            default :return 0;
        }
    }

    public double cal(double num1,double num2,String operator){
        switch (operator){
            case "+":return num1+num2;
            case "-":return num1-num2;
            case "*":return num1*num2;
            case "/":return num1/num2;
            case "÷":return num1/num2;
            case "^":return Math.pow(num1,num2);
            case "√":return Math.sqrt(num1);
            case ".":return num1+num2;
            default :return 0;
        }
    }
}
```
test.java
```java
public class test{
    public static void main(String[] args){
        new MyCalcutor();
    }
}
```