
<template>
    <div>

        <div class="pub" v-for="item in pubs">
            <h3 class="title">{{item.csljson.title}}</h3>
            <span v-for="author in item.csljson.author">{{author.given}} {{author.family}}, </span>
            <i>{{ item.csljson['container-title'] }}</i>, {{ item.data.date }}
            <a v-if="getfields(item.data.extra).pdf" :href="getfields(item.data.extra).pdf">
                <i class="fas fa-file-pdf"></i>
            </a> 
            <a v-if="item.csljson.URL" :href="item.csljson.URL">
                <i class="fas fa-link"></i> website
            </a> 
            <a v-if="getfields(item.data.extra).github" :href="getfields(item.data.extra).github">Code</a> 
            <a :href="exportbib(item.key, 'bibtex')">
                <i class="fas fa-file-export"></i> bibtex
            </a>
            <a :href="exportbib(item.key, 'csljson')">
                <i class="fas fa-file-export"></i> json
            </a> 
            <a v-if="item.csljson.DOI" :href="'https://dx.doi.org/' + item.csljson.DOI">
                <i class="fas fa-bookmark"></i> DOI
            </a> 
            <a class="cite" v-if="item.times_cited" :href="'https://badge.dimensions.ai/details/doi/' + item.csljson.DOI">
                <i class="fas fa-quote-right"></i> dimensions cites: {{ item.times_cited }}
            </a>
            <a class="altmetric" v-if="item.altscore" :href="item.altmetricsurl">
                <i class="fas fa-quote-right"></i> altmetrics: {{ item.altscore }}
            </a>
        </div>
    </div>
</template>
<script>
const axios = require('axios')

import '@fortawesome/fontawesome-free/css/all.css'


export default {
  data () {
      return {
          pubs: [],
          api_base: "https://api.zotero.org/users"
      }
  },
  props: [
      'zotero_id',
      'filter'
  ],
  beforeMount() {
    var request_url = `${this.api_base}/${this.zotero_id}/publications/items?format=json&include=data,csljson&sort=date&limit=100&${this.filter}`
    axios.get(request_url)
    .then(response => {
        this.pubs = response.data
        this.pubs.map((pub, index) => {
	        console.log(index); // index
            console.log(pub.csljson.DOI); // value
            this.getDimension(pub.csljson.DOI, index);
            this.getAltMetrics(pub.csljson.DOI, index);
        })
    })
    .catch(error => {
        console.log(error);
    })
  },
  methods: {
    authorIsMe: function (author) {
        if (author.given === "Fabian-Robert" && author.family === "Stöter") {
            return true
        }
    },
    getAltMetrics: function (doi, index) {
        var request_url = `https://api.altmetric.com/v1/doi/${doi}`
        var pub = this.pubs[index]
        if (doi === undefined) {
            return false;
        } else {
            axios.get(request_url)
            .then(response => {
                if (response.data.score !== undefined) {
                    if (response.data.score > 0) {
                        pub.altscore = Math.ceil(response.data.score)
                        pub.altmetricsurl = response.data.details_url
                        this.$set(this.pubs, index, pub)
}
                }
            })
            .catch(error => {
                console.log(error);
            })
        }
    },
    getDimension: function (doi, index) {
        var request_url = `http://metrics-api.dimensions.ai/doi/${doi}`
        var pub = this.pubs[index]
        if (doi === undefined) {
            return false;
        } else {
            axios.get(request_url)
            .then(response => {
                if (response.data.times_cited !== undefined) {
                    if (response.data.times_cited > 0) {
                        pub.times_cited = response.data.times_cited
                        this.$set(this.pubs, index, pub)
                        console.log(index)
                    }
                }
            })
            .catch(error => {
                console.log(error);
            })
        }
    },
    exportbib: function (key, format) {
      return `${this.api_base}/${this.zotero_id}/publications/items/${key}?format=${format}`
    },
    csltype: function (type) {
        switch(type) {
            case "conferencePaper":
                return "conference"
            case "journalArticle":
                return "journal"
            case "document":
                return "dataset"
            default:
                return type
            } 
    },
    csltip: function (type) {
        switch(type) {
            case "conference":
                return "warn"
            case "journal":
                return "error"
            case "data":
                return "info"
            default:
                return "info"
            } 
    },
    getfields: function (extra) {
        // code from https://github.com/zotero/zotero/blob/cbfa4be437fbe0451795a9a865ed163fa7cc2376/chrome/content/zotero/xpcom/cite.js
        var fields = {}

        if (extra === undefined) {
            return fields;
        }
		var ex = extra.replace(/^([A-Za-z \-]+)(:\s*.+)/gm, function (_, field, value) {
            var field = field.toLowerCase().replace(/ /g, '-');
            return fields[field]= value.slice(2);
        });
        return fields;
    }
  }
}
</script>

<style lang="stylus">
.title {
    margin-bottom: 0px;
}
.csl-bib-body {
    line-height: 2; 
    padding-left: 0em!important; 
    text-indent: 0em!important;
}

.pub .altmetric {
    color: #2F90B9;
}
.pub .altmetric:hover {
    color: darken(#2F90B9, 35%);
}

.pub .cite {
    color: #f08800;
}
.pub .cite:hover {
    color: darken(#f08800, 35%);
}

.pub a {
  padding: 0.00em 0.2em;
  margin: 0 0.0em 0.1em 0;
}

</style>
