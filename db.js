const spicedPg = require("spiced-pg");
var bcrypt = require("bcryptjs");
const db = spicedPg(
    process.env.DATABASE_URL ||
        `postgres:postgres:anneanneanne@localhost:5432/socialnetwork`
);

exports.createUser = function(name, lastname, email, password) {
    return db.query(
        `INSERT INTO usersdata (name, lastname, email, password)
    VALUES ($1, $2, $3, $4)
    RETURNING *`,
        [name, lastname, email, password]
    );
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

exports.insertPhoto = function(fullurl, userID) {
    return db.query(
        `UPDATE usersdata
    SET pictureurl = $1
    WHERE id = $2
    RETURNING * `,
        [fullurl || null, userID || null]
    );
};

exports.insertBio = function(bio, userID) {
    return db.query(
        `UPDATE usersdata
    SET bio = $1
    WHERE id = $2
    RETURNING * `,
        [bio || null, userID || null]
    );
};

exports.getUser = email => {
    return db.query(
        `SELECT *
    FROM usersdata
    WHERE email = $1`,
        [email]
    );
};

exports.getUserById = id => {
    return db.query(
        `SELECT *
    FROM usersdata
    WHERE id = $1`,
        [id]
    );
};

exports.getUsersByIds = function getUsersByIds(arrayOfIds) {
    const query = `SELECT id,name, lastname, pictureurl FROM usersdata WHERE id = ANY($1)`;
    return db.query(query, [arrayOfIds]);
};

exports.searchUser = search => {
    return db.query(
        `SELECT *
    FROM usersdata
    WHERE name LIKE $1 OR lastname LIKE $1`,
        [search]
    );
};

exports.getMessages = function() {
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
exports.getLastMessage = function(messageID) {
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

exports.insertMessage = function(message, userID) {
    return db.query(
        `INSERT INTO messages (message, userID)
    VALUES ($1, $2)
    RETURNING *`,
        [message, userID]
    );
};

exports.receiveAll = userID => {
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

exports.insertRequest = function(receiverID, senderID) {
    return db.query(
        `INSERT INTO friendships (receiverID, senderID)
    VALUES ($1, $2)
    RETURNING *`,
        [receiverID, senderID]
    );
};

exports.checkRequest = function(receiverID, senderID) {
    return db.query(
        `SELECT * FROM friendships
WHERE (receiverID = $1 AND senderID = $2)
OR (receiverID = $2 AND senderID = $1)`,
        [receiverID, senderID]
    );
};

exports.acceptRequest = function(receiverID, senderID) {
    return db.query(
        `UPDATE friendships
            SET accepted = true
WHERE (receiverID = $1 AND senderID = $2)
OR (receiverID = $2 AND senderID = $1)`,
        [receiverID, senderID]
    );
};

exports.cancelRequest = function(receiverID, senderID) {
    return db.query(
        `DELETE FROM friendships
WHERE (receiverID = $1 AND senderID = $2)
OR (receiverID = $2 AND senderID = $1)`,
        [receiverID, senderID]
    );
};
