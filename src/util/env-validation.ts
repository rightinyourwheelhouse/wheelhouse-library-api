export function checkEnvVars(processEnv) {
    const {SLACK_CLIENT_ID, SLACK_CLIENT_SECRET, SLACK_CALLBACK_URL, SLACK_OAUTH_TOKEN} = processEnv;

    if (!SLACK_CLIENT_ID) {
        throw new Error("SLACK_CLIENT_ID not set!");
    }
    if (!SLACK_CLIENT_SECRET) {
        throw new Error("SLACK_CLIENT_SECRET not set!");
    }
    if (!SLACK_OAUTH_TOKEN) {
        throw new Error("SLACK_OAUTH_TOKEN not set!");
    }
    if (!SLACK_CALLBACK_URL) {
        throw new Error("SLACK_CALLBACK_URL not set!");
    }
}
