---
title: Java+MySQL构建学生信息管理系统
date: 2018-12-03 20:33:46
tags:
- Java
- 作业
categories: 忒修斯之船
comments: true
copyright: true
---
学生信息管理系统，应付一般的课堂大作业应该足够了。
* 体系框架
* 实现思路
* 数据库设计
* 界面设计
* 设计模式
* 源代码文件

### 体系框架
<img src="https://s2.ax1x.com/2019/02/19/kcb3uD.gif" alt="tea" width="60%" />
<img src="https://s2.ax1x.com/2019/02/19/kcbYEd.gif" alt="stu" width="60%" />

登录系统实现学生和教师的同一客户端登录，通过访问数据库中不同的数据表区分，实现增查改删学籍信息，增查改删成绩信息，修改个人登录密码等功能。
### 实现思路
<img src="https://s2.ax1x.com/2019/02/19/kcbaCt.gif" alt="score" width="60%" />
<img src="https://s2.ax1x.com/2019/02/19/kcbtUA.gif" alt="score" width="60%" />
<img src="https://s2.ax1x.com/2019/02/19/kcbN4I.gif" alt="score" width="60%" />
通过`JDBCHelper`实现所有通过数据库的功能，这样将数据库连接与界面设计隔离开。有利于代码的复用。
### 数据库设计

<img src="https://s2.ax1x.com/2019/02/19/kcbGHH.gif" alt="数据库设计" width="60%" />

数据库内有两张表，分别为教师表和学生表，学生表中储存学籍、成绩等个人信息，学生初始密码为姓名，可以再个人中心中实现自我更改
### 界面设计
通过`new`新类来弹出其他窗口。
### 设计模式
ＤＡＯ设计模式
### 源代码文件

Student.java
```Java
package com.jason.bean;
import java.util.Date;

public class Student{
    private int id;
    private int student_id;
    private String name;
    private int age;
    private String sex;
    private Date birthday;

    public int getId() {
        return id;
    }

    public void setId(int id) {
        this.id = id;
    }

    public int getStudent_id() {
        return student_id;
    }

    public void setStudent_id(int student_id) {
        this.student_id = student_id;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public int getAge() {
        return age;
    }

    public void setAge(int age) {
        this.age = age;
    }

    public String getSex() {
        return sex;
    }

    public void setSex(String sex) {
        this.sex = sex;
    }

    public Date getBirthday() {
        return birthday;
    }

    public void setBirthday(Date birthday) {
        this.birthday = birthday;
    }
}
```
JDBCHelper.java
```Java
package com.jason.dao;
import com.mysql.cj.xdevapi.SqlDataResult;

import javax.swing.*;
import java.math.BigInteger;
import java.sql.*;
import java.util.Vector;

public class JDBCHelper {
    //JDBC driver and database URL
    private static boolean Successfulsign;
    static final String JDBC_DRIVER = "com.mysql.cj.jdbc.Driver";
    static final String DB_URL = "jdbc:mysql://localhost:3306/info";

    //database user name and password
    static final String USER = "teacher";
    static final String PASS = "teacher";

    static String username;
    static String userpass;
    static String[] title = {"学号","姓名","性别","班级"};
    static String[] title2 ={"学号","姓名","高等数学","线性代数","C程序语言设计","Java面向对象程序设计","操作系统","编译原理","计算机网络","数据结构"};


    public static String getUsername() {
        return username;
    }

    public static String getUserpass() {
        return userpass;
    }

    static PreparedStatement ps = null;
    static Connection con = null;
    static ResultSet rs = null;

    public void ConnecttoSQL() {
        try {
            //enroll the JDBC driver
            Class.forName(JDBC_DRIVER);
            // open URL;
            con = DriverManager.getConnection(DB_URL, USER, PASS);

        } catch (Exception e) {
            e.printStackTrace();
        }
    }

    public static void sqlquery(String s, String s2, int x, int y) {
        //System.out.print(s);
        try {
            ps = con.prepareStatement(s + s2);
            rs = ps.executeQuery();
            if (rs.next()) {
                username = rs.getString(x);
                userpass = rs.getString(y);
                System.out.print("Successfully get user and password from sql");
                System.out.print(username + "\t" + userpass + "\t");
                Successfulsign = true;
            }else{
                Successfulsign = false;
            }

        } catch (SQLException e1) {
            //e1.printStackTrace();
        }
    }

    public static boolean isSuccessfulsign() {
        return Successfulsign;
    }

    public static JTable scrollpanel(String sql) {
        JTable ret = null;
        ResultSetMetaData rsmd;
        Vector colum = new Vector();
        Vector rows = new Vector();
        try {
            //String sql = "select * from student";
            rs = ps.executeQuery(sql);
            rsmd = rs.getMetaData();
            for(int i=0;i<title.length;i++){
                colum.addElement(title[i]);
            }
            while(rs.next()) {
                Vector currow = new Vector();
                currow.addElement(rs.getString(1));
                currow.addElement(rs.getString(2));
                currow.addElement(rs.getString(4));
                String engclassname = rs.getString(5);
                currow.addElement(Tans2cn(engclassname));
                rows.addElement(currow);
            }
        } catch (SQLException e) {
            e.printStackTrace();
        }
        ret = new JTable(rows,colum);
        return ret;
    }

    public static JTable scrollpanelsocrce(String sql) {

        JTable ret ;
        Vector colum = new Vector();
        Vector rows = new Vector();
        try {
            rs = ps.executeQuery(sql);
            for(int i=0;i<title2.length;i++){
                colum.addElement(title2[i]);
            }
            while(rs.next()) {
                Vector currow = new Vector();
                currow.addElement(rs.getString(1));
                currow.addElement(rs.getString(2));
                currow.addElement(rs.getString(6));
                currow.addElement(rs.getString(7));
                currow.addElement(rs.getString(8));
                currow.addElement(rs.getString(9));
                currow.addElement(rs.getString(10));
                currow.addElement(rs.getString(11));
                currow.addElement(rs.getString(12));
                currow.addElement(rs.getString(13));
                rows.addElement(currow);
            }
        } catch (SQLException e) {
            e.printStackTrace();
        }
        ret = new JTable(rows,colum);
        return ret;
    }

    public static JTable scrollpanelsocrcestat(String sql) {
        int[] score=new int[8];
        int count=0;
        JTable ret ;
        Vector colum = new Vector();
        Vector rows = new Vector();
        try {
            rs = ps.executeQuery(sql);
            for(int i=0;i<title2.length;i++){
                colum.addElement(title2[i]);
            }
            while(rs.next()) {
                count++;
                Vector currow = new Vector();
                currow.addElement(rs.getString(1));
                currow.addElement(rs.getString(2));
                currow.addElement(rs.getString(6));
                score[0]+=Integer.parseInt(rs.getString(6));
                currow.addElement(rs.getString(7));
                score[1]+=Integer.parseInt(rs.getString(7));
                currow.addElement(rs.getString(8));
                score[2]+=Integer.parseInt(rs.getString(8));
                currow.addElement(rs.getString(9));
                score[3]+=Integer.parseInt(rs.getString(9));
                currow.addElement(rs.getString(10));
                score[4]+=Integer.parseInt(rs.getString(10));
                currow.addElement(rs.getString(11));
                score[5]+=Integer.parseInt(rs.getString(11));
                currow.addElement(rs.getString(12));
                score[6]+=Integer.parseInt(rs.getString(12));
                currow.addElement(rs.getString(13));
                score[7]+=Integer.parseInt(rs.getString(13));
                rows.addElement(currow);
            }
            Vector curr = new Vector();
            curr.addElement("平均成绩");
            curr.addElement("");
            for(int i=0;i<7;i++){
                score[i] /= count;
                curr.addElement(score[i]);
            }
            rows.addElement(curr);
        } catch (SQLException e) {
            JOptionPane.showMessageDialog(null, "请补全学生信息", "提示", JOptionPane.WARNING_MESSAGE);
        }
        ret = new JTable(rows,colum);
        return ret;
    }

    private static String Tans2cn(String engname) {
        String cnname;
        String engclassname;
        if (engname.equals("CS"))
            cnname = "计算机科学与技术";
        else if (engname.equals("NP"))
            cnname = "网络工程";
        else if (engname.equals("DMT"))
            cnname = "数字媒体技术";
        else if (engname.equals("FB"))
            cnname = "金融大数据";
        else if (engname.equals("FI"))
            cnname = "金融信息化";
        else if (engname.equals("M"))
            cnname = "男";
        else if (engname.equals("F"))
            cnname = "女";
        else
            cnname = engname;

        return cnname;
    }

    public static void addstuinfo(String stu_name,String stu_sex,String stu_id,String stu_class){
        try {
            ps = con.prepareStatement("insert into student values(?,?,?,?,?)");
            ps.setString(1,stu_id);
            ps.setString(2,stu_name);
            ps.setString(3,stu_name);
            ps.setString(4,stu_sex);
            ps.setString(5,stu_class);
            ps.executeUpdate();
            System.out.print("insert have");
        }catch (SQLException e){
            e.printStackTrace();
        }
    }
    public static void updatestu(String oldid,String stu_name,String stu_sex,String stu_id,String stu_class){
        try{
            //ps = con.prepareStatement("update student set stu_id=?,stu_sex=?,stu_pass=?,stu_naem=?,stu_class=? where stu_id=?");
            ps = con.prepareStatement("update student set stu_sex=?,stu_name=?,stu_class=?,stu_pass=?,stu_id=? where stu_id=?");
            ps.setString(1,stu_sex);
            ps.setString(2,stu_name);
            ps.setString(3,stu_class);
            ps.setString(4,stu_name);
            ps.setString(5,stu_id);
            ps.setString(6,oldid);
            ps.executeUpdate();
            //ps.setString(2,stu_sex);
            //ps.setString(3,stu_name);
            //ps.setString(4,stu_name);
            //ps.setString(5,stu_class);
            //ps.setString(6,oldid);
            //ps.executeUpdate();
        }catch (SQLException e){
            e.printStackTrace();
        }
    }

    public static void deletstuinfo(String oldid){
        try{
            ps = con.prepareStatement("delete from student where stu_id=?");
            ps.setString(1,oldid);
            ps.executeUpdate();
            JOptionPane.showMessageDialog(null,"删除成功","提示",JOptionPane.WARNING_MESSAGE);
        }catch (SQLException e){
            e.printStackTrace();
        }
    }

    public static void UpdatePass(String s,String signid,String newpass){
        String sql;
        if(s.equals("admin")){
            sql="UPDATE "+s+" SET "+s+"_pass=? WHERE "+s+"_id=?";
        }else {
            sql = "UPDATE " + "student" + " SET " + s + "_pass=? WHERE " + s + "_id=?";
        }
        try{
            ps = con.prepareStatement(sql);
            ps.setString(1,newpass);
            ps.setString(2,signid);
            ps.executeUpdate();
            JOptionPane.showMessageDialog(null, "修改成功", "提示", JOptionPane.WARNING_MESSAGE);
        }catch (SQLException e){
            e.printStackTrace();
        }
    }

    public static void Updatescore(String s,int[] a){
        try{
            String sql="UPDATE student SET CALCU="+a[0]+",LA="+a[1]+",CPL="+a[2]+",JPL="+a[3]
                    +",OS="+a[4]+",CPTT="+a[5]+",CN="+a[6]+",DS="+a[7]+" WHERE stu_id="+s;
            ps = con.prepareStatement(sql);
            ps.executeUpdate();
           // JOptionPane.showMessageDialog(null, "修改成功", "提示", JOptionPane.WARNING_MESSAGE);
        }catch (SQLException e){
          //  e.printStackTrace();
        }
    }
}
```
StudentDao.java
```java
package com.jason.dao;
import com.jason.bean.Student;
import java.util.List;

public interface StudentDao{
    int getTotal();
    void addStudent(Student student);
    void deleteStudent(int id);
    void updateStudent(Student student);
    Student getStudent(int id);
    List<Student> list(int start,int count);
}
```
Enroll.java
```java
package com.jason.frame;

import com.jason.dao.JDBCHelper;
import javax.swing.*;
import java.awt.*;
import java.awt.event.ActionEvent;
import java.awt.event.ActionListener;
import java.sql.*;

public class Enroll extends JFrame implements ActionListener {
    private JLabel userlab,passlab,power,numberid,back;
    private JButton sign_in,reset;
    private JRadioButton tea,stu;
    private JTextField username,userid;
    private JPasswordField password ;
    private JPanel all,head,up,med,down,last;
    private ImageIcon imageIcon;
    private Image image;
    private Color background;
    ButtonGroup bg;

    static JDBCHelper jdbcHelper;
    static String sqlusername;
    static String sqluserpass;

    static Connection con = null;
    PreparedStatement ps =null;
    ResultSet rs =null;

    public Enroll(){
        jdbcHelper = new JDBCHelper();
        init();

        bg=new ButtonGroup();
        bg.add(tea);
        bg.add(stu);
        stu.setSelected(true);

        head.add(numberid);
        head.add(userid);
        all.add(head);

        sign_in.addActionListener(this);
        reset.addActionListener(this);
        setChar();
        up.add(userlab);
        up.add(username);
        all.add(up);

        med.add(passlab);
        med.add(password);
        all.add(med);

        last.add(power);
        last.add(tea);
        last.add(stu);
        all.add(last);

        down.add(sign_in);
        down.add(reset);
        all.add(down);

        this.add(all);
        this.setTitle("登录系统");
        this.setSize(600,300);
        this.setLocationRelativeTo(null);
        this.setDefaultCloseOperation(JFrame.EXIT_ON_CLOSE);
        this.setVisible(true);
        this.setResizable(false);
    }
    private void init(){
        back = new JLabel(imageIcon);
        numberid = new JLabel("教工号/学号");
        power = new JLabel("选择");
        userlab =new JLabel("用户名");
        passlab = new JLabel("密码");

        tea = new JRadioButton("教师");
        stu = new JRadioButton("学生");

        sign_in = new JButton("登录");
        reset = new JButton("重置");

        userid = new JTextField(10);
        username = new JTextField(10);
        password = new JPasswordField(10);

        all = new JPanel(new GridLayout(5,1));
        head = new JPanel();
        up = new JPanel();
        med = new JPanel();
        last = new JPanel();
        down = new JPanel(new GridLayout(1,2));

        bg = new ButtonGroup();
    }
    private void setChar(){
        //java.net.URL imgURL = TeacherPanel.class.getResource("/com/jason/img/qq_pic_merged_1542550853587.jpg");
        //imageIcon = new ImageIcon(imgURL);
        background = null;
        up.setSize(20,60);
        username.setBounds(30,30,40,50);
        Font fontlab = new Font("Arial",Font.BOLD,30);
        Font fontbut = new Font("Times New Roman",Font.PLAIN,28);
        numberid.setFont(fontlab);
        power.setFont(fontlab);
        tea.setFont(fontbut);
        stu.setFont(fontbut);
        userlab.setFont(fontlab);
        passlab.setFont(fontlab);
        userid.setFont(fontbut);
        username.setFont(fontbut);
        password.setFont(fontbut);
        sign_in.setFont(fontbut);
        reset.setFont(fontbut);

        tea.setBackground(background);
        stu.setBackground(background);
        userlab.setBackground(background);
        passlab.setBackground(background);
        sign_in.setBackground(background);
        reset.setBackground(background);
        head.setBackground(background);
        up.setBackground(background);
        med.setBackground(background);
        down.setBackground(background);
        last.setBackground(background);
    }

    public void actionPerformed(ActionEvent e) {
        if(e.getActionCommand().equals("登录")) {
            jdbcHelper.ConnecttoSQL();
            //如果选中教师登录
            if(tea.isSelected()) {
                tealogin();
            }else if(stu.isSelected()) {
                stulogin();
            }

        }else if(e.getActionCommand().equals("重置")) {
            clear();
        }
    }

    private void stulogin(){
        if(username.getText().isEmpty() && password.getText().isEmpty()){
            JOptionPane.showMessageDialog(null,"Please enter your count information","Tip",JOptionPane.WARNING_MESSAGE);
        }else if(username.getText().isEmpty()){
            JOptionPane.showMessageDialog(null,"Please enter your username","Tip",JOptionPane.WARNING_MESSAGE);
        }else if(password.getText().isEmpty()){
            JOptionPane.showMessageDialog(null,"Please enter your password","Tip",JOptionPane.WARNING_MESSAGE);
        }else{
            String s2 = userid.getText();
            jdbcHelper.sqlquery("SELECT * FROM student WHERE stu_id=",s2,2,3);
            if(jdbcHelper.isSuccessfulsign()) {
                //System.out.print("no bug hereeeeeeeeeeeeeeee");
                sqluserpass = jdbcHelper.getUserpass();
                sqlusername = jdbcHelper.getUsername();
                //System.out.print("no bug here");
                if (username.getText().equals(sqlusername) && sqluserpass.equals(password.getText())) {
                    System.out.print("Successfully Sign In");
                    JOptionPane.showMessageDialog(null, "Successfully Sign In", "Tip", JOptionPane.WARNING_MESSAGE);
                    clear();
                    dispose();
                    new StudentPanel(s2);
                }else {
                    JOptionPane.showMessageDialog(null, "Couldn't find you count\n Try again", "Tip", JOptionPane.ERROR_MESSAGE);
                }
            }else {
                JOptionPane.showMessageDialog(null, "Couldn't find you count\n Try again", "Tip", JOptionPane.ERROR_MESSAGE);
                clear();
            }
        }
    }

    private void tealogin() {
        if (username.getText().isEmpty() && password.getText().isEmpty()) {
            JOptionPane.showMessageDialog(null, "Please enter your admin count information", "Tip", JOptionPane.WARNING_MESSAGE);
        } else if (username.getText().isEmpty()) {
            JOptionPane.showMessageDialog(null, "Please enter your admin username", "Tip", JOptionPane.WARNING_MESSAGE);
        } else if (password.getText().isEmpty()) {
            JOptionPane.showMessageDialog(null, "Please enter your admin password", "Tip", JOptionPane.WARNING_MESSAGE);
        } else {
            String s2 = userid.getText();
            jdbcHelper.sqlquery("SELECT * FROM admin WHERE admin_id=", s2, 2, 3);

            if (jdbcHelper.isSuccessfulsign()) {
                sqluserpass = jdbcHelper.getUserpass();
                sqlusername = jdbcHelper.getUsername();
                if (sqlusername.equals(username.getText()) && sqluserpass.equals(password.getText())) {
                    //System.out.print("Successfully Sign In");
                    JOptionPane.showMessageDialog(null, "Successfully admin Sign In", "Tip", JOptionPane.WARNING_MESSAGE);
                    clear();
                    dispose();
                    new TeacherPanel(s2);
                }else {
                    JOptionPane.showMessageDialog(null, "Couldn't find you count\n Try again", "Tip", JOptionPane.ERROR_MESSAGE);
                }
            } else {
                JOptionPane.showMessageDialog(null, "Couldn't find you admin count\n Try again", "Tip", JOptionPane.ERROR_MESSAGE);
                clear();
            }
        }
    }
    private void clear(){
        userid.setText("");
        username.setText("");
        password.setText("");
    }
}
```
StudentPanel.java
```java
package com.jason.frame;

import com.jason.model.GPAPanel;
import com.jason.model.ProfileControl;
import com.jason.model.lessonControl;

import javax.swing.*;
import java.awt.*;
import java.awt.event.ActionEvent;
import java.awt.event.ActionListener;

public class StudentPanel extends JFrame implements ActionListener {
    private JMenuBar menuBar;
    private JMenu lessoncontrol, profile, GPAcontrol;
    private JMenuItem serachGPA,statGPA;
    private JMenuItem lessoncontrolitem, Personalcontrolitem,SignOut;
    private Font font;
    private ImageIcon img;
    private JLabel icon;
    private String signid;

    public StudentPanel(String s) {
        signid =s;
        init();
        setChar();
        this.setTitle("学生信息管理系统");
        this.setLayout(new BorderLayout());
        this.setVisible(true);
        this.setDefaultCloseOperation(JFrame.EXIT_ON_CLOSE);
        this.setSize(1270,800);
        this.setResizable(false);
        setLocation(600,200);

        lessoncontrol.add(lessoncontrolitem);
        GPAcontrol.add(serachGPA);
        GPAcontrol.add(statGPA);
        profile.add(Personalcontrolitem);
        menuBar.add(lessoncontrol);
        menuBar.add(GPAcontrol);
        menuBar.add(profile);
        this.add(menuBar,BorderLayout.NORTH);
        this.add(icon,BorderLayout.CENTER);
    }

    public void actionPerformed(ActionEvent e){
        if(e.getActionCommand().equals("课程管理")){
            new lessonControl();
        }else if(e.getActionCommand().equals("个人中心")){
            new ProfileControl(signid,"stu");
        }else if(e.getActionCommand().equals("查询成绩")){
            new GPAPanel();
        }else if(e.getActionCommand().equals("成绩统计")){
            new GPAPanel();
        }else if(e.getActionCommand().equals("退出系统")){
            dispose();
        }

    }

    private void init(){
        java.net.URL imgURL = TeacherPanel.class.getResource("/com/jason/img/qq_pic_merged_1542552134500.jpg");
        java.awt.Font font = new java.awt.Font("宋体",Font.PLAIN,43);
        icon=new JLabel();
        img = new ImageIcon(imgURL);
        icon.setIcon(img);
        menuBar = new JMenuBar();
        lessoncontrol = new JMenu("课程管理");
        profile = new JMenu("个人中心");
        GPAcontrol = new JMenu("成绩管理");
        serachGPA = new JMenuItem("查询成绩");
        statGPA = new JMenuItem("成绩统计");
        lessoncontrolitem = new JMenuItem("课程管理");
        Personalcontrolitem = new JMenuItem("个人中心");
        SignOut = new JMenuItem("退出系统");
        serachGPA.addActionListener(this);
        statGPA.addActionListener(this);
        lessoncontrolitem.addActionListener(this);
        Personalcontrolitem.addActionListener(this);
        SignOut.addActionListener(this);
    }

    private void setChar(){
        lessoncontrol.setFont(font);
        profile.setFont(font);
        GPAcontrol.setFont(font);
        serachGPA.setFont(font);
        statGPA.setFont(font);
        lessoncontrolitem.setFont(font);
        Personalcontrolitem.setFont(font);
    }
}
```
TeacherPanel.java
```java
package com.jason.frame;

import com.jason.dao.JDBCHelper;
import com.jason.model.*;
import javax.swing.*;
import java.awt.*;
import java.awt.event.ActionEvent;
import java.awt.event.ActionListener;

public class TeacherPanel extends JFrame implements ActionListener {

    private JMenuBar menuBar;
    private JMenu stucontrol,GPAcontrol,profile;
    private JMenuItem addGPA, updateGPA, serachGPA, statGPA;
    private JMenuItem stucontrolitem, Signout,Personalcontrolitem;
    private Font font;
    private String signid;
    private ImageIcon img;
    private JLabel icon;

    public TeacherPanel(String s) {
        signid=s;
        init();
        setChar();
        this.setTitle("学生信息管理系统");
        this.setLayout(new BorderLayout());
        this.setVisible(true);
        this.setDefaultCloseOperation(JFrame.EXIT_ON_CLOSE);
        this.setSize(1300,1000);
        this.setResizable(false);
        //this.setAlwaysOnTop(true);
        setLocation(600,200);

        stucontrol.add(stucontrolitem);
        profile.add(Personalcontrolitem);
        GPAcontrol.add(addGPA);
        GPAcontrol.add(updateGPA);
        GPAcontrol.add(serachGPA);
        GPAcontrol.add(statGPA);
        menuBar.add(stucontrol);
        menuBar.add(GPAcontrol);
        menuBar.add(profile);
        menuBar.add(Signout);
        this.add(menuBar,BorderLayout.NORTH);
        this.add(icon,BorderLayout.CENTER);
    }

    public void actionPerformed(ActionEvent e){
        if(e.getActionCommand().equals("学籍管理")){
            new ControlPanel();
        }else if(e.getActionCommand().equals("增加成绩")){
            new GPAControl();
        }else if(e.getActionCommand().equals("修改成绩")){
            new GPAControl();
        }else if(e.getActionCommand().equals("查询成绩")){
            new GPAControl();
        }else if(e.getActionCommand().equals("成绩统计")){
            new GPAstatic();
        }else if(e.getActionCommand().equals("个人中心")){
            new ProfileControl(signid,"tea");
        }else if(e.getActionCommand().equals("退出系统")){
            dispose();
        }
    }

    private void init(){
        java.net.URL imgURL = TeacherPanel.class.getResource("/com/jason/img/qq_pic_merged_1542550853587.jpg");
        java.awt.Font font = new java.awt.Font("宋体",Font.PLAIN,43);
        icon=new JLabel();
        img = new ImageIcon(imgURL);
        icon.setIcon(img);
        menuBar = new JMenuBar();
        stucontrol = new JMenu("学籍管理");
        GPAcontrol = new JMenu("成绩管理");
        addGPA = new JMenuItem("增加成绩");
        updateGPA = new JMenuItem("修改成绩");
        serachGPA = new JMenuItem("查询成绩");
        statGPA = new JMenuItem("成绩统计");
        Signout = new JMenuItem("退出系统");
        profile = new JMenu("个人中心");
        stucontrolitem = new JMenuItem("学籍管理");
        Personalcontrolitem = new JMenuItem("个人中心");

        GPAcontrol.addActionListener(this);
        addGPA.addActionListener(this);
        updateGPA.addActionListener(this);
        serachGPA.addActionListener(this);
        statGPA.addActionListener(this);
        Signout.addActionListener(this);
        stucontrolitem.addActionListener(this);
        Personalcontrolitem.addActionListener(this);
    }

    private void setChar(){
        GPAcontrol.setFont(font);
        addGPA.setFont(font);
        updateGPA.setFont(font);
        serachGPA.setFont(font);
        statGPA.setFont(font);
        stucontrolitem.setFont(font);
        Personalcontrolitem.setFont(font);
    }
}
```
AddSource.java
```java
package com.jason.model;

import com.jason.dao.JDBCHelper;

import javax.swing.*;
import java.awt.*;
import java.awt.event.ActionEvent;
import java.awt.event.ActionListener;

public class AddScore extends JFrame implements ActionListener{
    private JLabel idlab,id,namelab,name;
    private JLabel CALCU,LA,CPL,JPL,OS,CPTT,CN,DS;
    private JTextField getCALCU,getLA,getCPL,getJPL,getOS,getCPTT,getCN,getDS;
    private JPanel butp,namep,idp,pCALCU,pLA,pCPL,pJPL,pOS,pCPTT,pCN,pDS;
    private JButton right,back;
    private String oldid,oldname;
    private JDBCHelper jdbcHelper;
    public AddScore(String s){
        jdbcHelper = new JDBCHelper();
        jdbcHelper.ConnecttoSQL();
        oldid = s;
        jdbcHelper.sqlquery("SELECT * FROM student WHERE stu_id=",oldid,2,3);
        oldname = jdbcHelper.getUsername().toString();
        init();
        this.setTitle("修改成绩");
        this.setVisible(true);
        this.setDefaultCloseOperation(JFrame.DISPOSE_ON_CLOSE);
        this.setSize(500,800);
        this.setResizable(false);
        this.setAlwaysOnTop(true);
        this.setLayout(new GridLayout(11,1));
        setLocation(680,320);
        namep.add(namelab);namep.add(name);
        idp.add(idlab);idp.add(id);
        pCALCU.add(CALCU);pCALCU.add(getCALCU);
        pLA.add(LA);pLA.add(getLA);
        pCPL.add(CPL);pCPL.add(getCPL);
        pJPL.add(JPL);pJPL.add(getJPL);
        pOS.add(OS);pOS.add(getOS);
        pCPTT.add(CPTT);pCPTT.add(getCPTT);
        pCN.add(CN);pCN.add(getCN);
        pDS.add(DS);pDS.add(getDS);
        butp.add(right);butp.add(back);
        add(namep);add(idp);add(pCALCU);add(pLA);add(pCPL);add(pJPL);add(pOS);add(pCPTT);add(pCN);add(pDS);add(butp);
    }
    private void init(){
        idlab = new JLabel("学号: ");
        id = new JLabel(oldid);
        namelab= new JLabel("姓名: ");
        name=new JLabel(oldname);
        CALCU=new JLabel("高等数学");
        LA=new JLabel("线性代数");
        CPL=new JLabel("C语言程序设计");
        JPL=new JLabel("Java面向对象程序设计");
        OS=new JLabel("操作系统");
        CPTT=new JLabel("编译原理");
        CN=new JLabel("计算机网络");
        DS=new JLabel("数据结构");
        getCALCU=new JTextField(10);
        getLA=new JTextField(10);
        getCPL=new JTextField(10);
        getJPL=new JTextField(10);
        getOS=new JTextField(10);
        getCPTT=new JTextField(10);
        getCN=new JTextField(10);
        getDS=new JTextField(10);
        right = new JButton("确认修改");
        back = new JButton("放弃修改");
        namep=new JPanel();
        idp=new JPanel();
        pCALCU=new JPanel();
        pLA=new JPanel();
        pCPL=new JPanel();
        pJPL=new JPanel();
        pOS=new JPanel();
        pCPTT=new JPanel();
        pCN=new JPanel();
        pDS=new JPanel();
        butp = new JPanel();
        right.addActionListener(this);
        back.addActionListener(this);
    }
    public void actionPerformed(ActionEvent e){
        if(e.getActionCommand().equals("确认修改")){
            int[] score = new int[8];
            score[0]=Integer.parseInt(getCALCU.getText());
            score[1]=Integer.parseInt(getLA.getText());
            score[2]=Integer.parseInt(getCPL.getText());
            score[3]=Integer.parseInt(getJPL.getText());
            score[4]=Integer.parseInt(getOS.getText());
            score[5]=Integer.parseInt(getCPTT.getText());
            score[6]=Integer.parseInt(getCN.getText());
            score[7]=Integer.parseInt(getDS.getText());
            System.out.println("zhixing yu ci");
            jdbcHelper.Updatescore(oldid,score);
            dispose();
        }else if(e.getActionCommand().equals("放弃修改")){
            dispose();
        }
    }
}
```
Addstu.java
```java
package com.jason.model;

import com.jason.dao.JDBCHelper;

import javax.swing.*;
import java.awt.*;
import java.awt.event.ActionEvent;
import java.awt.event.ActionListener;

public class Addstu extends JFrame implements ActionListener {
    private JLabel stu_id,stu_name,stu_class,stu_sex;
    private JTextField getstu_id,getstu_name;
    private JComboBox getstu_class,getstu_sex;
    private JButton add,reset;
    private JPanel p1,p2,p3,p4,p5;
    private JDBCHelper jdbcHelper;
    
    public Addstu(String engname) {
        init();
        setChar();
        this.setTitle("添加学籍");
        this.setLayout(new GridLayout(5,1));
        this.setVisible(true);
        this.setDefaultCloseOperation(JFrame.DISPOSE_ON_CLOSE);
        this.setSize(300, 400);
        this.setResizable(false);
        this.setAlwaysOnTop(true);
        setLocation(1220, 320);
        p1.add(stu_id);p1.add(getstu_id);add(p1);
        p2.add(stu_name);p2.add(getstu_name);add(p2);
        p3.add(stu_sex);p3.add(getstu_sex);add(p3);
        p4.add(stu_class);p4.add(getstu_class);add(p4);
        p5.add(add);p5.add(reset);add(p5);
    }

    public void init() {
        jdbcHelper = new JDBCHelper();
        stu_id= new JLabel("学号");
        stu_name = new JLabel("姓名");
        stu_class = new JLabel("班级");
        stu_sex = new JLabel("性别");
        getstu_id = new JTextField(10);
        getstu_name =new JTextField(10);
        getstu_class = new JComboBox();
        getstu_sex = new JComboBox();
        getstu_class.addItem("计算机科学与技术");
        getstu_class.addItem("网络工程");
        getstu_class.addItem("数字媒体技术");
        getstu_class.addItem("金融大数据");
        getstu_class.addItem("金融信息化");
        getstu_sex.addItem("男");
        getstu_sex.addItem("女");
        add = new JButton("确认添加");
        reset = new JButton("清空重置");
        add.addActionListener(this);
        reset.addActionListener(this);
        p1=new JPanel();
        p2=new JPanel();
        p3=new JPanel();
        p4=new JPanel();
        p5=new JPanel();

    }
    private void setChar(){
        Font fontlab = new Font("Arial",Font.BOLD,18);
        Font fontbut = new Font("Times New Roman",Font.PLAIN,18);
        add.setFont(fontbut);
        reset.setFont(fontbut);
        stu_sex.setFont(fontlab);
        stu_id.setFont(fontlab);
        stu_name.setFont(fontlab);
        stu_class.setFont(fontlab);

    }
    public void actionPerformed(ActionEvent e){
        if(e.getActionCommand().equals("确认添加")){
            jdbcHelper.ConnecttoSQL();
            String id = getstu_id.getText();
            String name = getstu_name.getText();
            String s = getstu_class.getSelectedItem().toString();
            String classname = Trans2eng(s);
            String sex = Trans2eng(getstu_sex.getSelectedItem().toString());
            jdbcHelper.addstuinfo(name,sex,id,classname);
            JOptionPane.showMessageDialog(null,"添加信息成功","提示",JOptionPane.WARNING_MESSAGE);
            getstu_id.setText("");
            getstu_name.setText("");
        }else if(e.getActionCommand().equals("清空重置")){
            getstu_id.setText("");
            getstu_name.setText("");
        }
    }
    private String Trans2eng(String s){
        String classname = s;
        String engclassname;
        if(classname.equals("计算机科学与技术")){
            engclassname = "CS";
        }else if(classname.equals("网络工程")){
            engclassname = "NP";
        }else if(classname.equals("数字媒体技术")){
            engclassname = "DMT";
        }else if(classname.equals("金融大数据")){
            engclassname = "FB";
        }else if(classname.equals("金融信息化")){
            engclassname = "FI";
        }else if(classname.equals("男")){
            engclassname = "M";
        }else if(classname.equals("女")){
            engclassname = "F";
        }else {
            engclassname= "CS";
        }
        return engclassname;
    }
}
```
ControlPanel.java
```java
package com.jason.model;

import com.jason.dao.JDBCHelper;

import javax.swing.*;
import javax.swing.table.JTableHeader;
import java.awt.*;
import java.awt.event.ActionEvent;
import java.awt.event.ActionListener;

public class ControlPanel extends JFrame implements ActionListener{
    private JLabel serchlab;
    private JTableHeader jTableHeader;
    private JTable jTable;
    private JButton addstu,updatestu,deletstu,serachstu;
    private JPanel updatepanel,initpanel,head,body,foot;
    private JScrollPane spstu;
    private JComboBox classselect;
    private JDBCHelper jdbcHelper;
    private String[] title = {"学号","姓名","年龄","性别"};

    public ControlPanel(){
        init();
        setChar();
        this.setTitle("学籍管理");
        this.setVisible(true);
        this.setDefaultCloseOperation(JFrame.DISPOSE_ON_CLOSE);
        this.setSize(500,800);
        this.setResizable(false);
        this.setAlwaysOnTop(true);
        setLocation(680,320);
        this.spstu.getViewport().add(jTable);

        jdbcHelper.ConnecttoSQL();
        jTable=jdbcHelper.scrollpanel("select * from student");
        //jTable=jdbcHelper.classinfo("计算机科学与技术");
        jTableHeader = jTable.getTableHeader();
        spstu.getViewport().add(jTable);
        initpanel.setLayout(new BorderLayout());
        head.setLayout(new BorderLayout());
        head.add(serchlab,BorderLayout.WEST);
        head.add(classselect,BorderLayout.CENTER);
        head.add(serachstu,BorderLayout.EAST);
        initpanel.add(head,BorderLayout.NORTH);
        body.add(spstu);
        initpanel.add(body,BorderLayout.CENTER);
        foot.setLayout(new GridLayout(3,1));
        foot.add(addstu);
        foot.add(updatestu);
        foot.add(deletstu);
        initpanel.add(foot,BorderLayout.SOUTH);
        this.add(initpanel);

    }
    private void init(){

        jdbcHelper = new JDBCHelper();
        body = new JPanel();
        foot = new JPanel();
        head = new JPanel();
        initpanel = new JPanel();
        updatepanel = new JPanel();
        addstu = new JButton("添加学籍");
        updatestu = new JButton("修改学籍");
        deletstu = new JButton("删除学籍");
        serachstu = new JButton("查询");
        spstu = new JScrollPane();
        classselect = new JComboBox();
        setStu_class();
        serachstu.addActionListener(this);
        addstu.addActionListener(this);
        updatestu.addActionListener(this);
        deletstu.addActionListener(this);
        classselect.addActionListener(this);
        serchlab = new JLabel("查询班级学生  ");
        jTable = null;
        jTableHeader=null;

    }
    private void setStu_class(){
        classselect.addItem("计算机科学与技术");
        classselect.addItem("网络工程");
        classselect.addItem("数字媒体技术");
        classselect.addItem("金融大数据");
        classselect.addItem("金融信息化");
    }

    public void actionPerformed(ActionEvent e) {
        if (e.getActionCommand().equals("查询")) {
            String sql ="select * from student where stu_class='"+Trans2eng()+"'";
            //jTable = jdbcHelper.classinfo(Trans2eng());
            jTable = jdbcHelper.scrollpanel(sql);
            jTableHeader = jTable.getTableHeader();
            spstu.getViewport().add(jTable);
        } else if (e.getActionCommand().equals("添加学籍")) {
            new Addstu(Trans2eng());
        } else if (e.getActionCommand().equals("修改学籍")) {
            int rows = jTable.getSelectedRow();
            try {
                new Updatestu(jTable.getValueAt(rows, 0).toString(), jTable.getValueAt(rows, 1).toString());
            } catch (Exception nice) {
                JOptionPane.showMessageDialog(null, "请选择学籍信息", "提示", JOptionPane.WARNING_MESSAGE);
            }
        } else if (e.getActionCommand().equals("删除学籍")) {
            try {
                int rows = jTable.getSelectedRow();
                new Deletstuinfo(jTable.getValueAt(rows, 0).toString());
            } catch (Exception th) {
                JOptionPane.showMessageDialog(null, "请选择学籍信息", "提示", JOptionPane.WARNING_MESSAGE);
            }
        }
    }

    private String Trans2eng(){
        String classname = classselect.getSelectedItem().toString();
        String engclassname;
        if(classname.equals("计算机科学与技术")){
            engclassname = "CS";
        }else if(classname.equals("网络工程")){
            engclassname = "NP";
        }else if(classname.equals("数字媒体技术")){
            engclassname = "DMT";
        }else if(classname.equals("金融大数据")){
            engclassname = "FB";
        }else if(classname.equals("金融信息化")){
            engclassname = "FI";
        }else{
            engclassname= "CS";
        }
        return engclassname;
    }
    private void setChar(){
        Font fontlab = new Font("Arial",Font.BOLD,18);
        Font fontbut = new Font("Times New Roman",Font.PLAIN,28);
        addstu.setFont(fontbut);
        updatestu.setFont(fontbut);
        deletstu.setFont(fontbut);
        serachstu.setFont(fontbut);
        serchlab.setFont(fontlab);
    }
    public static void main(String[] args){
        new ControlPanel();
    }
}
```
Deletstuinfo.java
```java
package com.jason.model;

import com.jason.dao.JDBCHelper;

import javax.swing.*;
import java.awt.*;
import java.awt.event.ActionEvent;
import java.awt.event.ActionListener;

public class Deletstuinfo extends JFrame implements ActionListener {
    private JButton right,no;
    private JLabel tip;
    private JPanel but,lab;
    private JDBCHelper jdbcHelper;
    private String arg;
    public Deletstuinfo(String oldid){
        arg = oldid;
        init();
        setChar();
        setLayout(new GridLayout(2,1));
        this.setTitle("学籍管理");
        this.setVisible(true);
        this.setDefaultCloseOperation(JFrame.DISPOSE_ON_CLOSE);
        this.setSize(300,200);
        this.setResizable(false);
        this.setAlwaysOnTop(true);
        setLocation(780,720);
        lab.add(tip);
        add(lab);
        but.add(right);
        but.add(no);
        add(but);
    }
    private void init(){
        lab= new JPanel();
        jdbcHelper = new JDBCHelper();
        but = new JPanel();
        right = new JButton("是");
        no = new JButton("否");
        tip = new JLabel("确认删除这条信息？");
        right.addActionListener(this);
        no.addActionListener(this);
    }
    private void setChar(){
        Font fontlab = new Font("Arial",Font.BOLD,25);
        Font fontbut = new Font("Times New Roman",Font.PLAIN,22);
        right.setFont(fontbut);
        no.setFont(fontbut);
        tip.setFont(fontlab);
    }
    public void actionPerformed(ActionEvent e){
        if(e.getActionCommand().equals("是")){
            jdbcHelper.ConnecttoSQL();
            jdbcHelper.deletstuinfo(arg);
            dispose();
        }else if(e.getActionCommand().equals("否")){
            dispose();
        }
    }
}
```
GPAControl.java
```java
package com.jason.model;
import com.jason.dao.JDBCHelper;

import javax.swing.*;
import javax.swing.table.JTableHeader;
import java.awt.*;
import java.awt.event.ActionEvent;
import java.awt.event.ActionListener;

public class GPAControl extends JFrame implements ActionListener {
    private JLabel searchlab;
    private JTable jTable;
    private JButton addsroce,updatescore,serachscore;
    private JPanel initpanel,head,foot;
    private JScrollPane spstu;
    private JComboBox classselect;
    private JDBCHelper jdbcHelper;
    private JTableHeader jTableHeader;
    public GPAControl(){
        init();
        setChar();
        this.setTitle("成绩管理");
        this.setLayout(new BorderLayout());
        this.setVisible(true);
        this.setDefaultCloseOperation(JFrame.DISPOSE_ON_CLOSE);
        this.setSize(1000,800);
        this.setResizable(false);
        this.setAlwaysOnTop(true);
        setLocation(680,320);

        jdbcHelper.ConnecttoSQL();
        jTable=jdbcHelper.scrollpanelsocrce("select * from student");
        jTableHeader = jTable.getTableHeader();
        spstu.getViewport().add(jTable);
        initpanel.setLayout(new BorderLayout());
        head.add(searchlab);
        head.add(classselect);
        head.add(serachscore);
        initpanel.add(head,BorderLayout.NORTH);
        spstu.setSize(200,300);
        initpanel.add(spstu,BorderLayout.CENTER);
        foot.add(addsroce);
        foot.add(updatescore);
        initpanel.add(foot,BorderLayout.SOUTH);
        add(initpanel);
    }
    private void init(){
        jdbcHelper = new JDBCHelper();
        foot = new JPanel();
        head = new JPanel();
        initpanel = new JPanel();
        addsroce = new JButton("添加成绩");
        updatescore = new JButton("修改成绩");
        serachscore = new JButton("查询");
        spstu = new JScrollPane();
        classselect = new JComboBox();
        setStu_class();
        serachscore.addActionListener(this);
        addsroce.addActionListener(this);
        updatescore.addActionListener(this);
        classselect.addActionListener(this);
        searchlab = new JLabel("查询班级成绩  ");
        jTable=null;
    }
    private void setStu_class(){
        classselect.addItem("计算机科学与技术");
        classselect.addItem("网络工程");
        classselect.addItem("数字媒体技术");
        classselect.addItem("金融大数据");
        classselect.addItem("金融信息化");
    }
    private String Trans2eng(){
        String classname = classselect.getSelectedItem().toString();
        String engclassname;
        if(classname.equals("计算机科学与技术")){
            engclassname = "CS";
        }else if(classname.equals("网络工程")){
            engclassname = "NP";
        }else if(classname.equals("数字媒体技术")){
            engclassname = "DMT";
        }else if(classname.equals("金融大数据")){
            engclassname = "FB";
        }else if(classname.equals("金融信息化")){
            engclassname = "FI";
        }else{
            engclassname= "CS";
        }
        return engclassname;
    }

    private void setChar(){
        Font fontlab = new Font("Arial",Font.BOLD,18);
        Font fontbut = new Font("Times New Roman",Font.PLAIN,28);
        addsroce.setFont(fontbut);
        updatescore.setFont(fontbut);
        serachscore.setFont(fontbut);
        searchlab.setFont(fontlab);
    }
    public void actionPerformed(ActionEvent e){
        if(e.getActionCommand().equals("查询")){
            String sql ="select * from student where stu_class='"+Trans2eng()+"'";
            jTable = jdbcHelper.scrollpanelsocrce(sql);
            jTableHeader = jTable.getTableHeader();
            spstu.getViewport().add(jTable);
        }else if(e.getActionCommand().equals("添加成绩")||e.getActionCommand().equals("修改成绩")){
            int rows = jTable.getSelectedRow();
            try{
                new AddScore(jTable.getValueAt(rows, 0).toString());
            }catch (Exception nice){
                JOptionPane.showMessageDialog(null, "请选择学生信息", "提示", JOptionPane.WARNING_MESSAGE);
                //nice.printStackTrace();
            }
        }
    }
}
```
GPAstatic.java
```java
package com.jason.model;

import com.jason.dao.JDBCHelper;
import javax.lang.model.element.Element;
import javax.swing.*;
import javax.swing.table.JTableHeader;
import java.awt.*;
import java.awt.event.ActionEvent;
import java.awt.event.ActionListener;
import java.util.Vector;

public class GPAstatic extends JFrame implements ActionListener {

    private JLabel searchlab,gpastatic;
    private JTable jTable,footTable;
    private JButton serachscore;
    private JPanel initpanel, head, foot;
    private JScrollPane spstu,spstat;
    private JComboBox classselect;
    private JDBCHelper jdbcHelper;
    private JTableHeader jTableHeader;

    public GPAstatic() {
        init();
        setChar();
        this.setTitle("成绩管理");
        this.setLayout(new BorderLayout());
        this.setVisible(true);
        this.setDefaultCloseOperation(JFrame.DISPOSE_ON_CLOSE);
        this.setSize(1000, 800);
        this.setResizable(false);
        this.setAlwaysOnTop(true);
        setLocation(680, 320);

        jdbcHelper.ConnecttoSQL();
        jTable = jdbcHelper.scrollpanelsocrce("select * from student");
        jTableHeader = jTable.getTableHeader();
        spstat.getViewport().add(footTable);
        spstu.getViewport().add(jTable);
        initpanel.setLayout(new BorderLayout());
        head.add(searchlab);
        head.add(classselect);
        head.add(serachscore);
        foot.add(gpastatic);
        foot.add(spstat);
        initpanel.add(head, BorderLayout.NORTH);
        spstu.setSize(200, 300);
        initpanel.add(spstu, BorderLayout.CENTER);
        initpanel.add(foot, BorderLayout.SOUTH);
        add(initpanel);
    }

    private void init() {
        jdbcHelper = new JDBCHelper();
        foot = new JPanel(new GridLayout(2,1));
        head = new JPanel();
        gpastatic = new JLabel("平均成绩");
        initpanel = new JPanel();
        serachscore = new JButton("查询");
        spstu = new JScrollPane();
        spstat = new JScrollPane();
        classselect = new JComboBox();
        setStu_class();
        serachscore.addActionListener(this);
        classselect.addActionListener(this);
        searchlab = new JLabel("查询班级成绩  ");
        jTable = null;
        footTable = null;
    }

    private void setStu_class() {
        classselect.addItem("计算机科学与技术");
        classselect.addItem("网络工程");
        classselect.addItem("数字媒体技术");
        classselect.addItem("金融大数据");
        classselect.addItem("金融信息化");
    }

    private String Trans2eng() {
        String classname = classselect.getSelectedItem().toString();
        String engclassname;
        if (classname.equals("计算机科学与技术")) {
            engclassname = "CS";
        } else if (classname.equals("网络工程")) {
            engclassname = "NP";
        } else if (classname.equals("数字媒体技术")) {
            engclassname = "DMT";
        } else if (classname.equals("金融大数据")) {
            engclassname = "FB";
        } else if (classname.equals("金融信息化")) {
            engclassname = "FI";
        } else {
            engclassname = "CS";
        }
        return engclassname;
    }

    private void setChar() {
        Font fontlab = new Font("Arial", Font.BOLD, 18);
        Font fontbut = new Font("Times New Roman", Font.PLAIN, 28);
        serachscore.setFont(fontbut);
        searchlab.setFont(fontlab);
    }

    public void actionPerformed(ActionEvent e) {
        if (e.getActionCommand().equals("查询")) {
            String sql = "select * from student where stu_class='" + Trans2eng() + "'";
            jTable = jdbcHelper.scrollpanelsocrcestat(sql);
            jTableHeader = jTable.getTableHeader();
            spstu.getViewport().add(jTable);
        }
    }
}
```
ProfileControl.java
```java
package com.jason.model;

import com.jason.dao.JDBCHelper;
import com.jason.frame.TeacherPanel;

import javax.swing.*;
import java.awt.*;
import java.awt.event.ActionEvent;
import java.awt.event.ActionListener;

public class ProfileControl extends JFrame implements ActionListener {
    private JPanel body, pass, head, headleft, headright, foot, namepanel, idpanel;
    private JButton right, back;
    private JLabel namelab, naem, idlab, id, oldpasslab, newpasslab, icon;
    private ImageIcon image;
    private String signid, isteaorstu;
    private JDBCHelper jdbcHelper;
    private JTextField oldpass, newpass;

    public ProfileControl(String s, String s2) {
        isteaorstu = s2;
        signid = s;
        init();
        setChar();
        this.setTitle("个人中心");
        this.setLayout(new GridLayout(2, 1));
        this.setVisible(true);
        this.setDefaultCloseOperation(JFrame.DISPOSE_ON_CLOSE);
        this.setSize(640, 400);
        this.setResizable(false);
        this.setAlwaysOnTop(true);
        setLocation(1220, 720);

        idpanel.add(idlab);
        idpanel.add(id);
        headright.add(idpanel);
        namepanel.add(namelab);
        namepanel.add(naem);
        headright.add(namepanel);
        head.add(headright);
        headleft.add(icon);
        head.add(headleft);
        pass.add(oldpasslab);
        pass.add(oldpass);
        pass.add(newpasslab);
        pass.add(newpass);
        body.add(pass);
        foot.add(right);
        foot.add(back);
        body.add(foot);
        add(head);
        add(body);

    }

    public void init() {
        jdbcHelper = new JDBCHelper();
        jdbcHelper.ConnecttoSQL();
        if (isteaorstu.equals("tea")) {
            namelab = new JLabel("教师姓名: ");
            idlab = new JLabel("教工号: ");
            jdbcHelper.sqlquery("SELECT * FROM admin WHERE admin_id=", signid, 2, 3);
            naem = new JLabel(jdbcHelper.getUsername().toString());
            id = new JLabel(signid);
        } else {
            namelab = new JLabel("学生姓名: ");
            idlab = new JLabel("学号: ");
            jdbcHelper.sqlquery("SELECT * FROM student WHERE stu_id=", signid, 2, 3);
            naem = new JLabel(jdbcHelper.getUsername().toString());
            id = new JLabel(signid);
        }
        oldpass = new JTextField(20);
        newpass = new JTextField(20);
        oldpasslab = new JLabel("      旧密码:");
        newpasslab = new JLabel("      新密码:");
        namepanel = new JPanel();
        body = new JPanel(new GridLayout(2, 1));
        idpanel = new JPanel();
        headleft = new JPanel();
        headright = new JPanel();
        head = new JPanel(new GridLayout(1, 2));
        foot = new JPanel();
        pass = new JPanel(new GridLayout(2, 2));
        right = new JButton("确认修改");
        back = new JButton("退出修改");
        right.addActionListener(this);
        back.addActionListener(this);
        icon = new JLabel();
        java.net.URL imgURL = ProfileControl.class.getResource("/com/jason/img/download.jpg");
        image = new ImageIcon(imgURL);
        icon.setIcon(image);
    }

    public void setChar() {
        Font fontlab = new Font("Arial", Font.BOLD, 30);
        Font fontbut = new Font("Times New Roman", Font.PLAIN, 28);
        right.setFont(fontbut);
        back.setFont(fontbut);
        namelab.setFont(fontlab);
        naem.setFont(fontlab);
        idlab.setFont(fontlab);
        id.setFont(fontlab);
        oldpasslab.setFont(fontlab);
        newpasslab.setFont(fontlab);

    }

    public void actionPerformed(ActionEvent e) {
        if (e.getActionCommand().equals("确认修改")) {
            if (oldpass.getText().isEmpty() || newpass.getText().isEmpty()) {
                JOptionPane.showMessageDialog(null, "无效操作", "提示", JOptionPane.ERROR_MESSAGE);
            } else {
                String sql;
                if (isteaorstu.equals("tea")) {
                    sql = "admin";
                } else {
                    sql = "stu";
                }
                jdbcHelper.sqlquery(sql, signid, 2, 3);
                if (oldpass.getText().equals(jdbcHelper.getUserpass())) {
                    String newpasswprd = newpass.getText().toString();
                    jdbcHelper.UpdatePass(sql, signid, newpasswprd);
                } else {
                    JOptionPane.showMessageDialog(null, "密码错误", "提示", JOptionPane.ERROR_MESSAGE);
                }
            }
        } else if (e.getActionCommand().equals("退出修改")) {
            dispose();
        }
    }
}
```
Updatestu.java
```java
package com.jason.model;

import com.jason.dao.JDBCHelper;

import javax.swing.*;
import java.awt.*;
import java.awt.event.ActionEvent;
import java.awt.event.ActionListener;

public class Updatestu extends JFrame implements ActionListener {
    private JLabel stu_id,stu_name,stu_class,stu_sex;
    private JTextField getstu_id,getstu_name;
    private JComboBox getstu_class,getstu_sex;
    private JButton add,reset;
    private JPanel p1,p2,p3,p4,p5;
    private JDBCHelper jdbcHelper;
    private String cardid;

    public Updatestu(String stuid,String oldname) {
        cardid=stuid;
        init();
        setChar();
        this.setTitle("修改学籍");
        this.setLayout(new GridLayout(5,1));
        this.setVisible(true);
        this.setDefaultCloseOperation(JFrame.DISPOSE_ON_CLOSE);
        this.setSize(300, 400);
        this.setResizable(false);
        this.setAlwaysOnTop(true);
        setLocation(1560, 320);
        getstu_id.setText(cardid);
        getstu_name.setText(oldname);
        p1.add(stu_id);p1.add(getstu_id);add(p1);
        p2.add(stu_name);p2.add(getstu_name);add(p2);
        p3.add(stu_sex);p3.add(getstu_sex);add(p3);
        p4.add(stu_class);p4.add(getstu_class);add(p4);
        p5.add(add);p5.add(reset);add(p5);
    }

    public void init() {
        jdbcHelper = new JDBCHelper();
        stu_id= new JLabel("学号");
        stu_name = new JLabel("姓名");
        stu_class = new JLabel("班级");
        stu_sex = new JLabel("性别");
        getstu_id = new JTextField(10);
        getstu_name =new JTextField(10);
        getstu_class = new JComboBox();
        getstu_sex = new JComboBox();
        getstu_class.addItem("计算机科学与技术");
        getstu_class.addItem("网络工程");
        getstu_class.addItem("数字媒体技术");
        getstu_class.addItem("金融大数据");
        getstu_class.addItem("金融信息化");
        getstu_sex.addItem("男");
        getstu_sex.addItem("女");
        add = new JButton("确认修改");
        reset = new JButton("清空重置");
        add.addActionListener(this);
        reset.addActionListener(this);
        p1=new JPanel();
        p2=new JPanel();
        p3=new JPanel();
        p4=new JPanel();
        p5=new JPanel();

    }
    private void setChar(){
        Font fontlab = new Font("Arial",Font.BOLD,18);
        Font fontbut = new Font("Times New Roman",Font.PLAIN,18);
        add.setFont(fontbut);
        reset.setFont(fontbut);
        stu_sex.setFont(fontlab);
        stu_id.setFont(fontlab);
        stu_name.setFont(fontlab);
        stu_class.setFont(fontlab);
    }
    public void actionPerformed(ActionEvent e){
        if(e.getActionCommand().equals("确认修改")){
            jdbcHelper.ConnecttoSQL();
            String id = getstu_id.getText();
            String name = getstu_name.getText();
            String s = getstu_class.getSelectedItem().toString();
            String classname = Trans2eng(s);
            String sex = Trans2eng(getstu_sex.getSelectedItem().toString());
            jdbcHelper.updatestu(cardid,name,sex,id,classname);
            JOptionPane.showMessageDialog(null,"修改信息成功","提示",JOptionPane.WARNING_MESSAGE);
            dispose();
        }else if(e.getActionCommand().equals("清空重置")){
            getstu_id.setText("");
            getstu_name.setText("");
        }
    }
    private String Trans2eng(String s){
        String classname = s;
        String engclassname;
        if(classname.equals("计算机科学与技术")){
            engclassname = "CS";
        }else if(classname.equals("网络工程")){
            engclassname = "NP";
        }else if(classname.equals("数字媒体技术")){
            engclassname = "DMT";
        }else if(classname.equals("金融大数据")){
            engclassname = "FB";
        }else if(classname.equals("金融信息化")){
            engclassname = "FI";
        }else if(classname.equals("男")){
            engclassname = "M";
        }else if(classname.equals("女")){
            engclassname = "F";
        }else {
            engclassname= "CS";
        }
        return engclassname;
    }
}
```
test.java
```java
package com.jason.run;

import com.jason.frame.Enroll;
import com.jason.frame.TeacherPanel;

public class test {
    public static void main(String[] args){
        new Enroll();
        //new TeacherPanel();
    }
}
```


