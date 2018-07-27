
const mongoose = require('mongoose');
require('mongoose-double')(mongoose);

const { Schema } = mongoose;
const { Types } = Schema;

const ExchangeRate = new Schema({
    name: String ,
    last: Types.Double,
    lowestAsk: Types.Double,
    highestBid: Types.Double,
    percentChange: Types.Double, 
    baseVolumne:Types.Double,
    quoteVolume: Types.Double,
    isFrozen: Types.Double,
    high24hr: Types.Double,
    low24hr: Types.Double ,
    lastUpdated: {
        type: Date,
        default: new Date()
    }

});

ExchangeRate.index({name: 1}, {name: 'rateTypeIndentifier', unique: true});

// only for temporary use
ExchangeRate.statics.drop = function() {
    return this.remove({}).exec();
    // this.remove({}, function(err) {
    //     console.log('collection removed');
    // });
};

ExchangeRate.statics.updateTicker = function(name, data) {
    return this.findOneAndUpdate({name}, {data, lastUpdated: new Date()},{ insert:false, new:true}).exec();
};

/*
 { id: 198,
     last: '0.00148845',
     lowestAsk: '0.00149985',
     highestBid: '0.00148845',
     percentChange: '0.00517970',
     baseVolume: '0.77696869',
     quoteVolume: '532.99247476',
     isFrozen: '0',
     high24hr: '0.00155471',
     low24hr: '0.00143473' }
*/

module.exports = mongoose.model('ExchangeRate', ExchangeRate);