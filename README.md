# wechat_jump_game_data

微信跳一跳自动生成游戏数据，并发送请求。目前使用[样本数据](./data/game_data.js)构造 
game_data 数据，按后台加密规则加密后发送请求。
由于 **game_data 的后台验证机制暂不明朗**，存在请求提交正常但成绩未录入的情况(很无奈)。

## 使用方法

1. 安装 [node](https://github.com/nodejs/node) (建议安装 8.0 及以上版本)
2. 使用 [whistle](https://github.com/avwo/whistle) 或抓包工具抓取 `session_id`  
   1. 安装后在命令行使用 `w2 start` 启动 `whistle`
   2. 手机设置 http 代理为上一步弹出的 IP 地址
   3. 在管理页面，点击 `Https` 手机扫描二维码或使用浏览器输入对应地址，下载根证书
   4. 信任根证书后，勾选 `Intercept HTTPS CONNECTs`
   5. 进去游戏，任意 `/wxagame` 开头的请求在 `Request` 内即可看到 `session_id`
3. 在 `config.js` 内填入 `session_id` 和想提交的分数 `score` (目前经验值是 10 - 999 为安全数据)

4. 安装依赖：

```bash
$ npm install
```

5. 生成数据并提交微信后台：

```bash
$ npm start
```

## TODO

- [x] 补充注释及简单说明
- [x] 补充 session_id 抓取方法
- [ ] Web 管理页面
- [ ] 简单范围校验判断
