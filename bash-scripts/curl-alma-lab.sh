#!/bin/bash - 
set -o nounset                              # Treat unset variables as an error

curl -H 'Cache-Control: no-cache' -v http://alma.lab.internal.bonnier.news/content/nyheter/sverige/varning-for-sno-och-halka-i-hela-landet/ | grep Last-Modified


