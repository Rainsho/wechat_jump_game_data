/**
 * 解析 getInfos 请求
 */
function parseInfos(res) {
  const { my_user_info } = res.body;
  if (my_user_info) {
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
  const { base_resp: { errcode }, cheater_status } = res.body;
  if (errcode !== 0) {
    console.log('服务器端发现异常');
    throw new Error('oops something went wrong...');
  }

  cheater_status
    ? console.log('成绩未被服务器接受 cheater_status:', cheater_status)
    : console.log('成绩已成功提交至服务器');
}

module.exports = { parseInfos, parseScoreRes };
