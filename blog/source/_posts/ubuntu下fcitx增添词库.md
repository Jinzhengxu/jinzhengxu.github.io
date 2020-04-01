---
title: ubuntu下fcitx增添词库
date: 2019-04-17 21:46:51
tags:
  - Linux
categories: 软件工具
copyright:
---

为了使用atom真的是大费周章，因为atom貌似不是KDE的环境，所以在屏幕下方使用sougoupinyin时，会出现候选框跑到屏幕外面的情况，这就很难受。(这是因为qimpanel不支持这种桌面环境？）

不管怎样，atom的片段功能实在是好用，所以权衡一下，hello google，goodbye sougou。但是google拼音的词库是依托于fcitx的，词库源很少而且并不好用，所以这里我们就来为fcitx添加词库。

#### 下载词库
首先新建一个文件夹来保存我们想要的词库，然后在[搜狗拼音官网](https://pinyin.sogou.com/dict/)下载细胞词库，将下载的词库放入该文件夹中。
```bash
$ cd ./Doucments
$ mkdir ./dict/
$ cp *.scel ~/Documents/dict/ #这步操作在下载文件夹下执行
$ rm *.scel #这步操作在下载文件夹下执行
```
意外的发现了很多优秀词库啊
![ESUjqU.png](https://s2.ax1x.com/2019/04/18/ESUjqU.png)

#### 转为 org 格式
```bash
$ cd ./Doucments/dict/
$ mkdir org
$ find . -name '*.scel' -exec scel2org -o org/{}.org {} \;
```
#### 合并所有org文件
```bash
$ mkdir dict
$ cd dict
$ cat ../org/*.scel.org > 1.org
```

#### 复制fcitx的基础词库

这里说明一下，我之复制了搜狗标准词库，因为fcitx的词库感觉里面的候选词都很鬼畜，但是我也会列出如何复制fcitx的词库。
##### 准备必要的两个文件
从这里下载[http://code.google.com/p/fcitx/downloads/list](http://code.google.com/p/fcitx/downloads/list)fcitx-4.xx_dict.rat.gz词库文件
```bash
$ tar xf fcitx-4.2.7_dict.tar.xz fcitx-4.2.7/data/{pinyin.tar.gz,gbkpy.org}
$ tar xf fcitx-4.2.7/data/pinyin.tar.gz
$ mv fcitx-4.2.7/data/gbkpy.org ./
```
##### 合并 fcitx 基础词库
```bash
$ cat pyPhrase.org >>1.org
```
排序、去重、生成词库
```bash
$ sort 1.org >2.org
$ uniq 2.org >3.org
$ createPYMB gbkpy.org 3.org
Groups: 412
Start Loading Phrase...
225832 Phrases, 225831 Converted!
Writing Phrase file ...
OK!
```
##### 结果文件:
```
pyERROR 词库中重复或有其它问题条目，有兴趣可参考，没事直接忽略
pyPhrase.ok 除错后的无错的 org 格式词库，可取代 3.org 而保留供下次使用
pyphrase.mb 最终词库，必须，用于覆盖原文件
pybase.mb 配套的字码库，必须，用于覆盖原文件
```

#### 覆盖本地的词库文件
解压后，复制两 .mb 文件至 /usr/share/fcitx/data/ 或 /usr/share/fcitx/pinyin/ 覆盖原文件，或置于 ~/.config/fcitx/ 或 ~/.config/fcitx/pinyin/ 之中。这里要注意的是本地词库中也有同名的两个文件所以，一定要记得加上-f选项，否则不会生效。
```bash
$ sudo su
$ cp -f pybase.mb /usr/share/fcitx/pinyin/
$ cp -f pyphrase.mb /usr/share/fcitx/pinyin/
```
然后就可以reboot重启，或者kill掉fcitx进程并重启。

重启之后，对照`3.org`文件的内容，打几个词自看看是否一致，如果候选词出现就是配置完成了！

#### 开启云拼音

本地词库再丰富，也不如网络上实时更新的云词库内容的更新速度。

终端安装插件
```bash
$ sudo apt-get install fcitx-module-cloudpinyin
$ fcitx-configtool
```

打开以后将源换到百度就可以正常使用了。
![ES0Dyt.png](https://s2.ax1x.com/2019/04/18/ES0Dyt.png)

#### rime

发现了一个十分好用的输入法
```bash
$ sudo apt-get install fcitx-rime
```
就可以使用了，中州韵真香。
