# wechat_jump_game_data

微信跳一跳自动生成游戏数据，并发送请求。目前使用[样本数据](./data/game_data.js)构造 game_data 数据，按后台加密规则加密后发送请求。由于 **game_data 的后台验证机制暂不明朗**，存在请求提交正常但成绩未录入的情况(很无奈)。

更新 `game_data` 构造方法调整，若在 `./data/raw` 中存在已有真实数据，则不构造数据，直接使用之前的 `game_data` 加密后发送至服务器端(通过验证几率较高)，详见[实验结果](#实验结果)。

## 使用方法

1. 安装 [node](https://github.com/nodejs/node) (建议安装 8.0 及以上版本)
2. 使用 [whistle](https://github.com/avwo/whistle) 或其他抓包工具抓取 `session_id`
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

* [x] 补充注释及简单说明
* [x] 补充 session_id 抓取方法
* [ ] Web 管理页面
* [ ] 简单范围校验判断

## 实验结果

这两周忙工作，没做脚本的测试。今天简单试了下，可能随着这个游戏的风头在下降，后台检测也在弱化。今天首次成功提交了 1000 分以上的成绩。具体结果如下(测试时间 2018 年 02 月 03 日 14 点 00 分):

目前[样本数据](./data/raw)包含 696 | 762 | 945 | 991 | 995 | 1042 | 1201 | 1867 分的历史数据(欢迎补充)。其中 995 的历史数据在 995 - 1045 的范围内均测试通过。

| score | result |
| :---: | :----: |
|   2   |   √    |
|   5   |   √    |
|  20   |   √    |
|  40   |   √    |
|  50   |   √    |
|  70   |   √    |
|  696  |   √    |
|  763  |   √    |
|  764  |   √    |
|  990  |   √    |
|  992  |   √    |
|  997  |   √    |
|  998  |   √    |
| 1002  |   √    |
| 1043  |   √    |
| 1044  |   √    |
| 1045  |   √    |
|  100  |   ×    |
|  200  |   ×    |
|  300  |   ×    |
|  400  |   ×    |
|  765  |   ×    |
|  999  |   ×    |
| 1000  |   ×    |
| 1001  |   ×    |
| 1040  |   ×    |
| 1042  |   ×    |
| 1046  |   ×    |
| 1050  |   ×    |
| 1055  |   ×    |
| 1070  |   ×    |
| 1090  |   ×    |
| 1150  |   ×    |
| 1201  |   ×    |
| 1255  |   ×    |
