const { random } = require('lodash');
const { generateRandomList } = require('./random');
const { config } = require('../config');
const { game_data } = require('../data/game_data');

const {
    PER_REST,
    TIME_PADDING,
    REST_TIME,
    ACTION_TIME_MIN,
    ACTION_TIME_MAX,
} = config;

/**
 * 
 * @param {*} score 
 * @param {*} times 
 */
function mockActionData(score = config.score, times = config.times) {
    const game_data = JSON.stringify(mockGameData(score));
    return { game_data, score, times };
}

/**
 * 
 * @param {number} score 
 * 
 * type GameData {
 *   seed: number
 *   version: number
 *   action: Array
 *   musicList: Array
 *   steps: Array
 *   timestamp: Array
 *   touchList: Array
 * }
 */
function mockGameData(score = config.score) {
    const data = { version: 2 };
    const toCopy = ['action', 'musicList', 'steps', 'touchList'];
    const indexList = generateRandomList(score);
    for (const key of toCopy) {
        data[key] = copyList(game_data[key], indexList);
    }
    data.timestamp = generateTimestamp(indexList.length);
    data.seed = data.timestamp[0] - random(ACTION_TIME_MIN, ACTION_TIME_MAX);
    return data;
}

/**
 * 
 * @param {*} srcList 
 * @param {*} indexList 
 */
function copyList(srcList, indexList) {
    return indexList.map(x => srcList[x]);
}

/**
 * 
 * @param {*} capacity 
 */
function generateTimestamp(capacity) {
    const endTime = Date.now() - TIME_PADDING;
    const list = [endTime];
    for (let i = 1; i < capacity; i++) {
        const during = random(ACTION_TIME_MIN, ACTION_TIME_MAX);
        i % PER_REST === 0
            ? list.unshift(list[0] - REST_TIME - during)
            : list.unshift(list[0] - during);
    }
    return list;
}

module.exports = { mockActionData };
