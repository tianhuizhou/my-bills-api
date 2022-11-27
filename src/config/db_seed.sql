DROP TABLE IF EXISTS BankCredential;
DROP TABLE IF EXISTS UserAccount;

CREATE TABLE IF NOT EXISTS UserAccount (
   id serial PRIMARY KEY,
   username varchar (50) UNIQUE NOT NULL,
   password varchar (255) NOT NULL
);

CREATE TABLE IF NOT EXISTS BankCredential (
    id serial PRIMARY KEY,
    bank_name text NOT NULL,
    access_token text UNIQUE NOT NULL,
    created_at timestamp without time zone default (now() at time zone 'UTC'),

    user_id int NOT NULL,
    FOREIGN KEY (user_id) REFERENCES UserAccount(id) ON DELETE CASCADE ON UPDATE CASCADE
);
