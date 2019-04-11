---
title: Linux(1)-基本概念与帮助
date: 2019-03-18 20:36:08
tags:
- Linux
- linux
- CentOS
categoties: 拉普拉斯妖
copyright: GPL
---
#### Linux命令基本形式
```bash
jason@ThinkPad-X1-Carbon-6th:~$ command [-options] parameter1 parameter2 
                                命令    选项       参数1      参数2
```
#### 语系支持
```bash
$ locale
```
修改语系
```bash
$ LANG=en_US.utf8
$ export LC_ALL=en_US.utf8
# LANG只与输出信息有关,若要更改其他不同的信息,要同步更新LC_ALL
```
#### 基础命令的操作
```bash
$ date  //输出时间
$ cal   //日历
$ bc    //计算器
```
命令行模式的两种主要情况:
+ 一种是该命令会直接显示结果,然后回到命令提示字符等待下一个命令的输入
+ 一种是进入到该命令的环境,直到结束该命令才回到命令行界面的环境

#### 热键
##### [Tab]
+ [Tab][Tab]接在一串命令的第一个字段后面,则为[命令补全]
+ [Tab][Tab]接在一串命令的第二个字段后面,则为[文件补齐]
+ 若安装了`Bash-completion`,则在某些命令后可以使用[选项/参数补齐]

##### [Ctrl]-c按键
将正运行的命令中断
##### [Ctrl]-d按键
键盘输入结束(End Of File,EOF),可以取代`exit`的输入
##### [Shift]+{[Page Up]|[Page Down]}按键
命令行翻页
#### Linux帮助 `man page`和`info page`
##### Linux --help
```bash
$ command --help
```

##### man
man是manual(操作说明)的简写,文件一般储存在目录`/usr/share/man`下可以通过修改配置文件`/etc/man_db.conf`(或`man.conf`,`manpath.conf`,`man.config`),更多信息可以通过`man man`来查询。

man文档数字意义：

|代号|代表内容|
|:---:|:---:|
|1|*** 用户在shell环境中可以操作的命令或可执行文档 ***|
|2|系统内核可调用的函数与工具等|
|3|一些常用的函数（function）与函数库（library），大部分为c函数库（libc）|
|4|设备文件的说明，通常在/dev下的文件|
|5|*** 配置文件或是某些文件的格式***|
|6|游戏|
|7|惯例与协议等，例如Linux文件系统，网络协议，ASCII代码等的说明|
|8|***系统管理员可用的管理命令***|
|9|跟内核有关的文件|

man的常用按键：

|按键|进行工作|
|:---:|:--:|
|空格键|向下翻一页|
|[Page Down]|向下翻一页|
|[Page Up]|向上翻一页|
|[Home]|去到第一页|
|[End]|去到最后一页|
|/string|向下查找String这个字符串|
|?string|向上查找String这个字符串|
|n，N|在用‘/’和‘?’，向上或向下查询|
|q|结束man page|

```bash
$ man -f man //查找所有和man命令有关的文件
$ man 1 man //man(1)的文件说明
$ man 7 man //man(7)的文件说明
$ man -k man  //系统的说明文件内容中只要有man关键词就列出
```
man命令的简略写法:
```
$ whatis [命令或是文件] //相当于man -f
$ apropos [命令或是文件] //相当于man -k
```
使用简略命令,必须先建立`whatis`数据库
```bash
$ mandb
```
##### info page
Linux才有的产物,易读性增强,但查询文件必须以info page 的格式写成,文档存放于`/usr/share/info`,以非info page格式写成的文件,也可以通过info显示,不过结果与man相同。

info page 是将文件数据拆成一个一个的段落，每个段落用自己的页面来编写，并且在各个页面中还有类似网页的超连接来跳到各不同的页面中，每个独立的页面也称为一个节点（node）。

快捷键：

|按键|进行工作|
|:---:|:---:|
|空格键|向下翻一页|
|[Page Down]|向下翻一页|
|[Page Up]|向上翻一页|
|[Tab]|在节点之间移动，有节点的地方，通常会以\*显示|
|[Enter]|当光标在节点上面时，按下Enter可以进入该节点|
|b|移动光标到该info界面当中的第一处|
|e|移动光标到该info界面当中的最后一个节点处|
|n|前往下一个节点处|
|p|前往上一个节点处|
|u|向上移动一层|
|s（/）|在info page当中进行查找|
|h，？|显示帮助选项|
|q|结束这次的info page|
 
 #### 正确的关机方法
 Windows（非NT内核）系统中，由于是单人假多任务，即使计算机关机，对于别人因为不会用影响。但是在Linux下，每个程序都在后台执行，可能会有多个人同时在一台主机上工作，而且如果不正常关机，可能会造成文件系统的损毁。所以正常情况下，关机要注意一下几件事：
 + 观察系统的使用状态，使用`who`命令查看有谁在线，`netstat -a`查看网络的连接状态，`ps -aux`查看后台执行的程序。
 + 通知用户关机的时刻
 + 正确的关机命令的使用
  + 将数据同步写入磁盘`sync`
  + 常用的关机命令`shutdown`
  + 重新启动，关机`reboot`，`halt`，`poweroff`
 
 ###### shutdown命令的使用
 ```
 $ /sbin/shutdown [-krhc] [时间] [警告信息]
 选项与参数：
 -k ：不要真的关机，只是发送警告信息出去
 -r ：在将系统的服务器停掉之后就重新启动
 -h：将系统的服务停掉之后，立即关机
 -c：取消已经在进行的shutdown命令的内容
 时间 ：指定系统关机的时间，若没有则默认以分钟后自动进行
 ```
 ```
 $ halt //系统停止，屏幕可能会保留系统已经停止
 $ poweroff //系统关机，切断电力供应
 $ suspend //休眠模式
 ```
 运用管理工具`systemctl`关机，现在虽然任然可以使用`init 0`来关机，但是已经根运行级别无关了。