const crypto = require('crypto');
const { config } = require('../config');

const algorithm = 'aes-128-cbc';
const dataEncoding = 'gb2312';
const cipherEncoding = 'base64';

const defaultKey = config.session_id.substr(0, 16);

/**
 * 
 * @param {string} data 
 * @param {string} key 
 */
function encrypt(data, key = defaultKey) {
    const cipher = crypto.createCipheriv(algorithm, key, key);
    cipher.update(data, dataEncoding, cipherEncoding);
    return cipher.final(cipherEncoding);
}

module.exports = { encrypt };
