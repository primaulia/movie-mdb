var app = require('../app');
var supertest = require("supertest");

describe("Express Server API", function() {
  describe("should return users json on get /users", function() {
    it("returns status code 200", function(done) {
      supertest(app)
        .get('/movies')
        .expect('Content-Type', /json/)
        .expect(200, done);
    });
  });
});
