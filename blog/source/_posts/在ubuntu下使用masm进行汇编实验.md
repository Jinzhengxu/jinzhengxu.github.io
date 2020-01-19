---
title: 在ubuntu下使用masm进行汇编实验
date: 2019-10-10 18:51:50
tags:
  - masm
  - ubuntu
  - 汇编语言
categoties: 忒修斯之船
copyright:
---
windows下我们常常使用masm作为学习汇编语言的环境，Linux虽然有nasm等强大的开源软件，但是nasm的debug，编译等都与lab中使用masm的方式不同，但是masm对于linux的适配并不是非常完美。很多人选择重新开一个windows xp虚拟机来进行masm的安装，根据`禁止套娃`的原则，这里介绍集中可以在ubuntu下使用masm的方法。

### 安装dosbox
ubuntu在软件商店中提供了dosbox，之间安装即可。
```bash
$ sudo apt install dosbox
```
### 下载masm文件夹
从[这里](https://drive.google.com/folderview?id=0B1DiPkxLHBZHTWVQVVNlYVptU3M&usp=sharing)下载文件并加压
### masm使用
首先在masm文件夹下新建一个你的`.asm`文件，或者你也可以直接号使用masm文件夹下自带的`count99.asm`文件。

然后新建一个终端，输入：
```bash
$ dosbox
```
打开dosbox，将masm文件夹挂载：
```bash
Z:\SET BLASTER+A220 I7 D1 H5 T6
Z:\> mount c: ~/Downloads/masm

Drive C is mounted as local directory /home/jason/Downloads/masm
```
输入命令`mount c: ~/Downloads/masm`，注意这里的文件地址是你的电脑当前用户主目录下的地址。

进入挂载后的Drive C并查看文件：
```bash
Z:\>c:
C:\>dir
```

编译并连接`.asm`文件：
```bash
C:\>masm count99;
C:\>link count99;
```

进入debug：
```bash
C:\>debug count99.exe
```
然后我们就进入了debug环境，接下来就可以进行实验了。
