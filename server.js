'use strict';
var mysql = require('mysql');

var mySqlClient = mysql.createConnection({
  host     : "localhost",
  user     : "shimstar",
  password : "shimstar",
  database : "shimstar"
});

require('http').createServer(function (request, response) {
    if (request.url === '/favicon.ico') {
        response.writeHead(204); // No content
        response.end();
    }
    else {
        let buffer = '';
        request.on('data', function (chunk) {
            buffer = buffer.concat(chunk.toString());
            if (buffer.length > 1e6) request.connection.destroy(); // Prevent buffer overflow attacks
        });
        request.on('end', function () {
            if (request.url === '/connect') {
                let postData = JSON.parse(buffer);
                let login = postData.login;
                let password = postData.login;

                    response.writeHead(200, { 'Content-Type': 'application/json' });
                    response.end(JSON.stringify(level1));

            }
            else {
                response.writeHead(404);
                response.end();
            }
        });
    }
}).listen(15881);

console.log('Server running at http://127.0.0.1:15881/');
