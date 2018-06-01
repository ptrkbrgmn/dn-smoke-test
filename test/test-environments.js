
var conf = {
    lab = {
    epiServerUrl: "http://cms-test.dn.se/api/contentnavservice/getpage/published/",
    flowEpi30: "http://flow-epi-30.lab.internal.bonnier.news/admin/index",
    elasticSearchRaw: "http://lab.elasticsearch-nav-content.service.elastx.consul.dex.nu:9200/flow-raw/raw/",
    elasticSearchContent: "http://lab.elasticsearch-nav-content.service.elastx.consul.dex.nu:9200/content-published/content/",
    alma: ""
},
    latest = {
        epiServerUrl: "http://cms-stage.dn.se/api/contentnavservice/getpage/published/",
        flowEpi30: "http://flow-epi-30.latest.internal.bonnier.news/",
        elasticSearchRaw: "http://latest.elasticsearch-nav-content.service.elastx.consul.dex.nu:9201/flow-raw/raw/",
        elasticSearchContent: "http://latest.elasticsearch-nav-content.service.elastx.consul.dex.nu:9201/content-published/content/",
        alma: "http://alma.latest.internal.bonnier.news/content/mat-dryck/recept/stureplan/"
    },
    prod = {
        epiServerUrl: "",
        flowEpi30: "",
        elasticSearchRaw: "",
        elasticSearchContent: "",
        alma: ""
    }
}
