---
title: 鸟哥的Linux私房菜-4-Linux磁盘与文件系统管理
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
```dot

```
#### Linux文件系统的运行
#### 挂载点的意义（mount point）
#### 其他Linux支持的文件系统与VFS
#### XFS文件系统简介
### 文件系统的简单操作
#### 磁盘与目录的容量
#### 硬链接与符号链接：ln
### 磁盘的分区，格式化，检验与挂载
#### 观察磁盘分区状态
#### 磁盘分区：gdisk/fdisk
#### 磁盘格式化，创建文件系统
#### 文件系统检验
#### 文件系统挂载与卸载
#### 磁盘文件系统参数自定义
### 设置启动挂载
#### 启动挂载/etc/fstab及/etc/mtab
#### 特殊设备loop挂载
### 内存交换分区swqp之创建
#### 使用物理分区创建内存交换分区
#### 使用问家你创建文件交换分区
### 文件系统的特殊观察与操作
#### 磁盘空间之浪费问题
#### 利用GNU的parted进行分区操作
