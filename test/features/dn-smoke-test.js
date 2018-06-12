"use strict";

const parse = require("date-fns/parse");
const isSameSecond = require("date-fns/is_same_second");
const isAfter = require("date-fns/is_after");
const request = require("supertest");
const superdebug = require("superdebug");
const jsonFile = require("jsonfile");
const argv = require("../check-command-line-args");
const conf = require("../test-configuration");
const {waitUntil} = require("../wait-until.js");
const assert = require("assert").strict;

const smokeTestStartTime = parse(new Date());
const environment = conf.environments[argv.environment];
const article = conf.getArticle(environment.articleEpiServerId);
const getElasticSearchUrl = conf.getElasticSearchUrl;

console.info("Starting smoke tests in '%s' environment at %s", argv.environment, smokeTestStartTime);

Feature("Index article published on Episerver", () => {

  Scenario("Index single article published to Episerver and verify that it is recompounded and available on all DN api:s", () => {
    
    Given("there is an article with id '"+article.epiServerId+"' published on Episerver", async () => {
      await waitUntil(() => request(environment.epiServer.url) //Returned value directly after =>
        .get(environment.epiServer.path.concat(environment.articleEpiServerId))
        .use(superdebug())
        .then((response) => {
          assert.equal(response.status, 200, "Failed to recieve status 200");
          const pathToJsonFile = "test/features/resources/"
            .concat(argv.environment)
            .concat("/epi.")
            .concat(environment.articleEpiServerId)
            .concat(".json");
          const expectedResponse = jsonFile.readFileSync(pathToJsonFile);
          assert.deepEqual(response.body, expectedResponse);
        })
      );
    });
    
    And("starting a single index recompound job on flow-epi-30 for article with id '"+article.flowEpi30Id+"'", async () => {
      await waitUntil(() => request(environment.flowEpi30.url)
        .post(environment.flowEpi30.path)
        .send("rawId=".concat(article.flowEpi30Id))
        .use(superdebug())
        .then((response) => {
          assert.equal(response.status, 303, "Failed to recieve status 303");
        }));
    });

    Then("fetching article with id '"+article.elasticSearchRawId+"' from ElasticSearch flow-raw index, indexed time in respone should be greater than start smoke test time", async () => {
      await waitUntil(() => request(getElasticSearchUrl(argv.environment, "raw"))
        .get(article.elasticSearchRawId)
        .use(superdebug())
        .then((response) => {
          assert.equal(response.status, 200, "Failed to recieve status 200");
          const elasticSearchRawJson = response.body;
          assert.equal(elasticSearchRawJson._id, article.elasticSearchRawId);
          const indexedTime = parse(elasticSearchRawJson._source._meta._indexed);
          assert(isAfter(indexedTime, smokeTestStartTime) || isSameSecond(smokeTestStartTime, indexedTime));
        }));
    });

    Then("when fetching article with id '"+article.elasticSearchContentId+"' from ElasticSearch content-published index, indexed time in respone should be greater than start smoke test time", async () => {
      await waitUntil(() => request(getElasticSearchUrl(argv.environment, "content"))
        .get(article.elasticSearchContentId)
        .use(superdebug())
        .then((response) => {
          assert.equal(response.status, 200, "Failed to recieve status 200");
          const elasticSearchContentJson = response.body;
          assert.equal(elasticSearchContentJson._id, article.elasticSearchContentId);
          const indexedTime = parse(elasticSearchContentJson._source.indexTime);
          assert(isAfter(indexedTime, smokeTestStartTime) || isSameSecond(smokeTestStartTime, indexedTime));
        }));
    });
      
    Then("fetching article with identifier '"+environment.articleSlug+"' from Alma api, Last-Modifier header in respone should be greater than start smoke test time", async () => {
      await waitUntil(() => request(environment.alma.url)
          .get(environment.alma.path.concat(environment.articleSlug))
          .use(superdebug())
          .then((response) => {
            assert.equal(response.status, 200, "Failed to recieve status 200");
            const almaJson = response.body;
            assert.equal(almaJson.article.id, article.elasticSearchContentId);
            const lastModified = parse(response.header["last-modified"]);
            assert(isAfter(lastModified, smokeTestStartTime) || isSameSecond(smokeTestStartTime, lastModified), "\nExpected lastModified '" + lastModified + "' to be after \nsmokeTestStartTime: '" + smokeTestStartTime + "'");
          })
      );
    });
    
    Then("fetching article with identifier '"+environment.articleSlug+"' from DN web, Last-Modifier header in respone should be greater than start smoke test time", async () => {
      await waitUntil(() => request(environment.dise.url)
        .get(environment.dise.path.concat(environment.articleSlug))
        .use(superdebug())
        .then((response) => {
          assert.equal(response.status, 200, "Failed to recieve status 200");
        }));
    });

  });
});