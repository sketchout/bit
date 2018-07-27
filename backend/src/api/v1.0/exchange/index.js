const Router = require('koa-router');

const exchange = new Router();

exchange.get('/', (ctx) => {
    ctx.body('hi too');
})

module.exports = exchange;