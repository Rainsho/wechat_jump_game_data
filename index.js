const request = require('superagent');
const { header } = require('./config');
const { mockInitData, mockReqData } = require('./util/mockdata');
const { parseInfos, parseScoreRes } = require('./util/parser');

const SCORE_URL = 'https://mp.weixin.qq.com/wxagame/wxagame_getfriendsscore';
const URL = 'https://mp.weixin.qq.com/wxagame/wxagame_settlement';

/**
 * 请求 getfriendsscore 主要是为了拿到当前游戏次数和当前最高分
 */
function getInfos() {
  const initData = mockInitData();
  return request
    .post(SCORE_URL)
    .set(header)
    .send(JSON.stringify(initData));
}

/**
 * 提交游戏分数
 */
function sendScore(times) {
  const score = process.argv[2];
  const reqData = score ? mockReqData(times, ~~score) : mockReqData(times);
  const reqStr = JSON.stringify(reqData);
  return request
    .post(URL)
    .set(header)
    .send(reqStr);
}

function start() {
  return check()
    .then(send)
    .then(check);
}

function check() {
  return getInfos().then(parseInfos);
}

function send(times) {
  return sendScore(times).then(parseScoreRes);
}

start();
