---
title: CSAPP第二章家庭作业
url: 82.html
id: 82
categories:
  - Uncategorized
tags:
---

#### 2.55

    #include <stdio.h>
    typedef unsigned char* byte_pointer;
    void show_bytes(byte_pointer start, size_t len) {
      size_t i;
      for (i = 0; i < len; i++) {
        printf(" %.2x", start[i]);
      }
      printf("\n");
    }
    void show_int(int x) {
      show_bytes((byte_pointer) &x, sizeof(int));
    }
    void show_float(float x) {
      show_bytes((byte_pointer) &x, sizeof(float));
    }
    void show_pointer(void* x) {
      show_bytes((byte_pointer) &x, sizeof(void*));
    }
    void test_show_bytes(int val) {
      int ival = val;
      float fval = (float) ival;
      int* pval = &ival;
      show_int(ival);
      show_float(fval);
      show_pointer(pval);
    }
    int main(int argc, char* argv[]) {
      int test_num = 328;
      test_show_bytes(test_num);
      return 0;
    }

#### 2.56 略

#### 2.57

    #include <stdio.h>
    
    typedef unsigned char* byte_pointer;
    
    void show_bytes(byte_pointer start, size_t len) {
      size_t i;
      for (i = 0; i < len; i++) {
        printf(" %.2x", start[i]);
      }
      printf("\n");
    }
    
    void show_int(int x) {
      show_bytes((byte_pointer) &x, sizeof(int));
    }
    
    void show_float(float x) {
      show_bytes((byte_pointer) &x, sizeof(float));
    }
    
    void show_pointer(void* x) {
      show_bytes((byte_pointer) &x, sizeof(void*));
    }
    
    //=============
    // 2.57 changes
    //=============
    void show_short(short x) {
      show_bytes((byte_pointer) &x, sizeof(short));
    }
    
    void show_long(long x) {
      show_bytes((byte_pointer) &x, sizeof(long));
    }
    
    void show_double(double x) {
      show_bytes((byte_pointer) &x, sizeof(double));
    }
    //==================
    // 2.57 changes end
    //==================
    
    void test_show_bytes(int val) {
      int ival = val;
      float fval = (float) ival;
      int* pval = &ival;
    
      show_int(ival);
      show_float(fval);
      show_pointer(pval);
    
      //=============
      // 2.57 changes
      //=============
      short sval = (short) ival;
      long lval = (long) ival;
      double dval = (double) ival;
    
      show_short(sval);
      show_long(lval);
      show_double(dval);
      //==================
      // 2.57 changes end
      //==================
    }
    
    int main(int argc, char* argv[]) {
      int test_num = 328;
    
      test_show_bytes(test_num);
      return 0;
    }

#### 2.58

（1）

**int** **is\_little\_endian**(){
    **int** a = 1;
    return *((**char** *)&a);
    //此时a的值为1
    //&a的值是a的地址，ex：0x7fff38424314
    //而(**char** *)&a将a的地址强制转换为一个char类型指针（char只有2个bit）
    //于是我们会得到一个char类型的指针这个指针是内存中1十六机制表示的第一位
    //*((**char** *)&a)将这个值取出如果是小端法表示则第一位应该等于1
}

（2）

    #include <stdio.h>
    #include <assert.h>
    
    typedef unsigned char* byte_pointer;//声明指针char *作为bytepointer
    
    int is_little_endian() {
      int testnum = 0xff;//赋值为0xff
      byte_pointer byte_start = (byte_pointer) &test_num;
      //将int类型的第一个值取出
      //强制类型转换表明无论指针&x以前是什么值，现在它就是一个char类型指针，强制类型
      //转换并不会改变指针的值，它只是告诉编译器以新的数据类型来看待该指针
      if (byte_start[0] == 0xff) {
        return 1;
      //如果此时发现在内存中开始的位置储存结尾的值即为小端法机器
      }
      return 0;
    }
    
    int main(int argc, char* argv[]) {
      assert(is_little_endian());
      return 0;
    }

#### 2.59

表达式：x& 0xFF | y& ~0xFF 检测程序：

#include <stdio.h>
#include <iostream>
#include <assert.h>
using namespace std;
int main(int argc ,char* argv\[\]) {
    size_t mask=0xff;
    size_t x=0x89abcdef;
    size_t y=0x76543210;

    size_t val = x&mask | y& ~mask;
    //我们知道不同进制之间的运算在位级表示上是相同的，在进行这一步运算时
    //x&0xff 即为在二进制位上计算结果为 0x000000ef
    //y& ～0xff 即为在二进制位上计算y&0x11111100结果为0x76543200
    // 最后或运算结果如下
    assert(val==0x765432ef);
    return 0;
}

#### 2.60

unsigned **replace_byte**(unsigned x, unsigned **char** b, **int** i)
{
    return (x & ~(0xFF<<(i<<3))) | (b << (i<<3));
    //因为是从0到w/8-1位编码所以要移位×8
}

#### 2.61

A. !~x
B. !x
C. !~(x | ~0xff)
D.`!((x >> ((sizeof(int)-1) << 3)) & 0xff)`

#### 2.62

#include <stdio.h>
int int\_shift\_are_arithmetic(){
    int size = sizeof(int)-1;
    int x=0x1;
    x>>1;
    return x;
}
int main(){
    printf("%d",int\_shift\_are_arithmetic());
    return 0;
}

    #include <stdio.h>
    #include <assert.h>
    
    int int_shifts_are_arithemetic() {
      int num = -1;
      return !(num ^ (num >> 1));
    }
    
    int main(int argc, char* argv[]) {
      assert(int_shifts_are_arithemetic());
      return 0;
    }

#### 2.63

unsigned srl(unsigned x,int k){
	unsigned xsra = (int) x >> k;
	//对x执行算术右移
	int w = sizeof(int)<<3;
	//计算int类型位数
	int mask =(int)-1<<(w-k);
	//将一个全为1的int类型左移（w-k）位
	return xsra & ~mask;
	//将mask取反得到一个数值可以使xsra应得的位
}

int sra(int x,int k){
	int xrsl = (unsigned) x >> k;
	
	int w=sizeof(int)<<3;
	int mask = (int)-1<<(w-k);//这里得到了一个初始的mask值
	//let mask remian unchanged when the first bit of x is 1,otherwise 0.
	int m =1<<(w-1);
	//m的值为0x10000000...
	mask &= !(x&m)-1;
	//x&m的值计算x的第一位是否为1若为1，如果为1则高位填充1，若不为1则高位填充0
	//所以计算如果x最高位不是1，那么mask等于mask&0即0，此时逻辑右移的值即为算术右移的值
	//如果最高位为1，mask的值为mask&0x0111111111，最后|上mask的值即可
	retunr xsrk | mask;
}

#### 2.64

/*Return 1 when any odd bit of x equals 1; 0 otherwise.
\* Assume w=32*/
int any\_odd\_one(unsigned x){
return !!(0xAAAAAAAA&x);
//在二进制中即为10101010101010101010\[1010\]所以第一步如果所有奇数位为1则整个数为0xffffffff取反0再反1
}

#### 2.65

/*Return 1 when x contains an odd number of 1s;0 otherwise.
\* Assume w =32 
\* only 12 times caclute
\* obey the rules of integer codeing*/

int odd_ones(unsigned x){
x ^= (x>>16);
x ^= (x>>8);
x ^= (x>>4);
x ^= (x>>2);
x ^= (x>>1);
return x&1;
}
/\* Magic number
\* lookup table*/
unsigned char parity(unsigned int i){
i ^= i>>4;
i ^= i>>8;
i ^= i>>16;
return (0x6996 >> ( i & 0xf)) & 0x1;
}
/\* 这里就可以演一发了,不愧是四星大题哈
\* 归根结底呢是一个合并（Merge）的思想，在这个方法>>后的数字顺序并不重要可以按任意顺序
\* 出现，但是为了方便理解，我们用一个递增的顺序来描述，like：
\* x ^= x>>1; 以两个位为一组，统计组内的1的奇偶性，并将结果放在组内最右侧的位上
\* x ^= x>>2; 以四个位为一组，统计组内的表示二元组奇偶性的1的奇偶，并将结果放在四元组最右侧的位上
\* x ^= x>>4; 以八个位为一组，统计组内的表示四元组奇偶性的1的奇偶，并将结果放在八元组最右侧的位上
\* x ^= x>>8; same like
\* x ^= x>>16; same like
\* return x&1; 最后把最后一个元素的奇偶性表示出来即为这个数内的1的奇偶性
\*/

/\* x ^= x >> 4;
\* x ^= x >> 8;
\* x ^= x >> 16;
\* return (0x6996 >> (x & 0xf)) & 0x1;
\* 所谓查找表是一种更加抽象的方法，首先利用4,8,16将整个数的奇偶性merge到最右侧四位，四位二进制数最多有
\* 16个可以通过0x6996来表示所有的可能性，使用位移操作来代替查表操作，穷举从0x0到0xf的所有值，每个值对应
\* 的结果为0或1，k值从右到左的第i位值为 ix
\* i ix i ix i ix i ix i ix i ix i ix
\* 0000 0 0001 1 0010 1 0011 0 0100 1 0101 0 0110 0
\* i ix i ix i ix i ix i ix i ix i ix 
\* 0111 1 1000 1 1001 0 1010 0 1011 1 1100 0 1101 1
\* i ix i ix 
\* 1110 1 1111 0
\* 最终获得一个二进制数 0110100110010110即为十六进制数0x6996
*/

#### 2.66

/\*
\* Generate mask indicating leftmost 1 in x. Assume w=32.
\* For example, 0xff00 -> 0x8000,and 0x6600 -->0x4000.
\* If x=0, then return 0.
*/

int leftmost_one(unsigned x){
/\*
\* 题意要求我们用mask的形式将一个int值最左侧1的位置给出。
\* 首先通过或运算将最左侧1之后的值全部置位1,
\* 例如：0xff00 -> 0xffff, and 0x6600 --> 0x7fff
*/
x |= x >>1;
x |= x >>2;
x |= x >>4;
x |= x >>8;
x |= x >>16;
/*得到初始mask值我们将其右移一位，
\* 再将结果异或与原mask值，就得到答案了。
*/
return x^(x>>1);
}

#### 2.67

/\* The following code does not run properly one some machines */
int bad\_int\_size\_is\_32(){
/\* Set most significant bit(msb) of 32-bit machines */
int set_msb = 1 << 31;
/\* Shift past msb of 32-bit word */
int beyond_msb = 1 << 31;

/\* set_msb is nonzero when word size >= 32
\* beyond_msb is zero when word size <= 32 */
return set\_msb && !beyond\_msb;
}
/*A. In section 6.5.7 Bitwise shift operators of c11 standard,it said
\* "If valuse of the right operand is negative or is greater than or equal to the width of the promoted
\* left operand, the behavior it undefined."
*/
/*B
*/
int int\_bit\_is_32(){
int set_msb = 1 << 31;
int beyond\_msd = set\_msb << 31;
return set\_msb && !beyond\_msb;
}
int int\_bit\_is_32(){
int ser_msb = 1 <<31;
int beyond_msd = 2 <<31;
return set\_msb && !beyond\_msb;
}
/*C
*/
int int\_size\_is\_32\_for_16bit(){
int set_msb = 1 << 15 << 15 <<1;
int beyond\_msb = set\_msb <<1;
return set\_msb && !beyond\_msb;
}

#### 2.68

/\* 
\* Mask with least signficant n bits set to 1
\* Example: n = 6 --> 0x3f, n = 17 -->0x1ffff
\* Assume 1 <= n <= w
*/
int lower\_one\_mask(int n){
/*这个题的意思是将int类型的最后n位置1
*/
int w = sizeof(int)<<3;
return (unsigend) 1 >>(w-n);
}
int lower\_one\_mask(int n){
return (2<<(n-1))-1;
}

#### 2.69

/\*
\* do rotating left shift. assume 0 <= n <w
\* Examples when x = 0x12345678 and w= 32;
\* n=4 ->0x23456781 ,n=20 ->0x67812345
*/
unsigned rotate_keft(unsigned x,int n){
int w = sizeof(int)<<3;
/*注意当n=0时
*/
int mask = x >>(w-n-1)>>1;
x << n;
return mask1|x;
}

#### 2.70

/\*
\* return 1 when x can be represented as an n-bit, 2's-complement
\* number; 0 otherwise
\* Assume 1 <= n <= w
*/
int fits_bits(int x,int n){
/*这个题是求x是否能被表示成n位二进制补码
\* 假设w=8，n=3
\* 注意x>0时，
\* 0b00000010可以 0b00001010不行 0b00000110不行
\* 当n<0时，
\* 0b11111100 可以 0b10111100 不行 0b11111000 不行
*/
int w =sizeof(int)<<3;
int offset = w-n ;
return (x << offset >>offset)==x;
}

#### 2.71

/*A.The result is unsigned not int 
*/
/*B.use int out the byte leftshift to the highest bit ,then rightshift to lowest byte
*/
/*Declaration of data type where 4 byte are packed
\* into an unsigned
*/
typedef unsigned pasked_t;

/\*Extract byte from word.Return as signed integer\*/
int xbyte(packed_t word,int bytenum){
int ret = word << ((3-bytenum) <<3);
return ret >>24;
}

#### 2.72

 

#### 2.73

#### 2.74

#### 2.75

#### 2.76