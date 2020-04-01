---
title: 'ssh连接报错WARNING: REMOTE HOST IDENTIFICATION HAS CHANGED!'
date: 2019-03-20 16:33:15
tags:
- ssh
- Linux
categories: 软件工具
copyright:
---
今天在服务器被banl，在用ssh连接新deploy的服务器时,遇到点小问题。终端显示：
```bash
jason@jason-ThinkPad-X1-Carbon-6th:~$ ssh root@149.28.88.126
@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@
@    WARNING: REMOTE HOST IDENTIFICATION HAS CHANGED!     @
@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@
IT IS POSSIBLE THAT SOMEONE IS DOING SOMETHING NASTY!
Someone could be eavesdropping on you right now (man-in-the-middle attack)!
It is also possible that a host key has just been changed.
The fingerprint for the RSA key sent by the remote host is
SHA256: 你的sha秘钥
Please contact your system administrator.
Add correct host key in /home/jason/.ssh/known_hosts to get rid of this message.
Offending RSA key in /home/jason/.ssh/known_hosts:7
  remove with:
  ssh-keygen -f "/home/jason/.ssh/known_hosts" -R "你的IP地址"
RSA host key for 你的IP地址 has changed and you have requested strict checking.
Host key verification failed.
```
因为我们第一次进行SSH连接时，会自动生成生成一个认证，并且储存在客户端中的known_hosts，如果服务器验证过了，本地储存的认证也会更改，服务器端与客户端不同时，就会显示这个错误。因此，只要把本地储存的认证资讯删掉，连线时重新生成，就可以解决这个错误了，在终端输入：
```bash
$ ssh-keygen -R +服务器的IP
```
然后通过：
```bash
$ ssh root@yourIPaddress
```
就可以再次连接服务器了。

