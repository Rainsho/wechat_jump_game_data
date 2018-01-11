const request = require('superagent');
const { get } = require('lodash');
const { config, header } = require('./config');
const { mockInitData, mockReqData } = require('./util/mockdata');

const SCORE_URL = 'https://mp.weixin.qq.com/wxagame/wxagame_getfriendsscore';
const URL = 'https://mp.weixin.qq.com/wxagame/wxagame_settlement';

function getTimes() {
  const initData = mockInitData();
  return request
    .post(SCORE_URL)
    .set(header)
    .send(JSON.stringify(initData))
    .then((res) => {
      const times = ~~get(res.body, 'my_user_info.times');
      return times + 1;
    });
}

function sendScore(times) {
  const reqData = mockReqData(times);
  request
    .post(URL)
    .set(header)
    .send(JSON.stringify(reqData))
    .end((err, res) => {
      if (err) throw err;
      if (get(res.body, 'base_resp.errcode') === 0) {
        console.log('well done!')
        console.log(config.score, 'has been sent to server');
      }
    });
}

function start() {
  getTimes()
    .then(sendScore);
}

start();
