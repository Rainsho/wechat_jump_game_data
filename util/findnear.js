/**
 * 二分法查找最接近的数值 间距相等时返回大值
 *
 * @param {array}  arr 有序集合
 * @param {number} num 查找值
 */
function findnear(arr, num) {
  if (arr.length === 1) return arr[0];
  const mid = ~~(arr.length / 2);
  const left = arr.slice(0, mid);
  const right = arr.slice(mid);
  if (left[mid - 1] + right[0] > 2 * num) return findnear(left, num);
  return findnear(right, num);
}

module.exports = { findnear };
