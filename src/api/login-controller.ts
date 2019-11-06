import * as core from "express-serve-static-core";
import request from "request-promise";
import {getUser, upsertUser} from "../models/user";

export function loginController(app: core.Express, pool) {
    // path to start the OAuth flow
    const {SLACK_CLIENT_ID, SLACK_CLIENT_SECRET} = process.env;
    app.get("/api/v1/auth/slack",
        async (req, res) => {
            const response = await request({
                uri: `https://slack.com/api/oauth.access?code=${req.query.code}&client_secret=${SLACK_CLIENT_SECRET}&client_id=${SLACK_CLIENT_ID}`,
                json: true,
            });
            if (response.ok) {
                const {id , image_1024: avatar, name: username} = response.user;
                await upsertUser(pool, {id, avatar, username});
                const user = await getUser(pool, id);
                res.send(user);
            } else {
                res.status(401).send(response);
            }
        });

}
