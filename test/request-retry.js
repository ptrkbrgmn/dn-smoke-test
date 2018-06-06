const superagent = require('superagent');
const superdebug = require('superdebug');

const sleep = require('system-sleep');
const debug = require('debug')('dn-smoke-test');
const NUM_RETRIES = 25;

/**
 * callback && callback()
 * This statement says that if callback is defined and truth-y (not null, false, or 0), execute it.
 * Equal to:
 *  
 *  if(callback) {
 *    callback();
 *  }
 */

function requestUntilTrue(url, callback, shouldBeTrue) {
  _request(url, 1, callback, shouldBeTrue);
}

function _request(url, requestCount, callback, shouldBeTrue) {
  superagent
    .get(url)
    .use(superdebug())
    .end(function(error, res) {
      if (error || !shouldBeTrue(res)) {
        if(error) {
          debug(
            "Got response code "
              .concat(error.status)
              .concat(" for url ")
              .concat(url)
              .concat(" at request nr " + requestCount)
          ) 
        } else {
          debug("Condition was false and triggered request nr " + requestCount)
        }
        if (requestCount >= NUM_RETRIES) { //TODO: Maybe it was better to pass on error message?
          //See comment above
          console.error("Condition was not fullfilled after " + (requestCount+1) + " requests to %s", false, url)
          return callback && callback(false);
        }
        sleep(3000);
        return _request(url, requestCount + 1, callback, shouldBeTrue);
      }
      debug("Condition was fullfilled after " + (requestCount) + " requests to ", true, url);
      callback(true);
  });
}

module.exports.requestUntilTrue = requestUntilTrue;