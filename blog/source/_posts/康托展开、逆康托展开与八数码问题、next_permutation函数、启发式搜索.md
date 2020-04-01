---
title: 康托展开、逆康托展开与八数码问题、next_permutation函数、启发式搜索
date: 2018-09-05 12:16:06
tags: 算法
categories: 程序设计
copyright:
---

### 1.康托展开

康托展开其实就是一个简单的公式： ![{\displaystyle X=a_{n}(n-1)!+a_{n-1}(n-2)!+\cdots +a_{1}\cdot 0!}](https://wikimedia.org/api/rest_v1/media/math/render/svg/e9b98a7afd5ee43a1c3649845dac9daa1634e71e) 其中,![a_{i}](https://wikimedia.org/api/rest_v1/media/math/render/svg/0bc77764b2e74e64a63341054fa90f3e07db275f)为整数,并且![{\displaystyle 0\leq a_{i}<i,1\leq i\leq n}](https://wikimedia.org/api/rest_v1/media/math/render/svg/aa719ffadc6a2b1e3c8d6985bc8d34a991fbdb06) 应用这个原理我们可以把一个很大的数转化为一个较小的数来储存，因为康托展开是一个全排列的双射（one-to-one correspondence）所以可以进行康拓展开的逆运算将数字转换回来，也可对已有数字进一步康拓展开获得更小的排列。

#### 1.1举例

例如，3 5 7 4 1 2 9 6 8 展开为 98884。因为X=2\*8!+3\*7!+4\*6!+2\*5!+0\*4!+0\*3!+2\*2!+0\*1!+0\*0!=98884. 解释： 排列的第一位是3，比3小的数有两个，以这样的数开始的排列有8!个，因此第一项为2\*8! 排列的第二位是5，比5小的数有1、2、3、4，由于3已经出现，因此共有3个比5小的数，这样的排列有7!个，因此第二项为3\*7! 以此类推，直至0\*0!

##### 1.1.1 c++实现
```
#include <iostream>
#include <cstdio>
using namespace std;
const char a\[20\]={0};
int  fac\[\] = {1,1,2,6,24,120,720,5040,40320}; //i的阶乘为fac\[i\]
// 康托展开-\> 表示数字a是 a的全排列中从小到大排，排第几
// n表示1~n个数  a数组表示数字。
int Cantor(int n,char *a)
{
    int i,j,t,sum;
    sum=0;
    for( i=0; i<n-1 ;++i)
    {
        t=0;
        for(j=i+1;j<n;++j)
            if( a\[i\]>a\[j\] )
                ++t;
            cout<<t<<" ";
        sum+=t*fac\[n-i-1\];
    }
    return sum+1;
}
int main(){
    char ba\[20\]={0};
    int n;
    int sum=0;
    cin>>n;
    for(int i=0;i<n;i++) cin>>ba\[i\];
    sum=Cantor(n,ba);
    cout<< sum <<endl;
    return 0;
}
```
#### 1.2康托展开的逆运算

既然康托展开是一个双射，那么一定可以通过康托展开值求出原排列，即可以求出n的全排列中第x大排列。 如n=5,x=96时：

首先用96-1得到95，说明x之前有95个排列.(将此数本身减去1)
用95去除4! 得到3余23，说明有3个数比第1位小，所以第一位是4.
用23去除3! 得到3余5，说明有3个数比第2位小，所以是4，但是4已出现过，因此是5.
用5去除2!得到2余1，类似地，这一位是3.
用1去除1!得到1余0，这一位是2.
最后一位只能是1.
所以这个数是45321.

#### 1.2.1 c++实现
```
static const int FAC\[\] = {1, 1, 2, 6, 24, 120, 720, 5040, 40320, 362880};   // 阶乘

//康托展开逆运算
void decantor(int x, int n)
{
    vector<int> v;  // 存放当前可选数
    vector<int> a;  // 所求排列组合
    for(int i=1;i<=n;i++)
        v.push_back(i);
    for(int i=m;i>=1;i--)
    {
        int r = x % FAC\[i-1\];
        int t = x / FAC\[i-1\];
        x = r;
        sort(v.begin(),v.end());// 从小到大排序 
        a.push_back(v\[t\]);      // 剩余数里第t+1个数为当前位
        v.erase(v.begin()+t);   // 移除选做当前位的数
    }
}
```
#### 1.3 next_permutation函数
```
//
// Created by jason on 18-9-5.
//
#include <iostream>
#include <cstdio>
#include <vector>
#include <algorithm>

using namespace std;
int  FAC\[\] = {1,1,2,6,24,120,720,5040,40320};
int main() {
    int n;
    int k;
    cin >> n >> k;
    int num\[n\];

    for (int i = 0; i < n; i++) {
        num\[i\] = i + 1;
    }
    for (int i = 1; i < k; i++) {
        for (int j = 0; j < n; j++) {
            cout << num\[j\];
        }
        cout << endl;
        next_permutation(num, num + n);
    }


    for (int i = 0; i < n; i++) {
        cout << num\[i\];
    }
    return 0;
}
```
太强了STL.

#### 2.八数码问题