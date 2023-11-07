const mongoose = require('mongoose');
require('dotenv').config();
mongoose.connect(process.env.MONGO_DB_URI);

const db = mongoose.connection;
db.on('error', console.error.bind(console, 'error in connecting to the db'));
db.once('open',()=> {
    console.log("Successfully Connected to the DB");
});
module.exports = db;