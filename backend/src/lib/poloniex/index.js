const currencyPairMap = require('./currencyPairMap');
const axios = require('axios');

function getCurrencyPairName(currencyPairId) {
    return currencyPairMap[currencyPairId.toString()];
};

function getTickers() {
    return axios.get('https://poloniex.com/public?command=returnTicker').then(
        response => response.data
    );
};

function convertToTickerObject(data) {
    // console.log("convertToTickerObject]",data);
    const keys = [
        'id',
        'last',
        'lowestAsk',
        'highestBid',
        'percentChange',
        'baseVolume',
        'quoteVolume',
        'isFrozen',
        'high24hr',
        'low24hr'
    ];

    const object = {};

    data.forEach( (value, i) => {

        // console.log('value]', value);
        // sets the name value
        if ( i === 0) {
            object.name = getCurrencyPairName(value);
            return;
        }
        const key = keys[i];
        // console.log("key]",key);
        object[key] = value;
    });
    return object;
}

module.exports = ( function() {
    return {
        getCurrencyPairName,
        getTickers,
        convertToTickerObject
    };
})();