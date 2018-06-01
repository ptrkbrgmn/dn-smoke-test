#!/usr/bin/env bash


curl 'http://flow-epi-30.lab.internal.bonnier.news/admin/index' \
-H 'Connection: keep-alive' \
-H 'Cache-Control: max-age=0' \
-H 'Origin: http://flow-epi-30.lab.internal.bonnier.news' \
-H 'Upgrade-Insecure-Requests: 1' \
-H 'Content-Type: application/x-www-form-urlencoded' \
-H 'Accept: text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,image/apng,*/*;q=0.8' \
-H 'Referer: http://flow-epi-30.lab.internal.bonnier.news/index.html' \
-H 'Accept-Encoding: gzip, deflate' \
-H 'Accept-Language: en-GB,en-US;q=0.9,en;q=0.8,sv;q=0.7' \
--data 'rawId=epi.421368' \
--compressed \
--verbose

