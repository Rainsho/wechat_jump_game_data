const request = require('superagent');
const { range, maxBy, assign, sortBy } = require('lodash');
const { header } = require('./config');
const {
  mockInitData,
  mockReqData,
  mockReqDataWithPlayBack,
} = require('./util/mockdata');

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
const PLAY_URL = 'https://mp.weixin.qq.com/wxagame/wxagame_playback';
const SCORE_SHIFT = 1;

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

function getPlayback({ playback_id = '', times, score }) {
  const reqData = assign(mockInitData(session_id), {
    playback_id,
    action: 'weekly_rank',
  });
  return request
    .post(PLAY_URL)
    .set(header)
    .send(JSON.stringify(reqData))
    .then(res => {
      const { game_data } = res.body;
      //   console.log(game_data);
      return { game_data, times, score };
    });
}

/**
 * 提交游戏分数
 */
function sendScore({ game_data, times, score }) {
  //   console.log({ game_data, times, score });
  const reqData = mockReqDataWithPlayBack({
    game_data,
    times,
    score: score + SCORE_SHIFT,
    session_id,
  });
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
  const { user_info, my_user_info } = res.body;
  if (user_info && user_info.length > 0) {
    const no1 = maxBy(user_info, 'week_best_score');
    // const no1 = sortBy(user_info, 'week_best_score')[2];
    const { playback_id, week_best_score: score } = no1;
    const times = my_user_info.times + 1;
    // console.log(no1);
    // console.info(my_user_info);
    console.log(`当前周最高分: ${my_user_info.week_best_score}`);
    console.log(`当前游戏次数: ${my_user_info.times}`);
    return { playback_id, times, score };
  }
  console.info('服务器端发现异常');
  throw new Error('oops something went wrong...');
}

/**
 * 解析 sendScore 请求
 */
function parseScoreRes(res) {
  console.info(res.body);
  if (res.body.base_resp.errcode !== 0) {
    console.log('服务器端发现异常');
    throw new Error('oops something went wrong...');
  }
  console.log('成绩已成功提交至服务器');
}

function start() {
  return check()
    .then(getPlayback)
    .then(send)
    .then(check);
}

function check() {
  return getInfos().then(parseInfos);
}

function send({ game_data, times, score }) {
  return sendScore({ game_data, times, score }).then(parseScoreRes);
}

process.argv[2] === 'c' ? check() : start();
