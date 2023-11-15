const mongoose = require('mongoose');
require('dotenv').config();
const connectionOptions = {
    useNewUrlParser : true,
    useUnifiedTopology:true,
    ssl : true,
}
mongoose.connect('mongodb+srv://jigneshsharma9868:lvoFFUzfNKVdG46H@cluster0.en7kcdw.mongodb.net/chats?retryWrites=true&w=majority').then(()=> {
    console.log('Connected to the db');
}).catch((error)=> {
    console.error('error in connecting to mongodb', error);
});




// const db = mongoose.connection;
// db.on('error', console.error.bind(console, 'error in connecting to the db'));
// db.once('open',()=> {
//     console.log("Successfully Connected to the DB");
// });
// module.exports = db;