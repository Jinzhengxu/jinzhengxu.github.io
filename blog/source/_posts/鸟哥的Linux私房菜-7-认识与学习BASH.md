---
title: Linux(7)-认识与学习BASH
date: 2019-05-06 12:58:52
tags:
  - Linux
  - BASH
categories: 软件工具
copyright:
---
#### 认识 BASH 这个 Shell
##### 硬件、核心与shell
![EgZRIg.png](https://s2.ax1x.com/2019/05/09/EgZRIg.png)
```bash
用户：通过命令或图形界面操作系统
使用者界面：shell，application，KDE，接受来自使用者的指令，与核心进行沟通
核心kernel:内存管理，CPU进程管理等
硬件：CPU，内存，显卡等物理硬件bash
```
壳程序的功能只是提供用户操作系统的一个接口。也就是说,只要能够操作应用程序的接口都能够称为壳程序。所以图形接口也是属于shell的。
##### 为何要学文字接口的shell
+ 文字接口的shell在不同的distribution里操作基本一致。
+ 联机时文字接口的传输速度一定比较快, 而且,较不容易出现断线或者是信息外流的问题

##### 系统的合法shell与/etc/shells的区别
早期shell有各种版本，Bourne SHell (sh) 、在 Sun 里头预设的 CSHell、 商业上常用的 K SHell、, 还有 TCSH 等等。现在超女个用的是基于GNU架构下发展的Bourne Again SHell（bash）。

通过检查`/etc/shells`文件可以检查由多少个shell可用
```bash
$ cat /etc/shells
# /etc/shells: valid login shells
/bin/sh(已经被 /bin/bash 所取代)
/bin/bash(就是 Linux 预设的 shell)
/bin/rbash
/bin/dash
/usr/bin/tmux(我自己安装的课分栏的shell)
```
各家 shell 的功能都差不多,但是在某些语法的下达方面则有所不同， ***系统上合法的 shell 要写入 /etc/shells 这个文件*** ,系统某些服务在运作过程中,会去检查使用者能够使用的 shells ,而这些 shell 的查询就是藉由`/etc/shells` 这个文件。

使用者什么时候可以取得 shell 来工作？使用者预设会取得哪一个 shell ？登入的时候,系统就会分配一个 shell 让使用者来工作了。 而这个登入取得的 shell 就记录在`/etc/passwd` 这个文件内。
```bash
$ cat /etc/passwd
root:x:0:0:root:/root:/bin/bash
daemon:x:1:1:daemon:/usr/sbin:/usr/sbin/nologin
bin:x:2:2:bin:/bin:/usr/sbin/nologin
sys:x:3:3:sys:/dev:/usr/sbin/nologin
......
```
每一行的最后一个数据,就是使用者登入后可以取得的预设的 shell,root是 `/bin/bash` ,不过,系统账号 bin 与 daemon 等等,就使用 `/sbin/nologin`,某些 FTP 网站会去检查使用者的可用 shell ,而如果你不想要让这些用户使用 FTP 以外的主机资源时,可能会给予该使用者 `/sbin/nologin`,让使用者无法以其他服务登入主机。
##### Bash shell的功能
bash 主要的优点有底下几个:
```
命令编修能力 history
命令与文件补全功能　[Tab]
命令别名设定功能 alias
工作控制，前景背景控制　job control, foreground, background
程序化脚本　shell script
通配符　wildcard
```

###### 命令编修能力 history
 bash能记忆使用过的指令,记录在家目录内的 ｀.bash_history｀文件内， 不过,需要留意的是,｀~/.bash_history｀ 记录的是前一次登入以前所执行过的指令, 而至于这一次登入所执行的指令都被暂存在内存中,注销系统后,该指令记忆才会记录到 ｀.bash_history｀ 当中。
+ 命令与文件补全功能　[Tab]
 1)少打很多字; 2)确定输入的数据是正确的
+ 命令别名设定功能 alias
 在指令列输入 alias 就可以知道目前的命令别名，也可以直接下达命令来设定别名:

```bash
alias lm='ls -al'
```

+ 工作控制，前台后台控制　job control, foreground, background
工作控制(jobs)的用途更广, 可以随时将工作丢到后台中执行，而不怕不小心使用了
[Ctrl] + c 来停掉该程序。此外,也可以在单一登录的环境中,达到多任务的目的。
+ 程序化脚本　shell script
以后在供雷讲唔
+ 通配符　wildcard

##### 查询指令是否为Bash Shell的内建命令：type
利用 type 这个指令来观察指令是来自于外部指令(指的是其他非 bash 所提供的指令) 或是内建在 bash 当中的
```bash
$ type [-tpa] name
选项与参数:
:不加任何选项与参数时,type 会显示出 name 是外部指令还是 bash 内建指令
-t
:当加入 -t 参数时,type 会将 name 以底下这些字眼显示出他的意义:
file :表示为外部指令;
alias :表示该指令为命令别名所设定的名称;
builtin :表示该指令为 bash 内建的指令功能;
-p :如果后面接的 name 为外部指令时,才会显示完整文件名;
-a :会由 PATH 变量定义的路径中,将所有含 name 的指令都列出来,包含 alias
```
 type 也可以用来作为类似 which 指令的用途
##### 指令的下达与快速编辑按钮
利用『 \[Enter] 』来将 [Enter] 这个按键『跳脱!』开来,让 [Enter] 按键不再具有『开始执行』的功能!好让指令可以继续在下一行输入。需要特别留意, [Enter] 按键是紧接着反斜杠 (\) 的,两者中间没有其他字符。 因为 \ 仅跳过『紧接着的下一个字符』而已。

当所需要下达的命令特别长,或者是输入了一串错误的指令时,你快速的将这串指令
整个删除掉,可以使用其他的快速组合键。
常见的有底下这些:

| 组合键            | 功能与示范                                                   |
| ----------------- | ------------------------------------------------------------ |
| [ctrl]+u/[ctrl]+k | 分别是从光标处向前删除指令串 ([ctrl]+u) 及向后删除指令串 ([ctrl]+k)。 |
| [ctrl]+a/[ctrl]+e | 分别是让光标移动到整个指令串的最前面 ([ctrl]+a) 或最后面 ([ctrl]+e)。 |

在终端机 (tty) 上面登入后, Linux 就会依据 ``/etc/passwd` 文件的设定给我们一个 shell (预设是 bash),然后我们就可以依据上面的指令下达方式来操作 shell。

#### shell的变量功能
+ 变量的可变性与方便性

 [![EglPc4.md.png](https://s2.ax1x.com/2019/05/09/EglPc4.md.png)](https://imgchr.com/i/EglPc4)
 系统已经帮我们规划好 MAIL 这个变量,所以用户只要知道 mail 这个指令如何
使用即可, mail 会主动的取用 MAIL 这个变量,就能够如上图所示的取得自己的邮件信箱(注
意大小写,小写的 mail 是指令, 大写的 MAIL 则是变量名称。

+ 影响 bash 环境操作的变量
***在 Linux System 下面,所有的线程都是需要一个执行码***, 而就如同上
面提到的,你『真正以 shell 来跟 Linux 沟通,是在正确的登入 Linux 之后!』这个时候你就有一
个 bash 的执行程序,也才可以真正的经由 bash 来跟系统沟通。而在进入 shell 之前,也正如同上面提到的,由于系统需要一些变量来提供他数据的存取 (或者是一些环境的设定参数值, 例如是
否要显示彩色等等的) ,所以就有一些所谓的『环境变量』 需要来读入系统中，这些环境变量例
如 PATH、HOME、MAIL、SHELL 等等,都是很重要的, 为了区别与自定义变量的不同,环境变
量通常以大写字符来表示。
+ 脚本程序设计 (shell script) 的好帮手
##### 什么是变量？
变量就是以一组文字或符号等,来取代一些设定或者是一串保留的数据
##### 变量的取用与设定：echo，变量设置规则，unset
变量在被取用时,前面必须要加上『 $ 』才行
```bash
$ echo $variable
$ echo $PATH
/usr/local/bin:/usr/bin:/usr/local/sbin:/usr/sbin:/home/dmtsai/.local/bin:/home/dmtsai/bin
$ echo ${PATH}
$ echo ${HOME} #显示出您的环境变量 HOME
$ echo ${MAIL} #显示出您的环境变量 MAIL
$ echo ${myname}
       #没有任何数据～因为这个变量尚未被设定
       #每一种 shell 的语法都不相同~在变量的使用上,bash 在你没有设定的变量中强迫去
       #echo 时,它会显示出空的值。 在其他某些 shell 中,随便去 echo 一个不存在的变
       #量,它是会出现错误讯息
$ myname=Jason
$ echo ${myname}
Jason　#变量设置完成
```
变量的设定规则：
+ 变量与变量内容以一个等号『=』来连结

+ 等号两边不能直接接空格符

+ 变量名称只能是英文字母与数字,但是开头字符不能是数字

+ 变量内容若有空格符可使用双引号『"』或单引号『'』将变量内容结合起来
  + 双引号内的特殊字符如 $ 等,可以保有原本的特性
  + 单引号内的特殊字符则仅为一般字符 (纯文本)
  
+ 可用『 \ 』将特殊符号(如 [Enter], $, \, 空格符, '等)变成一般字符

+ 在一串指令的执行中,还需要藉由其他额外的指令所提供的信息时,可以使用反单引号『`命令`』或 『$(命令)』

+ 若该变量为扩增变量内容时,则可用 "$变量名称" 或 ${变量} 累加内容

+ 若该变量需要在其他子程序执行,则需要以 export 来使变量变成环境变量:『export PATH』

+ 通常大写字符为系统默认变量,自行设定变量可以使用小写字符,方便判断

+ 取消变量的方法为使用 unset :『unset 变量名称』

  ```bash
  $ name=Jason
  $ echo ${name}
  Jason
  $ bash  #进入到子程序
  $ echo ${name}
          #并没有刚刚设定的内容
  $ exit  #子程序:离开这个子程序
  $ export name
  $ bash
  $ echo ${name}
  Jason
  #在一般的状态下,父程序的自定义变量是无法在子程序内使用的。但是透过export将变量变成环境变量后,就能够在子程序底下应用了
  
  $ cd /lib/modules/`uname -r`/kernel
  # 进入到目前核心的模块目录
  $ ls -ld $(locate crontab)
  # 先以 locate 将文件名数据都列出来,再以 ls 指令来处理的意思
  $ work="/cluster/server/work/taiwan_2015/003/"
  $ cd $work
  # 使用其他目录作为我的模式工作目录时,只要变更 work 这个变数
  ```

  



##### 环境变量的功能
###### 用 env 观察环境变量与常见环境变量说明
```bash
# 列出目前的 shell 环境下的所有环境变量与其内容
$ env
HOSTNAME=study.centos.vbird # 这部主机的主机名
TERM=xterm # 这个终端机使用的环境是什么类型
SHELL=/bin/bash # 目前这个环境下,使用的 Shell 是哪一个程序?
HISTSIZE=1000 # 『记录指令的笔数』在 CentOS 默认可记录 1000 笔
OLDPWD=/home/dmtsai # 上一个工作目录的所在
LC_ALL=en_US.utf8 # 由于语系的关系,鸟哥偷偷丢上来的一个设定
USER=dmtsai # 使用者的名称啊!
LS_COLORS=rs=0:di=01;34:ln=01;36:mh=00:pi=40;33:so=01;35:do=01;35:bd=40;33;01:cd=40;33;01:
or=40;31;01:mi=01;05;37;41:su=37;41:sg=30;43:ca=30;41:tw=30;42:ow=34;42:st=37;44:ex=01;32:
*.tar=01... # 一些颜色显示
MAIL=/var/spool/mail/dmtsai # 这个用户所取用的 mailbox 位置
PATH=/usr/local/bin:/usr/bin:/usr/local/sbin:/usr/sbin:/home/dmtsai/.local/bin:/home/dmtsai/bin
PWD=/home/dmtsai # 目前用户所在的工作目录 (利用 pwd 取出!)
LANG=zh_TW.UTF-8 # 这个与语系有关,底下会再介绍!
HOME=/home/dmtsai # 这个用户的家目录啊!
LOGNAME=dmtsai # 登入者用来登入的账号名称
_=/usr/bin/env # 上一次使用的指令的最后一个参数(或指令本身)
```
+ HOME：代表用户的家目录。
+ SHELL：目前这个环境使用的 SHELL 是哪个程序
+ HISTSIZE： 历史记录的『笔数』
+ MAIL：使用 mail 这个指令在收信时,系统会去读取的邮件信箱文件 (mailbox)
+ PATH:执行文件搜寻的路径
+ LANG:语系数据
+ RANDOM:可以透过这个随机数文件相关的变量 ($RANDOM) 来随机取得随机数值喔。
在 BASH 的环境下,这个 RANDOM 变量的内容,介于 0~32767 之间.
```bash
$ declare -i number=$RANDOM*10/32678;\
> echo ${number}
2
```
###### 用 set 观察所有变量 (含环境变量与自定义变量)
```bash
$ set
BASH=/bin/bash # bash 的主程序放置路径
BASH_VERSINFO=([0]="4" [1]="2" [2]="46" [3]="1" [4]="release" [5]="x86_64-redhat-linux-gnu")
BASH_VERSION='4.2.46(1)-release' # 这两行是 bash 的版本啊!
COLUMNS=90 # 在目前的终端机环境下,使用的字段有几个字符长度
HISTFILE=/home/dmtsai/.bash_history # 历史命令记录的放置文件,隐藏档
HISTFILESIZE=1000 # 存起来(与上个变量有关)的文件之指令的最大纪录笔数。
HISTSIZE=1000 # 目前环境下,内存中记录的历史命令最大笔数。
IFS=$' \t\n' # 预设的分隔符
LINES=20 # 目前的终端机下的最大行数
MACHTYPE=x86_64-redhat-linux-gnu # 安装的机器类型
OSTYPE=linux-gnu # 操作系统的类型!
PS1='[\u@\h \W]\$ ' # PS1 就厉害了。这个是命令提示字符,也就是我们常见的[root@www ~] 或 [dmtsai ~]$ 的设定值啦!可以更动的!
PS2='> ' # 如果你使用跳脱符号 (\) 第二行以后的提示字符也
$ # 目前这个 shell 所使用的 PID
? # 刚刚执行完指令的回传值。
```

***基本上,在 Linux 预设的情况中,使用{大写的字母}来设定的变量
一般为系统内定需要的变量***

比较重要的几个变量：
###### PS1:(提示字符的设定)

PS1 就是命令提示字符,每次按下 [Enter] 按键去执行某个指令后,最后要再次出现提示字符时, 就会主动去读取这个变数值了。每个 distributions 的bash 默认的 PS1 变量内容可能有些许的差异.
```bash
 \d :可显示出『星期 月 日』的日期格式,如:"Mon Feb 2"
 \H :完整的主机名。举例来说,鸟哥的练习机为『study.centos.vbird』
 \h :仅取主机名在第一个小数点之前的名字,如鸟哥主机则为『study』后面省略
 \t :显示时间,为 24 小时格式的『HH:MM:SS』
 \T :显示时间,为 12 小时格式的『HH:MM:SS』
 \A :显示时间,为 24 小时格式的『HH:MM』
 \@ :显示时间,为 12 小时格式的『am/pm』样式
 \u :目前使用者的账号名称,如『dmtsai』
 \v :BASH 的版本信息,如鸟哥的测试主机版本为 4.2.46(1)-release,仅取『4.2』显示
 \w :完整的工作目录名称,由根目录写起的目录名称。但家目录会以 ~ 取代;
 \W :利用 basename 函数取得工作目录名称,所以仅会列出最后一个目录名。
 \# :下达的第几个指令。
 \$ :提示字符,如果是 root 时,提示字符为 # ,否则就是 $ 啰~
```
###### $:(关于本 shell 的 PID)

代表的是『目前这个 Shell 的线程代号』,亦即是所谓的 PID(Process ID)。
```bash
$ echo $$ #shell 的 PID
```
###### ?:(关于上个执行指令的回传值)

? 代表『上一个执行的指令所回传的值』,当我们执行某些指令时, 这些指令都会回传一个执行后的代码。一般来说,如果成功的执行该指令,则会回传一个 0 值，如果执行过程发生错误,就会回传『错误代码』
```bash
$ echo $SHELL
/bin/bash  #Linux 预设使用 /bin/bash
$ echo $?
0          #因为没问题,所以回传值为 0
$ 12name=Jaosn
12name=Jaosn: command not found #发生错误，bash 回报有问题
$ echo $?
127 #错误代码回传值依据软件而有不同,可以利用这个代码来搜寻错误的原因
$ echo $?
0
```
+ OSTYPE, HOSTTYPE, MACHTYPE:(主机硬件与核心的等级)

###### export: 自定义变量转成环境变量
***子程序仅会继承父程序的环境变量, 子程序不会继承父程序的自定义变量***。
想要让该变量内容继续的在子程序中使用,那么就请执行:
```bash
$ export 变量名称
# 分享自己的变量设定给后来呼叫的文件或其他程序
```

##### 影响显示结果的语系变量（locale）
```bash
$ locale -a #当前系统支持了多少的语系
$ locale
LANG=en_US.UTF-8   #主语言的环境
LANGUAGE=
LC_CTYPE="en_US.UTF-8" #字符(文字)辨识的编码
LC_NUMERIC=zh_CN.UTF-8 #数字系统的显示讯息
LC_TIME=zh_CN.UTF-8 #时间系统的显示数据
LC_COLLATE="en_US.UTF-8" #字符串的比较与排序等
LC_MONETARY=zh_CN.UTF-8 #币值格式的显示等
LC_MESSAGES="en_US.UTF-8" #讯息显示的内容,如菜单、错误讯息等
LC_PAPER=zh_CN.UTF-8
LC_NAME=zh_CN.UTF-8
LC_ADDRESS=zh_CN.UTF-8
LC_TELEPHONE=zh_CN.UTF-8
LC_MEASUREMENT=zh_CN.UTF-8
LC_IDENTIFICATION=zh_CN.UTF-8
LC_ALL= #整体语系的环境
```
***如果其他的语系变量都未设定, 且你有设定 LANG 或者是 LC_ALL 时,则其他的语系变量就会被这两个变量所取代***

##### 变量的有效范围
+ 环境变量=全局变量
+ 自定义变数=局部变量
```bash
1.当启动一个 shell,操作系统会分配一记忆区块给 shell 使用,此内存内之变量可让子程序取用
2.若在父程序利用 export 功能,可以让自定义变量的内容写到上述的记忆区块当中(环境变量);
3.当加载另一个 shell 时 (亦即启动子程序,而离开原本的父程序了),子 shell 可以将父
  shell 的环境变量所在的记忆区块导入自己的环境变量区块当中。
```
这里需要注意的是 ***『环境变量』与『bash 的操作环境』*** 意思不太一样,举例来说, PS1 并不是环境变量。
##### 变量键盘读取、数组与宣告read，array，declare
+ read

  ```bash
  $ read [-pt] variable
  选项与参数:
  -p :后面接提示字符
  -t :后面接等待的『秒数』
  $ read atest
  This is a test  # 此时光标会等待输入
  $ echo ${atest}
  This is a test # 刚刚输入的数据已经变成一个变量内容
  
  $ read -p "Please keyin your name: " -t 30 named
  Please keyin your name: Jason # 提示字符
  $ echo ${named}
  Jason #输入的数据又变成一个变量的内容了!
  ```

  
+ array

  ```bash
  $ declare -a var
  $ var[1]="sdf"
  $ var[2]="sdfsd"
  $ echo "${var[1]},${var[2]}"
  sdf,sdfsd
  + declare/typeset
  declare 或 typeset 是一样的功能,就是在『宣告变量的类型』。
  ​```bash
  $ declare [-aixr] variable
  选项与参数:
  -a :将后面名为 variable 的变量定义成为数组 (array) 类型
  -i :将后面名为 variable 的变量定义成为整数数字 (integer) 类型
  -x :用法与 export 一样,就是将后面的 variable 变成环境变量;
  -r :将变量设定成为 readonly 类型,该变量不可被更改内容,也不能 unset
  $ sum=100+300+50
  $ echo ${sum}
  100+300+50 #没有计算加总，因为这是文字型态的变量属性
  $ declare -i sum=100+300+50
  $ echo ${sum}
  450
  $ declare -x sum
  $ export | grep sum
  declare -ix sum="450" #将 sum 变成环境变量
  $ declare -r sum
  $ sum=tesgting
  -bash: sum: readonly variable #sum 变成只读属性,不可更动
  $ declare +x sum # 将 - 变成 + 可以进行『取消』动作
  $ declare -p sum #-p 可以单独列出变量的类型
  declare -ir sum="450" #只剩下 i, r 的类型,不具有 x
  ```

  
##### 与文件系统及程序的限制关系：ulimit
bash 是可以『限制用户的某些系统资源』的,包括可以开启的文件数量, 可以使用的 CPU 时间,可以使用的内存总量等等。

```bash
$ ulimit [-SHacdfltu] [配额]
选项与参数:
-H :hard limit ,严格的设定,必定不能超过这个设定的数值;
-S :soft limit ,警告的设定,可以超过这个设定值,但是若超过则有警告讯息。
在设定上,通常 soft 会比 hard 小,举例来说,soft 可设定为 80 而 hard
设定为 100,那么你可以使用到 90 (因为没有超过 100),但介于 80~100 之间时,
系统会有警告讯息通知你!
-a :后面不接任何选项与参数,可列出所有的限制额度;
-c :当某些程序发生错误时,系统可能会将该程序在内存中的信息写成文件(除错用),
这种文件就被称为核心文件(core file)。此为限制每个核心文件的最大容量。
-f :此 shell 可以建立的最大文件容量(一般可能设定为 2GB)单位为 Kbytes
-d :程序可使用的最大断裂内存(segment)容量;
-l :可用于锁定 (lock) 的内存量
-t :可使用的最大 CPU 时间 (单位为秒)
-u :单一用户可以使用的最大进程(process)数量。
$ ulimit -a
core file size          (blocks, -c) 0
data seg size           (kbytes, -d) unlimited
scheduling priority             (-e) 0
file size               (blocks, -f) unlimited
pending signals                 (-i) 62599
max locked memory       (kbytes, -l) 16384
max memory size         (kbytes, -m) unlimited
open files                      (-n) 1024
pipe size            (512 bytes, -p) 8
POSIX message queues     (bytes, -q) 819200
real-time priority              (-r) 0
stack size              (kbytes, -s) 8192
cpu time               (seconds, -t) unlimited
max user processes              (-u) 62599
virtual memory          (kbytes, -v) unlimited
file locks                      (-x) unlimited
$ ulimit -f 10240 #限制用户仅能建立 10MBytes 以下的容量的文件
```
##### 变量内容的删除，取代与替换Optional
+ 变量内容的删除与取代

  ```bash
  $ path=${PATH}
  $ echo ${path}
  /usr/local/bin:/usr/bin:/usr/local/sbin:/usr/sbin:/home/dmtsai/.local/bin:/home/dmtsai/bin
  $ echo ${path#/*local/bin:} #删除目录
  
  ${variable#/*local/bin:}
  上面的特殊字体部分是关键词!用在这种删除模式所必须存在的
  ${variable#/*local/bin:}
  这就是原本的变量名称,以上面范例二来说,这里就填写 path 这个『变量名称』啦!
  ${variable#/*local/bin:}
  这是重点!代表『从变量内容的最前面开始向右删除』,且仅删除最短的那个
  ${variable#/*local/bin:}
  代表要被删除的部分,由于 # 代表由前面开始删除,所以这里便由开始的 / 写起。
  需要注意的是,我们还可以透过通配符 * 来取代 0 到无穷多个任意字符
  $ echo ${path##/*:}
  /home/dmtsai/bin
  # 变成 ## 之后『删除掉最长的那个数据』
  $ echo ${path%:*bin}
  /usr/local/bin:/usr/bin:/usr/local/sbin:/usr/sbin:/home/dmtsai/.local/bin
  # 这个 % 符号代表由最后面开始向前删除!
  $ echo ${path%%:*bin}
  /usr/local/bin
  # 同样的, %% 代表的则是最长的符合字符串
  $ echo ${path/sbin/SBIN} #将 path 的变量内容内的 sbin 取代成大写 SBIN
  $ echo ${path//sbin/SBIN} #如果是两条斜线,那么就变成所有符合的内容都会被取代喔
  ```

  
| 变量设定方式 | 说明 |
| ------------ | ---- |
| ${变量#关键词} |若变量内容从头开始的数据符合『关键词』,则将符合的最短数据删除|
| ${变量##关键词} | 若变量内容从头开始的数据符合『关键词』,则将符合的最长数据删除|
| ${变量%关键词} |若变量内容从尾向前的数据符合『关键词』,则将符合的最短数据删除|
| ${变量%%关键词} | 若变量内容从尾向前的数据符合『关键词』,则将符合的最长数据删除|
| ${变量/旧字符串/新字符串} |若变量内容符合『旧字符串』则『第一个旧字符串会被新字符串|
| ${变量//旧字符串/新字符串} |若变量内容符合『旧字取代』若变量内容符合『旧字符串』则『全部的旧字符串会被新字符串取代』|

+ 变量的测试与内容替换
```bash
new_var=${old_var-content}
新的变量,主要用来取代旧变量。新旧变量名称其实常常是一样的
new_var=${old_var-content}这是本范例中的关键词部分!必须要存在的哩!
new_var=${old_var-content}
旧的变量,被测试的项目!
new_var=${old_var-content}
变量的『内容』,在本范例中,这个部分是在『给予未设定变量的内容』
```

| 变量设定方式 | str 没有设定 | str 为空字符串 | str 已设定非为空字符串 |
| ------------ | ------------ | -------------- | ---------------------- |
| var=${str-expr} | var=expr | var= | var=str |
| var=${str:-expr} | var=expr | var=expr |  var=str |
| var=${str+expr} | var= | var=expr | var=expr |
| var=${str:+expr} | var= | var= | var=expr |
| var=${str=expr} | str=expr var=expr |str 不变 var= |str 不变 var=str|
| var=${str:=expr} | str=expr var=expr | str=expr var=expr |str 不变 var=str|
| var=${str?expr} | expr 输出至 stderr | var= | var=str |
| var=${str:?expr} | expr 输出至 stderr | expr 输出至 stderr | var=str |


#### 变量别名与历史命令
##### 命令别名设定: alias, unalias
```bash
$ alias lm='ls -al | more'
```
alias 的定义规则与变量定义规则几乎相同』, 所以只要在 alias 后面加上{『别名』='指令 选项...' }

##### 历史命令:history
```bash
$ history [n]
$ history [-c]
$ history [-raw] histfiles
选项与参数:
 n :数字,意思是『要列出最近的 n 笔命令行表』的意思!
-c :将目前的 shell 中的所有 history 内容全部消除
-a :将目前新增的 history 指令新增入 histfiles 中,若没有加 histfiles ,
则预设写入 ~/.bash_history
-r :将 histfiles 的内容读到目前这个 shell 的 history 记忆中;
-w :将目前的 history 记忆内容写入 histfiles 中!

$ !number
$ !command
$ !!
选项与参数:
number:执行第几笔指令的意思;
command :由最近的指令向前搜寻『指令串开头为 command』的那个指令,并执行;
!! :就是执行上一个指令(相当于按↑按键后,按 Enter)
```
+ 同一账号同时多次登入的 history 写入问题

bash 在同时以 root 的身份登入, 因此所有的 bash 都有自己的 1000 笔记录在内存中。因为等到注销时才会更新记录文件,所以啰, 最后注销的那个 bash 才会是最后写入的数据。

#### Bash Shell 的操作环境
##### 路径与指令搜寻顺序
指令运作的顺序可以这样看:
```bash
1. 以相对/绝对路径执行指令,例如『 /bin/ls 』或『 ./ls 』;
2. 由 alias 找到该指令来执行;
3. 由 bash 内建的 (builtin) 指令来执行;
4. 透过 $PATH 这个变量的顺序搜寻到的第一个指令来执行。
```
/bin/ls 及单纯的 ls 看看,会发现使用 ls 有颜色但是 /bin/ls 则没有颜色。 因为 /bin/ls 是直接取用该指令来下达,而 ls 会因为『 alias ls='ls --color=auto' 』这个命令别名而先使用 。
```bash
$ alias echo='echo -n'
$ type -a echo
echo is aliased to 'echo -n'
echo is a shell builtin
echo is /usr/bin/echo
```

##### bash 的进站与欢迎讯息: /etc/issue, /etc/motd
```bash
$ cat /etc/issue
Ubuntu 18.04.1 LTS \n \l
```
| issue 内的各代码意义                         |
| -------------------------------------------- |
| \d 本地端时间的日期;                         |
| \l  显示第几个终端机接口;                    |
| \m  显示硬件的等级 (i386/i486/i586/i686...); |
| \n  显示主机的网络名称;                      |
| \O  显示 domain name;                        |
| \r  操作系统的版本 (相当于 uname -r)         |
| \t  显示本地端时间的时间;                    |
| \S  操作系统的名称;                          |
| \v  操作系统的版本。                         |

当我们使用 telnet 连接到主机时,主机的登入画面就会显示 /etc/issue.net 而不是/etc/issue

要让使用者登入后取得一些讯息,例如您想要让大家都知道的讯息, 那么可以将讯息加入 /etc/motd 里面
##### bash 的环境配置文件
+ login 与 non-login shell
  + login shell:取得 bash 时需要完整的登入流程的,就称为 login shell。举例来说,你要由 tty1 ~ tty6 登入,需要输入用户的账号与密码,此时取得的 bash 就称为『 login shell 』;
  + non-login shell:取得 bash 接口的方法不需要重复登入的举动,举例来说,
    + (1)你以 X window 登入 Linux 后,再以 X 的图形化接口启动终端机,此时那个终端接口并没有需要再次的输入账号与密码,那个 bash 的环境就称为 non-login shell 了。
    + (2)你在原本的 bash 环境下再次下达 bash 这个指令,同样的也没有输入账号密码, 那第二个 bash (子程序) 也是 non-login shell 。

login shell 其实只会读取这两个配置文件:
```bash
1. /etc/profile:这是系统整体的设定,你最好不要修改这个文件;
2. ~/.bash_profile 或 ~/.bash_login 或 ~/.profile:属于使用者个人设定,你要改自的数据,就写入这里!
```

###### /etc/profile (login shell 才会读)
***每个使用者登入取得 bash 时一定会读取的配置文件***
```bash
PATH:会依据 UID 决定 PATH 变量要不要含有 sbin 的系统指令目录;
MAIL:依据账号设定好使用者的 mailbox 到 /var/spool/mail/账号名;
USER:根据用户的账号设定此一变量内容;
HOSTNAME:依据主机的 hostname 指令决定此一变量内容;
HISTSIZE:历史命令记录笔数。CentOS 7.x 设定为 1000 ;
umask:包括 root 默认为 022 而一般用户为 002 等!
```
/etc/profile 可不止会做这些事而已,他还会去呼叫外部的设定数据：
```bash
/etc/profile.d/*sh:只要在 /etc/profile.d/ 这个目录内且扩展名为 .sh ,另外,使用者
                   能够具有 r 的权限, 那么该文件就会被 /etc/profile 呼叫进来。在 CentOS 7.x 中,这个目录底
                   下的文件规范了 bash 操作接口的颜色、 语系、ll 与 ls 指令的命令别名、vi 的命令别名、which
                   的命令别名等等
/etc/locale.conf:由 /etc/profile.d/lang.sh 呼叫进来的!这也是我们决定 bash 预设使用何种语系的重要配置文件!
/usr/share/bash-completion/completions/*:命令补齐、档名补齐之外,还可以进行指令的选项/参数
                                         补齐功能!那就是从这个目录里面找到相对应的指令来处理的

# bash 的 login shell 情况下所读取的整体环境配置文件其实只有 /etc/profile
```

###### ~/.bash_profile (login shell 才会读)

login shell 的 bash 环境中,所读取的个人偏好配置文件其实主要有三个,依序分别是:
```bash
1. ~/.bash_profile
2. ~/.bash_login
3. ~/.profile
```
***bash 的 login shell 设定只会读取上面三个文件的其中一个, 而读取的顺序则是依照上面的顺序。***

###### source :读入环境配置文件的指令
```bash
$ source 配置文件档名
范例:将家目录的 ~/.bashrc 的设定读入目前的 bash 环境中
$ source ~/.bashrc
$. ~/.bashrc
```
+ ~/.bashrc (non-login shell 会读)

取得 non-login shell 时,该 bash 配置文件仅会读取 ~/.bashrc


###### 其他相关配置文件
```bash
/etc/man_db.conf：规范了使用 man 的时候, man page 的路径到哪里去寻找!
~/.bash_history
~/.bash_logout：当我注销 bash 后,系统再帮我做完什么动作后才离开
```
[![EoltnP.md.png](https://s2.ax1x.com/2019/05/14/EoltnP.md.png)](https://imgchr.com/i/EoltnP)
##### 终端机的环境设定: stty, set
查阅目前的一些按键内容
```bash
$ stty [-a]
选项与参数:
-a :将目前所有的 stty 参数列出来;

stty -a
speed 38400 baud; rows 24; columns 80; line = 0;
intr = ^C; quit = ^\; erase = ^?; kill = ^U; eof = ^D; eol = <undef>;
eol2 = <undef>; swtch = <undef>; start = ^Q; stop = ^S; susp = ^Z; rprnt = ^R;
werase = ^W; lnext = ^V; discard = ^O; min = 1; time = 0;
-parenb -parodd -cmspar cs8 -hupcl -cstopb cread -clocal -crtscts
-ignbrk -brkint -ignpar -parmrk -inpck -istrip -inlcr -igncr icrnl ixon -ixoff
-iuclc -ixany -imaxbel iutf8
opost -olcuc -ocrnl onlcr -onocr -onlret -ofill -ofdel nl0 cr0 tab0 bs0 vt0 ff0
isig icanon iexten echo echoe echok -echonl -noflsh -xcase -tostop -echoprt
echoctl echoke -flusho -extproc

$ stty erase ^h #用 [ctrl]+h 来进行字符的删除
intr : 送出一个 interrupt (中断) 的讯号给目前正在 run 的程序 (就是终止啰!);
quit : 送出一个 quit 的讯号给目前正在 run 的程序;
erase : 向后删除字符,
kill : 删除在目前指令列上的所有文字;
eof: End of file 的意思,代表『结束输入』
start : 在某个程序停止后,重新启动他的 output
stop : 停止目前屏幕的输出;
susp : 送出一个 terminal stop 的讯号给正在 run 的程序。
```

set以设定整个指令输出/输入的环境。 例如记录历史命令、显示错误内容等等。
```bash
$ set [-uvCHhmBx]
选项与参数:
-u :预设不启用。若启用后,当使用未设定变量时,会显示错误讯息;
-v :预设不启用。若启用后,在讯息被输出前,会先显示讯息的原始内容;
-x :预设不启用。若启用后,在指令被执行前,会显示指令内容(前面有 ++ 符号)
-h :预设启用。与历史命令有关;
-H :预设启用。与历史命令有关;-m :预设启用。与工作管理有关;
-B :预设启用。与刮号 [] 的作用有关;
-C :预设不启用。若使用 > 等,则若文件存在时,该文件不会被覆盖。

$ echo $- #显示目前所有的 set 设定值
himBHs
```

| 组合按键 | 执行结果                                           |
| -------- | -------------------------------------------------- |
| Ctrl + C | 终止目前的命令                                     |
| Ctrl + D | 输入结束 (EOF),例如邮件结束的时候;                 |
| Ctrl + M | 就是 Enter 啦!                                     |
| Ctrl + S | 暂停屏幕的输出                                     |
| Ctrl + Q | 恢复屏幕的输出Ctrl + U 在提示字符下,将整列命令删除 |
| Ctrl + Z | 『暂停』目前的命令                                 |

##### 通配符与特殊符号

| 符号  | 意义                                                                                                                               |
| ----- | ---------------------------------------------------------------------------------------------------------------------------------- |
| *     | 代表『 0 个到无穷多个』任意字符                                                                                                    |
| ?     | 代表『一定有一个』任意字符                                                                                                         |
| [ ]   | 同样代表『一定有一个在括号内』的字符(非任意字符)。例如 [abcd] 代表『一定有一个字符, 可能是 a, b,c, d 这四个任何一个』              |
| [ - ] | 若有减号在中括号内时,代表『在编码顺序内的所有字符』。例如 [0-9] 代表 0 到 9 之间的所有数字,因为数字的语系编码是连续的!             |
| [^ ]  | 若中括号内的第一个字符为指数符号 (^) ,那表示『反向选择』,例如 [^abc] 代表 一定有一个字符,只要是非 a, b, c 的其他字符就接受的意思。 |

| 符号  | 内容                                                              |
| ----- | ----------------------------------------------------------------- |
| #     | 批注符号:这个最常被使用在 script 当中,视为说明!在后的数据均不执行 |
| \     | 跳脱符号:将『特殊字符或通配符』还原成一般字符                     |
| \|    | 管线 (pipe):分隔两个管线命令的界定(后两节介绍);                   |
| ;     | 连续指令下达分隔符:连续性命令的界定 (注意!与管线命令并不相同)     |
| ~     | 用户的家目录                                                      |
| $     | 取用变数前导符:亦即是变量之前需要加的变量取代值                   |
| &     | 工作控制 (job control):将指令变成背景下工作                       |
| !     | 逻辑运算意义上的『非』 not 的意思!                                |
| /     | 目录符号:路径分隔的符号                                           |
| >, >> | 数据流重定向:输出定向,分别是『取代』与『累加』                    |
| <, << | 数据流重定向:输入定向 (这两个留待下节介绍)                        |
| ' '   | 单引号,不具有变量置换的功能 ($ 变为纯文本)                        |
| " "   | 具有变量置换的功能! ($ 可保留相关功能)                            |
| ` `   | 两个『 ` 』中间为可以先执行的指令,亦可使用 $( )                   |
| ( )   | 在中间为子 shell 的起始与结束                                     |
| { }   | 在中间为命令区块的组合!                                           |
#### 数据流重定向
redirec,据流重导向就是将某个指令执行后应该要出现在屏幕上的数据, 给他传输到其他的地方,
例如文件或者是装置 (例如打印机)。
##### 什么是数据流重定向
[![Eol81A.md.png](https://s2.ax1x.com/2019/05/14/Eol81A.md.png)](https://imgchr.com/i/Eol81A)
###### standard output 与 standard error output

***标准输出指的是『指令执行所回传的正确的讯息』,而标准错误输出可理解为『 指令执行失败后,所回传的错误讯息』***

```bash
$ ll / #此时屏幕会显示出文件名信息
$ ll / > ~/rootfile #屏幕并无任何信息
$ ll ~/rootfile
-rw-r--r-- 1 jason jason 2058 5月  14 16:10 /home/jason/rootfile
# 1. 该文件 (本例中是 ~/rootfile) 若不存在,系统会自动的将他建立起来,但是
# 2. 当这个文件存在的时候,那么系统就会先将这个文件内容清空,然后再将数据写入!
# 3. 也就是若以 > 输出到一个已存在的文件中,那个文件就会被覆盖掉啰!

#那如果我想要将数据累加而不想要将旧的数据删除,那该如何是好?利用两个大于的符号 (>>) 就好
#啦!以上面的范例来说,你应该要改成『 ll / >> ~/rootfile 』即可。 如此一来,当 (1) ~/#rootfile 不存在时系统会主动建立这个文件;(2)若该文件已存在, 则数据会在该文件的最下方累加进去!

# 1> :以覆盖的方法将『正确的数据』输出到指定的文件或装置上;
# 1>>:以累加的方法将『正确的数据』输出到指定的文件或装置上;
# 2> :以覆盖的方法将『错误的数据』输出到指定的文件或装置上;
# 2>>:以累加的方法将『错误的数据』输出到指定的文件或装置上;
```
###### /dev/null 垃圾桶黑洞装置与特殊写法

dev/null 可以吃掉任何导向这个装置的信息
```bash
$ find /home -name .bashrc 2> /dev/null
/home/dmtsai/.bashrc #只有 stdout 会显示到屏幕上, stderr 被丢弃了

$ find /home -name .bashrc > list 2> list <==错误
#由于两股数据同时写入一个文件,又没有使用特殊的语法, 此时两
#股数据可能会交叉写入该文件内,造成次序的错乱。
$ find /home -name .bashrc > list 2>&1 <==正确
$ find /home -name .bashrc &> list <==正确
# 将指令的数据全部写入名为 list 的文件中
```
###### standard input : < 与 <<

将原本需要由键盘输入的数据,改由文件内容来取代
```bash
#利用 cat 指令来建立一个文件的简单流程
$ cat > catfile
testing
cat file test
<==这里按下 [ctrl]+d 来离开
# 由于加入 > 在 cat 后,所以那个 catfile 会被主动的建立,
# 而内容就是刚刚键盘上面输入的那两行数据了

#用 stdin 取代键盘的输入以建立新文件的简单流程
$ cat > catfile < ~/.bashrc
$ ll catfile ~/.bashrc
-rw-r--r-- 1 jason jason 4958 5月  14 16:34 catfile
-rw-r--r-- 1 jason jason 4958 5月  14 15:25 /home/jason/.bashrc

#<<代表的是『结束的输入字符』的意思
$ cat > catfile << "eof"
> This is a test.
> OK now stop
> eof
<==输入这关键词,立刻就结束而不需要输入 [ctrl]+d
[dmtsai@study ~]$ cat catfile
This is a test.
OK now stop
<==只有这两行,不会存在关键词那一行!
```

##### 命令执行的判断依据: ;  &&  ||
+ cmd ; cmd (不考虑指令相关性的连续指令下达)
 在指令与指令中间利用分号 (;) 来隔开,这样一来,分号前的指令执行完后就会立刻接着执行后面的指令了。
+ $? (指令回传值) 与 && 或 ||

两个指令之间有相依性,而这个相依性主要判断的地方就在于前一个指令执行的结果是否正确。***若前一个指令执行的结果为正确,在 Linux 底下会回传一个 $? = 0 的值***

| 指令下达情况   | 说明                                                                                                     |
| -------------- | -------------------------------------------------------------------------------------------------------- |
| cmd1 && cmd2   | 1. 若 cmd1 执行完毕且正确执行($?=0),则开始执行 cmd2。2. 若 cmd1 执行完毕且为错误 ($?≠0),则 cmd2 不执行。 |
| cmd1 \|\| cmd2 | 1. 若 cmd1 执行完毕且正确执行($?=0),则 cmd2 不执行。2. 若 cmd1 执行完毕且为错误 ($?≠0),则开始执行 cmd2。 |

***Linux 底下的指令都是由左往右执行的*** 由于指令是一个接着一个去执行的,因此,如果真要使用判断,那么这个 && 与 || 的顺序就不能搞错。
#### 管线命令pipe
管线命令『 | 』仅能处理经由前面一个指令传来的正确信息,也就是 standard output 的信息,对于stdandard error 并没有直接处理的能力。
[![EollfH.md.png](https://s2.ax1x.com/2019/05/14/EollfH.md.png)](https://imgchr.com/i/EollfH)
```bash
1.管线命令仅会处理 standard output,对于 standard error output 会予以忽略
2.管线命令必须要能够接受来自前一个指令的数据成为 standard input 继续处理才行
```

##### 选取命令cut，grep
```bash
$ cut -d'分隔字符' -f fields <==用于有特定分隔字符
$ cut -c 字符区间 <==用于排列整齐的讯息
选项与参数:
-d :后面接分隔字符。与 -f 一起使用;
-f :依据 -d 的分隔字符将一段讯息分区成为数段,用 -f 取出第几段的意思;
-c :以字符 (characters) 的单位取出固定字符区间;
```
cut 主要的用途在于将『同一行里面的数据进行分解!』
```bash
$ grep [-acinv] [--color=auto] '搜寻字符串' filename
选项与参数:
-a :将 binary 文件以 text 文件的方式搜寻数据
-c :计算找到 '搜寻字符串' 的次数
-i :忽略大小写的不同,所以大小写视为相同
-n :顺便输出行号
-v :反向选择,亦即显示出没有 '搜寻字符串' 内容的那一行!
--color=auto :可以将找到的关键词部分加上颜色的显示喔!
```
##### 排序命令sort，wc，uniq
###### sort
```bash
$ sort [-fbMnrtuk] [file or stdin]
选项与参数:
-f :忽略大小写的差异,例如 A 与 a 视为编码相同;
-b :忽略最前面的空格符部分;
-M :以月份的名字来排序,例如 JAN, DEC 等等的排序方法;
-n :使用『纯数字』进行排序(默认是以文字型态来排序的);
-r :反向排序;
-u :就是 uniq ,相同的数据中,仅出现一行代表;
-t :分隔符,预设是用 [tab] 键来分隔;
-k :以那个区间 (field) 来进行排序的意思

$ cat /etc/passwd | sort -t ':' -k 3
root:x:0:0:root:/root:/bin/bash
dmtsai:x:1000:1000:dmtsai:/home/dmtsai:/bin/bash
alex:x:1001:1002::/home/alex:/bin/bash
arod:x:1002:1003::/home/arod:/bin/bash

$ last | cut -d ' ' -f1 | sort #利用 last ,将输出的数据仅取账号,并加以排序
```
###### uniq
```bash
$ uniq [-ic]
选项与参数:
-i :忽略大小写字符的不同;
-c :进行计数
```
###### wc
```bash
$ wc [-lwm]
选项与参数:
-l :仅列出行;
-w :仅列出多少字(英文单字);
-m :多少字符;
```
##### 双向重定向tee
tee 会同时将数据流分送到文件去与屏幕 (screen);而输出到屏幕的,其实就是 stdout ,那就可以让下个指令继续处理
[![EotDat.md.png](https://s2.ax1x.com/2019/05/14/EotDat.md.png)](https://imgchr.com/i/EotDat)
```bash
$ tee [-a] file
选项与参数:
-a
:以累加 (append) 的方式,将数据加入 file 当中!
##### 字符转换命令tr，col，join，paste，expand
###### tr

tr 可以用来删除一段讯息当中的文字,或者是进行文字讯息的替换
​```bash
$ tr [-ds] SET1 ...
选项与参数:
-d :删除讯息当中的 SET1 这个字符串;
-s :取代掉重复的字符!
```
###### col
```bash
$ col [-xb]
选项与参数:
-x:将 tab 键转换成对等的空格键
```
###### join
```bash
$ join [-ti12] file1 file2
选项与参数:
-t
:join 默认以空格符分隔数据,并且比对『第一个字段』的数据,
如果两个文件相同,则将两笔数据联成一行,且第一个字段放在第一个!
-i :忽略大小写的差异;
-1 :这个是数字的 1 ,代表『第一个文件要用那个字段来分析』的意思;
-2 :代表『第二个文件要用那个字段来分析』的意思。
# 在使用 join 之前,你所需要处理的文件应该要事先经过排序 (sort) 处理
```
###### paste
将两行贴在一起,且中间以 [tab] 键隔开
```bash
$ paste [-d] file1 file2
选项与参数:
-d :后面可以接分隔字符。预设是以 [tab] 来分隔的!
- :如果 file 部分写成 - ,表示来自 standard input 的资料的意思。
```
###### expand
```bash
$ expand [-t] file
选项与参数:
-t
:后面可以接数字。一般来说,一个 tab 按键可以用 8 个空格键取代。
我们也可以自行定义一个 [tab] 按键代表多少个字符呢!
##### 分区命令split
``bash
$ split [-bl] file PREFIX
选项与参数:
-b :后面可接欲分区成的文件大小,可加单位,例如 b, k, m 等;
-l :以行数来进行分区。
PREFIX :代表前导符的意思,可作为分区文件的前导文字。

$ cd /tmp; split -b 300k /etc/services services
$ cat services* >> servicesback #将上面的三个小文件合成一个文件
```
##### 参数代换xargs
在产生某个指令的参数
```bash
$ xargs [-0epn] command
选项与参数:
-0
:如果输入的 stdin 含有特殊字符,例如 `, \, 空格键等等字符时,这个 -0 参数
可以将他还原成一般字符。这个参数可以用于特殊状态喔!
-e
:这个是 EOF (end of file) 的意思。后面可以接一个字符串,当 xargs 分析到这个字符串时,
就会停止继续工作!
-p :在执行每个指令的 argument 时,都会询问使用者的意思;
-n :后面接次数,每次 command 指令执行时,要使用几个参数的意思。
当 xargs 后面没有接任何的指令时,默认是以 echo 来进行输出喔!

$ $ cut -d ':' -f 1 /etc/passwd | head -n 3 | xargs -n 1 id
uid=0(root) gid=0(root) groups=0(root)
uid=1(bin) gid=1(bin) groups=1(bin)
uid=2(daemon) gid=2(daemon) groups=2(daemon)
# 透过 -n 来处理,一次给予一个参数
# 很多指令其实并不支持管线命令,因此我们可以透过 xargs 来提供该指令引用 standard input 之用
```
##### 关于减号-的用途
在管线命令当中,常常会使用到前一个指令的 stdout 作为这次的stdin , 某些指令需要用到文件名 (例如 tar) 来进行处理时,该 stdin 与 stdout 可以利用减号 "-"来替代:
```bash
$ mkdir /tmp/homeback
$ tar -cvf - /home | tar -xvf - -C /tmp/homeback
#将 /home 里面的文件给他打包,但打包的数据不是纪录到文件,而是传送
#到 stdout; 经过管线后,将 tar -cvf - /home 传送给后面的 tar -xvf - 』。
#后面的这个 - 则是取用前一个指令的 stdout, 因此,我们就不需要使用 filename 了!
```

### 重点回顾
+ 由于核心在内存中是受保护的区块,因此我们必须要透过『 Shell 』将我们输入的指令与 Kernel 沟通,好
让 Kernel 可以控制硬件来正确无误的工作
+ 学习 shell 的原因主要有:文字接口的 shell 在各大 distribution 都一样;远程管理时文字接口速度较快;
shell 是管理 Linux 系统非常重要的一环,因为 Linux 内很多控制都是以 shell 撰写的。
+ 系统合法的 shell 均写在 /etc/shells 文件中;
+ 用户默认登入取得的 shell 记录于 /etc/passwd 的最后一个字段;
+ bash 的功能主要有:命令编修能力;命令与文件补全功能;命令别名设定功能;工作控制、前景背景控制;程序化脚本;通配符
+ type 可以用来找到执行指令为何种类型,亦可用于与 which 相同的功能;
+ 变量就是以一组文字或符号等,来取代一些设定或者是一串保留的数据
+ 变量主要有环境变量与自定义变量,或称为全局变量与局部变量
+ 使用 env 与 export 可观察环境变量,其中 export 可以将自定义变量转成环境变量;
+ set 可以观察目前 bash 环境下的所有变量;
+ $? 亦为变量,是前一个指令执行完毕后的回传值。在 Linux 回传值为 0 代表执行成功;
+ locale 可用于观察语系资料;
+ 可用 read 让用户由键盘输入变量的值
+ ulimit 可用以限制用户使用系统的资源情况
+ bash 的配置文件主要分为 login shell 与 non-login shell。 login shell 主要读取 /etc/profile 与 ~/.bash_profile,non-login shell 则仅读取 ~/.bashrc
+ 在使用 vim 时,若不小心按了 [crtl]+s 则画面会被冻结。你可以使用 [ctrl]+q 来解除冻结
+ 通配符主要有: *, ?, [] 等等
+ 数据流重导向透过 >, 2>, < 之类的符号将输出的信息转到其他文件或装置去;
+ 连续命令的下达可透过 ; && || 等符号来处理
+ 管线命令的重点是:『管线命令仅会处理 standard output,对于 standard error output 会予以忽略』 『管线命令必须要能够接受来自前一个指令的数据成为 standard input 继续处理才行。』
+ 本章介绍的管线命令主要有:cut, grep, sort, wc, uniq, tee, tr, col, join, paste, expand, split, xargs 等。
