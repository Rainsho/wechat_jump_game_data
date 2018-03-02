const request = require('superagent');
const { maxBy, assign, orderBy } = require('lodash');
const readline = require('readline');
const { header } = require('./config');
const { mockInitData, mockReqDataWithPlayBack } = require('./util/mockdata');
const { parseInfos, parseScoreRes } = require('./util/parser');

const SCORE_URL = 'https://mp.weixin.qq.com/wxagame/wxagame_getfriendsscore';
const URL = 'https://mp.weixin.qq.com/wxagame/wxagame_settlement';
const PLAY_URL = 'https://mp.weixin.qq.com/wxagame/wxagame_playback';
const SCORE_SHIFT = -1;

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

function getPlayback({ playback_id, times, score, nickname }) {
  const reqData = assign(mockInitData(), {
    playback_id,
    action: 'weekly_rank',
  });
  return request
    .post(PLAY_URL)
    .set(header)
    .send(JSON.stringify(reqData))
    .then(res => {
      const { game_data } = res.body;
      return { game_data, times, score, nickname };
    });
}

/**
 * 提交游戏分数
 */
function sendScore({ game_data, times, score, nickname }) {
  console.log(
    `将使用您好友 ${nickname} 原始分为 ${score} 分的游戏数据构造 ${score +
      SCORE_SHIFT} 分的请求数据，请合理设置 SCORE_SHIFT 避免友尽!!!`
  );

  const reqData = mockReqDataWithPlayBack({
    game_data,
    times,
    score: score + SCORE_SHIFT,
  });
  const reqStr = JSON.stringify(reqData);
  return request
    .post(URL)
    .set(header)
    .send(reqStr);
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
      const { playback_id, week_best_score: score, nickname } = target;
      const times = my_user_info.times + 1;

      getPlayback({ playback_id, times, score, nickname })
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

function start() {
  return getInfos().then(parseFriendsInfo);
}

function check() {
  return getInfos().then(parseInfos);
}

function send({ game_data, times, score, nickname }) {
  return sendScore({ game_data, times, score, nickname }).then(parseScoreRes);
}

start();
