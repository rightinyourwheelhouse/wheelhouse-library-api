export function loginController(app, passport) {

    app.use(passport.initialize());

    // path to start the OAuth flow
    app.get("/auth/slack", passport.authorize("slack"));

    // OAuth callback url
    app.get("/auth/slack/callback",
        passport.authorize("slack", { failureRedirect: "/login" }),
        (req, res) => console.info("RES", res), //TODO: redirect.
    );
}
