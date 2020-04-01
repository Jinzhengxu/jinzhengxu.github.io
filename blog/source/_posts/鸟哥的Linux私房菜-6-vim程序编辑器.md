---
title: Linux(6)-vim程序编辑器
date: 2019-04-23 23:26:15
tags:
  - Linux
  - vim
categories: 软件工具
copyright:
---
```bash
#     # ### #     #    ###  #####     ######  #######  #####  #######
#     #  #  ##   ##     #  #     #    #     # #       #     #    #
#     #  #  # # # #     #  #          #     # #       #          #
#     #  #  #  #  #     #   #####     ######  #####    #####     #
 #   #   #  #     #     #        #    #     # #             #    #
  # #    #  #     #     #  #     #    #     # #       #     #    #
   #    ### #     #    ###  #####     ######  #######  #####     #

```
上古神器--vim，功能简单却又强大。是Linux下文本编辑的不二之选(emacs教徒不要打我)逃。
#### vi与vim
vim是vi的高级版本，在vi的基础上添加来许多功能。其实不同的Linux发行版都会附带有很多不同的文本编辑器如emacs，nano，pico，joe等，但是vi还是占有统治地位：
+ ***许多UNIX-like系统都会基础集成vi编辑器，但是别的就不一定存在了*** ，所以vi的学习成本是值得我们付出的
+ ***许多软件的编辑接口都会选择vi*** 这一点的原因同上
+ ***vi有语法高亮的功能***
+ 程序简单，编辑速度相当快捷


#### vi的使用
vi 有三种模式：命令模式(conmmand mode)，编辑模式(insert mode)，命令行模式(command-line mode).

+ 命令模式(conmmand mode)
  使用vi打开一个文件，就直接进入命令模式了,这里可以使用上下左右控制光标，也可以删除整行，删除字符，也可以复制粘贴
+ 编辑模式(insert mode)
  在一般命令模式下，按下`i，I，o，O，a，A，r，R`就可以进入insert mode了，[Esc]可以推出insert mode。
+ 命令行模式(command-line mode).
  在一般命令模式下输入[:/?]中任意一个按钮，就可以将光标移动到最下面一行。

需要注意的是
***命令模式可以与命令行模式和编辑模式互换，但是命令行模式和编辑模式不能互换***

##### 简易执行范例
+ 使用vi进入一般命令模式
```bash
$ /usr/bin/vi .vimrc
# 现在大部分发行版中都默认使用vim替换vi，所以要
```

##### 按键说明
+ 第一部份:一般指令模式可用的按钮说明,光标移动、复制贴上、搜寻取代等

| 移动光标的方法                                   | 效果                                                                            |
| ------------------------------------------------ | ------------------------------------------------------------------------------- |
| h 或 向左箭头键(←)                               | 光标向左移动一个字符                                                            |
| j 或 向下箭头键(↓)                               | 光标向下移动一个字符                                                            |
| k 或 向上箭头键(↑)                               | 光标向上移动一个字符                                                            |
| l 或 向右箭头键(→)                               | 光标向右移动一个字符                                                            |
| 使用 "30j" 或 "30↓",即加上想要进行的次数(数字)后 | 向下移动30行g                                                                   |
| [Ctrl] + [f]                                     | 屏幕『向下』移动一页,相当于 [Page Down]按键 (常用)                              |
| [Ctrl] + [b]                                     | 屏幕『向上』移动一页,相当于 [Page Up] 按键 (常用)                               |
| [Ctrl] + [d]                                     | 屏幕『向下』移动半页                                                            |
| [Ctrl] + [u]                                     | 屏幕『向上』移动半页                                                            |
| +                                                | 光标移动到非空格符的下一行g                                                     |
| -                                                | 光标移动到非空格符的上一行g                                                     |
| n\<space>                                        | n 表示『数字』,例如 20 。按下数字后再按空格键,光标会向右移动这一行g的 n个字符。 |
| 0 或功能键[Home]                                 | 这是数字『 0 』:移动到这一行g的最前面字符处 (常用)                              |
| $ 或功能键[End]                                  | 移动到这一行g的最后面字符处(常用)                                               |
| H                                                | 光标移动到这个屏幕的最上方那一行g的第一个字符                                   |
| M                                                | 光标移动到这个屏幕的中央那一行g的第一个字符                                     |
| L                                                | 光标移动到这个屏幕的最下方那一行g的第一个字符                                   |
| G                                                | 移动到这个文件的最后一行g(常用)                                                 |
| nG                                               | n 为数字。移动到这个文件的第 n 行g。                                            |
| gg                                               | 移动到这个文件的第一行g,相当于 1G 啊! (常用)                                    |
| n\<Enter>                                        | n 为数字。光标向下移动 n 行g(常用)                                              |


| 搜寻与取代 | 效果 |
| ---------- | ---- |
| /word | 向光标之下寻找一个名称为 word 的字符串。(常用) |
| ?word | 向光标之上寻找一个字符串名称为 word 的字符串。|
| n | 这个 n 是英文按键。代表『重复前一个搜寻的动作』。|
| N | 这个 N 是英文按键。与 n 刚好相反,为『反向』进行前一个搜寻动作。|
| :n1,n2s/word1/word2/g| n1 与 n2 为数字。在第 n1 与 n2 行g之间寻找 word1 这个字符串,并将该字符串取代为 word2(常用)|
| :1,$s/word1/word2/g |从第一行g到最后一行g寻找 word1 字符串,并将该字符串取代为 word2(常用)|
| :1,$s/word1/word2/gc |从第一行g到最后一行g寻找 word1 字符串,并将该字符串取代为 word2 !且在取代前显示提示字符给用户确认 (confirm) 是否需要取代!(常用)|


| 删除、复制与贴上 | 效果                                                                                                                |
| ---------------- | ------------------------------------------------------------------------------------------------------------------- |
| x, X             | 在一行g字当中,x 为向后删除一个字符 (相当于 [del] 按键), X 为向前删除一个字符(相当于 [backspace] 亦即是退格键) (常用) |
| nx n             | 为数字,连续向后删除 n 个字符。举例来说,我要连续删除 10 个字符, 『10x』 。                                           |
| dd               | 删除游标所在的那一整行g(常用)                                                                                        |
| ndd              | n 为数字。删除光标所在的向下 n 行g,例如 20dd 则是删除 20 行g (常用)                                                   |
| d1G              | 删除光标所在到第一行g的所有数据                                                                                      |
| dG               | 删除光标所在到最后一行g的所有数据                                                                                    |
| d$               | 删除游标所在处,到该行g的最后一个字符                                                                                 |
| d0               | 那个是数字的 0 ,删除游标所在处,到该行g的最前面一个字符                                                               |
| yy | 复制游标所在的那一行g(常用)|
| nyy | n 为数字。复制光标所在的向下 n 行g,例如 20yy 则是复制 20 行g(常用)
| y1G | 复制光标所在行g到第一行g的所有数据
| yG | 复制光标所在行g到最后一行g的所有数据
| y0 | 复制光标所在的那个字符到该行g行首的所有数据
| y$ | 复制光标所在的那个字符到该行g行尾的所有数据
| p, P | p 为将已复制的数据在光标下一行g贴上,P 则为贴在游标上一行g! |
| J | 将光标所在列与下一列的数据结合成同一列|
| c | 重复删除多个数据,例如向下删除 10 列,[ 10cj ]|
| u | 复原前一个动作。(常用)|
| [Ctrl]+r | 重做上一个动作 |
| . | 意思是重复前一个动作的意思。 如果你想要重复删除、重复贴上等等动作,按下小数点『.』就好了! (常用) |

+ 第二部份:一般指令模式切换到编辑模式的可用的按钮说明

| 进入插入或取代的编辑模式 | 效果 |
| ------------------------ | ---- |
| i 进入插入模式(Insert mode) | i为『从目前光标所在处插入』(常用) |
| I 进入插入模式(Insert mode) | I为『在目前所在列的第一个非空格符处开始插入』(常用) |
| a 进入插入模式(Insert mode) | a为『从目前光标所在的下一个字符处开始插入』(常用) |
| A 进入插入模式(Insert mode) | A为『从光标所在列的最后一个 字符处开始插入』(常用) |
| o 进入插入模式(Insert mode) | o 为『在目前光标所在的下一列处插入新的一列』(常用)|
| O 进入插入模式(Insert mode) | O 为 在目前光标所在处的上一列插入新的一列(常用)|
| r 进入取代模式(Replace mode)| r 只会取代光标所在的那一个字符一次(常用)|
| R 进入取代模式(Replace mode)| R 会一直取代光标所在的文字,直到按下 ESC 为止;(常用)|
| [Esc] | 退出编辑模式,回到一般指令模式中(常用)|

+ 第三部份:一般指令模式切换到指令列模式的可用按钮说明

| 指令列模式的储存、离开等指令 | 效果 |
| ---------------------------- | ---- |
| :w | 将编辑的数据写入硬盘文件中(常用) |
| :w!| 若文件属性为『只读』时,强制写入该文件|
| :q | 离开 vi (常用) |
| :q! | 若曾修改过文件,又不想储存,使用 ! 为强制离开不储存文件。|
| :wq |储存后离开,若为 :wq! 则为强制储存后离开 (常用)|
| ZZ 这是大写的 Z 喔!若文件没有更动,则不储存离开,若文件已经被更动过,则储存后离开 |
| :w [filename] | 将编辑的数据储存成另一个文件(类似另存新档) |
| :r [filename] | 在编辑的数据中,读入另一个文件的数据。亦即将 『filename』 这个文件内容加到游标所在列后面 |
| :n1,n2 w [filename] | 将 n1 到 n2 的内容储存成 filename 这个文件|
| :! command | 暂时离开 vi 到指令列模式下执行 command 的显示结果 |

| vim 环境的变更 | 效果 |
| -------------- | ---- |
| :set nu | 显示行号,设定之后,会在每一列的前缀显示该列的行号 |
| :set nonu | 与 set nu 相反,为取消行号! |


##### vim的缓存，恢复与打开时的警告信息
当我们在使用 vim 编辑时, vim 会在与被编辑的文件的目录下,再建立一个名为 `.filename.swp` 的文件。

For example,我们使用vim打开一个已经存在的文件。
```bash
$ vim config.json
# 此时会进入到 vim 的画面,请在 vim 的命令模式下按下『 [ctrl]-z 』的组合键

[1]+  Stopped                 vim config.json
$ ls -alh | grep "config"
-rw-r--r--  1 jason jason  767 4月  16 13:43 config.json
-rw-r--r--  1 jason jason  12K 5月   6 08:39 .config.json.swp <==暂存文件
# 按下『 [ctrl]-z 』vim在后台中继续执行，我们可以模拟一种更极端的情况，断电
$ kill -9 %1

[1]+  Stopped                 vim -u ~/.defaultvim config.json
$ ls -alh | grep "config"
-rw-r--r--  1 jason jason  767 4月  16 13:43 config.json
-rw-r--r--  1 jason jason  12K 5月   6 08:39 .config.json.swp <==暂存文件依然存在
# 由于 vim 的工作被不正
# 常的中断,导致暂存盘无法藉由正常流程来结束,
# 所以暂存档就不会消失,而继续保留下来。
$ vim -u ~/.defaultvim config.json

E325: ATTENTION
Found a swap file by the name ".config.json.swp"
          owned by: jason   dated: Mon May  6 08:39:13 2019
         file name: ~jason/v2ray-linux-64/config.json <==这个暂存文件属于哪个实际的文件
          modified: no
         user name: jason   host name: jason-ThinkPad-X1-Carbon-6th
        process ID: 6350
While opening file "config.json"
             dated: Tue Apr 16 13:43:18 2019

(1) Another program may be editing the same file.  If this is the case,
    be careful not to end up with two different instances of the same
    file when making changes.  Quit, or continue with caution.
(2) An edit session for this file crashed.
    If this is the case, use ":recover" or "vim -r config.json"
    to recover the changes (see ":help recovery").
    If you did this already, delete the swap file ".config.json.swp"
    to avoid this message.
# 问题一:可能有其他人或程序同时在编辑这个文件:
# 由于 Linux 是多人多任务的环境,因此很可能有很多人同时在编辑同一个文件。
# 如果在多人共同编辑的情况下, 万一大家同时储存,那么这个文件的内容将会变的乱七八糟!
# 为了避免这个问题,因此 vim 会出现这个警告窗口解决的方法则是:
#　１．找到另外那个程序或人员,请他将该 vim 的工作结束,然后你再继续处理。
#　２．如果你只是要看该文件的内容并不会有任何修改编辑的行为,那么可以选择开启成为只读(O)文件,
#　亦即上述画面反白部分输入英文『 o 』即可,其实就是 [O]pen Read-Only 的选项啦!
#　问题二:在前一个 vim 的环境中,可能因为某些不知名原因导致 vim 中断 (crashed):
# 如果你之前的 vim 处理动作尚未储存,此时你应该要按下『R』
# ,亦即使用 (R)ecover 的项目，离开 vim 后
# 还得要自行删除 .man_db.conf.swp 才能避免每次打开这个文件都会出现这样的警告!
Swap file ".config.json.swp" already exists!
[O]pen Read-Only, (E)dit anyway, (R)ecover, (D)elete it, (Q)uit, (A)bort:
# [O]pen Read-Only:打开此文件成为只读档, 可以用在你只是想要查阅该文件内容并不想要进行编辑行为时。
# (E)dit anyway:还是用正常的方式打开你要编辑的那个文件, 并不会载入暂存盘的内容。不过很容易出现两个使用者互相改变对方的文件等问题!
# (R)ecover:就是加载暂存盘的内容,用在你要救回之前未储存的工作。不过当你救回来并且储存离开 vim后,还是要手动自行删除那个暂存档喔!
# (D)elete it:你确定那个暂存档是无用的!那么开启文件前会先将这个暂存盘删除! 这个动作其实是比较常
# (Q)uit:按下 q 就离开 vim ,不会进行任何动作回到命令提示字符。
# (A)bort:忽略这个编辑行为,感觉上与 quit 非常类似! 也会送你回到命令提示字符!
```

#### vim的额外功能
##### 可视区块
区块选择(Visual Block),当我们按下 v 或者 V 或者 [Ctrl]+v 时, 这个时候光标移动过的地方就会开始反白,这三个按键的意义分别是:

| 区块选择的按键 | 意义                                 |
| -------------- | ------------------------------------ |
| v              | 字符选择,会将光标经过的地方反白选择! |
| V              | 列选择,会将光标经过的列反白选择!     |
| [Ctrl]+v       | 区块选择,可以用长方形的方式选择资料  |
| y              | 将反白的地方复制起来                 |
| d              | 将反白的地方删除掉                   |
| p              | 将刚刚复制的区块,在游标所在处贴上!   |

##### 多文件编辑

| 多文件编辑的按键 | 意义                              |
| ---------------- | --------------------------------- |
| :n               | 编辑下一个文件                    |
| :N               | 编辑上一个文件                    |
| :files           | 列出目前这个 vim 的开启的所有文件 |
##### 多窗口功能

| 多窗口情况下的按键 | 功能 |
| ------------------ | ---- |
| :sp [filename] | 开启一个新窗口,如果有加 filename, 表示在新窗口开启一个新文件,否则表示两个窗口为同一个文件内容(同步显示)。|
| [ctrl]+w+j,[ctrl]+w+↓ | 光标可移动到下方的窗口　|
| [ctrl]+w+k,[ctrl]+w+↑ |　光标移动到上面的窗口 |
| [ctrl]+w+q | 其实就是 :q 结束离开啦! |

##### vim的关键词补全功能

| 组合按钮 | 补齐的内容 |
| -------- | ---------- |
| [ctrl]+x -> [ctrl]+n | 透过目前正在编辑的这个『文件的内容文字』作为关键词,予以补齐 |
| [ctrl]+x -> [ctrl]+f | 以当前目录内的『文件名』作为关键词,予以补齐 |
| [ctrl]+x -> [ctrl]+o | 以扩展名作为语法补充,以 vim 内建的关键词,予以补齐 |

##### vim环境设置与记录：~/.vimrc和~/.viminfo

vim 会主动的将你曾经做过的行为登录下来,那个记录动作的文件就是: `~/.viminfo`

| vim 的环境设定参数                | 效果                                                                                                     |
| --------------------------------- | -------------------------------------------------------------------------------------------------------- |
| :set nu :set nonu                 | 就是设定与取消行号                                                                                       |
| :set hlsearch :set nohlsearch     | hlsearch 就是 high light search(高亮度搜寻)                                                              |
| :set autoindent :set noautoindent | 是否自动缩排?autoindent 就是自动缩排。                                                                   |
| :set backup                       | 是否自动储存备份档?                                                                                      |
| :set ruler                        | 显示或不显示右下角的一些状态栏说明                                                                       |
| :set showmode                     | 这个则是,是否要显示 --INSERT-- 之类的字眼在左下角的状态栏。                                              |
| :set backspace=(012)              | 当 backspace 为 2 时,就是可以删除任意值;0 或 1 时,仅可删除刚刚输入的字符, 而无法删除原本就已经存在的文字 |
| :set all                          | 显示目前所有的环境参数设定值                                                                             |
| :set                              | 显示与系统默认值不同的设定参数, 一般来说就是你有自行变动过的设定参数啦!                                  |
| :syntax on :syntax off            | 是否依据程序相关语法显示不同颜色?                                                                        |
| :set bg=dark :set bg=light        | 可用以显示不同的颜色色调,预设是『 light 』。                                                             |

##### vim常用命令示意图
![EB5Dbt.jpg](https://s2.ax1x.com/2019/05/06/EB5Dbt.jpg)
#### 其他vim使用注意事项
##### 中文编码的问题:q

```bash
1. 你的 Linux 系统默认支持的语系数据:这与 /etc/locale.conf 有关;
2. 你的终端界面 (bash) 的语系: 这与 LANG, LC_ALL 这几个变数有关;
3. 你的文件原本的编码;
4. 开启终端机的软件,例如在 GNOME 底下的窗口接口。
```
解决
```bash
$ LANG=zh_CN.gb18030
$ export LC_ALL=zh_CN.gb18030
```
##### DOS与Linux的换行符
DOS 与 Linux 断行字符的不同。`DOS` 使用的断行字符为 `^M$` ,我们称为 `CR` 与 `LF` 两个符号。 而在 Linux 底下,则是仅有 `LF ($)` 这个断行符号。

Linux 底下的指令在开始执行时,他的判断依据是 『Enter』,而 Linux 的 Enter 为`LF` 符号, 不过,由于 `DOS` 的断行符号是 `CRLF` ,也就是多了一个 `^M` 的符号出来, 在这样的
情况下,如果是一个 `shell script` 的程序文件,将可能造成『程序无法执行』的状态。
```bash
$ dos2unix [-kn] file [newfile]
$ unix2dos [-kn] file [newfile]
选项与参数:
-k :保留该文件原本的 mtime 时间格式 (不更新文件上次内容经过修订的时间)
-n :保留原本的旧档,将转换后的内容输出到新文件,如: dos2unix -n old new
范例一:将 /etc/man_db.conf 重新复制到 /tmp/vitest/ 底下,并将其修改成为 dos 断行
$ cd /tmp/vitest
$ cp -a /etc/man_db.conf .
$ ll man_db.conf
-rw-r--r--. 1 root root 5171 Jun 10
2014 man_db.conf
$ unix2dos -k man_db.conf
unix2dos: converting file man_db.conf to DOS format ...
# 屏幕会显示上述的讯息,说明断行转为 DOS 格式了!
$ ll man_db.conf
-rw-r--r--. 1 dmtsai dmtsai 5302 Jun 10
2014 man_db.conf
# 断行字符多了 ^M ,所以容量增加了!
范例二:将上述的 man_db.conf 转成 Linux 断行字符,并保留旧文件,新档放于 man_db.conf.linux
$ dos2unix -k -n man_db.conf man_db.conf.linux
dos2unix: converting file man_db.conf to file man_db.conf.linux in Unix format ...
$ ll man_db.conf*
-rw-r--r--. 1 dmtsai dmtsai 5302 Jun 10 2014 man_db.conf
-rw-r--r--. 1 dmtsai dmtsai 5171 Jun 10 2014 man_db.conf.linux$ file man_db.conf*
man_db.conf:[dmtsai@study vitest]
ASCII text, with CRLF line terminators
# 很清楚说明是 CRLF 断行!
man_db.conf.linux: ASCII text
```
##### 语系编码转换
使用`iconv`命令可以快捷的完成文件编码的转换
```bash
$ iconv --list
The following list contains all the coded character sets known.  This does
not necessarily mean that all combinations of these names can be used for
the FROM and TO command line parameters.  One coded character set can be
listed with several different names (aliases).

  437, 500, 500V1, 850, 851, 852, 855, 856, 857, 858, 860, 861, 862, 863, 864,
  865, 866, 866NAV, 869, 874, 904, 1026, 1046, 1047, 8859_1, 8859_2, 8859_3,
  8859_4, 8859_5, 8859_6, 8859_7, 8859_8, 8859_9, 10646-1:1993,
  10646-1:1993/UCS4, ANSI_X3.4-1968, ANSI_X3.4-1986, ANSI_X3.4,.......
$ iconv -f 原本编码 -t 新编码 filename [-o newfile]
选项与参数:
--list :列出 iconv 支持的语系数据
-f :from ,亦即来源之意,后接原本的编码格式;
-t :to ,亦即后来的新编码要是什么格式;
 -o file:如果要保留原本的文件,那么使用 -o 新档名,可以建立新编码文件。
```
不过如果是要将正体中文的 utf8 转成简体中文的 utf8 编码时,那就得费些功夫了! 举例来说,如
果要将刚刚那个 vi.utf8 转成简体的 utf8 时,可以这样做:
```bash
$ iconv -f utf8 -t big5 vi.utf8 | \
> iconv -f big5 -t gb2312 | iconv -f gb2312 -t utf8 -o vi.gb.utf8
```
### 重点回顾
+ Linux 底下的配置文件多为文本文件,故使用 vim 即可进行设定编辑;
+ vim 可视为程序编辑器,可用以编辑 shell script, 配置文件等,避免打错字;
+ vi 为所有 unix like 的操作系统都会存在的编辑器,且执行速度快速;
+ vi 有三种模式,一般指令模式可变换到编辑与指令列模式,但编辑模式与指令列模式不能互换;
+ 常用的按键有 i, [Esc], :wq 等;
+ vi 的画面大略可分为两部份,(1)上半部的本文与(2)最后一行的状态+指令列模式;
+ 数字是有意义的,用来说明重复进行几次动作的意思,如 5yy 为复制 5 列之意;
+ 光标的移动中,大写的 G 经常使用,尤其是 1G, G 移动到文章的头/尾功能!
+ vi 的取代功能也很棒! :n1,n2s/old/new/g 要特别注意学习起来;
+ 小数点『 . 』为重复进行前一次动作,也是经常使用的按键功能!
+ 进入编辑模式几乎只要记住: i, o, R 三个按钮即可!尤其是新增一列的 o 与取代的 R
+ vim 会主动的建立 swap 暂存档,所以不要随意断线!
+ 如果在文章内有对齐的区块,可以使用 [ctrl]-v 进行复制/贴上/删除的行为
+ 使用 :sp 功能可以分区窗口
+ 若使用 vim 来撰写网页,若需要 CSS 元素数据,可透过 [crtl]+x, [crtl]+o 这两个连续组合按键来取得关键词
+ vim 的环境设定可以写入在 ~/.vimrc 文件中;
+ 可以使用 iconv 进行文件语系编码的转换
+ 使用 dos2unix 及 unix2dos 可以变更文件每一列的行尾断行字符。
