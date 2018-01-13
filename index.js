const request = require('superagent');
const { config, header } = require('./config');
const { mockInitData, mockReqData } = require('./util/mockdata');

const SCORE_URL = 'https://mp.weixin.qq.com/wxagame/wxagame_getfriendsscore';
const URL = 'https://mp.weixin.qq.com/wxagame/wxagame_settlement';

function getInfos() {
  const initData = mockInitData();
  return request
    .post(SCORE_URL)
    .set(header)
    .send(JSON.stringify(initData));
}

function sendScore(times) {
  console.log(`准备构造第 ${times} 次游戏请求数据`);
  const reqData = mockReqData(times);
  return request
    .post(URL)
    .set(header)
    .send(JSON.stringify(reqData));
}

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

function parseScoreRes(res) {
  // console.info(res.body);
  if (res.body.base_resp.errcode !== 0) {
    console.log('服务器端发现异常');
    throw new Error('oops something went wrong...');
  }
  console.log('成绩已成功提交至服务器');
}

function start() {
  return getInfos()
    .then(parseInfos)
    .then(sendScore)
    .then(parseScoreRes)
    .then(check);
}

function check() {
  return getInfos()
    .then(parseInfos);
}

start();
// check();
