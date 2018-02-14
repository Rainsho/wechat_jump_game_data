const request = require('superagent');
const { range } = require('lodash');
const { header } = require('./config');
const { mockInitData, mockReqData } = require('./util/mockdata');

const fs = require('fs');
let session_id;
try {
  session_id = fs.readFileSync('.sessiondata', { encoding: 'utf8' });
} catch (e) {
  session_id = void 0;
  console.info(e);
}

const SCORE_URL = 'https://mp.weixin.qq.com/wxagame/wxagame_getfriendsscore';
const URL = 'https://mp.weixin.qq.com/wxagame/wxagame_settlement';

/**
 * 请求 getfriendsscore 主要是为了拿到当前游戏次数和当前最高分
 */
function getInfos() {
  const initData = mockInitData(session_id);
  return request
    .post(SCORE_URL)
    .set(header)
    .send(JSON.stringify(initData));
}

/**
 * 提交游戏分数
 */
function sendScore(times, _score) {
  const score = _score || process.argv[2];
  const reqData = score
    ? mockReqData(times, ~~score, session_id)
    : mockReqData(times);
  const reqStr = JSON.stringify(reqData);
  return request
    .post(URL)
    .set(header)
    .send(reqStr);
}

/**
 * 解析 getInfos 请求
 */
function parseInfos(res) {
  const { my_user_info } = res.body;
  if (my_user_info) {
    // console.info(my_user_info);
    console.log(`当前周最高分: ${my_user_info.week_best_score}`);
    console.log(`当前游戏次数: ${my_user_info.times}`);
    return my_user_info.times + 1;
  }
  console.info('服务器端发现异常');
  throw new Error('oops something went wrong...');
}

/**
 * 解析 sendScore 请求
 */
function parseScoreRes(res) {
  // console.info(res.body);
  if (res.body.base_resp.errcode !== 0) {
    console.log('服务器端发现异常');
    throw new Error('oops something went wrong...');
  }
  console.log('成绩已成功提交至服务器');
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

const arg = process.argv[2];

~~arg && start();

arg === 'c' && check();

const results = {};
const cheaters = {};

function test(score) {
  if (!score) return;
  return getInfos()
    .then(res => res.body.my_user_info.times + 1)
    .then(times => sendScore(times, score))
    .then(res => {
      const status = res.body.cheater_status;
      (cheaters[status] || (cheaters[status] = [])).push(score);
    })
    .then(getInfos)
    .then(res => {
      const { my_user_info } = res.body;
      const { week_best_score } = my_user_info;
      // console.log(score, week_best_score === score);
      const result = week_best_score === score;
      (results[result] || (results[result] = [])).push(score);
    });
}

arg === 't' &&
  (function() {
    const socres = range(2, 2020, 4);
    const fn = () => {
      const score = socres.shift();
      if (!score) return console.log(results, cheaters);
      test(score)
        .then(
          () =>
            new Promise((res, rej) => {
              setTimeout(res, 100);
            })
        )
        .then(fn)
        .catch(() => {
          console.log(results, cheaters);
        });
    };

    fn();
  })();
