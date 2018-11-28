DROP TABLE IF EXISTS usersdata;
CREATE TABLE usersdata (
  id SERIAL PRIMARY KEY,
  name VARCHAR(200) NOT NULL,
  lastname VARCHAR(200) NOT NULL,
  email VARCHAR(100) UNIQUE,
  password VARCHAR(200) NOT NULL
);
SELECT * FROM usersdata;

-- DROP TABLE IF EXISTS signatures;
-- CREATE TABLE signatures (
--   id SERIAL PRIMARY KEY,
--   userID INTEGER NOT NULL,
--   signature TEXT
-- );
-- SELECT * FROM signatures;
-- DROP TABLE IF EXISTS fullinfo;
-- CREATE TABLE fullinfo (
--   id SERIAL PRIMARY KEY,
--   userID INTEGER UNIQUE,
--   age INTEGER NOT NULL,
--   city VARCHAR(200) NOT NULL,
--   url TEXT
-- );
-- SELECT * FROM fullinfo;
