const https = require('https');
const fs = require('fs');

const options = {
    key: fs.readFileSync('key.pem'),
    cert: fs.readFileSync('cert.pem')
};

server = https.createServer(options, function (req, res) {
    res.writeHead(200);
    res.end("hello world\n");
})

server.listen(8000, "0.0.0.0")