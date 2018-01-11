const { random } = require('lodash');
const { encrypt } = require('./cipher');
const { generateRandomList } = require('./random');
const { config } = require('../config');
const { game_data } = require('../data/game_data');

const {
    PER_REST,
  TIME_PADDING,
  REST_TIME,
  ACTION_TIME_MIN,
  ACTION_TIME_MAX,
} = config;

/**
 * 
 */
function mockInitData() {
  const { session_id } = config;
  const fast = 1;
  return { base_req: { session_id, fast } };
}

/**
 * 
 * @param {number} times 
 * @param {string} session_id 
 * @param {number} score 
 */
function mockReqData(times, { session_id, score } = config) {
  const fast = 1;
  const mockData = mockActionData(score, times);
  const action_data = encrypt(JSON.stringify(mockData));
  const base_req = { session_id, fast };
  return { base_req, action_data };
}

/**
 * 
 * @param {number} score 
 * @param {number} times 
 */
function mockActionData(score, times) {
  const game_data = JSON.stringify(mockGameData(score));
  return { game_data, score, times };
}

/**
 * 
 * @param {number} score 
 * 
 * type GameData {
 *   seed: number
 *   version: number
 *   action: Array
 *   musicList: Array
 *   steps: Array
 *   timestamp: Array
 *   touchList: Array
 * }
 */
function mockGameData(score) {
  const data = { version: 2 };
  const toCopy = ['action', 'musicList', 'steps', 'touchList'];
  const indexList = generateRandomList(score);
  for (const key of toCopy) {
    data[key] = copyList(game_data[key], indexList);
  }
  data.timestamp = generateTimestamp(indexList.length);
  data.seed = data.timestamp[0] - random(ACTION_TIME_MIN, ACTION_TIME_MAX);
  return data;
}

/**
 * 
 * @param {Array} srcList 
 * @param {Array} indexList 
 */
function copyList(srcList, indexList) {
  return indexList.map(x => srcList[x]);
}

/**
 * 
 * @param {number} capacity 
 */
function generateTimestamp(capacity) {
  const endTime = Date.now() - TIME_PADDING;
  const list = [endTime];
  for (let i = 1; i < capacity; i++) {
    const during = random(ACTION_TIME_MIN, ACTION_TIME_MAX);
    i % PER_REST === 0
      ? list.unshift(list[0] - REST_TIME - during)
      : list.unshift(list[0] - during);
  }
  return list;
}

module.exports = { mockInitData, mockReqData };
