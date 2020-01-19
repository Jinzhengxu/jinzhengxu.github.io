---
title: vps服务器使用v2ray科学上网
date: 2019-03-20 16:13:08
tags:
- v2ray
- linux
- debian
categoties: 忒修斯之船
copyright:
---
啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊，服务器又被识别了怎么办！吐血的我准备尝试一下v2ray来科学上网，因为ss，ssr等工具已经长期不再更新，所以掌握一个社区活跃的工具也是很有必要的啊。

### Get started
这次我们使用`Debian 9`发行版，如果你还不知道如何选购服务器并设置，可以参考这篇文章[Ubuntu18.04下通过Vultr服务搭建vps科学上网](http://jinzhnegxu.online/2019/03/14/Ubuntu18-04%E4%B8%8B%E9%80%9A%E8%BF%87Vultr%E6%9C%8D%E5%8A%A1%E6%90%AD%E5%BB%BAvps%E7%A7%91%E5%AD%A6%E4%B8%8A%E7%BD%91/)。

### Debian9 开启 BBR
BBR 是 Google 开源的一个 TCP 拥塞控制算法项目，可以充分发挥服务器的带宽。在有一定丢包率的网络链路上充分利用带宽。降低网络链路上的 buffer 占用率，从而降低延迟。开与不开 BBR，搭建 SSR 和 V2Ray 等代理工具时，最高可以相差近 10 倍！目前该 BBR 算法已经并提交到了 Linux 内核，从 Linux 4.9 开始已经默认安装编译了该算法.

所以采用 Linux 4.9 内核的Debian9系统不用再安装可以通过几行命令开启BBR加速了，爽到。
打开终端输入：
```bash
$ ssh root@yourIPaddress
```
连接至vps服务器，如果显示`WARNING: REMOTE HOST IDENTIFICATION HAS CHANGED!`，可以参考这篇文章[ssh连接报错WARNING: REMOTE HOST IDENTIFICATION HAS CHANGED!](http://jinzhnegxu.online/2019/03/20/ssh%E8%BF%9E%E6%8E%A5%E6%8A%A5%E9%94%99WARNING-REMOTE-HOST-IDENTIFICATION-HAS-CHANGED/)。

连接成功之后我们使用`root`账户来改变系统环境变量：
```bash
root@Jason:~# echo "net.core.default_qdisc=fq" >> /etc/sysctl.conf
root@Jason:~# echo "net.ipv4.tcp_congestion_control=bbr" >> /etc/sysctl.conf
```
然后执行如下命令保存上一步的修改并生效
```bash
root@Jason:~# sysctl -p
```
接着
```bash
root@Jason:~# sysctl net.ipv4.tcp_available_congestion_control
```
如果终端输出
```
net.ipv4.tcp_available_congestion_control = bbr cubic reno
```
则表名开启成功，输入：
```bash
root@Jason:~# lsmod | grep bbr
```
会出现`tcp_bbr +数字` 这样BBR就开启成功了。
### 搭建 V2Ray
打开终端输入
```bash
root@Jason:~# bash <(curl -L -s https://install.direct/go.sh)
```
显示`V2Ray v4.18.0 is installed.`则表示安装成功。同时记下你的端口号`PORT`和`UUID`，这些信息会以蓝色高亮显示。
然后启动v2ray：
```bash
root@Jason:~# sudo systemctl start v2ray
```
如果出现命令没有找到的情况先`apt-get install sudo`安装`sudo`后，再执行这条命令。

v2ray常用命令：
```bash
//启动 V2Ray:
systemctl start v2ray
//停止运行 V2Ray：
systemctl stop v2ray
//重启 V2Ray:
systemctl restart v2ray
```
更换传输协议、端口和 UUID，可以使用[Xftp]打开服务器目录`/etc/v2ray/`中的`config.json`文件。修改保存后，请执行`systemctl restart v2ray`重启 V2Ray 生效。
运行 `v2ray --config=/etc/v2ray/config.json`也可，或使用 systemd 等工具把 V2Ray 作为服务在后台运行。
### 安装v2ray客户端
[第三方客户端合集](http://briteming.hatenablog.com/entry/2017/10/21/124645)
#### Linux安装方法
从[github](https://github.com/v2ray/v2ray-core/releases)获得适合自己pc的release。解压后将自己的`config.conf`文件移动到解压得到的文件夹里，并删除文件夹内的`vpoint_vmess_freedom.json`。然后在该文件目录下打开终端执行
```bash
$ sudo ./v2ray
```
这样就可以了，然后通过`chorme`插件`SwitchOmega`来设置系统代理就可以了。

BBR比锐速好太多了吧！
#### v2ray多用户配置
多用户只需要在服务端的config.json中修改inboundDetour即可，可以使用[https://www.uuidgenerator.net/](https://www.uuidgenerator.net/)来生成UUID，tcp配置例子如下：
```config
{
  "inbound": {
    ...
  },
  "inboundDetour":[
    {
      "port": 你的端口(不同于inbound),
      "protocol": "vmess",
      "settings": {
        "clients": [
          {
            "id": "你的UUID(不同于inbound)",
            "level": 1,
            "alterId": 64
          }
        ]
      },
      "streamSettings":{
        "network": "tcp"
      }
    }
  ],
  "outbound": {
    ...
  },
  "outboundDetour": [
    ...
  ],
  "routing": {
    ...
  }
}
```

#### 推荐阅读
1.[Linux Kernel 4.9 中的 BBR 算法与之前的 TCP 拥塞控制相比有什么优势？](https://www.zhihu.com/question/53559433)

2.[Linux Kernel 4.9中TCP BBR算法的科普解释](https://blog.csdn.net/dog250/article/details/54754784)

3.[ProjectV](https://www.v2ray.com/)
