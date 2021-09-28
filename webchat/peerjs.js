var fs = require('fs');
 var PeerServer = require('peer').PeerServer;
 


var options = {
  key: fs.readFileSync('key/server.key'),
  cert: fs.readFileSync('key/server.crt')
};

var server = PeerServer({
  port: 9000,
  // ssl: options,
  path:"/",
 proxied: true,
allow_discovery: true
});
console.log("Peerjs running at %s:%s", 'localhost', '9000'); 