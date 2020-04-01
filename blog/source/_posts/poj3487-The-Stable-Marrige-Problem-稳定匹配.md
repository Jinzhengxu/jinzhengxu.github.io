---
title: poj3487 The Stable Marrige Problem 稳定匹配
date: 2019-02-25 22:39:15
tags:
- 算法
categories: 程序设计
copyright:
---
[poj3487](http://poj.org/problem?id=3487)


##### <center>The Stable Marriage Problem</center>
<center>
Time Limit: 1000MS		Memory Limit: 65536K
</center>
<center>
Total Submissions: 3526		Accepted: 1517
</center>

##### Description

The stable marriage problem consists of matching members of two different sets according to the member’s preferences for the other set’s members. The input for our problem consists of:

a set M of n males;
a set F of n females;
for each male and female we have a list of all the members of the opposite gender in order of preference (from the most preferable to the least).
A marriage is a one-to-one mapping between males and females. A marriage is called stable, if there is no pair (m, f) such that f ∈ F prefers m ∈ M to her current partner and m prefers f over his current partner. The stable marriage A is called male-optimal if there is no other stable marriage B, where any male matches a female he prefers more than the one assigned in A.

Given preferable lists of males and females, you must find the male-optimal stable marriage.

##### Input

The first line gives you the number of tests. The first line of each test case contains integer n (0 < n < 27). Next line describes n male and n female names. Male name is a lowercase letter, female name is an upper-case letter. Then go n lines, that describe preferable lists for males. Next n lines describe preferable lists for females.

##### Output

For each test case find and print the pairs of the stable marriage, which is male-optimal. The pairs in each test case must be printed in lexicographical order of their male names as shown in sample output. Output an empty line between test cases.

##### Sample Input

2

3

a b c A B C

a:BAC

b:BAC

c:ACB

A:acb

B:bac

C:cab

3

a b c A B C

a:ABC

b:ABC

c:BCA

A:bac

B:acb

C:abc

##### Sample Output

a A

b B

c C

a B

b A

c C

#### Hint
首先定义稳定匹配的概念,所谓稳定匹配的情况是指没有任何一个人的伴侣有出轨的可能，因为别人对自己的伴侣的喜爱程度要更高。

Gale-Shapley算法的过程：男士根据顺序按自己对女士的好感度由高到底进行表白，若当前女士没有男友则表白成功；若当前女士有男友，如果在女士心中表白男士的好感度高于现任男友，则改变男友为表白男士；若好感度低于现任男友则表白失败，继续对下一位女士表白。直到所有栈中男士全都被pop掉。

算法正确性证明：反证法：假设GS算法配对的序列中有不稳定的情侣。即存在至少两对情侣 a-A，b-B中A喜欢b甚于a且b喜欢A甚于B。这种情况是不存在的，按题设情况在GS算法中b一定会先向a表白而且A一定会表白成功，所以不存在不稳定的匹配。

解的唯一性：存在解不唯一的情况，如
```
a：AB
b：BA
A：ba
B：ab
```
此时，有两种稳定的解：
```
a-A，b-B或a-B，b-A
```

#### c++程序代码：
```c++
#include<iostream>
#include <queue>
#include <stdio.h>
#include <algorithm>
#include <stdio.h>
#include <vector>
#include <string>
#include <string.h>
using namespace std;
int main() {
    int t = 0;
    scanf("%d", &t);
    while (t--) {
        int n = 0;
        int oldlove = 0, newlove = 0;
        int nowboy = 0;
        int girlflag[256][4] = {0};
        int nowgirl=0;
        int ans[256][2]={0};
        char tmp;
        char hus, wif;
        queue<int> boy;
        string s;
        vector<vector<int>> list;

        scanf("%d", &n);

        for (int i = 0; i < n; i++) {
            cin >> tmp;
            if ((tmp >= 'a' && tmp <= 'z') || (tmp >= 'A' && tmp <= 'Z'))
                boy.push((int) tmp);
        }//push the boy to stack

        for (int i = 0; i < n; i++) {
            cin >> tmp;
            if ((tmp >= 'a' && tmp <= 'z') || (tmp >= 'A' && tmp <= 'Z'))
                girlflag[tmp][0] = tmp;
        }//this algorithm not depend on girl so just cin

        for (int i = 0; i < 2 * n; i++) {
            vector<int> vec;
            list.push_back(vec);
            cin >> s;
            list[i].push_back((int) s[0]);
            list[i].push_back(2);
            if (s[0] >= 'A' && s[0] <= 'Z')
                girlflag[s[0]][3] = i;
            for (int j = 2; j < s.length(); j++) {
                list[i].push_back((int) s[j]);
            }
        }
        //consider the string could be mix with boy and girl,
        // so the string be locate by the first character
        while (!boy.empty()) {
            nowboy = boy.front();
            //cout << (char) boy.front();
            for (int i = 0; i < n; i++) {
                if (list[i][0] == nowboy) {

                    int j = list[i][1];
                    nowgirl = list[i][j];
                    if (!girlflag[nowgirl][1]) {
                        girlflag[nowgirl][1] = 1;
                        girlflag[nowgirl][2] = nowboy;
                        list[i][1]++;
                        boy.pop();
                        //cout << 1 << endl;
                        break;
                    }

                    if (girlflag[nowgirl][1]) {

                        for (int g = 2; g < 30; g++) {

                            if (nowboy == list[girlflag[nowgirl][3]][g]) {
                                newlove = g;
                                break;
                            }

                        }

                        for (int g = 2; g < 30; g++) {

                            if (girlflag[list[i][j]][2] == list[girlflag[nowgirl][3]][g]) {
                                oldlove = g;
                                break;
                            }
                        }

                        if (oldlove > newlove) {
                            boy.push(girlflag[nowgirl][2]);
                            girlflag[nowgirl][2] = nowboy;
                            boy.pop();
                            //cout << 0 << endl;
                        }
                        list[i][1]++;
                    }

                    break;
                }
            }
        }//when exist boy haven't match with girl continue

        for (int i = 0; i < 256; i++) {
            if (girlflag[i][2]) {
                ans[girlflag[i][2]][0] = (char) girlflag[i][2];
                ans[girlflag[i][2]][1] = (char) girlflag[i][0];
            }
        }
        for (int i = 0; i < 256; i++) {
            if (ans[i][0]) {
                hus = (char) ans[i][0];
                wif = (char) ans[i][1];
                printf("%c %c\n", hus, wif);
            }
        }
        printf("\n");
    }
    return 0;
}

```
#### 伪代码:
```c++
while(!stack.empty())//从栈中弹出男生直到栈空为止
	for(auto a:boylist) //遍历该男生对女生的好感序列
    	if(a.havenoboyfriend) 
        	match(a,nowboy);//如果该女生没有男友则配对成功
            stack.pop();//该男生被弹出栈
        if(a.haveboyfriend) //如果该女生有男友 
        	if(a.morelove(nowboy,oldboy)) //如果该女生更喜欢新男友
            	match(a,nowboy);//配对成功
                stack.push(oldboy)//旧男友被压入栈中
            else//女生更喜欢现任男友
            	continue;//男生根据序列继续向下一个女生表白
```