const superagent = require('superagent');
const sleep = require('system-sleep');
const debug = require('debug')('dn-smoke-test');
const NUM_RETRIES = 2;

function requestUntilTrue(url, callback, shouldBeTrue) {
  _request(url, 1, callback, shouldBeTrue);
}

function _request(url, retriedCount, callback, shouldBeTrue) {
  superagent
    .get(url)
    .end(function(error, res) {
      if (error || !shouldBeTrue(res)) {
        if(error) {
          debug(
            "Got response code "
              .concat(error.status)
              .concat(" for url ")
              .concat(url)
              .concat(" at attempt " + retriedCount)
          ) 
        } else {
          debug("Retry condition was false and triggered retry nr " + retriedCount)
        }
        if (retriedCount >= NUM_RETRIES) {
          return callback && callback("ERROR: Condition was not fullfilled after " + (retriedCount+1) + " attempts", false);
        }
        sleep(500);
        return _request(url, retriedCount + 1, callback, shouldBeTrue);
      }
      callback("SUCCESS: Condition was fullfilled after " + (retriedCount) + " attempts", true);
  });
}

module.exports.requestUntilTrue = requestUntilTrue;