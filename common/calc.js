/*
 * @Author: 阳志强
 * @Date: 20122-06-16 11:48:02
 * @Description: 金额计算,避免浮点数计算会存在精度丢失问题
 */

/**
 * 判断value是否为一个整数
 * @param {number|string|null} value
 */
function isInteger(value) {
  if (isNaN(value)) return false;
  const num = +value;
  return Math.floor(num) === num;
}

/**
 * 将一个浮点数转成整数，返回整数和倍数
 * @param {number|string|null} floatNum 如：如 3.14 >> 314，倍数是 100
 * @returns {object} 如：{times:100, num: 314}
 */
function toInteger(floatNum) {
  const ret = { times: 1, num: 0 };
  if (isInteger(floatNum)) {
    ret.num = floatNum;
    return ret;
  }
  const strfi = `${floatNum}`;
  const dotPos = strfi.indexOf(".");
  const len = strfi.substr(dotPos + 1).length;
  const times = 10 ** len;
  ret.times = times;
  ret.num = +strfi.replace(".", "");

  return ret;
}


function transformNumber(a, b) {
  if (!a) a = 0
  if (!b) b = 0
  a = Number(a)
  b = Number(b)
  //初始化
  const o1 = toInteger(a);
  const o2 = toInteger(b);
  const n1 = o1.num; //放大倍数后的整数值
  const n2 = o2.num;
  const t1 = o1.times; //倍数
  const t2 = o2.times;
  const max = t1 > t2 ? t1 : t2;
  return {
    n1,
    n2,
    t1,
    t2,
    max,
  };
}

/*
  * 计算核心方法，实现加减乘除运算，确保不丢失精度
  * 思路：把小数放大为整数（乘），进行算术运算，再缩小为小数（除）
  * @param a {number} 运算数1
  * @param b {number} 运算数2
  * @param operation {string} 运算类型,即:加(+) 减(-) 乘(*) 除(/)
  *
  */
function calculator(a, b, operation) {
  const { n1, n2, t1, t2, max } = transformNumber(a, b);

  let value = 0
  switch (operation) {
    case "+"://加
      //计算加法
      if (t1 === t2) {
        // 两个小数位长度相同
        value = n1 + n2;
      } else if (t1 > t2) {
        // n1 小数位长度 大于 n2
        value = n1 + n2 * (t1 / t2);
      } else {
        // n1 小数位长度 小于 n2
        value = n1 * (t2 / t1) + n2;
      }
      value = value / max; //缩小并返回值
      break;
    case "-"://减
      if (t1 === t2) {
        value = n1 - n2;
      } else if (t1 > t2) {
        value = n1 - n2 * (t1 / t2);
      } else {
        value = n1 * (t2 / t1) - n2;
      }
      value = value / max; //缩小并返回值
      break;
    case "*"://乘
      value = (n1 * n2) / (t1 * t2);
      break;
  case "/"://除
      // 除数为零会返回无​​穷大 (Infinity),此处进行处理
      if (n2 == 0) value = 0
      else value = (n1 / n2) * (t2 / t1);
      break;
  }
  return value
}


// 数值相加
export function calcAdd(a, b) {
  return calculator(a, b, '+')
}
// 数值相减
export function calcSubtract(a, b) {
  return calculator(a, b, '-')
}
// 数值相乘
export function calcMultiply(a, b) {
  return calculator(a, b, '*')
}
// 数值相除
export function calcDivision(a, b) {
  return calculator(a, b, '/')
}

// console.log("calcDivision", calcDivision(10, 1.25));
// console.log("calcMultiply", calcMultiply(10, 1.25));
// console.log("calcAdd", calcAdd(10, 1.25));
// console.log("calcSubtract", calcSubtract(10, 1.25));