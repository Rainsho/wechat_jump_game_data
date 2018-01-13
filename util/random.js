const { shuffle, range } = require('lodash');
const { config } = require('../config');
const { game_data } = require('../data/game_data');

/**
 * 生成乱序集合
 * 
 * @param {number} score 
 */
function generateRandomList(score) {
  // 样本数据容量
  const sample = game_data.action.length - 1;

  // 目标集合容量
  const capacity = calcCapacity(score);

  // 目标容量小于样本时 取样本的前若干位并乱序
  if (capacity <= sample) return shuffle(range(capacity)).concat([sample]);

  // 目标容量大于样本时 在样本范围内拼接对应长度集合并乱序
  let list = range(sample);
  for (let i = 0; i < capacity / sample; i++) {
    list = list.concat(range(sample));
  }
  return shuffle(list.slice(0, capacity)).concat([sample]);
}

/**
 * 依据当前分数生成跳跃次数
 * 
 * @param {number} score 
 */
function calcCapacity(score) {
  const t = Math.min(Math.sqrt(score / 10), 8);
  return ~~(score / t);
}

module.exports = { generateRandomList };
