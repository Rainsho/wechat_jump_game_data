const crypto = require('crypto');
const { config } = require('../config');

const algorithm = 'aes-128-cbc';
const dataEncoding = 'gb2312';
const cipherEncoding = 'base64';

const defaultKey = config.session_id.substr(0, 16);

/**
 * 目前 action_data 的加密方式为
 * 使用 aes-128-cbc 模式加密
 * 密码及偏移量同位 session_id 前 16 位
 * 
 * @param {string} data 
 * @param {string} key 
 */
function encrypt(data, key = defaultKey) {
  const chunks = [];
  const cipher = crypto.createCipheriv(algorithm, key, key);
  chunks.push(cipher.update(data, dataEncoding, cipherEncoding));
  chunks.push(cipher.final(cipherEncoding))
  return chunks.join('');
}

module.exports = { encrypt };
