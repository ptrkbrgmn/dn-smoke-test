TODO;
- Implemente for prod environment
- Run ESLint and check for improvements
- Let Bang nodejs coders take a look

# DN Smoke test
A series of HTTP requests that:  
- Checks that a specific article is available on Episerver
- Starts a single article index job (compound) on flow-epi-30
-  Fetches the article from ElasticSearch raw index and makes sure index time is after test start time
-  Fetches the article from ElasticSearch content index and makes sure index time is after test start time
-  Fetches the article from Alma API and makes sure index last-modified is after test start time
-  Fetches the article from Dagens Nyheter webpage and makes sure index time is after test start time  

Tests can be run in environments lab, latest and production.

To execute tests, from command line run:
```sh
$ npm test -- --environment={lab | latest | production}
```

To execute tests in debug mode fp, from command line run:
```sh
$ DEBUG=dn-smoke-test npm test -- --environment=={lab | latest | production}
```

To execute tests in debug mode for dn-smoke-test namespace, from command line run:
```sh
$ DEBUG=dn-smoke-test npm test -- --environment=={lab | latest | production}
```
This will run debug statements declared in in dn-smoke-test


To execute tests in debug mode for supercurl namespace, from command line run:
```sh
$ DEBUG=super-curl npm test -- --environment={lab | latest | production}
```
This will give curl output of all HTTP requests. For more information see:  
https://github.com/andineck/superdebug

---

## Miscellaneous

### depcheck  
Check for delcared but unused dependencies  
```sh
$ depcheck
```
https://github.com/depcheck/depcheck  


### npm-clean  
Clean unused dependencies  
```sh
$ npm-clean
```
https://www.npmjs.com/package/npm-clean  

### Curl for alma
```sh
$ curl -H 'Cache-Control: no-cache' -v http://alma.lab.internal.bonnier.news/content/nyheter/sverige/varning-for-sno-och-halka-i-hela-landet/ | grep Last-Modified
```

---

####
Temp text storage

"test": "DEBUG=dn-smoke-test mocha test"

  "scripts": {
    "test": "mocha --timeout 10000 test"
  },

