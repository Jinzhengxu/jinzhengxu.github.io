---
title: Ubuntu+LaTeX+Vim史上最强Note
date: 2019-03-29 15:20:24
tags:
- Linux
- linux
- vim
- LaTeX
categoties: 忒修斯之船
copyright:
---
自从被种草Markdown以后，真的是大大提升了效率。但是每次碰上$ \LaTeX $还是会gg，但是看了国外的一位老哥上课$\LaTeX$比老师板书都快，真的很羡慕啊，但是也舍弃不了Spacevim的便利，这里就尝试一下，如何使用spacevim达到和[这篇文章](https://castel.dev/post/lecture-notes-1/)国外老哥的一样的效果。

+ 环境配置

### 环境配置
#### SpaceVim
这里可以参考我之前 的[blog](http://jinzhnegxu.online/2019/02/11/vim%E7%9A%84%E6%96%B0%E7%94%9F-Spacevim/)
简单来说只要：
```bash
$ curl -sLf https://spacevim.org/install.sh | bash
```
就好了。
#### Inkscape
Inkscape是一个开源项目，你可以在[inkscape.org](https://inkscape.org/)找到自己使用平台的安装包，在ubuntu下使用ppa就可以简单的完后安装：
```bash'
$ sudo add-apt-repository ppa:inkscape.dev/stable
$ sudo apt-get update
```
#### Zathura
这是一个pdf阅读器
```bash
$ sudo apt install zathura
```

### spacevim开启插件
#### vimtex
首先要开启插件`lang#latex`来使vim可以使用tex语法，`lang#latex`是基于插件`vimtex`
打开`/.SpaceVim.d`文件夹下的`init.toml`文件插入
```
[[layers]]
  name = "lang#latex"
```
#### Markdown支持
打开`/.SpaceVim.d`文件夹下的`init.toml`文件插入
```
[[layers]]
  name = "lang#markdown"
```
配置完成后打开终端输入
```
$ vim
```
Sapcevim就会自己开始下载插件了
[![AB3JMj.md.png](https://s2.ax1x.com/2019/03/29/AB3JMj.md.png)](https://imgchr.com/i/AB3JMj)
### 片段Snippets
有了这些设置，我们就来到了最关键的地方：写作LaTeX的速度和讲师在黑板上写的一样快。这就是片段发挥作用的地方。

#### 什么是片段？
片段是一段可重复使用的短文本，可以由其他一些文本触发。例如，当键入sign并按下时Tab，该单词sign将扩展为签名时
<img src="https://s2.ax1x.com/2019/03/29/AB3Sq1.gif" alt="AB3Sq1.gif" border="0" />
片段也可以是动态的：当键入today并按下时Tab，该单词today将被当前日期替换，键入box并使用Tab，将会获得一个自动增大的框。
<img src="https://s2.ax1x.com/2019/03/29/AB3ARe.gif" alt="AB3ARe.gif" border="0" />

<img src="https://s2.ax1x.com/2019/03/29/AB3ExH.gif" alt="AB3ExH.gif" border="0" />
片段也是可以嵌套使用的
<img src="https://s2.ax1x.com/2019/03/29/AB3uZt.gif" alt="AB3uZt.gif" border="0" />

#### 使用UltiSnips创建片段
Spacevim并未提供对UltiSnips的模块支持，所以我们需要自己创建一个私有模块才能使用Ultisnips.

##### 私有模块
这一部分简单介绍了模块的组成，更多关于新建模块的内容可以阅读 SpaceVim 的模块首页。

##### 目的

使用模块的方式来组织和管理插件，将相关功能的插件组织成一个模块，启用/禁用效率更加高。同时也节省了很多寻找插件和配置插件的时间。

##### 结构

在 SpaceVim 中，一个模块是一个单个的 Vim 文件，例如，`autocomplete` 模块存储在 `autoload/SpaceVim/layers/autocomplete.vim`，在这个文件内有以下几个公共函数：

SpaceVim#layers#autocomplete#plugins(): 返回该模块插件列表

SpaceVim#layers#autocomplete#config(): 模块相关设置

SpaceVim#layers#autocomplete#set_variable(): 模块选项设置函数
调试上游插件

当发现某个内置上游插件存在问题，需要修改并调试上游插件时，可以依照以下步骤操作：

禁用内置上游插件 比如，调试内置语法检查插件 neomake.vim
```c
[options]
    disabled_plugins = ["neomake.vim"]
```
添加自己 fork 的插件 修改配置文件 `init.toml`，加入以下部分，来添加自己 fork 的版本：
```c
[[custom_plugins]]
   name = 'wsdjeg/neomake.vim'
   # note: you need to disable merged feature
   merged = false
```
或者添加本地克隆版本 使用 bootstrap_before 函数来添加本地路径：
```c
function! myspacevim#before() abort
    set rtp+=~/path/to/your/localplugin
endfunction
```
#### 使用Inkscape生成图片
从菜单中：文件 - >保存副本。在右下角，选择文件类型“Encapsulated PostScript（* .eps）”

在LaTeX文件中，使用“\ includegraphics {filename.eps}”。有关如何在LaTeX中使用EPS文件的教程，请搜索Google：latex导入图形。
