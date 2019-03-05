const spicedPg = require("spiced-pg");
var bcrypt = require("bcryptjs");
const db = spicedPg(
    process.env.DATABASE_URL ||
        `postgres:postgres:anneanneanne@localhost:5432/socialnetwork`
);
exports.createuser = function(name, lastname, email, password) {
    return db
        .query(
            `INSERT INTO usersdata (name, lastname, email, password)
    VALUES ($1, $2, $3, $4)
    RETURNING *`,
            [name, lastname, email, password]
        )
        .catch(function(err) {
            console.log("error in db", err);
        });
};
exports.hashPassword = function(plainTextPassword) {
    return new Promise(function(resolve, reject) {
        bcrypt.genSalt(function(err, salt) {
            if (err) {
                return reject(err);
            }
            bcrypt.hash(plainTextPassword, salt, function(err, hash) {
                if (err) {
                    return reject(err);
                }
                resolve(hash);
            });
        });
    });
};
exports.getuser = email => {
    return db.query(
        `SELECT *
    FROM usersdata
    WHERE email = $1`,
        [email]
    );
};

exports.receiveall = userID => {
    return db.query(
        `
  SELECT usersdata.id, name, lastname, pictureurl, accepted
  FROM friendships
  JOIN usersdata
  ON (accepted = false AND receiverID = $1 AND senderID = usersdata.id)
  OR (accepted = true AND receiverID = $1 AND senderID = usersdata.id)
  OR (accepted = true AND senderID = $1 AND receiverID = usersdata.id)
`,
        [userID]
    );
};
//
exports.getuserbyid = id => {
    return db.query(
        `SELECT *
    FROM usersdata
    WHERE id = $1`,
        [id]
    );
};

exports.checkPassword = function(
    textEnteredInLoginForm,
    hashedPasswordFromDatabase
) {
    return new Promise(function(resolve, reject) {
        bcrypt.compare(
            textEnteredInLoginForm,
            hashedPasswordFromDatabase,
            function(err, doesMatch) {
                if (err) {
                    reject(err);
                } else {
                    resolve(doesMatch);
                }
            }
        );
    });
};

exports.insertphoto = function(fullurl, userID) {
    return db.query(
        `UPDATE usersdata
    SET pictureurl = $1
    WHERE id = $2
    RETURNING * `,
        [fullurl || null, userID || null]
    );
};

exports.insertrequest = function(receiverID, senderID) {
    return db.query(
        `INSERT INTO friendships (receiverID, senderID)
    VALUES ($1, $2)
    RETURNING *`,
        [receiverID, senderID]
    );
};
exports.insertmessage = function(message, userID) {
    return db.query(
        `INSERT INTO messages (message, userID)
    VALUES ($1, $2)
    RETURNING *`,
        [message, userID]
    );
};

exports.getmessages = function() {
    return db.query(
        `SELECT messages.id, name, lastname, pictureurl, message
     FROM usersdata
     LEFT JOIN messages
     ON usersdata.id = messages.userID
     ORDER BY messages.id DESC
     LIMIT 10
     `
    );
};
exports.getlastmessage = function(messageID) {
    return db.query(
        `SELECT messages.id, name, lastname, pictureurl, message
     FROM usersdata
     LEFT JOIN messages
     ON usersdata.id = messages.userID
     WHERE (messages.id = $1)
     `,
        [messageID]
    );
};

exports.checkrequest = function(receiverID, senderID) {
    return db
        .query(
            `SELECT * FROM friendships
WHERE (receiverID = $1 AND senderID = $2)
OR (receiverID = $2 AND senderID = $1)`,
            [receiverID, senderID]
        )
        .catch(function(err) {
            console.log("error in db", err);
        });
};

exports.cancelrequest = function(receiverID, senderID) {
    return db
        .query(
            `DELETE FROM friendships
WHERE (receiverID = $1 AND senderID = $2)
OR (receiverID = $2 AND senderID = $1)`,
            [receiverID, senderID]
        )
        .catch(function(err) {
            console.log("error in db", err);
        });
};

exports.acceptrequest = function(receiverID, senderID) {
    return db
        .query(
            `UPDATE friendships
            SET accepted = true
WHERE (receiverID = $1 AND senderID = $2)
OR (receiverID = $2 AND senderID = $1)`,
            [receiverID, senderID]
        )
        .catch(function(err) {
            console.log("error in db", err);
        });
};

exports.insertbio = function(bio, userID) {
    return db.query(
        `UPDATE usersdata
    SET bio = $1
    WHERE id = $2
    RETURNING * `,
        [bio || null, userID || null]
    );
};
exports.getUsersByIds = function getUsersByIds(arrayOfIds) {
    const query = `SELECT id,name, lastname, pictureurl FROM usersdata WHERE id = ANY($1)`;
    return db.query(query, [arrayOfIds]);
};

exports.searchuser = search => {
    return db.query(
        `SELECT *
    FROM usersdata
    WHERE name LIKE $1 OR lastname LIKE $1`,
        [search]
    );
};
