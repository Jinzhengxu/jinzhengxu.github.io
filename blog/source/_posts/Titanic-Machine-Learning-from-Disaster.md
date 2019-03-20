---
title: 'Titanic: Machine Learning from Disaster'
date: 2019-03-03 22:58:52
tags:
- 机器学习
- Kaggle
categoties: 拉普拉斯妖
copyright:
---
### 初识Kaggle
[Kaggle](https://www.kaggle.com/) 是一个流行的数据科学竞赛平台。由 Goldbloom 和 Ben Hamner 创建于 2010 年。在这里可以打比赛。
### Get start
[Titanic: Machine Learning from Disaster](https://www.kaggle.com/c/titanic/leaderboard)

第一道题目的背景是泰坦尼克号沉没的背景，目的是让我们预测谁会活下来。
##### 数据下载
首先就是数据的下载，下载[titanic.zip]()。
##### 分析过程
首先解压我们得到的数据，数据中有两个文件`train.csv`和`test.csv`，很明显一个是训练集一个是测试数据。利用手头的数据分析,利用`pandas`数据分析模块和`numpy`科学计算模块来分析数据。首先读入我们的数据：
```python
import pandas as pd
import numpy as np
from pandas import Series,DataFrame

data_train=pd.read_csv('/home/jason/Documents/ML/titanic/train.csv',engine = 'python',encoding='UTF-8')
data_train #dataframe格式
```
这里就可以看到train.csv中的数据了。但是只有数据表我们很难从中找出规律。所以接下来通过方法`data_train.info()`和`data_train.describe()`来大体查看一下数据集的全貌。

```python
>>> data_train.info()
```
输出：
```
<class 'pandas.core.frame.DataFrame'>
RangeIndex: 891 entries, 0 to 890
Data columns (total 12 columns):
PassengerId    891 non-null int64
//乘客ID
Survived       891 non-null int64
//是否获救
Pclass         891 non-null int64
//乘客等级
Name           891 non-null object
//乘客姓名
Sex            891 non-null object
//乘客性别
Age            714 non-null float64
//乘客年龄
SibSp          891 non-null int64
//乘客堂兄弟个数
Parch          891 non-null int64
//乘客父母孩子个数
Ticket         891 non-null object
//船票
Fare           891 non-null float64
//票价
Cabin          204 non-null object
//客舱
Embarked       889 non-null object
//登船港口
dtypes: float64(2), int64(5), object(5)
memory usage: 83.6+ KB
```
从这里可以看出训练集中一共有891条记录，每一条记录有12个属性，每种属性都有不一样的特点，比如`Cabin`舱位属性只有204条记录有值，`Age`只有714条记录中有值，同时我们还知道了每条属性的类型。
```python
>>> data_train.describe()
```
输出：
```
       PassengerId    Survived      Pclass         Age       SibSp       Parch        Fare
count   891.000000  891.000000  891.000000  714.000000  891.000000  891.000000  891.000000
mean    446.000000    0.383838    2.308642   29.699118    0.523008    0.381594   32.204208
std     257.353842    0.486592    0.836071   14.526497    1.102743    0.806057   49.693429
min       1.000000    0.000000    1.000000    0.420000    0.000000    0.000000    0.000000
25%     223.500000    0.000000    2.000000   20.125000    0.000000    0.000000    7.910400
50%     446.000000    0.000000    3.000000   28.000000    0.000000    0.000000   14.454200
75%     668.500000    1.000000    3.000000   38.000000    1.000000    0.000000   31.000000
max     891.000000    1.000000    3.000000   80.000000    8.000000    6.000000  512.329200
```
从输出中我们得知了`mean`均值,`std`标准差,`min`最小值,`25%`,`50%`,`75%`,`max`最大值这些关键信息。

我们首先提出一个假设“乘客是否获救与乘客的身份地位有关”，不难想象，在当时的情况下，一些地位比较高的人更容易获得帮助，但是否真的如此呢，我们还是要从训练集中找出答案。为了使数据间的关系更加明细，我们使用图表的方式来描述数据的内在联系。
```python
import matplotlib.pyplot as plt
fig = plt.figure()
fig.set(alpha=0.2) #设定图表颜色颜色

plt.subplot2grid((2,3),(0,0)) #分出小图
data_train.Survived.value_counts().plot(kind='bar') #柱状图
plt.title(u"Surivied(=1)") #标题
plt.ylabel(u"number")

plt.subplot2grid((2,3),(0,1))
data_train.Pclass.value_counts().plot(kind="bar")
plt.ylabel(u"number") #人数
plt.title(u"the Pclass")

plt.subplot2grid((2,3),(0,2))
plt.scatter(data_train.Survived, data_train.Age)
plt.ylabel(u"Age") #设定纵坐标名称
plt.grid(b=True, which='major', axis='y')
plt.title(u"Survived by age(=1)")

plt.subplot2grid((2,3),(1,0),colspan=2)
data_train.Age[data_train.Pclass == 1].plot(kind='kde')   
data_train.Age[data_train.Pclass == 2].plot(kind='kde')
data_train.Age[data_train.Pclass == 3].plot(kind='kde')
plt.xlabel(u"Age")# plots an axis lable
plt.ylabel(u"Density") #密度
plt.title(u"The age of each pclass")
plt.legend((u'level1', u'level2',u'level3'),loc='best') # sets our legend for our graph.


plt.subplot2grid((2,3),(1,2))
data_train.Embarked.value_counts().plot(kind='bar')
plt.title(u"the number of each embarked")
plt.ylabel(u"number")  
plt.show()
fig = plt.figure()
fig.set(alpha=0.2)  # 设定图表颜色alpha参数
```
![AAkvYn.png](https://s2.ax1x.com/2019/03/14/AAkvYn.png)

获得一张分布图，从表中我们可以看出，三个等级的年龄分布略有不同，头等舱获救人数最多，年龄分布大差不差。但是我们可以提出自己的一些猜想：
+ 是否获救和地位高低有关
+ 是否获救和年龄有关
+ 是否获救和登船港口无关

当然这些目前还只是猜想，我们并不知道其是否正确，下面继续从数据中验证我们的猜想。

##### 属性与获救结果的关联统计
第一个猜想是和地位高低有关，而头等舱明显是区分地位的一个方面（迫真），看一下各乘客等级的获救情况
```python
fig = plt.figure()
fig.set(alpha=0.2)  # 设定图表颜色alpha参数

Survived_0 = data_train.Pclass[data_train.Survived == 0].value_counts()
Survived_1 = data_train.Pclass[data_train.Survived == 1].value_counts()
df=pd.DataFrame({u'Unsurvived':Survived_0,u'Survived':Survived_1})
df.plot(kind='bar', stacked=True)
plt.title(u"each Pclass survived")
plt.xlabel(u"Pcalss") 
plt.ylabel(u"number") 
plt.show()
```
![AAHZ3n.png](https://s2.ax1x.com/2019/03/14/AAHZ3n.png)
明显等级为1的乘客，获救的概率比其他等级高很多。恩，这个一定是影响最后获救结果的一个*特征*。

看过电影的同学应该都知道当时船长有喊让妇女儿童先上救生船，所以性别和年龄也要可能是一个重要因素。先看看各性别的获救情况
```python
fig = plt.figure()
fig.set(alpha=0.2)  # 设定图表颜色alpha参数

Survived_m = data_train.Survived[data_train.Sex == 'male'].value_counts()
Survived_f = data_train.Survived[data_train.Sex == 'female'].value_counts()
df=pd.DataFrame({u'MAN':Survived_m, u'FEMALE':Survived_f})
df.plot(kind='bar', stacked=True)
plt.title(u"the survived by sex")
plt.xlabel(u"Sex") 
plt.ylabel(u"number")
plt.show()
```
![AAHJ3R.png](https://s2.ax1x.com/2019/03/14/AAHJ3R.png)
最后获救的人中女性占大多数，这也一定是一个*特征*。
进一步思考上流社会的男性女性的生存比例是否会更大呢？
同时分析舱别和性别：
```python
#然后我们再来看看各种舱级别情况下各性别的获救情况
fig=plt.figure()
fig.set(alpha=0.65) # 设置图像透明度，无所谓
plt.title(u"the survived by Sex&Pclass")

ax1=fig.add_subplot(141)
data_train.Survived[data_train.Sex == 'female'][data_train.Pclass != 3].value_counts().sort_index().plot(kind='bar', label="female highclass", color='#FA2479')
ax1.set_xticks([0,1])
ax1.set_xticklabels([u"Unsurvived", u"Survived"], rotation=0)
ax1.legend([u"FEMALE/RICH"], loc='best')

ax2=fig.add_subplot(142, sharey=ax1)
data_train.Survived[data_train.Sex == 'female'][data_train.Pclass == 3].value_counts().sort_index().plot(kind='bar', label='female, low class', color='pink')
ax2.set_xticklabels([u"Unsurvived", u"Survived"], rotation=0)
plt.legend([u"FEMALE/POOR"], loc='best')

ax3=fig.add_subplot(143, sharey=ax1)
data_train.Survived[data_train.Sex == 'male'][data_train.Pclass != 3].value_counts().sort_index().plot(kind='bar', label='male, high class',color='lightblue')
ax3.set_xticklabels([u"Unsurvived", u"Survived"], rotation=0)
plt.legend([u"MAN/RICH"], loc='best')

ax4=fig.add_subplot(144, sharey=ax1)
data_train.Survived[data_train.Sex == 'male'][data_train.Pclass == 3].value_counts().sort_index().plot(kind='bar', label='male low class', color='steelblue')
ax4.set_xticklabels([u"Unsurvived", u"Survived"], rotation=0)
plt.legend([u"MAN/POOR"], loc='best')
#RICH/POOR只是为了好写，不排除有体验生活的富人在3等舱
plt.show()
```
![AAb92R.png](https://s2.ax1x.com/2019/03/14/AAb92R.png)
然后我们看看各登船港口的获救情况
```python
fig = plt.figure()
fig.set(alpha=0.2)  # 设定图表颜色alpha参数

Survived_0 = data_train.Embarked[data_train.Survived == 0].value_counts()
Survived_1 = data_train.Embarked[data_train.Survived == 1].value_counts()
df=pd.DataFrame({u'Unsurvived':Survived_0,u'Survived':Survived_1})
df.plot(kind='bar', stacked=True)
plt.title(u"the Survived by Embarked")
plt.xlabel(u"Embarked") 
plt.ylabel(u"number") 

plt.show()
```
![AESmi6.png](https://s2.ax1x.com/2019/03/14/AESmi6.png)
看看有没有堂兄弟/妹，孩子/父母，是否对获救有影响
```python
gg = data_train.groupby(['SibSp','Survived'])
df = pd.DataFrame(gg.count()['PassengerId'])
print(df)

gp = data_train.groupby(['Parch','Survived'])
df = pd.DataFrame(gp.count()['PassengerId'])
print(df)
```
终端会输出
```
                PassengerId
SibSp Survived             
0     0                 398
      1                 210
1     0                  97
      1                 112
2     0                  15
      1                  13
3     0                  12
      1                   4
4     0                  15
      1                   3
5     0                   5
8     0                   7
                PassengerId
Parch Survived             
0     0                 445
      1                 233
1     0                  53
      1                  65
2     0                  40
      1                  40
3     0                   2
      1                   3
4     0                   4
5     0                   4
      1                   1
6     0                   1

```
并没有很明显的规律，但也不能放弃这个特征，可以以后再考虑
最后来分析`tickets cabin`，ticket是船票编号，应该是unique的，和最后的结果没有太大的关系，先不纳入考虑的特征范畴
cabin只有204个乘客有值，我们先看看它的一个分布
```python
data_train.Cabin.value_counts()
```
output：
```
B96 B98        4
C23 C25 C27    4
G6             4
F2             3
E101           3
D              3
C22 C26        3
F33            3
B18            2
D36            2
C65            2
D26            2
D17            2
C92            2
F G73          2
E24            2
E33            2
C93            2
C68            2
E121           2
C123           2
B22            2
B49            2
B20            2
B5             2
B28            2
E25            2
B77            2
D35            2
C78            2
              ..
E36            1
C45            1
C90            1
C62 C64        1
A26            1
D9             1
D19            1
D46            1
A5             1
E38            1
C46            1
B82 B84        1
B102           1
C110           1
E34            1
T              1
B101           1
D48            1
A36            1
B37            1
E17            1
B42            1
A6             1
E46            1
B39            1
C30            1
D15            1
C86            1
E12            1
B3             1
Name: Cabin, Length: 147, dtype: int64
```

数据离散的程度很高，而且并不是每个乘客都有该属性记录缺失值多，不集中。如果直接按照类目特征处理的话，估计每个因子化后的特征都拿不到什么权重。加上有那么多缺失值，所以考虑先把Cabin缺失与否作为条件(虽然这部分信息缺失可能并非未登记，只是丢失了而已，所以这样做未必妥当)，先在有无Cabin信息这个粗粒度上看看Survived的情况好了。
```python
fig = plt.figure()
fig.set(alpha=0.2)  # 设定图表颜色alpha参数

Survived_cabin = data_train.Survived[pd.notnull(data_train.Cabin)].value_counts()
Survived_nocabin = data_train.Survived[pd.isnull(data_train.Cabin)].value_counts()
df=pd.DataFrame({u'YES':Survived_cabin, u'NO':Survived_nocabin}).transpose()
df.plot(kind='bar', stacked=True)
plt.title(u"the Survived by IfHaveCabin")
plt.xlabel(u"CabinYES/NO") 
plt.ylabel(u"number")
plt.show()
```
![AESflF.png](https://s2.ax1x.com/2019/03/14/AESflF.png)
有Cabin记录的获救概率稍高一些，先放一放这个特征。
##### 数据预处理
通过前面的分析，我们对数据的大体情况也有了个底，下一步就是对数据进行预处理，为建模做好准备。

  >数据和特征决定了机器学习的上限，而模型和算法只是逼近这个上限而已。

现在我们看一下数据集中到底是那些数据缺失比较严重
```python
import numpy as np 
import pandas as pd 
import matplotlib 
import missingno as msno 
import matplotlib.pyplot as plt

train_df = pd.read_csv("/home/jason/Documents/ML/titanic/train.csv")
msno.matrix(train_df, labels=True)
msno.bar(train_df)
```
![AnaoxH.png](https://s2.ax1x.com/2019/03/19/AnaoxH.png)
从图中可以直观的看出缺失变量的程度。

在对缺失值进行处理前,我们先来了解一下数据缺失的几种类型:
将数据集中不含缺失值的变量称为完全变量，数据集中含有缺失值的变量称为不完全变量。而从缺失的分布来将缺失可以分为完全随机缺失，随机缺失和完全非随机缺失。

+ 完全随机缺失（missing completely at random,MCAR）：指的是数据的缺失是完全随机的，不依赖于任何不完全变量或完全变量，不影响样本的无偏性，如家庭地址缺失；
+ 随机缺失(missing at random,MAR)：指的是数据的缺失不是完全随机的，即该类数据的缺失依赖于其他完全变量，如财务数据缺失情况与企业的大小有关；
+ 非随机缺失(missing not at random,MNAR)：指的是数据的缺失与不完全变量自身的取值有关，如高收入人群不原意提供家庭收入；

先从缺失值最高的两个属性`Cabin`和`Age`开始处理，对于Cabin，按Cabin有无数据，暂时将这个属性处理成Yes和No两种类型吧。然后对于`Age`，通常遇到缺值的情况，我们会有几种常见的处理方式：

+ 删除记录:如果缺值的样本占总数比例极高，我们可能就直接舍弃了，作为特征加入的话，可能反倒带入noise，影响最后的结果了
+  替换缺失值:如果缺值的样本适中，而该属性非连续值特征属性(比如说类目属性)，那就把NaN作为一个新类别，加到类别特征中
+   数据填补:如果缺值的样本适中，而该属性为连续值特征属性，有时候我们会考虑给定一个step(比如这里的age，我们可以考虑每隔2/3岁为一个步长)，然后把它离散化，之后把NaN作为一个type加到属性类目中。 
+ 数据填补:有些情况下，缺失的值个数并不是特别多，那我们也可以试着根据已有的值，拟合一下数据，补充上。 
 	
本例中，后两种处理方式应该都是可行的，我们先使用拟合补全吧(虽然说没有特别多的背景可供我们拟合，这不一定是一个多么好的选择)。这里用scikit-learn中的RandomForest来拟合一下缺失的年龄数据(注：RandomForest是一个用在原始数据中做不同采样，建立多颗DecisionTree，再进行average等等来降低过拟合现象，提高结果的机器学习算法，我们之后会介绍到)

```python
from sklearn.ensemble import RandomForestRegressor

### 使用 RandomForestClassifier 填补缺失的年龄属性
def set_missing_ages(df):

    # 把已有的数值型特征取出来丢进Random Forest Regressor中
    age_df = df[['Age','Fare', 'Parch', 'SibSp', 'Pclass']]

    # 乘客分成已知年龄和未知年龄两部分
    known_age = age_df[age_df.Age.notnull()].as_matrix()
    unknown_age = age_df[age_df.Age.isnull()].as_matrix()

    # y即目标年龄
    y = known_age[:, 0]

    # X即特征属性值
    X = known_age[:, 1:]

    # fit到RandomForestRegressor之中
    rfr = RandomForestRegressor(random_state=0, n_estimators=2000, n_jobs=-1)
    rfr.fit(X, y)

    # 用得到的模型进行未知年龄结果预测
    predictedAges = rfr.predict(unknown_age[:, 1::])

    # 用得到的预测结果填补原缺失数据
    df.loc[ (df.Age.isnull()), 'Age' ] = predictedAges 

    return df, rfr

def set_Cabin_type(df):
    df.loc[ (df.Cabin.notnull()), 'Cabin' ] = "Yes"
    df.loc[ (df.Cabin.isnull()), 'Cabin' ] = "No"
    return df

data_train, rfr = set_missing_ages(data_train)
data_train = set_Cabin_type(data_train)

data_train
```
output:
```

```
### 参考
[Kaggle入门：逻辑回归应用之Kaggle泰坦尼克之灾
](https://www.kesci.com/home/project/5bfe39b3954d6e0010681cd1)
