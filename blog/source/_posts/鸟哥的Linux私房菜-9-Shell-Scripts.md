d---
title: 鸟哥的Linux私房菜-9-Shell Scripts
date: 2019-05-22 11:20:53
tags:
  - Linux
  - linux
  - Shell Scripts
  - Shell
categoties: 拉普拉斯妖
copyright:
---
shell脚本就是将一些命令集合起来一起执行，类似于程序的编写，但是不需要compile
#### What is Shell Scripts
Shell脚本是利用shell功能所写的一个 ***程序Program*** 。这个程序是使用纯文本文件，将一些shell的语法与命令（含外部命令）写在里面，搭配正则表达式、管道命令与数据流重定向结合在一起，以达到我们想要的功能。

##### 为何要学习Shell Scripts
###### 自动化管理的重要根据
###### 跟踪与管理系统 的重要工作
###### 简单入侵检测功能
###### 连续命令单一化
***汇整一些在 command line 下达的连续指令,将他写入 scripts 当中,而由直接执行 scripts 来启动一连串的 command line 指令输入!***
###### 简易的数据处理
***shell script 用在系统管理上面是很好的一项工具,但是用在处理大量数值运算上, 就不够好了,因为 Shell scripts 的速度较慢,且使用的 CPU 资源较多,造成主机资源的分配不良。***
###### 跨平台支持与学习历程较短
##### 第一个Shell Scripts程序
1. 指令的执行是从上而下、从左而右的分析与执行;
2. 指令的下达就如同第四章内提到的: 指令、选项与参数间的多个空白都会被忽略掉;
3. 空白行也将被忽略掉,并且 [tab] 按键所推开的空白同样视为空格键;
4. 如果读取到一个 Enter 符号 (CR) ,就尝试开始执行该行 (或该串) 命令;
5. 至于如果一行的内容太多,则可以使用『 \[Enter] 』来延伸至下一行;
6. 『 # 』可做为批注!任何加在 # 后面的资料将全部被视为批注文字而被忽略!
7. 如何执行命令`bash shell`,`sh shell.sh`,`/root/home/user/shell.sh`,`./shell.sh`

```bash
#!/bin/bash
#Program:
#       This program shows "Hello WOrld" in screen
PATH=/bin:/sbin:/usr/bin:/usr/sbin:/usr/local/bin:/usr/local/sbin:~/bin
export PATH
echo -e "Hello World \a \n"
exit 0
```
1. 第一行不同于其他注释 `#!/bin/bash`在声明这个脚本使用的bash名称，第一行也称为shebang行
2. 环境变量 的设置可以免去脚本中复杂的引用
##### 写Shell Scripts的良好习惯
在脚本的文件开头处写好注释，包括但不限于：
+ 脚本的功能
+ 脚本的版本信息
+ 脚本的作者于联络方式
+ 脚本的版权声明方式
+ 脚本的History
+ 脚本内较特殊的命令
+ 脚本运行时需要的环境变量
#### 简单的Shell Scripts练习
##### 简单范例
+ 交互式脚本：变量内容有用户决定
```bash
#!/bin/bash
#Program:
#       User input his first name and last name, the prog output his full name
PATH=/bin:/sbin:/usr/bin:/usr/sbin:/usr/local/bin:/usr/local/sbin:~/bin
export PATH
read -p "Please input your first name: " firstname
read -p "Please input your last name: " lastname
echo -e " \n Your full name is: ${firstname} ${lastname}"
```
+ 随日期变化
```bash
#!/bin/bash
#Program:
#       Insert date into filename
PATH=/bin:/sbin:/usr/bin:/usr/sbin:/usr/local/bin:/usr/local/sbin:~/bin
export PATH
echo -e "I will use 'touch' command to create 3 file."
read -p "Please input your filename:" fileuser

filename=${fileuser:-"filename"}

date1=$(date --date='2 days ago' +%Y%m%d)
date2=$(date --date='1 days ago' +%Y%m%d)
date3=$(date +%Y%m%d)
file1=${filename}${date1}
file2=${filename}${date2}
file3=${filename}${date3}

touch "${file1}"
touch "${file3}"
touch "${file2}"
```
+ 数值运算
使用`$(())`来实现整数数值运算
```bash
#!/bin/bash
#Program:
#       cross two number
PATH=/bin:/sbin:/usr/bin:/usr/sbin:/usr/local/bin:/usr/local/sbin:~/bin
export PATH

echo -e "Input two number,the I multiplying them! \n"
read -p "first number" first
read -p "second number" second
total=$((${first}*${second}))
echo -e "\n The result of ${first}*${second} ==> ${total}"
```
+
##### script的执行方式的差异source，sh script，./script
#### 善用判断式
##### 利用test指令的测试功能
##### 利用判断符号\[\]
##### Shell Scripts的默认变量（$0，$1...）
#### 条件判断式
##### 利用if...then
##### 利用case...esac判断
##### 利用function功能
#### 循环loop
##### while do done,util do done(不定循环)
##### for...do...done(固定循环)
##### for...do...done的数值处理
##### 搭配随机数与数组的实验
#### Shell Scripts的追踪与Debug
### 重点回顾
