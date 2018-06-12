"use strict";

//TODO: Exponential back-off properly. Temporarily added back-off that
//probably breaks hasTimeToRun

const RETRY_MS = 100;
const DEFAULT_MOCHA_TIMEOUT_MS = 2000;
const RUNTIME_FACTOR = 1.5;

async function waitUntil(test) {
  const endTime = getEndTime();
  const startTime = new Date().getTime();
  return new Promise((resolve, reject) => {
    doWaitUntil(test, startTime, endTime, 0, (err) => {
      return err ? reject(err) : resolve();
    });
  });
}

async function doWaitUntil(condition, startTime, endTime, timesRun, callback) {
  let lastErr;
  try {
    await condition();
    return callback();
  } catch (err) {
    lastErr = err;
  }
  if (!hasTimeToRun(startTime, endTime, timesRun)) {
    return callback(lastErr || new Error("Test never returned truthy value"));
  }
  const timeout = Math.pow(2, timesRun);
  setTimeout(() => doWaitUntil(condition, startTime, endTime, timesRun + 1, callback), timeout);
}

function getEndTime() {
  const now = new Date().getTime();
  let customTimeout;
  process.argv.forEach((arg, i) => {
    if (arg === "--timeout" || arg === "-t") {
      customTimeout = parseInt(process.argv[i + 1]);
    }
  });
  return now + parseInt(customTimeout || DEFAULT_MOCHA_TIMEOUT_MS);
}

function hasTimeToRun(startTime, endTime, timesRun) {
  const now = new Date().getTime();
  const avgRuntime = (now - startTime) / (timesRun + 1);
  return now + RETRY_MS + avgRuntime * RUNTIME_FACTOR < endTime;
}

module.exports = {waitUntil};