---
title: 通过qshell下载七牛云对象储存
date: 2019-02-12 06:47:42
tags:
- 图床
- 七牛云
categories: 软件工具
copyright: true
---
前几天七牛云的绑定随机域名到期了，博客中的图片链接全部失效了。然而Github的泛子域名由于众所周知的原因无法在公信部备案，本想换个图床，但是七牛云的对象存储不能直接下载。在官网发现了qshell的教程。
#### 下载与安装
由于qshell是由go编写的，七牛云已经在官网提供了编译好的[二进制文件](https://developer.qiniu.com/kodo/tools/1302/qshell),下载文件包并从中选择适合自己操作系统的文件。将选择好的文件重命名为`qshell`，因为只是用于下载图片就不必要将qshell加入环境变量中了。在qshell的目录打开终端，输入
```bash
$ ./qshell
```
如果输出qshell使用指南就表示可以使用了
```
Qiniu commandline tool for managing your bucket and CDN

Usage:
  qshell [command]

Available Commands:
  account       Get/Set AccessKey and SecretKey
  alilistbucket List all the file in the bucket of aliyun oss by prefix
  b64decode     Base64 Decode, default nor url safe
  b64encode     Base64 Encode, default not url safe
  batchchgm     Batch change the mime type of files in bucket
  batchchtype   Batch change the file type of files in bucket
  batchcopy     Batch copy files from bucket to bucket
  batchdelete   Batch delete files in bucket
  batchexpire   Batch set the deleteAfterDays of the files in bucket
  batchfetch    Batch fetch remoteUrls and save them in qiniu Bucket
  batchmove     Batch move files from bucket to bucket
  batchrename   Batch rename files in the bucket
  batchsign     Batch create the private url from the public url list file
  batchstat     Batch stat files in bucket
  buckets       Get all buckets of the account
  cdnprefetch   Batch prefetch the urls in the url list file
  cdnrefresh    Batch refresh the cdn cache by the url list file
  chgm          Change the mime type of a file
  chtype        Change the file type of a file
  completion    generate autocompletion script for bash
  copy          Make a copy of a file and save in bucket
  d2ts          Create a timestamp in seconds using seconds to now
  delete        Delete a remote file in the bucket
  dircache      Cache the directory structure of a file path
  domains       Get all domains of the bucket
  expire        Set the deleteAfterDays of a file
  fetch         Fetch a remote resource by url and save in bucket
  fput          Form upload a local file
  get           Download a single file from bucket
  help          Help about any command
  ip            Query the ip information
  listbucket    List all the files in the bucket
  listbucket2   List all the files in the bucket using v2/list interface
  m3u8delete    Delete m3u8 playlist and the slices it references
  m3u8replace   Replace m3u8 domain in the playlist
  mirrorupdate  Fetch and update the file in bucket using mirror storage
  move          Move/Rename a file and save in bucket
  pfop          issue a request to process file in bucket
  prefop        Query the pfop status
  privateurl    Create private resource access url
  qdownload     Batch download files from the qiniu bucket
  qetag         Calculate the hash of local file using the algorithm of qiniu qetag
  qupload       Batch upload files to the qiniu bucket
  qupload2      Batch upload files to the qiniu bucket
  reqid         Decode qiniu reqid
  rpcdecode     rpcdecode of qiniu
  rpcencode     rpcencode of qiniu
  rput          Resumable upload a local file
  saveas        Create a resource access url with fop and saveas
  stat          Get the basic info of a remote file
  sync          Sync big file to qiniu bucket
  tms2d         Convert timestamp in milliseconds to a date (TZ: Local)
  tns2d         Convert timestamp in Nanoseconds to a date (TZ: Local)
  token         Token related command
  ts2d          Convert timestamp in seconds to a date (TZ: Local)
  unzip         Unzip the archive file created by the qiniu mkzip API
  urldecode     Url Decode
  urlencode     Url Encode
  user          Manage users
  version       show version

Flags:
  -C, --config string   config file (default is $HOME/.qshell.json)
  -d, --debug           debug mode
  -h, --help            help for qshell
  -L, --local           use current directory as config file path
  -v, --version         show version

Use "qshell [command] --help" for more information about a command.

```
如果出现``Pressmission Denied``，则使用`chmod`命令赋予qshell文件权限即可。 
#### 新建对象存储
重新选择一个新的对象储存，注意新建对象储存的地理位置要和原对象储存保持一致。
#### 下载图片
首先在qshell中使用`account`命令配置七牛云账户的`AccessKey`和`SecretKey`。
```bash
$ qshell account ak sk name
```
其中name表示该账号的名称, 如果ak, sk, name首字母是"-", 需要使用如下的方式添加账号, 这样避免把该项识别成命令行选项:
```bash
$ qshell account -- ak sk name
```
然后使用`batchcopy`命令，获取原对象储存的完整文件列表：
```bash
$ qshell listbucket bucketname -o list.txt
```
其中bucketname是原存储空间名称,将刚刚获取到的list.txt复制到excel里，保留第一列到新的文件`name.txt`

批量复制文件至新对象储存：
```bash
//  qshell batchcopy -y <SrcBucket> <DestBucket> [-i <SrcDestKeyMapFile>] [flags]
$ ./qshell batchcopy -y blogimage qudai -i name.txt
```
其中加入`-y`选项不需要输入验证码，<SrcBucket> 原存储空间名称，<DestBucket> 新建存储空间名称，<SrcDestKeyMapFile> 需要复制的文件列表，即上述得到的name.txt

批量下载，使用`qdownload`命令确认复制是否成功
```bash
// [<ThreadCount>]: 同时下载文件数量（1-2000），默认为5
// <LocalDownloadConfig>: 配置文件，如tmp.conf
// qshell qdownload [<ThreadCount>] <LocalDownloadConfig> [flags]
$ ./qshell qdownload tem.conf
```
在qshell所在的文件目录新建配置文件，以`.conf`为后缀，内容：
```json
/*
dest_dir 下载文件存储目录。wins下目录示例 D:\\jemy\\backup，尽量不要出现中文，否则涉及编码问题
bucket 新建存储空间的名称
suffixes 下载文件的后缀
cdn_domain 新建存储空间的CDN测试域名，可在新存储空间页面查看
*/
{
    "dest_dir"   :   "<LocalBackupDir>",
    "bucket"     :   "<Bucket>",
    "suffixes"   :   ".png,.jpg",
    "cdn_domain" :   "down.example.com"
}
```
然后在指定目录就会生成一个新的目录存放文件，等待下载完成即可。
#### 免费图床推荐
[路过图床](https://imgchr.com/)

[500px](https://web.500px.com/)

