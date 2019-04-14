---
title: LaTeX使用指南
date: 2019-02-28 13:53:37
tags:
- LaTex
categoties: 拉普拉斯妖
copyright:
notshow:
---
LaTeX使用实在是太nice了，我真是high到不行，高德纳男神nb！

当然$\LaTeX$也有一定的缺点,比如`“LATEX does not work well for people who have sold their souls . . . ”`:-)

这里我们先给出LaTex的书写规范，语法格式，最后会给出一份符号表以供参考。还有LaTex的标准写法应该是$\LaTeX{}$,而标准读音应该是 “Lay-tech” 或 “Lah-tech”,即"拉泰赫"。如果因技术限制而做不到，则应该写成“LaTeX”。

### 如何开启 $\LaTeX$
MathJax是一款运行在浏览器中的开源的数学符号渲染引擎，使用MathJax可以方便的在浏览器中显示数学公式，不需要使用图片。这篇文章介绍如何使用LaTeX语法编写数学公式。在NexT主题中有MathJax的默认选项将其值改为`true`就可以对md文件中的公式进行渲染了。
##### 特殊字符
下面的这些字符是 $\LaTeX$ 的保留字符，它们或在  $\LaTeX$ 中有特定的用处，类似于标识符。如果你直接在文本中使用它们，会导致  $\LaTeX$ 做一些并非你所构想的事情。
` $ % ^ & _ { } ~ \`
当然，这些字符前面加上反斜线，就可以在文本中得到它们。
`\# \$ \% \^{} \& \_ \{ \} \~{} #`
##### $\LaTeX$命令
 $\LaTeX$命令有两种格式:
 + 以一反斜线 \ 开始，加上只包含字母字符命令名组成。命令名后的空格符、数字或其它非字母字符标志该命令的结束。
 + 由一反斜线和一特殊字符组成。

##### 注释
当 $\LaTeX$ 在处理源文件时，如果遇到一个百分号字符 %，那么 $\LaTeX$将忽略 % 后的该行文本，分行符以及下一行开始的空白字符。这样，我们就可以在源文件中写一些注释。

##### 源文件的结构
$\LaTeX$ 需要所处理的源文件遵从一定的结构，每个 LATEX 文档必须以如下的命令开始：
```
\documentclass{...}
```
这个命令指定了你所写的文档的类别。在此之后，你可以加入控制文档式样的命令，或者使用如下的命令来调入一些宏集，进而为 LATEX 系统增添一些新的功能。
```
\usepackage{...}
```
当完成所有的设置5后，你可利用如下的命令来开始你的文档：
```
\begin{document}
```
现在你可以输入你所希望排版的文本和所使用的一些 LATEX 命令。在文档的最后键入下面的命令来告诉 LATEX 你的文档到此结束，从而使 LATEX忽略文档在此命令之后的部分。
```
\end{document}
```
##### 文档类
```
\documentclass[11pt,twoside,a4paper]{article}
```
这条命令指定 LATEX 使用论文版式，11 磅大小的字体来排班此文档，并且得到适合打印在 A4 纸上的输出结果。

|文档类|功能|
|:---:|:---:|
|article |排版科技期刊、短报告、程序文档、邀请函等。|
|report |排版多章节的长报告、短篇的书籍、博士论文等。|
|book |排版书籍。|
|slides |排版幻灯片。其中使用了较大的 sans serif 字体。也可以考虑使用 FoilTEX 来得到相同的效果。|

|文档类选项|功能|
|:---:|:---:|
|10pt, 11pt, 12pt |设置文档所使用的字体的大小。如果没有声明任何选项，缺省将使用 10pt 字体。|
|a4paper, letterpaper, . . . |定义纸张的大小，缺省的设置为letterpaper。此外，还可以使用a5paper，b5paper，executivepaper 和 legalpaper。|
|fleqn |设置该选项将使数学公式左对齐，而不是中间对齐。|
|leqno |设置该选项将使数学公式的编号防置于左侧。|
|titlepage, notitlepage |指定是否在文档标题（document title）后开始一新页。article 文档类缺省不开始新页，而 book 文档类则相反。|
|onecolumn, twocolumn |指定 LATEX 以单列（one column）或双列（two column）方式排版文档。|
|twoside, oneside| 指定 LATEX 排版的文档为双面或单面格式。article 和 report 缺省使用单面格式，而 book 则缺省使用双面格式。需要注意的是该选项仅作用于文档的式样。twoside选项不会通知你的打印机让以得到双面的打印输出。|
|openright, openany |此选项决定新的章是仅仅在右边页（奇数页）还是在下一可用页开始。该选项对 article 文档类不起作用，因为该类中并没有定义“章”（Chapter）。report 类中新的一章开始于下一可用页，而 book 类中新的一章总是开始于右边页。|
### *数学公式
#### 基本知识
LATEX 使用一种特殊的模式来排版数学符号和公式（mathematics）。段落中的数学表达式应该置于 ( 和 )， \$ 和 \$ 或者 \begin{math} 和\end{math} 之间。

对于较大的数学式子，最好的方法是使用显示式样来排版：将它们放置于 [ 和 ] 或 \begin{displaymath} 和 \end{displaymath} 之间。这样排版出的公式是没有编号的。如果你希望 LATEX 对其添加编号的话，可以使用 equation 环境来达到这一目的。
```
Add $a$ squared and $b$ squared
to get $c$ squared. Or, using
a more mathematical approach:
\begin{displaymath}
c^{2}=a^{2}+b^{2}
\end{displaymath}
And just one more line.
```
Add $a$ squared and $b$ squared
to get $c$ squared. Or, using
a more mathematical approach:
$$c^{2}=a^{2}+b^{2}$$
And just one more line.
#### 数学符号表
表 3.1: 数学模式重音符:

|  $\hat{a}$  |  \hat{a}  | $\check{a}$ | \check{a} | $\tilde{a}$   | \tilde{a}   | $\acute{a}$      | \acute{a}     |
|:-----------:|:---------:|:-----------:|:---------:| ------------- | ----------- | ---------------- | ------------- |
| $\grave{a}$ | \grave{a} |  $\dot{a}$  |  \dot{a}  | $\ddot{a}$    | \ddot{a}    | $\breve{a}$      | \breve{a}     |
| $\bar{a}$  |  \bar{a}  | $\vec{a}$  |  \vec{a}  | $\widehat{A}$ | \widehat{A} | $\widetilde{A}$ | \widetilde{A} |
表 3.2: 小写希腊字母

|   $\alpha$    |   \alpha    | $\theta$    | \theta    | $o$          | o         | $\upsilon$ | \upsilon |
|:-------------:|:-----------:| :-----------: | :---------: | :------------: | :---------: | :----------: | :--------: |
|    $\beta$    |    \beta    | $\vartheta$ | \vartheta | $\pi$        | \pi       | $\phi$     | \phi     |
|   $\gamma$   |  \gamma  | $\iota$     | \iota     | $\varpi$     | \varpi    | $\varphi$  | \varphi  |
|   $\delta$    |   \delta    | $\kappa$    | \kappa    | $\rho$      | \rho      | $\chi$    | \chi     |
|  $\epsilon$   |  \epsilon   | $\lambda$  | \lambda   | $\varrho$    | \varrho   | $\psi$     | \psi     |
| $\varepsilon$ | \varepsilon | $\mu$     | \mu       | $\sigma$     | \sigma    | $\omega$  | \omega   |
|    $\zeta$    |    \zeta    | $\nu$       | \nu       | $\varsigma$ | \varsigma |            |          |
|    $\eta$     |    \eta     | $\xi$       | \xi       | $\tau$       | \tau      |            |          |

 表 3.3: 大写希腊字母:

| $\Gamma$ | \Gamma | $\Lambda$ | \Lambda | $\Sigma$   | \Sigma   | $\Psi$   | \Psi   |
| :---:    | :---:  | :---:          | :---:   | :---:      |  :---:        | :---:     | :---:  |
| $\Delta$ | \Delta | $\Xi$     | \Xi     | $\Upsilon$ | \Upsilon | $\Omega$ | \Omega |
| $\Theta$ | \Theta | $\Pi$     | \Pi     | $\Phi$     | \Phi     |           |        |


 <center>**数学符号表**</center>

{% pdf https://drive.google.com/file/d/19qn_TktFfkmDWGz6qq3c1cDhSE5-Meew/preview %}
#### 基本公式
LaTeX的数学公式有两种：行内公式和块级公式。行内公式放在文中与其它文字混编，块级公式单独成行。都使用美元符号进行标记显示。
###### 行内公式
标记方法：使用一个美元符号包围起来
###### 块级公式
标记方法：使用两个美元符号包围起来
###### 上标和下标
^表示上标，\_表示下标。如果上下标的内容多于一个字符，要用{}把这些内容括起来当成一个整体。上下标是可以嵌套的，也可以同时使用。
```
$x^{y^z}=(1+e^x)^{-2xy^w}$
```
$x^{y^z}=(1+e^x)^{-2xy^w}$
另外，如果要在左右两边都有上下标，可以用\sideset命令。
```
$\sideset{^1_2}{^3_4}\bigotimes$
```
效果：$\sideset{^1_2}{^3_4}\bigotimes$
##### 分数表示
```
方法1：\frac{分子}{分母}
方法2：分子 \over 分母
```
##### 各种括号
()、[]和|可以直接表示自己，而{}本来用于分组，因此需要用\{\}来表示自身，也可以使用\lbrace 和\rbrace来表示。
##### 根号表示
```
\sqrt[开方次数，默认为2]{开方因子}
$\sqrt{x^3}$　和　$\sqrt[3]{\frac xy}$
```
$\sqrt{x^3}$　和　$\sqrt[3]{\frac xy}$
##### 省略号
数学公式中常见的省略号有两种，\ldots表示与文本底线对齐的省略号，\cdots表示与文本中线对齐的省略号。
```
$f(x_1,x_2,\ldots,x_n) = x_1^2 + x_2^2 + \cdots + x_n^2$
```
$f(x_1,x_2,\ldots,x_n) = x_1^2 + x_2^2 + \cdots + x_n^2$
##### 矢量表示
```
\vec{矢量值}
$\vec{a} \cdot \vec{b}=0$
```
$\vec{a} \cdot \vec{b}=0$

##### 特殊字符
###### 关系运算符
|    $\pm$     | \pm        | $\times$    | \times    | $\div$     | \div     |
|:------------:| ---------- | ----------- | --------- | ---------- | -------- |
|    $\mid$    | \mid       | $\nmid$     | \nmid     | $\cdot$    | \cdot    |
|   $\circ$    | \circ      | $\ast$      | \ast      | $\bigodot$ | \bigodot |
| $\bigotimes$ | \bigotimes | $\bigoplus$ | \bigoplus | $\leq$     | \leq     |
|    $\geq$    | \geq       | $\equiv$    | \equiv    | $\sum$     | \sum     |
|   $\prod$    | \prod      | $\coprod$   | \coprod   |            |          |

###### 集合运算符

| $\emptyset$ | \emptyset | $\in$      | \in       | $\notin$    | \notin    |
|:------------:| --------- | ----------- | --------- | ----------- | --------- |
|  $\subset$   | \subset   | $\supset$   | \supset   | $\subseteq$ | \subseteq |
| $\supseteq$  | \supseteq | $\bigcap$   | \bigcap   | $\bigcup$   | \bigcup   |
|  $\bigvee$   | \bigvee   | $\bigwedge$ | \bigwedge | $\biguplus$ | \biguplus |
| $\bigsqcup$  | \bigsqcup |             |           |             |           |

###### 对数运算符
| $\log$ | \log | $\lg$ | \lg | $\ln$ | \ln |
|:------:| ---- | ----- | --- | ----- | --- |


###### 三角运算符
| $\bot$ | \bot | $\angle$ | \angle | $\circ$ | \circ |
|:------:| ---- | -------- | ------ | ------- | ----- |
| $\sin$ | \sin | $\cos$   | \cos   | $\tan$  | \tan  |
| $\cot$ | \cot | $\sec$   | \sec   | $\csc$  | \csc  |

###### 微积分运算符
| $\prime$ | \prime | $\int$    | \int    | $\iint$  | \iint  |
|:--------:| ------ | --------- | ------- | -------- | ------ |
| $\iiint$ | \iiint | $\iiiint$ | \iiiint | $\oint$  | \oint  |
|  $\lim$  | \lim   | $\infty$  | \infty  | $\nabla$ | \nabla |

###### 逻辑运算符
|  $\because$   | \because    | $\therefore$ | \therefore | $\forall$ | \forall |
|:-------------:| ----------- | ------------ | ---------- | ---------- | ------- |
|   $exists$    | \exists     | $\not=$      | \not=      | $\not>$    | \not>   |
| $\not\subset$ | \not\subset |              |            |            |         |

###### 戴帽符号
| $\hat{y}$ | \hat{y} | $\check{y}$ | \check{y} | $\breve{y}$ | \breve{y} |
|:----------:| ------- | ----------- | --------- | ----------- | --------- |

###### 连线符号
|              $\overline{a+b+c+d}$              | \overline{a+b+c+d}                           |
|:----------------------------------------------:| -------------------------------------------- |
|             $\underline{a+b+c+d}$              | \underline{a+b+c+d}                          |
| $\overbrace{a+\underbrace{b+c}_{1.0}+d}^{2.0}$ | \overbrace{a+\underbrace{b+c}_{1.0}+d}^{2.0} |

###### 箭头符号
|    $\uparrow$     |    \uparrow     |   $\downarrow$   | \downarrow     |
|:-----------------:|:---------------:|:----------------:| -------------- |
|    $\Uparrow$     |    \Uparrow     |   $\Downarrow$   | \Downarrow     |
|   $\rightarrow$   |   \rightarrow   |   $\leftarrow$   | \leftarrow     |
|   $\Rightarrow$   |   \Rightarrow   |   $\Leftarrow$   | \Leftarrow     |
| $\longrightarrow$ | \longrightarrow | $\longleftarrow$ | \longleftarrow |
| $\Longrightarrow$ | \Longrightarrow | $\Longleftarrow$ | \Longleftarrow |


### 参考资料
1.[中国$C\TeX$协会关于$\LaTeX2_\epsilon$的文档](http://117.128.6.12/cache/www.mohu.org/info/lshort-cn.pdf?ich_args2=472-05141922037508_ebb4f2e409c6ab413a287e44d4962b2a_10001002_9c89612dd0c5f7d6903a518939a83798_f48d5199abd7921134efa7ce01554962)

2.[markdown语法之如何使用LaTeX语法编写数学公式](https://blog.csdn.net/lanxuezaipiao/article/details/44341645)
