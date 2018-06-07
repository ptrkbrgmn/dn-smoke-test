TODO;
- Let Bang nodejs coders take a look
- No last-modified in response from dise?
- Parse and check naId from dise
- Add test for www.dn.se (Akamai)
- Replace retry with Norlas suggestion

# DN Smoke test
A series of HTTP requests that:  
- Checks that a specific article is available on Episerver
- Starts a single article index job (compound) on flow-epi-30
-  Fetches the article from ElasticSearch raw index and makes sure index time is after test start time
-  Fetches the article from ElasticSearch content index and makes sure index time is after test start time
-  Fetches the article from Alma API and makes sure index last-modified is after test start time
-  Fetches the article from Dagens Nyheter webpage and verifies status code 200  

Tests can be run in environments lab, latest and production.

To execute tests, run:
```sh
$ npm test -- --environment={lab | latest | production}
```  

To execute tests in debug mode for namespace dn-smoke-test, run:
```sh
$ DEBUG=dn-smoke-test npm test -- --environment={lab | latest | production}
```  
This will cause all debug statements declared in dn-smoke-test code to be executed.  

To execute tests in debug mode for supercurl namespace, from command line run:
```sh
$ DEBUG=super-curl npm test -- --environment={lab | latest | production}
```
This will cause all debug statements declared in superdebug code to be executed.
i.e give curl output of all HTTP requests.   
For more information see: https://github.com/andineck/superdebug

---

## Miscellaneous

### Docker
Build image
```sh
$ docker build -t nav-docker.repo.dex.nu/dn-smoke-test .
```  
Run tests in docker container agains lab (default)
```sh
$ docker run -t nav-docker.repo.dex.nu/dn-smoke-test
```

Run tests in docker container against latest or prod
```sh
$ docker run -t nav-docker.repo.dex.nu/dn-smoke-test -- --environment={latest | prod}
```

Run docker container in debug mode for namespaces dn-smoke-test and super-curl
```sh
$ docker run -t -e DEBUG=dn-smoke-test,super-curl nav-docker.repo.dex.nu/dn-smoke-test
```

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

### Format code in Visual Studio Code (mac)
```sh
Shift + Option + F
```

### Preview Markdown (mac)
```sh
Shift + Cmd + V
```

####
Temp text storage

"test": "DEBUG=dn-smoke-test mocha test"

  "scripts": {
    "test": "mocha --timeout 10000 test"
  },

