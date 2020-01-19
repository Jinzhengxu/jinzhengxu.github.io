---
title: Linux(5)-文件与文件系统的压缩
date: 2019-04-18 14:43:28
tags:
  - Linux
  - linux
  - 文件压缩
categoties: 拉普拉斯妖
copyright:
---

Linux下一切都是文件，所以其实不同压缩文件的的文件扩展名对于Linux来说并没有什么区别，但是可以方便系统的操作这也就是方便人类阅读和管理。
#### 压缩文件的用途与技术
我们知道一个字节有8个bit，假设一个数字只有最右侧的bit为1，剩下的位都为0，这样就有可以压缩的地方，我们可以将剩下的7个0丢出去。这样就完成了压缩的目的，减小了文件的容量。还有一种可能是文件中有连续的100个1，我们可以将其压缩尾『100个1』而不是真的记录100个1。

***压缩后文件与压缩前文件的比值就称为压缩比***
#### Linux系统常见的压缩命令
通过不同压缩文件的扩展名，我们可以知道文件的压缩方式，并选择合适的文件解压缩方式。

Linux下的压缩文件扩展名一般有：
```bash
*.Z        compress压缩文件，现在基本没有了
*.zip      zip程序压缩的文件
*.gz       gzip程序压缩的文件
*.bz2      bzip2程序压缩的文件
*.xz       xz程序压缩的文件
*.tar      tar程序打包的文件
*.tar.gz   tar程序打包的文件，并经过gzip的压缩
*.tar.bz2  tar程序打包的文件，并经过bzip2的压缩
*.tar.xz   tar程序打包的文件，并经过xz的压缩
```

##### gzip，zcat/zmore/zless/zgrep
下面用内核文件演示一下过程
```bash
$ gzip [-cdtv#] 文件名
$ zcat 文件名.gz
选项与参数:
 -c : 将压缩的数据输出到屏幕上，可以通过数据流重定向来处理
 -d : 解压缩
 -t : 检验一个压缩文件的一致性，尾呢见有无错误
 -v : 显示出压缩比
 -# : # 为数字的意思1-9，-1最快但是压缩比最差，默认是-6
$ gzip -v vmlinuz-4.15.0-46-generic
vmlinuz-4.15.0-46-generic:	  4.4% -- replaced with vmlinuz-4.15.0-46-generic.gz
$ zat/zmore/zless 文本文件
# 如果原来的文件是文本文件，这三个命令可以将压缩文件中的内容读出来
$ gzip -d services.gz
# 与windows不同的是，Linux解压和压缩都会将源文件删除，只保留操作后的文件
$ gzip -9 -c services > services.gz
# 这样就可以保留原有的文件
# -c负责将压缩的文件内容输出大屏幕上，但是通过>我们可以将内容输入到文件里
$ zgrep -n "http" services.gz #这样可以查询压缩文件中的关键词
7:# Updated from http://www.iana.org/assignments/port-numbers and other
8:# sources like http://www.freebsd.org/cgi/cvsweb.cgi/src/etc/services .
53:http		80/tcp		www		# WorldWideWeb HTTP
138:https		443/tcp				# http protocol over TLS/SSL
419:http-alt	8080/tcp	webcache	# WWW caching service
420:http-alt	8080/udp
$ znew 文件
# 将老的*.Z文件转换为gzip文件
```
##### bzip2，bzcat/bzmore/bzless/bzgrep
bzip2可以获得比gzip更好的压缩比
```bash
$ bzip2 [-cdkzv#] 文件名
$ bcat 文件名.bz2
选项与参数:
-c : 将压缩的数据输出到屏幕上，可以通过数据流重定向来处理
-d : 解压缩
-k : 保留原始文件不删除
-t : 检验一个压缩文件的一致性，尾呢见有无错误
-v : 显示出压缩比
-# : # 为数字的意思1-9，-1最快但是压缩比最差，默认是-6
```
但是对于大容量文件来说，bzip2会耗费更多的时间。
##### xz,xzcat/xzmore/xzless/xzgrep
xz的压缩比会更高
```bash
$ xz [-dtlkc#] 文件名
$ xcat 文件名.xz
选项与参数：
-c : 将压缩的数据输出到屏幕上，可以通过数据流重定向来处理
-d : 解压缩
-k : 保留原始文件不删除
-l : 列出压缩文件的相关信息
-t : 检验一个压缩文件的一致性，尾呢见有无错误
-# : # 为数字的意思1-9，-1最快但是压缩比最差，默认是-6
$ xz -l services.xz
Strms  Blocks   Compressed Uncompressed  Ratio  Check   Filename
    1       1      7,052 B     18.7 KiB  0.368  CRC64   services.xz
```

我们可以比较一下三个命令的时间：
```bash
$ time gzip -c services > services.gz

real	0m0.003s
user	0m0.002s
sys	0m0.001s
$ time bzip2 -c services > services.bz2

real	0m0.003s
user	0m0.003s
sys	0m0.000s
$ time xz -c services > services.xz

real	0m0.004s
user	0m0.001s
sys	0m0.004s
```
可以看到三个命令的不同用时。

#### 打包命令：tar
上面的介绍的压缩命令都只能针对单个文件操作，如果有多个文件或者一整个目录都需要压缩的话，我们就需要tar打包命令。
```bash
# 这里只有一部分的tar参数和选项，剩下的可以通过man 来查询
$ tar [-z|-j|-J] [cv] [-f 待建立的新文件名] filename... # 打包与压缩
$ tar [-z|-j|-J] [tv] [-f 已有的tar文件名]  # 查看文件名
$ tar [-z|-j|-J] [xv] [-f 已有的新文件名] [-C directory] # 解压
选项与参数：
-c : 建立打包文件
-t : 查看打包文件含有哪些文件名
-x : 解包或解压缩的功能，通过-C指定文件解压缩的目录
-z : 通过gzip对文件进行解压缩
-j : 通过bzip2对文件进行解压缩
-J : 通过x对文件进行解压缩
-v : 在压缩解压缩的过程中将正在处理的文件名显示出来
-f : -f后面接立刻要被处理的文件名
-C : 指定解压目录
-p : 保留备份文件的原本权限和数据
-P : 保留绝对路径
--exclude=FILE : 不对FILE打包
```
+ 使用tar备份/etc目录

```bash
$ time tar -zpcv -f /root/etc.tar.gz /etc
tar: Removing leading / from member names
.......
real	0m1.130s
user	0m0.895s
sys	0m0.133s
$ time tar -jpcv -f /root/etc.tar.bz2 /etc
tar: Removing leading / from member names
.......
real	0m5.890s
user	0m5.830s
sys	0m0.104s
$ time tar -jpcv -f /root/etc.tar.bz2 /etc
tar: Removing leading / from member names
.......
real	0m8.008s
user	0m7.957s
sys	0m0.232s
$ ll -h /root/etc*
-rw-r--r-- 1 root root 2.3M 4月  23 15:33 /root/etc.tar.bz2
-rw-r--r-- 1 root root 2.9M 4月  23 15:31 /root/etc.tar.gz
-rw-r--r-- 1 root root 1.8M 4月  23 15:36 /root/etc.tar.xz
$  du -sm /etc
34	/etc #原本的文件占有34m
```
+ 查看tar文件内部的数据内容

```bash
$ tar -jtv -f /root/etc.tar.bz2
-rw-r--r-- root/root        77 2018-01-18 06:35 etc/sysctl.d/10-console-messages.conf
-rw-r--r-- root/root       506 2018-01-18 06:35 etc/sysctl.d/10-zeropage.conf
-rw-r--r-- root/root       257 2018-01-18 06:35 etc/sysctl.d/10-link-restrictions.conf
-rw-r--r-- root/root      1184 2018-01-18 06:35 etc/sysctl.d/10-magic-sysrq.conf
```
这里我们可以发现警告信息`tar: Removing leading / from member names`的情况，每个文件都木得根目录，因为如果带有根目录你解压这个文件的时候，解压出来的文件就会覆盖根目录下的文件。-P选项代表你确实要保留压缩文件的根目录。

+ 将备份的内容解压缩，并指定特殊的目录
```bash
$ tar -jxv -f /root/etc.tar.bz2 -C /tmp
```

+ 仅解开单一文件的方法
```bash
$ tar -jtv -f /root/etc.tar.bz2 | grep 'shadow'
-rw-r----- root/shadow     834 2019-03-27 21:47 etc/gshadow-
-rw-r----- root/shadow     848 2019-03-27 21:47 etc/gshadow
-rw-r----- root/shadow    1356 2019-03-27 21:47 etc/shadow-
-rw-r----- root/shadow    1382 2019-03-27 21:47 etc/shadow
$ tar -jxv -f /root/etc.tar.bz2 etc/shadow
etc/shadow
```

+ 打包目录，但是不包含目录下某些文件
不要以`/root/etc*`开头的文件，而且文件也不能自己打包自己（因为在一个目录下）
```bash
$  tar -jcv -f /root/system.tar.bz2 --exclude=/root/etc* --exclude=/root/system.tar.bz2 /etc /root
```
+ 仅备份比某个时刻还要新的文件
`--newer`后面的日期包含mtime和ctime，`--newer-mtime`值包含mtime
```bash
$ find /etc -newer /etc/passwd
$ ll /etc/passwd
-rw-r--r-- 1 root root 2580 3月  27 21:47 /etc/passwd
$ tar -jcv -f /root/etc.newer.then.passwd.tar.bz2 --newer-mtime="2019/03/27" /etc/*
$ tar -jtv -f /root/etc.newer.then.passwd.tar.bz2 | grep -v '/$'
# 这个命令可以吸纳是出tar包中所有不以/结尾的文件
```
+ tarfile

  + 只是使用tar来打包的文件为 ***tarfile*** `tar -cv -f file.tar`
  + 打包并压缩的为 ***tarball***

将文件备份到磁带中无法使用cp命令，因为磁带是一次性读写设备，这时可以`tar -cv -f /dev/st0 /home /root /etc`

+ 将文件一边打包一边解压
```bash
$ tar -cvf - /etc | tar -xvf -
```
#### XFS文件系统的备份与还原
##### XFS文件系统备份xfsdump
xfdump的一个特性是可以进行增量备份，这样可以节省很多时间，也就在第一次进行系统备份之后，之后在备份时我们都可以选择增量备份。
 + 第一次备份一定是完整备份，第一次备份在xfsdump中被认定为level0
 + xfsdump不支持没有挂载的文件系统的备份，只能备份已经被挂载的文件系统
 + 必须使用root权限
 + 只能备份xfs文件系统
 + xfsdump备份的数据只能有xfsrestore解析
 + 不能备份两个有相同UUID的文件

```bash
$ xfsdump [-L S_label] [-M M_label] [-l #] [-f 备份文件] 待备份数据
$ xfsdump -I
选项与参数：
 -L : 对文件系统的说明
 -M : 对储存媒介的说明
 -l : 指定等级，0-9，0为完整备份
 -f : 接产生的文件
 -I : 从/var/lib/xfsdump/inventory列出目前备份的信息状态
```
+ xfsdump备份完整的文件系统
```bash
# 1. 先确定 /boot 是独立的文件系统喔!
# df -h /boot
Filesystem Size
/dev/vda2 1014M
Used Avail Use% Mounted on
131M
884M
13% /boot
# 挂载 /boot 的是 /dev/vda 装置!
# 看!确实是独立的文件系统喔! /boot 是挂载点!
# 2. 将完整备份的文件名记录成为 /srv/boot.dump :
# xfsdump -l 0 -L boot_all -M boot_all -f /srv/boot.dump /boot
xfsdump -l 0 -L boot_all -M boot_all -f /srv/boot.dump /boot
xfsdump: using file dump (drive_simple) strategy
xfsdump: version 3.1.4 (dump format 3.0) - type ^C for status and control
xfsdump: level 0 dump of study.centos.vbird:/boot # 开始备份本机/boot 系统
xfsdump: dump date: Wed Jul # 备份的时间
1 18:43:04 2015
xfsdump: session id: 418b563f-26fa-4c9b-98b7-6f57ea0163b1 # 这次 dump 的 ID
xfsdump: session label: "boot_all" # 简单给予一个名字记忆
xfsdump: ino map phase 1: constructing initial dump list # 开始备份程序
xfsdump: ino map phase 2: skipping (no pruning necessary)
xfsdump: ino map phase 3: skipping (only one dump stream)
xfsdump: ino map construction complete
xfsdump: estimated dump size: 103188992 bytes
xfsdump: creating dump session media file 0 (media 0, file 0)
xfsdump: dumping ino map
xfsdump: dumping directories
xfsdump: dumping non-directory files
xfsdump: ending media file
xfsdump: media file size 102872168 bytes
xfsdump: dump size (non-dir files) : 102637296 bytes
xfsdump: dump complete: 1 seconds elapsed
xfsdump: Dump Summary:xfsdump:
stream 0 /srv/boot.dump OK (success)
xfsdump: Dump Status: SUCCESS
# 在指令的下达方面,你也可以不加 -L 及 -M 的,只是那就会进入互动模式,要求你 enter!
# 而执行 xfsdump 的过程中会出现如上的一些讯息,您可以自行仔细的观察!
# ll /srv/boot.dump
-rw-r--r--. 1 root root 102872168 Jul
1 18:43 /srv/boot.dump
# ll /var/lib/xfsdump/inventory
-rw-r--r--. 1 root root 5080 Jul 1 18:43 506425d2-396a-433d-9968-9b200db0c17c.StObj
-rw-r--r--. 1 root root 312 Jul 1 18:43 94ac5f77-cb8a-495e-a65b-2ef7442b837c.InvIndex
-rw-r--r--. 1 root root 576 Jul 1 18:43 fstab
# 使用了 xfsdump 之后才会有上述 /var/lib/xfsdump/inventory 内的文件产生喔!
```
+ 用xfsdump进行增量备份
```bash
# 0. 看一下有没有任何文件系统被 xfsdump 过的资料?
# xfsdump -I
file system 0:
fs id:
94ac5f77-cb8a-495e-a65b-2ef7442b837c
session 0:
     mount point: study.centos.vbird:/boot
     device: study.centos.vbird:/dev/vda2
     time: Wed Jul
     1 18:43:04 2015
     session label: "boot_all"
     session id: 418b563f-26fa-4c9b-98b7-6f57ea0163b1
     level: 0
     resumed: NO
     subtree: NO
     streams: 1
     stream 0:
             pathname: /srv/boot.dump
             start: ino 132 offset 0
             end: ino 2138243 offset 0
             interrupted: NO
             media files: 1
             media file 0:
                     mfile index: 0
                     mfile type: data
                     mfile size: 102872168
                     mfile start: ino 132 offset
                     mfile end: ino 2138243 offset 0
                     media label: "boot_all"
                     media id: a6168ea6-1ca8-44c1-8d88-95c863202eab
xfsdump: Dump Status: SUCCESS
# 我们可以看到目前仅有一个 session 0 的备份资料而已!而且是 level 0 喔!
# 1. 先恶搞一下,建立一个大约 10 MB 的文件在 /boot 内:
# dd if=/dev/zero of=/boot/testing.img bs=1M count=10
10+0 records in
10+0 records out
10485760 bytes (10 MB) copied, 0.166128 seconds, 63.1 MB/s
# 2. 开始建立差异备份档,此时我们使用 level 1 吧:
# xfsdump -l 1 -L boot_2 -M boot_2 -f /srv/boot.dump1 /boot
....(中间省略)....
# ll /srv/boot*
-rw-r--r--. 1 root root 102872168 Jul 1 18:43 /srv/boot.dump
-rw-r--r--. 1 root root 1 18:46 /srv/boot.dump1
10510952 Jul
# 看看文件大小,岂不是就是刚刚我们所建立的那个大文件的容量吗? ^_^
# 3. 最后再看一下是否有记录 level 1 备份的时间点呢?
# xfsdump -I
file system 0:
fs id:
94ac5f77-cb8a-495e-a65b-2ef7442b837c
session 0:
mount point: study.centos.vbird:/boot
device: study.centos.vbird:/dev/vda2
....(中间省略)....
session 1:
mount point: study.centos.vbird:/boot
device: study.centos.vbird:/dev/vda2
time: Wed Jul
1 18:46:21 2015
session label: "boot_2"
session id: c71d1d41-b3bb-48ee-bed6-d77c939c5ee8
level: 1
resumed: NO
subtree: NO
streams:
1
stream 0:
pathname: /srv/boot.dump1
start: ino 455518 offset 0
```
##### XFS文件系统还原xfsrestore
```bash
$ xfsrestore -I <==用来察看备份文件资料
$ xfsrestore [-f 备份档] [-L S_label] [-s] 待复原目录 <==单一文件全系统复原
$ xfsrestore [-f 备份文件] -r 待复原目录
<==透过累积备份文件来复原
系统
$ xfsrestore [-f 备份文件] -i 待复原目录
<==进入互动模式
选项与参数:
-I :跟 xfsdump 相同的输出!可查询备份数据,包括 Label 名称与备份时间等
-f :后面接的就是备份档!企业界很有可能会接 /dev/st0 等磁带机!我们这里接档名!
-L :就是 Session 的 Label name 喔!可用 -I 查询到的数据,在这个选项后输入!
-s :需要接某特定目录,亦即仅复原某一个文件或目录之意!
-r :如果是用文件来储存备份数据,那这个就不需要使用。如果是一个磁带内有多个文件,
需要这东西来达成累积复原
-i

:进入互动模式,进阶管理员使用的!一般我们不太需要操作它!
```
+ 用 xfsrestore 观察 xfsdump 后的备份数据内容
```bash
$ xfsrestore -I
```
+ 简单复原 level 0 的文件系统
```bash
$ xfsrestore -f /srv/boot.dump -L boot_all /boot
# 直接复原的结果就是:『同名的文件会被覆盖,其他系统内新的文件会被保留』
# 仅复原备份档内的 grub2 到 /tmp/boot2/ 里头去!
$ mkdir /tmp/boot2
$ xfsrestore -f /srv/boot.dump -L boot_all -s grub2 /tmp/boot2
```
+ 复原累积备份资料
```bash
# 继续复原 level 1 到 /tmp/boot 当中!
$ xfsrestore -f /srv/boot.dump1 /tmp/boot
```
+ 仅还原部分文件的 xfsrestore 互动模式
```bash
# 1. 先进入备份文件内,准备找出需要备份的文件名数据,同时预计还原到 /tmp/boot3 当中!
$ mkdir /tmp/boot3
$ xfsrestore -f /srv/boot.dump -i /tmp/boot3
========================== subtree selection dialog ==========================the following commands are available:
pwd
ls [ <path> ]
cd [ <path> ]
add [ <path> ] # 可以加入复原文件列表中
delete [ <path> ] # 从复原列表拿掉档名!并非删除喔!
extract # 开始复原动作!
quit
help
-> ls
455517 initramfs-3.10.0-229.el7.x86_64kdump.img
138 initramfs-3.10.0-229.el7.x86_64.img
141 initrd-plymouth.img
140 vmlinuz-0-rescue-309eb890d09f440681f596543d95ec7a
139 initramfs-0-rescue-309eb890d09f440681f596543d95ec7a.img
137 vmlinuz-3.10.0-229.el7.x86_64
136 symvers-3.10.0-229.el7.x86_64.gz
133 .vmlinuz-3.10.0-229.el7.x86_64.hmac
1048704 grub2/
131 grub/
-> add grub
-> add grub2
-> add config-3.10.0-229.el7.x86_64
-> extract
$ ls -l /tmp/boot3
-rw-r--r--. 1 root root 123838 Mar 6 19:45 config-3.10.0-229.el7.x86_64
drwxr-xr-x. 2 root root 4 17:52 grub
drwxr-xr-x. 6 root root
26 May
104 Jun 25 00:02 grub2
# 就只会有 3 个档名被复原,当然,如果文件名是目录,那底下的子文件当然也会被还原回来的!
```
事实上,这个 -i 是很有帮助的一个项目!可以从备份档里面找出你所需要的数据来复原!相当有趣!
当然啦, 如果你已经知道档名,使用 -s 不需要进入备份档就能够处理掉这部份了!

#### 光盘写入工具

+ 现将数据创建为一个镜像文件（iso），利用mkisofs命令处理
+ 将该镜像文件刻录至CD或DVD当中，利用cdrecord命令来处理
##### mkisofs：建立镜像文件

+ 制作一般数据光盘镜像文件
```bash
mkisofs [-o 镜像文件] [-Jrv] [-V vol] [-m file] 待备份文件... -graft-point isodir=systemdir ...
选项与参数:
-o :后面接你想要产生的那个镜像文件。
-J :产生较兼容于 windows 机器的文件名结构,可增加文件名长度到 64 个 unicode 字符
-r :透过 Rock Ridge 产生支持 Unix/Linux 的文件数据,可记录较多的信息(如 UID/GID 等) ;
-v :显示创建 ISO 文件的过程
-V vol :建立 Volume,有点像 Windows 在文件资源管理器中看到的CD卷标
-m file：-m 为排除文件的意思后面的文件不备份到镜像文件中,也能使用 * 通配符喔
-graft-point:graft 有转嫁或移植的意思,相关资料在底下文章内说明。
```
***光盘的格式一般称为 iso9660 ,这种格式一般仅支持旧版的 DOS 文件名,亦即文件
名只能以 8.3 (文件名 8 个字符,扩展名 3 个字符) 的方式存在。*** 可以-r来记录更多。
***所有要被加到镜像文件中的文件都会被放置到镜像文件中的根目录***
```bash
$ mkisofs -r -v -o /tmp/system.img /root /home /etc
I: -input-charset not specified, using utf-8 (detected in locale settings)
genisoimage 1.1.11 (Linux)
Scanning /root
.....(中间省略).....
Scanning /etc/scl/prefixes
# 被改名子了!
Using SYSTE000.;1 for /system-release-cpe (system-release)
Using CENTO000.;1 for /centos-release-upstream (centos-release) # 被改名子了!
Using CRONT000.;1 for /crontab (crontab)
genisoimage: Error: '/etc/crontab' and '/root/crontab' have the same Rock Ridge name 'crontab'.
# 文件名不可一样啊!
Unable to sort directory
NOTE: multiple source directories have been specified and merged into the root
of the filesystem. Check your program arguments. genisoimage is not tar.
# 看到没?因为档名一模一样,所以就不给你建立 ISO 檔了啦!
# 请先删除 /root/crontab 这个文件,然后再重复执行一次 mkisofs 吧!
$ rm /root/crontab
$ mkisofs -r -v -o /tmp/system.img /root /home /etc
.....(前面省略).....
83.91% done, estimate finish Thu Jul 2 18:48:04 2015
92.29% done, estimate finish Thu Jul 2 18:48:04 2015
Total translation table size: 0
Total rockridge attributes bytes: 600251
Total directory bytes: 2150400
Path table size(bytes): 12598
Done with: The File(s) Block(s)
Writing: Start Block 59449
Ending Padblock
Done with: Ending Padblock
Block(s)
58329
150
Max brk space used 548000
59599 extents written (116 MB)
$ ll -h /tmp/system.img
-rw-r--r--. 1 root root 117M Jul
2 18:48 /tmp/system.img
$ mount -o loop /tmp/system.img /mnt
$ df -h /mnt
Filesystem
Size
Used Avail Use% Mounted on
/dev/loop0
117M
117M
0 100% /mnt
$ ls /mnt
abrt festival mail.rc rsyncd.conf
adjtime filesystems makedumpfile.conf.sample rsyslog.conf
alex firewalld man_db.conf rsyslog.d
# 看吧!一堆数据都放置在一起!包括有的没有的目录与文件等等!
$ umount /mnt
# 测试完毕要记得卸除!
这样可以使用-graft-point来处理
```bash
$ mkisofs -r -V 'linux_file' -o /tmp/system.img \
>
-m /root/etc -graft-point /root=/root /home=/home /etc=/etc
$ ll -h /tmp/system.img
-rw-r--r--. 1 root root 92M Jul
2 19:00 /tmp/system.img
# 上面的指令会建立一个大文件,其中 -graft-point 后面接的就是我们要备份的数据。
# 必须要注意的是那个等号的两边,等号左边是在映像文件内的目录,右侧则是实际的数据。
$ mount -o loop /tmp/system.img /mnt
$ ll /mnt
dr-xr-xr-x. 131 root root 34816 Jun 26 22:14 etc
dr-xr-xr-x. 5 root root 2048 Jun 17 00:20 home
dr-xr-xr-x. 8 root root 4096 Jul
2 18:48 root
# 瞧!数据是分门别类的在各个目录中喔这样了解乎?最后将数据卸除一下:
$ umount /mnt
```
+ 制作/修改课启动光盘镜像文件
```bash
# 1. 先观察一下这片光盘里面有啥东西?是否是我们需要的光盘系统!
$ isoinfo -d -i /home/CentOS-7-x86_64-Minimal-1503-01.iso
CD-ROM is in ISO 9660 format
System id: LINUX
Volume id: CentOS 7 x86_64
Volume set id:
Publisher id:
Data preparer id:
Application id: GENISOIMAGE ISO 9660/HFS FILESYSTEM CREATOR (C) 1993 E.YOUNGDALE (C) ...
Copyright File id:
.....(中间省略).....
Eltorito defaultboot header:
Bootid 88 (bootable)
Boot media 0 (No Emulation Boot)
Load segment 0
Sys type 0
Nsect 4
# 2. 开始挂载这片光盘到 /mnt ,并且将所有数据完整复制到 /srv/newcd 目录去喔
$ mount /home/CentOS-7-x86_64-Minimal-1503-01.iso /mnt
$ mkdir /srv/newcd
$ rsync -a /mnt/ /srv/newcd
$ ll /srv/newcd/
-rw-r--r--. 1 root root 16 Apr
1 07:11 CentOS_BuildTag
drwxr-xr-x. 3 root root 33 Mar 28 06:34 EFI
-rw-r--r--. 1 root root 215 Mar 28 06:36 EULA
-rw-r--r--. 1 root root 18009 Mar 28 06:36 GPL
drwxr-xr-x. 3 root root 54 Mar 28 06:34 images
drwxr-xr-x. 2 root root 4096 Mar 28 06:34 isolinux
drwxr-xr-x. 2 root root 41 Mar 28 06:34 LiveOS
drwxr-xr-x. 2 root root 20480 Apr
1 07:11 Packages
drwxr-xr-x. 2 root root 4096 Apr
1 07:11 repodata
-rw-r--r--. 1 root root 1690 Mar 28 06:36 RPM-GPG-KEY-CentOS-7
-rw-r--r--. 1 root root 1690 Mar 28 06:36 RPM-GPG-KEY-CentOS-Testing-7
-r--r--r--. 1 root root 2883 Apr
1 07:15 TRANS.TBL
# rsync 可以完整的复制所有的权限属性等数据,也能够进行镜像处理!相当好用的指令喔!
# 这里先了解一下即可。现在 newcd/ 目录内已经是完整的映像档内容!# 3. 假设已经处理完毕你在 /srv/newcd 里面所要进行的各项修改行为,准备建立 ISO 檔!
$ ll /srv/newcd/isolinux/
-r--r--r--. 1 root root
2048 Apr
1 07:15 boot.cat
-rw-r--r--. 1 root root 84 Mar 28 06:34 boot.msg
-rw-r--r--. 1 root root 281 Mar 28 06:34 grub.conf
# 开机的型号数据等等
-rw-r--r--. 1 root root 35745476 Mar 28 06:31 initrd.img
-rw-r--r--. 1 root root 24576 Mar 28 06:38 isolinux.bin
-rw-r--r--. 1 root root 3032 Mar 28 06:34 isolinux.cfg
-rw-r--r--. 1 root root 176500 Sep 11
-rw-r--r--. 1 root root 186 Jul
-r--r--r--. 1 root root 2438 Apr
2
# 相当于开机管理程序
2014 memtest
2014 splash.png
1 07:15 TRANS.TBL
-rw-r--r--. 1 root root 33997348 Mar 28 06:33 upgrade.img
-rw-r--r--. 1 root root 153104 Mar
-rwxr-xr-x. 1 root root 5029136 Mar
6 13:46 vesamenu.c32
6 19:45 vmlinuz
# Linux 核心文件
$ cd /srv/newcd
[root@study newcd]# mkisofs -o /custom.iso -b isolinux/isolinux.bin -c isolinux/boot.cat \
> -no-emul-boot -V 'CentOS 7 x86_64' -boot-load-size 4 -boot-info-table -R -J -v -T .
```
##### cdrecord：光盘刻录工具
现在一般使用wodim来刻录
```bash
$ wodim --devices dev=/dev/sr0... <==查询刻录机的 BUS 位置
$ wodim -v dev=/dev/sr0 blank=[fast|all] <==抹除重复读写片
$ wodim -v dev=/dev/sr0 -format <==格式化 DVD+RW
$ wodim -v dev=/dev/sr0 [可用选项功能] file.iso
选项与参数:
--devices :用在扫瞄磁盘总线并找出可用的刻录机,后续的装置为 ATA 接口
-v :在 cdrecord 运作的过程中,显示过程而已。
dev=/dev/sr0 :可以找出此光驱的 bus 地址,非常重要!
blank=[fast|all]:blank 为抹除可重复写入的 CD/DVD-RW,使用 fast 较快,all 较完整
-format
:对光盘片进行格式化,但是仅针对 DVD+RW 这种格式的 DVD 而已;
[可用选项功能] 主要是写入 CD/DVD 时可使用的选项,常见的选项包括有:
-data
:指定后面的文件以数据格式写入,不是以 CD 音轨(-audio)方式写入!
speed=X :指定刻录速度,例如 CD 可用 speed=40 为 40 倍数,DVD 则可用 speed=4 之类
-eject :指定刻录完毕后自动退出光盘
fs=Ym :指定多少缓冲存储器,可用在将映像档先暂存至缓冲存储器。预设为 4m,
一般建议可增加到 8m ,不过,还是得视你的刻录机而定。
针对 DVD 的选项功能:
driveropts=burnfree :打开 Buffer Underrun Free 模式的写入功能
-sa
:支持 DVD-RW 的格式
```
+ 侦测你的刻录机所在位置:
```bash
$ ll /dev/sr0
brw-rw----+ 1 root cdrom 11, 0 Jun 26 22:14 /dev/sr0 #一般 Linux 光驱文件名!
$ wodim --devices dev=/dev/sr0
-------------------------------------------------------------------------
0
dev='/dev/sr0'
rwrw-- : 'QEMU' 'QEMU DVD-ROM'
-------------------------------------------------------------------------
$ wodim --devices dev=/dev/sr0
wodim: Overview of accessible drives (1 found) :
-------------------------------------------------------------------------
0
dev='/dev/sr0'
rwrw-- : 'ASUS' 'DRW-24D1ST'
-------------------------------------------------------------------------
# 你可以发现到其实鸟哥做了两个测试!上面的那部主机系统是虚拟机,当然光驱也是仿真的,没法用。
# 因此在这里与底下的 wodim 用法,鸟哥只能使用另一部 Demo 机器测试给大家看了!
```
+ 进行cd/dvd的刻录
```bash
# 0. 先抹除光盘的原始内容:(非可重复读写则可略过此步骤)
$ wodim -v dev=/dev/sr0 blank=fast
# 中间会跑出一堆讯息告诉你抹除的进度,而且会有 10 秒钟的时间等待你的取消!
# 1. 开始刻录:
$ wodim -v dev=/dev/sr0 speed=4 -dummy -eject /tmp/system.img
....(前面省略)....
Waiting for reader process to fill input buffer ... input buffer ready.
Starting new track at sector: 0
Track 01:
86 of
86 MB written (fifo 100%) [buf
97%]
4.0x.
# 这里有流程时间!
Track 01: Total bytes read/written: 90937344/90937344 (44403 sectors).
Writing
time:
# 写入的总时间
38.337s
Average write speed
# 换算下来的写入时间
1.7x.
Min drive buffer fill was 97%
Fixating...
Fixating time:
120.943s
wodim: fifo had 1433 puts and 1433 gets.
wodim: fifo was 0 times empty and 777 times full, min fill was 89%.
# 因为有加上 -eject 这个选项的缘故,因此刻录完成后,DVD 会被退出光驱喔!记得推回去!
# 2. 刻录完毕后,测试挂载一下,检验内容:
$ mount /dev/sr0/mnt
$ df -h /mnt
Filesystem
Filesystem
/dev/sr0
Size
Size
Used Avail Use% Mounted on
Used Avail Use% Mounted on
87M
87M
0 100% /mnt
$ ll /mnt
dr-xr-xr-x. 135 root root 36864 Jun 30 04:00 etc
dr-xr-xr-x.
19 root root
$ umount /mnt
8192 Jul
2 13:16 root
<==不要忘了卸除
```
#### 其他常见的压缩与备份工具
停下你的dd行为
##### dd
```bash
$ dd if="input_file" of="output_file" bs="block_size" count="number"
选项与参数：
if ： 就是input file，也可以是设备
of ： 就是output file，也可以是设备
bs ： 设置一个block的大小，默认512bytes（一个扇区）
count ： 多少个bs的意思
$ dd if=/etc/passwd of=/tmp/passwd.back #将镜像文件写入u盘
5+1 records in
5+1 records out
2580 bytes (2.6 kB, 2.5 KiB) copied, 0.000205157 s, 12.6 MB/s
$ ll /etc/passwd /tmp/passwd.back
-rw-r--r-- 1 root  root  2580 3月  27 21:47 /etc/passwd
-rw-r--r-- 1 jason jason 2580 4月  23 22:28 /tmp/passwd.back
$ dd if=/dev/sr0 of=/tmp/system.iso #备份数据为镜像文件
$ lsblk /dev/sda
$ dd if=/tmp/system.iso of=/dev/sda
$ mount /dev/sda /mnt
$ ll /mnt
$ df -h /boot
$ dd if=/dev/vd2 of /tmp/vda2.img #将/boot整个文件系统备份下来
$ ll -h /tmp/vda2.img
```
dd是很笨拙的一个一个扇区去读写的，那这个其实非常nice啊，复制文件系统就可以使用
##### cpio
cpio可以备份一切东西，但是需要配合find等命令进行重定向。
```bash
$ cpio -ovcB  > [file|device] #备份
$ cpio -ivcdu < [file|device] #还原
$ cpio -ivct  < [file|device] #查看
备份会使用到的选项与参数:
-o :将数据 copy 输出到文件或装置上
-B :让预设的 Blocks 可以增加至 5120 bytes ,预设是 512 bytes !
这样的好处是可以让大文件的储存速度加快(请参考 i-nodes 的观念)
还原会使用到的选项与参数:
-i :将数据自文件或装置 copy 出来系统当中
-d :自动建立目录!使用 cpio 所备份的数据内容不见得会在同一层目录中,因此我们
必须要让 cpio 在还原时可以建立新目录,此时就得要 -d 选项的帮助!
-u :自动的将较新的文件覆盖较旧的文件!
-t :需配合 -i 选项,可用在"察看"以 cpio 建立的文件或装置的内容
一些可共享的选项与参数:
-v :让储存的过程中文件名可以在屏幕上显示
-c :一种较新的 portable format 方式储存
```
将/boot的文件备份到/tmp/boot.cpio中
```bash
$ cd /
$ find boot -print
$ find boot | cpio -ovcB > /tmp/boot.cpio
$ ll -h /tmp/boot.cpio
-rw-r--r-- 1 jason jason 119M 4月  23 23:13 /tmp/boot.cpio
$ file /tmp/boot/cpio 
/tmp/boot.cpio: ASCII cpio archive (pre-SVR4 or odc)
```

这里我们一开始是先转入根目录然后操作 ***因为cpio命令如果加上绝对路径的开头，那解开的时候，就会覆盖掉原本的/boot***

```bash
$ cd ~
$ cpio -idvc < /tmp/boot.cpio
$ ll /root/boot
```

cpio命令也可用于磁带
```bash
$ find / | cpio -ovcB > /dev/st0
$ cpio -idvc < /dev/st0
```
