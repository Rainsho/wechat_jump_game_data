const request = require('superagent');
const { range, maxBy, assign, orderBy } = require('lodash');
const readline = require('readline');
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
const SCORE_SHIFT = -1;

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
  const { my_user_info } = res.body;
  if (my_user_info) {
    console.log(`当前周最高分: ${my_user_info.week_best_score}`);
    console.log(`当前游戏次数: ${my_user_info.times}`);
    return;
  }
  console.info('服务器端发现异常');
  throw new Error('oops something went wrong...');
}

function parseFriendsInfo(res) {
  const { user_info, my_user_info } = res.body;
  if (user_info && user_info.length > 0) {
    const ranks = orderBy(user_info, 'week_best_score', 'desc');
    const q = ranks
      .slice(0, 15)
      .map((x, i) => `${i}  ${x.nickname}  ${x.week_best_score}`)
      .join('\n');

    const rl = readline.createInterface({
      input: process.stdin,
      output: process.stdout,
    });

    rl.question(`${q}\n请选择要模拟的好友(默认为0):`, answer => {
      const no = parseInt(answer, 10) || 0;
      const target = ranks[no] || ranks[0];
      const { playback_id, week_best_score: score } = target;
      const times = my_user_info.times + 1;

      getPlayback({ playback_id, times, score })
        .then(send)
        .then(check)
        .then(() => rl.close())
        .catch(() => rl.close());
    });

    rl.on('close', () => process.exit(0));
    return;
  }
  console.info('服务器端发现异常');
  throw new Error('oops something went wrong...');
}

/**
 * 解析 sendScore 请求
 */
function parseScoreRes(res) {
  // console.info(res.body);
  const { base_resp: { errcode }, cheater_status } = res.body;
  if (errcode !== 0) {
    console.log('服务器端发现异常');
    throw new Error('oops something went wrong...');
  }

  cheater_status
    ? console.log('成绩未被服务器接受 cheater_status:', cheater_status)
    : console.log('成绩已成功提交至服务器');
}

function start() {
  return getInfos().then(parseFriendsInfo);
}

function check() {
  return getInfos().then(parseInfos);
}

function send({ game_data, times, score }) {
  return sendScore({ game_data, times, score }).then(parseScoreRes);
}

process.argv[2] === 'c' ? check() : start();
