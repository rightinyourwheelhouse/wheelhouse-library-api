import * as core from "express-serve-static-core";
import request from "request-promise";
import {getUser, upsertUser} from "../models/user";

export function loginController(app: core.Express, pool) {
    // path to start the OAuth flow
    const {SLACK_CLIENT_ID, SLACK_CLIENT_SECRET, SLACK_CALLBACK_URL} = process.env;
    app.get("/api/v1/auth/slack",
        async (req, res) => {
            const queryParams = Object.entries({
                code: req.query.code,
                client_secret: SLACK_CLIENT_SECRET,
                client_id: SLACK_CLIENT_ID,
                redirect_uri: SLACK_CALLBACK_URL,
            }).map(([key, value]) => `${key}=${value}`);
            const response = await request({
                uri: `https://slack.com/api/oauth.access?${queryParams.join("&")}`,
                json: true,
            });
            if (response.ok) {
                const { access_token, user} = response;
                const {id, image_1024: avatar, name: username} = user;
                await upsertUser(pool, {id, avatar, username});
                const dbUser = await getUser(pool, id);
                res.send(Object.assign(dbUser, {access_token}));
            } else {
                res.status(401).send(response);
            }
        });

}