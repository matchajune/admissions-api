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
    reply(helpers.objectWithoutId(student));
  }
})

// get applicant by name
server.route({
  method: 'GET',
  path: '/applicants/{name}',
  handler: (request, reply) => {
    let queryName    = request.params.name;
    let applications = student[queryName];
    let studentInfo  = {
      name: queryName,
      applications: applications
    };
    applications ? reply(studentInfo) : reply(Boom.notFound('No applications exist for that name.'));
  }
})

// post applications
server.route({
  method: 'POST',
  path: '/applications',
  handler: (request, reply) => {
    Joi.validate(request.payload, Schema, (err, value) => {
      let params = request.payload;
      // check if a student has an application AND check if the student already submitted
      let applied = student[params.name] && student[params.name].findIndex(obj => obj.college === params.college) !== -1;
      // if payload doesn't equal schema
      if (err) {
        reply(Boom.badRequest('College, name, and score ALL required.'));
      }
      // else if student already applied
      else if (applied) {
        reply(Boom.badRequest('Application already submitted for this college/name pair.'));
      }
      // else student didn't apply and need to input to system
      else {
        student = helpers.add(student, params);
        college = helpers.add(college, params);

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
    reply(helpers.objectWithoutId(college));
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
    fs.writeFile(FileName, JSON.stringify(helpers.objectWithoutId(college)), (err) => {
      if (err) {
        reply(Boom.expectationFailed('Should have saved...but failed.'));
      } else {
        reply({
          statusCode: 200,
          message: 'Backup successful.'
        })
      }
    });
  }
})