const { shuffle, range } = require('lodash');
const { config } = require('../config');
const { game_data } = require('../data/game_data');

/**
 * 
 * @param {number} score 
 */
function generateRandomList(score) {
  const sample = game_data.action.length - 1;
  const capacity = ~~(score / capacityTimes(score)) + 1;
  if (capacity <= sample) return shuffle(range(capacity));
  let list = range(sample);
  for (let i = 0; i < capacity / sample; i++) {
    list = list.concat(range(sample));
  }
  return shuffle(list.slice(0, capacity));
}

function capacityTimes(score) {
  const t = Math.sqrt(score / 10);
  return t > 8 ? 8 : t;
}

module.exports = { generateRandomList };
