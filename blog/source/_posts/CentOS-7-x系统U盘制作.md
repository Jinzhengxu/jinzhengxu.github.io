---
title: Ubuntu下CentOS 7.x系统U盘制作
date: 2018-12-05 23:22:17
tags:
- Linux
- CentOS
- 虚拟机
categories: 忒修斯之船
copyright: true
---
CentOS是红帽(RedHat)旗下RHEL的社区化版本，稳得一批。
### 安装步骤
* 所需工具及资源
* 开始安装
### 所需工具
* VMware workstations
* CentOS 7.x iso镜像

#### VMware workstations

Ubuntu 下安装VMware和Win平台下区别不大，网络上有不少免费使用VMware的方法，在这里还是呼吁大家使用正版或者开源软件。特别注意的一点是VMware等虚拟机程序需要在BIOS关闭Sercute Boot选项这样虚拟机才能正常工作，如果你启动不了虚拟机程序最好检查自己的BIOS中有没有关闭Sercute Boot选项。
### CentOS 镜像下载

[CentOS](https://www.centos.org/download/)官网提供了两种下载选项`DVD ISO`和`Minimal ISO`，我们是制作随身的系统应该是需要图形界面辅助的，建议大家下载DVD版，这样在后续的安装过程中比较方便。

根据你自己的机器类型选择下载文件，这里推荐[阿里云的镜像](http://mirrors.aliyun.com/centos/7.6.1810/isos/x86_64/CentOS-7-x86_64-DVD-1810.iso)，是属于速度比较快的下载源。如果你有自己的境外VPS服务建议你通过自己的服务器下载这样速度会有较大提升。

### 开始安装

#### 虚拟机配置

首先打开VMware，点击左上角`File`选择`New Virtual Machine`，选择经典安装方式即可。

<img src="https://s2.ax1x.com/2019/02/19/kcbmNR.png" alt="Typecial" width="40%" >

然后点击`next`，在下一页面选择操作系统的类型，我们点选`Linux`和`CentOS 7 64-bit`

<img src="https://s2.ax1x.com/2019/02/19/kcbn41.png" alt="CetnOS chose" width="40%" >

继续`next`，我们选择稍后安装操作系统

<img src="https://s2.ax1x.com/2019/02/19/kcbM36.png" alt="later" width="40%" >

然后一路next，这样虚拟机的配置就完成了。在刚创建的虚拟机页面上打开编辑虚拟机设置。打开以后首先配置内存和处理器，根据你个人机器的实际内存选择即可。

然后打开USB设置，将USB选项中把所有选项都打钩，选择USB3.0，点击`Save`保存退出。

<img src="https://s2.ax1x.com/2019/02/19/kcbEB4.png" alt="later" width="40%" >

在点击`DVD/CD(IDE)`选择下载的CentOS的iso镜像地址，点击`Save`保存退出。

<img src="https://s2.ax1x.com/2019/02/19/kcbeE9.png" alt="later" width="40%" >

#### 安装CentOS
好了，配置完成之后我们就可以正式进入安装环节了！打开虚拟机
键盘切换到`Install CentOS 7`但是不要回车选择，点一下`Tab`键，键盘输入` inst.gpt`然后回车进入安装界面。

##### CentOS基本配置

首先选择语言，建议大家选择英文系统，Linux环境下的依赖关系一直是个让人头疼的问题，引入中文可能会搞出一些莫名奇妙的报错信息。而且如果你有过使用Linux的经验，这点英文的难度应该也不算太大。

进入下图界面以后西安设置好你的时区`Date and Time`和语言包`language`，语言包建议增加中文包支持。

然后点击，选择`Serve with GUI`带图形界面的服务器，右侧的选项里勾选兼容性程序库和基本开发环境

##### 分区
选择好这些配置以后，开始调整分区设置打开 ，选择你要安装CentOS的U盘，如果没有特殊学习要求直接选择自动分区，接受退出安装即可。
如果希望自己分配空间，选择自主分配空间，点击`Done`会自动进入分区页，点击`+`即可新建分区。

<img src="https://s2.ax1x.com/2019/02/19/kcbVHJ.png" alt="parition" width="40%" >

按照自己的意愿选择好分区方式。点击`Done`完成分区设置，点击右下角AC开始安装。

<img src="https://s2.ax1x.com/2019/02/19/kcbK9x.png" alt="accept" width="40%" >

##### 密码
密码有两个分别是root密码和用户密码，如果密码小于5位要连续点两次`Done`才能生效。

下面就是静静的等待了，这是一段比较漫长的时间，你可以离开电脑去健个身洗洗澡回来应该就差不多了。

#### 重启
选择接受协议后就可以开始使用你的CentOS 7了。
参考:[鸟哥的Linux教程](http://linux.vbird.org/)