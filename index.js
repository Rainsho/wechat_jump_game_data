const { config } = require('./config');
const { encrypt } = require('./util/cipher');
const { mockActionData } = require('./util/mockdata');

function mockReqData() {
    const { session_id, score, times } = config;
    const fast = 1;
    const mockData = mockActionData(score, times);
    console.log(mockData);
    const action_data = encrypt(JSON.stringify(mockData));
    const base_req = { session_id, fast };
    return { base_req, action_data };
}

const reqData = mockReqData();

console.log(JSON.stringify(reqData));
