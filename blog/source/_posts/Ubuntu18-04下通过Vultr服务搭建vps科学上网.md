---
title: Ubuntu18.04下通过Vultr服务搭建vps科学上网
date: 2019-03-14 16:43:15
tags:
- linux
- 服务器
- 科学上网
- CentOS
categoties: 忒修斯之船
copyright:
---
* 购买vps服务器
* 通过ssh连接服务器
* 安装科学上网软件
* 连接vps科学上网

#### 1.购买vps服务器
Vultr（[www.vultr.com](https://www.vultr.com/?ref=7958083) )是一家云基础架构提供商，面向软件开发人员提供虚拟专用服务器（VPS），具有许多性价比很高的服务器，按时计费。目前（2019年3月14日）最低价格为$5.00/月($0.007/小时)。而且最近退出一个新用户首冲10美元送50美元额度的活动[新用户50美元](https://www.vultr.com/?ref=7958085-4F)，性价比可以说非常之高了，谁叫老用户是狗呢。

首先在vultr中`create account`创建一个账户，通过邮箱验证。点击侧边栏的billing就可以充值了。购买服务器需要最低充值10美金，使用支付宝付款，服务器按小时计费。充值流程：【Billing】-【Alipay】-【Pay with Alipay】-【完成支付】
![create account](http://www.vuvps.com/wp-content/uploads/2018/06/1.png)
然后选择左侧`Servers`，点击右侧圆圈状的+号进行添加服务器。这里的服务器地址`Server Location`建议选择美国地区的服务器，因为日本和新加坡地区的服务器22端口封的较多，搭建成功率较低，如下图：
![AABXWj.png](https://s2.ax1x.com/2019/03/14/AABXWj.png)
服务器类型`Server Type`选择Centos 6 x64，套餐选择看自己的经济水平吧，像我就是5美元足矣，如下图:
![AABxln.png](https://s2.ax1x.com/2019/03/14/AABxln.png)
附加功能`Additional Features`选择`Enable IPv6`必选，其他的付费选项看自己经济水平，免费的看需要，如下图:
![AABvSs.png](https://s2.ax1x.com/2019/03/14/AABvSs.png)
服务器名和标签`Server Hostname & Label`随意填写即可。另外其他的选项不用配置。最后点击Deploy Now即可。

#### 2.通过ssh连接服务器
回到左侧的`Servers`，会看到新增了一个服务器，这时的服务器状态为`Installing`，如下图：
![AAs8sI.png](https://s2.ax1x.com/2019/03/14/AAs8sI.png)
等待几分钟后即可变为`Running`，点击`Test`后，可以看到与服务器相关的信息。包括带宽、CPU使用率等。然后在左下方会有IP地址IP Address、用户名Username、密码Password，这是我们接下来要用到的，如下图：
![AAsGLt.png](https://s2.ax1x.com/2019/03/14/AAsGLt.png)
在通过`ssh`连接服务器之前之前我们可以ping一下IP地址
```bash
ping yourIPaddress
```
查看访问速度如何。（如果延迟过大，可以将服务器删除，重新选择不同的服务器地址再新建一个）终端输出：
```
PING  yourIPaddress(yourIPaddress) 56(84) bytes of data.
64 bytes from yourIPaddress: icmp_seq=1 ttl=42 time=298 ms
64 bytes from yourIPaddress: icmp_seq=2 ttl=39 time=257 ms
64 bytes from yourIPaddress: icmp_seq=3 ttl=39 time=255 ms
64 bytes from yourIPaddress: icmp_seq=4 ttl=42 time=280 ms
64 bytes from yourIPaddress: icmp_seq=5 ttl=39 time=272 ms
```
可以看到，延迟基本上在200ms左右，可以换个更快的。

接下来打开终端，输入
```bash
ssh root@yourIPaddress
```
然后输入密码，一路yes，就可以连接到服务器了，windows系统可以通过`Xshell`来进行ssh连接。终端输出
```
ssh root@yourIPaddress
The authenticity of host 'yourIPaddress (yourIPaddress)' can't be established.
RSA key fingerprint is SHA256:dB3/Hw31dtrjl3tJDBQNmd6ADYBC3UdNYYpqp3sqHeg.
Are you sure you want to continue connecting (yes/no)? yes
Warning: Permanently added 'yourIPaddress' (RSA) to the list of known hosts.
root@yourIPaddress's password: 
[root@Jason ~]# 
```

#### 安装科学上网软件
ssh登录服务器成功之后，依次输入以下三条命令：
```bash
wget --no-check-certificate -O shadowsocks-all.sh https://raw.githubusercontent.com/teddysun/shadowsocks_install/master/shadowsocks-all.sh
chmod +x shadowsocks-all.sh
./shadowsocks-all.sh 2>&1 | tee shadowsocks-all.log
```
然后系统会出现相关配置界面，如下图：
![AA5FrF.png](https://s2.ax1x.com/2019/03/14/AA5FrF.png)
选择2继续安装，随便输入一个密码（记不住可以自己看配置文件，但最好记住）：
[![AA5EVJ.png](https://s2.ax1x.com/2019/03/14/AA5EVJ.png)](https://imgchr.com/i/AA5EVJ)
选择加密方式和协议等直接回车使用默认配置也可以（但是你都要记住一会连接时需要用到）：
![AA5mP1.png](https://s2.ax1x.com/2019/03/14/AA5mP1.png)
然后等待安装完成，会给出配置详细的参数，和一键导入的连接和二维码。
```bash
2019-03-14 11:18:52 INFO     util.py:94 loading libcrypto from libcrypto.so.10
2019-03-14 11:18:52 INFO     shell.py:74 ShadowsocksR SSRR 3.2.2 2018-05-22
IPv6 support
Starting ShadowsocksR success

Congratulations, ShadowsocksR server install completed!
Your Server IP        :  xxxxxxxxxxx 
Your Server Port      :  xxxxxx
Your Password         :  xxxxxxxxxx 
Your Protocol         :  origin 
Your obfs             :  plain 
Your Encryption Method:  aes-256-cfb 

Your QR Code: (For ShadowsocksR Windows, Android clients only)
 ssr://xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx 
Your QR Code has been saved as a PNG file path:
 /root/shadowsocks_r_qr.png 

Welcome to visit: https://teddysun.com/486.html
Enjoy it!
```
###### ssr常用命令
```
启动SSR：
/etc/init.d/shadowsocks-r start
退出SSR：
/etc/init.d/shadowsocks-r stop
重启SSR：
/etc/init.d/shadowsocks-r restart
SSR状态：
/etc/init.d/shadowsocks-r status
卸载SSR：
./shadowsocks-all.sh uninstall
配置文件路径：vi /etc/shadowsocks-r/config.json
日志文件路径：/var/log/shadowsocksr.log
代码安装目录：/usr/local/shadowsocks
```
其实到这里VPS已经搭建好可以使用了，不过为了加快网页的访问速度，我们还可以安装BBR加速。
###### CentOS
继续在服务器里输入
```
wget -N --no-check-certificate https://raw.githubusercontent.com/wn789/serverspeeder/master/serverspeeder.sh
chmod +x serverspeeder.sh
bash serverspeeder.sh
```
如果终端显示
```
This kernel is not supported. Trying fuzzy matching…
Serverspeeder is not supported on this kernel! View all supported systems and kernels here: https://www.91yun.org/serverspeeder91yun
```
需要手动修改内核，或者重新安装系统， 由于我的系统内核不支持，所以要手动修改。
```
uname -r
```
查看内核，锐速支持的 CentOS6 内核版本为 2.6.32-504.3.3.el6.x86_64，下面就要开始修改内核了，准备好内核文件执行安装：

```
rpm -ivh http://xz.wn789.com/CentOSkernel/kernel-firmware-2.6.32-504.3.3.el6.noarch.rpm
rpm -ivh http://xz.wn789.com/CentOSkernel/kernel-2.6.32-504.3.3.el6.x86_64.rpm --force
```
可能要等个几分钟，全部完成之后查看是否安装成功：
```
rpm -qa | grep kernel
```
执行 pm -qa | grep kernel 命令之后可以看到锐速支持的 kernel-2.6.32-504.3.3.el6.x86_64 内核已经安装完成。最后一步，确认内核已经被替换。
重启 VPS，然后查看当前的系统内核
```
[root@Jason ~]# uname -r
2.6.32-504.3.3.el6.x86_64
```
内核已经成功被替换成锐速支持的内核，可以继续第一步的安装工作了。直接输入
```
bash serverspeeder.sh
```
###### Ubuntu
```
wget --no-check-certificate -qO 'BBR.sh' 'https://moeclub.org/attachment/LinuxShell/BBR.sh' && chmod a+x BBR.sh && bash BBR.sh -f
wget --no-check-certificate -qO 'BBR_POWERED.sh' 'https://moeclub.org/attachment/LinuxShell/BBR_POWERED.sh' && chmod a+x BBR_POWERED.sh && bash BBR_POWERED.sh
lsmod |grep 'bbr_powered'
```
显示`bbr_powered`则成功安装。
#### 4.记录系统快照
按完一遍系统也是比较麻烦的所以Vultr提供了系统快照功能，点击`server`，点击`Snapchats`，选择好要截取快照的系统，取名，点击`Take Snapchats`。
![Aua9TP.png](https://s2.ax1x.com/2019/03/19/Aua9TP.png)
截取快照会需要一段时间，视服务器大小而定。
![Auapwt.png](https://s2.ax1x.com/2019/03/19/Auapwt.png)
截取快照成功后，会显示如下的页面。
![AuTuH1.png](https://s2.ax1x.com/2019/03/20/AuTuH1.png)
新建服务器使用快照时，在选择操作系统时，点击`Snapchats`，选择储存好的快照，这里需要注意的是，使用快照的服务器的配置必须要大于等于take系统快照的服务器。比如take快照的系统是\$40美元的套餐，新系统必须是40美元及以上的套餐。
![AuTQN6.png](https://s2.ax1x.com/2019/03/20/AuTQN6.png)
使用快照的系统由于不是最小化安装，会需要较长一段时间来安装系统。这里需要注意的一点是，如果你的vps服务器被GFW给ban掉的话，不要使用快照恢复系统，这样会使新的服务器继续被ban。
#### 5.连接vps科学上网

然后就可以通过各个平台的工具连接vps科学上网了（工具在文末给出），打开油管([www.youtube.com](www.youtube.com) )挑个4k视频试试吧。
![AATaxx.png](https://s2.ax1x.com/2019/03/14/AATaxx.png)
#### 6.平台工具合集
MAC版下载地址：[ShadowsocksX-NG-R8.dmg](https://github.com/gaoshilei/ShadowsocksX-NG/releases/download/1.4.3-R8-build3/ShadowsocksX-NG-R8.dmg)

Android：[ssr](https://github.com/shadowsocksrr/shadowsocksr-android/releases/download/3.5.4/shadowsocksr-android-3.5.4.apk)

Linux：自己sudo apt-get吧

windows：https://github.com/shadowsocksrr/shadowsocksr-csharp/releases/download/4.9.0/ShadowsocksR-win-4.9.0.zip

或者在[这里](https://ssr.tools/175)下载