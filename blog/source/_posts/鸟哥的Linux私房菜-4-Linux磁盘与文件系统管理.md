---
title: Linux(4)-Linux磁盘与文件系统管理
date: 2019-04-04 08:39:42
tags:
  - Linux
  - linux
  - 文件系统
categoties: 拉普拉斯妖
copyright: true
---
### 认识Linux文件系统
Linux 文件系统最“正统”的是 ***ext2*** ,文件系统的建立和磁盘的物理结构是紧密相关的，现在我们有TB级的磁盘阵列，也有读写速度极快的ssd，如何根据自己的要求和期望的性能，文件系统的选择至关重要。

#### 磁盘组成与分区的复习
 虽然ssd的出现在一般的计算机上已经普及，但是对于文件的安全性来说，相比于ssd几年的寿命和有限的读写次数，传统机械硬盘是我们保存数据的一个不可替代的选择，所以我们先从机械硬盘的结构说起：
 + 碟片（记录数据）
 + 机械手臂，磁头（擦写碟片上的数据）
 + 主轴马达：转动磁盘使磁头可以读写碟片上的数据

 也就是说，**数据的储存和擦写主要集中在碟片上** ，而碟片的物理组成为：
 + 扇区（Sector）为最小的物理储存单位，根据磁盘设计的不同有 **512B** 和 **4KB**两种
 + 将扇区组成一个圆，即为 **柱面（Cylinder） **
 + 每个扇区都有自己的编号
 + 磁盘分区表主要有 **MBR**和 **GPT**两种
   + MBR分区表中第一扇区中储存 **主引导记录（Master boot record，MBR）446B** 及 **分区表（partition table）64B**，
   + GPT分区表除了分区数量扩充较多，支持的磁盘容量有超过2TB

 物理磁盘的文件名已经模拟成`/dev/sd[a-p]`的格式，第一块磁盘分区的文件名为`/dev/sda[1-128]`,虚拟机的磁盘通常是`/dev/vd[a-p]`,如果使用软件磁盘阵列使用的文件名是`/dev/md[a-p]`。

#### 文件系统特性
 操作系统拥有不同的的文件属性/权限，为了存放数据，就要对磁盘进行格式化，成为操作系统所能利用的文件系统。

 LVM与软件磁盘阵列（software raid）技术可以使一个分区拥有不同的文件系统，也可以将多个分区合成一个文件系统。所以我们称呼 **一个可以被挂载的数据为一个文件系统而不是一个分区**。

 之前对于文件权限的学习中，我们了解到Linux文件系统中的文件有权限和属性的记录， **文件系统会将文件的权限与属性放在inode中，而实际数据在放在数据区块中**，此外还会有一个超级区块来存放文件系统的整体信息，也就是inode与数据区块的总量使用量和剩余量。

 ```c
 每个文件文件占有一个inode--->|
                           |--->inode内有文件实际数据所在的区块号码
 每个inode和数据区块都有编号->|
 ```
 也就是我们只要找到inode就能知道文件的存放位置，这样大大提高了读写效率。这种方式称为 **索引式文件系统**，这样我们可以一口气读出文件所有区块的位置编号，而FAT文件系统需要先读取一个区块才能知道下一个区块的位置编号。考虑这种情况`1->7->4->20->13`,索引式文件系统可以在一圈内读出所有数据，而FAT则需要几圈。这也就是**碎片整理**的由来，弱国文件写入的区块太过于离散，文件的读取性能就会很差。

 #### Linux的ext2文件系统（inode）
 文件系统一开就将inode和数据区块规划好了，除非重新格式化，或使用`resize2fs`命令修改。否则inode和数据区块就是固定的。

 ext2文件系统的格式化时是分为多个区块群组（block group）
 ```c
 |Boot Sector|Block Group1|Block Group2|Block Group3|Block Group4|
                |    |
 |<-------------|    |------------------------------------------->|
 |Superblock|文件系统描述|区块对应表|inode对应表|inode Table|Date Block|
 ```

文件系统最前方拥有一个启动扇区Boot Sector来存放不同文件系统的引导程序，这样就能实现多重引导，而不用覆盖每个MBR表。

每个区块群组有6个部分：
+ Superblock
  + 数据区块与inode的总量;
  + 未使用与已使用的inode与数据区块 数量;
  + 数据区块与inode的大小（block为1,2,4k，inode为128B或256B）;
  + 文件系统的挂载时间，最近一次写入数据的时间，最近一次检验（fsck）的时间
  + 一个有效位值，已被挂载为0,否则为1;

  一般 **除了第一个区块群组含有超级区块，剩下的不会有，有也是为了备份**。
+ 文件系统描述Filesystem Description

描述区块群组开始与结束的区块，以及每个区块的6个部分分别介于哪个区块之间，可以使用命令`dumpe2fs`来查看
+ 区块对应表（block bitmap）

记录区块是否使用
+ inode对应表（inode bitmap）

记录inode是否使用
+ inode Table
  + 文件的读写属性rwx
  + 文件的拥有者与用户组
  + 文件的大小
  + 文件的建立或状态改变的时间ctime
  + 文件的最后一次读取的时间atime
  + 文件的最后一次修改时间mtime
  + 文件特性的标识，SUID，SGID，SBIT等
  + 文件真正内容的指向pointer
  + inode的大小为128B，ext4和xfs可以设为256B
  + 每个文件只会占用一个inode
  + 所以文件系统能够建立的文件数量和inode的数量有关
  + 系统读取文件时会先经过inode

  inode记录区块号码的区域定义为12个直接，一个间接，一个双间接和一个三间接
  ，假设一个区块为1K，。每个记录使用4B，也就是一个区块可以有256条记录
  ```c
  |文件权限/属性记录区域|
  |       直接       |--->block号码（1条记录）
  |       直接       |--->block号码（1条记录）
  |       直接       |--->block号码（1条记录）
  |       直接       |--->block号码（1条记录）
  |       直接       |--->block号码（1条记录）
  |       直接       |--->block号码（1条记录）
  |       直接       |--->block号码（1条记录）
  |       直接       |--->block号码（1条记录）
  |       直接       |--->block号码（1条记录）
  |       直接       |--->block号码（1条记录）
  |       直接       |--->block号码（1条记录）
  |       直接       |--->block号码（1条记录）
  |       间接       |--->256block区块--->256×1K=256K
  |       双间接     |--->256block区块--->256×256个区块--->256^2K
  |       三间接     |--->256block区块--->256×256个区块--->256×256×256个区块--->256^3K=16GB
  ```
+ Data Block
  + 原则上，区块划分完成以后就不能再次修改
  + 每个区块内只能放置一个文件
  + 如果文件大于区块的大小，则会占用多个区块
  + 文件小于区块大小，则区块剩下的容量就会浪费
| Block大小          | 1KB  | 2KB   | 4KB  |
| ------------------ | ---- | ----- | ---- |
| 最大单一文件限制   | 16GB | 256GB | 2TB  |
| 最大文件系统的容量 | 2TB  | 8TB   | 16TB |

##### dumpe2fs命令
```bash
$ dumpe2fs [-bh] 设备文件名
选项与参数：
-b：列出保留为坏道的部分
-h：仅列出superblock的内容
$ blkid #显示出目前系统被格式化的设备
/dev/loop0: TYPE="squashfs"
/dev/loop1: TYPE="squashfs"
/dev/loop2: TYPE="squashfs"
/dev/loop3: TYPE="squashfs"
/dev/loop4: TYPE="squashfs"
/dev/loop5: TYPE="squashfs"
/dev/loop6: TYPE="squashfs"
/dev/loop7: TYPE="squashfs"
/dev/nvme0n1p1: LABEL="SYSTEM" UUID="C6A3-B7DE" TYPE="vfat" PARTLABEL="EFI system partition" PARTUUID="3e25bbec-3e10-4901-8c33-ceeadbc12d69"
/dev/nvme0n1p3: LABEL="Windows" UUID="B438A7FA38A7BA2E" TYPE="ntfs" PARTLABEL="Basic data partition" PARTUUID="f6d4beeb-a0dc-48ed-827b-b63cf7cd1084"
/dev/nvme0n1p4: LABEL="WinRE_DRV" UUID="E60CA85F0CA82C8D" TYPE="ntfs" PARTLABEL="Basic data partition" PARTUUID="58abc9c9-e11e-4dd8-9a3f-2dab172fa72c"
/dev/nvme0n1p5: UUID="2f6b6a4f-29e2-4a7e-a790-523499851033" TYPE="ext4" PARTUUID="150f0697-4ae7-4957-830f-a91e40d03577" #ext4文件系统
$ dumpe2fs -h /dev/nvme0n1p5
dumpe2fs 1.44.1 (24-Mar-2018)
Filesystem volume name:   <none>
Last mounted on:          /
Filesystem UUID:          2f6b6a4f-29e2-4a7e-a790-523499851033
Filesystem magic number:  0xEF53
Filesystem revision #:    1 (dynamic)
Filesystem features:      has_journal ext_attr resize_inode dir_index filetype needs_recovery extent 64bit flex_bg sparse_super large_file huge_file dir_nlink extra_isize metadata_csum
Filesystem flags:         signed_directory_hash
Default mount options:    user_xattr acl
Filesystem state:         clean
Errors behavior:          Continue
Filesystem OS type:       Linux
Inode count:              6225920
Block count:              24903680
Reserved block count:     1245184
Free blocks:              5501844
Free inodes:              5360200
First block:              0
Block size:               4096
Fragment size:            4096
Group descriptor size:    64
Reserved GDT blocks:      1024
Blocks per group:         32768
Fragments per group:      32768
Inodes per group:         8192
Inode blocks per group:   512
Flex block group size:    16
Filesystem created:       Sat Aug 25 09:19:21 2018
Last mount time:          Thu Apr 11 08:37:34 2019
Last write time:          Thu Apr 11 08:37:34 2019
Mount count:              676
Maximum mount count:      -1
Last checked:             Sat Aug 25 09:19:21 2018
Check interval:           0 (<none>)
Lifetime writes:          2040 GB
Reserved blocks uid:      0 (user root)
Reserved blocks gid:      0 (group root)
First inode:              11
Inode size:	          256
Required extra isize:     32
Desired extra isize:      32
Journal inode:            8
First orphan inode:       3408086
Default directory hash:   half_md4
Directory Hash Seed:      b1992519-4a57-44b1-a21c-5a97eaff4950
Journal backup:           inode blocks
Checksum type:            crc32c
Checksum:                 0xc872187f
Journal features:         journal_incompat_revoke journal_64bit journal_checksum_v3
Journal size:             512M
Journal length:           131072
Journal sequence:         0x001fb5bd
Journal start:            1
Journal checksum type:    crc32c
Journal checksum:         0x3e35097a
```
#### 与目录树的关系
+ 目录

当我们在Linux下建立一个目录时， **文件系统会分配一个inode与至少一个区块给该目录**， inode记录目录的权限和属性，而区块记录目录下的文件名和文件名占用的inode号码。这也体现了 **Linux下一切都是文件**的本质，回忆，、之前的bolg中我们讨论过如果只拥有目录的r权限就可以用ls列出所有的文件内容，其实目录就是一个文件只要有r权限就可以阅读，w权限只能修改或删除该目录下的文件，而x执行权限才能执行并通过目录树访问该目录下的其他文件。

```bash
$ ls -li #-i选项可以观察inode号码
total 12
5379387 drwxr-xr-x 3 root root 4096 8月  26  2018 Android
5244055 drwxr-xr-x 3 root root 4096 8月  26  2018 AndroidStudioProjects
5259883 drwxr-xr-x 3 root root 4096 11月 10 10:09 PycharmProjects
$ ll -d / /boot /usr/sbin /proc /sys
drwxr-xr-x  27 root root  4096 4月   7 11:41 // #一个4k区块
drwxr-xr-x   4 root root  4096 4月   7 11:41 /boot/
dr-xr-xr-x 326 root root     0 4月  11 08:37 /proc/ #内存数据，不占磁盘容量
dr-xr-xr-x  13 root root     0 4月  11 08:37 /sys/
drwxr-xr-x   2 root root 12288 3月  22 09:16 /usr/sbin/ #3个4K区块
```
+ 文件

文件系统会分配一个inode与正好的区块给新建文件。
+ 目录树读取

```c
inode-->目录文件区块-->inode号码-->目录文件区块--->……--->inode号码--->文件区块
```
+ 文件系统大小与磁盘读取性能

文件写入通常是离散的，如果离散的程度较大，即使我们使用索引式文件系统，也还是会造成文件读取效率下降的问题。
#### ext2/ext3/ext4文件的存取与日志式文件系统的功能
在我们想要新增一个文件时，，文件系统的操作是：
+ 1.确定用户是否对目录有w或x的权限
+ 2.根据inode对照表找出没有使用的inode号码，并写入权限/文件
+ 3.根据区块对照表找到没有使用的区块号码，将数据写入区块中，并更新inode的区块指向数据
+ 4.将刚刚写入的inode区块与区块数据同步更新inode对照表和区块对照表，并更新超级区块的内容

数据的不一致状态（Inconsistent）状态，如果在某些计算条件下，比如机房突然断电，系统内核发生错误的情况，文件系统只写入了inode对照表与数据区块，最后一个同步更新元数据的步骤还未完成。面对这种情况，早期ext2我们要对整个文件系统进行检查使用`e2fsck`命令，这样消耗大量的时间也就催生了后来的日志式文件系统（Journaling filesystem）。

日志式文件系统记录一个文件时，：
+ 首先在日志记录区块中记录某个文件准备要写入的信息
+ 世界写入更新metadata的数据
+ 完成更新后，在日志记录区块中完成该文件的记录

在日志式文件系统中，我们只要检查日志文件区块就可以知道那个文件发生了问题
#### Linux文件系统的运行
Linux 通过异步处理(asynchronously)的方式来解决磁盘读写的效率问题。当系统加载一个文件到内存后，如果文件爱你未被修改 则状态为 ***Clean*** ，如果被修改过了，则状态为***Dirty***，此时操作都在内存中执行，并没有写入到磁盘中。

+ 系统会将常用文件放入磁盘中，来加速文件的读写操作
+ sync命令可以将内存中dirty文件写入磁盘
+ 正常关机是会调用sync
+ 不正常关机可能会造成文件系统的损坏
#### 挂载点的意义（mount point）
***挂载点一定是目录，该目录为进入该文件系统的入口***，所谓挂载就是文件系统与目录树的结合。文件系统必须挂载之后才能使用。

***同一个文件系统的某个inode只会对应到一个文件***
#### 其他Linux支持的文件系统与VFS
每种文件系统都有自己不同的特性，比如xfs支持大容量大文件，Reiserfs支持更小型文件，一般Linux支持的系统有：
+ 传统文件系统： ext2，minix，FAT，iso9660（光盘）等
+ 日志式文件系统：ext3,ext4,ReiserFS。Windows'NTFS，IBM'sJFS,SGI'sXFS,ZFS
+ 网络文件系统：NFS，SMBFS

Linux VFS(Virtual Filesystem Switch),这个内核功能管理整个Linux 的文件系统。我们不需要自己来指定文件系统的类型，VFS会自动提我们识别。
#### XFS文件系统简介
ext文件系统的一个软肋是格式化的速度超慢。由于虚拟化技术的应用，性能上xfs会更站优势。

```c
|数据区data section|文件系统活动登录区log section|实时运行区realtime section|
|i|b|iT|bT|SB|dec |记录文件变化可以指定为外部磁盘 |     extent    stripe   |
```

可以通过命令`xfs_info`来观察。
### 文件系统的简单操作

#### 磁盘与目录的容量
###### df：列出文件系统的整体磁盘使用量
```bash
$ df [-ahikHTm] [目录或文件名]
选项与参数：
 -a :列出所有的文件系统，包括系统特有的/proc等文件系统
 -k :以KBytes的容量显示各文件系统
 -m :以MBytes的容量显示各文件系统
*-h :以人们较易接受的GBytes等格式自行显示
 -H :以M=1000k替换M=1024k的进位
 -T :连同该硬盘分区的文件系统格式也一起列出
*-i :不用磁盘容量，而以inode的数量来显示
$ df
Filesystem     1K-blocks     Used Available Use% Mounted on
udev             8053080        0   8053080   0% /dev
tmpfs            1616676     2164   1614512   1% /run
/dev/nvme0n1p5  97527092 74703772  17826200  81% /
tmpfs            8083376     1908   8081468   1% /dev/shm
tmpfs               5120        4      5116   1% /run/lock
tmpfs            8083376        0   8083376   0% /sys/fs/cgroup

*Filessystem : 代表该文件系统是在哪个磁盘分区，所以列出设备名称
*1K-blocks   : 说明下面的数字单位是1kb，可利用 -h或 -m来改变容量
*Used        : 使用掉的磁盘空间
*Available   : 剩余磁盘空间大小
*Use%        : 磁盘使用率
*Mounted on  : 挂载点
```
其中的`/dev/shm/`目录是利用内存虚拟出来的磁盘空间。
###### du：查看文件系统的磁盘使用量（查看目录所占磁盘空间）
```bash
$ du [-ahskm] 文件或目录名称
选项与参数：
 -a : 列出所有的文件与目录容量，因为默认仅统计目录下面的文件量
 -h : 以易读方式显示
*-s : 仅列出总量，而不是每个别的目录的占用量
 -S : 不包括子目录下的总计
 -k : 以KBytes
 -m : 以MBytes
```
#### 硬链接与符号链接：ln
Linux下链接文件为两种：
+ 符号链接 类似快捷方式
+ 硬链接 文件系统通过inode来新建的文件名

##### 硬链接 Hard Link （实际链接）
每个文件占用一个inode，读取文件必须经过目录的文件名指向到正确的inode号码。***硬链接只是在某个目录下新增一条文件名链接到某inode号码的关联记录而已。***
![AxKOvn.png](https://s2.ax1x.com/2019/04/16/AxKOvn.png)

这样建立硬链接的一好处是安全，如图，当我们删除掉block1的对应目录时，真正的inode与文件内容实际上仍然存在，这样不会删除真正的文件。但是硬链接也是有限制的：
+ 不能跨文件系统（这个显而易见）
+ 不能链接目录 如果要建立一个目录的硬链接，不仅仅是要为目录名建立硬链接，还要为目录下的每一个文件都建立硬链接，这样会造成非常大的环境复杂度，所以目前还不支持目录建立硬链接。

```bash
$ ln <源文件> <目标文件目录>
```
##### 符号链接 Symbolic Link （快捷方式）
符号链接就是建立一个独立的文件，这个文件会让数据的读取指向它链接的文件的文件名。
```bash
$ ln -s <源文件> <目标文件目录>
```
[![AxQKe0.png](https://s2.ax1x.com/2019/04/16/AxQKe0.png)](https://imgchr.com/i/AxQKe0)


### 磁盘的分区，格式化，检验与挂载
新增磁盘的操作：
+ 对磁盘进行划分
+ 对磁盘进行格式化，建立西欧他那个可用的文件系统
+ 建立挂载点，将文件系统挂载上来


#### 观察磁盘分区状态
###### lsblk（list block device）
```bash
$ lsblk [-dfimpt] [device]
选项与参数：
 -d : 仅列出磁盘本身，不列出磁盘的分区数据
×-f : 列出磁盘内的文件系统名称
 -i : 使用ASCII字符输出
 -m : 输出设备的权限信息
 -p : 列出完整文件名
 -t : 列出磁盘设备的详细文件数据，包括磁盘阵列信息等
NAME : 设备文件名
MAJ:MIN : 内核识别的设备就是通过这两个代码来区分，主要与次要设备代码
RM : 是否为可卸载设备
SIZE : 容量
RO : 是否为只读设备
TYPE : 是磁盘，分区，还是制度存储器rom
MOUNTPOINT : 挂载点
```

###### blkid 列出设备的UUID等参数

UUID：universally unique identifier 全局唯一标识符

###### parted 列出磁盘的分区表类型和分区信息

```bash
$ parted 设备名 print
$ parted /dev/nvme0n1 print
Model: INTEL SSDPEKKF256G8L (nvme)  # 制造厂商 模块名称
Disk /dev/nvme0n1: 256GB            # 磁盘容量
Sector size (logical/physical): 512B/512B # 磁盘的每个逻辑/物理扇区容量
Partition Table: gpt                # 分区表格式
Disk Flags:

Number  Start   End    Size    File system  Name                          Flags
 1      1049kB  274MB  273MB   fat32        EFI system partition          boot, hidden, esp
 2      274MB   290MB  16.8MB               Microsoft reserved partition  msftres
 3      290MB   153GB  153GB   ntfs         Basic data partition          msftdata
 5      153GB   255GB  102GB   ext4
 4      255GB   256GB  1049MB  ntfs         Basic data partition          hidden, diag
```

#### 磁盘分区：gdisk/fdisk
***MBR分区表使用fdisk分区，GPT使用gdisk分区***

###### gdisk
```bash
$ gdisk /dev/nvme0n1
GPT fdisk (gdisk) version 1.0.3

Partition table scan:
  MBR: protective
  BSD: not present
  APM: not present
  GPT: present

Found valid GPT with protective MBR; using GPT.

Command (? for help): ?
b	back up GPT data to a file
c	change a partition's name
d	delete a partition  #删除一个分区
i	show detailed information on a partition
l	list known partition types
n	add a new partition   #新建一个分区
o	create a new empty GUID partition table (GPT)
p	print the partition table  #打印分区表
q	quit without saving changes #不保存分区直接离开gdisk
r	recovery and transformation options (experts only)
s	sort partitions
t	change a partition's type code
v	verify disk
w	write table to disk and exit  #保存分区后离开gdisk'
x	extra functionality (experts only)
?	print this menu
```
磁盘分区是针对整个磁盘而不是只是一个分区所以不要在设备文件后附带数字。

###### gdisk新增分区
```bash
$ gdisk /dev/nvme0n1
GPT fdisk (gdisk) version 1.0.3

Partition table scan:
  MBR: protective
  BSD: not present
  APM: not present
  GPT: present

Found valid GPT with protective MBR; using GPT.

Command (? for help): p
Disk /dev/nvme0n1: 500118192 sectors, 238.5 GiB
Model: INTEL SSDPEKKF256G8L
Sector size (logical/physical): 512/512 bytes
Disk identifier (GUID): 7D95F9F1-8D34-4BA7-B555-9C68C5D996D6
Partition table holds up to 128 entries
Main partition table begins at sector 2 and ends at sector 33
First usable sector is 34, last usable sector is 500118158
Partitions will be aligned on 2048-sector boundaries
Total free space is 4717 sectors (2.3 MiB)

Number  Start (sector)    End (sector)  Size       Code  Name
   1            2048          534527   260.0 MiB   EF00  EFI system partition
   2          534528          567295   16.0 MiB    0C01  Microsoft reserved ...
   3          567296       277868543   132.2 GiB   0700  Basic data partition
   4       277868544       298838015   10.0 GiB    0700  Basic data partition
   5       298840064       498069503   95.0 GiB    8300
   6       498069504       500117503   1000.0 MiB  2700  Basic data partition

Command (? for help): n
Partition number (7-128, default 7): 7
First sector (34-500118158, default = 298838016) or {+-}size{KMGTP}: 298838016
Last sector (298838016-298840063, default = 298840063) or {+-}size{KMGTP}: +1G
Last sector (298838016-298840063, default = 298840063) or {+-}size{KMGTP}: 298838017
Current type is 'Linux filesystem'
Hex code or GUID (L to show codes, Enter = 8300):
Changed type of partition to 'Linux filesystem'

Command (? for help): p
Disk /dev/nvme0n1: 500118192 sectors, 238.5 GiB
Model: INTEL SSDPEKKF256G8L
Sector size (logical/physical): 512/512 bytes
Disk identifier (GUID): 7D95F9F1-8D34-4BA7-B555-9C68C5D996D6
Partition table holds up to 128 entries
Main partition table begins at sector 2 and ends at sector 33
First usable sector is 34, last usable sector is 500118158
Partitions will be aligned on 2048-sector boundaries
Total free space is 4715 sectors (2.3 MiB)

Number  Start (sector)    End (sector)  Size       Code  Name
   1            2048          534527   260.0 MiB   EF00  EFI system partition
   2          534528          567295   16.0 MiB    0C01  Microsoft reserved ...
   3          567296       277868543   132.2 GiB   0700  Basic data partition
   4       277868544       298838015   10.0 GiB    0700  Basic data partition
   5       298840064       498069503   95.0 GiB    8300
   6       498069504       500117503   1000.0 MiB  2700  Basic data partition
   7       298838016       298838017   1024 bytes  8300  Linux filesystem
```
###### partprobe更新Linux内核的分区表信息
```bash
$ partprobe [-s]
$ lsblk /dev/nvme0n1 # 实际的磁盘分区状态
$ cat /proc/partitions #内核的分区记录
```
#### 磁盘格式化，创建文件系统
分区完毕以后就要进行磁盘的格式化，这样才能得到可以使用文件系统。就是使用make filesystem，mkfs指令。

首先键入`mkfs`，点击两下[Tab]，就出现了mkfs大家族。
```bash
mkfs         mkfs.ext2    mkfs.fat     mkfs.ntfs
mkfs.bfs     mkfs.ext3    mkfs.minix   mkfs.vfat
mkfs.cramfs  mkfs.ext4    mkfs.msdos
$ mkfs.ext4 [-b size] [-L label] 设备名称
$ mkfs.ext4 /dev/nvme0n1p4 #格式化为ext4文件系统
mke2fs 1.44.1 (24-Mar-2018)
/dev/nvme0n1p4 contains a ntfs file system labelled 'New Volume'
Proceed anyway? (y,N) y
Discarding device blocks: done
Creating filesystem with 2621184 4k blocks and 655360 inodes
Filesystem UUID: 38cdd582-dff7-4be3-8e55-0cb51fea7c4a
Superblock backups stored on blocks:
	32768, 98304, 163840, 229376, 294912, 819200, 884736, 1605632

Allocating group tables: done
Writing inode tables: done
Creating journal (16384 blocks): done
Writing superblocks and filesystem accounting information: done
```
#### 文件系统检验
###### xfs_repair处理XFS文件系统

```bash
$ xfs_repair [-fnd] 设备名称
选项与参数：
-f ： 后面的设备其实是个文件而不是实体设备
-n ： 单纯检查而不修改文件系统的任何数据
-d ： 单人维护模式下，针对根目录的修复，很危险
```
需要注意的是文件系统修复时不能被挂载。
+ fsck.ext4处理ext4文件系统

```bash
$ fsck.ext4 [-pf] [-b 超级区块] 设备名称
选项与参数：
-p ： 当文件系统修复时如果有需要回复y的动作，直接回复y
-f ： 强制检查，一般来说fsck弱国没有发现unclean的标识不会检查
-D ： 针对文件系统下的目录进行最优化配置
-b ： 后接超级区块的位置
$ dumpe2fs -h /dev/nvme0n1p4 | grep 'Blocks per group'
dumpe2fs 1.44.1 (24-Mar-2018)
Blocks per group:         32768
$  fsck.ext4 -b 32768 /dev/nvme0n1p4
e2fsck 1.44.1 (24-Mar-2018)
/dev/nvme0n1p4 was not cleanly unmounted, check forced.
Pass 1: Checking inodes, blocks, and sizes
Pass 2: Checking directory structure
Pass 3: Checking directory connectivity
Pass 4: Checking reference counts
Pass 5: Checking group summary information
Block bitmap differences:  +(32768--33794) +(98304--99330) +(163840--164866) +(229376--230402) +(294912--295938) +(819200--820226) +(884736--885762) +(1605632--1606658)
Fix<y>? yes
Inode bitmap differences: Group 1 inode bitmap does not match checksum.
FIXED.

/dev/nvme0n1p4: ***** FILE SYSTEM WAS MODIFIED *****
/dev/nvme0n1p4: 11/655360 files (0.0% non-contiguous), 66753/2621184 blocks
$ fsck.ext4 /dev/nvme0n1p4
e2fsck 1.44.1 (24-Mar-2018)
/dev/nvme0n1p4: clean, 11/655360 files, 66753/2621184 blocks
$  fsck.ext4 -f /dev/nvme0n1p4
e2fsck 1.44.1 (24-Mar-2018)
Pass 1: Checking inodes, blocks, and sizes
Pass 2: Checking directory structure
Pass 3: Checking directory connectivity
Pass 4: Checking reference counts
Pass 5: Checking group summary information
/dev/nvme0n1p4: 11/655360 files (0.0% non-contiguous), 66753/2621184 blocks
```
#### 文件系统挂载与卸载mount
+ 单一文件系统不应该被重复挂载在不同的挂载点中
+ 单一目录不应该重复挂载多个文件系统
+ 作为挂载点的目录。理论上都应该是空目录

假设挂载点目录并不为空那么挂载了文件系统之后，***目录下的问家你会暂时消失***
```bash
$ mount -a
$ mount [-l]
$ mount [-t 文件系统] LABEL='' 挂载点
$ mount [-t 文件系统] UUID='' 挂载点
$ mount [-t 文件系统] 设备文件名 挂载点
选项与参数：
-a ：依照配置文件/etc/fstab的数据将所有未挂载的磁盘都挂在上来
-l ：显示label信息
-t ：加制定的文件系统种类
-n ：不将数据写入/etc/mtab中
-o ：加参数
```
Linux通过：
+ `/etc/filesystem`：系统制定的测试挂载文件系统的优先级
+ `/proc/filesystem`：Linux系统已经加载的文件系统类型
```bash
$ unmount [-fn] 设备文件名或挂载点
选项与参数：
-f : 强制卸载，可用在类似网络文件系统NFS无法读取到的前提下
-l : 立刻卸载文件系统
-n : 不更新/etc/mtab
```
#### 磁盘文件系统参数自定义
###### mknod

Linux下一切都是文件，那么文件如何代表设备，***是通过major和minor这两个数值来替代***。
```bash
$ mknod 设备文件名 [bcp] [Major] [Minor]
选项与参数：
设备种类：
b ： 设置设备名称为一个外接储存设备文件
c ： 设置设备名称为一个外接输入设备文件
f ： 设置设备名称为一个FIFO文件
```

###### xfs_admin修改UUID与Label name

```bash
$ xfs_admin [-lu] [-L label] [-U UUID] 设备文件名
选项与参数：
-l : 列出设备的label name
-u : 列出设备的UUID
-L : 设置设备的label name
-U : 设置设备的UUID
$ uuidgen #产生一个UUID
```
###### tune2fs修改ext4的label name 与UUID
```bash
$ tune2fs [-l] [-L label] [-U UUID] 设备文件名
选项与参数：
-l : 类似于dump2fs的功能，将superblock内的数据读出
-L : 设置设备的label name
-U : 设置设备的UUID
```
### 设置启动挂载
一个很自然的诉求，就是我们希望系统在开机时自己主动挂载磁盘，否则每次都要mount操作一通实在是有些麻烦。
#### 启动挂载/etc/fstab及/etc/mtab
系统挂载的限制：
+ ***根目录是必须挂载的而且要先于其他任何挂载点***
+ ***其他挂载点必须为已经建立的目录，遵循FHS***
+ ***所有挂载点在同一时间之内，只能挂载一次***
+ ***所有硬盘分区在统一时间之内，只能挂载一下***
+ ***如果卸载，必须先将工作目录移动到挂载点之外***

```bash
$ cat /etc/fstab
# /etc/fstab: static file system information.
#
# Use 'blkid' to print the universally unique identifier for a
# device; this may be used with UUID= as a more robust way to name devices
# that works even if disks are added and removed. See fstab(5).
#
# <file system> <mount point>   <type>  <options>       <dump>  <pass>
# / was on /dev/nvme0n1p5 during installation
UUID=2f6b6a4f-29e2-4a7e-a790-523499851033 /               ext4    errors=remount-ro 0       1
# /boot/efi was on /dev/nvme0n1p1 during installation
UUID=C6A3-B7DE  /boot/efi       vfat    umask=0077      0       1
/swapfile                                 none            swap    sw              0       0
```
`/etc/fstab`存储的就像我们利用mount命令挂载时所有参数和选项都写入的一个文件。还多余一个dump备份命令，和启动时是否使用fsck系统欧冠你检验有关。

这六个字段的内容 ***十分重要！***
```bash
<file system> <mount point>   <type>      <options>       <dump>  <pass>
< 设备/UUID等> <  挂 载 点  >   <文件系统>  <文件系统参数>      <dump>  <pass>
```
+ 第一栏：磁盘设备文件名/UUID/LABEL name

这里的三个参数，填写任意一个都可以，建议使用blkid命令查询uuid来填写。

+ 第二栏：挂载点（mount name）

***一定是目录***

+ 第三栏：磁盘分区的文件系统

磁盘分区的文件系统，手动挂载时，系统可以自动检测，但是刚开机时系统并不能分析磁盘的文件系统格式，所以必须要手动写入。

+ 第四栏：文件系统参数

| 参数                            | 内容意义                                                       |
| ------------------------------- | -------------------------------------------------------------- |
| async/sync  异步/同步           | 设置磁盘是否以是否以异步方式运行，默认为async（性能较佳）      |
| auto/noauto  自动/非自动        | 当执行mount -a时，此文件系统是否会被主动的检测挂载，默认为auto |
| rw/ro 可擦写/只读               | 设置ro后，不论是否设置w权限，都无法写入数据                    |
| exec/noexec 可执行/不可执行     | 限制文件系统是否可以[执行]的操作，不要随便使用                 |
| user/nouser 允许/不允许用户挂载 | 是否希望一般身份的用户是用moount命令挂载，                     |
| suid/nosuid 具有/不具有suid权限 | 是否允许SUID的存在                                             |
| defaults                        | 是否使用默认参数配置                                           |

+ 第五栏：能否被dump备份命令作用
+ 第六栏：是否检查过

所以设置自动挂载只要将磁盘的信息写入`/etc/fstab`文件即可
```bash
$ blkid
/dev/nvme0n1: PTUUID="7d95f9f1-8d34-4ba7-b555-9c68c5d996d6" PTTYPE="gpt"
/dev/nvme0n1p1: LABEL="SYSTEM" UUID="C6A3-B7DE" TYPE="vfat" PARTLABEL="EFI system partition" PARTUUID="3e25bbec-3e10-4901-8c33-ceeadbc12d69"
/dev/nvme0n1p2: PARTLABEL="Microsoft reserved partition" PARTUUID="6396a370-a595-4cd8-80a4-3931e3d3df28"
/dev/nvme0n1p3: LABEL="Windows" UUID="B438A7FA38A7BA2E" TYPE="ntfs" PARTLABEL="Basic data partition" PARTUUID="f6d4beeb-a0dc-48ed-827b-b63cf7cd1084"
/dev/nvme0n1p4: UUID="38cdd582-dff7-4be3-8e55-0cb51fea7c4a" TYPE="ext4" PARTLABEL="Basic data partition" PARTUUID="57487810-e2b8-47ff-a2f3-531981effd18"
/dev/nvme0n1p5: UUID="2f6b6a4f-29e2-4a7e-a790-523499851033" TYPE="ext4" PARTUUID="150f0697-4ae7-4957-830f-a91e40d03577"
/dev/nvme0n1p6: LABEL="WinRE_DRV" UUID="E60CA85F0CA82C8D" TYPE="ntfs" PARTLABEL="Basic data partition" PARTUUID="58abc9c9-e11e-4dd8-9a3f-2dab172fa72c"
$ nano /etc/fstab #可以自己修改一下文件排版
UUID="38cdd582-dff7-4be3-8e55-0cb51fea7c4a" /home/jason/Device ext4 defaults 0 1
$ df #观察一下磁盘是否已经挂载
Filesystem     1K-blocks     Used Available Use% Mounted on
udev             8053080        0   8053080   0% /dev
tmpfs            1616676     2196   1614480   1% /run
/dev/nvme0n1p5  97527092 75489768  17040204  82% /
tmpfs            8083376     2156   8081220   1% /dev/shm
tmpfs               5120        4      5116   1% /run/lock
tmpfs            8083376        0   8083376   0% /sys/fs/cgroup
tmpfs            1616672       12   1616660   1% /run/user/121
tmpfs            1616672       36   1616636   1% /run/user/1000
/dev/sda1       15666400 11506912   4159488  74% /media/jason/E86B-1D06
tmpfs            1616672        0   1616672   0% /run/user/0
# 并没有被挂载
$ umount 磁盘 #如果被挂载，先卸载
$ mount -a #测试我们文件力度语法是否有错误，因为如果写错了，Linux可能无法启动
$ df /home/jason/Device #挂载成功
Filesystem     1K-blocks  Used Available Use% Mounted on
/dev/nvme0n1p4  10254612    36888   9677104   1% /home/jason/Device
```
`/etc/fstab`是启动事配置文件，实际文件系统的挂载是记录到`/etc/mtab`和`/proc/mounts`中的，如果你的配置文件有问题，无法顺利启动进入担任模式中，`/etc/fstab`文件是只读模式时：
```bash
$ mount -n -o remount,rw /
```
即可。

重启df查看，发现设备已经自动挂载
```bash
$ reboot
$ df
Filesystem     1K-blocks     Used Available Use% Mounted on
udev             8053080        0   8053080   0% /dev
tmpfs            1616676     2164   1614512   1% /run
/dev/nvme0n1p5  97527092 75506300  17023672  82% /
tmpfs            8083376      648   8082728   1% /dev/shm
tmpfs               5120        4      5116   1% /run/lock
tmpfs            8083376        0   8083376   0% /sys/fs/cgroup
/dev/loop0         15104    15104         0 100% /snap/gnome-characters/206
/dev/nvme0n1p4  10254612    36888   9677104   1% /home/jason/Device
tmpfs            1616672       12   1616660   1% /run/user/121
tmpfs            1616672       32   1616640   1% /run/user/1000
/dev/sda1       15666400 11506912   4159488  74% /media/jason/E86B-1D06
tmpfs            1616672        0   1616672   0% /run/user/0
```
#### 特殊设备loop挂载
如果有光盘镜像文件，过着使用文件作为磁盘的方式时，就要用特别的方法挂在起来，不需要刻录。
+ 挂载CD/DVD镜像文件

挂载镜像文件
```bash
$ ll -h CentOS-7-x86_64-DVD-1810.iso
-rw-rw-r-- 1 jason jason 4.3G 12月  5 23:22 CentOS-7-x86_64-DVD-1810.iso
$ mkdir ./centos_dvd
$ mount -o loop ./CentOS-7-x86_64-DVD-1810.iso ./centos_dvd
mount: /home/jason/Downloads/google/centos_dvd: WARNING: device write-protected, mounted read-only.
$ df ./centos_dvd
Filesystem     1K-blocks    Used Available Use% Mounted on
/dev/loop29      4480476 4480476         0 100% /home/jason/Downloads/google/centos_dvd
$ ll ./centos_dvd
total 693
drwxrwxr-x 8 root  root    2048 11月 26 07:53 ./
drwxrwxr-x 9 jason jason   4096 4月  18 09:57 ../
-rw-rw-r-- 1 root  root      14 11月 26 00:01 CentOS_BuildTag
-rw-r--r-- 1 root  root      29 11月 26 00:16 .discinfo
drwxr-xr-x 3 root  root    2048 11月 26 00:20 EFI/
-rw-rw-r-- 1 root  root     227 8月  30  2017 EULA
-rw-rw-r-- 1 root  root   18009 12月 10  2015 GPL
drwxr-xr-x 3 root  root    2048 11月 26 00:21 images/
drwxr-xr-x 2 root  root    2048 11月 26 00:20 isolinux/
drwxr-xr-x 2 root  root    2048 11月 26 00:20 LiveOS/
drwxrwxr-x 2 root  root  663552 11月 26 07:52 Packages/
drwxrwxr-x 2 root  root    4096 11月 26 07:53 repodata/
-rw-rw-r-- 1 root  root    1690 12月 10  2015 RPM-GPG-KEY-CentOS-7
-rw-rw-r-- 1 root  root    1690 12月 10  2015 RPM-GPG-KEY-CentOS-Testing-7
-r--r--r-- 1 root  root    2883 11月 26 07:54 TRANS.TBL
-rw-r--r-- 1 root  root     354 11月 26 00:21 .treeinfo
$ unmount ./centos_dvd #测试完成记得卸载
```
MD5验证码可以确保设备内部文件的验证。
+ 建立大文件以制作loop设备文件

比如分配系统的时候，犯懒只设置了一个根目录，这样就无法机型额外的分区了，我们可以话分出一个打文件，然后将这个文件loop挂载，这样感觉上就多了一个分区。

Linux下我们可以通过dd命令来建立一个空文件
```bash
$ dd if=/dev/zero of=/srv/loopdev bs=1M count=512
512+0 records in
512+0 records out
536870912 bytes (537 MB, 512 MiB) copied, 0.479746 s, 1.1 GB/s
# 命令解释
# if input file 输入文件，/dev/zero是一直输出0的设备文件
# of output file 输出文件
# bs 每个block的大小
# count 总共几个bs
$ ll -h /srv/loopdev
-rw-r--r-- 1 root root 512M 4月  18 10:28 /srv/loopdev
$ mkfs.ext4  /srv/loopdev #对文件进行格式化
mke2fs 1.44.1 (24-Mar-2018)
Discarding device blocks: done
Creating filesystem with 131072 4k blocks and 32768 inodes
Filesystem UUID: 908d7f09-4ab2-4704-a509-d4721e3e4dcc
Superblock backups stored on blocks:
	32768, 98304

Allocating group tables: done
Writing inode tables: done
Creating journal (4096 blocks): done
Writing superblocks and filesystem accounting information: done
$ blkid /srv/loopdev
/srv/loopdev: UUID="908d7f09-4ab2-4704-a509-d4721e3e4dcc" TYPE="ext4"
# 挂载
$ mount -o loop UUID="908d7f09-4ab2-4704-a509-d4721e3e4dcc" /mnt
$ df /mnt
Filesystem     1K-blocks  Used Available Use% Mounted on
/dev/loop29       499656   780    462180   1% /mnt
```
通过这个方法可以在不改变原来的环境的情况下，进行分区操作，其实Linux下的虚拟机软件也是基于这个原理来进行的。

下面将这个文件永久的挂载起来
```bash
$ nano /etc/fstab
/srv/loopdev /media/jason/file ext4 defaults 0 1
$ umount /mnt
$ mkdir /media/jason/file
$ mount -a
$ df /media/jason/file
Filesystem     1K-blocks  Used Available Use% Mounted on
/dev/loop29       499656   780    462180   1% /media/jason/file
```
### 内存交换分区swap之创建
`/swap`是在物理内存不够时，用来临时存放内粗你数据的地方，现在个人pc的内存基本上都是足够的，但是到了服务器的场景下就不一定了，所以还是预留好`/swap`分区以备不时之需。
+ 设置一个内存交换分区
+ 建立一个虚拟内存文件
#### 使用物理分区创建内存交换分区
+ 1.分区：使用gdisk在磁盘中划分一个分区作为内存交换分区
+ 2.格式化：利用建立内存交换分区的格式的mkswap格式化为内存交换分区格式
+ 3.使用：swapon
+ 4.观察：free和swapon -s观察内存使用量

```bash
$ gdisk /dev/nvme0n1
GPT fdisk (gdisk) version 1.0.3

Partition table scan:
  MBR: not present
  BSD: not present
  APM: not present
  GPT: not present

Creating new GPT entries.

Command (? for help): n
Partition number (1-128, default 1):
First sector (34-20969438, default = 2048) or {+-}size{KMGTP}:
Last sector (2048-20969438, default = 20969438) or {+-}size{KMGTP}: +512M
Current type is 'Linux filesystem'
Hex code or GUID (L to show codes, Enter = 8300): 8200
Changed type of partition to 'Linux swap'

Command (? for help): p
Disk /dev/nvme0n1p4: 20969472 sectors, 10.0 GiB
Sector size (logical/physical): 512/512 bytes
Disk identifier (GUID): 2A01F71D-7DD6-446D-B3E6-65A6FDF8C79B
Partition table holds up to 128 entries
Main partition table begins at sector 2 and ends at sector 33
First usable sector is 34, last usable sector is 20969438
Partitions will be aligned on 2048-sector boundaries
Total free space is 19920829 sectors (9.5 GiB)

Number  Start (sector)    End (sector)  Size       Code  Name
   1            2048         1050623   512.0 MiB   8200  Linux swap

Command (? for help): w

Final checks complete. About to write GPT data. THIS WILL OVERWRITE EXISTING
PARTITIONS!!

Do you want to proceed? (Y/N): y
OK; writing new GUID partition table (GPT) to /dev/nvme0n1p4.
Warning: The kernel is still using the old partition table.
The new table will be used at the next reboot or after you
run partprobe(8) or kpartx(8)
The operation has completed successfully.
$ mkswap /dev/nvme0n1p6
$ blkid /dev/nvme0n1p6
$ free
              total        used        free      shared  buff/cache   available
Mem:       16166752     1845564    11269080      848860     3052108    13156136 #物理内存
Swap:       2097148           0     2097148                                     #swap相关
$ swapon /dev/nvme0n1p6
$ free
total        used        free      shared  buff/cache   available
Mem:       16166752     1845564    11269080      848860     3052108    13156136 #物理内存
Swap:       2597148           0     2597148                                     #swap相关
$ swapon -s
$ nano /etc/fstab
UUID="38cdd582-dff7-4be3-8e55-0cb51fea7c4a" swap swap defaults 0 1
```
#### 使用文件创建文件交换分区
```bash
$ dd if=/dev/zero of=/tmp/swap bs=1M count=128
128+0 records in
128+0 records out
134217728 bytes (134 MB, 128 MiB) copied, 0.183657 s, 731 MB/s
$ ll -h /tmp/swap
-rw-r--r-- 1 root root 128M 4月  18 11:21 /tmp/swap
$ mkswap /tmp/swap
mkswap: /tmp/swap: insecure permissions 0644, 0600 suggested.
Setting up swapspace version 1, size = 128 MiB (134213632 bytes)
no label, UUID=8237d888-982a-46d2-b753-bc38b2d6d588
$ swapon /tmp/swap
swapon: /tmp/swap: insecure permissions 0644, 0600 suggested.
$ swapon -s
Filename				Type		Size	Used	Priority
/swapfile                              	file    	2097148	0	-2
/tmp/swap                              	file    	131068	0	-3
$ nano /etc/fstab
/tmp/swap                                   swap                 swap   defaults            0       1
# 这里不使用UIUD，因为系统仅会查询区块设备文件，不会查询文件
$ swapoff /tmp/swap
$ swapon -s
Filename				Type		Size	Used	Priority
/swapfile                              	file    	2097148	0	-2
$ swapon -a
$ swapon -s
```
### 文件系统的特殊观察与操作
#### 磁盘空间之浪费问题
其实整个文件系统中的超级区块，inode对照表等其他中介数据都会浪费容量，
```bash
$ ll -sh
total 204K
4.0K drwx------ 26 root  root  4.0K 4月  15 16:52 ./
4.0K drwxr-xr-x 27 root  root  4.0K 4月  15 09:53 ../
4.0K drwxr-xr-x  3 root  root  4.0K 8月  26  2018 .android/
4.0K drwxr-xr-x  3 root  root  4.0K 8月  26  2018 Android/
4.0K drwxr-xr-x  4 root  root  4.0K 8月  26  2018 .AndroidStudio3.1/
4.0K drwxr-xr-x  3 root  root  4.0K 8月  26  2018 AndroidStudioProjects/
4.0K -rw-r--r--  1 root  root   113 9月   6  2018 .apport-ignore.xml <--这个文件只有113b，去占用了一个4k的区块
 40K -rw-------  1 root  root   34K 4月  18 10:23 .bash_history
4.0K -rwxrwxrwx  1 root  root  3.3K 3月  29 14:17 .bashrc*
4.0K drwx------  8 root  root  4.0K 4月  15 16:52 .cache/
4.0K drwx------ 10 root  root  4.0K 4月  15 16:52 .config/
4.0K drwx------  3 root  root  4.0K 8月  26  2018 .dbus/
4.0K drwx------  2 root  root  4.0K 4月   8 08:29 .gconf/
4.0K -rw-r--r--  1 root  root    55 11月 29 20:56 .gitconfig
......
```

#### 利用GNU的parted进行分区操作
```bash
$ parted [设备] [命令[参数]]
选项与参数：
命令功能：
      新增分区： mkpart [primary|logical|Extended] [ext4|vfat|xfs] 开始 结束
      显示分区： print
      删除分区： rm [partition]
$ parted /dev/nvme0n1 print #列出本机分区表
Model: INTEL SSDPEKKF256G8L (nvme)
Disk /dev/nvme0n1: 256GB
Sector size (logical/physical): 512B/512B
Partition Table: gpt
Disk Flags:

Number  Start   End    Size    File system  Name                          Flags
 1      1049kB  274MB  273MB   fat32        EFI system partition          boot, hidden, esp
 2      274MB   290MB  16.8MB               Microsoft reserved partition  msftres
 3      290MB   142GB  142GB   ntfs         Basic data partition          msftdata
 4      142GB   153GB  10.7GB  ext4         Basic data partition          msftdata
 5      153GB   255GB  102GB   ext4
 6      255GB   256GB  1049MB  ntfs         Basic data partition          hidden, diag
$ parted /dev/nvme0n1p5 mklabel mbr #改变分区表格式，这样会损坏整个文件系统
$ parted /dev/nvme0n1p5 mkpart primary fat32 36.0G 36.5G #建立新的分区
```

### 重点回顾
+ 压缩指令为透过一些运算方法去将原本的文件进行压缩,以减少文件所占用的磁盘容量。 压缩前与压缩后
的文件所占用的磁盘容量比值, 就可以被称为是『压缩比』
+ 压缩的好处是可以减少磁盘容量的浪费,在 WWW 网站也可以利用文件压缩的技术来进行数据的传送,好
让网站带宽的可利用率上升喔
+  压缩文件案的扩展名大多是:『*.gz, *.bz2, *.xz, *.tar, *.tar.gz, *.tar.bz2, *.tar.xz』
+ 常见的压缩指令有 gzip, bzip2, xz。压缩率最佳的是 xz,若可以不计时间成本,建议使用 xz 进行压缩。
+ tar 可以用来进行文件打包,并可支持 gzip, bzip2, xz 的压缩。
+ 压缩:tar -Jcv -f filename.tar.xz 要被压缩的文件或目录名称
+ 查询:tar -Jtv -f filename.tar.xz
+ 解压缩:tar -Jxv -f filename.tar.xz -C 欲解压缩的目录
+ xfsdump 指令可备份文件系统或单一目录
+ xfsdump 的备份若针对文件系统时,可进行 0-9 的 level 差异备份!其中 level 0 为完整备份;
+ xfsrestore 指令可还原被 xfsdump 建置的备份档;
+ 要建立光盘刻录数据时,可透过 mkisofs 指令来建置;
= 可透过 wodim 来写入 CD 或 DVD 刻录机
+ dd 可备份完整的 partition 或 disk ,因为 dd 可读取磁盘的 sector 表面数据
+ cpio 为相当优秀的备份指令,不过必须要搭配类似 find 指令来读入欲备份的文件名数据,方可进行备份动作。 
