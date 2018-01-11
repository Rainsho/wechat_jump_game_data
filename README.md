# wechat_jump_game_data

微信跳一跳自动生成游戏数据，并发送请求。

## 使用方法

在 `config.js` 内填入 `session_id` 和想提交的分数 `score` (目前经验值是 1 - 999 为安全数据)。

安装依赖：

```bash
$ npm install
```

生成数据并提交微信后台：

```bash
$ npm start
```

## TODO

- [ ] 补充注释及简单说明
- [ ] 补充 session_id 抓取方法
- [ ] Web 管理页面
- [ ] 简单范围校验判断
