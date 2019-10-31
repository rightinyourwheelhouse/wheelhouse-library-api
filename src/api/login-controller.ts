export function loginController(app, passport) {

    app.use(passport.initialize());

    // path to start the OAuth flow
    app.get("/api/v1/auth/slack", passport.authorize("slack"));

    // OAuth callback url
    app.get("/api/v1/auth/slack/callback",
        passport.authenticate("slack", { failureRedirect: "/login" }), // TODO: add failureRedirects
        (req, res) => {
            console.info(req.session);
            console.info("user: ", req.user);
            res.redirect("/overview");
        }, // TODO: redirect in env + use right url
    );
}
