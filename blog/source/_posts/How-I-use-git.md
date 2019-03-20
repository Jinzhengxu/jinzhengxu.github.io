---
title: How I use git
date: 2019-01-14 15:44:54
tags: 
- git
- linux
- Github
categoties: 忒修斯之船
copyright: true
---
git是由大神Linus Torvalds开发的分布式版本控制工具，目前在项目合作等方面发挥着不可替代的作用，为开源运动的发展做出了杰出的贡献。git带来的好处也早就覆盖到了其他领域，例如，我现在就在使用git来管理我的blog。但是平时使用时从未真正深入理解过git的工作原理，也并未使用过svn等其他版本控制工具，今天就补上这一课。
* 安装git
* git使用
### 安装git
```bash
$ sudo apt-get install git
```
安装完成后，在git中配置你的名字和电子邮件地址
```bash
$ git config --global user.name "Your Name"
$ git config --global user.email "email@example.com"
```
### git使用
git初始化仓库
```bash
$ git init
```
git删除文件
```bash
$ git rm file
```
git提交修改到commit
```bash
$ git commit -m 文件
```
git提交到repo
```bash
$ git push
```