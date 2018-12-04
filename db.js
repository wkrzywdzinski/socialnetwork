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
    return db
        .query(
            `INSERT INTO friendships (receiverID, senderID)
    VALUES ($1, $2)
    RETURNING *`,
            [receiverID, senderID]
        )
        .catch(function(err) {
            console.log("error in db", err);
        });
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
// exports.getsignature = userID => {
//     return db.query(
//         `SELECT signature
//         FROM signatures
//         WHERE userID = $1`,
//         [userID]
//     );
// };
// exports.insertinfo = function(userID, age, city, url) {
//     return db.query(
//         `INSERT INTO fullinfo (userID, age, city, url)
//         VALUES ($1, $2, $3, $4)
//         RETURNING id`,
//         [userID || null, age || null, city || null, url || null]
//     );
// };
// exports.updatefullinfo = function(age, city, url, userID) {
//     return db.query(
//         `INSERT INTO fullinfo (age, city, url, userID)
//        VALUES ($1, $2, $3, $4)
//        ON CONFLICT (userID)
//        DO UPDATE SET age = $1, city = $2, url = $3`,
//         [age || null, city || null, url || null, userID || null]
//     );
// };
// exports.deletesignature = userID => {
//     return db.query(
//         `DELETE FROM signatures
//         WHERE userID = $1`,
//         [userID]
//     );
// };
// exports.getsigners = function() {
//     return db.query(
//         `SELECT name, lastname, age, city, url
//        FROM signatures
//        LEFT JOIN usersdata
//        ON usersdata.id = signatures.userID
//        LEFT JOIN fullinfo
//        ON fullinfo.userID = signatures.userID`
//     );
// };
// exports.getcity = function(city) {
//     return db.query(
//         `SELECT name, lastname, age, city, url
//        FROM signatures
//        LEFT JOIN usersdata
//        ON usersdata.id = signatures.userID
//        LEFT JOIN fullinfo
//        ON fullinfo.userID = signatures.userID
//        WHERE LOWER(city) = LOWER($1)`,
//         [city]
//     );
// };
// exports.editinfo = function(userID) {
//     return db.query(
//         `SELECT name, lastname, age, city, url, email
//        FROM signatures
//        LEFT JOIN usersdata
//        ON usersdata.id = signatures.userID
//        LEFT JOIN fullinfo
//        ON fullinfo.userID = signatures.userID
//        WHERE signatures.userID = $1`,
//         [userID]
//     );
// };
// exports.checksignature = id => {
//     return db.query(
//         `SELECT *
//         FROM signatures
//         WHERE userID = $1`,
//         [id]
//     );
// };
//
