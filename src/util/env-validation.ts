export function checkEnvVars(processEnv) {
    const {CLIENT_ID, CLIENT_SECRET, BASE_URL, SLACK_OAUTH_TOKEN} = processEnv;

    if (!CLIENT_ID) {
        throw new Error("Slack CLIENT_ID not set!");
    }
    if (!CLIENT_SECRET) {
        throw new Error("Slack CLIENT_SECRET not set!");
    }
    if (!SLACK_OAUTH_TOKEN) {
        throw new Error("SLACK_OAUTH_TOKEN not set!");
    }
    if (!BASE_URL) {
        throw new Error("BASE_URL not set!");
    }
}
