---
title: Hexo+Ubuntu+Gtihub打造你的个人博客
date: 2018-11-30 12:41:27
tags: 
- 博客
- Markdown
categories: 忒修斯之船
comments: true
copyright: true
---

搭建自己的个人博客是一件很有趣的事，可是网上教程大多是关于Windows系统下通过Hexo搭建博客的教程，对于Linux重度用户来说十分不友好这里趁着熟悉，为大家整理一份相近的教程。主要解决Ubuntu下git免密hexo部署等问题。

* 环境配置
* 域名购买及连接
* hexo 基本操作
* Markdown语法

## 环境配置

* Github
* Node.js
* Hexo

### Github配置
使用apt命令通过ppa源安装分布式版本控制工具git:
``` bash
$ sudo add-apt-repository ppa:git-core/ppa
$ sudo apt-get update
$ sudo apt-get install git
```
在终端中输入
```bash
$ git --version
```
验证是否安装成功，若出现
```bash
git version 2.17.1
```
则安装完成。然后开始配置SSH，首先打开终端输入
```bash
$ git config --global user.name "yournaem@github.com"
$ git config --global user.email "youremail@github.com"
```
将后缀改为你的账户名和Github绑定邮箱，不用输入`@github.com`。

新建一个终端输入:
```bash
$ ssh-keygen -t rsa -C "your_email@example.com"
```
按要求设置密码等，回车后会在主目录下生成两个文件`id_rsa`和`id_rsa.pub`，复制`id_rsa.pub`中的内容，打开Github中settings页面找到`SSH and GPG keys`设置，点击`New SSH key`,填写title，然后将内容复制到key中，确认。在终端下输入:
```bash
$ ssh -T git@github.com
```
收到提示信息`Hi username! You’ve successfully authenticated, but GitHub does not provide shell access.`即配置SSH成功。
可是在blog更新时每次输入密码是很麻烦的，所以打开终端，输入:
```bash
$ touch .git-credentials
$ vim .git-credentials
```
在文件中输入:
```
https://{username}:{password}@github.com
例如 https://jinzheng:123456@github.com
```
`:wq`保存后，在终端输入:
```bash 
$  git config --global credential.helper store
```
打开`.gitconfig`文件多了一行`[credential] helper = store`。此时密码配置完成。只要再输一次密码就会永久保存。

git安装完成后在[Github](https://github.com/)官网注册账号后点击 new repository新建一个项目，注意项目名称为`username.github.io`这是标准格式，例如我的Github账号名为Jinzhengxu，那我的项目名称就是`jinzhengxu.github.io`这个不可以更改。此时在浏览器输入`username.github.io`就可以看到你的个人主页了。

完成以后在repository的主页左上角点击 `Clone or download` 选择SSH链接并复制。在终端下输入:
```bash
$ git clone git@github.com:username/username.github.io.git
```
不要忘记修改成你自己的账户和仓库地址。等待仓库clone完成，
在终端下输入:
```bash
$ cd ~/username.github.io
$ hexo init [folder]
```
### Node.js配置
我们使用编译安装的方法来安装Node.js，虽然这样比较麻烦但是可以不用考虑安装其他的安装模块。而且Linux系统下依赖关系比较复杂，常用的前端库`event-stream`就植入了恶意代码，所以尽量还是编译安装。

Node.js[官网下载地址](https://nodejs.org/en/download/)，我们使用Linux系统，所以选择下载Source Code源代码。

打开终端转到下载源代码文件的目录下，输入:
```bash
$ # tar xvf node-v10.13.0.tar.gz
$ cd node-v10.13.0
$ ./configure
$ make
$ make install  
$ cp /usr/local/bin/node /usr/sbin/ 
```
安装完成后，在终端下输入:
```bash
$ node -v
```
显示版本号`v10.13.0`即安装成功。接下来更新npm:
```bash
$ npm -v
$ nom install -g npm
```
等待安装完成即可。
### Hexo配置
在终端下输入:
```bash
$ npm install hexo-cli -g
$ npm install hexo -g
```
在终端窗口，定位到Hexo站点目录下:
```bash
$ cd username.github.io
$ hexo init [folder]
```
测试网站，继续输入:
```bash
$ hexo clean
$ hexo g
$ hexo s
```
在浏览器里打开`localhost:4000`就能看到网站了。
然后将Github的仓库和本地个人仓库连接起来，打开Hexo创建的博客主目录下的`.config.yml`文件，在文件的最后将文件修改为
```
deploy:
  type: git
  repo: https://github.com/Username/username.github.io.git
  branch: master
```
将repo的地址更换为你自己的仓库地址。然后`:wq`保存退出，在终端下输入:
```bash
$ npm install hexo-deployer-git --save
```
安装git插件，然后顺序执行:
```bash
$ hexo clean
$ hexo g
$ hexo d
```
此时在浏览器输入`username.github.io`就可以看到你的Hexo主页了。
## 域名购买及连接
国内主要的域名服务商就是腾讯云和阿里云万网，都可以选择，万网操作比较简单,千万注意购买域名的英文名是否是你想要的，域名属于即时服务一旦购买无法撤回。

打开阿里云管理控制台，找到域名，进入解析，在解析中添加三条:
![添加解析](http://pj5rgjk03.bkt.clouddn.com/18-12-3/18250294.jpg "添加解析")
然后登录GitHub，进入之前创建的仓库，点击settings，设置Custom domain，输入你的个人域名。

找到hexo blog目录下的`source`文件夹打开新建一个文件`CNAME`，在其中填写上刚刚购买的域名，可以省略掉`www.`这样可以在浏览器中免除输入`www.`。

完成后，打开终端输入:
```bash
$ hexo clean
$ hexo g
$ hexo d
```
此时在浏览器中输入你的域名，就可以打开你的个人网站啦。

## Hexo 基本操作
* Hexo操作
* Hexo主题
### Hexo操作
```
npm install hexo -g  #安装Hexo
npm update hexo -g   #升级 
hexo init            #初始化博客
```
命令简写:
```
hexo n "new_test_site" == hexo new "new_test_site" #新建文章
hexo g == hexo generate #生成
hexo s == hexo server #启动服务预览
hexo d == hexo deploy #部署
hexo server #Hexo会监视文件变动并自动更新，无须重启服务器
hexo server -s #静态模式
hexo server -p 5000 #更改端口
hexo server -i 192.168.1.1 #自定义 IP
hexo clean #清除缓存，若是网页正常情况下可以忽略这条命令
```
More info: [Writing](https://hexo.io/docs/writing.html)
More info: [Server](https://hexo.io/docs/server.html)
More info: [Generating](https://hexo.io/docs/generating.html)
More info: [Deployment](https://hexo.io/docs/deployment.html)
### Hexo主题
从[这里](https://hexo.io/themes/)你可以寻找你喜欢的主题，我使用的是NexT主题，在blog位置打开终端输入:
```bash
$ git clone https://github.com/theme-next/hexo-theme-next.git thmems/next
```
将[NexT](https://github.com/theme-next/hexo-theme-next)下载到themes下的next文件夹，在blog目录打开站点配置文件`_config.yml`中`themes`修改为：
```
# Extensions
## Plugins: https://hexo.io/plugins/
## Themes: https://hexo.io/themes/
theme: next
```
打开next文件夹目录下的`_config.yml`,通过注释掉不同的选项，你可以设置自己的样式:
```
# Schemes
#scheme: Muse
scheme: Mist
#scheme: Pisces
#scheme: Gemini
```
也可以修改`menu`下的注释来添加模块组:
```
menu:
  home: / || home
  about: /about/ || user
  tags: /tags/ || tags
  categories: /categories/ || th
  archives: /archives/ || archive
  #schedule: /schedule/ || calendar
  #sitemap: /sitemap.xml || sitemap
  #commonweal: /404/ || heartbeat
```
举例来说，假如我要添加目录categories，首先将`_config.yml`文件中categories前的`#`删掉，然后在blog打开终端，输入:
```bash
$ hexo new page "categories"
```
## Markdown语法
Markdown是一款轻量级的语言，利用Markdown写出的博文不会和HTML一样有许多标签，比较贴近文本的自然形式。在[这里](https://www.appinn.com/markdown/)你可以找到许多Markdown的介绍和实例。