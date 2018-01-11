const config = {
  session_id: 'TQ2KU93/yUK+2HMM9ilwP6fC/JXSdetZnwWXtX97nq9W1UIT8n0lbwWm'
    + 'cixYmoAMIKlj/+KdZNaUaacjkQ9i562LJFYVL1SP/uDFAEfVioDVUk/XQx9D/UE'
    + 'xLmTFtC9Xe+PCdtG8XLjk8dMgEIPa/g==',
  score: 200,

  // 游戏用常量
  PER_REST: 15,
  TIME_PADDING: 3000,
  REST_TIME: 5000,
  ACTION_TIME_MIN: 500,
  ACTION_TIME_MAX: 1500,
};

const header = {
  'charset': 'utf-8',
  'Accept-Encoding': 'gzip',
  'referer': 'https://servicewechat.com/wx7c8d593b2c3a7703/7/page-frame.html',
  'content-type': 'application/json',
  'User-Agent': 'MicroMessenger/6.6.1.1220(0x26060134) NetType/WIFI Language/en',
  'Host': 'mp.weixin.qq.com',
  'Connection': 'Keep-Alive',
}

module.exports = { config, header };
