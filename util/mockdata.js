const { random } = require('lodash');
const { encrypt } = require('./cipher');
const { generateRandomList } = require('./random');
const { config } = require('../config');
const { datas, game_data } = require('../data/game_data');

const {
  PER_REST,
  TIME_PADDING,
  REST_TIME,
  ACTION_TIME_MIN,
  ACTION_TIME_MAX,
} = config;

/**
 * 构造查询用户信息的请求数据
 *
 * @param {string} session_id 默认从 config 读取
 */
function mockInitData(session_id = config.session_id) {
  const fast = 1;
  return { base_req: { session_id, fast } };
}

/**
 * 构造提交分数的请求数据
 *
 * @param {number} times      游戏次数
 * @param {number} score      目标分数
 * @param {string} session_id 默认从 config 读取
 */
function mockReqData(
  times,
  score = config.score,
  session_id = config.session_id
) {
  console.log(`准备构造第 ${times} 次游戏 ${score} 分的请求数据`);
  const fast = 1;
  const mockData = mockActionData(times, score);
  const action_data = encrypt(JSON.stringify(mockData), session_id);
  const base_req = { session_id, fast };
  return { base_req, action_data };
}

/**
 * 构造 action_data
 *
 * @param {number} times 游戏次数
 * @param {number} score 目标分数
 *
 * type ActionData {
 *   game_data : string
 *   score : number
 *   timers : number
 * }
 */
function mockActionData(times, score) {
  const game_data =
    score > 993 && score < 1050
      ? datas[995]
      : datas[score] ||
        datas[score + 1] ||
        datas[score - 1] ||
        datas[score + 2] ||
        datas[score - 2] ||
        JSON.stringify(mockGameData(score));
  return { score, times, game_data };
}

/**
 * 构造 game_data
 *
 * @param {number} score
 *
 * type GameData {
 *   seed: number     // 由 timestamp[0] 减去偏移量反推
 *   action: Array    // 从 game_data 中乱序复制
 *   musicList: Array // 从 game_data 中乱序复制
 *   touchList: Array // 从 game_data 中乱序复制
 *   steps: Array     // 从 game_data 中乱序复制
 *   timestamp: Array // 由当前时间减去偏移量反推
 *   version: number  // 2
 * }
 */
function mockGameData(score) {
  const tObject = {};
  const toCopy = ['action', 'musicList', 'touchList', 'steps'];
  const indexList = generateRandomList(score);
  for (const key of toCopy) {
    tObject[key] = copyList(game_data[key], indexList);
  }

  const version = 2;
  const timestamp = generateTimestamp(indexList.length);
  const seed = timestamp[0] - random(ACTION_TIME_MIN, ACTION_TIME_MAX);

  // 保持 stringify 顺序
  const data = Object.assign({ seed }, tObject, { timestamp, version });
  return data;
}

/**
 * 按指定顺序拷贝集合
 *
 * @param {Array} srcList   源集合
 * @param {Array} indexList 拷贝顺序
 */
function copyList(srcList, indexList) {
  return indexList.map(x => srcList[x]);
}

/**
 * 反向生成时间戳集合
 *
 * @param {number} capacity 容量
 */
function generateTimestamp(capacity) {
  const endTime = Date.now() - TIME_PADDING;
  const list = [endTime];
  for (let i = 1; i < capacity; i++) {
    const during = random(ACTION_TIME_MIN, ACTION_TIME_MAX);

    // 逢 PER_REST 次休息 REST_TIME 毫秒
    i % PER_REST === 0
      ? list.unshift(list[0] - REST_TIME - during)
      : list.unshift(list[0] - during);
  }
  return list;
}

module.exports = { mockInitData, mockReqData };
