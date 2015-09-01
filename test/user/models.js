'use strict';

var utils = require('../utils');
var should = require('should');
var User = require('../../app/models/user');

describe('User: model', function () {

    describe('#create()', function () {
      it('should create a new User', function (done) {
       
          var u = {
              name: {
                  first: 'nombre',
                  last:  'apellido'
              },
              email: 'email@renoboy.com',
              password: 'secret'
          };

          User.create(u, function (err, createdUser) {
             should.not.exist(err);

             createdUser.name.first.should.equal('nombre');
             createdUser.name.last.should.equal('apellido');
             createdUser.email.should.equal('email@renoboy.com');

             done();
         });
      });
    });

    describe('#hashPassword()', function () {
      it('should return a hashed password asynchronously', function (done) {

         var password = 'secret';

          User.hashPassword(password, function (err, passwordHash) {
            should.not.exist(err);
            should.exist(passwordHash);
            done();
          });
      });
    });

    describe('#authenticate()', function () {
      it('should return the user if password is valid', function (done) {

        var u = {
              name: {
                  first: 'nombre',
                  last:  'apellido'
              },
              email: 'email@renoboy.com',
              password: 'secret'
        };

        User.create(u, function (err, createdUser) {
          
          User.authenticate('email@renoboy.com','secret', function (err, theuser) {
              should.not.exist(err);

              theuser.name.first.should.equal('nombre');
              theuser.name.last.should.equal('apellido');
              theuser.email.should.equal('email@renoboy.com');

              done();
          });                     
        });
      });

      it('should not return user if password is invalid', function (done) {
        var u = {
              name: {
                  first: 'nombre',
                  last:  'apellido'
              },
              nit: '12345',
              email: 'inspector@renoboy.com',
              password: 'secret',
              roles: ['admin']
        };

        User.create(u, function (err, createdUser) {
          
          User.authenticate('email@renoboy.com','nosecret', function (err, areEqual) {
              should.not.exist(err);
              areEqual.should.equal(false);
              done();
          });                     
        });
      });      
    });
});