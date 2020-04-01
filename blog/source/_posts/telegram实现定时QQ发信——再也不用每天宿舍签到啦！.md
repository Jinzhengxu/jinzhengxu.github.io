---
title: telegram实现定时QQ发信——再也不用每天宿舍签到啦！
date: 2019-10-26 19:31:11
tags:
  - telegram
  - ehforwarderbot
  - corntab
  - telegram-cli
  - docker
categoties: 程序设计
top: true
cover: true
img: https://s2.ax1x.com/2019/10/26/KDJkgP.png
copyright: true
---
## 前情提要
作为一个马上要去美帝的留学党，突然强行被指派成了舍长？王德发，舍长也就算了，还要每天10:30在QQ群发布查寝情况？看着一个个没事就出去开房的舍友，emmmmmm，我就这个表情

![KDZfOI.jpg](https://s2.ax1x.com/2019/10/26/KDZfOI.jpg)

不如就写个bot来替我每天发“人齐了”签到吧(๑•̀ㅂ•́)و✧。

## 你需要有
***
+ 海外VPS一台(Debian 9)
+ telegram帐号
+ 一个额外的QQ帐号
+ Windows 用户需要 SSH 客户端

VPS的选择和配置可以参考我的这篇 [Ubuntu18.04下通过Vultr服务搭建vps科学上网](http://jinzhnegxu.online/2019/03/14/Ubuntu18.04下通过Vultr服务搭建vps科学上网/) ，VPS功能多多还能拿来科学上网建议小伙伴们搞一个。

## 实现原理
***
![KDJkgP.png](https://s2.ax1x.com/2019/10/26/KDJkgP.png)

## telegram配置bot
首先在telegram中搜索BotFather，找到以后向[@BotFather](https://t.me/BotFather)发送`/newbot`创建一个新的机器人。然后指定这个 Bot 的名称与用户名（用户名必须以 bot 结尾）。创建成功后BotFather会向你提供一个密钥token，这个密钥是bot 的唯一ID，注意不要泄漏。

![KDa4nx.png](https://s2.ax1x.com/2019/10/26/KDa4nx.png)

接下来对 Bot 进行进一步的配置：允许 Bot 读取非指令信息、允许将 Bot 添加进群组、以及提供指令列表。

发送 /setprivacy 到 @BotFather，选择刚刚创建好的 Bot 用户名，然后选择 "Disable".
发送 /setjoingroups 到 @BotFather，选择刚刚创建好的 Bot 用户名，然后选择 "Enable".
发送 /setcommands 到 @BotFather，选择刚刚创建好的 Bot 用户名，然后发送如下内容：
```
link - 将会话绑定到 Telegram 群组
chat - 生成会话头
recog - 回复语音消息以进行识别
extra - 获取更多功能
```

然后找到机器人[@get_id_bot](https://t.me/get_id_bot)发送`/start`，获得自己帐号的chat_id
## VPS安装docker
### 卸载旧版本
```bash
$ sudo apt-get remove docker docker-engine docker.io containerd runc
$ sudo apt-get update
$ sudo apt-get install \
    apt-transport-https \
    ca-certificates \
    curl \
    gnupg2 \
    software-properties-common
$ curl -fsSL https://download.docker.com/linux/debian/gpg | sudo apt-key add -
$ sudo apt-key fingerprint 0EBFCD88

pub   4096R/0EBFCD88 2017-02-22
      Key fingerprint = 9DC8 5822 9FC7 DD38 854A  E2D8 8D81 803C 0EBF CD88
uid                  Docker Release (CE deb) <docker@docker.com>
sub   4096R/F273FCD8 2017-02-22
```
### 安装新版本
```bash
$ sudo apt-get install docker-ce docker-ce-cli containerd.io
```
选择一个版本：
```bash
$ apt-cache madison docker-ce

  docker-ce | 5:18.09.1~3-0~debian-stretch | https://download.docker.com/linux/debian stretch/stable amd64 Packages
  docker-ce | 5:18.09.0~3-0~debian-stretch | https://download.docker.com/linux/debian stretch/stable amd64 Packages
  docker-ce | 18.06.1~ce~3-0~debian        | https://download.docker.com/linux/debian stretch/stable amd64 Packages
  docker-ce | 18.06.0~ce~3-0~debian        | https://download.docker.com/linux/debian stretch/stable amd64 Packages
  ...
```
假如我选择的是`5:18.09.1~3-0~debian-stretch `那下面的VERSION_STRING就是`5:18.09.1~3-0~debian-stretch `：
```bash
$ sudo apt-get install docker-ce=<VERSION_STRING> docker-ce-cli=<VERSION_STRING> containerd.io
```
检查是否安装成功：
```
$ sudo docker run hello-world
Hello from Docker!
This message shows that your installation appears to be working correctly.
...
```
## VPS部署EFB，CoolQ和telegram-cli
### 安装EFBZ主端,CoolQ从端
ssh登录vps后安装相关依赖：
```bash
$ apt install python3 python3-pip python3-pil python3-setuptools python3-numpy python3-yaml python3-requests ffmpeg libmagic-dev libwebp-dev vim -y
```
安装EFB：
```bash
$ pip3 install ehforwarderbot efb-telegram-master efb-qq-slave
```
### 创建配置文件
#### 创建 EFB 配置文件
```bash
$ mkdir -p ~/.ehforwarderbot/profiles/qq/
$ vim ~/.ehforwarderbot/profiles/qq/config.yaml
```
输入以下内容:
```
master_channel: blueset.telegram
slave_channels:
- milkice.qq
```
#### 创建ETM 配置文件
```bash
$ mkdir -p ~/.ehforwarderbot/profiles/qq/blueset.telegram
$ vim ~/.ehforwarderbot/profiles/qq/blueset.telegram/config.yaml
```
输入以下内容:
```
token: "值为你在 @BotFather 处获得的 bot token"
admins:
- 值为你在 @get_id_bot 处获得的 chat id
```
#### 创建 EQS 配置文件
CoolQ：
```bash
$ docker pull richardchien/cqhttp:latest
$ mkdir coolq
$ docker run -ti --rm --name cqhttp-test --net="host" \
     -v $(pwd)/coolq:/home/user/coolq     `# mount coolq folder` \
     -p 9000:9000                         `# 网页noVNC端口` \
     -p 5700:5700                         `# 酷Q对外提供的API接口的端口` \
     -e VNC_PASSWD=MAX8char               `# 请修改 VNC 密码！！！！` \
     -e COOLQ_PORT=5700                   `# 酷Q对外提供的API接口的端口` \
     -e COOLQ_ACCOUNT=123456              `# 在此输入要登录的QQ号，虽然可选但是建议填入` \
     -e CQHTTP_POST_URL=http://127.0.0.1:8000   `# efb-qq-slave监听的端口/地址 用于接受传入的消息` \
     -e CQHTTP_SERVE_DATA_FILES=yes       `# 允许以HTTP方式访问酷Q数据文件` \
     -e CQHTTP_ACCESS_TOKEN=ac0f790e1fb74ebcaf45da77a6f9de47  `# Access Token` \
     -e CQHTTP_POST_MESSAGE_FORMAT=array  `# 回传消息时使用数组（必选）` \
     richardchien/cqhttp:latest
```
将 docker run 命令中的参数根据注释改为相应数值
```bash
$ mkdir -p ~/.ehforwarderbot/profiles/qq/milkice.qq
$ vim ~/.ehforwarderbot/profiles/qq/milkice.qq/config.yaml
```
输入以下内容:
```
Client: CoolQ # 指定要使用的 QQ 客户端（此处为CoolQ）
CoolQ:
type: HTTP # 指定 efb-qq-slave 与 酷Q 通信的方式 现阶段仅支持HTTP
access_token: ac0f790e1fb74ebcaf45da77a6f9de47
api_root: http://127.0.0.1:5700/ # 酷Q API接口地址/端口
host: 127.0.0.1 # efb-qq-slave 所监听的地址用于接收消息
port: 8000 # 同上
is_pro: true # 若为酷Q Pro则为true，反之为false
air_option: # 包含于 air_option 的配置选项仅当 is_pro 为 false 时才有效
upload_to_smms: true # 将来自 EFB主端(通常是Telegram) 的图片上传到 sm.ms 服务器并以链接的形式发送到 QQ 端
```
## 启动EFB
在浏览器内访问 http://<vps的ip>:9000

请在noVNC终端中输入上述配置选项中的 VNC 密码登录，并使用QQ账户和密码在酷Q中登录QQ账号
```bash
$ ehforwarderbot --profile qq
```
## 将QQ群链接telegram_group
搜寻到刚刚创建的bot，发送`/start`开始服务。

创建一个新的telegram群组，将bot邀请到群组中，然后私聊bot发送`/link`，bot会返回一个列表，在其中选择你想要链接的群组。链接成功后，只要在当前telegram群组中发信就会自动被转发到链接的QQ群中。

邀请机器人[@getidsbot](https://t.me/getidsbot)进群，并记录群组的chat_id。
## VPS上使用crontab和telegram-cli定时发送
### 安装telegram-cli
telegram-cli是一个非官方telegram版本，可以使用命令行操作。

安装依赖：
```bash
$ sudo apt-get install -y git libreadline-dev libconfig-dev libssl-dev lua5.2 liblua5.2-dev libevent-dev libjansson-dev libpython-dev make
$ sudo apt-get install libssl1.0-dev
$ git clone --recursive https://github.com/vysheng/tg.git && cd tg
$ ./configure
$ make
```
### 激活 API
安装好后，我们需要去拿到 telegram 的密钥。访问 telegram 的网站[https://my.telegram.org/apps](https://my.telegram.org/apps).在官网中新建一个app，得到public key。

新建一个文件，然后把 public key 的内容复制进去并保存
```bash
$ vi /root/tg-server.pub
```

### 登录telegram-cli
```bash
$ /root/tg/bin/telegram-cli -k /root/tg-server.pub
```
第一次登录需要从telegram上接受验证码，之后就ky自动登录了

### crontab实现定时发送
修改默认编辑器：
```bash
$ export VISUAL=vim
```
新建crontab任务：
```bash
$ crontab -e
```
输入任务：
```
* 10 * * * /root/tg/bin/telegram-cli -k /root/tg-server.pub -WR -e "msg 群组chat_id 信息内容"
```
其中第五个星号分别是分钟，小时，日，月，星期，这个指令的意思是每天10:00执行命令。
