DROP TABLE IF EXISTS usersdata;
CREATE TABLE usersdata (
  id SERIAL PRIMARY KEY,
  name VARCHAR(200) NOT NULL,
  lastname VARCHAR(200) NOT NULL,
  email VARCHAR(100) UNIQUE,
  password VARCHAR(200) NOT NULL,
  pictureurl VARCHAR(300),
  bio VARCHAR(300)
);

SELECT * FROM usersdata;

DROP TABLE IF EXISTS friendships;
CREATE TABLE friendships (
  id SERIAL PRIMARY KEY,
  receiverID INTEGER NOT NULL,
  senderID INTEGER NOT NULL,
  accepted BOOLEAN DEFAULT false
);
SELECT * FROM friendships;

DROP TABLE IF EXISTS messages;
CREATE TABLE messages (
  id SERIAL PRIMARY KEY,
  userID INTEGER NOT NULL,
  message VARCHAR(500)
);
SELECT * FROM messages;
