const mongoose = require('mongoose');


const {
    MONGO_URI: mongoURI
} = process.env;

module.exports = (function() {
    return {
        connect() {
            mongoose.Promise = global.Promise;
            mongoose.connect(mongoURI,{
                useNewUrlParser: true
            }).then(
                () => {
                    console.log("Successfully connected to mongoDB");
                }
            ).catch( e => {
                console.error(e);
            });
        }
    };
})();

