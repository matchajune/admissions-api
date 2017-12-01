'use strict';

const Hapi    = require('hapi');
var routes    = require('./routes.js');

// create server
const server = new Hapi.Server();
server.connection({
  host: 'localhost',
  port: process.argv[3] || 3210
});

// start server
server.start(err => {
  if (err) {
    throw err;
  }
  console.log(`Server running at: ${server.info.uri}`);
});

// set routes
server.route(routes);