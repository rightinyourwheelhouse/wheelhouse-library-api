import chalk from "chalk";
import rp from "request-promise";

require('dotenv').config();

const BASE_URL = 'https://slack.com/api';
const headers = {
    'Authorization': `Bearer ${process.env.SLACK_OAUTH_TOKEN}`,
};

const options = {
    headers: headers,
    uri: `${BASE_URL}/users.list?token=${process.env.SLACK_OAUTH_TOKEN}`,
    json: true
};

export async function getUsers() {
    return rp(options)
        .then(user_list => user_list.members
            ? user_list.members.map(user => {
                return {
                    'id': user.id,
                    'username': user.name,
                    'avatar': user.profile.image_192
                }
            })
            : throw new Error(`Failed to get slack users because: ${user_list.error}`))
        .catch(err => {
            console.error(chalk.red.inverse(err.message));
            return [];
        });
}


