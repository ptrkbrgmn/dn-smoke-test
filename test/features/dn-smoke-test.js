"use strict";
const request = require("supertest");
const jsonFile = require("jsonfile");
const assert = require('assert').strict;
const moment = require('moment-timezone');
const requestRetry = require('../request-retry');
const debug = require('debug')('dn-smoke-test');
const name = 'dn-smoke-test';
const waitUntil = require('wait-until');

//TODO: parameterize environments 

const smokeTestStartTime = moment().tz("Europe/Stockholm");
debug("SMOKETEST_START_TIME: %s", smokeTestStartTime.format());

Feature("Index article published on Episerver", () => {

  Scenario("Index single article published to Episerver and verify that it is recompounded and available on all DN api:s", () => {

    Given("there is an article with id '421368' published on Episerver", (done) => {
      request("http://cms-test.dn.se")
        .get("/api/contentnavservice/getpage/published/421368")
        .expect(200)
        .end((err, res) => {
          if (err) return done(err);
          const expectedResponse = jsonFile.readFileSync("test/features/resources/epi.421368.json");
          assert.deepEqual(res.body, expectedResponse);
          done();
        });
    });

    When("starting a single index recompound job on flow-epi-30 for article with id '421368'", (done) => {
      request("http://flow-epi-30.lab.internal.bonnier.news")
        .post("/admin/index")
        .send("rawId=epi.421368")
        .expect(303)
        .end((err, res) => {
          if (err) return done(err);
          done();
        });
    });

    Then("fetching article with id '421368' from ElasticSearch flow-raw index, indexed time in respone should be greater than start smoke test time", (done) => {
      requestRetry.requestUntilTrue("http://lab.elasticsearch-nav-content.service.elastx.consul.dex.nu:9200/flow-raw/raw/epi.421368", 
        function(aMessage) {
          debug("%s", aMessage);
        }, 
        function(res) {
          const epiRawJson = res.body;
          const indexedTime = moment.tz(epiRawJson._source._meta._indexed, "Europe/Stockholm");
          debug("ElasticSearch flow-raw/raw/epi.421368 index time: ", indexedTime.format())
          return epiRawJson._id == "epi.421368" && smokeTestStartTime.isBefore(indexedTime);
        }
      );
      done();
    });

    Then("when fetching article with id '421368' from ElasticSearch content-published index, indexed time in respone should be greater than start smoke test time", (done) => {
      requestRetry.requestUntilTrue("http://lab.elasticsearch-nav-content.service.elastx.consul.dex.nu:9200/content-published/content/dn.epi.421368", 
        function(resultMessage, conditionFulfilled) {
          debug("%s", resultMessage);
          if (conditionFulfilled) done();
          else done(new Error("Failed to retrieve article with correct indexed time from ElasticSearch content-published"));
        }, 
        function(res) {
          const epiRawJson = res.body;
          const indexedTime = moment.tz(epiRawJson._source.indexTime, "Europe/Stockholm");
          debug("ElasticSearch ontent-published/content/dn.epi.421368 index time: ", indexedTime.format())
          return epiRawJson._id == "epi.421368" && smokeTestStartTime.isBefore(indexedTime);
        }
      );
    });
  });
});

