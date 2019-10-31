import chalk from "chalk";
import rp from "request-promise";

const BASE_URL = "https://slack.com/api";
const headers = {
    Authorization: `Bearer ${process.env.SLACK_OAUTH_TOKEN}`,
};

const options = {
    headers,
    uri: `${BASE_URL}/users.list?token=${process.env.SLACK_OAUTH_TOKEN}`,
    json: true,
};

function logError(err, defaultVal) {
    console.error(chalk.red.inverse(err.message));
    return defaultVal;
}

export async function getUsers() {
    return rp(options)
        .then(userList => userList.members
            ? userList.members.map(user => {
                return {
                    id: user.id,
                    username: user.name,
                    avatar: user.profile.image_192,
                };
            })
            : logError(new Error(`Failed to get slack users because: ${userList.error}`), []));
}
