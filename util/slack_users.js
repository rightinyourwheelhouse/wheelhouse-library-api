const rp = require('request-promise');
require('dotenv').config();

const BASE_URL = 'https://slack.com/api';
const headers = {
    'Authorization': `Bearer ${process.env.SLACK_OAUTH_TOKEN}`,
};

const options = {
    headers: headers,
    uri: `${BASE_URL}/users.list?token=${process.env.SLACK_OAUTH_TOKEN}`
};


async function getUsers() {
    return rp(options).then(user_list => user_list).catch(err => err);
}

module.exports = {getUsers};