const fs = require('fs');
const path = require('path');

const datas = {};
const dir = path.resolve(__dirname, 'raw');
const files = fs.readdirSync(dir, 'utf8');

files.forEach(file => {
  const action_str = fs.readFileSync(path.resolve(dir, file), 'utf8');
  const action_data = JSON.parse(action_str);
  const key = file.split('_').pop();
  datas[key] = action_data.game_data;
});

module.exports = { datas, game_data: JSON.parse(datas['945']) };
