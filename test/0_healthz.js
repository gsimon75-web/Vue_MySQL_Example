var os = require("os");
var server   = require("../server");
var chai     = require("chai");
var should   = chai.should();

chai.use(require("chai-http"));

describe("Basic healthz tests", () => {

    it("GET /healthz should return 200 + 'ok'", (done) => {
        chai.request(server).get("/rest/healthz").end((err, res) => {
            res.should.have.status(200);
            res.text.replace(/\s/, "").should.be.eql("ok");
            done();
        });
    });


    it("GET /healthz/hostname should return 200 + the hostname", (done) => {
        chai.request(server).get("/rest/healthz/hostname").end((err, res) => {
            res.should.have.status(200);
            res.text.replace(/\s/, "").should.be.eql(os.hostname());
            done();
        });
    });

});


// vim: set ts=4 sw=4 et:
