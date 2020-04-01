---
title: Linux(8)-正则表达式与文件格式化处理
date: 2019-05-19 14:44:00
tags:
  - Linux
  - 正则表达式
categoties: 程序设计
copyright:
---
简单的说,正则表达式就是用在字符串的处理上面的一项『表示式』。正则表达式并不是一个工具程序,而是一个字符串处理的标准依据,如果您想要以正则表达式的方式处理字符串,就得要使用支持正则表达式的工具程序才行, 这类的工具程序很多,例如 vi, sed, awk 等等。

***正则表达式与通配符是完全不一样的东西*** ,通配符 (wildcard) 代表的是 bash 操作接口的一个功能』,但正则表达式则是一种字符串处理的表示方式
#### 什么是正则表达式
正则表达式就是处理字符串的方法,他是以行为单位来进行字符串的处理行为, 正则表达式透过一些特殊符号的辅助,可以让使用者轻易的达到『搜寻/删除/取代』某特定字符串的处理程序。

正则表达式基本上是一种『表示法』, 只要工具程序支持这种表示法,那么该工具程序就可以用来作为正则表达式的字符串处理之用。

+ 正则表达式对于系统管理员的用途

系统的『错误讯息登录文件』 的内容记载了系统产生的所有讯息,包含系统是否被『入侵』的记录数据。但是系统的数据量太大了,系统管理员每天要接受海量讯息数据, 从千百行的资料
里面找出一行有问题的讯息,这个时候,就可以透过『正则表达式』的功能,将这些登录的信息进行处理, 仅取出『有问题』的信息来进行分析。

+ 正则表达式的广泛用途

目前两大邮件服务器软件 sendmail与 postfix 以及支持邮件服务器的相关分析软件,都支持正则表达式的比对功能
+ 正则表达式与 Shell 在 Linux 当中的角色定位

正则表达式,与前一章的 BASH 就有点像是数学的九九表一样,是 Linux 基础当中的基础,虽然也是最难的部分，不论是对于系统的认识与系统的管理部分,他都有很棒的辅助
+ 延伸的正则表达式

正则表达式的字符串表示方式依照不同的严谨度而分为: 基础正则表达式与延伸正则表达式。

延伸型正则表达式除了简单的一组字符串处理之外,还可以作群组的字符串处理, 例如进行搜寻 Jason 或 netman 或 lman 的搜寻,注意,是『或(or)』而不是『和(and)』的处理, 此时就需要延伸正则表达式的帮助啦!藉由特殊的『 ( 』与『 | 』等字符的协助, 就能够达到这样的目的。
#### 基础正则表达式
既然正则表达式是处理字符串的一种表示方式,那么对字符排序有影响的 ***语系数据*** 就会对正则表达式的结果有影响。
##### 语系对正则表达式的影响
同语系的编码数据并不相同,所以就会造成数据截取结果的差异。

For example
```
LANG=C     时:0 1 2 3 4 ... A B C D ... Z a b c d ...z
LANG=zh_TW 时:0 1 2 3 4 ... a A b B c C d D ... z Z
```
使用 [A-Z] 时, 会发现 LANG=C 确实可以仅捉到大写字符 (因为是连续的) ,但是如果LANG=zh_TW.big5 时,连同小写的 b-z 也会被截取出来。

***使用正则表达式时,需要特别留意当时环境的语系为何, 否则可能会发现与别人不相同的撷取结果***

###### 特殊符号表：

| 特殊符号   | 代表意义                                                    |
| ---------- | ----------------------------------------------------------- |
| [:alnum:]  | 代表英文大小写字符及数字,亦即 0-9, A-Z, a-z                 |
| [:alpha:]  | 代表任何英文大小写字符,亦即 A-Z, a-z                        |
| [:blank:]  | 代表空格键与 [Tab] 按键两者                                 |
| [:cntrl:]  | 代表键盘上面的控制按键,亦即包括 CR, LF, Tab, Del.. 等等     |
| [:digit:]  | 代表数字而已,亦即 0-9                                       |
| [:graph:]  | 除了空格符 (空格键与 [Tab] 按键) 外的其他所有按键           |
| [:lower:]  | 代表小写字符,亦即 a-z                                       |
| [:print:]  | 代表任何可以被打印出来的字符                                |
| [:punct:]  | 代表标点符号 (punctuation symbol),亦即:" ' ? ! ; : # $...   |
| [:upper:]  | 代表大写字符,亦即 A-Z                                       |
| [:space:]  | 任何会产生空白的字符,包括空格键, [Tab], CR 等等             |
| [:xdigit:] | 代表 16 进位的数字类型,因此包括: 0-9, A-F, a-f 的数字与字符 |

##### grep的一线高级选项
```bash
$ grep [-A] [-B] [--color=auto] '搜寻字符串' filename
选项与参数:
-A :后面可加数字,为 after 的意思,除了列出该行外,后续的 n 行也列出来;
-B :后面可加数字,为 befer 的意思,除了列出该行外,前面的 n 行也列出来;
--color=auto 可将正确的那个撷取数据列出颜色

$ dmesg | grep inteldrmfb
[    2.972950] fb: switching to inteldrmfb from EFI VGA
[    3.263535] fbcon: inteldrmfb (fb0) is primary device
[    3.263601] i915 0000:00:02.0: fb0: inteldrmfb frame buffer device
# dmesg 可列出核心产生的讯息!包括硬件侦测的流程也会显示出来。
# 使用的显卡是 inteldrmfb 核显,透过 grep 来 inteldrmfb的相关信息,可发现如上信息。
$ dmesg | grep -n --color=auto 'inteldrmfb'
910:[    2.972950] fb: switching to inteldrmfb from EFI VGA
926:[    3.263535] fbcon: inteldrmfb (fb0) is primary device
928:[    3.263601] i915 0000:00:02.0: fb0: inteldrmfb frame buffer device
#除了 inteldrmfb 会有特殊颜色来表示之外,最前面还有行号,其实颜色显示已经是默认在 alias 当中了!
$ dmesg | grep -n -A3 -B2 --color=auto 'inteldrmfb'
908-[    2.972948] [drm] Memory usable by graphics device = 4096M
909-[    2.972950] checking generic (b0000000 e10000) vs hw (b0000000 10000000)
910:[    2.972950] fb: switching to inteldrmfb from EFI VGA
911-[    2.972961] Console: switching to colour dummy device 80x25
912-[    2.973096] [drm] Replacing VGA console driver
913-[    2.979952] [drm] Supports vblank timestamp caching Rev 2 (21.10.2013).
--
924-[    2.995577] usb 1-8: SerialNumber: 0001
925-[    3.124110] usb 1-9: new full-speed USB device number 4 using xhci_hcd
926:[    3.263535] fbcon: inteldrmfb (fb0) is primary device
927-[    3.263578] Console: switching to colour frame buffer device 320x90
928:[    3.263601] i915 0000:00:02.0: fb0: inteldrmfb frame buffer device
929-[    3.277635] usb 1-9: New USB device found, idVendor=06cb, idProduct=009a
930-[    3.277636] usb 1-9: New USB device strings: Mfr=0, Product=0, SerialNumber=1
931-[    3.277637] usb 1-9: SerialNumber: 727eb8862574
#在关键词所在行的前两行与后三行也一起捉出来显示
```
grep 在数据中查寻一个字符串时,是以 "整行" 为单位来进行的。

##### 基础正则表达式练习
使用命令下载数据
```bash
$ wget http://linux.vbird.org/linux_basic/0330regularex/regular_express.txt
```
前提：
+ 语系已经使用『 export LANG=C; export LC_ALL=C 』的设定值;
+ grep 已经使用 alias 设定成为『 grep --color=auto 』

```bash
$ locale
LANG=en_US.UTF-8
LANGUAGE=
LC_CTYPE="en_US.UTF-8"
LC_NUMERIC=zh_CN.UTF-8
LC_TIME=zh_CN.UTF-8
LC_COLLATE="en_US.UTF-8"
LC_MONETARY=zh_CN.UTF-8
LC_MESSAGES="en_US.UTF-8"
LC_PAPER=zh_CN.UTF-8
LC_NAME=zh_CN.UTF-8
LC_ADDRESS=zh_CN.UTF-8
LC_TELEPHONE=zh_CN.UTF-8
LC_MEASUREMENT=zh_CN.UTF-8
LC_IDENTIFICATION=zh_CN.UTF-8
LC_ALL=
#查看一下当前语系
$  export LANG=C LC_ALL=C
```

文件内容：
```bash
$ vi regular_express.txt
"Open Source" is a good mechanism to develop programs.
apple is my favorite food.
Football game is not use feet only.
this dress doesn't fit me.
However, this dress is about $ 3183 dollars.
GNU is free air not free beer.
Her hair is very beauty.
I can't finish the test.
Oh! The soup taste good.
motorcycle is cheap than car.
This window is clear.
the symbol '*' is represented as start.
Oh!	My god!
The gd software is a library for drafting programs.
You are the best is mean you are the no. 1.
The world <Happy> is the same with "glad".
I like dog.
google is the best tools for search keyword.
goooooogle yes!
go! go! Let's go.
# I am VBird

```
文件共有 22 行,最底下一行为空白行。

###### 搜寻特定字符串

```bash
$ grep -n 'the' regular_express.txt
8:I can't finish the test.
12:the symbol '*' is represented as start.
15:You are the best is mean you are the no. 1.
16:The world <Happy> is the same with "glad".
18:google is the best tools for search keyword.
```
###### 反向选择
```bash
$ grep -vn 'the' regular_express.txt
1:"Open Source" is a good mechanism to develop programs.
2:apple is my favorite food.
3:Football game is not use feet only.
4:this dress doesn't fit me.
5:However, this dress is about $ 3183 dollars.
6:GNU is free air not free beer.
7:Her hair is very beauty.
9:Oh! The soup taste good.
10:motorcycle is cheap than car.
11:This window is clear.
13:Oh!	My god!
14:The gd software is a library for drafting programs.
17:I like dog.
19:goooooogle yes!
20:go! go! Let's go.
21:# I am VBird
22:
```
###### 取得不论大小写的 the 这个字符串
```bash
$ grep -in 'the' regular_express.txt
8:I can't finish the test.
9:Oh! The soup taste good.
12:the symbol '*' is represented as start.
14:The gd software is a library for drafting programs.
15:You are the best is mean you are the no. 1.
16:The world <Happy> is the same with "glad".
18:google is the best tools for search keyword.
```
+ 利用中括号 [] 来搜寻集合字符
```bash
$  grep -n 't[ae]st' regular_express.txt
8:I can't finish the test.
9:Oh! The soup taste good.
# 其实 [] 里面不论有几个字符,他都仅代表某『一个』字符
```
###### 利用^取反
```bash
$ grep -n 'oo' regular_express.txt
1:"Open Source" is a good mechanism to develop programs.
2:apple is my favorite food.
3:Football game is not use feet only.
9:Oh! The soup taste good.
18:google is the best tools for search keyword.
19:goooooogle yes!
$ grep -n '[^g]oo' regular_express.txt
2:apple is my favorite food.
3:Football game is not use feet only.
18:google is the best tools for search keyword.
19:goooooogle yes!
$ grep -n '[^a-z]oo' regular_express.txt
$ grep -n '[^[:lower:]]oo' regular_express.txt
3:Football game is not use feet only.
# oo 前面不想要有小写字符
# [:lower:] 就是 a-z 的意思,那么 [a-z]就是 [[:lower:]]
$ grep -n '[0-9]' regular_express.txt
$ grep -n '[[:digit:]]' regular_express.txt
5:However, this dress is about $ 3183 dollars.
15:You are the best is mean you are the no. 1.
```
###### 行首与行尾字符 ^ $
```bash
$ grep -n '^the' regular_express.txt
12:the symbol '*' is represented as start.
$ grep -n '^[a-z]' regular_express.txt
$ grep -n '^[[:lower:]]' regular_express.txt
2:apple is my favorite food.
4:this dress doesn't fit me.
10:motorcycle is cheap than car.
12:the symbol '*' is represented as start.
18:google is the best tools for search keyword.
19:goooooogle yes!
20:go! go! Let's go.
$ grep -n '^[^a-zA-z]' regular_express.txt
$ grep -n '^[^[:alpha:]]' regular_express.txt
1:"Open Source" is a good mechanism to develop programs.
21:# I am VBird
#^ 符号,在字符集合符号(括号[])之内与之外是不同的! 在 [] 内代表『反向选择』
#在 [] 之外则代表定位在行首的意义!
```
###### 行尾结束为小数点 (.)
```bash
$ grep -n '\.$' regular_express.txt
1:"Open Source" is a good mechanism to develop programs.
2:apple is my favorite food.
3:Football game is not use feet only.
4:this dress doesn't fit me.
10:motorcycle is cheap than car.
11:This window is clear.
12:the symbol '*' is represented as start.
15:You are the best is mean you are the no. 1.
16:The world <Happy> is the same with "glad".
17:I like dog.
18:google is the best tools for search keyword.
20:go! go! Let's go.
```
###### Windows 平台的软件对于断行字符的判断问题
```bash
$ cat -An regular_express.txt | head -n 10 | tail -n 6
5 However, this dress is about $ 3183 dollars.^M$
6 GNU is free air not free beer.^M$
7 Her hair is very beauty.^M$
8 I can't finish the test.^M$
9 Oh! The soup taste good.^M$
10 motorcycle is cheap than car.$
#5~9 行为 Windows 的断行字符 (^M$) ,而正常的 Linux 应该仅有第 10 行显示的那样 ($)
```
+ 找出来,哪一行是『空白行』
```bash
$ grep -n '^$' regular_express.txt
22:
$ grep -v '^$' /etc/rsyslog.conf | grep -v '^#'
# 结果仅有 14 行,其中第一个『 -v '^$' 』代表『不要空白行』,
# 第二个『 -v '^#' 』代表『不要开头是 # 的那行』喔!
```
###### 任意一个字符 . 与重复字符 *



+ . (小数点):代表『一定有一个任意字符』的意思;

```bash
$ grep -n 'g..d' regular_express.txt
  1:"Open Source" is a good mechanism to develop programs.
  9:Oh! The soup taste good.
  16:The world <Happy> is the same with "glad".
```



  + \* (星号):代表『重复前一个字符, 0 到无穷多次』的意思,为组合形态
  ```bash
  $ grep -n 'ooo*' regular_express.txt
  1:"Open Source" is a good mechanism to develop programs.
  2:apple is my favorite food.
  3:Football game is not use feet only.
  9:Oh! The soup taste good.
  18:google is the best tools for search keyword.
  19:goooooogle yes!
  $ grep -n 'goo*g' regular_express.txt
  18:google is the best tools for search keyword.
  19:goooooogle yes!
  $ grep -n 'g*g' regular_express.txt
  1:"Open Source" is a good mechanism to develop programs.
  3:Football game is not use feet only.
  9:Oh! The soup taste good.
  13:Oh!
  My god!
  14:The gd software is a library for drafting programs.
  16:The world <Happy> is the same with "glad".
  17:I like dog.
  18:google is the best tools for search keyword.
  19:goooooogle yes!
  20:go! go! Let's go.
  $ grep -n 'g.*g' regular_express.txt
  1:"Open Source" is a good mechanism to develop programs.
  14:The gd software is a library for drafting programs.18:google is the best tools for search keyword.
  19:goooooogle yes!
  20:go! go! Let's go.
  $ grep -n '[0-9][0-9]*' regular_express.txt
  5:However, this dress is about $ 3183 dollars.
  15:You are the best is mean you are the no. 1.
  ```
###### 限定连续 RE 字符范围 {}
因为 { 与 } 的符号在 shell 是有特殊意义的,因此, 我们必须要使用跳脱字符 \ 来让他失去特殊意义才行。
```bash
# 找到两个 o
1:"Open Source" is a good mechanism to develop programs.
$ grep -n 'o\{2\}' regular_express.txt
2:apple is my favorite food.
3:Football game is not use feet only.
9:Oh! The soup taste good.
18:google is the best tools for search keyword.
19:goooooogle yes!
# g 后面接 2 到 5 个 o ,然后再接一个 g 的字符串
$ grep -n 'go\{2,5\}g' regular_express.txt
18:google is the best tools for search keyword.
$ grep -n 'go\{2,\}g' regular_express.txt
18:google is the best tools for search keyword.
19:goooooogle yes!
```

##### 基础正则表达式字符集合

| RE 字符 | 意义与范例                                                                                                                               |
| ------- | ---------------------------------------------------------------------------------------------------------------------------------------- |
| ^word   | 意义:待搜寻的字符串(word)在行首                                                                                                          |
| word$   | 意义:待搜寻的字符串(word)在行尾                                                                                                          |
| .       | 意义:代表『一定有一个任意字符』的字符                                                                                                    |
| \       | 意义:跳脱字符,将特殊符号的特殊意义去除                                                                                                   |
| *       | 意义:重复零个到无穷多个的前一个 RE 字符                                                                                                  |
| [list]  | 意义:字符集合的 RE 字符,里面列出想要撷取的字符                                                                                           |
| [n1-n2] | 意义:字符集合的 RE 字符,里面列出想要撷取的字符范围                                                                                       |
| [^list] | 意义:字符集合的 RE 字符,里面列出不要的字符串或范围                                                                                       |
| \{n,m\} | 意义:连续 n 到 m 个的『前一个 RE 字符』意义:若为 \{n\} 则是连续 n 个的前一个 RE 字符,意义:若是 \{n,\} 则是连续 n 个以上的前一个 RE 字符! |

***『正则表达式的特殊字符』与一般在指令列输入指令的『通配符』并不相同。***
通配符当中的 * 代表的是『 0 ~ 无限多个字符』的意思,但是在正则表达式当中, * 则是『重复 0
到无穷多个的前一个 RE 字符』的意思
##### sed工具
sed 本身是一个管线命令,可以分析 standard input。 而且 sed还可以将数据进行取代、删除、新增、截取特定行等等的功能。
```bash
$ sed [-nefr] [动作]
选项与参数:
-n :使用安静(silent)模式。在一般 sed 的用法中,所有来自 STDIN 的数据一般都会被列出到屏幕上。
但如果加上 -n 参数后,则只有经过 sed 特殊处理的那一行(或者动作)才会被列出来。
-e :直接在指令列模式上进行 sed 的动作编辑;-f :直接将 sed 的动作写在一个文件内, -f filename 则可以执行 filename 内的 sed 动作;
-r :sed 的动作支持的是延伸型正则表达式的语法。(预设是基础正则表达式语法)
-i :直接修改读取的文件内容,而不是由屏幕输出。
动作说明:
[n1[,n2]]function
n1, n2 :不见得会存在,一般代表『选择进行动作的行数』,举例来说,如果我的动作
是需要在 10 到 20 行之间进行的,则『 10,20[动作行为] 』

function ：
a :新增, a 的后面可以接字符串,而这些字符串会在新的一行出现(目前的下一行)~
c :取代, c 的后面可以接字符串,这些字符串可以取代 n1,n2 之间的行!
d :删除,因为是删除啊,所以 d 后面通常不接任何咚咚;
i :插入, i 的后面可以接字符串,而这些字符串会在新的一行出现(目前的上一行);
p :打印,亦即将某个选择的数据印出。通常 p 会与参数 sed -n 一起运作~
s :取代,可以直接进行取代的工作哩!通常这个 s 的动作可以搭配正则表达式!
例如 1,20s/old/new/g 就是啦
```
+ 以行为单位的新增/删除功能
```bash
$ nl /etc/passwd | sed '2,5d'
     1	root:x:0:0:root:/root:/bin/bash
     6	games:x:5:60:games:/usr/games:/usr/sbin/nologin
     7	man:x:6:12:man:/var/cache/man:/usr/sbin/nologin
#,原本应该是要下达 sed -e 才对,没有 -e 也行
$  nl /etc/passwd | sed '2a Drink tea or ......\
> or drink beer ?'
     1	root:x:0:0:root:/root:/bin/bash
     2	daemon:x:1:1:daemon:/usr/sbin:/usr/sbin/nologin
Drink tea or ......
or drink beer ?
     3	bin:x:2:2:bin:/bin:/usr/sbin/nologin
```
###### 以行为单位的取代与显示功能
```bash
$ nl /etc/passwd | sed '2,5c NO 2-5 number'
    1	root:x:0:0:root:/root:/bin/bash
NO 2-5 number
    6	games:x:5:60:games:/usr/games:/usr/sbin/nologin
$ nl /etc/passwd | sed -n '5,7p'
         5	sync:x:4:65534:sync:/bin:/bin/sync
         6	games:x:5:60:games:/usr/games:/usr/sbin/nologin
         7	man:x:6:12:man:/var/cache/man:/usr/sbin/nologin
```
###### 部分数据的搜寻并取代的功能

sed 的搜寻与取代的与 vi 相当的类似
```bash
$ sed 's/要被取代的字符串/新的字符串/g'
$ /sbin/ifconfig eth0
eth0: flags=4163<UP,BROADCAST,RUNNING,MULTICAST>
inet 192.168.1.100
mtu 1500
netmask 255.255.255.0
inet6 fe80::5054:ff:fedf:e174
ether 52:54:00:df:e1:74
broadcast 192.168.1.255
prefixlen 64
txqueuelen 1000
scopeid 0x20<link>
(Ethernet)
$ /sbin/ifconfig eth0 | grep 'inet '
inet 192.168.1.100
netmask 255.255.255.0
broadcast 192.168.1.255
# 当场仅剩下一行!要注意, CentOS 7 与 CentOS 6 以前的 ifconfig 指令输出结果不太相同,
# 鸟哥这个范例主要是针对 CentOS 7 以后的喔!接下来,我们要将开始到 addr: 通通删除,
# 就是像底下这样:
# inet 192.168.1.100 netmask 255.255.255.0
# 上面的删除关键在于『 ^.*inet broadcast 192.168.1.255』啦!正则表达式出现! ^_^

$ /sbin/ifconfig eth0 | grep 'inet ' | sed 's/^.*inet //g'
192.168.1.100
netmask 255.255.255.0
broadcast 192.168.1.255
# 仔细与上个步骤比较一下,前面的部分不见了!接下来则是删除后续的部分,亦即:
192.168.1.100
netmask 255.255.255.0
broadcast 192.168.1.255
# 此时所需的正则表达式为:『 ' *netmask.*$ 』就是啦!
$ /sbin/ifconfig eth0 | grep 'inet ' | sed 's/^.*inet //g' \
>| sed 's/ *netmask.*$//g'
192.168.1.100

$ cat /etc/man_db.conf | grep 'MAN'
# MANDATORY_MANPATH
manpath_element
# MANPATH_MAP path_element manpath_element
# MANDB_MAP global_manpath [relative_catpath]
# every automatically generated MANPATH includes these fields
....(后面省略)....

删除掉批注之后的数据!
$ cat /etc/man_db.conf | grep 'MAN'| sed 's/#.*$//g'



MANDATORY_MANPATH
/usr/man
....(后面省略)....
# 从上面可以看出来,原本批注的数据都变成空白行啦!所以,接下来要删除掉空白行
$ cat /etc/man_db.conf | grep 'MAN'| sed 's/#.*$//g' | sed '/^$/d'
MANDATORY_MANPATH /usr/man
MANDATORY_MANPATH /usr/share/man
MANDATORY_MANPATH /usr/local/share/man
....(后面省略)....
```
###### 直接修改文件内容(危险动作)
```bash
$ sed -i 's/\.$/\!/g' regular_express.txt
# 上头的 -i 选项可以让你的 sed 直接去修改后面接的文件内容而不是由屏幕输出喔!
# 这个范例是用在取代!请您自行 cat 该文件去查阅结果啰
sed -i '$a # This is a test' regular_express.txt
```
sed 的『 -i 』选项可以直接修改文件内容,这功能非常有帮助!举例来说,如果你有一个 100 万行
的文件,你要在第 100 行加某些文字,此时使用 vim 可能会疯掉!因为文件太大了!那怎办?就利
用 sed 啊!透过 sed 直接修改/取代的功能,你甚至不需要使用 vim 去修订!
#### 扩展正则表达式
```bash
$ grep -v '^$' regular_express.txt | grep -v '^#'
```
需要使用到管线命令来搜寻两次!那么如果使用延伸型的正则表达式,我们可以简化为:
```bash
egrep -v '^$|^#' regular_express.txt
```


| RE 字符 | 意义与范例|
| ---- | ----- |
| + | 意义:重复『一个或一个以上』的前一个 RE 字符 |
| ? | 意义:『零个或一个』的前一个 RE 字符 |
| \| | 意义:用或( or )的方式找出数个字符串 |
| () | 意义:找出『群组』字符串 |
| ()+ | 意义:多个重复群组的判别 |

#### 文件的格式化与相关处理
##### 格式化打印：printf
```bash
$ printf '打印格式' 实际内容
选项与参数:
关于格式方面的几个特殊样式:
\a 警告声音输出
\b 退格键(backspace)
\f 清除屏幕 (form feed)
\n 输出新的一行
\r 亦即 Enter 按键
\t 水平的 [tab] 按键
\v 垂直的 [tab] 按键
\xNN NN 为两位数的数字,可以转换数字成为字符。
关于 C 程序语言内,常见的变数格式
%ns 那个 n 是数字, s 代表 string ,亦即多少个字符;
%ni 那个 n 是数字, i 代表 integer ,亦即多少整数字数;
%N.nf 那个 n 与 N 都是数字, f 代表 floating (浮点),如果有小数字数,
假设我共要十个位数,但小数点有两位,即为 %10.2f 啰!
```

```bash
$ printf '%s\t %s\t %s\t %s\t %s\t \n' $(cat printf.txt)
Name	 Chinese	 English	 Math	 Average
DmTsai	 80	 60	 92	 77.33
VBird	 75	 55	 80	 70.00
Ken	 60	 90	 70	 73.33
$ printf '%10s %5i %5i %5i %8.2f \n' $(cat printf.txt | grep -v Name)
DmTsai 80 60 92 77.33
VBird 75 55 80 70.00
Ken 60 90 70 73.33
```
printf 除了可以格式化处理之外,他还可以依据 ASCII 的数字与图形对应来显示数据(注 3)! 举
例来说 16 进位的 45 可以得到什么 ASCII 的显示图 (其实是字符)?
```bash
$ printf '\x45\n'
E
# 这东西也很好玩~他可以将数值转换成为字符,如果你会写 script 的话,
# 可以自行测试一下,由 20~80 之间的数值代表的字符是啥喔! ^_^
```
##### awk数据处理工具
awk 也是一个非常棒的数据处理工具!相较于 sed 常常作用于一整个行的处理, awk 则比较倾向
于一行当中分成数个『字段』来处理。
```bash
$ awk '条件类型 1{动作 1} 条件类型 2{动作 2} ...' filename
```
awk 主要是处理『每一行的字段内的数据』,而默认的『字段的分隔符为 "空格键" 或 "[tab]键" 』
```bash
last -n 5
jason    pts/0        j                Tue May 21 13:40   still logged in
jason    :1           :1               Tue May 21 13:40   still logged in
reboot   system boot  4.15.0-50-generi Tue May 21 13:40   still running
jason    pts/0        j                Tue May 21 09:21 - down   (03:00)
jason    :1           :1               Tue May 21 09:21 - 12:22  (03:00)

wtmp begins Fri May  3 22:10:08 2019
$ last -n 5 | awk '{print $1 "\t" $4"\t"$5}'
jason	Tue	May
jason	Tue	May
reboot	4.15.0-50-generi	Tue
jason	Tue	May
jason	Tue	May

wtmp	May	3
```
每一行的每个字段都是有变量名称的,那就是 $1, $2... 等变量名称

+ 读入第一行,并将第一行的资料填入 $0, $1, $2.... 等变数当中;
+ 依据 "条件类型" 的限制,判断是否需要进行后面的 "动作";
+ 做完所有的动作与条件类型;
+ 若还有后续的『行』的数据,则重复上面 1~3 的步骤,直到所有的数据都读完为止。

awk 是『以行为一次处理的单位』, 而『以字段为最小的处理单位』

| 变量名称| 代表意义|
| NF | 每一行 ($0) 拥有的字段总数 |
| NR | 目前 awk 所处理的是『第几行』数据 |
| FS | 目前的分隔字符,默认是空格键 |

awk 后续的所有动作是以单引号『 ' 』括住的,由于单引号与双引号都必须是成对的, 所以, awk 的格式内容如果想要以 print 打印时,记得非变量的文字部分,包含上一小节 printf 提到的格式中,都需要使用双引号来定义出来!因为单引号已经是 awk 的指令固定用法了!
```bash
last -n 5 | awk '{print $1 "\t lines: " NR"\t colums: " NF}'
jason	 lines: 1	 colums: 10
jason	 lines: 2	 colums: 10
reboot	 lines: 3	 colums: 10
jason	 lines: 4	 colums: 10
jason	 lines: 5	 colums: 10
	 lines: 6	 colums: 0
wtmp	 lines: 7	 colums: 7
```

+ awk 的逻辑运算字符
```bash
$ cat /etc/passwd | awk '{FS=":"} $3 < 10 {print $1 "\t" $3}'
root:x:0:0:root:/root:/bin/bash
daemon	1
bin	2
sys	3
sync	4
games	5
man	6
lp	7
mail	8
news	9
```
因为我们读入第一行的时候,那些变数 $1,$2... 默认还是以空格键为分隔的,所以虽然我们定义了 FS=":" 了, 但是却仅能在第二行后才开始生效。
```bash
$ cat /etc/passwd | awk 'BEGIN {FS=":"} $3 < 10 {print $1 "\t " $3}'
root 0
bin 1
daemon 2
......(以下省略)......
```
假设我有一个薪资数据表档名为 pay.txt ,内容是这样的:
```
Name     1st   2nd   3th
VBird  23000 24000 25000
DMTsai 21000 20000 23000
Bird2  43000 42000 41000
```
+ 第一行只是说明,所以第一行不要进行加总 (NR==1 时处理);
+ 第二行以后就会有加总的情况出现 (NR>=2 以后处理)
```bash
$ cat pay.txt |  awk 'NR==1{printf "%10s %10s %10s %10s %10s\n",$1,$2,$3,$4,"Total" }
NR>=2{total = $2 + $3 + $4
printf "%10s %10d %10d %10d %10.2f\n", $1, $2, $3, $4, total}'
      Name        1st        2nd        3th      Total
     VBird      23000      24000      25000   72000.00
    DMTsai      21000      20000      23000   64000.00
     Bird2      43000      42000      41000  126000.00
```
+ awk 的指令间隔:所有 awk 的动作,亦即在 {} 内的动作,如果有需要多个指令辅助时,可利用分号『;』间隔, 或者直接以 [Enter] 按键来隔开每个指令,例如上面的范例中,鸟哥共按了三次 [enter] 喔!
+ 逻辑运算当中,如果是『等于』的情况,则务必使用两个等号『==』!
+ 格式化输出时,在 printf 的格式设定当中,务必加上 \n ,才能进行分行!
+ 与 bash shell 的变量不同,在 awk 当中,变量可以直接使用,不需加上 $ 符号。

awk的动作内 {} 也是支持 if (条件) 的
```bash
$ cat pay.txt | \
> awk '{if(NR==1) printf "%10s %10s %10s %10s %10s\n",$1,$2,$3,$4,"Total"}
> NR>=2{total = $2 + $3 + $4
> printf "%10s %10d %10d %10d %10.2f\n", $1, $2, $3, $4, total}'
```
##### 文件比对工具
***同一个软件包的不同版本之间,比较配置文件与原始档的差异***
###### diff
diff 就是用在比对两个文件之间的差异的,并且是以行为单位来比对的!一般是用在 ASCII 纯文本
档的比对上。 由于是以行为比对的单位,因此 ***diff 通常是用在同一的文件(或软件)的新旧版本差异上***
```bash
$ mkdir -p /tmp/testpw <==先建立测试用的目录
$ cd /tmp/testpw
$ cp /etc/passwd passwd.old
$ cat /etc/passwd | sed -e '4d' -e '6c no six line' > passwd.new
# 注意一下, sed 后面如果要接超过两个以上的动作时,每个动作前面得加 -e 才行!
# 透过这个动作,在 /tmp/testpw 里面便有新旧的 passwd 文件存在了!
$ diff [-bBi] from-file to-file
选项与参数:
from-file :一个档名,作为原始比对文件的档名;
to-file :一个档名,作为目的比对文件的档名;
注意,from-file 或 to-file 可以 - 取代,那个 - 代表『Standard input』之意。
-b :忽略一行当中,仅有多个空白的差异(例如 "about me" 与 "about         me" 视为相同
-B :忽略空白行的差异。
-i :忽略大小写的不同。
$ diff passwwd.old passwd.new
4d3
< sys:x:3:3:sys:/dev:/usr/sbin/nologin
6c5
< games:x:5:60:games:/usr/games:/usr/sbin/nologin
---
> no six line
```
不要用 diff 去比对两个完全不相干的文件,因为比不出

diff 也可以比对整个目录下的差异

举例来说,我们想要了解一下不同的开机执行等级 (runlevel) 内容有啥不同?假设你已经知道执行等级 0 与 5 的启动脚本分别放置到/etc/rc0.d 及 /etc/rc5.d , 则我们可以将两个目录比对一下:
```bash
$ diff /etc/rc0.d/ /etc/rc5.d/
Only in /etc/rc0.d/: K01alsa-utils
Only in /etc/rc0.d/: K01avahi-daemon
```
###### cmp
cmp 主要也是在比对两个文件,他主要利用『字节』单位去比对, 因此,当然也可以比对 binary file
```bash
$ cmp passwd.old passwd.new
passwd.old passwd.new differ: byte 120, line 4
#第一个发现的不同点在第四行,而且字节数是在第 120 个字节处
```
###### patch
将旧的文件升级成为新的文件

```bash
$ diff -Naur passwd.old passwd.new > passwd.patch
$ cat passwd.patch
--- passwd.old 2015-07-14 22:37:43.322535054 +0800
+++ passwd.new 2015-07-14 22:38:03.010535054 +0800
@@ -1,9 +1,8 @@
<==新旧文件的信息
<==新旧文件要修改数据的界定范围,旧档在 1-9 行,新檔在 1-8 行
root:x:0:0:root:/root:/bin/bash
bin:x:1:1:bin:/bin:/sbin/nologin
daemon:x:2:2:daemon:/sbin:/sbin/nologin
-adm:x:3:4:adm:/var/adm:/sbin/nologin
<==左侧文件删除
lp:x:4:7:lp:/var/spool/lpd:/sbin/nologin
-sync:x:5:0:sync:/sbin:/bin/sync <==左侧文件删除
+no six line <==右侧新档加入
shutdown:x:6:0:shutdown:/sbin:/sbin/shutdown
halt:x:7:0:halt:/sbin:/sbin/halt
mail:x:8:12:mail:/var/spool/mail:/sbin/nologin
$ patch -pN < patch_file <==更新
$ patch -R -pN < patch_file <==还原
选项与参数:
-p :后面可以接『取消几层目录』的意思。
-R :代表还原,将新的文件还原成原来旧的版本。
patch -p0 < passwd.patch
patching file passwd.old
$ ll passwd*
-rw-r--r-- 1 jason jason 2433 5月  21 17:52 passwd.new
-rw-r--r-- 1 jason jason  515 5月  21 18:13 passwd.new.rej
-rw-r--r-- 1 jason jason 2433 5月  21 18:13 passwd.old
-rw-r--r-- 1 jason jason  514 5月  21 18:13 passwd.patch

```
这里会使用 -p0 呢?因为我们在比对新旧版的数据时是在同一个目录下, 因此不需要减去目
录
##### 文件打印设置：pr
如果你曾经使用过一些图形接口的文字处理软件的话,那么很容易发现,当我们在打印的时候, 可
以同时选择与设定每一页打印时的标头
```bash
$ pr /etc/man_db.conf
```
### 重点回顾

+ 正规表示法就是处理字符串的方法,他是以行为单位来进行字符串的处理行为;
+ 正规表示法透过一些特殊符号的辅助,可以让使用者轻易的达到『搜寻/删除/取代』某特定字符串的处理程序;
只要工具程序支持正规表示法,那么该工具程序就可以用来作为正规表示法的字符串处理之用;
+ 正规表示法与通配符是完全不一样的东西!通配符 (wildcard) 代表的是 bash 操作接口的一个功能, 但正规表示法则是一种字符串处理的表示方式!
+ 使用 grep 或其他工具进行正规表示法的字符串比对时,因为编码的问题会有不同的状态,因此, 你最好
将 LANG 等变量设定为 C 或者是 en 等英文语系!
+ 由于编码系统的不同,不同的语系 (LANG) 会造成正规表示法撷取资料的差异。因此可利用特殊符号如
[:upper:] 来替代编码范围较佳;
+ 基础正规表示法的特殊字符有: *, ., [], [-], [^], ^, $ 等!
+ 常见的支持正规表示法的工具软件有: grep , sed, vim 等等
+ printf 可以透过一些特殊符号来将数据进行格式化输出;
+ awk 可以使用『字段』为依据,进行数据的重新整理与输出;
+ 文件的比对中,可利用 diff 及 cmp 进行比对,其中 diff 主要用在纯文本文件方面的新旧版本比对
+ patch 指令可以将旧版数据更新到新版 (主要亦由 diff 建立 patch 的补丁来源文件)
