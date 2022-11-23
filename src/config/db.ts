// db.js

const sql = require('postgres')({
  host: process.env.DATABASE_HOST, // Postgres ip address[s] or domain name[s]
  port: 5432, // Postgres server port[s]
  database: process.env.DATABASE_NAME, // Name of database to connect to
  username: process.env.DATABASE_USERNAME, // Username of database user
  password: process.env.DATABASE_PASSWORD, // Password of database user
}) // will use psql environment variables

module.exports = sql
