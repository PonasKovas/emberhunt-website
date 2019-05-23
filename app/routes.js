const net = require('net');

function sendCommand(command, res) {
    const tcpport = process.env.TCPPORT || 11234
    const host = process.env.HOST || '134.209.123.181'

    // Create a new TCP client.
    const client = new net.Socket();
    // Send a connection request to the server.
    client.connect({ port: tcpport, host: host }, function() {
        // If there is no error, the server has accepted the request and created a new 
        // socket dedicated to us.

        // The client can now send data to the server by writing to its socket.

        // For now I just include the password 
        // but this will be guarded behind some authentication in the future
        client.write('emberhunt\n');
        client.write(command);
        var bufferSize = 0;
        client.on('data', function(chunk) {
            if (bufferSize == 0) {
                // The first response back is the size of the incoming buffer
                bufferSize = chunk.readUInt32LE(0);
            } 
            else {
                console.log(`${chunk.toString()}`);
                res.status(200).send(`${chunk.toString()}`);
                client.end();
            }
        });
    });

}

module.exports = function (app) {

    app.get('/api/fps', function (req, res ) {
        sendCommand('fps\n', res);
    });

    app.get('/api/help', function (req, res ) {
        sendCommand('help\n', res);
    });

    // application -------------------------------------------------------------
    app.get('*', function (req, res) {
        res.sendFile(__dirname + '/public/index.html'); // load the single view file (angular will handle the page changes on the front-end)
    });
};
