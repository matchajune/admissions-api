'use strict';

const Hapi    = require('hapi');
const Joi     = require('joi');
const Boom    = require('boom');
const Schema  = require('./schema.js');
const FileName = process.argv[2] || 'backup.json';

var student = {id: 'student'};
var college = {id: 'college'};
var fs        = require('fs');
var helpers   = require('./helpers.js');

// start server
const server = new Hapi.Server();
server.connection({
  host: 'localhost',
  port: process.argv[3] || 3210
});

server.start(err => {
  if (err) {
    throw err;
  }
  console.log(`Server running at: ${server.info.uri}`);
});

// get applicants
server.route({
  method: 'GET',
  path: '/applicants',
  handler: (request, reply) => {
    reply(student);
  }
})

// get applicant by name
server.route({
  method: 'GET',
  path: '/applicants/{name}',
  handler: (request, reply) => {
    let queryName   = request.params.name;
    let studentInfo = student[queryName];
    studentInfo ? reply(studentInfo) : reply(Boom.notFound('No applicants exist for that name.'));
  }
})

// post applications
server.route({
  method: 'POST',
  path: '/applications',
  handler: (request, reply) => {
    Joi.validate(request.payload, Schema, (err, value) => {
      let params = request.payload;
      let applied = student[params.name] && student[params.name].findIndex(obj => obj.college === params.college) !== -1;
      if (err) {
        reply(Boom.badRequest('College, name, and score ALL required.'));
      }
      else if (applied) {
        reply(Boom.badRequest('Application already submitted for this college/name pair.'));
      }
      else {
        student = helpers.addSort(student, params);
        college = helpers.addSort(college, params);
        console.log(student)
        reply({
          statusCode: 200,
          message: 'Application submitted successfully.'
        })
      }
    });
  }
})

// get colleges
server.route({
  method: 'GET',
  path: '/colleges',
  handler: (request, reply) => {
    reply(college);
  }
})

// get college by name
server.route({
  method: 'GET',
  path: '/colleges/{name}',
  handler: (request, reply) => {
    let name = college[request.params.name];
    if (!name) {
      reply(Boom.notFound('No applications exist for that college.'));
    } else {
      reply({
        college: request.params.name,
        applications: name
      });
    }
  }
})

// post backup
server.route({
  method: 'POST',
  path: '/backup',
  handler: (request, reply) => {
    let objectCopy = Object.assign({}, college);
    delete objectCopy.id;
    fs.writeFile(FileName, JSON.stringify(objectCopy), err => {
      if (err) {
        reply(Boom.expectationFailed('Should have saved...but something happened.'));
      } else {
        reply({
          statusCode: 200,
          message: 'Backup successful.'
        })
      }
    });
  }
})