// const W3CWebSocket = require('websocket').W3CWebSocket;
// module.exports = ( function () {
// })();

const WebSocket = require('ws');

module.exports = (function() {
    let _client = null;
    let _messageHandler = (message) => { console.warn('_messageHandler not defined'); }

    const handler = {
        open: () => {
            console.log('connected to server');
            subscribe();
        },
        message: (message) => {
            _messageHandler(message);
            // console.log('received: %s', message);
        },
        error: () => {
            console.log('!!! failed to connect')
        }
    }

    const connect = () => {
        _client = new WebSocket('wss://api2.poloniex.com');
        _client.on('open', handler.open);
        _client.on('message', handler.message);
        _client.on('close', reconnect);
        _client.on('error', handler.error);
    }

    const subscribe = () => {
        // subscribe ticker
        const ticker = {
            "command": "subscribe",
            "channel": 1002
        }
        _client.send( JSON.stringify(ticker) );
    }

    const reconnect = () => {
        console.log('!!! reconnecting...');
        setTimeout(connect, 100);
    }

    return {
        set handlMessage(messageHandler) {
            _messageHandler = messageHandler;
        },
        connect,
        subscribe,
        get getClient() {
            return _client;
        }
    }
})();


// const WebSocketClient = require('websocket').client;

// const client = new WebSocketClient();

// function connect() {
//     client.connect('wss://api2.poloniex.com');
// }

// // https://github.com/theturtle32/WebSocket-Node

// client.on('connectFailed', (error) => {
//     console.log('---Connect Error: ' + error.toString() );
// });

// const subscribe = {
//     "command": "subscribe",
//     "channel": 1002
// }
// // console.log(JSON.stringify(subscribe));

// client.on('connect', (connection) => {

//     console.log('---WebSocket Client Connected');


//     connection.send(JSON.stringify(subscribe));

//     connection.on('error', (connection) => {
//         console.log('---Connection Error:' + error.toString() );
//     });

//     connection.on('close', () => {
//         console.log('---Connection Closed');
//     });

//     connection.on('message', (message) => {
//         if ( message.type === 'utf8') {
//             console.log("---Received:" + message.utf8Data );
//         }
//     });
// });

// connect();