---
title: Linux(3)-Linux文件与目录管理
date: 2019-03-26 16:59:30
tags:
- Linux
- 文件和目录
categories: 软件工具
copyright:
---
### 目录与路径
#### 相对路径与绝对路径
+ 相对路径:：***安装软件***时,每个人有不同的文件安装位置,这时使用相对路径来安排各个软件目录下的文件位置就十分方便。
+ 绝对路径：绝对路径是绝对正确的路径（如果你自己没犯傻的话），在使用***shell脚本***的来管理系统的情况下，请务必使用绝对路径。

#### 目录的相关操作
特殊的目录：
```
.         当前目录---------------|——所有目录下都会存在的两个目录
..        当前目录的上一层目录---|（根目录的这两个目录相同）
~         当前目前使用者的家目录
—         前一个工作目录
~account  代表account账户的家目录
```
日常处理目录的命令：
```
cd     切换目录
pwd    显示当前目录
rmdir  建立一个新目录
mkdir  删除一个空目录
```
###### cd（change directory，切换目录）
 + 注意利用相对路径的写法时必须要确认当前的所在工作目录的局对路径，单独使用`cd`相当于`cd ~`，`cd -`会显示前一个工作目录
 + 利用[Tab]键来自动补全路径
###### pwd（显示目前所在的目录，Print Working directory）
```
pwd [-P]
选项与参数：
-P： 显示出真正的路径，而非使用链接（Link）路径。
```
###### rmdir（remove directory）
```
rmdir [-p] 目录名称
选项与参数
-p：连同上层的空目录一起递归删除
```
目录中必须是空的，如果有任何的文件和目录，都不能使用`rmdir`。
###### mkdir（make directory）
```
mkdir [-mp] 目录名称
选项与参数：
-m：设置文件的权限，直接设置，不使用默认权限（umask）
-：对需要创建的目录（包含上层目录）递归创建
```

#### 执行文件路径--\$PATH
PATH是环境变量，当我们从Terminal执行命令的时候，系统会按***顺序***从每个PATH的定义的目录下查找同名的可执行文件。

PATH由一堆目录组成，每个目录之间用`：`隔开。
```
$ echo $PATH 显示当前PATH
$ PATH="${PATH}:directory"  临时修改PATH
$ vim .bashrc 通过.bashrc永久修改文件
$ source .bashrc 使文件生效
```
为了安全起见，不要将`.`本目录加入PATH。
### 文件与目录管理
```
$ ls 查看
$ cp 复制
$ rm 删除
$ mv 移动，重命名
```
#### 文件与目录的查看ls
```
$ ls [-aAdfFhilnrRSt] 文件名或目录名称
$ ls [--color={never,auto,always}] 文件名或目录名称
$ ls [--full-time] 文件名或目录名称
选项与参数：
× -a：全部的文件，连同隐藏文件一起列出来
  -A：全部的文件，连同隐藏文件但不包括.和..这两个目录
× -d：仅列出目录本身，而不是列出目录内的问价数据
  -f：直接列出结果，而不进行排序（ls会默认以文件名排序）
  -F：根据文件，目录等信息，给予附加数据结构，
     *:可执行文件
     /:目录
     =:socket文件
     |:FIFO文件
  -h：将文件容量以人类易读的方式列出KB，GB
  -i：列出inode号码
× -l：详细信息显示，包含文件的属性与权限等数据
  -n：列出UID与GID而非使用而非使用者与用户组的名称
  -r：将排序结果反向输出
  -R：连同子目录下的文件一起列出来
  -S：以文件容量大小排序
  -t：依时间排序而不是用文件名
  --color=never：不要依据文件特性显示颜色
  --color=always：显示颜色
  --color=auto：系统自动根据设置来判断是否设置颜色
  --full-time：以完整的时间模式处处输出
  --time={atime，ctime}：输出access时间或改变权限属性时间
  ls默认只显示：非隐藏文件，以文件名排序，文件名代表的颜色
```
#### 复制,删除与移动
###### cp（复制文件或目录）
```c
$ cp [-adfilprsu] 源文件（source） 目标文件（destination）
$ cp [-options] sorce1 source2 ... directory
选项与参数：
× -a：相当于-dr --preserve=all
    -d：若原文件为链接文件的属性（link file），则赋值连接文件的属性而非文件本身
    -f：force，若目标文件已经存在且无法开启，则删除目标文件后再尝试一次
× -i：若目标文件（destination）已经存在时，在覆盖时会先询问
    -l：进行硬链接（hard link）文件的建立，而非复制文件本身
× -p：连同文件的属性，一起复制过去，而非使用默认属性
× -r：递归复制
    -s：负值成为符号连接文件（srmbolic link），即快捷方式
    -u：目标文件比源文件旧才更新
    --preserve=all：除了-p的权限外还加入SELinux属性，links，xatter等也复制
```
在默认的条件下，cp的源文件与目标文件是不同的，目标文件的拥有者通常是命令操作者本身。
###### rm（删除文件或目录）
```c
$ rm [-fir] 文件或目录
选项与参数：
-f：force的意思，忽略不存在的文件或目录
-i：交互模式，在删除前会询问使用者是否操作
-r：递归删除（Dangerous！！）
$ rm -i bashrc* //通配符*可以删除目录下所有开头为bashrc的文件
$ \rm -r /tmp/etc //rm命令前加上\可以忽略alias指定的选项
$ rm -- -aaa- //这样可以删除文件中带-的文件，放置系统误判为选择项
```
###### mv （移动文件与目录，或重命名）
```c
$ mv [-fiu] source destination
$ mv [options] source1 source2 ... directory
选项与参数：
-f：force，如果目标文件已经存在，不会询问直接覆盖
-i：询问是否覆盖
-u：若目标文件已经存在，且源文件较新，才会覆盖
$ mv mvtest mvtest2  //这样就可重命名
```

#### 获取路径的文件名与目录名称
```
$ basename /etc/sysconfig/network
network //文件名
$ dirname /etc/sysconfig/network
/etc/sysconfig //目录名
```
### 文件内容查看
+ cat由由第一行开始显示文件内容
+ tac从最后一行显示文件内容
+ nl显示的时候同时输出行号
+ more一页一页的显示文件内容
+ less，和more类似，可以向前翻页
+ head 只看前面几行
+ tail 只看后面几行
+ od以二进制方式读取文件内容


#### 直接查看文件内容
###### cat（concatenate串联）
```
$ cat [-AbEnTv]
选项与参数：
    -A：相当于-vET的整合选项，可列出一些特殊字符而不是空白
    -b：列出行号，空白行不做显示
    -E：将结尾的换行符以$表示
× -n：打印行号，空白行也有
    -T：将[Tab]键以^I显示出来
    -v：列出一些看不出来的特殊字符
```
###### tac（反向列示）
###### nl（添加行号）
```
$ nl [-bnw] 文件
选项与参数：
-b：指定行号指定的方式：
      -b a：表示不论是否为空行，都列出行号
      -b n：如果有空行，不列出行号（默认）
-n：列出行号表示的方法：
      -n ln：行号在屏幕的最左方显示
      -n rn：行号在自己栏位的最右方显示，不加0
      -n rz：行号在自己栏位的最右方显示，加0
-w：行号栏位占用的字符数
```

#### 可翻页查看
###### more（一页一页翻动）
 + 空格键；向下翻页
 + Enter：代表向下一行
 + /字符串：向下查找字符串这个关键词
 + ：f：立即显示出文件名和人当前行数
 + q：离开
 + b向后翻页，只对文件有用对管道无用
###### less
 + like man：man就是使用less来显示文件内容


#### 数据截取
###### head
```
$ head [-n number] 文件
```
###### tail
```
$ tail [-n number] 文件
选项与参数：
-n：接数字，显示number行
-f：持续刷新显示后所接文件的内容
```

取一个文件的第11行和第20行之间的内容：
```
head -n 20 /etc/man_db.conf | head -n 20 | tail -n 10
```
#### 非纯文本文件od
```
$ od [-t TYPE] 文件
选项或参数：
-t：后面可以接各种【类型（TYPE】的输出：
	a：利用默认的字符来输出
    c：使用ASCII字符来输出
    d[size]：用十进制来输出，每个整数占用size Bytes；
    f[size]：用浮点数来输出，每个整数占用size Bytes；
    o[size]：用八进制来输出，每个整数占用size Bytes；
    x[size]：用十六进制来输出，每个整数占用size Bytes；
$ echo password | od -t oCc
0000000 160 141 163 163 167 157 162 144 012
          p   a   s   s   w   o   r   d  \n
0000011
```
#### 修改文件时间或创建新文件touch
+ 修改时间（modification time，mtime）
+ 状态时间（Status time，ctime）
+ 读取时间（access time，atime）

Linux默认显示该文件的mtime。
```
$ touch [-acdnt] 文件
选项与参数：
-a：仅自定义atime
-c：仅修改文件的时间，若不存在则不修改
-d：后面可以接自定义的日期
-m：仅修改mtime
-t：后面可以接自定义的时间
$ touch -d "2 days ago" bashrc
```
### 文件与目录的默认权限与隐藏权限
#### 文件默认权限umask
`umask`指定目前用户在建立文件或 目录时的权限默认值。
```
$ umask
0022
$ umask -S
u=rwx,g=rx,o=rx
```
建立目录时会在默认值的基础上减去`umask`的值。
+ 建立文件的默认没有可执行权限：
`-rw-rw-rw-`
+ 建立目录默认所有权限开放：
`drwxrwxrwx`

#### 文件隐藏属性
###### chatter（配置文件隐藏属性）
```
$ chatter [+-=] [ASacdistu] 文件或目录名称
选项与参数：
 +：增加一个特殊参数
-：删除一个特殊参数
=：直接设置参数
A：存取文件时，atime不会被改变
S：文件同步写入磁盘
a：只能增加数据，不能删除也不能修改
c：文件压缩，读取时自动解压
d：文件不会被dump备份
i：文件不能被删除，改名，设置链接，也无法写入或新增数据
s：删除时被完全删除
u：删除时数据还在磁盘之中
```
###### lsatter（显示文件隐藏属性）
```
$ lsatter [-adR] 文件或目录
选项与参数：
-a：隐藏文件的属性也显示出来
-d：如果接的是目录，仅列出目录本身的属性而非目录内的文件名
-R：连同子目录的数据也一并列出来
```
#### 文件特殊权限
###### SUID（Set UID）
 + SUID执行权限仅对二进制程序（binary program）有效；
 + 执行者对于该程序需要具有x的执行权限；
 + 本权限仅在执行该程序的过程中有效（run-time）；
 + 执行者将具有该程序拥有者的权限
```
              |———|*/usr/bin/passwd  *|
              |   |*权限：-rwsr-xr-x *|
              |   |*特殊：SUID       *|——由普通用户变为root
              |   |*程序拥有者：root *|
              |
普通用户——|
              |
              |   |*/bin/cat         *|
              |   |*权限：-rwxr-xr-x *|——还是普通用户
              |   |*特殊：无         *|
              |———|*程序拥有者：root *|
```
SUID仅可用于二进制文件上，不能用在shell脚本上
###### SGID（Set GID）
 + 对于文件：
   + SGID对二进制程序有用
   + 程序执行者对于该程序来说，需要具备x的权限
   + 执行者在执行的过程中将会获得该程序用户组的支持
  + 对于目录：
   + 用户若对于此目录具有r与x的权限时，该用户能够进入此目录
   + 用户在此目录下的有效用户组（effective group）将会变成该目录的用户组
   + 用途：若用户在此目录下具有w的权限（可以新建文件），则用户所建立的新文件，该文件的用户组与此目录的用户组相同
+ SBIT
 + 当用户对于此目录具有w，x权限，即具有写入的权限
 + 当用户在该目录下建立文件或目录时，仅有自己与root才有权力删除该文件。

SUID/SGID/SBIT权限设置：4为SUID，2为SGID，1为SBIT。
#### 观察文件类型
```
$ file ~/.bashrc
/home/jason/.bashrc: ASCII text
$ file /usr/bin/passwd
/usr/bin/passwd: setuid ELF 64-bit LSB shared object, x86-64, version 1 (SYSV), dynamically linked, interpreter /lib64/l, for GNU/Linux 3.2.0, BuildID[sha1]=d44c96296f224071ed008e442b9eb3f2462840e4, stripped
```
### 命令与文件的查找
#### 脚本文件的查找which
```
$ which [-a] command
选项或参数：
-a：所有由PATH目录中可以找到的命令全部列出
```
which根据PATH的规范的路径去寻找执行文件的文件名。
#### 文件的查找
###### whereis（由一些特定的目录中查找文件）
```
$ whereis [-bmsu] 文件或目录名
选项与参数：
-l ： 列出whereis查询的目录
-b：只找binary（二进制）格式的文件
-m：只找在说文件manual路径下的文件
-s：只找source源文件
-u：查找不在上述三个项目中的其他文件
```
###### locate
根据`/var/lib/mlocate`文件中的数据库记录，找出用户所输入的关键词的文件名。
```
$ locate [-ir] keyword
选项与参数：
-i：忽略大小写
-c：只输出找到文件的数量
-l：仅输出几行的意思
-S：输出locate使用的数据库文件的信息
-r：后接正则表达式
```
###### updatedb
根据`/etc/updatedb.conf`的设置去查找系统硬盘内的文件，并更新`/var/lib/mlocate`内的数据库文件，locate的数据库如果不执行，则是一天更新一次。
###### find
```
$ find [PATH] [option] [action]
选项与参数：
1.与时间有关的项目：
  -mtime n ：n天之前（一天之内）被修改过的项目
  -mtime +n：n天之前（不含n天）被修改过的项目
  -mtime -n：n天之内（含n天）被修改过的项目
  -never file：file为一个存在的文件，列出比file还要新的文件
2.与使用者或用户参数有关的参数
  -uid n：n为UID
  -gid n：n为GID
  -user name：
  -group name：
  -nouser：文件拥有者不在passwd内
  -nogroup
3.与文件权限及名称有关的参数
  -name filename：查找文件名为filename的文件
  -size [+-] SIZE
  -type TYPE
  -perm mode：权限等于mode
  -perm -mode：权限大于等于mode
  -perm /mode：权限只要包含任意mode
4.额外操作：
  -exec command：接额外的命令来处理查找到的结果
  -print：结果打印到屏幕，默认
```
### 重点回顾
+ 一个可以被挂载的数据通常称为『文件系统, filesystem』而不是分区槽 (partition) 喔!
+ 基本上 Linux 的传统文件系统为 Ext2 ,该文件系统内的信息主要有:
  + superblock:记录此 filesystem 的整体信息,包括 inode/block 的总量、使用量、剩余量, 以及文件系统的格式与相关信息等;
  + inode:记录文件的属性,一个文件占用一个 inode,同时记录此文件的数据所在的 block 号码;
  + block:实际记录文件的内容,若文件太大时,会占用多个 block 。
+ Ext2 文件系统的数据存取为索引式文件系统(indexed allocation)
+ 需要碎片整理的原因就是文件写入的 block 太过于离散了,此时文件读取的效能将会变的很差所致。 这个时候可以透过碎片整理将同一个文件所属的 blocks 汇整在一起。
+ Ext2 文件系统主要有:boot sector, superblock, inode bitmap, block bitmap, inode table, data block 等六大部分。
+  data block 是用来放置文件内容数据地方,在 Ext2 文件系统中所支持的 block 大小有 1K, 2K 及 4K 三种而已
+ inode 记录文件的属性/权限等数据,其他重要项目为: 每个 inode 大小均为固定,有 128/256bytes 两种基本容量。每个文件都仅会占用一个 inode 而已; 因此文件系统能够建立的文件数量与 inode 的数量有关;
+ 文件的 block 在记录文件的实际数据,目录的 block 则在记录该目录底下文件名与其 inode 号码的对照表;
+ 日志式文件系统 (journal) 会多出一块记录区,随时记载文件系统的主要活动,可加快系统复原时间;
+ Linux 文件系统为增加效能,会让主存储器作为大量的磁盘高速缓存;
+ 实体链接只是多了一个文件名对该 inode 号码的链接而已;
+ 符号链接就类似 Windows 的快捷方式功能。
+ 磁盘的使用必需要经过:分区、格式化与挂载,分别惯用的指令为:gdisk, mkfs, mount 三个指令
+ 分区时,应使用 parted 检查分区表格式,再判断使用 fdisk/gdisk 来分区,或直接使用 parted 分区
+ 为了考虑效能,XFS 文件系统格式化时,可以考虑加上 agcount/su/sw/extsize 等参数较佳
+ 如果磁盘已无未分区的容量,可以考虑使用大型文件取代磁盘装置的处理方式,透过 dd 与格式化功能。
+ 开机自动挂载可参考/etc/fstab 之设定,设定完毕务必使用 mount -a 测试语法正确否;
