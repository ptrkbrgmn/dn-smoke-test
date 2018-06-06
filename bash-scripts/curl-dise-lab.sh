#!/bin/bash - 
set -o nounset                              # Treat unset variables as an error
#curl -H 'Cache-Control: no-cache' -v http://lab.dn.se//nyheter/sverige/varning-for-sno-och-halka-i-hela-landet/ | grep Last-Modified
curl -H 'Cache-Control: no-cache' http://lab.dn.se/nyheter/sverige/varning-for-sno-och-halka-i-hela-landet/ -v


