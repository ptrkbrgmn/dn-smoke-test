TODO;
- Let Bang nodejs coders take a look
- No last-modified in response from dise?
- Parse and check navId from dise
- Add test for www.dn.se (Akamai)

# DN Smoke test
A series of HTTP requests that:  
- Checks that a specific article is available on Episerver
- Starts a single article index job (compound) on flow-epi-30 for the same article
-  Fetches the article from ElasticSearch raw index and makes sure index time is after test start time
-  Fetches the article from ElasticSearch content index and makes sure index time is after test start time
-  Fetches the article from Alma API and makes sure index last-modified is after test start time
-  Fetches the article from Dagens Nyheter webpage and verifies status code 200  

Tests can be run in environments lab, latest and production.

### Run tests
Clone repo and run
```sh
$ npm install
```  

To execute tests, run:
```sh
$ npm test -- --environment={lab | latest | production}
```  

To execute tests in debug mode for supercurl namespace, from command line run:
```sh
$ DEBUG=super-curl npm test -- --environment={lab | latest | production}
```
This will cause all debug statements declared in superdebug code to be executed.
i.e give curl output of all HTTP requests.   
For more information see: https://github.com/andineck/superdebug

---

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

Run docker container in debug mode for namespace super-curl
```sh
$ docker run -t -e DEBUG=super-curl nav-docker.repo.dex.nu/dn-smoke-test
```

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

---

### Format code in Visual Studio Code (mac)
```sh
Shift + Option + F
```

### Preview Markdown (mac)
```sh
Shift + Cmd + V
```
