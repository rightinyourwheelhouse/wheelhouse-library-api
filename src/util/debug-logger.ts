export function log(message) {
    if (process.env.DEBUG) {
        console.debug(`${new Date().toISOString()}: ${message}`);
    }
}
