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
            if (request.url.startsWith('/connect')) {
               if (buffer!==null && buffer!=""){
                let postData = JSON.parse(buffer);
                if ((postData !== null)
                    || (postData.login !== null)) {
                  let selectQuery = "SELECT star001_id,star001_name FROM star001_user where star001_name ='" + postData.login + "' and star001_passwd = '" + postData.password +"'";
  	              var status=0;
  	              var tempUser ;
  		            var sqlQuery = mySqlClient.query(selectQuery);
  		            sqlQuery.on("result", function(row) {
  			               tempUser=row.star001_id;
  		                 status=1;
  		            });

  		            sqlQuery.on("end", function() {
                  let jsonResult="";
            			if(status){
            				jsonResult = '{"code":"1","status":"' + status + '","id":"' + tempUser + '"}';

            			}else{
            				jsonResult = '{"code":"1","status":"' + status + '"}';
            			}
                  response.writeHead(200, { 'Content-Type': 'application/json' });
                  response.end(jsonResult);
            		});

            		  sqlQuery.on("error", function(error) {
            		      console.log(error);
            			       let jsonResult ='{"code":"1","status":"-1"}';
                         response.writeHead(200, { 'Content-Type': 'application/json' });
                         response.end(jsonResult);
            		   });

              }
            }
            }
            else {
                response.writeHead(404);
                response.end();
            }
        });
    }
}).listen(15881);

console.log('Server running at http://127.0.0.1:15881/');
