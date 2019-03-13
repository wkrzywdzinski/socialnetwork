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
    secret: `a very special secret.`,
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

//file upload
var multer = require("multer");
var uidSafe = require("uid-safe");
var path = require("path");

var diskStorage = multer.diskStorage({
    destination: function(req, file, callback) {
        callback(null, __dirname + "/uploads");
    },
    filename: function(req, file, callback) {
        uidSafe(24).then(function(uid) {
            callback(null, uid + path.extname(file.originalname));
        });
    }
});
var uploader = multer({
    storage: diskStorage,
    limits: {
        fileSize: 2097152
    }
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

///////////////////////////ROUTES/////////////////////////////

app.get("/welcome", function(req, res) {
    if (req.session.id) {
        res.redirect("/");
    } else {
        res.sendFile(__dirname + "/index.html");
    }
});

//REGISTRATION: hashes password, saves users data in db, creates cookie
app.post("/registration", (req, res) => {
    db.hashPassword(req.body.password)
        .then(function(password) {
            return db.createUser(
                req.body.firstname,
                req.body.lastname,
                req.body.email,
                password
            );
        })
        .then(function(results) {
            req.session.id = results.rows[0].id;
            res.json({
                success: true
            });
        })
        .catch(function(err) {
            console.log(err);
            res.json({
                success: false
            });
        });
});

//LOGIN: decrypts password, if email and password are correct creates cookie and redirects
app.post("/login", function(req, res) {
    db.getUser(req.body.email)
        .then(function(results) {
            db.checkPassword(req.body.password, results.rows[0].password).then(
                function(check) {
                    if (check) {
                        req.session.id = results.rows[0].id;
                        res.json({
                            success: true
                        });
                    }
                }
            );
        })
        .catch(function(err) {
            console.log(err);
            res.json({
                success: false
            });
        });
});

app.get("/logout", function(req, res) {
    req.session = null;
    res.redirect("/welcome");
});

// gets info about the user
app.get("/user", function(req, res) {
    db.getUserById(req.session.id)
        .then(function(results) {
            res.json(results.rows);
        })
        .catch(function(err) {
            console.log(err);
            res.json({
                success: false
            });
        });
});

// updates users bio section
app.post("/bio-update", function(req, res) {
    if (req.body.bio) {
        db.insertBio(req.body.bio, req.session.id).then(function(results) {
            res.json(results.rows);
        });
    } else {
        res.json({
            success: false
        });
    }
});

// gets info for a profile of other user
app.get("/other-user", function(req, res) {
    if (req.query.otherid == req.session.id) {
        res.json({
            sameprofile: true
        });
    } else {
        db.getUserById(req.query.otherid)
            .then(function(results) {
                if (results) {
                    res.json(results.rows);
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

// search for users by first and last name
app.get("/search-user", function(req, res) {
    db.searchUser(req.query.search + "%")
        .then(function(results) {
            if (results.rows.length === 0) {
                console.log("noresults");
            } else {
                res.json({
                    searchResults: results.rows
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

///////////FRIENDS ROUTES//////////

//get list of friends and "wannabe-friends"
app.get("/receive-all", function(req, res) {
    db.receiveAll(req.session.id)
        .then(function(results) {
            if (results) {
                res.json(results.rows);
            }
        })
        .catch(function(err) {
            console.log(err);
            res.json({
                success: false
            });
        });
});

app.post("/request", function(req, res) {
    db.insertRequest(req.body.receiverid, req.session.id)
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

app.get("/check-request", function(req, res) {
    db.checkRequest(req.query.receiverid, req.session.id)
        .then(function(results) {
            if (results) {
                res.json(results.rows);
            }
        })
        .catch(function(err) {
            console.log(err);
            res.json({
                success: false
            });
        });
});

app.post("/accept-request", function(req, res) {
    db.acceptRequest(req.body.receiverid, req.session.id)
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

app.post("/cancel-request", function(req, res) {
    db.cancelRequest(req.body.receiverid, req.session.id)
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

// picture upload
app.post("/upload", uploader.single("file"), s3.upload, function(req, res) {
    let fullurl = config.s3Url + req.file.filename;
    if (req.file) {
        db.insertPhoto(fullurl, req.session.id).then(function(results) {
            res.json(results.rows);
        });
    } else {
        res.json({
            success: false
        });
    }
});

// route for all undefined paths
app.get("*", function(req, res) {
    if (!req.session.id) {
        res.redirect("/welcome");
    } else {
        res.sendFile(__dirname + "/index.html");
    }
});

///////////////////////SOCKET.IO///////////////////

server.listen(process.env.PORT || 8080, function() {
    console.log("I'm listening.");
});
let onlineUsers = {};

io.on("connection", socket => {
    let userID = socket.request.session.id;
    let socketID = socket.id;

    onlineUsers[socketID] = userID;
    let arrayID = Object.values(onlineUsers);

    //gets list of users online
    db.getUsersByIds(arrayID).then(function(results) {
        socket.emit("onlineUsers", results.rows);
    });

    //listens for new online users
    if (arrayID.filter(obj => obj == userID).length == 1) {
        db.getUserById(userID).then(function(results) {
            socket.broadcast.emit("userJoined", results.rows);
        });
    }

    //gets last 10 messages
    db.getMessages().then(function(results) {
        socket.emit("getMessages", results.rows.reverse());
    });

    //listens for new messages
    socket.on("chatMessage", function(data) {
        db.insertMessage(data, socket.request.session.id)
            .then(function(results) {
                db.getLastMessage(results.rows[0].id).then(function(
                    resultstwo
                ) {
                    io.emit("newMessage", resultstwo.rows);
                });
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
