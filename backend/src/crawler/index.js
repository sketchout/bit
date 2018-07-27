require('dotenv').config()

const poloniex = require('../lib/poloniex');
const db = require('../db');
const ExchangeRate = require('../db/models/ExchangeRate');
const socket = require('./socket');
const { parseJSON, polyfill } = require('../lib/common');

db.connect();
socket.connect();

const messageHandler = {
    1002: async (data) => {
        // console.log('rcv ticker!');
        // console.log("data]",data);

        if (!data) 
            return;

        const converted = poloniex.convertToTickerObject(data);

        // console.log("-----------\nconverted]",converted);

        // const { name, ...rest } = data;
        const { name } = converted;
        const rest = polyfill.objectWithoutProperties(converted, 'name');

        // console.log("polyfill]",name, rest);
        try {
            const updated = await ExchangeRate.updateTicker(name, rest);
            console.log(updated);
        } catch(e) {
            console.error(e);
        }
        
    }
}

socket.handlMessage = (message) => {
    // console.log(message);
    const parsed = parseJSON(message);
    if (!parsed) {
        return null;
    }
    // console.log(parsed);
    const [type, meta, data ] = parsed; /** assignment !!! */

    if ( messageHandler[type] ) {
        // console.log("messageHandler]", parsed);
        messageHandler[type](data);
    }
};

// poloniex.getTickers().then(
//     data => {
//         // console.log(data);
//     }
// );

async function registerInitialExchangeRate() 
{
    // removes all the data from the collection(Only for temprary use)
    await ExchangeRate.drop();
    console.log('dropped all collection');

    const tickers = await poloniex.getTickers();
    const keys = Object.keys(tickers);

    const promises = keys.map(
        key => {
            const ticker = tickers[key];

            const data = Object.assign({name: key}, ticker);
            const exchangeRate = new ExchangeRate(data);
            // return ticker;
            return exchangeRate.save();
        }
    );
    
    console.log(promises.length);

    try {
        await Promise.all(promises);
    } catch (e) {
        console.log(e);
    }
    

    // for ( let key in tickers ) {
    //     let exchangeRate = new ExchangeRate({
    //     });
    //     // console.log(key ,"-", tickers[key]);
    // }
    console.log('registerInitialExchangeRate succeed!');
}


registerInitialExchangeRate();

