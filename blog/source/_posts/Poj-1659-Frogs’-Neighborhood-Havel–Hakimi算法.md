---
title: Poj 1659 Frogs’ Neighborhood Havel–Hakimi算法
date: 2019-11-12 09:10:32
tags:
  - Havel–Hakimi算法
  - Poj
  - 图论
categoties: 算法珠玑
copyright:
---
## Poj 1659 Frogs’ Neighborhood

[题目地址](http://poj.org/problem?id=1659)

如果提前了解到Havel–Hakimi算法，这道题就十分简单了。

HH算法是用来解决简单可图化问题，即给定一个有限多的非负整数序列，是否存在一个简单图使得其度序列恰好为该序列。

下面给出一个不可简单图化例子：
```
    原始序列：3 5 4 2 5 2
==> 排序后得：5 5 4 3 2 2
==> 第一递归：0 4 3 2 1 1
==> 第一排序：4 3 2 1 1 0
==> 第二递归：0 2 1 0 0 0
==> 第二排序：2 1 0 0 0 0
==> 第三递归：0 0 -1 0 0 0
```

下面给出一个可以简单图化的例子：
```
    原始序列：3 5 3 5 3 5
==> 排序后得：5 5 5 3 3 3
==> 第一递归：0 4 4 2 2 2
==> 第一排序：4 4 2 2 2 0
==> 第二递归：0 3 1 1 1 0
==> 第二排序：3 1 1 1 0 0
==> 第三递归：0 0 0 0 0 0
```

AC代码：

| Memory | Time |
| ------ | ---- |
| 216k   | 0MS  |

```c++
#include <iostream>
#include <vector>
#include <stdio.h>
#include <algorithm>
using namespace std;

struct Lake{
  int index;
  int Frognum;
};

bool acompare(Lake lhs, Lake rhs) { return lhs.Frognum > rhs.Frognum; }

int main(){
	int T;
	scanf("%d",&T);
	while(T--){
    Lake lake[15];
    int Lakenum;
    int answer[15][15]={0};

	  scanf("%d",&Lakenum);
    for(int i=0;i<Lakenum;i++){
      cin>>lake[i].Frognum;
      lake[i].index=i;
      //cout<<lake[i].index<<" "<<lake[i].Frognum<<endl;
    }

    for(int i=0;i<Lakenum;i++){
      sort(lake,lake+Lakenum,acompare);
      int index=lake[0].Frognum;
      //int jumpout=0;
      //for(int j=0;j<Lakenum;j++) cout<<lake[j].Frognum;
      //cout<<endl;
      lake[0].Frognum=0;
      for(int j=1;j<=index;j++){
        answer[lake[0].index][lake[j].index]=1;
        answer[lake[j].index][lake[0].index]=1;
        lake[j].Frognum-=1;
      }
    }
    int JOJO=1;
    for(int i=0;i<Lakenum;i++){
      if(lake[i].Frognum<0){
          cout<<"NO"<<endl;
          JOJO=0;
          break;
      }
    }
    if(JOJO){
      cout<<"YES"<<endl;
      for(int i=0;i<Lakenum;i++){
        for(int j=0;j<Lakenum;j++)
          cout<<answer[i][j]<<" ";
      cout<<endl;
      }
    }
    cout<<endl;
    }
    return 0;
}
```
