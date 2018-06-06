## From command line run
```sh
$ npm test -- --environment=lab
```

## Curl for alma
```sh
$ curl -H 'Cache-Control: no-cache' -v http://alma.lab.internal.bonnier.news/content/nyheter/sverige/varning-for-sno-och-halka-i-hela-landet/ | grep Last-Modified
```

"test": "DEBUG=dn-smoke-test mocha test"

  "scripts": {
    "test": "mocha --timeout 10000 test"
  },