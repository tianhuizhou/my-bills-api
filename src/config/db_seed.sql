DROP TABLE IF EXISTS Users_Tokens;
DROP TABLE IF EXISTS UserAccount;
DROP TABLE IF EXISTS AccessToken;

CREATE TABLE IF NOT EXISTS UserAccount (
   id serial PRIMARY KEY,
   username varchar (50) UNIQUE NOT NULL,
   password varchar (255) NOT NULL
);

CREATE TABLE IF NOT EXISTS AccessToken (
    id serial PRIMARY KEY,
    bank_name text NOT NULL,
    token text UNIQUE NOT NULL,
    created_at timestamp without time zone NOT NULL
);

CREATE TABLE IF NOT EXISTS Users_Tokens (
    user_id int NOT NULL,
    token_id int NOT NULL,
    PRIMARY KEY (user_id, token_id),
    FOREIGN KEY (user_id) REFERENCES UserAccount(id) ON DELETE CASCADE ON UPDATE CASCADE,
    FOREIGN KEY (token_id) REFERENCES AccessToken(id) ON DELETE CASCADE ON UPDATE CASCADE
)