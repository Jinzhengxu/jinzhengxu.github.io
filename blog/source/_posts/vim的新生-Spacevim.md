---
title: vim的新生--Spacevim
date: 2019-02-11 18:29:00
tags:
- vim
categories: 软件工具
copyright: true
---
要说Linux下的文本编辑器大哥，那当然是vim啦。但是除了极少数的大神，使用不带任何plugin的vim对于普通人来说还是稍有些难度。如果使用vim来AA题还好，管理大型项目则是一个不小的挑战，所以就有了今天的主角 *Spacevim* 的出现，Spacevim是一个[开源项目]()，有自己的[中英文官网](https://spacevim.org/https://github.com/SpaceVim/SpaceVim)，和丰富详尽的指南，还可以自己定义快捷键模式。将一个上古编译器拉倒现代IDE的水平，真的要给Spacevim的团队一个赞。
#### 为什么我要使用Spacevim
Spacevim的界面色彩对于我现在使用的X1 CARBON镜面屏来说比较友好，而且spacevim提供的智能补全功能也提升了效率。当然最关键的还是我的jetbrains全家桶过期了。。。
#### 安装与使用
首先更新vim到8.0.0以上的版本，终端下输入
```bash
$ curl -sLf https://spacevim.org/install.sh | bash
```
等待安装完成

打开vim，第一次打开vim会自动下载插件并配置如果出现网络问题致使插件下载不全，在sapcevim中输入
```bash
:SPUpdate
```
我在使用时在非root模式下启动vim是会出现提示`can't create ... press enter to continue`的提示，这时只要给提示中 ... 部分显示的文件夹使用`chmod`命令赋予权限就可以正常打开了。

##### tagbar
sapcevim中F2快捷键可以打开语法树，如果提示不能，需要安装模块[gtags](https://spacevim.org/layers/gtags/).

这里有两种安装方式，由于许多OS的软件库都已经过时了，有可能缺失pygments 和 exuberant ctags的支持，所以我使用从源码编译的方式。
###### 从软件库安装（Ubuntu）
```bash
$ sudo apt-get install global
```
###### 从源码编译安装
如果需要启用 global 的所有特性，你需要安装 2 个额外的软件包：pygments 和 ctags。 这两个可以使用系统自带的包管理器安装：
```bash
$ sudo apt-get install exuberant-ctags python-pygments
```
编译安装,下载最新的 tar.gz 文件，执行如下命令：
```bash
$ tar xvf global-6.5.3.tar.gz
$ cd global-6.5.3
$ ./configure --with-exuberant-ctags=/usr/bin/ctags
$ make
$ sudo make install
```
配置 pygments 和 ctags 环境
```bash
$ cp gtags.conf ~/.globalrc
```
此外，启动 shell 时需要设置环境变量 GTAGSLABEL，通常需要修改 .profile 文件。
```bash
$ echo export GTAGSLABEL=pygments >> .profile
```
启用模块
可在配置文件''init.toml添加如下内容来启用该模块。
```
[[layers]]
  name = "tags"
```


| 快捷键	| 功能描述 |
| :---- | :---- | 
|SPC m g c	|新建 tag 数据库
|SPC m g u	|手动更新 tag 数据库
|SPC m g f	|列出数据库中所涉及到的文件
|SPC m g d	|查找 definitions
|SPC m g r	|查找 references
##### 大功告成
![完成截图](https://s2.ax1x.com/2019/02/19/kcXExx.png)
