export function checkEnvVars(processEnv) {
    const requiredVars = [
        "SLACK_CLIENT_ID",
        "SLACK_CLIENT_SECRET",
        "SLACK_CALLBACK_URL",
        "SLACK_OAUTH_TOKEN",
        "DATABASE_URL",
    ];

    requiredVars.forEach(envvar => {
        if (!processEnv[envvar]) {
            throw new Error(`${envvar} not set!`);
        } else {
            return;
        }
    });
}
