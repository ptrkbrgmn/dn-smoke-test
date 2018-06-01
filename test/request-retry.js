const superagent = require('superagent');
const sleep = require('system-sleep');
const NUM_RETRIES = 5;

function requestUntilTrue(url, callback, shouldBeTrue) {
  _request(url, 0, callback, shouldBeTrue);
}

function _request(url, retriedCount, callback, shouldBeTrue) {
  superagent
    .get(url)
    .end(function(error, res) {
      if (error || res.status == 404 || !shouldBeTrue(res)) {
        if (retriedCount >= NUM_RETRIES) {
          return callback && callback("ERROR: Condition was not fullfilled after " + (retriedCount+1) + " attempts", false);
        }
        sleep(500);
        return _request(url, retriedCount + 1, callback, shouldBeTrue);
      }
      callback("SUCCESS: Condition was fullfilled after " + (retriedCount+1) + " attempts", true);
  });
}

module.exports.requestUntilTrue = requestUntilTrue;