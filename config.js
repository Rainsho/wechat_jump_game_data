const config = {
  session_id: 'rNInWtK0z3vvRv4iowIH7lfQtsqrbk5UVNPuby54EBu5QREZNN7Q+h+2e/AsQyTvtxwWgGfMnwsEWeXLxkAcld9aayjRJXlnAUJFCUshtNDURdTPVU/YP3cFviXB0w7PXvTwBRFscWn113UpnbFJBg==',
  score: 42,

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
