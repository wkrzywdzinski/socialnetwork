const express = require("express");
const app = express();
const server = require("http").Server(app);
const io = require("socket.io")(server, { origins: "localhost:8080" });
const compression = require("compression");
const bodyParser = require("body-parser");
var cookieSession = require("cookie-session");
const csurf = require("csurf");
const db = require("./db");
const s3 = require("./s3");
const config = require("./config.json");
app.use(express.static("./public"));
app.use(compression());
app.use(bodyParser.json());
const cookieSessionMiddleware = cookieSession({
    secret: `I'm always angry.`,
    maxAge: 1000 * 60 * 60 * 24 * 90
});
app.use(cookieSessionMiddleware);
io.use(function(socket, next) {
    cookieSessionMiddleware(socket.request, socket.request.res, next);
});
app.use(csurf());
app.use(function(req, res, next) {
    res.cookie("mytoken", req.csrfToken());
    next();
});
///////////////////upload file///////////////////
var multer = require("multer");
var uidSafe = require("uid-safe");
var path = require("path");

var diskStorage = multer.diskStorage({
    destination: function(req, file, callback) {
        callback(null, __dirname + "/uploads");
    },
    filename: function(req, file, callback) {
        //codes the file name to have unique///////
        uidSafe(24).then(function(uid) {
            callback(null, uid + path.extname(file.originalname));
        });
    }
});
//sets limit/////////
var uploader = multer({
    storage: diskStorage,
    limits: {
        fileSize: 2097152
    }
});
//////////////////////get////////////////////////

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

app.get("/welcome", function(req, res) {
    if (req.session.id) {
        res.redirect("/");
    } else {
        res.sendFile(__dirname + "/index.html");
    }
});

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

app.post("/upload", uploader.single("file"), s3.upload, function(req, res) {
    let fullurl = config.s3Url + req.file.filename;
    if (req.file) {
        db.insertphoto(fullurl, req.session.id).then(function(results) {
            console.log(results.rows);
            res.json(results.rows);
        });
    } else {
        res.json({
            success: false
        });
    }
});
app.post("/request", function(req, res) {
    db.insertrequest(req.body.receiverid, req.session.id)
        .then(function() {
            res.json({
                requestsent: true
            });
        })
        .catch(function(err) {
            console.log(err);
            res.json({
                requestsent: false
            });
        });
});
app.post("/cancelrequest", function(req, res) {
    console.log("cancelrequest");
    db.cancelrequest(req.body.receiverid, req.session.id)
        .then(function() {
            res.json({
                reqdeleted: true
            });
        })
        .catch(function(err) {
            console.log(err);
            res.json({
                reqdeleted: false
            });
        });
});

app.post("/acceptrequest", function(req, res) {
    console.log("acceptrequest");
    db.acceptrequest(req.body.receiverid, req.session.id)
        .then(function() {
            res.json({
                reqaccepted: true
            });
        })
        .catch(function(err) {
            console.log(err);
            res.json({
                reqaccepted: false
            });
        });
});

app.post("/bioupdate", function(req, res) {
    if (req.body.bio) {
        db.insertbio(req.body.bio, req.session.id).then(function(results) {
            console.log(results.rows);
            res.json(results.rows);
        });
    } else {
        res.json({
            success: false
        });
    }
});

app.get("/user", function(req, res) {
    db.getuserbyid(req.session.id)
        .then(function(results) {
            if (results) {
                res.json(results.rows);
            } else {
                res.json({
                    success: false
                });
            }
        })
        .catch(function(err) {
            console.log(err);
            res.json({
                success: false
            });
        });
});
app.get("/checkrequest", function(req, res) {
    db.checkrequest(req.query.receiverid, req.session.id)
        .then(function(results) {
            if (results) {
                res.json(results.rows);
            } else {
                res.json({
                    success: false
                });
            }
        })
        .catch(function(err) {
            console.log(err);
            res.json({
                success: false
            });
        });
});

app.get("/receiveall", function(req, res) {
    console.log("receiveall");
    db.receiveall(req.session.id)
        .then(function(results) {
            if (results) {
                res.json(results.rows);
            } else {
                res.json({
                    success: false
                });
            }
        })
        .catch(function(err) {
            console.log(err);
            res.json({
                success: false
            });
        });
});

app.get("/other-user", function(req, res) {
    if (req.query.otherid == req.session.id) {
        res.json({
            sameprofile: true
        });
    } else {
        db.getuserbyid(req.query.otherid)
            .then(function(results) {
                if (results) {
                    res.json(results.rows);
                } else {
                    res.json({
                        success: false
                    });
                }
            })
            .catch(function(err) {
                console.log(err);
                res.json({
                    success: false
                });
            });
    }
});

app.get("/logout", function(req, res) {
    req.session = null;
    res.redirect("/welcome");
});

app.get("*", function(req, res) {
    if (!req.session.id) {
        res.redirect("/welcome");
    } else {
        res.sendFile(__dirname + "/index.html");
    }
});

server.listen(8080, function() {
    console.log("I'm listening.");
});
let onlineUsers = {};
io.on("connection", socket => {
    let userID = socket.request.session.id;
    let socketID = socket.id;
    onlineUsers[socketID] = userID;
    let arrayID = Object.values(onlineUsers);
    db.getUsersByIds(arrayID).then(function(results) {
        socket.emit("onlineUsers", results.rows);
    });
    db.getmessages().then(function(results) {
        socket.emit("getMessages", results.rows);
    });
    if (arrayID.filter(obj => obj == userID).length == 1) {
        db.getuserbyid(userID).then(function(results) {
            socket.broadcast.emit("userJoined", results.rows);
        });
    }
    socket.on("chatmessage", function(data) {
        db.insertmessage(data, socket.request.session.id)
            .then(function(results) {
                io.emit("newMessage", results.rows);
            })
            .catch(function(err) {
                console.log(err);
            });
    });
    socket.on("disconnect", function() {
        if (arrayID.filter(obj => obj == userID).length == 1) {
            io.sockets.emit("userLeave", userID);
        }
        if (arrayID.filter(obj => obj == userID).length > 0) {
            delete onlineUsers[socketID];
        }
    });
});
