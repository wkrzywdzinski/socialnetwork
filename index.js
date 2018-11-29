const express = require("express");
const app = express();
const compression = require("compression");
const bodyParser = require("body-parser");
var cookieSession = require("cookie-session");
const csurf = require("csurf");
const db = require("./db");
app.use(express.static("./public"));
app.use(compression());
app.use(bodyParser.json());
app.use(
    cookieSession({
        secret: `you dont wanna know.`,
        maxAge: 1000 * 60 * 60 * 24 * 14
    })
);
app.use(csurf());
app.use(function(req, res, next) {
    res.cookie("mytoken", req.csrfToken());
    next();
});

if (process.env.NODE_ENV != "production") {
    app.use(
        "/bundle.js",
        require("http-proxy-middleware")({
            target: "http://localhost:8081/"
        })
    );
} else {
    app.use("/bundle.js", (req, res) => res.sendFile(`${__dirname}/bundle.js`));
}
app.post("/registration", (req, res) => {
    db.hashPassword(req.body.password)
        .then(function(password) {
            db.createuser(
                req.body.firstname,
                req.body.lastname,
                req.body.email,
                password
            ).then(function(results) {
                if (results) {
                    req.session.id = results.rows[0].id;
                    res.json({
                        success: true
                    });
                } else {
                    res.json({
                        success: false
                    });
                }
            });
        })
        .catch(function(err) {
            console.log(err);
            res.json({
                success: false
            });
        });
});

app.post("/login", function(req, res) {
    db.getuser(req.body.email)
        .then(function(results) {
            return db
                .checkPassword(req.body.password, results.rows[0].password)
                .then(function(check) {
                    if (check) {
                        req.session.id = results.rows[0].id;
                        res.json({
                            success: true
                        });
                    } else {
                        res.json({
                            success: false
                        });
                    }
                });
        })
        .catch(function(err) {
            console.log(err);
            res.json({
                success: false
            });
        });
});

app.get("*", function(req, res) {
    res.sendFile(__dirname + "/index.html");
});

app.listen(8080, function() {
    console.log("I'm listening.");
});
