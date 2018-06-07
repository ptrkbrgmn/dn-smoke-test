
const environments = {
    lab: {
        articleEpiServerId: "1395461",
        articleSlug: "/varning-for-sno-och-halka-i-hela-landet/", //TODO: What is the correct name?
        epiServer: {
            url: "http://cms-test.dn.se",
            path: "/api/contentnavservice/getpage/published/"
        },
        flowEpi30: {
            url: "http://flow-epi-30.lab.internal.bonnier.news",
            path: "/admin/index"
        },    
        elasticSearch: { 
            url: "http://lab.elasticsearch-nav-content.service.elastx.consul.dex.nu:9200",
            indeces: {
                 raw: {
                    path: "/flow-raw/raw/"
                 },
                 content: {
                    path: "/content-published/content/"
                 }
            },
        }, 
        alma: {
            url: "http://alma.lab.internal.bonnier.news",
            path: "/content/nyheter/sverige"
        },
        dise: {
            url: "http://lab.dn.se",
            path: "/nyheter/sverige"
        }
},
    latest: {
        articleEpiServerId: "1886007",
        articleSlug: "/varning-for-sno-och-halka-i-hela-landet/", //TODO: What is the correct name?
        epiServer: {
            url: "http://cms-stage.dn.se",
            path: "/api/contentnavservice/getpage/published/"
        },    
        flowEpi30: {
            url: "http://flow-epi-30.latest.internal.bonnier.news",
            path: "/admin/index"
        },    
        elasticSearch: {
            url: "http://latest.elasticsearch-nav-content.service.elastx.consul.dex.nu:9201",
            indeces: {
                raw: {
                   path: "/flow-raw/raw/"
                },
                content: {
                   path: "/content-published/content/"
                }
           }
        },    
        elasticSearchContent: {
            url: "http://latest.elasticsearch-nav-content.service.elastx.consul.dex.nu:9201",
            path: "/content-published/content/"
        },    
        alma: {
            url: "http://alma.latest.internal.bonnier.news",
            path: "/content/nyheter/sverige"
        },
        dise: {
            url: "http://latest.dn.se",
            path: "/nyheter/sverige"
        }    
    },
    prod: {
        epiServer: {
            url: "",
            path: ""
        },    
        flowEpi30: {
            url: "",
            path: "/admin/index"
        },    
        elasticSearchRaw: {
            url: "",
            path: "/flow-raw/raw/"
        },    
        elasticSearchContent: {
            url: "",
            path: "/content-published/content/"
        },    
        alma: {
            url: "",
            path: "/content/mat-dryck/recept/stureplan/"
        }    
    }
};

function getArticle(epiServerId) {
    return article = {
        epiServerId: epiServerId,
        flowEpi30Id: "epi.".concat(epiServerId),
        elasticSearchRawId: "epi.".concat(epiServerId),
        elasticSearchContentId: "dn.epi.".concat(epiServerId)
    }
}

function getElasticSearchUrl(environment, index) {
    const elasticSearch = environments[environment].elasticSearch;
    const elasticsearchUrl = elasticSearch.url;
    const elasticSearchIndexPath = elasticSearch.indeces[index].path
    return elasticSearchUrlAndPath = elasticsearchUrl.concat(elasticSearchIndexPath)
}

module.exports.environments = environments;
module.exports.getArticle = getArticle;
module.exports.getElasticSearchUrl = getElasticSearchUrl;