import * as core from "express-serve-static-core";
import request from "request-promise";
import {upsertUser} from "../models/user";
import {log} from "../util/debug-logger";

export function loginController(app: core.Express, pool) {
    // path to start the OAuth flow
    const {SLACK_CLIENT_ID, SLACK_CLIENT_SECRET} = process.env;
    app.get("/api/v1/auth/slack",
        async (req, res) => {
            const profile = await request({
                uri: `https://slack.com/api/oauth.access?code=${req.query.code}&client_secret=${SLACK_CLIENT_SECRET}&client_id=${SLACK_CLIENT_ID}`,
                json: true,
            });
            if (profile.ok) {
                await upsertUser(pool, {
                    id: profile.user.id,
                    avatar: profile.user.image_1024,
                    username: profile.user.name,
                });
            }
            res.send(profile);
        });

}
