"use strict";

const parse = require("date-fns/parse");
const isSameSecond = require("date-fns/is_same_second");
const isAfter = require("date-fns/is_after");

const request = require("supertest");
const jsonFile = require("jsonfile");
const deepEqual = require('deep-equal')

const argv = require("../check-command-line-args")
const conf = require("../test-configuration");
const requestUntilTrue = require("../request-retry").requestUntilTrue;
const debug = require("debug")("dn-smoke-test");

const name = "dn-smoke-test";
const smokeTestStartTime = parse(new Date());
const environment = conf.environments[argv.environment];
const article = conf.getArticle(environment.articleEpiServerId);
const getElasticSearchUrl = conf.getElasticSearchUrl;

console.info("Starting smoke tests in '%s' environment at %s", argv.environment, smokeTestStartTime);

Feature("Index article published on Episerver", () => {

  Scenario("Index single article published to Episerver and verify that it is recompounded and available on all DN api:s", () => {

    Given("there is an article with id '"+article.epiServerId+"' published on Episerver", (done) => {
      const urlPathAndId = environment.epiServer.url
        .concat(environment.epiServer.path)
        .concat(environment.articleEpiServerId);
      requestUntilTrue(
        urlPathAndId, 
        function(conditionFulfilled) {
          if (conditionFulfilled) done();
          else done(new Error("Failed to retrieve article with correct JSON at: ".concat(urlPathAndId)));
        }, 
        function(res) {
          const pathToJsonFile = "test/features/resources/"
            .concat(argv.environment)
            .concat("/epi.")
            .concat(environment.articleEpiServerId)
            .concat(".json")
          const expectedResponse = jsonFile.readFileSync(pathToJsonFile);
          return deepEqual(res.body, expectedResponse);
        }
      );
    });

    //return;

    //TODO: Implement retry
    When("starting a single index recompound job on flow-epi-30 for article with id '"+article.flowEpi30Id+"'", (done) => {
      request(environment.flowEpi30.url)
        .post(environment.flowEpi30.path)
        .send("rawId=".concat(article.flowEpi30Id))
        .expect(303)
        .end((err, res) => {
          if (err) {
            console.error(err);
            return done(err);
          }  
          done();
        });
    });

    //return;

    Then("fetching article with id '"+article.elasticSearchRawId+"' from ElasticSearch flow-raw index, indexed time in respone should be greater than start smoke test time", (done) => {
      const urlPathAndId = getElasticSearchUrl(argv.environment, "raw").concat(article.elasticSearchRawId);
      requestUntilTrue(urlPathAndId, 
        function(conditionFulfilled) {
          if (conditionFulfilled) done();
          else done(new Error("Failed to retrieve article with correct indexed time from ElasticSearch raw at: "
            .concat(urlPathAndId)));
        }, 
        function(res) {
          const epiRawJson = res.body;
          const indexedTime = parse(epiRawJson._source._meta._indexed);
          debug("ElasticSearch %s index time: ", urlPathAndId, indexedTime)
          return epiRawJson._id == article.elasticSearchRawId && (isAfter(indexedTime, smokeTestStartTime) || isSameSecond(smokeTestStartTime, indexedTime));
          
        }
      );
    });

    //return;

    Then("when fetching article with id '"+article.elasticSearchContentId+"' from ElasticSearch content-published index, indexed time in respone should be greater than start smoke test time", (done) => {
      const urlPathAndId = getElasticSearchUrl(argv.environment, "content")
        .concat(article.elasticSearchContentId);
      requestUntilTrue(
        urlPathAndId, 
        function(conditionFulfilled) {
          if (conditionFulfilled) done();
          else done(new Error("Failed to retrieve article with correct indexed time from ElasticSearch content-published"));
        }, 
        function(res) {
          const epiRawJson = res.body;
          const indexedTime = parse(epiRawJson._source.indexTime);
          debug("ElasticSearch %s index time: ", urlPathAndId, indexedTime)
          return epiRawJson._id == article.elasticSearchContentId && (isAfter(indexedTime, smokeTestStartTime) || isSameSecond(smokeTestStartTime, indexedTime));
        }
      );
    });

    //return;

    When("fetching article with identifier '"+environment.articleSlug+"' from Alma api, Last-Modifier header in respone should be greater than start smoke test time", (done) => {
      const urlPathAndId = environment.alma.url
        .concat(environment.alma.path)
        .concat(environment.articleSlug)
                environment.articleSlug;    
      requestUntilTrue(
        urlPathAndId, 
        function(conditionFulfilled) {  
          if (conditionFulfilled) done();
          else done(new Error("Failed to retrieve article with correct last-modified time from Alma api"));
        }, 
        function(res) {
          const epiRawJson = res.body;
          const lastModified = parse(res.header['last-modified']);

          debug("Smoke test start time: %s", smokeTestStartTime);
          debug("Alma last-modified: %s", lastModified);
          
          return epiRawJson.article.id == article.elasticSearchContentId && (isAfter(lastModified, smokeTestStartTime) || isSameSecond(smokeTestStartTime, lastModified));
        }
      );  
    });

    //return;
    
    When("fetching article with identifier '"+environment.articleSlug+"' from DN web, Last-Modifier header in respone should be greater than start smoke test time", (done) => {
      const urlPathAndId = environment.dise.url
        .concat(environment.dise.path)
        .concat(environment.articleSlug);    
      requestUntilTrue(
        urlPathAndId, 
        function(conditionFulfilled) {  
          if (conditionFulfilled) done();
          else done(new Error("Failed to retrieve article with correct last-modified time from Dagens Nyheter web"));
        }, 
        function(res) {
          return (res.status == 200);
        }
      );  
    });
  });

});