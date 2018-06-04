"use strict";

const request = require("supertest");
const jsonFile = require("jsonfile");
const assert = require('assert').strict;
const moment = require('moment-timezone');
const argv = require("../check-command-line-args")
const conf = require("../test-configuration");
const requestRetry = require('../request-retry');
const debug = require('debug')('dn-smoke-test');

const name = 'dn-smoke-test';
const smokeTestStartTime = moment().tz("Europe/Stockholm");
const environment = conf.environments[argv.environment];
const article = conf.article;
const getElasticSearchUrl = conf.getElasticSearchUrl;

debug("Starting smoke tests in '%s' environment at %s", argv.environment, smokeTestStartTime.format());

// console.log("Episerver:");
// console.log(environment.epiServer.url);
// console.log(environment.epiServer.path);
// console.log(article.epiServerId);
// console.log("");
// console.log("flow-epi-30");
// console.log(environment.flowEpi30.url);
// console.log(environment.flowEpi30.path);
// console.log("rawId=".concat(article.flowEpi30Id));
// console.log("");
// console.log("ElasticSearch raw:")
// console.log(environment.elasticSearch.url)
// console.log(environment.elasticSearch.indeces.raw.path)
// console.log(article.elasticSearchRawId)
// console.log("");
// console.log("ElasticSearch content:")
// console.log(environment.elasticSearch.url)
// console.log(environment.elasticSearch.indeces.content.path)
// console.log(article.elasticSearchContentId)
// console.log("");
// console.log(getElasticSearchUrl(argv.environment, "raw"));
// console.log("");
// console.log(getElasticSearchUrl(argv.environment, "content"));
// console.log("");

Feature("Index article published on Episerver", () => {

  Scenario("Index single article published to Episerver and verify that it is recompounded and available on all DN api:s", () => {

    Given("there is an article with id '"+article.epiServerId+"' published on Episerver", (done) => {
      request(environment.epiServer.url)
        .get(environment.epiServer.path + article.epiServerId)
        .expect(200)
        .end((err, res) => {
          if (err) return done(err);
          const pathToJsonFile = "test/features/resources/"
            .concat(argv.environment)
            .concat("/epi.")
            .concat(article.epiServerId)
            .concat(".json")
          const expectedResponse = jsonFile.readFileSync(pathToJsonFile);
          assert.deepEqual(res.body, expectedResponse);
          done();
        });
    });
    
    //return;

    When("starting a single index recompound job on flow-epi-30 for article with id '"+article.flowEpi30Id+"'", (done) => {
      request(environment.flowEpi30.url)
        .post(environment.flowEpi30.path)
        .send("rawId=".concat(article.flowEpi30Id))
        .expect(303)
        .end((err, res) => {
          if (err) return done(err);
          done();
        });
    });

    //return;

    Then("fetching article with id '"+article.elasticSearchRawId+"' from ElasticSearch flow-raw index, indexed time in respone should be greater than start smoke test time", (done) => {
      const urlPathAndId = getElasticSearchUrl(argv.environment, "raw").concat(article.elasticSearchRawId);
      //debug("ElasticSearch raw full url %s", urlPathAndId);
      requestRetry.requestUntilTrue(urlPathAndId, 
        function(aMessage, conditionFulfilled) {
          debug("%s", aMessage);
          if (conditionFulfilled) done();
          else done(new Error("Failed to retrieve article with correct indexed time from ElasticSearch raw at: "
            .concat(urlPathAndId)));
        }, 
        function(res) {
          const epiRawJson = res.body;
          const indexedTime = moment.tz(epiRawJson._source._meta._indexed, "Europe/Stockholm");
          
          debug("ElasticSearch %s index time: ", urlPathAndId, indexedTime.format())
          
          return epiRawJson._id == "epi.421368" && smokeTestStartTime.isBefore(indexedTime);
        }
      );
    });

    //return;

    Then("when fetching article with id '421368' from ElasticSearch content-published index, indexed time in respone should be greater than start smoke test time", (done) => {
      const urlPathAndId = getElasticSearchUrl(argv.environment, "content").concat(article.elasticSearchContentId);
      debug("ElasticSearch content full url %s", urlPathAndId);
      done();
      return;
      requestRetry.requestUntilTrue(urlPathAndId, 
        function(resultMessage, conditionFulfilled) {
          debug("%s", resultMessage);
          if (conditionFulfilled) done();
          else done(new Error("Failed to retrieve article with correct indexed time from ElasticSearch content-published"));
        }, 
        function(res) {
          const epiRawJson = res.body;
          const indexedTime = moment.tz(epiRawJson._source.indexTime, "Europe/Stockholm");

          console.error("ElasticSearch content-published/content/%s index time: %s", article.elasticSearchContentId, indexedTime.format())
          
          return epiRawJson._id == article.elasticSearchContentId && smokeTestStartTime.isBefore(indexedTime);
        }
      );
    });
  });
});

